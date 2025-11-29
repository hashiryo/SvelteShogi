import { setFavorite } from "@/domain/kifu-node";
import { flipMove, flipSfenx } from "@/domain/sfenx";
import { FavroiteMovesRepository } from "@/lib/supabase/favorite-moves";
import { CurrentUserStore } from "@/store/auth.svelte";
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
  const user = CurrentUserStore.get();
  if (!FavoriteMovesStore.get(sfenx)) {
    const moves = await FavroiteMovesRepository.fetch(sfenx, user?.id);
    FavoriteMovesStore.set(sfenx, moves);
  }
}

// とりあえず先手スタート固定
export async function fetchAndSetFavoriteMovesMulti(sfenxes: string[]) {
  sfenxes = sfenxes.map((sfenx, idx) =>
    idx % 2 === 0 ? sfenx : flipSfenx(sfenx)
  );
  const user = CurrentUserStore.get();
  const result = await FavroiteMovesRepository.fetchMulti(sfenxes, user?.id);
  for (let i = 0; i < sfenxes.length; ++i) {
    if (!FavoriteMovesStore.get(sfenxes[i])) {
      FavoriteMovesStore.set(sfenxes[i], result[i]);
    }
  }
}

export async function clickFavoriteIcon(index: number) {
  let { prev, move, isSente, isFavorite } = NodesStore.getNode(index);
  let { sfenx } = NodesStore.getNode(prev);
  if (isSente) {
    sfenx = flipSfenx(sfenx);
    move = flipMove(move);
  }
  const user = CurrentUserStore.get();
  if (isFavorite) {
    await FavroiteMovesRepository.delete(sfenx, move, user?.id);
    FavoriteMovesStore.delete(sfenx, move);
  } else {
    await FavroiteMovesRepository.insert(sfenx, move, user?.id);
    FavoriteMovesStore.insert(sfenx, move);
  }
  const nodes = setFavorite(NodesStore.get(), sfenx, move, !isFavorite);
  NodesStore.set(nodes);
}
