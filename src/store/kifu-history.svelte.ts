import type { HistoryNode } from "@/types/shogi";

let currentIndex: number = $state(-1);

let history: HistoryNode[] = $state([]);

export function initHistory(node: HistoryNode) {
  history = [node];
  currentIndex = 0;
}

export function getCurrentIndex(): number {
  return currentIndex;
}

export function addHistoryNode(
  display: string,
  sfenx: string,
  isSente: boolean,
  move: string,
  isFavorite: boolean = false
) {
  const newIndex = history.length;
  const curNextIndex = history[currentIndex].next;
  history[currentIndex].next = newIndex;
  let br_next = newIndex;
  let br_prev = newIndex;
  if (curNextIndex !== -1) {
    const curNextBrPrev = history[curNextIndex].br_prev;
    history[curNextBrPrev].br_next = newIndex;
    br_prev = curNextBrPrev;
    history[curNextIndex].br_prev = newIndex;
    br_next = curNextIndex;
  }
  history.push({
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

export function getNode(index: number): HistoryNode {
  return history[index];
}
