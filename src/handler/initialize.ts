import { sfenxToShogiPosition } from "@/domain/sfenx";
import {
  GridStore,
  IsSenteTurnStore,
  HandPieceStore,
  setCaptured,
} from "@/store/game-board.svelte";
import {
  CurrentIndexStore,
  NodesStore,
  BranchesStore,
} from "@/store/kifu-node.svelte";
import { CanMoveStore } from "@/store/play-game.svelte";
import { fetchAndSetFavoriteMoves } from "./favorite-moves";

export async function initializeBySfenxTurn(sfenx: string, isSente: boolean) {
  NodesStore.reset();
  NodesStore.push("初期局面", sfenx, -1, 0, isSente, "", false);
  CurrentIndexStore.set(0);
  BranchesStore.set(0);
  const { grid, capturedSente, capturedGote } = sfenxToShogiPosition(sfenx);
  GridStore.set(grid);
  setCaptured(true, capturedSente);
  setCaptured(false, capturedGote);
  CanMoveStore.resetAll();
  HandPieceStore.reset();
  IsSenteTurnStore.set(isSente);
  await fetchAndSetFavoriteMoves(isSente, sfenx);
}

export async function initialize() {
  initializeBySfenxTurn(
    "lnsgkgsnl1b5r1ppppppppp999PPPPPPPPP1R5B1LNSGKGSNL aaaaaaaa",
    true
  );
}
