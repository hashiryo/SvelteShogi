import { shogiBoardToSfenx } from "@/domain/sfenx";
import {
  GridStore,
  IsSenteTurnStore,
  CapturesStore,
  HandPieceStore,
} from "@/store/game-board.svelte";
import {
  CurrentIndexStore,
  NodesStore,
  BranchesStore,
} from "@/store/kifu-node.svelte";
import { PromotionPosStore, LastPosStore } from "@/store/play-game.svelte";
import {
  fetchAndSetFavoriteMoves,
  getCurrentFavorites,
} from "./favorite-moves";
import { fetchAndSetMoveStatistics } from "./move-statistics";
import { moveToNextGridCaptures } from "@/domain/move";
import { getBranches, pushOrJumpToKifu } from "@/domain/kifu-node";

export function executeResign() {
  const isSente = IsSenteTurnStore.get();
  LastPosStore.clear();
  PromotionPosStore.clear();
  HandPieceStore.clear();

  const { sfenx } = NodesStore.getNode(CurrentIndexStore.get());
  const { nodes, currentIndex } = pushOrJumpToKifu(
    CurrentIndexStore.get(),
    NodesStore.get(),
    "投了",
    sfenx,
    !isSente,
    "resign"
  );

  CurrentIndexStore.set(currentIndex);
  NodesStore.set(nodes);

  BranchesStore.set(getBranches(nodes, currentIndex));
  IsSenteTurnStore.set(!isSente);
}

export async function executeMove(display: string, move: string) {
  if (move === "resign") {
    executeResign();
    return;
  }

  const isSente = IsSenteTurnStore.get();

  const { grid, captures, lastPos } = moveToNextGridCaptures(
    GridStore.get(),
    CapturesStore.get(isSente),
    isSente,
    move
  );

  PromotionPosStore.clear();
  HandPieceStore.clear();
  GridStore.set(grid);
  LastPosStore.set(lastPos);
  CapturesStore.set(isSente, captures);

  const sfenx = shogiBoardToSfenx(
    grid,
    CapturesStore.get(true),
    CapturesStore.get(false)
  );
  const cur = CurrentIndexStore.get();
  let { nodes, currentIndex: next } = pushOrJumpToKifu(
    cur,
    NodesStore.get(),
    display,
    sfenx,
    !isSente,
    move
  );

  if (next === nodes.length - 1) {
    const moves = getCurrentFavorites(nodes[cur].isSente, nodes[cur].sfenx);
    const isFavorite = moves ? moves.includes(move) : false;
    if (isFavorite) {
      nodes[next].isFavorite = true;
    }
  }

  CurrentIndexStore.set(next);
  NodesStore.set(nodes);
  BranchesStore.set(getBranches(nodes, next));
  await fetchAndSetFavoriteMoves(!isSente, sfenx);
  await fetchAndSetMoveStatistics(!isSente, sfenx);
  IsSenteTurnStore.set(!isSente);
}
