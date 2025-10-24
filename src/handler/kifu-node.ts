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

import {
  isSpecialMove,
  sfenxToShogiPosition,
  strToPosition,
} from "@/domain/sfenx";
import { LastPosStore } from "@/store/play-game.svelte";

function setCurrentNode(nodeIndex: number) {
  if (CurrentIndexStore.get() === nodeIndex) return;
  const node = NodesStore.getNode(nodeIndex);
  const { grid, capturedSente, capturedGote } = sfenxToShogiPosition(
    node.sfenx
  );
  GridStore.set(grid);
  CapturedStore.set(true, capturedSente);
  CapturedStore.set(false, capturedGote);
  if (isSpecialMove(node.move)) {
    LastPosStore.reset();
  } else {
    const { row, col } = strToPosition(node.move.substring(2, 4));
    LastPosStore.set(row, col);
  }
  CurrentIndexStore.set(nodeIndex);
  HandPieceStore.reset();
}

export function jumpToKifu(nodeIndex: number) {
  setCurrentNode(nodeIndex);
  IsSenteTurnStore.set(NodesStore.getNode(nodeIndex).isSente);
  BranchesStore.set(nodeIndex);
}

export function switchBranch(nodeIndex: number) {
  setCurrentNode(nodeIndex);
  const { prev } = NodesStore.getNode(nodeIndex);
  if (prev !== -1) NodesStore.setChildNode(prev, nodeIndex);
}
