

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { parseKif } from '@/domain/format-parcer';
import { moveToNextGridCaptures } from '@/domain/move';
import { sfenxToShogiBoard, shogiBoardToSfenx, flipSfenx, flipMove } from '@/domain/sfenx';
import type { KifMetadata } from '@/types/shogi';
import type { Database } from '@/lib/supabase/types';

// Load .env file
function loadEnv() {
  const files = ['.env', '.env.local'];
  for (const file of files) {
    try {
      const envPath = path.resolve(process.cwd(), file);
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
          const match = line.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, '');
            process.env[key] = value;
          }
        }
      }
    } catch (e) {
      console.warn(`Failed to load ${file}`, e);
    }
  }
}

loadEnv();

// Types
interface MoveStatisticsRecord {
  sfenx: string;
  move: string;
  win: boolean;
  lose: boolean;
  timeout: boolean;
}

// Supabase Client
function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set.");
  }

  return createClient<Database>(url, key);
}

// Hash Generation
function generateGameHash(moves: string[], metadata: KifMetadata): string {
  const players = [metadata.blackPlayer || "", metadata.whitePlayer || ""].sort();
  
  // Construct object with sorted keys to match Python's json.dumps(sort_keys=True)
  // Keys: endTime, moves, players, result, startTime
  const gameSignature = {
    endTime: metadata.endTime,
    moves: moves,
    players: players,
    result: metadata.result,
    startTime: metadata.startTime,
  };

  // Custom stringify to match Python's default separators (', ', ': ')
  // Python: json.dumps(obj, ensure_ascii=False, sort_keys=True)
  
  function pythonJsonDump(obj: any): string {
    if (obj === null) return 'null';
    if (typeof obj === 'boolean') return obj ? 'true' : 'false';
    if (typeof obj === 'number') return obj.toString();
    if (typeof obj === 'string') return JSON.stringify(obj);
    
    if (Array.isArray(obj)) {
      const items = obj.map(pythonJsonDump);
      return `[${items.join(', ')}]`;
    }
    
    if (typeof obj === 'object') {
      const keys = Object.keys(obj).sort();
      const items = keys.map(key => {
        return `${JSON.stringify(key)}: ${pythonJsonDump(obj[key])}`;
      });
      return `{${items.join(', ')}}`;
    }
    
    return '';
  }

  const jsonString = pythonJsonDump(gameSignature);
  return createHash('sha256').update(jsonString).digest('hex');
}

// Upload Logic
async function uploadGame(
  client: ReturnType<typeof createClient<Database>>,
  moves: string[],
  metadata: KifMetadata,
  userId?: string,
  skipDuplicateCheck: boolean = false
): Promise<boolean> {
  const gameHash = generateGameHash(moves, metadata);

  // Duplicate Check
  if (!skipDuplicateCheck) {
    let query = client.from("game_records").select("id").eq("game_hash", gameHash);
    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      query = query.is("user_id", null);
    }
    const { data, error } = await query;
    
    if (error) {
      console.error(`  Error checking duplicates: ${error.message}`);
      return false;
    }

    if (data && data.length > 0) {
      console.log("  Skip: Duplicate game record already exists");
      return false;
    }
  }

  // Replay game to generate statistics
  // Initial state
  let sfenx = "lnsgkgsnl1b5r1ppppppppp999PPPPPPPPP1R5B1LNSGKGSNL aaaaaaaa";
  let { grid, capturedSente, capturedGote } = sfenxToShogiBoard(sfenx);
  let isSenteTurn = true;

  const statisticsRecords: MoveStatisticsRecord[] = [];
  
  // Determine winner
  let winnerIsSente: boolean | null = null;
  if (moves.length > 0 && moves[moves.length - 1] === "resign") {
    winnerIsSente = moves.length % 2 === 0;
  }

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const prevSfenx = sfenx;

    // Apply move
    if (["resign", "timeout", "interrupt", "repetition", "sennichite", "foul"].includes(move)) {
       isSenteTurn = !isSenteTurn;
       continue;
    }

    // Update board
    try {
      const result = moveToNextGridCaptures(
        grid,
        isSenteTurn ? capturedSente : capturedGote,
        isSenteTurn,
        move
      );
      grid = result.grid;
      if (isSenteTurn) capturedSente = result.captures;
      else capturedGote = result.captures;
      
      sfenx = shogiBoardToSfenx(grid, capturedSente, capturedGote);
    } catch (e) {
      console.error(`  Error applying move ${move}:`, e);
      return false;
    }

    // Record statistics
    let statSfenx = prevSfenx;
    let statMove = move;

    if (isSenteTurn) {
      statSfenx = flipSfenx(statSfenx);
      statMove = flipMove(move);
    }

    let win = false;
    let lose = false;
    if (winnerIsSente !== null) {
      win = isSenteTurn === winnerIsSente;
      lose = !win;
    }

    statisticsRecords.push({
      sfenx: statSfenx,
      move: statMove,
      win,
      lose,
      timeout: false, // TODO: Handle timeout if needed
    });

    isSenteTurn = !isSenteTurn;
  }

  if (statisticsRecords.length === 0) {
    console.log("  Skip: No statistics data");
    return false;
  }

  // Bulk Insert Statistics
  const statsData = statisticsRecords.map(r => ({
    sfenx: r.sfenx,
    move: r.move,
    win: r.win,
    lose: r.lose,
    timeout: r.timeout,
    user_id: userId || null,
  }));

  const { error: statsError } = await client.from("shogi_moves_statistics").insert(statsData);
  if (statsError) {
    console.error(`  Error uploading statistics: ${statsError.message}`);
    return false;
  }

  // Insert Game Record
  const gameRecord = {
    game_hash: gameHash,
    start_time: metadata.startTime ?? null,
    end_time: metadata.endTime ?? null,
    black_player: metadata.blackPlayer ?? null,
    white_player: metadata.whitePlayer ?? null,
    event: metadata.event ?? null,
    handicap: metadata.handicap ?? null,
    result: metadata.result ?? null,
    move_count: statisticsRecords.length,
    recorded_at: new Date().toISOString(),
    user_id: userId || null,
  };

  const { error: gameError } = await client.from("game_records").insert(gameRecord);
  if (gameError) {
    console.error(`  Error uploading game record: ${gameError.message}`);
    return false;
  }

  console.log(`  Upload complete: ${statisticsRecords.length} moves`);
  return true;
}

