import type { PieceType, PlayerPiece } from "@/types/shogi";

function getGoldMoveVec(): { r: number; c: number; slide: boolean }[] {
  return [
    { r: 1, c: 0, slide: false }, // 下
    { r: 0, c: 1, slide: false }, // 右
    { r: 0, c: -1, slide: false }, // 左
    { r: -1, c: 0, slide: false }, // 上
    { r: -1, c: 1, slide: false }, // 右上
    { r: -1, c: -1, slide: false }, // 左上
  ];
}

// 先手目線
export function getPieceMoveVec(
  piece: PieceType
): { r: number; c: number; slide: boolean }[] {
  switch (piece) {
    case "歩":
      return [{ r: -1, c: 0, slide: false }];
    case "香":
      return [{ r: -1, c: 0, slide: true }];
    case "桂":
      return [
        { r: -2, c: 1, slide: false },
        { r: -2, c: -1, slide: false },
      ];
    case "銀":
      return [
        { r: -1, c: 0, slide: false }, // 上
        { r: -1, c: 1, slide: false }, // 右
        { r: -1, c: -1, slide: false }, // 左
        { r: 1, c: 1, slide: false }, // 右下
        { r: 1, c: -1, slide: false }, // 左下
      ];
    case "玉":
      return [
        { r: -1, c: 0, slide: false }, // 上
        { r: 0, c: 1, slide: false }, // 右
        { r: 0, c: -1, slide: false }, // 左
        { r: 1, c: 0, slide: false }, // 下
        { r: -1, c: 1, slide: false }, // 右上
        { r: -1, c: -1, slide: false }, // 左上
        { r: 1, c: 1, slide: false }, // 右下
        { r: 1, c: -1, slide: false }, // 左下
      ];
    case "角":
      return [
        { r: 1, c: 1, slide: true },
        { r: 1, c: -1, slide: true },
        { r: -1, c: 1, slide: true },
        { r: -1, c: -1, slide: true },
      ];
    case "飛":
      return [
        { r: 1, c: 0, slide: true },
        { r: 0, c: 1, slide: true },
        { r: 0, c: -1, slide: true },
        { r: -1, c: 0, slide: true },
      ];
    case "馬":
      return [
        { r: 1, c: 1, slide: true },
        { r: 1, c: -1, slide: true },
        { r: -1, c: 1, slide: true },
        { r: -1, c: -1, slide: true },
        { r: -1, c: 0, slide: false }, // 上
        { r: 0, c: 1, slide: false }, // 右
        { r: 0, c: -1, slide: false }, // 左
        { r: 1, c: 0, slide: false }, // 下
      ];
    case "竜":
      return [
        { r: 1, c: 0, slide: true },
        { r: 0, c: 1, slide: true },
        { r: 0, c: -1, slide: true },
        { r: -1, c: 0, slide: true },
        { r: -1, c: 1, slide: false }, // 右上
        { r: -1, c: -1, slide: false }, // 左上
        { r: 1, c: 1, slide: false }, // 右下
        { r: 1, c: -1, slide: false }, // 左下
      ];
    default: // 金、と、杏、圭、全
      return getGoldMoveVec();
  }
}

export function promotePiece(piece: PieceType): PieceType {
  switch (piece) {
    case "歩":
      return "と";
    case "香":
      return "杏";
    case "桂":
      return "圭";
    case "銀":
      return "全";
    case "角":
      return "馬";
    case "飛":
      return "竜";
    default:
      return piece; // 金、玉はプロモートしない
  }
}

export function originalPiece(piece: PieceType): PieceType {
  switch (piece) {
    case "と":
      return "歩";
    case "杏":
      return "香";
    case "圭":
      return "桂";
    case "全":
      return "銀";
    case "馬":
      return "角";
    case "竜":
      return "飛";
    default:
      return piece; // 金、玉は元の駒
  }
}

export function canPromotePos(
  isSente: boolean,
  fromRow: number,
  toRow: number
) {
  return isSente ? fromRow < 3 || toRow < 3 : fromRow > 5 || toRow > 5;
}

export function getCanMoveFromSquare(
  grid: (PlayerPiece | null)[],
  row: number,
  col: number
): boolean[] {
  let canMove: boolean[] = new Array(9 * 9).fill(false);
  const square = grid[row * 9 + col];
  if (!square)
    throw new Error(`PlayerPiece at (${row}, ${col}) does not exist.`);
  const vec = getPieceMoveVec(square.piece);
  for (const { r, c, slide } of vec) {
    const rv = square.isSente ? r : -r; // Reverse direction for gote
    const cv = c;
    let nr = row + rv;
    let nc = col + cv;
    while (nr >= 0 && nr < 9 && nc >= 0 && nc < 9) {
      const index = nr * 9 + nc;
      const targetSquare = grid[index];
      if (targetSquare) {
        if (targetSquare.isSente !== square.isSente) {
          canMove[index] = true;
        }
        break;
      } else {
        canMove[index] = true; // Empty square can be moved to
      }
      if (!slide) break; // If not sliding piece, stop here
      nr += rv;
      nc += cv;
    }
  }
  return canMove;
}

export function getCanMoveFromCaptured(
  grid: (PlayerPiece | null)[],
  piece: PieceType,
  isSente: boolean
): boolean[] {
  let canMove: boolean[] = new Array(9 * 9).fill(true);
  const vec = getPieceMoveVec(piece);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const index = r * 9 + c;
      if (grid[index]) canMove[index] = false; // Reset canMove for occupied squares
    }
  }
  const top = isSente ? 0 : 8;
  if (piece === "歩") {
    for (let c = 0; c < 9; c++) {
      canMove[top * 9 + c] = false;
      let nifu = false;
      for (let r = 0; r < 9; r++) {
        const square = grid[r * 9 + c];
        if (square && square.isSente === isSente) {
          if (square.piece === "歩") {
            nifu = true; // Found another pawn in the same column
            break;
          }
        }
      }
      if (nifu) {
        for (let r = 0; r < 9; r++) canMove[r * 9 + c] = false;
      }
    }
  }
  if (piece === "香") {
    for (let c = 0; c < 9; c++) canMove[top * 9 + c] = false;
  }
  if (piece === "桂") {
    const top2 = isSente ? 1 : 7;
    for (let c = 0; c < 9; c++) {
      canMove[top * 9 + c] = false;
      canMove[top2 * 9 + c] = false;
    }
  }
  return canMove;
}
