import type { PieceType, HandPieceFrom } from '../types/shogi';

type Square = {
  piece: PieceType;
  isSente: boolean;
}

function initGrid(): (Square | null)[] {
  let grid: (Square | null)[] = Array(81).fill(null);
  grid[0] = { piece: "香", isSente: false };
  grid[1] = { piece: "桂", isSente: false };
  grid[2] = { piece: "銀", isSente: false };
  grid[3] = { piece: "金", isSente: false };
  grid[4] = { piece: "玉", isSente: false };
  grid[5] = { piece: "金", isSente: false };
  grid[6] = { piece: "銀", isSente: false };
  grid[7] = { piece: "桂", isSente: false };
  grid[8] = { piece: "香", isSente: false };
  grid[9 + 1] = { piece: "角", isSente: false };
  grid[9 + 7] = { piece: "飛", isSente: false };
  for (let i = 0; i < 9; i++) {
    grid[9 * 2 + i] = { piece: "歩", isSente: false };
  }
  for (let i = 0; i < 9; i++) {
    grid[9 * 6 + i] = { piece: "歩", isSente: true };
  }
  grid[9 * 7 + 1] = { piece: "飛", isSente: true };
  grid[9 * 7 + 7] = { piece: "角", isSente: true };
  grid[9 * 8 + 0] = { piece: "香", isSente: true };
  grid[9 * 8 + 1] = { piece: "桂", isSente: true };
  grid[9 * 8 + 2] = { piece: "銀", isSente: true };
  grid[9 * 8 + 3] = { piece: "金", isSente: true };
  grid[9 * 8 + 4] = { piece: "玉", isSente: true };
  grid[9 * 8 + 5] = { piece: "金", isSente: true };
  grid[9 * 8 + 6] = { piece: "銀", isSente: true };
  grid[9 * 8 + 7] = { piece: "桂", isSente: true };
  grid[9 * 8 + 8] = { piece: "香", isSente: true };
  return grid;
}

let grid: (Square | null)[] = $state(initGrid());

export function getSquare(row: number, col: number): Square | null {
  return grid[row * 9 + col];
}

export function setSquare(row: number, col: number, piece: PieceType, isSente: boolean) {
  grid[row * 9 + col] = { piece, isSente };
}

export function resetSquare(row: number, col: number) {
  grid[row * 9 + col] = null;
}

let capturedSente: {piece: PieceType, num: number}[] = $state([{"piece": "歩", "num": 1}]);
let capturedGote: {piece: PieceType, num: number}[] = $state([{"piece": "歩", "num": 1}]);

export function getNumCaptured(piece: PieceType, isSente: boolean): number {
  const found = isSente ? capturedSente.find(p => p.piece === piece) : capturedGote.find(p => p.piece === piece);
  return found ? found.num : 0;
}

export function getCaptured(isSente: boolean): {piece: PieceType, num: number}[] {
  return isSente ? capturedSente : capturedGote;
}

export function incrementCaptured(piece: PieceType, isSente: boolean) {
  const found = isSente ? capturedSente.find(p => p.piece === piece) : capturedGote.find(p => p.piece === piece);
  if (found) {
    found.num += 1;
  } else {
    (isSente ? capturedSente : capturedGote).push({ piece, num: 1 });
  }
}

export function decrementCaptured(piece: PieceType, isSente: boolean) {
  const index = isSente ? capturedSente.findIndex(p => p.piece === piece) : capturedGote.findIndex(p => p.piece === piece);
  if (index !== -1) {
    (isSente ? capturedSente : capturedGote)[index].num -= 1;
    if ((isSente ? capturedSente : capturedGote)[index].num <= 0) {
      (isSente ? capturedSente : capturedGote).splice(index, 1);
    }
  }
}

let handPiece: HandPieceFrom = $state(null);

export function setHandPieceFromSquare(row: number, col: number){
  handPiece = { row, col };
}

export function setHandPieceFromCaptured(piece: PieceType, isSente: boolean) {
  handPiece = { piece, isSente };
}

export function resetHandPiece() {
  handPiece = null;
}

export function getHandPiece(): HandPieceFrom {
  return handPiece;
}