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
  static get() {
    return nodes;
  }
  static set(value: KifuNode[]) {
    nodes = value;
  }
  static reset() {
    nodes = [];
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
  static setSaved(index: number, isSaved: boolean) {
    nodes[index].isSaved = isSaved;
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
  static set(value: number[]) {
    branches = value;
  }
}
