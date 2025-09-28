import type { PieceType } from "@/types/shogi";

import {
  getSquare,
  getGrid,
  getHandPiece,
  setHandPieceFromSquare,
  setHandPieceFromCaptured,
  resetHandPiece,
  getIsSenteTurn,
} from "@/store/game-board.svelte";

import {
  CanMoveStore,
  getPromotionPos,
  setPromotionPos,
  resetPromotionPos,
  getLastPos,
} from "@/store/play-game.svelte";

import {
  getPieceMoveVec,
  promotePiece,
  canPromotePos,
} from "@/domain/shogi-rule";

import { pieceTypeToCharMap, positionToStr } from "@/domain/sfenx";

import {
  getDisplayMoveFromGrid,
  getDisplayMoveFromCaptured,
} from "@/domain/display";

import { executeMove } from "./execute-move";

function setCanMoveFromSquare(row: number, col: number) {
  CanMoveStore.resetAll();
  const square = getSquare(row, col);
  if (!square) throw new Error(`Square at (${row}, ${col}) does not exist.`);
  const vec = getPieceMoveVec(square.piece);
  for (const { r, c, slide } of vec) {
    const rv = square.isSente ? r : -r; // Reverse direction for gote
    const cv = c;
    let nr = row + rv;
    let nc = col + cv;
    while (nr >= 0 && nr < 9 && nc >= 0 && nc < 9) {
      const targetSquare = getSquare(nr, nc);
      if (targetSquare) {
        if (targetSquare.isSente !== square.isSente) {
          CanMoveStore.set(nr, nc); // Can capture opponent's piece
        }
        break;
      } else {
        CanMoveStore.set(nr, nc); // Empty square can be moved to
      }
      if (!slide) break; // If not sliding piece, stop here
      nr += rv;
      nc += cv;
    }
  }
}

function setCanMoveFromCaptured(piece: PieceType, isSente: boolean) {
  CanMoveStore.setAll();
  const vec = getPieceMoveVec(piece);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (getSquare(r, c)) CanMoveStore.reset(r, c); // Reset canMove for occupied squares
    }
  }
  if (piece === "歩") {
    for (let c = 0; c < 9; c++) {
      CanMoveStore.reset(isSente ? 0 : 8, c); // Place pawn on the first or last row
      let nifu = false;
      for (let r = 0; r < 9; r++) {
        const square = getSquare(r, c);
        if (square && square.isSente === isSente) {
          if (square.piece === "歩") {
            nifu = true; // Found another pawn in the same column
            break;
          }
        }
      }
      if (nifu) {
        for (let r = 0; r < 9; r++) CanMoveStore.reset(r, c);
      }
    }
  }
  if (piece === "香") {
    for (let c = 0; c < 9; c++) CanMoveStore.reset(isSente ? 0 : 8, c);
  }
  if (piece === "桂") {
    for (let c = 0; c < 9; c++) {
      CanMoveStore.reset(isSente ? 0 : 8, c);
      CanMoveStore.reset(isSente ? 1 : 7, c);
    }
  }
}

export async function clickSquareHandler(row: number, col: number) {
  console.log(`clickSquareHandler: row=${row}, col=${col}`);
  const square = getSquare(row, col);
  const handPiece = getHandPiece();
  const isSenteTurn = getIsSenteTurn();
  if (!handPiece) {
    if (square && square.isSente === isSenteTurn) {
      setHandPieceFromSquare(square.piece, square.isSente, { row, col });
      setCanMoveFromSquare(row, col);
      resetPromotionPos();
    }
    return;
  }
  const handPiecePos = handPiece.position;
  if (handPiecePos && handPiecePos.row === row && handPiecePos.col === col) {
    resetHandPiece();
    resetPromotionPos();
    return;
  }
  if (!CanMoveStore.get(row, col)) {
    if (square && square.isSente === isSenteTurn) {
      setHandPieceFromSquare(square.piece, square.isSente, { row, col });
      setCanMoveFromSquare(row, col);
      resetPromotionPos();
    } else {
      resetHandPiece();
      resetPromotionPos();
    }
    return;
  }

  if (!handPiecePos) {
    const display = getDisplayMoveFromCaptured(
      getGrid(),
      row,
      col,
      handPiece.piece,
      isSenteTurn
    );
    const move = `${pieceTypeToCharMap[handPiece.piece]}*${positionToStr(row, col)}`;
    await executeMove(display, move);
    return;
  }

  if (canPromotePos(isSenteTurn, handPiecePos.row, row)) {
    const promotedPiece = promotePiece(handPiece.piece);
    if (promotedPiece !== handPiece.piece) {
      setPromotionPos(row, col);
      return;
    }
  }
  const display = getDisplayMoveFromGrid(
    getGrid(),
    handPiecePos,
    { row, col },
    getLastPos()
  );
  const fs = positionToStr(handPiecePos.row, handPiecePos.col);
  const ts = positionToStr(row, col);
  await executeMove(display, `${fs}${ts}`);
  return;
}

export async function clickCapturedHandler(piece: PieceType, isSente: boolean) {
  console.log(`clickCapturedHandler: piece=${piece}, isSente=${isSente}`);
  const handPiece = getHandPiece();
  const isSenteTurn = getIsSenteTurn();
  if (isSente === isSenteTurn) {
    if (handPiece && !handPiece.position && handPiece.isSente === isSente) {
      resetHandPiece();
      resetPromotionPos();
    } else {
      setHandPieceFromCaptured(piece, isSente);
      setCanMoveFromCaptured(piece, isSente);
      resetPromotionPos();
    }
    return;
  }
  resetHandPiece();
  resetPromotionPos();
}

export async function clickPromotionHandler(getPromote: boolean) {
  console.log(`clickPromotionHandler: getPromote=${getPromote}`);
  const handPiece = getHandPiece();
  if (!handPiece) throw new Error("No hand piece selected for promotion.");
  const handPiecePos = handPiece.position;
  if (!handPiecePos) throw new Error("Hand piece is not from a square.");
  const promotionPos = getPromotionPos();
  if (!promotionPos) throw new Error("No promotion position set.");
  const { row, col } = promotionPos;
  const display =
    getDisplayMoveFromGrid(
      getGrid(),
      handPiecePos,
      { row, col },
      getLastPos()
    ) + (getPromote ? "成" : "不成");
  const fs = positionToStr(handPiecePos.row, handPiecePos.col);
  const ts = positionToStr(row, col);
  await executeMove(display, `${fs}${ts}${getPromote ? "+" : ""}`);
}
