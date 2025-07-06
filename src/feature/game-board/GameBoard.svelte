<script lang="ts">
  import Board from './Board.svelte';
  import Piece from './Piece.svelte';
</script>

<div class="game-board">
  <Board />
  <Piece />
  <Piece reverse={true}/>
</div>

<style>
</style>