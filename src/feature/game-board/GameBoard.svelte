<script lang="ts">
  import Board from './Board.svelte';
  import Piece from './Piece.svelte';

  const SQUARE_WIDTH = 55; // 駒の幅
  const SQUARE_HEIGHT = 60; // 駒の高さ
  const FONT_SIZE = 40; // 駒のフォントサイズ
  const PIECE_SCALE = 0.95; // 駒のサイズ調整用スケール
</script>

<div class="canvas">
  <div class="captured-opponent" style="width: {SQUARE_WIDTH * 9}px;"> 
    <Piece fontSize={FONT_SIZE} width={SQUARE_WIDTH}  height={SQUARE_HEIGHT} scale={PIECE_SCALE} reverse={true} />
  </div>
  <div class="game-board">
    <Board squareWidth={SQUARE_WIDTH} squareHeight={SQUARE_HEIGHT} />
    <div class="pieces-on-board" style="top: 0px; left: 0px;">
      <Piece fontSize={FONT_SIZE} width={SQUARE_WIDTH}  height={SQUARE_HEIGHT} scale={PIECE_SCALE} />
    </div>
    <div class="pieces-on-board" style="top: {SQUARE_HEIGHT * 2}px; left: {SQUARE_WIDTH * 3}px;">
      <Piece fontSize={FONT_SIZE} width={SQUARE_WIDTH}  height={SQUARE_HEIGHT} scale={PIECE_SCALE} reverse={true}/>
    </div>
  </div>
  <div class="captured-me" style="width: {SQUARE_WIDTH * 9}px;"> 
    <Piece fontSize={FONT_SIZE} width={SQUARE_WIDTH}  height={SQUARE_HEIGHT} scale={PIECE_SCALE}/>
  </div>
</div>



<style>
  .game-board {
    position: relative;
    display: inline-block;
  }

  .pieces-on-board {
    position: absolute;
  }

  .captured-opponent {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: right;
  }
  .captured-me {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: left;
  }
</style>