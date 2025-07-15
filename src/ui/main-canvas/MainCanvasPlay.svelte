<script lang="ts">
  import GameBoard from './game-board/GameBoard.svelte';
  import Promote from './game-board/Promote.svelte';
  import Information from './information/Information.svelte';
  import type { PieceType, FavoriteFrom, StatisticsFrom } from '../../types/shogi';

  import { getCanMove, getPromotionPos } from '../../store/play-game-store.svelte';
  import { clickSquareHandler, clickCapturedHandler } from '../../handler/play-shogi';
  import { getHandPiece } from '../../store/game-board-store.svelte';

  // --- 定数 ---
  const SQUARE_WIDTH = 55;
  const SQUARE_HEIGHT = 60;
  const FONT_SIZE = 38;
  const PIECE_SCALE = 0.9;

  // 盤上の各マスのDOM情報を格納する配列 (Boardコンポーネントから受け取る)
  let squareElements: HTMLDivElement[] = $state([]);

  // 先手の持ち駒のDOM情報を格納する配列 (Boardコンポーネントから受け取る)
  let capturedSenteElements: { piece: PieceType; element: HTMLDivElement }[] = $state([]);
  // 後手の持ち駒のDOM情報を格納する配列
  let capturedGoteElements: { piece: PieceType; element: HTMLDivElement }[] = $state([]);

  // キャンバス全体のコンテナ要素とその座標
  let canvasElement: HTMLDivElement | undefined = $state();

  function getRelativePosition(element: HTMLDivElement): { x: number, y: number } {
    const canvasRect = canvasElement?.getBoundingClientRect();
    if (canvasRect) {
      const pos = element.getBoundingClientRect();
      return {
        x: pos.left - canvasRect.left + pos.width / 2,
        y: pos.top - canvasRect.top + pos.height / 2
      };
    }
    return { x: 0, y: 0 };
  }

  let relativeSquarePositions: {x: number, y: number}[] = $derived((() => {
    return squareElements.map(el => getRelativePosition(el));
  })());

  let relativeCapturedSentePositions: { piece: PieceType; position: { x: number; y: number } }[] = $derived((() => {
    return capturedSenteElements.map(({ piece, element }) => ({
      piece,
      position: getRelativePosition(element)
    }));
  })());

  let relativeCapturedGotePositions: { piece: PieceType; position: { x: number; y: number } }[] = $derived((() => {
    return capturedGoteElements.map(({ piece, element }) => ({
      piece,
      position: getRelativePosition(element)
    }));
  })());

  let relativeSquareRect = $derived(
    (() => {
      const canvasRect = canvasElement?.getBoundingClientRect();
      return squareElements.map(el => {
        const pos = el.getBoundingClientRect();
        if (!canvasRect) return { x: 0, y: 0, width: 0, height: 0 };
        return {
          x: pos.left - canvasRect.left,
          y: pos.top - canvasRect.top,
          width: pos.width,
          height: pos.height
        };
      });
    })()
  );

  let favoriteArrows: (FavoriteFrom)[] = [
    // {
    //   startRow: 8,
    //   startCol: 0,
    //   endRow: 0,
    //   endCol: 0
    // },
    // {
    //   startRow: 5,
    //   startCol: 0,
    //   endRow: 5,
    //   endCol: 8
    // },
    // {
    //   startRow: 4,
    //   startCol: 4,
    //   endRow: 8,
    //   endCol: 8,
    // },
    // {
    //   startRow: 2,
    //   startCol: 2,
    //   endRow: 3,
    //   endCol: 3,
    // },
    // {
    //   startRow: 1,
    //   startCol: 1,
    //   endRow: 1,
    //   endCol: 2,
    // },
    // {
    //   startRow: 0,
    //   startCol: 4,
    //   endRow: 6,
    //   endCol: 0,
    // },
    // {
    //   piece: "歩",
    //   is_sente: true,
    //   endRow: 6,
    //   endCol: 0,
    // },
    {
      piece: "銀",
      is_sente: false,
      endRow: 7,
      endCol: 0,
    }
  ];

  let statisticsArrows: (StatisticsFrom)[] = [
    {
      startRow: 8,
      startCol: 0,
      endRow: 0,
      endCol: 0,
      apparentRate: 0.8,
      winRate: 0.75,
    },
    {
      startRow: 5,
      startCol: 0,
      endRow: 5,
      endCol: 8,
      apparentRate: 0.7,
      winRate: 0.6,
    },
    {
      startRow: 4,
      startCol: 8,
      endRow: 8,
      endCol: 4,
      apparentRate: 0.6,
      winRate: 0.5,
    },
    {
      startRow: 2,
      startCol: 2,
      endRow: 3,
      endCol: 3,
      apparentRate: 0.4,
      winRate: 0.3,
    },
    {
      startRow: 1,
      startCol: 1,
      endRow: 1,
      endCol: 2,
      apparentRate: 0.2,
      winRate: 0.1,
    },
    {
      startRow: 1,
      startCol: 2,
      endRow: 1,
      endCol: 1,
      apparentRate: 0.9,
      winRate: 0.1,
    },
    {
      startRow: 0,
      startCol: 4,
      endRow: 6,
      endCol: 0,
      apparentRate: 0.8,
      winRate: 0.75,
    },
    {
      piece: "歩",
      is_sente: true,
      endRow: 6,
      endCol: 0,
      apparentRate: 0.9,
      winRate: 0.85,
    },
    {
      piece: "銀",
      is_sente: false,
      endRow: 7,
      endCol: 0,
      apparentRate: 0.7,
      winRate: 0.65,
    }
  ];
