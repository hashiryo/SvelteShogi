let canMove: boolean[] = $state(Array(81).fill(false));

export class CanMoveStore {
  static get(row: number, col: number): boolean {
    return canMove[row * 9 + col];
  }
  static set(row: number, col: number) {
    canMove[row * 9 + col] = true;
  }
  static reset(row: number, col: number) {
    canMove[row * 9 + col] = false;
  }
  static setAll() {
    canMove.fill(true);
  }
  static resetAll() {
    canMove.fill(false);
  }
}

let promotionPos: { row: number; col: number } | null = $state(null);

export class PromotionPosStore {
  static get(): { row: number; col: number } | null {
    return promotionPos;
  }
  static set(row: number, col: number) {
    promotionPos = { row, col };
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
  static set(row: number, col: number) {
    lastPos = { row, col };
  }
  static reset() {
    lastPos = null;
  }
}
