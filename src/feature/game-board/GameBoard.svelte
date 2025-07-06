<script lang="ts">
  import Board from './Board.svelte';
  import Piece from './Piece.svelte';

  const SQUARE_WIDTH = 55; // 駒の幅
  const SQUARE_HEIGHT = 60; // 駒の高さ
  const FONT_SIZE = 40; // 駒のフォントサイズ
  const PIECE_SCALE = 0.95; // 駒のサイズ調整用スケール

  const CANVAS_WIDTH = SQUARE_WIDTH * 9; // ボード + 持ち駒　幅
  const CANVAS_HEIGHT = SQUARE_HEIGHT * 11; // ボード + 持ち駒　高さ
</script>

<div class="game-board"
  style="--width: {CANVAS_WIDTH}px; --height: {CANVAS_HEIGHT}px;">
  <Board top={SQUARE_HEIGHT} left={0} squareWidth={SQUARE_WIDTH} squareHeight={SQUARE_HEIGHT} />
  <div class="pieces-on-board">
    <Piece fontSize={FONT_SIZE} width={SQUARE_WIDTH}  height={SQUARE_HEIGHT} top={SQUARE_HEIGHT} left={0} scale={PIECE_SCALE} />

    <Piece fontSize={FONT_SIZE} width={SQUARE_WIDTH}  height={SQUARE_HEIGHT} top={SQUARE_HEIGHT*9} left={0} scale={PIECE_SCALE} />
    <Piece reverse={true} fontSize={FONT_SIZE} width={SQUARE_WIDTH} height={SQUARE_HEIGHT} top={SQUARE_HEIGHT * 8} left={SQUARE_WIDTH * 8} scale={PIECE_SCALE} />
  </div>  
    <Piece fontSize={FONT_SIZE} width={SQUARE_WIDTH}  height={SQUARE_HEIGHT} top={SQUARE_HEIGHT*10} left={0} scale={PIECE_SCALE} />
</div>

<style>
  .game-board {
    position: relative;
    display: inline-block;
    width: var(--width);
    height: var(--height);
  }

  .pieces-on-board {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* ボードのクリックを妨げない */
  }

  .pieces-on-board :global(.piece) {
    position: absolute;
    pointer-events: auto; /* 駒自体はクリック可能 */
  }
</style>