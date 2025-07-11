<script lang="ts">
  import StatisticsArrow from './StatisticsArrow.svelte';
  import { fade } from 'svelte/transition';
  import type { PieceType } from '../../../types/shogi.d.ts';
  import { get } from 'svelte/store';

  let {
    relativeSquarePositions = [] as { x: number, y: number }[],
    relativeCapturedMePositions = new Map<PieceType, { x: number; y: number }>(),
    relativeCapturedOpponentPositions = new Map<PieceType, { x: number; y: number }>(),
  }
  = $props();

  type FromBoard = {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
    apparentRate: number;
    winRate: number;
  };
  type FromCaptured = {
    piece: PieceType;
    is_sente: boolean;
    endRow: number;
    endCol: number;
    apparentRate: number;
    winRate: number;
  };

  let arrows: (FromBoard | FromCaptured)[] = [
    {
      startRow: 8,
      startCol: 0,
      endRow: 0,
      endCol: 0,
      apparentRate: 0.8,
      winRate: 0.75,
    },
    {
      startRow: 5,
      startCol: 0,
      endRow: 5,
      endCol: 8,
      apparentRate: 0.7,
      winRate: 0.6,
    },
    {
      startRow: 4,
      startCol: 4,
      endRow: 8,
      endCol: 8,
      apparentRate: 0.6,
      winRate: 0.5,
    },
    {
      startRow: 2,
      startCol: 2,
      endRow: 3,
      endCol: 3,
      apparentRate: 0.4,
      winRate: 0.3,
    },
    {
      startRow: 1,
      startCol: 1,
      endRow: 1,
      endCol: 2,
      apparentRate: 0.2,
      winRate: 0.1,
    },
    {
      startRow: 0,
      startCol: 4,
      endRow: 6,
      endCol: 0,
      apparentRate: 0.8,
      winRate: 0.75,
    },
    {
      piece: "歩",
      is_sente: true,
      endRow: 6,
      endCol: 0,
      apparentRate: 0.9,
      winRate: 0.85,
    },
    {
      piece: "銀",
      is_sente: false,
      endRow: 7,
      endCol: 0,
      apparentRate: 0.7,
      winRate: 0.65,
    }
  ];

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

  function getStartEndPositions(arrow: FromBoard | FromCaptured) {
    if ('startRow' in arrow && 'startCol' in arrow) {
      // FromBoard
      return {
        startX: relativeSquarePositions[arrow.startRow * 9 + arrow.startCol].x,
        startY: relativeSquarePositions[arrow.startRow * 9 + arrow.startCol].y,
        endX: relativeSquarePositions[arrow.endRow * 9 + arrow.endCol].x,
        endY: relativeSquarePositions[arrow.endRow * 9 + arrow.endCol].y,
        width: arrow.apparentRate * 30, // 矢印の太さをアピアレントレートに基づいて調整
        color: getColorFromRate(arrow.winRate)
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
          color: getColorFromRate(arrow.winRate)
        };
      }
    }
    return { startX: 0, startY: 0, endX: 0, endY: 0, width: 30, color: { r: 255, g: 255, b: 255 } };
  }

  let selected = $state(0);
  let selectedArrow = $derived(arrows[selected]);
  let isVisible = $state(true);

  let { startX, startY, endX, endY, width, color } = $derived(getStartEndPositions(selectedArrow));

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
