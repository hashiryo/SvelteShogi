<script lang="ts">
  import GameBoard from "./game-board/GameBoard.svelte";
  import Promote from "./game-board/Promote.svelte";
  import Information from "./information/Information.svelte";
  import type { PieceType, FavoriteFrom, StatisticsFrom } from "@/types/shogi";

  import {
    CanMoveStore,
    PromotionPosStore,
    LastPosStore,
  } from "@/store/play-game.svelte";
  import {
    clickSquareHandler,
    clickCapturedHandler,
    clickPromotionHandler,
  } from "@/handler/play-shogi";
  import { HandPieceStore, ReverseStore } from "@/store/game-board.svelte";
  import { CurrentIndexStore, NodesStore } from "@/store/kifu-node.svelte";
  import { getCurrentFavorites } from "@/handler/favorite-moves";
  import { charToPieceTypeMap, strToPosition } from "@/domain/sfenx";
  import { getCurrentStatistics } from "@/handler/move-statistics";

  // --- 定数 ---
  const SQUARE_WIDTH = 55;
  const SQUARE_HEIGHT = 60;
  const FONT_SIZE = 38;
  const PIECE_SCALE = 0.9;

  // 盤上の各マスのDOM情報を格納する配列 (Boardコンポーネントから受け取る)
  let squareElements: HTMLDivElement[] = $state([]);

  // 先手の持ち駒のDOM情報を格納する配列 (Boardコンポーネントから受け取る)
  let capturedSenteElements: { piece: PieceType; element: HTMLDivElement }[] =
    $state([]);
  // 後手の持ち駒のDOM情報を格納する配列
  let capturedGoteElements: { piece: PieceType; element: HTMLDivElement }[] =
    $state([]);

  // キャンバス全体のコンテナ要素とその座標
  let canvasElement: HTMLDivElement | undefined = $state();

  function getRelativePosition(element: HTMLDivElement | null): {
    x: number;
    y: number;
  } {
    if (!element || !canvasElement) {
      return { x: 0, y: 0 };
    }
    const canvasRect = canvasElement.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    return {
      x: pos.left - canvasRect.left + pos.width / 2,
      y: pos.top - canvasRect.top + pos.height / 2,
    };
  }

  let relativeSquarePositions: { x: number; y: number }[] = $derived(
    (() => {
      return squareElements.map((el) =>
        el ? getRelativePosition(el) : { x: 0, y: 0 }
      );
    })()
  );

  let relativeCapturedSentePositions: {
    piece: PieceType;
    position: { x: number; y: number };
  }[] = $derived(
    (() => {
      return capturedSenteElements.map(({ piece, element }) => ({
        piece,
        position: element ? getRelativePosition(element) : { x: 0, y: 0 },
      }));
    })()
  );

  let relativeCapturedGotePositions: {
    piece: PieceType;
    position: { x: number; y: number };
  }[] = $derived(
    (() => {
      return capturedGoteElements.map(({ piece, element }) => ({
        piece,
        position: element ? getRelativePosition(element) : { x: 0, y: 0 },
      }));
    })()
  );

  let relativeSquareRect = $derived(
    (() => {
      const canvasRect = canvasElement?.getBoundingClientRect();
      return squareElements.map((el) => {
        if (!el || !canvasRect) return { x: 0, y: 0, width: 0, height: 0 };
        const pos = el.getBoundingClientRect();
        return {
          x: pos.left - canvasRect.left,
          y: pos.top - canvasRect.top,
          width: pos.width,
          height: pos.height,
        };
      });
    })()
  );

  let { isSente, sfenx } = $derived(
    NodesStore.getNode(CurrentIndexStore.get())
  );

  let favoriteArrows: FavoriteFrom[] = $derived.by(() => {
    const moves = getCurrentFavorites(isSente, sfenx);
    return moves.map((move) => {
      const match1 = move.match(/^(\d)([a-i])(\d)([a-i])(\+)?$/);
      if (match1) {
        const [, fromColStr, fromRowStr, toColStr, toRowStr, prom] = match1;
        const from = strToPosition(`${fromColStr}${fromRowStr}`);
        const to = strToPosition(`${toColStr}${toRowStr}`);
        return {
          startRow: from.row,
          startCol: from.col,
          endRow: to.row,
          endCol: to.col,
        };
      }
      const match2 = move.match(/^([A-Z])\*(\d)([a-i])$/);
      if (match2) {
        const [, pieceChar, toColStr, toRowStr] = match2;
        const { row, col } = strToPosition(`${toColStr}${toRowStr}`);
        const piece = charToPieceTypeMap[pieceChar];
        return {
          piece,
          isSente: isSente,
          endRow: row,
          endCol: col,
        };
      }
      throw "Invalid favorite move";
    });
  });

  let statisticsArrows: StatisticsFrom[] = $derived.by(() => {
    const stats = getCurrentStatistics(isSente, sfenx);
    return stats.map((stat) => {
      const match1 = stat.move.match(/^(\d)([a-i])(\d)([a-i])(\+)?$/);
      if (match1) {
        const [, fromColStr, fromRowStr, toColStr, toRowStr, prom] = match1;
        const from = strToPosition(`${fromColStr}${fromRowStr}`);
        const to = strToPosition(`${toColStr}${toRowStr}`);
        return {
          startRow: from.row,
          startCol: from.col,
          endRow: to.row,
          endCol: to.col,
          apparentRate: stat.apparentRate,
          winRate: stat.winRate,
        };
      }
      const match2 = stat.move.match(/^([A-Z])\*(\d)([a-i])$/);
      if (match2) {
        const [, pieceChar, toColStr, toRowStr] = match2;
        const { row, col } = strToPosition(`${toColStr}${toRowStr}`);
        const piece = charToPieceTypeMap[pieceChar];
        return {
          piece,
          isSente: isSente,
          endRow: row,
          endCol: col,
          apparentRate: stat.apparentRate,
          winRate: stat.winRate,
        };
      }
      throw "Invalid favorite move";
    });
  });
