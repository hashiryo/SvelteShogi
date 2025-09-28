import { flipMove, flipSfenx } from "@/domain/sfenx";
import { FavroiteMovesRepository } from "@/lib/supabase/favorite-moves";
import { FavoriteMovesStore } from "@/store/favorite-moves.svelte";

import { NodesStore } from "@/store/kifu-node.svelte";

export function getCurrentFavorites(isSente: boolean, sfenx: string) {
  return isSente
    ? FavoriteMovesStore.get(sfenx) || []
    : (FavoriteMovesStore.get(flipSfenx(sfenx)) || []).map(flipMove);
}

export async function fetchAndSetFavoriteMoves(
  isSente: boolean,
  sfenx: string
) {
  if (!isSente) {
    sfenx = flipSfenx(sfenx);
  }
  // ToDo: user?.id を使うようにする
  if (!FavoriteMovesStore.get(sfenx)) {
    const moves = await FavroiteMovesRepository.fetch(sfenx);
    FavoriteMovesStore.set(sfenx, moves);
  }
}

export async function clickFavoriteIcon(index: number) {
  let { prev, move, isSente, isFavorite } = NodesStore.getNode(index);
  let { sfenx } = NodesStore.getNode(prev);
  if (isSente) {
    sfenx = flipSfenx(sfenx);
    move = flipMove(move);
  }
  // ToDo: user?.id
  if (isFavorite) {
    await FavroiteMovesRepository.delete(sfenx, move);
    FavoriteMovesStore.delete(sfenx, move);
  } else {
    await FavroiteMovesRepository.insert(sfenx, move);
    FavoriteMovesStore.insert(sfenx, move);
  }
  const n = NodesStore.size();
  for (let i = 1; i < n; ++i) {
    let { prev, move: targetMove, isSente } = NodesStore.getNode(i);
    if (isSente) targetMove = flipMove(targetMove);
    if (move === targetMove) {
      let { sfenx: targetSfenx } = NodesStore.getNode(prev);
      if (isSente) targetSfenx = flipSfenx(targetSfenx);
      if (sfenx === targetSfenx) NodesStore.setFavorite(i, !isFavorite);
    }
  }
}
