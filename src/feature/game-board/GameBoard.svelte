<script lang="ts">
  import Board from './Board.svelte';
  import Piece from './Piece.svelte';

  const SQUARE_WIDTH = 55; // 駒の幅
  const SQUARE_HEIGHT = 60; // 駒の高さ
  const FONT_SIZE = 40; // 駒のフォントサイズ
  const PIECE_SCALE = 0.95; // 駒のサイズ調整用スケール
</script>

<div class="game-board">
  <Board squareWidth={SQUARE_WIDTH} squareHeight={SQUARE_HEIGHT} />
  <div class="pieces-container">
    <Piece fontSize={FONT_SIZE} width={SQUARE_WIDTH}  height={SQUARE_HEIGHT} top={0} left={0} scale={PIECE_SCALE} />
    <Piece reverse={true} fontSize={FONT_SIZE} width={SQUARE_WIDTH} height={SQUARE_HEIGHT} top={SQUARE_HEIGHT * 8} left={SQUARE_WIDTH * 8} scale={PIECE_SCALE} />
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