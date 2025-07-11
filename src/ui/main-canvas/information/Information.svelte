<script lang="ts">
  import FavoriteOnBoard from './FavoriteOnBoard.svelte';
  import StatisticsOnBoard from './StatisticsOnBoard.svelte';

  let {
    relativeSquarePositions = [] as { x: number, y: number }[],
  }
  = $props();
</script>


<FavoriteOnBoard
  {relativeSquarePositions}
/>
<StatisticsOnBoard
  {relativeSquarePositions}
/>