import type { KifuNode } from "@/types/shogi";

let currentIndex: number = $state(-1);

let nodes: KifuNode[] = $state([]);

export function initKifuNodes(node: KifuNode) {
  nodes = [node];
  currentIndex = 0;
}

export function getCurrentIndex(): number {
  return currentIndex;
}

export function setCurrentIndex(index: number) {
  currentIndex = index;
}

export function pushKifuNode(
  display: string,
  sfenx: string,
  isSente: boolean,
  move: string,
  isFavorite: boolean = false
) {
  const newIndex = nodes.length;
  const curNextIndex = nodes[currentIndex].next;
  nodes[currentIndex].next = newIndex;
  let br_next = newIndex;
  let br_prev = newIndex;
  if (curNextIndex !== -1) {
    const curNextBrPrev = nodes[curNextIndex].br_prev;
    nodes[curNextBrPrev].br_next = newIndex;
    br_prev = curNextBrPrev;
    nodes[curNextIndex].br_prev = newIndex;
    br_next = curNextIndex;
  }
  nodes.push({
    display,
    sfenx,
    prev: currentIndex,
    next: -1,
    br_next,
    br_prev,
    isSente,
    move,
    isFavorite,
  });
  currentIndex = newIndex;
}

export function getNode(index: number): KifuNode {
  return nodes[index];
}

export function setChildNode(parIndex: number, childIndex: number) {
  nodes[parIndex].next = childIndex;
}

export function toggleFavorite(index: number) {
  nodes[index].isFavorite = !nodes[index].isFavorite;
}

let branches: number[] = $state([]);

export function getBranches() {
  return branches;
}
export function setBranches(baseNodeIndex: number) {
  let cur = baseNodeIndex;
  if (cur === 0) {
    branches = [];
    return;
  }
  branches = [cur];
  cur = nodes[cur].br_next;
  while (cur !== baseNodeIndex) {
    branches.push(cur);
    cur = nodes[cur].br_next;
  }
}
