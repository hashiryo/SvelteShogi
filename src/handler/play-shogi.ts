import type { PieceType } from "@/types/shogi";

import {
  IsSenteTurnStore,
  GridStore,
  HandPieceStore,
} from "@/store/game-board.svelte";

import {
  CanMoveStore,
  PromotionPosStore,
  LastPosStore,
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
  const square = GridStore.getSquare(row, col);
  if (!square) throw new Error(`Square at (${row}, ${col}) does not exist.`);
  const vec = getPieceMoveVec(square.piece);
  for (const { r, c, slide } of vec) {
    const rv = square.isSente ? r : -r; // Reverse direction for gote
    const cv = c;
    let nr = row + rv;
    let nc = col + cv;
    while (nr >= 0 && nr < 9 && nc >= 0 && nc < 9) {
      const targetSquare = GridStore.getSquare(nr, nc);
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
      if (GridStore.getSquare(r, c)) CanMoveStore.reset(r, c); // Reset canMove for occupied squares
    }
  }
  if (piece === "歩") {
    for (let c = 0; c < 9; c++) {
      CanMoveStore.reset(isSente ? 0 : 8, c); // Place pawn on the first or last row
      let nifu = false;
      for (let r = 0; r < 9; r++) {
        const square = GridStore.getSquare(r, c);
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
  const square = GridStore.getSquare(row, col);
  const handPiece = HandPieceStore.get();
  const isSenteTurn = IsSenteTurnStore.get();
  if (!handPiece) {
    if (square && square.isSente === isSenteTurn) {
      HandPieceStore.setFromSquare(square.piece, square.isSente, { row, col });
      setCanMoveFromSquare(row, col);
      PromotionPosStore.reset();
    }
    return;
  }
  const handPiecePos = handPiece.position;
  if (handPiecePos && handPiecePos.row === row && handPiecePos.col === col) {
    HandPieceStore.reset();
    PromotionPosStore.reset();
    return;
  }
  if (!CanMoveStore.get(row, col)) {
    if (square && square.isSente === isSenteTurn) {
      HandPieceStore.setFromSquare(square.piece, square.isSente, { row, col });
      setCanMoveFromSquare(row, col);
      PromotionPosStore.reset();
    } else {
      HandPieceStore.reset();
      PromotionPosStore.reset();
    }
    return;
  }

  if (!handPiecePos) {
    const display = getDisplayMoveFromCaptured(
      GridStore.get(),
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
      PromotionPosStore.set(row, col);
      return;
    }
  }
  const display = getDisplayMoveFromGrid(
    GridStore.get(),
    handPiecePos,
    { row, col },
    LastPosStore.get()
  );
  const fs = positionToStr(handPiecePos.row, handPiecePos.col);
  const ts = positionToStr(row, col);
  await executeMove(display, `${fs}${ts}`);
  return;
}

export async function clickCapturedHandler(piece: PieceType, isSente: boolean) {
  console.log(`clickCapturedHandler: piece=${piece}, isSente=${isSente}`);
  const handPiece = HandPieceStore.get();
  const isSenteTurn = IsSenteTurnStore.get();
  if (isSente === isSenteTurn) {
    if (handPiece && !handPiece.position && handPiece.isSente === isSente) {
      HandPieceStore.reset();
      PromotionPosStore.reset();
    } else {
      HandPieceStore.setFromCaptured(piece, isSente);
      setCanMoveFromCaptured(piece, isSente);
      PromotionPosStore.reset();
    }
    return;
  }
  HandPieceStore.reset();
  PromotionPosStore.reset();
}

export async function clickPromotionHandler(getPromote: boolean) {
  console.log(`clickPromotionHandler: getPromote=${getPromote}`);
  const handPiece = HandPieceStore.get();
  if (!handPiece) throw new Error("No hand piece selected for promotion.");
  const handPiecePos = handPiece.position;
  if (!handPiecePos) throw new Error("Hand piece is not from a square.");
  const promotionPos = PromotionPosStore.get();
  if (!promotionPos) throw new Error("No promotion position set.");
  const { row, col } = promotionPos;
  const display =
    getDisplayMoveFromGrid(
      GridStore.get(),
      handPiecePos,
      { row, col },
      LastPosStore.get()
    ) + (getPromote ? "成" : "不成");
  const fs = positionToStr(handPiecePos.row, handPiecePos.col);
  const ts = positionToStr(row, col);
  await executeMove(display, `${fs}${ts}${getPromote ? "+" : ""}`);
}
