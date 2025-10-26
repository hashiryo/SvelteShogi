import { sfenxToShogiBoard } from "@/domain/sfenx";
import {
  GridStore,
  IsSenteTurnStore,
  HandPieceStore,
  CapturesStore,
} from "@/store/game-board.svelte";
import {
  CurrentIndexStore,
  NodesStore,
  BranchesStore,
} from "@/store/kifu-node.svelte";
import { CanMoveStore, LastPosStore } from "@/store/play-game.svelte";
import { fetchAndSetFavoriteMoves } from "./favorite-moves";
import { fetchAndSetMoveStatistics } from "./move-statistics";
import type { KifuNode } from "@/types/shogi";
import { MetadataStore } from "@/store/metadata.svelte";

export async function initializeBySfenxTurn(sfenx: string, isSente: boolean) {
  NodesStore.set([
    {
      display: "初期局面",
      sfenx,
      prev: -1,
      next: -1,
      br_next: 0,
      isSente,
      move: "",
      isFavorite: false,
      isSaved: false,
    },
  ]);
  CurrentIndexStore.set(0);
  BranchesStore.set([0]);
  const { grid, capturedSente, capturedGote } = sfenxToShogiBoard(sfenx);
  GridStore.set(grid);
  CapturesStore.set(true, capturedSente);
  CapturesStore.set(false, capturedGote);
  HandPieceStore.clear();
  IsSenteTurnStore.set(isSente);
  LastPosStore.clear();
  MetadataStore.clear();
  await fetchAndSetFavoriteMoves(isSente, sfenx);
  await fetchAndSetMoveStatistics(isSente, sfenx);
}

export async function initialize() {
  initializeBySfenxTurn(
    "lnsgkgsnl1b5r1ppppppppp999PPPPPPPPP1R5B1LNSGKGSNL aaaaaaaa",
    true
  );
}
