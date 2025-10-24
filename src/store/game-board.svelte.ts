import type { PieceType, Square, HandPieceFrom } from "@/types/shogi";

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

let capturedSente: { piece: PieceType; num: number }[] = $state([]);
let capturedGote: { piece: PieceType; num: number }[] = $state([]);

const TYPE_ORDER: Record<PieceType, number> = {
  歩: 1,
  香: 2,
  桂: 3,
  銀: 4,
  金: 5,
  角: 6,
  飛: 7,
  玉: 8,
  と: 9,
  杏: 10,
  圭: 11,
  全: 12,
  馬: 13,
  竜: 14,
};

export class CapturedStore {
  static get(isSente: boolean): { piece: PieceType; num: number }[] {
    return isSente ? capturedSente : capturedGote;
  }
  static set(isSente: boolean, captured: { piece: PieceType; num: number }[]) {
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

  static increment(isSente: boolean, piece: PieceType) {
    const found = isSente
      ? capturedSente.find((p) => p.piece === piece)
      : capturedGote.find((p) => p.piece === piece);
    if (found) {
      found.num += 1;
    } else {
      (isSente ? capturedSente : capturedGote).push({ piece, num: 1 });
    }
    (isSente ? capturedSente : capturedGote).sort(
      (a, b) => TYPE_ORDER[a.piece] - TYPE_ORDER[b.piece]
    );
  }

  static decrement(isSente: boolean, piece: PieceType) {
    const index = isSente
      ? capturedSente.findIndex((p) => p.piece === piece)
      : capturedGote.findIndex((p) => p.piece === piece);
    if (index !== -1) {
      (isSente ? capturedSente : capturedGote)[index].num -= 1;
      if ((isSente ? capturedSente : capturedGote)[index].num <= 0) {
        (isSente ? capturedSente : capturedGote).splice(index, 1);
      }
    }
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
