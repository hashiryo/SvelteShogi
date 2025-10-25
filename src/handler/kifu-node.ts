import {
  IsSenteTurnStore,
  GridStore,
  CapturesStore,
  HandPieceStore,
} from "@/store/game-board.svelte";
import {
  CurrentIndexStore,
  NodesStore,
  BranchesStore,
} from "@/store/kifu-node.svelte";

import {
  isSpecialMove,
  sfenxToShogiBoard,
  strToPosition,
} from "@/domain/sfenx";
import { LastPosStore } from "@/store/play-game.svelte";
import { getBranches } from "@/domain/kifu-node";

function setCurrentNode(nodeIndex: number) {
  if (CurrentIndexStore.get() === nodeIndex) return;
  const node = NodesStore.getNode(nodeIndex);
  const { grid, capturedSente, capturedGote } = sfenxToShogiBoard(node.sfenx);
  GridStore.set(grid);
  CapturesStore.set(true, capturedSente);
  CapturesStore.set(false, capturedGote);
  if (isSpecialMove(node.move)) {
    LastPosStore.reset();
  } else {
    const lastPos = strToPosition(node.move.substring(2, 4));
    LastPosStore.set(lastPos);
  }
  CurrentIndexStore.set(nodeIndex);
  HandPieceStore.reset();
}

export function jumpToKifu(nodeIndex: number) {
  setCurrentNode(nodeIndex);
  IsSenteTurnStore.set(NodesStore.getNode(nodeIndex).isSente);
  const nodes = NodesStore.get();
  BranchesStore.set(getBranches(nodes, nodeIndex));
}

export function switchBranch(nodeIndex: number) {
  setCurrentNode(nodeIndex);
  const { prev } = NodesStore.getNode(nodeIndex);
  if (prev !== -1) NodesStore.setChildNode(prev, nodeIndex);
}
