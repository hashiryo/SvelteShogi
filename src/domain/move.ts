import { charToPieceTypeMap, strToPosition } from "@/domain/sfenx";
import { originalPiece, promotePiece } from "@/domain/shogi-rule";
import type { Captures, PieceType, Square } from "@/types/shogi";

function increment(captures: Captures, piece: PieceType): Captures {
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

  const found = captures.find((p) => p.piece === piece);
  if (found) {
    found.num += 1;
  } else {
    captures.push({ piece, num: 1 });
  }
  captures.sort((a, b) => TYPE_ORDER[a.piece] - TYPE_ORDER[b.piece]);
  return captures;
}

function decrement(captures: Captures, piece: PieceType): Captures {
  const index = captures.findIndex((p) => p.piece === piece);
  if (index !== -1) {
    captures[index].num -= 1;
    if (captures[index].num <= 0) {
      captures.splice(index, 1);
    }
  }
  return captures;
}

function executeFromGrid(
  grid: (Square | null)[],
  captures: Captures,
  from: { row: number; col: number },
  to: { row: number; col: number },
  prom: boolean
): {
  grid: (Square | null)[];
  captures: Captures;
  lastPos: { row: number; col: number };
} {
  const fromIdx = from.row * 9 + from.col;
  const toIdx = to.row * 9 + to.col;
  const fromSquare = grid[fromIdx];
  if (!fromSquare)
    throw new Error(`Square at (${from.row}, ${from.col}) does not exist.`);
  const toSquare = grid[toIdx];
  if (toSquare) {
    captures = increment(captures, originalPiece(toSquare.piece));
  }
  grid[fromIdx] = null;
  grid[toIdx] = {
    piece: prom ? promotePiece(fromSquare.piece) : fromSquare.piece,
    isSente: fromSquare.isSente,
  };
  return { grid, captures, lastPos: to };
}

function executeFromCaptures(
  grid: (Square | null)[],
  captures: Captures,
  isSente: boolean,
  to: { row: number; col: number },
  piece: PieceType
): {
  grid: (Square | null)[];
  captures: Captures;
  lastPos: { row: number; col: number };
} {
  grid[to.row * 9 + to.col] = {
    piece,
    isSente,
  };
  captures = decrement(captures, piece);
  return { grid, captures, lastPos: to };
}

export function moveToNextGridCaptures(
  grid: (Square | null)[],
  captures: Captures,
  isSente: boolean,
  move: string
): {
  grid: (Square | null)[];
  captures: Captures;
  lastPos: { row: number; col: number };
} {
  const match1 = move.match(/^(\d)([a-i])(\d)([a-i])(\+)?$/);
  if (match1) {
    const [, fromColStr, fromRowStr, toColStr, toRowStr, prom] = match1;
    const from = strToPosition(`${fromColStr}${fromRowStr}`);
    const to = strToPosition(`${toColStr}${toRowStr}`);
    return executeFromGrid(grid, captures, from, to, prom ? true : false);
  }

  const match2 = move.match(/^([A-Z])\*(\d)([a-i])$/);
  if (match2) {
    const [, pieceChar, toColStr, toRowStr] = match2;
    const to = strToPosition(`${toColStr}${toRowStr}`);
    const piece = charToPieceTypeMap[pieceChar];
    return executeFromCaptures(grid, captures, isSente, to, piece);
  }

  throw new Error(`Invalid move: ${move}`);
}
