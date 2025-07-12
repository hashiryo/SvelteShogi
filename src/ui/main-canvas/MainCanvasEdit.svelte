<script lang="ts">
  import GameBoard from './game-board/GameBoard.svelte';
  import type { PieceType} from '../../types/shogi';

  // 盤上の各マスのDOM情報を格納する配列 (Boardコンポーネントから受け取る)
  let squareElements: HTMLDivElement[] = $state([]);

  // 先手の持ち駒のDOM情報を格納する配列 (Boardコンポーネントから受け取る)
  let capturedSenteElements: { piece: PieceType; element: HTMLDivElement }[] = $state([]);
  // 後手の持ち駒のDOM情報を格納する配列
  let capturedGoteElements: { piece: PieceType; element: HTMLDivElement }[] = $state([]);

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
