import type { PieceType } from '../types/shogi';

import { getSquare, 
         setSquare, 
         resetSquare, 
         getNumCaptured, 
         incrementCaptured, 
         decrementCaptured, 
         getHandPiece,
         setHandPieceFromSquare,
         setHandPieceFromCaptured,
         resetHandPiece,
         getIsSenteTurn,
         toggleTurn
       } from '../store/game-board-store.svelte';

import { getCanMove, 
         setCanMoveSquare, 
         setCanMoveAll, 
         resetCanMoveSquare,
         resetCanMoveAll,
         getPromotionPos, 
         setPromotionPos, 
         resetPromotionPos 
        } from '../store/play-game-store.svelte';

import { getPieceMoveVec } from '../domain/shogi-move';

function setCanMoveFromSquare(row: number, col: number) {
  resetCanMoveAll();
  const square = getSquare(row, col);
  if (!square) throw new Error(`Square at (${row}, ${col}) does not exist.`);
  const vec = getPieceMoveVec(square.piece);
  for (const {r, c, slide} of vec) {
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
  if (piece === '歩') {
    for(let c=0; c<9; c++) {
      resetCanMoveSquare(isSente ? 0 : 8, c); // Place pawn on the first or last row
      let nifu = false;
      for(let r=0; r<9; r++) {
        const square = getSquare(r, c);
        if (square && square.isSente === isSente) {
          if (square.piece === '歩') {
            nifu = true; // Found another pawn in the same column
            break;
          }
        }
      }
      if (nifu) {
        for(let r=0; r<9; r++) resetCanMoveSquare(r, c);
      }
    }
  }
  if (piece === '香') {
    for(let c=0; c<9; c++) resetCanMoveSquare(isSente ? 0 : 8, c);
  }
  if (piece === '桂') {
    for(let c=0; c<9; c++) {
      resetCanMoveSquare(isSente ? 0 : 8, c);
      resetCanMoveSquare(isSente ? 1 : 7, c);
    }
  }
}

function turnEnd() {
  toggleTurn();
  resetCanMoveAll();
  resetPromotionPos();
  resetHandPiece();
}

export function clickSquareHandler(row: number, col: number) {
  console.log(`clickSquareHandler: row=${row}, col=${col}`);
  const square = getSquare(row, col);
  const handPiece = getHandPiece();
  const isSenteTurn = getIsSenteTurn();
  if(!handPiece) {
    if (square && square.isSente === isSenteTurn) {
      setHandPieceFromSquare(row, col);
      setCanMoveFromSquare(row, col);
    }
    return;
  }
  if('row' in handPiece && handPiece.row === row && handPiece.col === col) {
    resetHandPiece();
    return;
  }
  if(!getCanMove(row, col)) {
    if (square && square.isSente === isSenteTurn) {
      setHandPieceFromSquare(row, col);
      setCanMoveFromSquare(row, col);
    } else {
      resetHandPiece();
    }
    return;
  }

  if('piece' in handPiece) {
    setSquare(row, col, handPiece.piece, handPiece.isSente);
    decrementCaptured(handPiece.piece, handPiece.isSente);  
    turnEnd();
    return;  
  }

  const fromSquare = getSquare(handPiece.row, handPiece.col);
  if (!fromSquare) throw new Error(`Square at (${handPiece.row}, ${handPiece.col}) does not exist.`);
  if (square) {
    incrementCaptured(square.piece, !square.isSente);
  }
  resetSquare(handPiece.row, handPiece.col);
  setSquare(row, col, fromSquare.piece, fromSquare.isSente);
  turnEnd();
  return;
}

export function clickCapturedHandler(piece: PieceType, isSente: boolean) {
  console.log(`clickCapturedHandler: piece=${piece}, isSente=${isSente}`);
  const handPiece = getHandPiece();
  const isSenteTurn = getIsSenteTurn();
  if (isSente === isSenteTurn) {
    if (handPiece && 'piece' in handPiece && handPiece.piece === piece) {
        resetHandPiece();
    }else{
        setHandPieceFromCaptured(piece, isSente);
        setCanMoveFromCaptured(piece, isSente);
    }
    return;
  }
  resetHandPiece();
}
  