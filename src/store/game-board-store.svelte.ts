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

let capturedSente: {piece: PieceType, num: number}[] = $state([{"piece": "歩", "num": 1}]);
let capturedGote: {piece: PieceType, num: number}[] = $state([{"piece": "歩", "num": 1}]);

let handPiece: HandPieceFrom = $state(null);

export function getSquare(row: number, col: number): Square | null {
  return grid[row * 9 + col];
}

export function setSquare(row: number, col: number, piece: PieceType, isSente: boolean) {
  grid[row * 9 + col] = { piece, isSente };
}

export function resetSquare(row: number, col: number) {
  grid[row * 9 + col] = null;
}

export function getNumCapturedSente(piece: PieceType): number {
  const found = capturedSente.find(p => p.piece === piece);
  return found ? found.num : 0;
}

export function getCapturedSente(): {piece: PieceType, num: number}[] {
  return capturedSente;
}

export function getNumCapturedGote(piece: PieceType): number {
  const found = capturedGote.find(p => p.piece === piece);
  return found ? found.num : 0;
}

export function getCapturedGote(): {piece: PieceType, num: number}[] {
  return capturedGote;
}

export function addCapturedSente(piece: PieceType, num: number) {
  const found = capturedSente.find(p => p.piece === piece);
  if (found) {
    found.num += num;
  } else {
    capturedSente.push({ piece, num });
  }
}

export function addCapturedGote(piece: PieceType, num: number) {
  const found = capturedGote.find(p => p.piece === piece);
  if (found) {
    found.num += num;
  } else {
    capturedGote.push({ piece, num });
  }
}

export function setHandPieceFromBoard(row: number, col: number){
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