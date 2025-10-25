import type {
  PieceType,
  PlayerPiece,
  HandPieceFrom,
  Captures,
} from "@/types/shogi";

let grid: (PlayerPiece | null)[] = $state([]);

export class GridStore {
  static get(): (PlayerPiece | null)[] {
    return grid;
  }
  static set(newGrid: (PlayerPiece | null)[]) {
    grid = newGrid;
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
