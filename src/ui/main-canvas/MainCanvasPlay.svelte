<script lang="ts">
  import GameBoard from './game-board/GameBoard.svelte';
  import Information from './information/Information.svelte';
  import type { PieceType, PieceOnSquare, FavoriteFrom, StatisticsFrom } from '../../types/shogi';

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

  // 仮の盤上の駒データ
  let piecesOnBoard: PieceOnSquare[] = [
    {
      piece: "歩",
      is_sente: true,
      row: 6,
      col: 0
    },
    {
      piece: "香",
      is_sente: true,
      row: 7,
      col: 0
    },
    {
      piece: "玉",
      is_sente: false,
      row: 0,
      col: 4
    }
  ];

  // 仮の持ち駒データ
  let capturedPiecesSente: { piece: PieceType; num: number }[] = [
    { piece: "歩", num: 10 },
    { piece: "香", num: 1 }
  ];
  let capturedPiecesGote: { piece: PieceType; num: number }[] = [
    { piece: "銀", num: 2 },
    { piece: "角", num: 1 }
  ];

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
              bind:squareElements={squareElements}
              bind:capturedSenteElements={capturedSenteElements}
              bind:capturedGoteElements={capturedGoteElements}
                />
  </div>
  {#if squareElements.length > 0 && canvasElement}
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
.information {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200; /* 情報レイヤーを上に */
}
</style>
