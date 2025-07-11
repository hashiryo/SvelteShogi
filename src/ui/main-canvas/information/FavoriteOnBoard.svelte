<script lang="ts">
  import FavoriteArrow from './FavoriteArrow.svelte';

  let {
    relativeSquarePositions = [] as { x: number, y: number }[],
  }
  = $props();


  let arrows = [
    {
      startRow: 8,
      startCol: 0,
      endRow: 0,
      endCol: 0
    },
    {
      startRow: 5,
      startCol: 0,
      endRow: 5,
      endCol: 8
    },
    {
      startRow: 4,
      startCol: 4,
      endRow: 8,
      endCol: 8,
    }
  ];

  let selected = $state(0);
  let selectedArrow = $derived(arrows[selected]);

  let startX = $derived(relativeSquarePositions[selectedArrow.startRow * 9 + selectedArrow.startCol].x);
  let startY = $derived(relativeSquarePositions[selectedArrow.startRow * 9 + selectedArrow.startCol].y);
  let endX = $derived(relativeSquarePositions[selectedArrow.endRow * 9 + selectedArrow.endCol].x);
  let endY = $derived(relativeSquarePositions[selectedArrow.endRow * 9 + selectedArrow.endCol].y);

  $effect(() => {
    const interval = setInterval(() => {
      selected = (selected + 1) % arrows.length;
    }, 3000);
    return () => clearInterval(interval);
  });

  $inspect(selected);
</script>


<div class="favorite-on-board">
  {#if arrows.length > 0}
    <FavoriteArrow
      startX={startX}
      startY={startY}
      endX={endX}
      endY={endY}
    />
  {/if}
</div>


<style>
  .favorite-on-board {
    pointer-events: none; /* 矢印のクリックイベントを無効化 */
    z-index: 1000; /* 矢印のレイヤーを上に */
  }
</style>
