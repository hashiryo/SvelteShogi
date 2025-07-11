<script lang="ts">
  import FavoriteArrow from './FavoriteArrow.svelte';
  import { fade } from 'svelte/transition';

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
    },
    {
      startRow: 2,
      startCol: 2,
      endRow: 3,
      endCol: 3,
    },
    {
      startRow: 1,
      startCol: 1,
      endRow: 1,
      endCol: 2,
    }
  ];

  let selected = $state(0);
  let isVisible = $state(true);
  let selectedArrow = $derived(arrows[selected]);

  let startX = $derived(relativeSquarePositions[selectedArrow.startRow * 9 + selectedArrow.startCol].x);
  let startY = $derived(relativeSquarePositions[selectedArrow.startRow * 9 + selectedArrow.startCol].y);
  let endX = $derived(relativeSquarePositions[selectedArrow.endRow * 9 + selectedArrow.endCol].x);
  let endY = $derived(relativeSquarePositions[selectedArrow.endRow * 9 + selectedArrow.endCol].y);

  $effect(() => {
    const interval = setInterval(() => {
      // フェードアウト開始
      isVisible = false;
      
      // フェードアウト完了後に次の矢印に切り替えてフェードイン
      setTimeout(() => {
        selected = (selected + 1) % arrows.length;
        isVisible = true;
      }, 500); // フェードアウト時間（0.5秒）
    }, 3000);
    return () => clearInterval(interval);
  });

  $inspect(selected);
</script>


<div class="favorite-on-board">
  {#if arrows.length > 0 && isVisible}
    <div transition:fade={{ duration: 500 }}>
      <FavoriteArrow
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
      />
    </div>
  {/if}
</div>


<style>
  .favorite-on-board {
    pointer-events: none; /* 矢印のクリックイベントを無効化 */
    z-index: 20; /* 矢印のレイヤーを上に */
  }
</style>
