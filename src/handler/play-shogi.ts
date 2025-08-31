import type { PieceType } from "@/types/shogi";

import {
  getSquare,
  setSquare,
  resetSquare,
  getGrid,
  getNumCaptured,
  incrementCaptured,
  decrementCaptured,
  getHandPiece,
  setHandPieceFromSquare,
  setHandPieceFromCaptured,
  resetHandPiece,
  getIsSenteTurn,
  toggleTurn,
  getCaptured,
} from "@/store/game-board.svelte";

import {
  getCanMove,
  setCanMoveSquare,
  setCanMoveAll,
  resetCanMoveSquare,
  resetCanMoveAll,
  getPromotionPos,
  setPromotionPos,
  resetPromotionPos,
  setLastPos,
  getLastPos,
} from "@/store/play-game.svelte";

import { addHistoryNode, getCurrentIndex } from "@/store/kifu-history.svelte";

import {
  getPieceMoveVec,
  promotePiece,
  originalPiece,
} from "@/domain/shogi-rule";

import {
  pieceTypeToCharMap,
  shogiPositionToSfenx,
  positionToStr,
} from "@/domain/sfenx";

import { KANJI_NUM, ZENKAKU_NUM } from "@/domain/display";

function setCanMoveFromSquare(row: number, col: number) {
  resetCanMoveAll();
  const square = getSquare(row, col);
  if (!square) throw new Error(`Square at (${row}, ${col}) does not exist.`);
  const vec = getPieceMoveVec(square.piece);
  for (const { r, c, slide } of vec) {
    const rv = square.isSente ? r : -r; // Reverse direction for gote
    const rc = c;
    let nr = row + rv;
    let nc = col + rc;
    while (nr >= 0 && nr < 9 && nc >= 0 && nc < 9) {
      const targetSquare = getSquare(nr, nc);
      if (targetSquare) {
        if (targetSquare.isSente !== square.isSente) {
          setCanMoveSquare(nr, nc); // Can capture opponent's piece
        }
        break;
      } else {
        setCanMoveSquare(nr, nc); // Empty square can be moved to
      }
      if (!slide) break; // If not sliding piece, stop here
      nr += rv;
      nc += rc;
    }
  }
}

function setCanMoveFromCaptured(piece: PieceType, isSente: boolean) {
  setCanMoveAll();
  const vec = getPieceMoveVec(piece);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (getSquare(r, c)) resetCanMoveSquare(r, c); // Reset canMove for occupied squares
    }
  }
  if (piece === "歩") {
    for (let c = 0; c < 9; c++) {
      resetCanMoveSquare(isSente ? 0 : 8, c); // Place pawn on the first or last row
      let nifu = false;
      for (let r = 0; r < 9; r++) {
        const square = getSquare(r, c);
        if (square && square.isSente === isSente) {
          if (square.piece === "歩") {
            nifu = true; // Found another pawn in the same column
            break;
          }
        }
      }
      if (nifu) {
        for (let r = 0; r < 9; r++) resetCanMoveSquare(r, c);
      }
    }
  }
  if (piece === "香") {
    for (let c = 0; c < 9; c++) resetCanMoveSquare(isSente ? 0 : 8, c);
  }
  if (piece === "桂") {
    for (let c = 0; c < 9; c++) {
      resetCanMoveSquare(isSente ? 0 : 8, c);
      resetCanMoveSquare(isSente ? 1 : 7, c);
    }
  }
}

function turnEnd(display: string, move: string) {
  toggleTurn();
  resetCanMoveAll();
  resetPromotionPos();
  resetHandPiece();
  resetPromotionPos();
  const sfenx = shogiPositionToSfenx(
    getGrid(),
    getCaptured(true),
    getCaptured(false)
  );
  addHistoryNode(display, sfenx, true, move, false);
}

