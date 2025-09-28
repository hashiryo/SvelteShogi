import {
  setGrid,
  setCaptured,
  setIsSenteTurn,
  resetHandPiece,
} from "@/store/game-board.svelte";
import {
  setCurrentIndex,
  getNode,
  setBranches,
  setChildNode,
  getCurrentIndex,
} from "@/store/kifu-node.svelte";

import { sfenxToShogiPosition, strToPosition } from "@/domain/sfenx";
import {
  CanMoveStore,
  resetLastPos,
  setLastPos,
} from "@/store/play-game.svelte";

function setCurrentNode(nodeIndex: number) {
  if (getCurrentIndex() === nodeIndex) return;
  const node = getNode(nodeIndex);
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
  setCurrentIndex(nodeIndex);
  CanMoveStore.resetAll();
  resetHandPiece();
}

export function jumpToKifu(nodeIndex: number) {
  setCurrentNode(nodeIndex);
  setIsSenteTurn(getNode(nodeIndex).isSente);
  setBranches(nodeIndex);
}

export function switchBranch(nodeIndex: number) {
  setCurrentNode(nodeIndex);
  if (nodeIndex !== 0) setChildNode(getNode(nodeIndex).prev, nodeIndex);
}
