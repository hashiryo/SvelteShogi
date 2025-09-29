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

export class NodesStore {
  static reset() {
    nodes = [];
  }
  static size() {
    return nodes.length;
  }
  static push(
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
      isSaved: false,
    });
  }
  static getNode(index: number) {
    return nodes[index];
  }
  static setChildNode(parIndex: number, childIndex: number) {
    nodes[parIndex].next = childIndex;
  }
  static setBranchNode(preIndex: number, nexIndex: number) {
    nodes[preIndex].br_next = nexIndex;
  }
  static setFavorite(index: number, isFavorite: boolean) {
    nodes[index].isFavorite = isFavorite;
  }
  static getPath(root: number) {
    let ret = [];
    let cur = root;
    while (cur !== -1) {
      ret.push(cur);
      cur = nodes[cur].next;
    }
    return ret;
  }
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
