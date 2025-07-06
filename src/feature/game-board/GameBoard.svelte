<script lang="ts">
  import Board from './Board.svelte';
  import Piece from './Piece.svelte';
</script>

<div class="game-board">
  <Board />
  <div class="pieces-container">
    <Piece row={0} col={0} />
    <Piece reverse={true} row={8} col={8} />
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