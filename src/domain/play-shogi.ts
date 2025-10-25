import type {
  HandPieceFrom,
  PieceType,
  Position,
  PlayerPiece,
} from "@/types/shogi";
import {
  canPromotePos,
  getCanMoveFromCaptured,
  getCanMoveFromSquare,
  promotePiece,
} from "./shogi-rule";
import { pieceTypeToCharMap, positionToStr } from "./sfenx";
import { getDisplayMoveFromCaptured, getDisplayMoveFromGrid } from "./display";

export function clickSquare(
  grid: (PlayerPiece | null)[],
  handPiece: HandPieceFrom | null,
  canMove: boolean[],
  isSente: boolean,
  lastPos: Position | null,
  pos: Position
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
  const square = grid[pos.row * 9 + pos.col];
  if (!handPiece) {
    if (square && square.isSente === isSente) {
      return {
        handPiece: {
          piece: square.piece,
          isSente: square.isSente,
          position: pos,
        },
        canMove: getCanMoveFromSquare(grid, pos),
      };
    }
    return null;
  }
  const handPiecePos = handPiece.position;
  if (
    handPiecePos &&
    handPiecePos.row === pos.row &&
    handPiecePos.col === pos.col
  ) {
    return null;
  }
  if (!canMove[pos.row * 9 + pos.col]) {
    if (square && square.isSente === isSente) {
      return {
        handPiece: {
          piece: square.piece,
          isSente: square.isSente,
          position: pos,
        },
        canMove: getCanMoveFromSquare(grid, pos),
      };
    } else {
      return null;
    }
  }

  if (!handPiecePos) {
    const display = getDisplayMoveFromCaptured(grid, pos, {
      piece: handPiece.piece,
      isSente,
    });
    const move = `${pieceTypeToCharMap[handPiece.piece]}*${positionToStr(pos)}`;
    return {
      display,
      move,
    };
  }

  if (
    canPromotePos(isSente, handPiecePos.row, pos.row) &&
    promotePiece(handPiece.piece) !== handPiece.piece
  ) {
    return {
      promotionPos: pos,
    };
  }
  const display = getDisplayMoveFromGrid(grid, handPiecePos, pos, lastPos);
  const fs = positionToStr(handPiecePos);
  const ts = positionToStr(pos);
  return {
    display,
    move: `${fs}${ts}`,
  };
}

export function clickCaptured(
  grid: (PlayerPiece | null)[],
  handPiece: HandPieceFrom | null,
  isSenteTurn: boolean,
  capture: PlayerPiece
): { handPiece: HandPieceFrom; canMove: boolean[] } | null {
  if (capture.isSente === isSenteTurn) {
    if (
      handPiece &&
      !handPiece.position &&
      handPiece.piece === capture.piece &&
      handPiece.isSente === capture.isSente
    ) {
      return null;
    } else {
      return {
        handPiece: {
          piece: capture.piece,
          isSente: capture.isSente,
          position: null,
        },
        canMove: getCanMoveFromCaptured(grid, capture),
      };
    }
  }
  return null;
}
