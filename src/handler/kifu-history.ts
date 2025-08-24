import type { HistoryNode } from "@/types/shogi";

import { setGrid, setCaptured } from "@/store/game-board.svelte";
import { setCurrentIndex, getNode } from "@/store/kifu-history.svelte";

import { sfenxToShogiPosition } from "@/domain/sfenx";

export function jumpToKifu(nodeIndex: number) {
  const node = getNode(nodeIndex);
  console.log(node);
  const { grid, capturedSente, capturedGote } = sfenxToShogiPosition(
    node.sfenx
  );
  setGrid(grid);
  setCaptured(true, capturedSente);
  setCaptured(false, capturedGote);
  setCurrentIndex(nodeIndex);
}
