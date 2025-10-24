let canMove: boolean[] = $state(Array(81).fill(false));

export class CanMoveStore {
  static get(): boolean[] {
    return canMove;
  }
  static set(value: boolean[]) {
    canMove = { ...value };
  }
}

let promotionPos: { row: number; col: number } | null = $state(null);

export class PromotionPosStore {
  static get(): { row: number; col: number } | null {
    return promotionPos;
  }
  static set(value: { row: number; col: number }) {
    promotionPos = { ...value };
  }
  static reset() {
    promotionPos = null;
  }
}

let lastPos: { row: number; col: number } | null = $state(null);

export class LastPosStore {
  static get(): { row: number; col: number } | null {
    return lastPos;
  }
  static set(pos: { row: number; col: number }) {
    lastPos = pos;
  }
  static reset() {
    lastPos = null;
  }
}
