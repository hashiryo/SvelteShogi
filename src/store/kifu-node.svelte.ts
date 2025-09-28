import type { KifuNode } from "@/types/shogi";

let currentIndex: number = $state(-1);

export class CurrentIndexStore {
  static get() {
    return currentIndex;
  }
  static set(index: number) {
    currentIndex = index;
  }
}

let nodes: KifuNode[] = $state([]);

export function resetNodes() {
  nodes = [];
}

export function getNodesSize() {
  return nodes.length;
}

export function pushKifuNode(
  display: string,
  sfenx: string,
  prev: number,
  br_next: number,
  isSente: boolean,
  move: string,
  isFavorite: boolean
) {
  nodes.push({
    display,
    sfenx,
    prev,
    next: -1,
    br_next,
    isSente,
    move,
    isFavorite,
  });
}

export function getNode(index: number): KifuNode {
  return nodes[index];
}

export function setChildNode(parIndex: number, childIndex: number) {
  nodes[parIndex].next = childIndex;
}

export function setBranchNode(preIndex: number, nexIndex: number) {
  nodes[preIndex].br_next = nexIndex;
}

export function toggleFavorite(index: number) {
  nodes[index].isFavorite = !nodes[index].isFavorite;
}

export function setFavorite(index: number, isFavorite: boolean) {
  nodes[index].isFavorite = isFavorite;
}

let branches: number[] = $state([]);

export class BranchesStore {
  static get() {
    return branches;
  }
  static set(baseNodeIndex: number) {
    let cur = baseNodeIndex;
    branches = [];
    do {
      branches.push(cur);
      cur = nodes[cur].br_next;
    } while (cur !== baseNodeIndex);
  }
}
