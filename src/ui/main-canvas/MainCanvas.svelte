<script lang="ts">
  import GameBoard from './game-board/GameBoard.svelte';
  import Information from './information/Information.svelte';
  import type { PieceType, PieceOnSquare, FavoriteFrom, StatisticsFrom } from '../../types/shogi';

  // 盤上の各マスのDOM情報を格納する配列 (Boardコンポーネントから受け取る)
  let squareElements: HTMLDivElement[] = $state([]);

  // 先手の持ち駒のDOM情報を格納する配列 (Boardコンポーネントから受け取る)
  let capturedMeElements: Map<PieceType,HTMLDivElement> = $state(new Map());
  // 後手の持ち駒のDOM情報を格納する配列
  let capturedOpponentElements: Map<PieceType,HTMLDivElement> = $state(new Map());

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

  let relativeCapturedMePositions: Map<PieceType, { x: number; y: number }> = $derived((() => {
    return Array.from(capturedMeElements.entries()).reduce((acc, [piece, el]) => {
      acc.set(piece, getRelativePosition(el));
      return acc;
    }, new Map<PieceType, { x: number; y: number }>());
  })());

  let relativeCapturedOpponentPositions: Map<PieceType, { x: number; y: number }> = $derived((() => {
    return Array.from(capturedOpponentElements.entries()).reduce((acc, [piece, el]) => {
      acc.set(piece, getRelativePosition(el));
      return acc;
    }, new Map<PieceType, { x: number; y: number }>());
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
  let capturedPiecesMe: { piece: PieceType; num: number }[] = [
    { piece: "歩", num: 10 },
    { piece: "香", num: 1 }
  ];
  let capturedPiecesOpponent: { piece: PieceType; num: number }[] = [
    { piece: "銀", num: 2 },
    { piece: "角", num: 1 }
  ];

  // let reverse = false; // 盤の向きを反転するかどうか
  let reverse = true; // 盤の向きを反転するかどうか



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
    <GameBoard {piecesOnBoard} 
              {capturedPiecesMe} 
              {capturedPiecesOpponent} 
              {reverse} 
              bind:squareElements={squareElements}
              bind:capturedMeElements={capturedMeElements}
              bind:capturedOpponentElements={capturedOpponentElements}
                />
  </div>
  {#if squareElements.length > 0 && canvasElement}
    <div class="information">
      <Information {relativeSquarePositions}
                   {relativeCapturedMePositions}
                   {relativeCapturedOpponentPositions} 
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
  z-index: 20; /* 情報レイヤーを上に */
}
</style>
