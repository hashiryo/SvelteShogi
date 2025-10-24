<script lang="ts">
  import StatisticsArrow from "./StatisticsArrow.svelte";
  import { fade } from "svelte/transition";
  import type { PieceType, StatisticsFrom } from "@/types/shogi.d.ts";

  let {
    relativeSquarePositions = [] as { x: number; y: number }[],
    relativeCapturedSentePositions = [] as {
      piece: PieceType;
      position: { x: number; y: number };
    }[],
    relativeCapturedGotePositions = [] as {
      piece: PieceType;
      position: { x: number; y: number };
    }[],
    arrows = [] as StatisticsFrom[],
  } = $props();

  function getColorFromRate(rate: number): { r: number; g: number; b: number } {
    if (rate < 0.5) {
      // 赤色から灰色へのグラデーション
      const r = Math.floor(255 * (1 - rate));
      return { r, g: 128, b: 128 };
    } else {
      // 緑色から灰色へのグラデーション
      const g = Math.floor(255 * rate);
      return { r: 128, g, b: 128 };
    }
  }

  function getStartEndPositions(arrow: StatisticsFrom) {
    if (!arrow) {
      return {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        width: 30,
        color: { r: 255, g: 255, b: 255 },
        info: "",
      };
    }
    if ("startRow" in arrow && "startCol" in arrow) {
      // FromSquare
      const startIndex = arrow.startRow * 9 + arrow.startCol;
      const endIndex = arrow.endRow * 9 + arrow.endCol;

      if (
        startIndex >= relativeSquarePositions.length ||
        endIndex >= relativeSquarePositions.length
      ) {
        return {
          startX: 0,
          startY: 0,
          endX: 0,
          endY: 0,
          width: 30,
          color: { r: 255, g: 255, b: 255 },
          info: "",
        };
      }

      return {
        startX: relativeSquarePositions[startIndex].x,
        startY: relativeSquarePositions[startIndex].y,
        endX: relativeSquarePositions[endIndex].x,
        endY: relativeSquarePositions[endIndex].y,
        width: arrow.apparentRate * 30, // 矢印の太さをアピアレントレートに基づいて調整
        color: getColorFromRate(arrow.winRate),
        info: `出現率${arrow.apparentRate.toFixed(2)} 勝率: ${arrow.winRate.toFixed(2)}`,
      };
    } else {
      // FromCaptured
      const position = arrow.isSente
        ? relativeCapturedSentePositions.find((p) => p.piece === arrow.piece)
        : relativeCapturedGotePositions.find((p) => p.piece === arrow.piece);
      const endIndex = arrow.endRow * 9 + arrow.endCol;

      if (endIndex >= relativeSquarePositions.length) {
        return {
          startX: 0,
          startY: 0,
          endX: 0,
          endY: 0,
          width: 30,
          color: { r: 255, g: 255, b: 255 },
          info: "",
        };
      }

      if (position) {
        return {
          startX: position.position.x,
          startY: position.position.y,
          endX: relativeSquarePositions[endIndex].x,
          endY: relativeSquarePositions[endIndex].y,
          width: 30,
          color: getColorFromRate(arrow.winRate),
          info: `出現率${arrow.apparentRate.toFixed(2)} 勝率: ${arrow.winRate.toFixed(2)}`,
        };
      }
    }
    return {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      width: 30,
      color: { r: 255, g: 255, b: 255 },
      info: "",
    };
  }

  let selected = $state(0);
  let selectedArrow = $derived(arrows[selected]);
  let isVisible = $state(true);

  let { startX, startY, endX, endY, width, color, info } = $derived(
    getStartEndPositions(selectedArrow)
  );

  $effect(() => {
    if (arrows.length === 0) {
      return;
    }

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
      <div
        out:fade={{ delay: 50, duration: 100 }}
        in:fade={{ delay: 500, duration: 1000 }}
      >
        <StatisticsArrow
          {startX}
          {startY}
          {endX}
          {endY}
          {width}
          {color}
          {info}
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
