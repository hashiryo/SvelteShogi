<script lang="ts">
  type Props = {
    squareWidth?: number;
    squareHeight?: number;
    // 位置が更新されたときに親に通知するためのコールバック関数
    onUpdate?: (positions: DOMRect[]) => void;
  };

  let {
    squareWidth = 40,
    squareHeight = 44,
    onUpdate = () => {}
  }: Props = $props();

  let squareElements: HTMLDivElement[] = $state([]);

  function updateSquarePositions() {
    // squareElementsが全て揃ってから処理を実行
    if (squareElements.length === 81 && squareElements.every(el => el)) {
      const positions = squareElements.map(el => el.getBoundingClientRect());
      // 親コンポーネントに計算結果を通知
      onUpdate(positions);
    }
  }

  // Svelte5では、$effect内でDOMの更新を監視するのが一般的です
  $effect(() => {
    // squareElementsが変更されたときに位置を再計算
    updateSquarePositions();
  });
</script>

<!-- windowのイベントリスナーは引き続き有効です -->
<svelte:window on:resize={updateSquarePositions} on:scroll={updateSquarePositions} />

<div class="board">
  {#each Array.from({length: 9}, (_, row) => row) as row}
    {#each Array.from({length: 9}, (_, col) => col) as col}
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

<style>
  /* styleは変更なし */
  .board {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    border: 1px solid #2c1810;
    background: linear-gradient(135deg, #f0e68c, #daa520);
    cursor: pointer;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
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