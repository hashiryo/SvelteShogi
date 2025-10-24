import type { HandPieceFrom, PieceType, Square } from "@/types/shogi";
import {
  canPromotePos,
  getCanMoveFromCaptured,
  getCanMoveFromSquare,
  promotePiece,
} from "./shogi-rule";
import { pieceTypeToCharMap, positionToStr } from "./sfenx";
import { getDisplayMoveFromCaptured, getDisplayMoveFromGrid } from "./display";

export function clickSquare(
  grid: (Square | null)[],
  handPiece: HandPieceFrom | null,
  canMove: boolean[],
  isSente: boolean,
  lastPos: { row: number; col: number } | null,
  row: number,
  col: number
):
  | {
      display: string;
      move: string;
    }
  | {
      newHandPiece: HandPieceFrom;
      newCanMove: boolean[];
    }
  | {
      promotionPos: { row: number; col: number };
    }
  | null {
  const square = grid[row * 9 + col];
  if (!handPiece) {
    if (square && square.isSente === isSente) {
      return {
        newHandPiece: {
          piece: square.piece,
          isSente: square.isSente,
          position: { row, col },
        },
        newCanMove: getCanMoveFromSquare(grid, row, col),
      };
    }
    return null;
  }
  const handPiecePos = handPiece.position;
  if (handPiecePos && handPiecePos.row === row && handPiecePos.col === col) {
    return null;
  }
  if (!canMove[row * 9 + col]) {
    if (square && square.isSente === isSente) {
      return {
        newHandPiece: {
          piece: square.piece,
          isSente: square.isSente,
          position: { row, col },
        },
        newCanMove: getCanMoveFromSquare(grid, row, col),
      };
    } else {
      return null;
    }
  }

  if (!handPiecePos) {
    const display = getDisplayMoveFromCaptured(
      grid,
      row,
      col,
      handPiece.piece,
      isSente
    );
    const move = `${pieceTypeToCharMap[handPiece.piece]}*${positionToStr(row, col)}`;
    return {
      display,
      move,
    };
  }

  if (canPromotePos(isSente, handPiecePos.row, row)) {
    const promotedPiece = promotePiece(handPiece.piece);
    if (promotedPiece !== handPiece.piece) {
      return {
        promotionPos: {
          row,
          col,
        },
      };
    }
  }
  const display = getDisplayMoveFromGrid(
    grid,
    handPiecePos,
    { row, col },
    lastPos
  );
  const fs = positionToStr(handPiecePos.row, handPiecePos.col);
  const ts = positionToStr(row, col);
  return {
    display,
    move: `${fs}${ts}`,
  };
}

export function clickCaptured(
  grid: (Square | null)[],
  handPiece: HandPieceFrom | null,
  isSenteTurn: boolean,
  captured: {
    piece: PieceType;
    isSente: boolean;
  }
): { newHandPiece: HandPieceFrom; canMove: boolean[] } | null {
  if (captured.isSente === isSenteTurn) {
    if (
      handPiece &&
      !handPiece.position &&
      handPiece.piece === captured.piece &&
      handPiece.isSente === captured.isSente
    ) {
      return null;
    } else {
      return {
        newHandPiece: {
          piece: captured.piece,
          isSente: captured.isSente,
          position: null,
        },
        canMove: getCanMoveFromCaptured(grid, captured.piece, captured.isSente),
      };
    }
  }
  return null;
}

export function clickPromotion(
  grid: (Square | null)[],
  lastPos: { row: number; col: number } | null,
  fromPos: { row: number; col: number },
  toPos: { row: number; col: number },
  getPromote: boolean
): {
  display: string;
  move: string;
} {
  const { row, col } = toPos;
  const display =
    getDisplayMoveFromGrid(grid, fromPos, toPos, lastPos) +
    (getPromote ? "成" : "不成");
  const fs = positionToStr(fromPos.row, fromPos.col);
  const ts = positionToStr(row, col);
  return {
    display,
    move: `${fs}${ts}${getPromote ? "+" : ""}`,
  };
}
