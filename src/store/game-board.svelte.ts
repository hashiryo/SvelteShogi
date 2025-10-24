import type { PieceType, Square, HandPieceFrom, Captures } from "@/types/shogi";

let grid: (Square | null)[] = $state([]);

export class GridStore {
  static get(): (Square | null)[] {
    return grid;
  }
  static set(newGrid: (Square | null)[]) {
    grid = newGrid;
  }
  static getSquare(row: number, col: number): Square | null {
    return grid[row * 9 + col];
  }
  static setSquare(
    row: number,
    col: number,
    piece: PieceType,
    isSente: boolean
  ) {
    grid[row * 9 + col] = { piece, isSente };
  }
  static resetSquare(row: number, col: number) {
    grid[row * 9 + col] = null;
  }
}

let capturedSente: Captures = $state([]);
let capturedGote: Captures = $state([]);

export class CapturesStore {
  static get(isSente: boolean): Captures {
    return isSente ? capturedSente : capturedGote;
  }
  static set(isSente: boolean, captured: Captures) {
    if (isSente) {
      capturedSente = captured;
    } else {
      capturedGote = captured;
    }
  }
  static getNum(isSente: boolean, piece: PieceType): number {
    const found = isSente
      ? capturedSente.find((p) => p.piece === piece)
      : capturedGote.find((p) => p.piece === piece);
    return found ? found.num : 0;
  }
}

let handPiece: HandPieceFrom | null = $state(null);

export class HandPieceStore {
  static get(): HandPieceFrom | null {
    return handPiece;
  }
  static reset() {
    handPiece = null;
  }
  static set(value: HandPieceFrom) {
    handPiece = value;
  }
}

let isSenteTurn = $state(true);

export class IsSenteTurnStore {
  static get(): boolean {
    return isSenteTurn;
  }
  static set(isSente: boolean) {
    isSenteTurn = isSente;
  }
}

let reverse = $state(false);

export class ReverseStore {
  static get(): boolean {
    return reverse;
  }
  static set(isReverse: boolean) {
    reverse = isReverse;
  }
}
