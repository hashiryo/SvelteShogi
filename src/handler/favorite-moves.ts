import { flipMove, flipSfenx } from "@/domain/sfenx";
import {
  fetchFavoriteMoves,
  insertFavoriteMoveToDB,
  deleteFavoriteMoveFromDB,
} from "@/lib/supabase/favorite-moves";
import {
  getFavoriteMoves,
  insertFavoriteMove,
  deleteFavoriteMove,
  setFavoriteMoves,
} from "@/store/favorite-moves.svelte";

import {
  toggleFavorite,
  getNode,
  getNodesSize,
  setFavorite,
} from "@/store/kifu-node.svelte";

export async function clickFavoriteIcon(index: number) {
  let { prev, move, isSente, isFavorite } = getNode(index);
  let { sfenx } = getNode(prev);
  if (isSente) {
    sfenx = flipSfenx(sfenx);
    move = flipMove(move);
  }
  // ToDo: user?.id
  if (isFavorite) {
    await deleteFavoriteMoveFromDB(sfenx, move);
    deleteFavoriteMove(sfenx, move);
  } else {
    await insertFavoriteMoveToDB(sfenx, move);
    insertFavoriteMove(sfenx, move);
  }
  const n = getNodesSize();
  for (let i = 1; i < n; ++i) {
    let { prev, move: targetMove, isSente } = getNode(i);
    if (isSente) targetMove = flipMove(targetMove);
    if (move === targetMove) {
      let { sfenx: targetSfenx } = getNode(prev);
      if (isSente) targetSfenx = flipSfenx(targetSfenx);
      if (sfenx === targetSfenx) toggleFavorite(i);
    }
  }
}
