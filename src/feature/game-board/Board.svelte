<script lang="ts">
  let {
    squareWidth = 40,
    squareHeight = 44,
    squareElements = $bindable([]),
  } = $props();
  const KANJI_NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const ZENKAKU_NUM = ['１', '２', '３', '４', '５', '６', '７', '８', '９'];

  let cols = Array.from({ length: 9 }, (_, i) => i ).reverse();
  let rows = Array.from({ length: 9 }, (_, i) => i );
</script>

<div class="board-container">
  <!-- 列の座標（算用数字） -->
  <div class="column-labels">
    {#each cols as col}
      <div class="column-label" style="width: {squareWidth}px;">{ZENKAKU_NUM[col]}</div>
    {/each}
  </div>
  
  <div class="board-with-row-labels">
    <!-- 将棋盤本体 -->
    <div class="board">
      {#each rows as row}
        {#each cols as col}
          <div 
            class="square {row%3 === 0 && col%3 === 0 && row > 0 && col > 0? 'dot' : ''}" 
            data-row={row} 
            data-col={col}
            style="--width: {squareWidth}px; --height: {squareHeight}px;"
            bind:this={squareElements[row * 9 + col]}
          >
          </div>
        {/each}
      {/each}
    </div>

    <!-- 行の座標（漢数字） -->
    <div class="row-labels">
      {#each rows as row}
        <div class="row-label" style="height: {squareHeight}px;">{KANJI_NUM[row]}</div>
      {/each}
    </div>
  </div>
</div>

<style>
  .board-container {
    display: inline-block;
    background: linear-gradient(135deg, #f0e68c, #daa520);
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
    padding-left: 10px;
    padding-bottom: 10px;
  }

  .column-labels {
    display: flex;
    /* margin-bottom: 5px; */
  }

  .column-label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-family: 'MS Mincho', 'Yu Mincho', serif;
    font-size: 20px;
    color: #2c1810;
  }

  .board-with-row-labels {
    display: flex;
  }

  .row-labels {
    display: flex;
    flex-direction: column;
  }

  .row-label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-family: 'MS Mincho', 'Yu Mincho', serif;
    font-size: 20px;
    color: #2c1810;
    margin: 0 2px 0 2px;
  }

  .board {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    border: 1px solid #2c1810;
    cursor: pointer;
  }

  .square {
    width: var(--width);
    height: var(--height);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: background-color 0.2s ease;
  }

  .square:hover {
    background: linear-gradient(135deg, #f0e68c, #daa520);
  }

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