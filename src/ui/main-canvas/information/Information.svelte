<script lang="ts">
  import FavoriteOnBoard from './FavoriteOnBoard.svelte';
  import StatisticsOnBoard from './StatisticsOnBoard.svelte';
  import type { PieceType } from '../../../types/shogi.d.ts';

  let {
    relativeSquarePositions = [] as { x: number, y: number }[],
    relativeCapturedMePositions = new Map<PieceType, { x: number; y: number }>(),
    relativeCapturedOpponentPositions = new Map<PieceType, { x: number; y: number }>(),
  }
  = $props();
</script>


<FavoriteOnBoard
  {relativeSquarePositions}
  {relativeCapturedMePositions}
  {relativeCapturedOpponentPositions}
/>
<StatisticsOnBoard
  {relativeSquarePositions}
  {relativeCapturedMePositions}
  {relativeCapturedOpponentPositions}
/>