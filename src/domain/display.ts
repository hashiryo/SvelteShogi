import type { PieceType, Square } from "@/types/shogi";
import { canPromotePos, getPieceMoveVec } from "./shogi-rule";
import { charToPieceTypeMap, strToPosition } from "./sfenx";

export const KANJI_NUM = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
export const ZENKAKU_NUM = [
  "１",
  "２",
  "３",
  "４",
  "５",
  "６",
  "７",
  "８",
  "９",
];

type VDirCnt = { up: number; none: number; down: number };

function getFromVDirections(
  grid: (Square | null)[],
  row: number,
  col: number,
  piece: PieceType,
  isSente: boolean
): {
  left: VDirCnt;
  none: VDirCnt;
  right: VDirCnt;
} {
  // 駒の種類に応じた移動方向を返す
  const dirCnt = {
    left: { up: 0, none: 0, down: 0 },
    none: { up: 0, none: 0, down: 0 },
    right: { up: 0, none: 0, down: 0 },
  };
  const vec = getPieceMoveVec(piece);
  for (const { r, c, slide } of vec) {
    const rv = isSente ? r : -r;
    const cv = isSente ? c : -c;
    let nr = row - rv;
    let nc = col - cv;
    while (nr >= 0 && nr < 9 && nc >= 0 && nc < 9) {
      const square = grid[nr * 9 + nc];
      if (square?.isSente === isSente && square.piece === piece) {
        const relPos = c > 0 ? "right" : c < 0 ? "left" : "none";
        const move = r > 0 ? "down" : r < 0 ? "up" : "none";
        dirCnt[relPos][move]++;
      }
      if (!slide) break; // If not sliding piece, stop here
      nr -= rv;
      nc -= cv;
    }
  }
  return dirCnt;
}

export function getDisplayMoveFromCaptured(
  grid: (Square | null)[],
  row: number,
  col: number,
  piece: PieceType,
  isSente: boolean
): string {
  const dirCnt = getFromVDirections(grid, row, col, piece, isSente);
  const total = Object.values(dirCnt).reduce((sum, direction) => {
    return (
      sum +
      Object.values(direction).reduce((subSum, value) => subSum + value, 0)
    );
  }, 0);
  const display = `${isSente ? "☗" : "☖"}${ZENKAKU_NUM[col]}${
    KANJI_NUM[row]
  }${piece}${total > 0 ? "打" : ""}`;
  return display;
}

export function getDisplayMoveFromGrid(
  grid: (Square | null)[],
  from: Position,
  to: Position,
  lastPos: Position | null
): string {
  const fromSquare = grid[from.row * 9 + from.col];
  if (!fromSquare)
    throw new Error(`fromSquare is null {from: ${from.col},${from.row}}`);
  const dr = fromSquare.isSente ? to.row - from.row : from.row - to.row;
  const dc = fromSquare.isSente ? to.col - from.col : from.col - to.col;
  const myRelPos = dc < 0 ? "left" : dc > 0 ? "right" : "none";
  const myMove = dr < 0 ? "up" : dr > 0 ? "down" : "none";

  let dirCnt = getFromVDirections(
    grid,
    to.row,
    to.col,
    fromSquare.piece,
    fromSquare.isSente
  );
  dirCnt[myRelPos][myMove]--;

  const vSum =
    dirCnt[myRelPos].down + dirCnt[myRelPos].none + dirCnt[myRelPos].up;
  const hSum = dirCnt.left[myMove] + dirCnt.none[myMove] + dirCnt.right[myMove];
  const total = Object.values(dirCnt).reduce((sum, direction) => {
    return (
      sum +
      Object.values(direction).reduce((subSum, value) => subSum + value, 0)
    );
  }, 0);
  let useVertical = true;
  let display = fromSquare.isSente ? "☗" : "☖";
  if (lastPos && lastPos.row === to.row && lastPos.col === to.col) {
    display += "同　";
  } else {
    display += `${ZENKAKU_NUM[to.col]}${KANJI_NUM[to.row]}`;
  }
  display += fromSquare.piece;
  if (hSum > 0) {
    if (
      fromSquare.piece === "飛" ||
      fromSquare.piece === "角" ||
      fromSquare.piece === "竜" ||
      fromSquare.piece === "馬"
    )
      display += dirCnt.left[myMove] > 0 ? "右" : "左";
    else {
      switch (myRelPos) {
        case "left":
          display += "左";
          break;
        case "right":
          display += "右";
          break;
        case "none":
          display += "直";
          useVertical = false;
          break;
      }
    }
  }
  if ((useVertical && vSum > 0) || (hSum === 0 && total > 0)) {
    switch (myMove) {
      case "up":
        display += "上";
        break;
      case "down":
        display += "引";
        break;
      case "none":
        display += "寄";
        break;
    }
  }
  return display;
}

export function getDisplayMoveFromMoveStr(
  grid: (Square | null)[],
  move: string,
  isSente: boolean,
  lastPos: Position | null
): string {
  if (move === "resign") return "投了";
  let displayText = "";
  const match1 = move.match(/^(\d)([a-i])(\d)([a-i])(\+)?$/);
  if (match1) {
    const [, fromColStr, fromRowStr, toColStr, toRowStr, prom] = match1;
    const from = strToPosition(`${fromColStr}${fromRowStr}`);
    const to = strToPosition(`${toColStr}${toRowStr}`);
    displayText = getDisplayMoveFromGrid(grid, from, to, lastPos);
    if (canPromotePos(isSente, from.row, to.row)) {
      displayText += prom ? "成" : "不成";
    }
    return displayText;
  }

  const match2 = move.match(/^([A-Z])\*(\d)([a-i])$/);
  if (match2) {
    const [, pieceChar, colStr, rowStr] = match2;
    const { row, col } = strToPosition(`${colStr}${rowStr}`);
    const piece = charToPieceTypeMap[pieceChar];
    return getDisplayMoveFromCaptured(grid, row, col, piece, isSente);
  }

  throw new Error("不正な形式の手");
}
