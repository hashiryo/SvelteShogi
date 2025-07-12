import {getSquare, 
        setSquare, 
        resetSquare, 
        getNumCaptured, 
        incrementCaptured, 
        decrementCaptured, 
        getHandPiece,
        setHandPieceFromSquare,
        setHandPieceFromCaptured,
        resetHandPiece
       } from '../store/game-board-store.svelte';

export function clickSquareHandler(row: number, col: number) {
  console.log(`clickSquareHandler: row=${row}, col=${col}`);
  const square = getSquare(row, col);
  const handPiece = getHandPiece();
  if(!handPiece) {
    if (square) {
      setHandPieceFromSquare(row, col);
    }
    return;
  }
  if('row' in handPiece && handPiece.row === row && handPiece.col === col) {
    resetHandPiece();
    return;
  }
}        