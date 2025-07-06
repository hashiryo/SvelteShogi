<script lang="ts">
  import Board from './Board.svelte';
  import Piece from './Piece.svelte';

  const SQUARE_WIDTH = 40; // 駒の幅
  const SQUARE_HEIGHT = 44; // 駒の高さ
  const PIECE_SCALE = 0.95; // 駒のサイズ調整用スケール
</script>

<div class="game-board">
  <Board />
  <div class="pieces-container">
    <!-- <Piece top={0} left={0} scale={PIECE_SCALE} /> -->
    <Piece reverse={true} top={SQUARE_HEIGHT * 8} left={SQUARE_WIDTH * 8} scale={PIECE_SCALE} />
  </div>
</div>

<style>
  .game-board {
    position: relative;
    display: inline-block;
  }

  .pieces-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* ボードのクリックを妨げない */
  }

  .pieces-container :global(.piece) {
    position: absolute;
    pointer-events: auto; /* 駒自体はクリック可能 */
  }
</style>