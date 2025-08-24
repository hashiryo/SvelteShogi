import type { PieceType, Square } from "@/types/shogi";

// | 駒   | 成り前 | 成り後 | 新記号       |
// | --- | --- | --- | ------------ |
// | 歩   | P/p | と   | T/t          |
// | 香   | L/l | 成香  | V/v          |
// | 桂   | N/n | 成桂  | U/u          |
// | 銀   | S/s | 成銀  | M/m          |
// | 角   | B/b | 馬   | H/h (Horse)  |
// | 飛   | R/r | 龍   | D/d (Dragon) |

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
  龍: "D",
};

const charToPieceTypeMap: Record<string, PieceType> = {
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
  D: "龍",
};

function charToSquare(char: string): Square {
  const charU = char.toUpperCase();
  return {
    piece: charToPieceTypeMap[charU],
    isSente: char === charU,
  };
}

function strToGrid(gridString: string): (Square | null)[] {
  const grid: (Square | null)[] = Array(81).fill(null);
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

function strToCapturedPieces(
  capturedPiecesString: string
): { piece: PieceType; num: number }[] {
  let capturedPieces: { piece: PieceType; num: number }[] = [];
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

export function sfenxToShogiPosition(sfenx: string): {
  grid: (Square | null)[];
  capturedSente: { piece: PieceType; num: number }[];
  capturedGote: { piece: PieceType; num: number }[];
} {
  // SFEN形式の文字列を分解
  const [gridString, capturedPiecesString] = sfenx.split(" ");
  const grid = strToGrid(gridString);
  const capturedSente = strToCapturedPieces(capturedPiecesString.slice(0, 4));
  const capturedGote = strToCapturedPieces(capturedPiecesString.slice(4, 8));
  return { grid, capturedSente, capturedGote };
}

function squareToChar(square: Square): string {
  const ret = pieceTypeToCharMap[square.piece];
  return square.isSente ? ret : ret.toLowerCase();
}

function gridToStr(grid: (Square | null)[]): string {
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

function capturedPiecesToStr(
  capturedPieces: { piece: PieceType; num: number }[]
): string {
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

export function shogiPositionToSfenx(
  grid: (Square | null)[],
  capturedSente: { piece: PieceType; num: number }[],
  capturedGote: { piece: PieceType; num: number }[]
): string {
  const gridString = gridToStr(grid);
  const capturedPiecesString =
    capturedPiecesToStr(capturedSente) + capturedPiecesToStr(capturedGote);
  return `${gridString} ${capturedPiecesString}`;
}

export function strToPosition(posString: string): { row: number; col: number } {
  return {
    col: parseInt(posString[0]) - 1,
    row: posString[1].charCodeAt(0) - "a".charCodeAt(0),
  };
}

export function positionToStr(row: number, col: number): string {
  return `${col + 1}${String.fromCharCode("a".charCodeAt(0) + row)}`;
}
