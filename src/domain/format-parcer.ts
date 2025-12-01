// http://kakinoki.o.oo7.jp/kif_format.html
import type { KifMetadata } from "@/types/shogi";

function zenkakuToNumber(char: string) {
  switch (char) {
    case "１":
      return 1;
    case "２":
      return 2;
    case "３":
      return 3;
    case "４":
      return 4;
    case "５":
      return 5;
    case "６":
      return 6;
    case "７":
      return 7;
    case "８":
      return 8;
    case "９":
      return 9;
    default:
      throw new Error(`不正な数字: ${char}`);
  }
}

function kanjiToABC(char: string) {
  switch (char) {
    case "一":
      return "a";
    case "二":
      return "b";
    case "三":
      return "c";
    case "四":
      return "d";
    case "五":
      return "e";
    case "六":
      return "f";
    case "七":
      return "g";
    case "八":
      return "h";
    case "九":
      return "i";
    default:
      throw new Error(`不正な文字: ${char}`);
  }
}

function pieceKanjiToAlphabet(char: string) {
  switch (char) {
    case "歩":
      return "P";
    case "香":
      return "L";
    case "桂":
      return "N";
    case "銀":
      return "S";
    case "角":
      return "B";
    case "飛":
      return "R";
    case "玉":
      return "K";
    case "金":
      return "G";
    default:
      throw new Error(`不正な文字: ${char}`);
  }
}
/**
 * CSA形式の駒記号をアルファベットに変換
 */
function csaPieceToAlphabet(piece: string): string {
  switch (piece) {
    case "FU": return "P";  // 歩
    case "KY": return "L";  // 香
    case "KE": return "N";  // 桂
    case "GI": return "S";  // 銀
    case "KI": return "G";  // 金
    case "KA": return "B";  // 角
    case "HI": return "R";  // 飛
    case "OU": return "K";  // 玉/王
    case "TO": return "+P"; // と
    case "NY": return "+L"; // 成香
    case "NK": return "+N"; // 成桂
    case "NG": return "+S"; // 成銀
    case "UM": return "+B"; // 馬
    case "RY": return "+R"; // 龍
    default:
      throw new Error(`不明なCSA駒記号: ${piece}`);
  }
}

/**
 * CSA形式の座標を内部形式に変換
 * CSA: 11-99 (列行, 1-9)
 * 内部: 1a-9i (列+行a-i)
 */
function csaPositionToInternal(col: string, row: string): string {
  // 行を数字からa-iに変換
  const rowChar = String.fromCharCode(96 + parseInt(row)); // 1→a, 2→b, ...
  return `${col}${rowChar}`;
}

/**
 * CSA形式の文字列をパースする
 * 
 * CSA形式の例:
 * N+先手の名前
 * N-後手の名前
 * +2726FU     // 先手: 27→26に歩を移動
 * -8384FU     // 後手: 83→84に歩を移動
 * +0076FU     // 先手: 76に歩を打つ(00は持ち駒から)
 * %TORYO      // 投了
 */
