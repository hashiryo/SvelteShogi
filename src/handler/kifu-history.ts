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
} from "@/store/kifu-node.svelte";

import { sfenxToShogiPosition, strToPosition } from "@/domain/sfenx";
import {
  resetCanMoveAll,
  resetLastPos,
  setLastPos,
} from "@/store/play-game.svelte";

function setCurrentNode(nodeIndex: number) {
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
  resetCanMoveAll();
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
