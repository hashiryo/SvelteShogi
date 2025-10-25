import { getCurrentFavorites } from "@/handler/favorite-moves";
import type { KifuNode } from "@/types/shogi";

export function pushOrJumpToKifu(
  currentIndex: number,
  nodes: KifuNode[],
  display: string,
  sfenx: string,
  isSenteNext: boolean,
  move: string
): { nodes: KifuNode[]; currentIndex: number } {
  const newIndex = nodes.length;
  const currentNode = nodes[currentIndex];
  const curNextIndex = currentNode.next;
  let br_next = newIndex;
  if (curNextIndex !== -1) {
    let cur = curNextIndex;
    do {
      const node = nodes[cur];
      if (node.move === move) {
        nodes[currentIndex].next = cur;
        return {
          nodes,
          currentIndex: cur,
        };
      }
      cur = node.br_next;
    } while (cur !== curNextIndex);
    br_next = nodes[curNextIndex].br_next;
    nodes[curNextIndex].br_next = newIndex;
  }

  const moves = getCurrentFavorites(currentNode.isSente, currentNode.sfenx);
  const isFavorite = moves ? moves.includes(move) : false;

  nodes.push({
    display,
    sfenx,
    prev: currentIndex,
    next: -1,
    br_next,
    isSente: isSenteNext,
    move,
    isFavorite,
    isSaved: false,
  });
  nodes[currentIndex].next = newIndex;

  return { nodes, currentIndex: newIndex };
}

export function getBranches(nodes: KifuNode[], index: number): number[] {
  let cur = index;
  let branches = [];
  do {
    branches.push(cur);
    cur = nodes[cur].br_next;
  } while (cur !== index);
  return branches;
}
