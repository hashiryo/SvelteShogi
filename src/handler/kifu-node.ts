import {
  IsSenteTurnStore,
  GridStore,
  CapturedStore,
  HandPieceStore,
} from "@/store/game-board.svelte";
import {
  CurrentIndexStore,
  NodesStore,
  BranchesStore,
} from "@/store/kifu-node.svelte";

import { sfenxToShogiPosition, strToPosition } from "@/domain/sfenx";
import { CanMoveStore, LastPosStore } from "@/store/play-game.svelte";

function setCurrentNode(nodeIndex: number) {
  if (CurrentIndexStore.get() === nodeIndex) return;
  const node = NodesStore.getNode(nodeIndex);
  const { grid, capturedSente, capturedGote } = sfenxToShogiPosition(
    node.sfenx
  );
  GridStore.set(grid);
  CapturedStore.set(true, capturedSente);
  CapturedStore.set(false, capturedGote);
  if (node.move) {
    const { row, col } = strToPosition(node.move.substring(2, 4));
    LastPosStore.set(row, col);
  } else {
    LastPosStore.reset();
  }
  CurrentIndexStore.set(nodeIndex);
  CanMoveStore.resetAll();
  HandPieceStore.reset();
}

export function jumpToKifu(nodeIndex: number) {
  setCurrentNode(nodeIndex);
  IsSenteTurnStore.set(NodesStore.getNode(nodeIndex).isSente);
  BranchesStore.set(nodeIndex);
}

export function switchBranch(nodeIndex: number) {
  setCurrentNode(nodeIndex);
  if (nodeIndex !== 0)
    NodesStore.setChildNode(NodesStore.getNode(nodeIndex).prev, nodeIndex);
}
