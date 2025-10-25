import { shogiPositionToSfenx } from "@/domain/sfenx";
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
import { fetchAndSetFavoriteMoves } from "./favorite-moves";
import { fetchAndSetMoveStatistics } from "./move-statistics";
import { moveToNextGridCaptures } from "@/domain/move";
import { getBranches, pushOrJumpToKifu } from "@/domain/kifu-node";

export async function executeMove(display: string, move: string) {
  const isSente = IsSenteTurnStore.get();

  const { grid, captures, lastPos } = moveToNextGridCaptures(
    GridStore.get(),
    CapturesStore.get(isSente),
    isSente,
    move
  );

  PromotionPosStore.reset();
  HandPieceStore.reset();
  GridStore.set(grid);
  LastPosStore.set(lastPos);
  CapturesStore.set(isSente, captures);

  const sfenx = shogiPositionToSfenx(
    grid,
    CapturesStore.get(true),
    CapturesStore.get(false)
  );
  const { nodes, currentIndex } = pushOrJumpToKifu(
    CurrentIndexStore.get(),
    NodesStore.get(),
    display,
    sfenx,
    !isSente,
    move
  );

  CurrentIndexStore.set(currentIndex);
  NodesStore.set(nodes);
  BranchesStore.set(getBranches(nodes, currentIndex));
  await fetchAndSetFavoriteMoves(!isSente, sfenx);
  await fetchAndSetMoveStatistics(!isSente, sfenx);
  IsSenteTurnStore.set(!isSente);
}

export function executeResign() {
  const isSente = IsSenteTurnStore.get();
  LastPosStore.reset();
  PromotionPosStore.reset();
  HandPieceStore.reset();

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
