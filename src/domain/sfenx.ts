import type { Captures, PieceType, Position, PlayerPiece } from "@/types/shogi";

// | 駒   | 成り前 | 成り後 | 新記号       |
// | --- | --- | --- | ------------ |
// | 歩   | P/p | と   | T/t          |
// | 香   | L/l | 成香  | V/v          |
// | 桂   | N/n | 成桂  | U/u          |
// | 銀   | S/s | 成銀  | M/m          |
// | 角   | B/b | 馬   | H/h (Horse)  |
// | 飛   | R/r | 竜   | D/d (Dragon) |

export const pieceTypeToCharMap: Record<PieceType, string> = {
  歩: "P",
  香: "L",
  桂: "N",
  銀: "S",
  金: "G",
  角: "B",
  飛: "R",
  玉: "K",
  と: "T",
  杏: "V",
  圭: "U",
  全: "M",
  馬: "H",
  竜: "D",
};

export const charToPieceTypeMap: Record<string, PieceType> = {
  P: "歩",
  L: "香",
  N: "桂",
  S: "銀",
  G: "金",
  B: "角",
  R: "飛",
  K: "玉",
  T: "と",
  V: "杏",
  U: "圭",
  M: "全",
  H: "馬",
  D: "竜",
};

function charToSquare(char: string): PlayerPiece {
  const charU = char.toUpperCase();
  return {
    piece: charToPieceTypeMap[charU],
    isSente: char === charU,
  };
}

function strToGrid(gridString: string): (PlayerPiece | null)[] {
  const grid: (PlayerPiece | null)[] = Array(81).fill(null);
  let index = 0;
  for (const char of gridString) {
    if (char >= "1" && char <= "9") {
      index += parseInt(char, 10); // 数字分スキップ
    } else {
      grid[index] = charToSquare(char);
      index++;
    }
  }
  return grid;
}

function strToCapturedPieces(capturedPiecesString: string): Captures {
  let capturedPieces: Captures = [];
  {
    const num = capturedPiecesString.charCodeAt(0) - "a".charCodeAt(0);
    if (num > 0) {
      capturedPieces.push({
        piece: "歩",
        num,
      });
    }
  }
  const lk_num = capturedPiecesString.charCodeAt(1) - "a".charCodeAt(0);
  {
    const num = lk_num % 5;
    if (num > 0) {
      capturedPieces.push({
        piece: "香",
        num,
      });
    }
  }
  {
    const num = Math.floor(lk_num / 5);
    if (num > 0) {
      capturedPieces.push({
        piece: "桂",
        num,
      });
    }
  }
  const sg_num = capturedPiecesString.charCodeAt(2) - "a".charCodeAt(0);
  {
    const num = sg_num % 5;
    if (num > 0) {
      capturedPieces.push({
        piece: "銀",
        num,
      });
    }
  }
  {
    const num = Math.floor(sg_num / 5);
    if (num > 0) {
      capturedPieces.push({
        piece: "金",
        num,
      });
    }
  }
  const br_num = capturedPiecesString.charCodeAt(3) - "a".charCodeAt(0);
  {
    const num = br_num % 5;
    if (num > 0) {
      capturedPieces.push({
        piece: "角",
        num,
      });
    }
  }
  {
    const num = Math.floor(br_num / 5);
    if (num > 0) {
      capturedPieces.push({
        piece: "飛",
        num,
      });
    }
  }
  return capturedPieces;
}

export function sfenxToShogiBoard(sfenx: string): {
  grid: (PlayerPiece | null)[];
  capturedSente: Captures;
  capturedGote: Captures;
} {
  // SFEN形式の文字列を分解
  const match = sfenx.match(/^([a-zA-Z0-9]*) ([a-z]{8})$/);
  if (!match) throw new Error(`Invalid sfenx: ${sfenx}`);
  const [, gridString, capString] = match;
  const grid = strToGrid(gridString);
  const capturedSente = strToCapturedPieces(capString.slice(0, 4));
  const capturedGote = strToCapturedPieces(capString.slice(4, 8));
  return { grid, capturedSente, capturedGote };
}

function squareToChar(square: PlayerPiece): string {
  const ret = pieceTypeToCharMap[square.piece];
  return square.isSente ? ret : ret.toLowerCase();
}

