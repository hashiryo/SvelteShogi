import type { HandPieceFrom, PieceType, Position, Square } from "@/types/shogi";
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
  lastPos: Position | null,
  row: number,
  col: number
):
  | {
      display: string;
      move: string;
    }
  | {
      handPiece: HandPieceFrom;
      canMove: boolean[];
    }
  | {
      promotionPos: Position;
    }
  | null {
  const square = grid[row * 9 + col];
  if (!handPiece) {
    if (square && square.isSente === isSente) {
      return {
        handPiece: {
          piece: square.piece,
          isSente: square.isSente,
          position: { row, col },
        },
        canMove: getCanMoveFromSquare(grid, row, col),
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
        handPiece: {
          piece: square.piece,
          isSente: square.isSente,
          position: { row, col },
        },
        canMove: getCanMoveFromSquare(grid, row, col),
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

  if (
    canPromotePos(isSente, handPiecePos.row, row) &&
    promotePiece(handPiece.piece) !== handPiece.piece
  ) {
    return {
      promotionPos: {
        row,
        col,
      },
    };
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
): { handPiece: HandPieceFrom; canMove: boolean[] } | null {
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
        handPiece: {
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