export function parseCsa(csaContent: string): {
  metadata: KifMetadata;
  moves: string[];
} {
  console.log("=== CSAパース開始 ===");
  const lines = csaContent.split("\n").map((line) => line.trim());
  console.log(`総行数: ${lines.length}`);

  const metadata: KifMetadata = {};
  const moves: string[] = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    if (!line) continue;

    try {
      // メタデータの解析
      if (line.startsWith("'")) {
        // コメント行（棋戦名など）
        const comment = line.substring(1).trim();
        if (!metadata.event && comment) {
          metadata.event = comment;
          console.log(`メタデータ: 棋戦 = ${metadata.event}`);
        }
      } else if (line.startsWith("N+")) {
        // 先手の名前
        metadata.blackPlayer = line.substring(2).trim();
        console.log(`メタデータ: 先手 = ${metadata.blackPlayer}`);
      } else if (line.startsWith("N-")) {
        // 後手の名前
        metadata.whitePlayer = line.substring(2).trim();
        console.log(`メタデータ: 後手 = ${metadata.whitePlayer}`);
      } else if (line.startsWith("$EVENT:")) {
        metadata.event = line.substring(7).trim();
        console.log(`メタデータ: 棋戦 = ${metadata.event}`);
      } else if (line.startsWith("$START_TIME:")) {
        metadata.startTime = line.substring(12).trim();
        console.log(`メタデータ: 開始日時 = ${metadata.startTime}`);
      } else if (line.startsWith("$END_TIME:")) {
        metadata.endTime = line.substring(10).trim();
        console.log(`メタデータ: 終了日時 = ${metadata.endTime}`);
      } else if (line.startsWith("+") || line.startsWith("-")) {
        // 指し手の解析
        const turn = line[0]; // + or -
        const moveStr = line.substring(1);

        console.log(`[行 ${lineIndex + 1}] パース中: "${line}"`);

        // 6文字の指し手 (例: 2726FU, 0076FU)
        if (moveStr.length === 6) {
          const fromCol = moveStr[0];
          const fromRow = moveStr[1];
          const toCol = moveStr[2];
          const toRow = moveStr[3];
          const piece = moveStr.substring(4, 6);

          if (fromCol === "0" && fromRow === "0") {
            // 持ち駒から打つ
            const pieceChar = csaPieceToAlphabet(piece);
            const to = csaPositionToInternal(toCol, toRow);
            // 成り駒は打てないので、+を除去
            const basePiece = pieceChar.replace("+", "");
            const move = `${basePiece}*${to}`;
            console.log(`  → 打: ${move}`);
            moves.push(move);
          } else {
            // 盤上の駒を移動
            const from = csaPositionToInternal(fromCol, fromRow);
            const to = csaPositionToInternal(toCol, toRow);
            
            // 成りの判定: 移動後の駒が成り駒かチェック
            const isPromoted = piece.startsWith("T") || 
                             piece === "NY" || 
                             piece === "NK" || 
                             piece === "NG" || 
                             piece === "UM" || 
                             piece === "RY";
            
            let move = `${from}${to}`;
            if (isPromoted) {
              move += "+";
            }
            console.log(`  → 移動: ${move}`);
            moves.push(move);
          }
        }
      } else if (line.startsWith("%")) {
        // 特殊な指示（投了、中断など）
        const command = line.substring(1).trim();
        console.log(`特別な手を検出: ${command}`);
        
        switch (command) {
          case "TORYO":     // 投了
            moves.push("resign");
            metadata.result = "投了";
            break;
          case "CHUDAN":    // 中断
            moves.push("interrupt");
            metadata.result = "中断";
            break;
          case "SENNICHITE": // 千日手
            moves.push("sennichite");
            metadata.result = "千日手";
            break;
          case "TIME_UP":   // 時間切れ
          case "TIMEOUT":
            moves.push("timeout");
            metadata.result = "切れ負け";
            break;
          case "ILLEGAL_MOVE": // 反則
            moves.push("foul");
            metadata.result = "反則負け";
            break;
          case "JISHOGI":   // 持将棋
            moves.push("repetition");
            metadata.result = "持将棋";
            break;
          case "KACHI":     // 勝ち宣言
            metadata.result = "勝ち宣言";
            break;
          case "HIKIWAKE":  // 引き分け
            metadata.result = "引き分け";
            break;
          case "TSUMI":     // 詰み
            moves.push("resign");
            metadata.result = "詰み";
            break;
        }
      } else if (line.startsWith("P") || line.startsWith("PI")) {
        // 初期配置や現在の局面（スキップ）
        continue;
      } else if (line === "+" || line === "-") {
        // 手番のみの行（スキップ）
        continue;
      }
    } catch (error) {
      console.error(`❌ エラー発生 (行 ${lineIndex + 1}):`, error);
      console.error(`問題の行: "${line}"`);
      throw new Error(
        `CSA棋譜パースエラー (行 ${lineIndex + 1}): ${error instanceof Error ? error.message : "不明なエラー"}\n問題の行: "${line}"`
      );
    }
  }

  console.log(`=== CSAパース完了 ===`);
  console.log(`メタデータ:`, metadata);
  console.log(`手数: ${moves.length}`);

  return { metadata, moves };
}

/**
 * KIF形式の文字列をパースする
 */
