import type { KifuNode } from "@/types/shogi";
import { flipMove, flipSfenx } from "./sfenx";

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

  nodes.push({
    display,
    sfenx,
    prev: currentIndex,
    next: -1,
    br_next,
    isSente: isSenteNext,
    move,
    isFavorite: false,
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

export function setFavorite(
  nodes: KifuNode[],
  sfenx: string,
  move: string,
  isFavorite: boolean
): KifuNode[] {
  const n = nodes.length;
  for (let i = 1; i < n; ++i) {
    let { prev, move: targetMove, isSente } = nodes[i];
    if (isSente) targetMove = flipMove(targetMove);
    if (move === targetMove) {
      let { sfenx: targetSfenx } = nodes[prev];
      if (isSente) targetSfenx = flipSfenx(targetSfenx);
      if (sfenx === targetSfenx) nodes[i].isFavorite = isFavorite;
    }
  }
  return nodes;
}
