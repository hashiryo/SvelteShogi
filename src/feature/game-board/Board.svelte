<script lang="ts">
  // 将棋盤の設定
  const BOARD_SIZE = 9;
  const rows = Array.from({length: BOARD_SIZE}, (_, i) => i);
  const cols = Array.from({length: BOARD_SIZE}, (_, i) => i);
</script>

<div class="board-container">
  <div class="board">
    {#each rows as row}
      {#each cols as col}
        <div 
          class="square" 
          data-row={row} 
          data-col={col}
        >
          <!-- 駒はGameBoardコンポーネントで配置 -->
        </div>
      {/each}
    {/each}
  </div>
</div>

<style>
  .board-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, #8b4513, #a0522d);
    border-radius: 10px;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 2px 4px rgba(255, 255, 255, 0.1);
  }

  .board {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    gap: 1px;
    background: #654321;
    border: 3px solid #4a2c17;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 
      inset 0 2px 8px rgba(0, 0, 0, 0.3),
      0 4px 16px rgba(0, 0, 0, 0.2);
  }

  .square {
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, #deb887, #d2b48c);
    border: 1px solid #8b7355;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: background-color 0.2s ease;
  }

  .square:hover {
    background: linear-gradient(135deg, #f0e68c, #daa520);
    box-shadow: inset 0 0 8px rgba(255, 215, 0, 0.3);
  }

  /* 盤面の線を表現 */
  .square::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-right: 1px solid #8b7355;
    border-bottom: 1px solid #8b7355;
    pointer-events: none;
  }

  /* 最右列と最下行の線を削除 */
  .square:nth-child(9n)::after {
    border-right: none;
  }

  .square:nth-child(n+73)::after {
    border-bottom: none;
  }

  /* 重要な位置にマーカーを追加（天王山など） */
  .square[data-row="4"][data-col="4"]::before {
    content: '・';
    position: absolute;
    color: #8b7355;
    font-size: 8px;
    opacity: 0.6;
  }
</style>