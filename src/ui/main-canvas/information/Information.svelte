<script lang="ts">
  import FavoriteOnBoard from './FavoriteOnBoard.svelte';
  import StatisticsOnBoard from './StatisticsOnBoard.svelte';
  import type { PieceType, FavoriteFrom, StatisticsFrom } from '../../../types/shogi.d.ts';

  let {
    relativeSquarePositions = [] as { x: number, y: number }[],
    relativeCapturedMePositions = new Map<PieceType, { x: number; y: number }>(),
    relativeCapturedOpponentPositions = new Map<PieceType, { x: number; y: number }>(),
    favoriteArrows = [] as FavoriteFrom[],
    statisticsArrows = [] as StatisticsFrom[],
  }
  = $props();
</script>


<FavoriteOnBoard
  {relativeSquarePositions}
  {relativeCapturedMePositions}
  {relativeCapturedOpponentPositions}
  arrows={favoriteArrows}
/>
<StatisticsOnBoard
  {relativeSquarePositions}
  {relativeCapturedMePositions}
  {relativeCapturedOpponentPositions}
  arrows={statisticsArrows}
/>