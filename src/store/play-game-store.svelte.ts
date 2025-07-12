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

