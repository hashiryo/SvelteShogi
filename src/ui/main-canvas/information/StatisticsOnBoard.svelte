<script lang="ts">
  import StatisticsArrow from './StatisticsArrow.svelte';
  import { fade } from 'svelte/transition';
  import type { PieceType, StatisticsFrom } from '../../../types/shogi.d.ts';

  let {
    relativeSquarePositions = [] as { x: number, y: number }[],
    relativeCapturedMePositions = new Map<PieceType, { x: number; y: number }>(),
    relativeCapturedOpponentPositions = new Map<PieceType, { x: number; y: number }>(),
    arrows = [] as StatisticsFrom[],
  }
  = $props();

  function getColorFromRate(rate: number): { r: number, g: number, b: number } {
    if (rate < 0.5) {
      const r = Math.floor(255 * rate * 2);
      const g = Math.floor(255 * rate * 2);
      return { r, g, b: 255 }; // 青色から白色へのグラデーション
    }else{
      const g = Math.floor(255 * (1 - rate) * 2);
      const b = Math.floor(255 * (1 - rate) * 2);
      return { r: 255, g, b }; // 赤色から白色へのグラデーション
    }
  }

  function getStartEndPositions(arrow: StatisticsFrom) {
    if ('startRow' in arrow && 'startCol' in arrow) {
      // FromBoard
      return {
        startX: relativeSquarePositions[arrow.startRow * 9 + arrow.startCol].x,
        startY: relativeSquarePositions[arrow.startRow * 9 + arrow.startCol].y,
        endX: relativeSquarePositions[arrow.endRow * 9 + arrow.endCol].x,
        endY: relativeSquarePositions[arrow.endRow * 9 + arrow.endCol].y,
        width: arrow.apparentRate * 30, // 矢印の太さをアピアレントレートに基づいて調整
        color: getColorFromRate(arrow.winRate),
        info: `出現率${arrow.apparentRate.toFixed(2)} 勝率: ${arrow.winRate.toFixed(2)}`
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
          width: 30,
          color: getColorFromRate(arrow.winRate),
          info: `出現率${arrow.apparentRate.toFixed(2)} 勝率: ${arrow.winRate.toFixed(2)}`
        };
      }
    }
    return { startX: 0, startY: 0, endX: 0, endY: 0, width: 30, color: { r: 255, g: 255, b: 255 }, info: '' };
  }

  let selected = $state(0);
  let selectedArrow = $derived(arrows[selected]);
  let isVisible = $state(true);

  let { startX, startY, endX, endY, width, color, info } = $derived(getStartEndPositions(selectedArrow));

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

  // $inspect(selected);
</script>


<div class="statistics-on-board">
  {#if arrows.length > 0}
    {#if isVisible}
      <div transition:fade={{ delay: 500, duration: 1000 }}>
        <StatisticsArrow
          startX={startX}
          startY={startY}
          endX={endX}
          endY={endY}
          width={width}
          color={color}
          info={info}
        />
      </div>
    {/if}
  {/if}
</div>


<style>
  .statistics-on-board {
    pointer-events: none; /* 矢印のクリックイベントを無効化 */
  }
</style>