export function clickSquareHandler(row: number, col: number) {
  console.log(`clickSquareHandler: row=${row}, col=${col}`);
  const square = getSquare(row, col);
  const handPiece = getHandPiece();
  const isSenteTurn = getIsSenteTurn();
  if (!handPiece) {
    if (square && square.isSente === isSenteTurn) {
      setHandPieceFromSquare(square.piece, square.isSente, { row, col });
      setCanMoveFromSquare(row, col);
      resetPromotionPos();
    }
    return;
  }
  const handPiecePos = handPiece.position;
  if (handPiecePos && handPiecePos.row === row && handPiecePos.col === col) {
    resetHandPiece();
    resetPromotionPos();
    return;
  }
  if (!getCanMove(row, col)) {
    if (square && square.isSente === isSenteTurn) {
      setHandPieceFromSquare(square.piece, square.isSente, { row, col });
      setCanMoveFromSquare(row, col);
      resetPromotionPos();
    } else {
      resetHandPiece();
      resetPromotionPos();
    }
    return;
  }

  if (!handPiecePos) {
    let display = `${isSenteTurn ? "☗" : "☖"}${ZENKAKU_NUM[col]}${
      KANJI_NUM[row]
    }${handPiece.piece}`;
    setSquare(row, col, handPiece.piece, handPiece.isSente);
    decrementCaptured(handPiece.piece, handPiece.isSente);
    const ts = positionToStr(row, col);
    setLastPos(row, col);
    turnEnd(display, `${pieceTypeToCharMap[handPiece.piece]}*${ts}`);
    return;
  }

  if (
    isSenteTurn
      ? handPiecePos.row < 3 || row < 3
      : handPiecePos.row > 5 || row > 5
  ) {
    const promotedPiece = promotePiece(handPiece.piece);
    if (promotedPiece !== handPiece.piece) {
      setPromotionPos(row, col);
      return;
    }
  }

  const fromSquare = getSquare(handPiecePos.row, handPiecePos.col);
  if (!fromSquare)
    throw new Error(
      `Square at (${handPiecePos.row}, ${handPiecePos.col}) does not exist.`
    );
  if (square) {
    incrementCaptured(originalPiece(square.piece), !square.isSente);
  }
  let display = isSenteTurn ? "☗" : "☖";
  const lastPos = getLastPos();
  if (lastPos && lastPos.row === row && lastPos.col === col) {
    display += "同　";
  } else {
    display += `${ZENKAKU_NUM[col]}${KANJI_NUM[row]}`;
  }
  display += handPiece.piece;
  resetSquare(handPiecePos.row, handPiecePos.col);
  setSquare(row, col, fromSquare.piece, fromSquare.isSente);
  const fs = positionToStr(handPiecePos.row, handPiecePos.col);
  const ts = positionToStr(row, col);
  setLastPos(row, col);
  turnEnd(display, `${fs}${ts}`);
  return;
}

export function clickCapturedHandler(piece: PieceType, isSente: boolean) {
  console.log(`clickCapturedHandler: piece=${piece}, isSente=${isSente}`);
  const handPiece = getHandPiece();
  const isSenteTurn = getIsSenteTurn();
  if (isSente === isSenteTurn) {
    if (handPiece && !handPiece.position && handPiece.isSente === isSente) {
      resetHandPiece();
      resetPromotionPos();
    } else {
      setHandPieceFromCaptured(piece, isSente);
      setCanMoveFromCaptured(piece, isSente);
      resetPromotionPos();
    }
    return;
  }
  resetHandPiece();
  resetPromotionPos();
}

export function clickPromotionHandler(getPromote: boolean) {
  console.log(`clickPromotionHandler: getPromote=${getPromote}`);
  const handPiece = getHandPiece();
  if (!handPiece) throw new Error("No hand piece selected for promotion.");
  const handPiecePos = handPiece.position;
  if (!handPiecePos) throw new Error("Hand piece is not from a square.");
  const promotionPos = getPromotionPos();
  if (!promotionPos) throw new Error("No promotion position set.");
  const { row, col } = promotionPos;
  const fromSquare = getSquare(handPiecePos.row, handPiecePos.col);
  if (!fromSquare)
    throw new Error(
      `Square at (${handPiecePos.row}, ${handPiecePos.col}) does not exist.`
    );
  const square = getSquare(row, col);
  if (square) {
    incrementCaptured(originalPiece(square.piece), !square.isSente);
  }
  let display = getIsSenteTurn() ? "☗" : "☖";
  const lastPos = getLastPos();
  if (lastPos && lastPos.row === row && lastPos.col === col) {
    display += "同　";
  } else {
    display += `${ZENKAKU_NUM[col]}${KANJI_NUM[row]}`;
  }
  display += handPiece.piece;
  resetSquare(handPiecePos.row, handPiecePos.col);
  setSquare(
    row,
    col,
    getPromote ? promotePiece(fromSquare.piece) : fromSquare.piece,
    fromSquare.isSente
  );
  const fs = positionToStr(handPiecePos.row, handPiecePos.col);
  const ts = positionToStr(row, col);
  setLastPos(row, col);
  turnEnd(display, `${fs}${ts}${getPromote ? "+" : ""}`);
}
