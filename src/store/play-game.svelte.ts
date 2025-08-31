let canMove = $state(Array(81).fill(false));

export function getCanMove(row: number, col: number): boolean {
  return canMove[row * 9 + col];
}

export function setCanMoveSquare(row: number, col: number) {
  canMove[row * 9 + col] = true;
}

export function resetCanMoveSquare(row: number, col: number) {
  canMove[row * 9 + col] = false;
}

export function setCanMoveAll() {
  canMove.fill(true);
}

export function resetCanMoveAll() {
  canMove.fill(false);
}

let promotionPos = $state(null) as { row: number; col: number } | null;

export function getPromotionPos(): { row: number; col: number } | null {
  return promotionPos;
}

export function setPromotionPos(row: number, col: number) {
  promotionPos = { row, col };
}

export function resetPromotionPos() {
  promotionPos = null;
}

let lastPos = $state(null) as { row: number; col: number } | null;

export function getLastPos(): { row: number; col: number } | null {
  return lastPos;
}

export function setLastPos(row: number, col: number) {
  lastPos = { row, col };
}

export function resetLastPos() {
  lastPos = null;
}
