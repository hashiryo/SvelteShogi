<script lang="ts">
  import FavoriteOnBoard from './FavoriteOnBoard.svelte';
  import StatisticsOnBoard from './StatisticsOnBoard.svelte';
  import type { PieceType, FavoriteFrom, StatisticsFrom } from '../../../types/shogi.d.ts';

  let {
    relativeSquarePositions = [] as { x: number, y: number }[],
    relativeCapturedSentePositions = new Map<PieceType, { x: number; y: number }>(),
    relativeCapturedGotePositions = new Map<PieceType, { x: number; y: number }>(),
    favoriteArrows = [] as FavoriteFrom[],
    statisticsArrows = [] as StatisticsFrom[],
  }
  = $props();
</script>


<FavoriteOnBoard
  {relativeSquarePositions}
  {relativeCapturedSentePositions}
  {relativeCapturedGotePositions}
  arrows={favoriteArrows}
/>
<StatisticsOnBoard
  {relativeSquarePositions}
  {relativeCapturedSentePositions}
  {relativeCapturedGotePositions}
  arrows={statisticsArrows}
/>