export function parseKif(kifContent: string): {
  metadata: KifMetadata;
  moves: string[];
} {
  console.log("=== KIFパース開始 ===");
  const lines = kifContent.split("\n").map((line) => line.trim());
  console.log(`総行数: ${lines.length}`);

  const metadata: KifMetadata = {};
  const moves: string[] = [];

  let isMovesSection = false;
  let prevPosition = "";

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    if (!line) continue;

    try {
      // メタデータの解析
      if (line.startsWith("開始日時：")) {
        metadata.startTime = line.replace("開始日時：", "");
        console.log(`メタデータ: 開始日時 = ${metadata.startTime}`);
      } else if (line.startsWith("終了日時：")) {
        metadata.endTime = line.replace("終了日時：", "");
        console.log(`メタデータ: 終了日時 = ${metadata.endTime}`);
      } else if (line.startsWith("棋戦：")) {
        metadata.event = line.replace("棋戦：", "");
        console.log(`メタデータ: 棋戦 = ${metadata.event}`);
      } else if (line.startsWith("手合割：")) {
        metadata.handicap = line.replace("手合割：", "");
        console.log(`メタデータ: 手合割 = ${metadata.handicap}`);
      } else if (line.startsWith("先手：")) {
        metadata.blackPlayer = line.replace("先手：", "");
        console.log(`メタデータ: 先手 = ${metadata.blackPlayer}`);
      } else if (line.startsWith("後手：")) {
        metadata.whitePlayer = line.replace("後手：", "");
        console.log(`メタデータ: 後手 = ${metadata.whitePlayer}`);
      } else if (
        line.includes("手数----指手---------消費時間--") ||
        line.includes("手数----指手---------")
      ) {
        isMovesSection = true;
        console.log(`指し手セクション開始 (行 ${lineIndex + 1})`);
        continue;
      }

      // 指し手の解析
      if (isMovesSection) {
        // コメント行をスキップ（*で始まる行）
        if (line.startsWith("*")) {
          console.log(`[行 ${lineIndex + 1}] コメント行をスキップ: "${line}"`);
          continue;
        }

        if (line.includes("まで") && line.includes("手で")) {
          // 結果行
          metadata.result = line;
          console.log(`結果: ${line}`);
          break;
        }

        console.log(`[行 ${lineIndex + 1}] パース中: "${line}"`);

        // 指し手行の解析
        // 特別な手（投了など）のチェック
        const specialMoveMatch = line.match(
          /^(\d+)\s+(投了|中断|持将棋|千日手|切れ負け|反則負け|詰み)/
        );
        if (specialMoveMatch) {
          const [, kifDataMoveNumberStr, kifDataMoveDisplay] = specialMoveMatch;
          const display = kifDataMoveDisplay.trim();
          console.log(`特別な手を検出: ${display}`);
          switch (display) {
            case "投了":
            case "詰み": // 詰みは投了と同一視
              moves.push("resign");
              break;
            case "中断":
              moves.push("interrupt");
              break;
            case "持将棋":
              moves.push("repetition");
              break;
            case "千日手":
              moves.push("sennichite");
              break;
            case "切れ負け":
              moves.push("timeout");
              break;
            case "反則負け":
              moves.push("foul");
              break;
          }
        } else {
          let display = "";
          const kifDataMoveMatch = line.match(
            /^(\d+)\s+(.+?)\s+\(\s*(.+?)\s*\)/
          );
          if (kifDataMoveMatch) {
            const [, , kifDataMoveDisplay] = kifDataMoveMatch;
            display = kifDataMoveDisplay.trim();
          } else {
            // より単純なパターンもチェック（時間なし）
            const simpleMoveMatch = line.match(/^(\d+)\s+(.+?)(?:\s+|$)/);
            if (simpleMoveMatch) {
              const [, , kifDataMoveDisplay] = simpleMoveMatch;
              display = kifDataMoveDisplay.trim();
            }
          }
          if (display !== "") {
            console.log(`  指し手表記: "${display}"`);
            const positionMatch = display.match(
              /([１２３４５６７８９])([一二三四五六七八九])|同(　?)/
            );
            // 駒の種類を抽出
            const pieceMatch = display.match(
              /(玉|飛|龍|竜|角|馬|金|銀|成銀|全|桂|成桂|圭|香|成香|杏|歩|と)/
            );
            // 移動元座標を抽出
            const fromMatch = display.match(/\(([1-9])([1-9])\)/);
            // 装飾子を抽出
            const decorationMatch = display.match(/(打|成)/);

            if (!positionMatch) {
              throw new Error(`不正な指し手: ${display}`);
            }
            let to = "";
            if (positionMatch[1] && positionMatch[2]) {
              // 通常の座標
              const toCol = positionMatch[1];
              const toRow = positionMatch[2];
              to = `${zenkakuToNumber(toCol)}${kanjiToABC(toRow)}`;
            } else if (positionMatch[3] !== undefined) {
              // "同"の場合
              to = prevPosition;
            }
            prevPosition = to;
            if (fromMatch && positionMatch) {
              // grid 上の移動
              const [, fromCol, fromRow] = fromMatch;
              // row は a~i に変換
              const adjustFromRow = String.fromCharCode(96 + parseInt(fromRow));
              const from = `${fromCol}${adjustFromRow}`;
              let move = `${from}${to}`;
              if (decorationMatch && decorationMatch[1] === "成") {
                move += "+";
              }
              console.log(`  → 移動: ${move}`);
              moves.push(move);
            } else if (
              decorationMatch &&
              decorationMatch[1] === "打" &&
              pieceMatch
            ) {
              const move = `${pieceKanjiToAlphabet(pieceMatch[1])}*${to}`;
              console.log(`  → 打: ${move}`);
              moves.push(move);
            } else {
              throw new Error(`不正な指し手: ${display}`);
            }
          }
        }
      }
    } catch (error) {
      console.error(`❌ エラー発生 (行 ${lineIndex + 1}):`, error);
      console.error(`問題の行: "${line}"`);
      throw new Error(
        `棋譜パースエラー (行 ${lineIndex + 1}): ${error instanceof Error ? error.message : "不明なエラー"}\n問題の行: "${line}"`
      );
    }
  }

  console.log(`=== パース完了 ===`);
  console.log(`メタデータ:`, metadata);
  console.log(`手数: ${moves.length}`);

  return { metadata, moves };
}


export function readFileAsText(
  file: File,
  encoding: string = "UTF-8"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("ファイルの読み込みに失敗しました"));
      }
    };

    reader.onerror = () => {
      reject(new Error("ファイルの読み込み中にエラーが発生しました"));
    };

    reader.readAsText(file, encoding);
  });
}
