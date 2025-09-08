import {
  setGrid,
  setCaptured,
  setIsSenteTurn,
  resetHandPiece,
} from "@/store/game-board.svelte";
import { setCurrentIndex, getNode } from "@/store/kifu-node.svelte";

import { sfenxToShogiPosition, strToPosition } from "@/domain/sfenx";
import {
  resetCanMoveAll,
  resetLastPos,
  setLastPos,
} from "@/store/play-game.svelte";

export function jumpToKifu(nodeIndex: number) {
  const node = getNode(nodeIndex);
  console.log(node);
  const { grid, capturedSente, capturedGote } = sfenxToShogiPosition(
    node.sfenx
  );
  setGrid(grid);
  setCaptured(true, capturedSente);
  setCaptured(false, capturedGote);
  if (node.move) {
    const { row, col } = strToPosition(node.move.substring(2, 4));
    setLastPos(row, col);
  } else {
    resetLastPos();
  }
  setIsSenteTurn(node.isSente);
  setCurrentIndex(nodeIndex);
  resetCanMoveAll();
  resetHandPiece();
}
