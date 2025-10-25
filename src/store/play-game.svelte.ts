import type { Position } from "@/types/shogi";

let canMove: boolean[] = $state(Array(81).fill(false));

export class CanMoveStore {
  static get(): boolean[] {
    return canMove;
  }
  static set(value: boolean[]) {
    canMove = { ...value };
  }
}

let promotionPos: Position | null = $state(null);

export class PromotionPosStore {
  static get(): Position | null {
    return promotionPos;
  }
  static set(value: Position) {
    promotionPos = { ...value };
  }
  static reset() {
    promotionPos = null;
  }
}

let lastPos: Position | null = $state(null);

export class LastPosStore {
  static get(): Position | null {
    return lastPos;
  }
  static set(pos: Position) {
    lastPos = pos;
  }
  static reset() {
    lastPos = null;
  }
}
