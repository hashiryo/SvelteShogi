<script lang="ts">
  let {
    squareWidth = 40, // 駒の幅
    squareHeight = 44, // 駒の高さ
  } = $props();
</script>

<div class="board">
  {#each Array.from({length: 9}, (_, i) => i) as row}
    {#each Array.from({length: 9}, (_, i) => i) as col}
      <div 
        class="square {row%3 === 0 && col%3 === 0 && row > 0 && col > 0? 'dot' : ''}" 
        data-row={row} 
        data-col={col}
        style="--width: {squareWidth}px; --height: {squareHeight}px;"
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
    background: linear-gradient(135deg, #f0e68c, #daa520);
    cursor: pointer;
  }

  .square {
    width: var(--width);
    height: var(--height);
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

  /* 格子点の黒丸 */
  .square.dot::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    width: 4px;
    height: 4px;
    background: #2c1810;
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
  }
</style>