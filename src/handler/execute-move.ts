import {
  charToPieceTypeMap,
  shogiPositionToSfenx,
  strToPosition,
} from "@/domain/sfenx";
import {
  GridStore,
  IsSenteTurnStore,
  decrementCaptured,
  getCaptured,
  incrementCaptured,
  HandPieceStore,
} from "@/store/game-board.svelte";
import {
  CurrentIndexStore,
  NodesStore,
  BranchesStore,
} from "@/store/kifu-node.svelte";
import {
  CanMoveStore,
  PromotionPosStore,
  LastPosStore,
} from "@/store/play-game.svelte";
import { fetchAndSetFavoriteMoves, getCurFavorite } from "./favorite-moves";
import { originalPiece, promotePiece } from "@/domain/shogi-rule";

function pushOrJumpToKifu(
  display: string,
  sfenx: string,
  isSenteNext: boolean,
  move: string
) {
  const currentIndex = CurrentIndexStore.get();
  const newIndex = NodesStore.size();
  const currentNode = NodesStore.getNode(currentIndex);
  const curNextIndex = currentNode.next;
  let br_next = newIndex;
  if (curNextIndex !== -1) {
    let cur = curNextIndex;
    do {
      const node = NodesStore.getNode(cur);
      if (node.display === display) {
        NodesStore.setChildNode(currentIndex, cur);
        CurrentIndexStore.set(cur);
        return;
      }
      cur = node.br_next;
    } while (cur !== curNextIndex);
    br_next = NodesStore.getNode(curNextIndex).br_next;
    NodesStore.setBranchNode(curNextIndex, newIndex);
  }

  const moves = getCurFavorite(currentNode.isSente, currentNode.sfenx);
  const isFavorite = moves ? moves.includes(move) : false;

  NodesStore.push(
    display,
    sfenx,
    currentIndex,
    br_next,
    isSenteNext,
    move,
    isFavorite
  );
  NodesStore.setChildNode(currentIndex, newIndex);
  CurrentIndexStore.set(newIndex);
}

export async function executeMove(display: string, move: string) {
  const isSente = IsSenteTurnStore.get();

  const match1 = move.match(/^(\d)([a-i])(\d)([a-i])(\+)?$/);
  if (match1) {
    const [, fromColStr, fromRowStr, toColStr, toRowStr, prom] = match1;
    const from = strToPosition(`${fromColStr}${fromRowStr}`);
    const to = strToPosition(`${toColStr}${toRowStr}`);
    const fromSquare = GridStore.getSquare(from.row, from.col);
    if (!fromSquare)
      throw new Error(`Square at (${from.row}, ${from.col}) does not exist.`);
    const toSquare = GridStore.getSquare(to.row, to.col);
    if (toSquare) {
      incrementCaptured(originalPiece(toSquare.piece), !toSquare.isSente);
    }
    GridStore.resetSquare(from.row, from.col);
    GridStore.setSquare(
      to.row,
      to.col,
      prom ? promotePiece(fromSquare.piece) : fromSquare.piece,
      fromSquare.isSente
    );
    LastPosStore.set(to.row, to.col);
  }
  const match2 = move.match(/^([A-Z])\*(\d)([a-i])$/);
  if (match2) {
    const [, pieceChar, toColStr, toRowStr] = match2;
    const { row, col } = strToPosition(`${toColStr}${toRowStr}`);
    const piece = charToPieceTypeMap[pieceChar];
    GridStore.setSquare(row, col, piece, isSente);
    decrementCaptured(piece, isSente);
    LastPosStore.set(row, col);
  }

  CanMoveStore.resetAll();
  PromotionPosStore.reset();
  HandPieceStore.reset();

  const sfenx = shogiPositionToSfenx(
    GridStore.get(),
    getCaptured(true),
    getCaptured(false)
  );
  pushOrJumpToKifu(display, sfenx, !isSente, move);

  BranchesStore.set(CurrentIndexStore.get());
  await fetchAndSetFavoriteMoves(!isSente, sfenx);
  IsSenteTurnStore.set(!isSente);
}
