import { sfenxToShogiPosition } from "@/domain/sfenx";
import {
  resetHandPiece,
  setCaptured,
  setGrid,
  setIsSenteTurn,
} from "@/store/game-board.svelte";
import {
  pushKifuNode,
  resetNodes,
  setBranches,
  setCurrentIndex,
} from "@/store/kifu-node.svelte";
import { CanMoveStore } from "@/store/play-game.svelte";
import { fetchAndSetFavoriteMoves } from "./favorite-moves";

export async function initializeBySfenxTurn(sfenx: string, isSente: boolean) {
  resetNodes();
  pushKifuNode("初期局面", sfenx, -1, 0, isSente, "", false);
  setCurrentIndex(0);
  setBranches(0);
  const { grid, capturedSente, capturedGote } = sfenxToShogiPosition(sfenx);
  setGrid(grid);
  setCaptured(true, capturedSente);
  setCaptured(false, capturedGote);
  CanMoveStore.resetAll();
  resetHandPiece();
  setIsSenteTurn(isSente);
  await fetchAndSetFavoriteMoves(isSente, sfenx);
}

export async function initialize() {
  initializeBySfenxTurn(
    "lnsgkgsnl1b5r1ppppppppp999PPPPPPPPP1R5B1LNSGKGSNL aaaaaaaa",
    true
  );
}
