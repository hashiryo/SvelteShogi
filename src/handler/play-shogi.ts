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
import { CurrentIndexStore, NodesStore } from "@/store/kifu-node.svelte";
import { clickCaptured, clickSquare } from "@/domain/play-shogi";

function isGameOver() {
  const { move } = NodesStore.getNode(CurrentIndexStore.get());
  if (move === "resign") {
    return true;
  }
  return false;
}

export async function clickSquareHandler(row: number, col: number) {
  console.log(`clickSquareHandler: row=${row}, col=${col}`);
  if (isGameOver()) return;
  const result = clickSquare(
    GridStore.get(),
    HandPieceStore.get(),
    CanMoveStore.get(),
    IsSenteTurnStore.get(),
    LastPosStore.get(),
    row,
    col
  );
  if (!result) {
    HandPieceStore.reset();
    PromotionPosStore.reset();
    return;
  }
  if ("newHandPiece" in result) {
    HandPieceStore.set(result.newHandPiece);
    CanMoveStore.set(result.newCanMove);
    PromotionPosStore.reset();
    return;
  }
  if ("promotionPos" in result) {
    PromotionPosStore.set(result.promotionPos);
    return;
  }
  await executeMove(result.display, result.move);
}

export async function clickCapturedHandler(piece: PieceType, isSente: boolean) {
  console.log(`clickCapturedHandler: piece=${piece}, isSente=${isSente}`);
  if (isGameOver()) return;
  const result = clickCaptured(
    GridStore.get(),
    HandPieceStore.get(),
    IsSenteTurnStore.get(),
    {
      piece,
      isSente,
    }
  );

  PromotionPosStore.reset();
  if (!result) {
    HandPieceStore.reset();
    return;
  }
  HandPieceStore.set(result.newHandPiece);
  CanMoveStore.set(result.canMove);
}

export async function clickPromotionHandler(getPromote: boolean) {
  console.log(`clickPromotionHandler: getPromote=${getPromote}`);
  if (isGameOver()) return;
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
