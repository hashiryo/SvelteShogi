import {
  charToPieceTypeMap,
  flipMove,
  flipSfenx,
  shogiPositionToSfenx,
  strToPosition,
} from "@/domain/sfenx";
import { getFavoriteMoves } from "@/store/favorite-moves.svelte";
import {
  decrementCaptured,
  getCaptured,
  getGrid,
  getIsSenteTurn,
  getSquare,
  incrementCaptured,
  resetHandPiece,
  resetSquare,
  setSquare,
  toggleTurn,
} from "@/store/game-board.svelte";
import {
  getCurrentIndex,
  getNode,
  getNodesSize,
  pushKifuNode,
  setBranches,
  setBranchNode,
  setChildNode,
  setCurrentIndex,
} from "@/store/kifu-node.svelte";
import {
  resetCanMoveAll,
  resetPromotionPos,
  setLastPos,
} from "@/store/play-game.svelte";
import { fetchAndSetFavoriteMoves } from "./favorite-moves";
import { originalPiece, promotePiece } from "@/domain/shogi-rule";

function pushOrJumpToKifu(
  display: string,
  sfenx: string,
  isSenteNext: boolean,
  move: string
) {
  const currentIndex = getCurrentIndex();
  const newIndex = getNodesSize();
  const currentNode = getNode(currentIndex);
  const curNextIndex = currentNode.next;
  let br_next = newIndex;
  if (curNextIndex !== -1) {
    let cur = curNextIndex;
    do {
      const node = getNode(cur);
      if (node.display === display) {
        setChildNode(currentIndex, cur);
        setCurrentIndex(cur);
        return;
      }
      cur = node.br_next;
    } while (cur !== curNextIndex);
    br_next = getNode(curNextIndex).br_next;
    setBranchNode(curNextIndex, newIndex);
  }

  let isFavorite = false;
  // ここではすでに favorite は取得されているはず
  // ToDo: もし以前のタイミングで favorite が取得できてなかった場合、ここで再取得する のを実装 (await でやる)
  if (isSenteNext) {
    const moves = getFavoriteMoves(flipSfenx(currentNode.sfenx));
    isFavorite = moves ? moves.includes(flipMove(move)) : false;
  } else {
    const moves = getFavoriteMoves(currentNode.sfenx);
    isFavorite = moves ? moves.includes(move) : false;
  }

  pushKifuNode(
    display,
    sfenx,
    currentIndex,
    br_next,
    isSenteNext,
    move,
    isFavorite
  );
  setChildNode(currentIndex, newIndex);
  setCurrentIndex(newIndex);
}

export async function executeMove(display: string, move: string) {
  const isSente = getIsSenteTurn();

  const match1 = move.match(/^(\d)([a-i])(\d)([a-i])(\+)?$/);
  if (match1) {
    const [, fromColStr, fromRowStr, toColStr, toRowStr, prom] = match1;
    const from = strToPosition(`${fromColStr}${fromRowStr}`);
    const to = strToPosition(`${toColStr}${toRowStr}`);
    const fromSquare = getSquare(from.row, from.col);
    if (!fromSquare)
      throw new Error(`Square at (${from.row}, ${from.col}) does not exist.`);
    const toSquare = getSquare(to.row, to.col);
    if (toSquare) {
      incrementCaptured(originalPiece(toSquare.piece), !toSquare.isSente);
    }
    resetSquare(from.row, from.col);
    setSquare(
      to.row,
      to.col,
      prom ? promotePiece(fromSquare.piece) : fromSquare.piece,
      fromSquare.isSente
    );
    setLastPos(to.row, to.col);
  }
  const match2 = move.match(/^([A-Z])\*(\d)([a-i])$/);
  if (match2) {
    const [, pieceChar, toColStr, toRowStr] = match2;
    const { row, col } = strToPosition(`${toColStr}${toRowStr}`);
    const piece = charToPieceTypeMap[pieceChar];
    setSquare(row, col, piece, isSente);
    decrementCaptured(piece, isSente);
    setLastPos(row, col);
  }

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
  pushOrJumpToKifu(display, sfenx, !isSente, move);

  setBranches(getCurrentIndex());
  await fetchAndSetFavoriteMoves(!isSente, sfenx);
}
