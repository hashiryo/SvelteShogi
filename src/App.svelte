<script lang="ts">
  import Piece from './feature/game-board/Piece.svelte';
  import Board from './feature/game-board/Board.svelte';
  import GameBoard from './feature/game-board/GameBoard.svelte';
</script>

<main>
  <!-- <GameBoard/> -->
  <Board />
  <Piece />
  <Piece reverse={true}/>
</main>

<style>
</style>