// Main
async function main() {
  const args = process.argv.slice(2);
  let targetPath = 'kifu';
  let userId = process.env.UPLOAD_USER_ID;
  let skipDuplicateCheck = false;
  let dryRun = false;

  // Simple arg parsing
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--user-id') {
      userId = args[++i];
    } else if (arg === '--skip-duplicate-check') {
      skipDuplicateCheck = true;
    } else if (arg === '--dry-run') {
      dryRun = true;
    } else if (!arg.startsWith('--')) {
      targetPath = arg;
    }
  }

  if (!path.isAbsolute(targetPath)) {
    targetPath = path.resolve(process.cwd(), targetPath);
  }

  if (!fs.existsSync(targetPath)) {
    console.error(`Error: Path does not exist: ${targetPath}`);
    process.exit(1);
  }

  const kifFiles: string[] = [];
  if (fs.statSync(targetPath).isFile()) {
    kifFiles.push(targetPath);
  } else {
    const files = fs.readdirSync(targetPath).filter(f => f.endsWith('.kif'));
    files.sort();
    files.forEach(f => kifFiles.push(path.join(targetPath, f)));
  }

  if (kifFiles.length === 0) {
    console.error(`No KIF files found in: ${targetPath}`);
    process.exit(1);
  }

  console.log(`Target files: ${kifFiles.length}`);
  console.log(`User ID: ${userId || '(Anonymous)'}`);
  console.log(`Duplicate Check: ${skipDuplicateCheck ? 'Skip' : 'Enable'}`);
  console.log(`Dry Run: ${dryRun ? 'Yes' : 'No'}`);
  console.log();

  let client;
  if (!dryRun) {
    try {
      client = getSupabaseClient();
    } catch (e: any) {
      console.error(`Error: ${e.message}`);
      process.exit(1);
    }
  }

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const file of kifFiles) {
    console.log(`Processing: ${path.basename(file)}`);
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const { metadata, moves } = parseKif(content);

      if (dryRun) {
        console.log(`  Parse success: ${moves.length} moves`);
        console.log(`  Black: ${metadata.blackPlayer}`);
        console.log(`  White: ${metadata.whitePlayer}`);
        console.log(`  Result: ${metadata.result}`);
        successCount++;
      } else {
        if (client) {
          const success = await uploadGame(client, moves, metadata, userId, skipDuplicateCheck);
          if (success) successCount++;
          else skipCount++;
        }
      }
    } catch (e) {
      console.error(`  Error:`, e);
      errorCount++;
    }
  }

  console.log();
  console.log(`Complete: Success=${successCount}, Skip=${skipCount}, Error=${errorCount}`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

