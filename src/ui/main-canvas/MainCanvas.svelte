<script lang="ts">
  import GameBoard from './game-board/GameBoard.svelte';
  import Information from './information/Information.svelte';
  import type { PieceType, PieceOnBoard } from '../../types/shogi';

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



</script>

<div class="canvas" bind:this={canvasElement}>
  <GameBoard {piecesOnBoard} 
             {capturedPiecesMe} 
             {capturedPiecesOpponent} 
             {reverse} 
             bind:squareElements={squareElements} />
  {#if squareElements.length > 0 && canvasElement}
      <Information {relativeSquarePositions} />
  {/if}
</div>

<style>
.canvas {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