</script>

<div class="canvas" bind:this={canvasElement}>
  <div class="game-board">
    <GameBoard
      squareWidth={SQUARE_WIDTH}
      squareHeight={SQUARE_HEIGHT}
      fontSize={FONT_SIZE}
      pieceScale={PIECE_SCALE}
      {clickSquareHandler}
      {clickCapturedHandler}
      bind:squareElements
      bind:capturedSenteElements
      bind:capturedGoteElements
    />
  </div>
  {#if squareElements.length > 0 && canvasElement}
    {@const handPiece = HandPieceStore.get()}
    {#if handPiece}
      <div class="can-move">
        {#each { length: 9 }, row}
          {#each { length: 9 }, col}
            {#if !CanMoveStore.get(row, col)}
              {@const index = row * 9 + col}
              {@const { x, y, width, height } = relativeSquareRect[index]}
              <div
                class="cannot-move-square"
                style="top: {y}px;
                          left: {x}px;
                          width: {width}px;
                          height: {height}px;"
              ></div>
            {/if}
          {/each}
        {/each}
      </div>
      {@const promotionPos = PromotionPosStore.get()}
      {#if promotionPos}
        {@const index = promotionPos.row * 9 + promotionPos.col}
        {@const { x, y, width, height } = relativeSquareRect[index]}
        <div
          class="promotion-square"
          style="top: {y}px;
                    left: {x}px;
                    width: {width}px;
                    height: {height}px;"
        >
          <Promote
            squareWidth={width}
            squareHeight={height}
            fontSize={FONT_SIZE}
            pieceScale={PIECE_SCALE}
            piece={handPiece.piece}
            reverse={ReverseStore.get()
              ? handPiece.isSente
              : !handPiece.isSente}
            clickHandler={clickPromotionHandler}
          />
        </div>
      {/if}
    {/if}
    {@const lastPos = LastPosStore.get()}
    {#if lastPos}
      {@const index = lastPos.row * 9 + lastPos.col}
      {@const { x, y, width, height } = relativeSquareRect[index]}
      <div
        class="last-move"
        style="top: {y}px;
                  left: {x}px;
                  width: {width}px;
                  height: {height}px;"
      ></div>
    {/if}
    <div class="information">
      <Information
        {relativeSquarePositions}
        {relativeCapturedSentePositions}
        {relativeCapturedGotePositions}
        {favoriteArrows}
        {statisticsArrows}
      />
    </div>
  {/if}
</div>

<style>
  .canvas {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .can-move {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none; /* クリックイベントを無視 */
    z-index: 150; /* 他の要素の上に表示 */
  }

  .cannot-move-square {
    position: absolute;
    background-color: rgba(30, 0, 0, 0.2); /* 半透明 */
  }

  .last-move {
    position: absolute;
    background-color: rgba(0, 255, 0, 0.2); /* 半透明 */
    pointer-events: none; /* クリックイベントを無視 */
    z-index: 5;
  }

  .promotion-square {
    position: absolute;
    background-color: rgba(0, 30, 0, 0.2); /* 半透明 */
    z-index: 170;
  }

  .information {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 200; /* 情報レイヤーを上に */
  }
</style>
