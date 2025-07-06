<script lang="ts">
  import Board from './Board.svelte';
  import Piece from './Piece.svelte';

  // 将棋の初期配置を定義
  type PieceType = {
    character: string;
    row: number;
    col: number;
    isHanded?: boolean;
  };

  let pieces = $state<PieceType[]>([
    // 後手（上側）の駒
    { character: '香', row: 0, col: 0 },
    { character: '桂', row: 0, col: 1 },
    { character: '銀', row: 0, col: 2 },
    { character: '金', row: 0, col: 3 },
    { character: '王', row: 0, col: 4 },
    { character: '金', row: 0, col: 5 },
    { character: '銀', row: 0, col: 6 },
    { character: '桂', row: 0, col: 7 },
    { character: '香', row: 0, col: 8 },
    { character: '飛', row: 1, col: 1 },
    { character: '角', row: 1, col: 7 },
    
    // 後手の歩
    ...Array.from({length: 9}, (_, i) => ({ character: '歩', row: 2, col: i })),
    
    // 先手の歩
    ...Array.from({length: 9}, (_, i) => ({ character: '歩', row: 6, col: i })),
    
    // 先手（下側）の駒
    { character: '角', row: 7, col: 1 },
    { character: '飛', row: 7, col: 7 },
    { character: '香', row: 8, col: 0 },
    { character: '桂', row: 8, col: 1 },
    { character: '銀', row: 8, col: 2 },
    { character: '金', row: 8, col: 3 },
    { character: '玉', row: 8, col: 4 },
    { character: '金', row: 8, col: 5 },
    { character: '銀', row: 8, col: 6 },
    { character: '桂', row: 8, col: 7 },
    { character: '香', row: 8, col: 8 },
  ]);

  function getPieceAt(row: number, col: number): PieceType | undefined {
    return pieces.find(piece => piece.row === row && piece.col === col);
  }

  function handleSquareClick(row: number, col: number) {
    console.log(`Square clicked: (${row}, ${col})`);
    // 将来的に駒の移動ロジックを実装
  }
</script>

<div class="game-board">
  <div class="board-wrapper">
    <Board />
    
    <!-- 駒を盤面上に配置 -->
    <div class="pieces-layer">
      {#each pieces as piece (piece.row + '-' + piece.col + '-' + piece.character)}
        <div 
          class="piece-wrapper"
          style="grid-row: {piece.row + 1}; grid-column: {piece.col + 1};"
        >
          <Piece 
            character={piece.character} 
            isHanded={piece.isHanded || false}
            scale={0.9}
          />
        </div>
      {/each}
    </div>

    <!-- クリック可能なオーバーレイ -->
    <div class="click-layer">
      {#each Array.from({length: 9}) as _, row}
        {#each Array.from({length: 9}) as _, col}
          <div 
            class="click-square"
            style="grid-row: {row + 1}; grid-column: {col + 1};"
            onclick={() => handleSquareClick(row, col)}
          ></div>
        {/each}
      {/each}
    </div>
  </div>
</div>

<style>
  .game-board {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #2c1810, #4a2c17);
    padding: 20px;
  }

  .board-wrapper {
    position: relative;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
  }

  .pieces-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    gap: 1px;
    padding: 10px;
    pointer-events: none;
  }

  .piece-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
  }

  .click-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    gap: 1px;
    padding: 10px;
    z-index: 10;
  }

  .click-square {
    background: transparent;
    cursor: pointer;
  }

  .click-square:hover {
    background: rgba(255, 215, 0, 0.1);
    border-radius: 3px;
  }
</style>