function gridToStr(grid: (PlayerPiece | null)[]): string {
  let ret = "";
  for (let y = 0; y < 9; y++) {
    let emptyCount = 0;
    for (let x = 0; x < 9; x++) {
      const square = grid[x + y * 9];
      if (square) {
        if (emptyCount > 0) {
          ret += emptyCount;
          emptyCount = 0;
        }
        ret += squareToChar(square);
      } else {
        emptyCount++;
      }
    }
    if (emptyCount > 0) {
      ret += emptyCount;
    }
  }
  return ret;
}

function capturedPiecesToStr(capturedPieces: Captures): string {
  let nums: number[] = [
    "a".charCodeAt(0),
    "a".charCodeAt(0),
    "a".charCodeAt(0),
    "a".charCodeAt(0),
  ];
  for (const { piece, num } of capturedPieces) {
    switch (piece) {
      case "歩":
        nums[0] += num;
        break;
      case "香":
        nums[1] += num;
        break;
      case "桂":
        nums[1] += num * 5;
        break;
      case "銀":
        nums[2] += num;
        break;
      case "金":
        nums[2] += num * 5;
        break;
      case "角":
        nums[3] += num;
        break;
      case "飛":
        nums[3] += num * 5;
        break;
    }
  }
  return String.fromCharCode(...nums);
}

export function shogiBoardToSfenx(
  grid: (PlayerPiece | null)[],
  capturedSente: Captures,
  capturedGote: Captures
): string {
  const gridString = gridToStr(grid);
  const capturedPiecesString =
    capturedPiecesToStr(capturedSente) + capturedPiecesToStr(capturedGote);
  return `${gridString} ${capturedPiecesString}`;
}

export function strToPosition(posString: string): Position {
  const match = posString.match(/^(\d)([a-i])$/);
  if (!match) throw new Error(`Invalid position string: ${posString}`);
  const [, colString, rowString] = match;
  return {
    col: parseInt(colString) - 1,
    row: rowString.charCodeAt(0) - "a".charCodeAt(0),
  };
}

export function positionToStr(pos: Position): string {
  return `${pos.col + 1}${String.fromCharCode("a".charCodeAt(0) + pos.row)}`;
}

export function flipSfenx(sfenx: string): string {
  const match = sfenx.match(/^([a-zA-Z0-9]*) ([a-z]{8})$/);
  if (!match) throw new Error(`Invalid sfenx: ${sfenx}`);
  const [, grid, cap] = match;
  const newGrid = grid
    .split("")
    .reverse()
    .map((ch) => {
      if (/[a-z]/.test(ch)) {
        return ch.toUpperCase();
      } else if (/[A-Z]/.test(ch)) {
        return ch.toLowerCase();
      } else {
        return ch;
      }
    })
    .join("");
  const newCap = cap.slice(4) + cap.slice(0, 4);
  return `${newGrid} ${newCap}`;
}

export function flipMove(move: string): string {
  if (move === "resign" || move === "timeout") {
    return move;
  }

  function transformLetter(ch: string): string {
    return String.fromCharCode(
      "i".charCodeAt(0) - (ch.charCodeAt(0) - "a".charCodeAt(0))
    );
  }
  const match1 = move.match(/^(\d)([a-i])(\d)([a-i])(\+)?$/);
  if (match1) {
    const [, d1, l1, d2, l2, plus] = match1;
    const newD1 = (10 - Number(d1)).toString();
    const newD2 = (10 - Number(d2)).toString();
    const newL1 = transformLetter(l1);
    const newL2 = transformLetter(l2);
    return newD1 + newL1 + newD2 + newL2 + (plus ?? "");
  }

  const match2 = move.match(/^([A-Z])\*(\d)([a-i])$/);
  if (match2) {
    const [, upper, d, l] = match2;
    const newD = (10 - Number(d)).toString();
    const newL = transformLetter(l);
    return upper + "*" + newD + newL;
  }

  throw new Error(`入力形式が不正です: ${move}`);
}

export function isSpecialMove(move: string): boolean {
  const match1 = move.match(/^(\d)([a-i])(\d)([a-i])(\+)?$/);
  if (match1) return false;
  const match2 = move.match(/^([A-Z])\*(\d)([a-i])$/);
  if (match2) return false;
  return true;
}
