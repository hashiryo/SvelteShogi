import { sfenxToShogiPosition } from "@/domain/sfenx";
import {
  GridStore,
  IsSenteTurnStore,
  HandPieceStore,
  CapturedStore,
} from "@/store/game-board.svelte";
import {
  CurrentIndexStore,
  NodesStore,
  BranchesStore,
} from "@/store/kifu-node.svelte";
import { CanMoveStore, LastPosStore } from "@/store/play-game.svelte";
import { fetchAndSetFavoriteMoves } from "./favorite-moves";
import { fetchAndSetMoveStatistics } from "./move-statistics";

export async function initializeBySfenxTurn(sfenx: string, isSente: boolean) {
  NodesStore.reset();
  NodesStore.push("初期局面", sfenx, -1, 0, isSente, "", false);
  CurrentIndexStore.set(0);
  BranchesStore.set(0);
  const { grid, capturedSente, capturedGote } = sfenxToShogiPosition(sfenx);
  GridStore.set(grid);
  CapturedStore.set(true, capturedSente);
  CapturedStore.set(false, capturedGote);
  HandPieceStore.reset();
  IsSenteTurnStore.set(isSente);
  LastPosStore.reset();
  await fetchAndSetFavoriteMoves(isSente, sfenx);
  await fetchAndSetMoveStatistics(isSente, sfenx);
}

export async function initialize() {
  initializeBySfenxTurn(
    "lnsgkgsnl1b5r1ppppppppp999PPPPPPPPP1R5B1LNSGKGSNL aaaaaaaa",
    true
  );
}