</script>

<div class="canvas" bind:this={canvasElement}>
  <div class="game-board">
    <GameBoard 
                squareWidth={SQUARE_WIDTH}
                squareHeight={SQUARE_HEIGHT}
                fontSize={FONT_SIZE}
                pieceScale={PIECE_SCALE}
                clickSquareHandler={clickSquareHandler}
                clickCapturedHandler={clickCapturedHandler}
                bind:squareElements={squareElements}
                bind:capturedSenteElements={capturedSenteElements}
                bind:capturedGoteElements={capturedGoteElements}
    />
  </div>
  {#if squareElements.length > 0 && canvasElement}
    {@const handPiece = getHandPiece()}
    {#if handPiece}
      <div class="can-move">
        {#each {length: 9}, row}
          {#each {length: 9}, col}
            {#if !getCanMove(row, col)}
              {@const index = row * 9 + col}
              {@const { x, y, width, height } = relativeSquareRect[index]}
              <div class="cannot-move-square" 
                  style="top: {y}px;
                          left: {x}px;
                          width: {width}px;
                          height: {height}px;">
              </div>
            {/if}
          {/each}
        {/each}
      </div>
      {@const promotionPos = getPromotionPos()}
      {#if promotionPos}
        {@const index= promotionPos.row * 9 + promotionPos.col}
        {@const { x, y, width, height } = relativeSquareRect[index]}
        <div class="can-move" style="top: {y}px;
                                      left: {x}px;
                                      width: {width}px;
                                      height: {height}px;">
          <div class="promotion-square">
            <Promote
              squareWidth={width}
              squareHeight={height}
              fontSize={FONT_SIZE}
              pieceScale={PIECE_SCALE}
              piece={handPiece.piece}
              clickHandler={(getPromote: boolean) => {
                console.log(`Promotion clicked: ${getPromote}`);
              }}
            />
          </div>
        </div>
      {/if}
    {/if}
    <div class="information">
      <Information {relativeSquarePositions}
                   {relativeCapturedSentePositions}
                   {relativeCapturedGotePositions} 
                   {favoriteArrows} 
                   {statisticsArrows} />
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

.information {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200; /* 情報レイヤーを上に */
}
</style>
