<script lang="ts">
  interface BoardProps {
    scale?: number;
  }
  let { 
    scale = 1
  }: BoardProps = $props();

  // 将棋盤の設定
  const BOARD_SIZE = 9;
</script>

<div class="board">
  {#each Array.from({length: BOARD_SIZE}, (_, i) => i) as row}
    {#each Array.from({length: BOARD_SIZE}, (_, i) => i) as col}
      <div 
        class="square" 
        data-row={row} 
        data-col={col}
        style="--piece-scale: {scale}"
      >
        <!-- 駒はGameBoardコンポーネントで配置 -->
      </div>
    {/each}
  {/each}
</div>

<style>
  .board {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    border: 1px solid #2c1810;
  }

  .square {
    --square-width: calc(40px * var(--piece-scale));
    --square-height: calc(44px * var(--piece-scale));

    width: var(--square-width);
    height: var(--square-height);
    background: transparent;
    /* border: 1px solid #8b7355; */
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: background-color 0.2s ease;
  }

  .square:hover {
    background: linear-gradient(135deg, #f0e68c, #daa520);
  }

  /* 盤面の線を表現 */
  .square::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 0.5px solid #2c1810;
    pointer-events: none;
  }
</style>