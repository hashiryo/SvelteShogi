<script lang="ts">
  import FavoriteArrow from './FavoriteArrow.svelte';
  import { fade } from 'svelte/transition';
  import type { PieceType, FavoriteFrom } from '../../../types/shogi.d.ts';

  let {
    relativeSquarePositions = [] as { x: number, y: number }[],
    relativeCapturedMePositions = new Map<PieceType, { x: number; y: number }>(),
    relativeCapturedOpponentPositions = new Map<PieceType, { x: number; y: number }>(),
    arrows = [] as FavoriteFrom[],
  }
  = $props();

  function getStartEndPositions(arrow: FavoriteFrom) {
    if ('startRow' in arrow && 'startCol' in arrow) {
      // FromBoard
      return {
        startX: relativeSquarePositions[arrow.startRow * 9 + arrow.startCol].x,
        startY: relativeSquarePositions[arrow.startRow * 9 + arrow.startCol].y,
        endX: relativeSquarePositions[arrow.endRow * 9 + arrow.endCol].x,
        endY: relativeSquarePositions[arrow.endRow * 9 + arrow.endCol].y,
      };
    } else {
      // FromCaptured
      const position = arrow.is_sente ? relativeCapturedMePositions.get(arrow.piece) : relativeCapturedOpponentPositions.get(arrow.piece);
      if (position) {
        return {
          startX: position.x,
          startY: position.y,
          endX: relativeSquarePositions[arrow.endRow * 9 + arrow.endCol].x,
          endY: relativeSquarePositions[arrow.endRow * 9 + arrow.endCol].y,
        };
      }
    }
    return { startX: 0, startY: 0, endX: 0, endY: 0 };
  }

  let selected = $state(0);
  let selectedArrow = $derived(arrows[selected]);
  let isVisible = $state(true);

  let { startX, startY, endX, endY } = $derived(getStartEndPositions(selectedArrow));

  $effect(() => {
    const delay = isVisible ? 3000 : 3000;

    const timerId = setTimeout(() => {
      isVisible = !isVisible;
      if (isVisible) {
        selected = (selected + 1) % arrows.length;
      }
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  });

  $inspect(selected);
</script>


<div class="favorite-on-board">
  {#if arrows.length > 0}
    {#if isVisible}
      <div transition:fade={{ delay: 500, duration: 1000 }}>
        <FavoriteArrow
          startX={startX}
          startY={startY}
          endX={endX}
          endY={endY}
        />
      </div>
    {/if}
  {/if}
</div>


<style>
  .favorite-on-board {
    pointer-events: none; /* 矢印のクリックイベントを無効化 */
  }
</style>
