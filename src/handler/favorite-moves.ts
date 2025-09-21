import { flipMove, flipSfenx } from "@/domain/sfenx";
import {
  insertFavoriteMove,
  removeFavoriteMove,
} from "@/store/favorite-moves.svelte";

import {
  toggleFavorite,
  getNode,
  getNodesSize,
} from "@/store/kifu-node.svelte";

export function clickFavoriteIcon(index: number) {
  let { prev, move, isSente, isFavorite } = getNode(index);
  let { sfenx } = getNode(prev);
  if (isSente) {
    sfenx = flipSfenx(sfenx);
    move = flipMove(move);
  }
  if (isFavorite) {
    removeFavoriteMove(sfenx, move);
  } else {
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
