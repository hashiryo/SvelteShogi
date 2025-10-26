import type { KifMetadata, KifuNode } from "@/types/shogi";

/**
 * 棋譜全体の一意性を判定するハッシュを生成（ブラウザ環境対応）
 */
export async function generateGameHash(
  nodes: KifuNode[],
  root: number,
  metadata: KifMetadata | null
): Promise<string> {
  let moves = [];
  let cur = root;
  while (cur !== -1) {
    moves.push(nodes[cur].move);
    cur = nodes[cur].next;
  }
  const gameSignature = {
    moves: moves,
    startTime: metadata?.startTime,
    endTime: metadata?.endTime,
    players: [metadata?.blackPlayer, metadata?.whitePlayer].sort(), // 順序に依存しない
    result: metadata?.result,
  };

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(gameSignature));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
