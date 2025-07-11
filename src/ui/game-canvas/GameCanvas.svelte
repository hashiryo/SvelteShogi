<script lang="ts">
  import GameBoard from './game-board/GameBoard.svelte';
  import Arrow from './information/Arrow.svelte';
  import type { PieceType, PieceOnBoard } from '../../types/shogi.d.ts';

  // 盤上の各マスのDOM情報を格納する配列 (Boardコンポーネントから受け取る)
  let squareElements: HTMLDivElement[] = $state([]);

  // キャンバス全体のコンテナ要素とその座標
  let canvasElement: HTMLDivElement | undefined = $state();

  let relativeSquarePositions: {x: number, y: number}[] = $derived((() => {
    // squarePositionsが更新されたときに、相対座標を計算
      const canvasRect = canvasElement?.getBoundingClientRect();
      if (canvasRect) {
        // ボードの座標が取得できた場合、相対座標を計算
        return squareElements.map(el => {
          const pos = el.getBoundingClientRect();
          return {
            x: pos.left - canvasRect.left + pos.width / 2, // 中心位置に調整
            y: pos.top - canvasRect.top + pos.height / 2 // 中心位置に調整
          };
        });
      }
      return squareElements.map(() => ({ x: 0, y: 0 }));
  })());

  // 仮の盤上の駒データ
  let piecesOnBoard: PieceOnBoard[] = [
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

  let arrows = [
    {
      startRow: 8,
      startCol: 0,
      endRow: 0,
      endCol: 0,
      color: { r: 0, g: 0, b: 255 },
      width: 30
    },
    {
      startRow: 5,
      startCol: 0,
      endRow: 5,
      endCol: 8,
      color: { r: 255, g: 0, b: 0 },
      width: 30
    }
  ]

</script>

<div class="canvas" bind:this={canvasElement}>
  <GameBoard {piecesOnBoard} 
             {capturedPiecesMe} 
             {capturedPiecesOpponent} 
             {reverse} 
             bind:squareElements={squareElements} />
  {#if squareElements.length > 0 && canvasElement}
    <div class="arrows-layer">
      {#each arrows as arrow}
        {@const startX = relativeSquarePositions[arrow.startRow * 9 + arrow.startCol].x}
        {@const startY = relativeSquarePositions[arrow.startRow * 9 + arrow.startCol].y}
        {@const endX = relativeSquarePositions[arrow.endRow * 9 + arrow.endCol].x}
        {@const endY = relativeSquarePositions[arrow.endRow * 9 + arrow.endCol].y}
        <Arrow startX={startX} 
               startY={startY} 
               endX={endX} 
               endY={endY}
               color={arrow.color}
               width={arrow.width} />
      {/each}
    </div>
  {/if}
</div>

<style>
.canvas {
  position: relative;
  width: 100%;
  height: 100%;
}

.arrows-layer {
  pointer-events: none; /* 矢印のクリックイベントを無効化 */
  z-index: 1000; /* 矢印のレイヤーを上に */
}
</style>
