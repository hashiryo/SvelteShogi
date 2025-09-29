<script lang="ts">
  import { KANJI_NUM, ZENKAKU_NUM } from "@/domain/display";

  let {
    squareWidth = 40,
    squareHeight = 44,
    squareElements = $bindable([]),
    reverse = false,
    clickHandler = (row: number, col: number) => {
      console.log(`Clicked on square at row ${row}, col ${col}`);
    },
  } = $props();

  let cols = $derived(
    reverse ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1, 0]
  );
  let rows = $derived(
    reverse ? [8, 7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7, 8]
  );
</script>

<div class="grid-container">
  <!-- 列の座標（算用数字） -->
  <div class="column-labels">
    {#each cols as col}
      <div class="column-label" style="width: {squareWidth}px;">
        {ZENKAKU_NUM[col]}
      </div>
    {/each}
  </div>

  <div class="grid-with-row-labels">
    <!-- 将棋盤本体 -->
    <div class="grid">
      {#each { length: 9 }, ri}
        {@const row = rows[ri]}
        {#each { length: 9 }, ci}
          {@const col = cols[ci]}
          <div
            class="square {ri % 3 === 0 && ci % 3 === 0 && ri > 0 && ci > 0
              ? 'dot'
              : ''}"
            data-row={row}
            data-col={col}
            style="--width: {squareWidth}px; --height: {squareHeight}px;"
            role="button"
            tabindex="-1"
            onclick={() => clickHandler(row, col)}
            onkeydown={(e) => {
              if (e.key === "Enter") {
                clickHandler(row, col);
              }
            }}
            aria-label={`Row ${row + 1}, Column ${col + 1}`}
            bind:this={squareElements[row * 9 + col]}
          ></div>
        {/each}
      {/each}
    </div>

    <!-- 行の座標（漢数字） -->
    <div class="row-labels">
      {#each rows as row}
        <div class="row-label" style="height: {squareHeight}px;">
          {KANJI_NUM[row]}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .grid-container {
    display: inline-block;
    /* background: linear-gradient(135deg, #f0e68c, #daa520); */
    /* background: #e8e2ce; */
    /* background: #e9e5a7; */
    /* backgrounrgb(33, 29, 24)55); */
    /* background: rgb(202, 178, 134); */
    /* background: white; */
    background-color: #ffd760;
    background-image: url("https://www.transparenttextures.com/patterns/retina-wood.png");
    /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
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
    font-family: "MS Mincho", "Yu Mincho", serif;
    font-size: 20px;
    color: #2c1810;
  }

  .grid-with-row-labels {
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
    font-family: "MS Mincho", "Yu Mincho", serif;
    font-size: 20px;
    color: #2c1810;
    margin: 0 2px 0 2px;
  }

  .grid {
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

  .square:focus {
    outline: none;
  }

  .square:hover {
    background: linear-gradient(135deg, #f0e68c, #daa520);
  }

  .square::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 0.5px solid #2c1810;
    pointer-events: none;
  }

  .square.dot::before {
    content: "";
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
