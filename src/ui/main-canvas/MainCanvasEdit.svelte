<script lang="ts">
  import GameBoard from './game-board/GameBoard.svelte';
  import type { PieceType, PieceOnSquare } from '../../types/shogi';

  // 盤上の各マスのDOM情報を格納する配列 (Boardコンポーネントから受け取る)
  let squareElements: HTMLDivElement[] = $state([]);

  // 先手の持ち駒のDOM情報を格納する配列 (Boardコンポーネントから受け取る)
  let capturedSenteElements: { piece: PieceType; element: HTMLDivElement }[] = $state([]);
  // 後手の持ち駒のDOM情報を格納する配列
  let capturedGoteElements: { piece: PieceType; element: HTMLDivElement }[] = $state([]);


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

</script>

<div class="canvas">
  <div class="game-board">
    <GameBoard 
              bind:squareElements={squareElements}
              bind:capturedSenteElements={capturedSenteElements}
              bind:capturedGoteElements={capturedGoteElements}
                />
  </div>
</div>

<style>
.canvas {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
