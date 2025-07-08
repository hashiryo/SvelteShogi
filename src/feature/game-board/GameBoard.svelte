<script lang="ts">
  import Board from './Board.svelte';
  import Piece from './Piece.svelte';

  // --- 定数 ---
  const SQUARE_WIDTH = 55;
  const SQUARE_HEIGHT = 60;
  const FONT_SIZE = 40;
  const PIECE_SCALE = 0.95;

  // --- 状態 (State) ---

  // 1. 駒の配置状態を管理する配列
  // row, col は 0-8 のインデックス
  let piecesOnBoard = $state([
    { id: 1, name: '玉', row: 8, col: 4, isMine: true },
    { id: 2, name: '飛', row: 7, col: 1, isMine: true },
    { id: 3, name: '歩', row: 6, col: 0, isMine: true },
    // 相手の駒
    { id: 4, name: '玉', row: 0, col: 4, isMine: false },
    { id: 5, name: '角', row: 1, col: 1, isMine: false },
    { id: 6, name: '歩', row: 2, col: 7, isMine: false },
  ]);

  // 2. 盤上の各マスのDOM情報を格納する配列 (Boardコンポーネントから受け取る)
  let squareElements: HTMLDivElement[] = $state([]);

  // 3. ボード全体のコンテナ要素とその座標
  let gameBoardElement: HTMLDivElement | undefined = $state();

  let relativeSquarePositions: {x: number, y: number}[] = $derived((() => {
    // squarePositionsが更新されたときに、相対座標を計算
      const boardRect = gameBoardElement?.getBoundingClientRect();
      if (boardRect) {
        // ボードの座標が取得できた場合、相対座標を計算
        return squareElements.map(el => {
          const pos = el.getBoundingClientRect();
          return {
            x: pos.left - boardRect.left,
            y: pos.top - boardRect.top
          };
        });
      }
      return squareElements.map(() => ({ x: 0, y: 0 }));
  })());

</script>

<div class="canvas">
  <div class="captured-opponent" style="width: {SQUARE_WIDTH * 9}px;">
    <!-- 持ち駒のロジックは別途実装 -->
  </div>

  <!-- position: relative を設定して、中の駒の配置基準にする -->
  <div class="game-board" bind:this={gameBoardElement}>
    <Board 
      squareWidth={SQUARE_WIDTH} 
      squareHeight={SQUARE_HEIGHT} 
      bind:squareElements={squareElements}
    />

    <!-- 盤上の駒を配置するレイヤー -->
    <!-- squareElements と gameBoardElement の両方が準備できてから描画 -->
    {#if squareElements.length > 0 && gameBoardElement}
      <div class="pieces-layer">
        {#each piecesOnBoard as piece (piece.id)}
          {@const index = piece.row * 9 + piece.col}
          <!-- 駒を配置するためのラッパー -->
          <div 
            class="piece-wrapper"
            style="
              position: absolute;
              top: {relativeSquarePositions[index]?.y}px;
              left: {relativeSquarePositions[index]?.x}px;
              width: {SQUARE_WIDTH}px;
              height: {SQUARE_HEIGHT}px;
            "
          >
            <Piece 
              fontSize={FONT_SIZE} 
              width={SQUARE_WIDTH}  
              height={SQUARE_HEIGHT} 
              scale={PIECE_SCALE} 
              reverse={!piece.isMine}
              character={piece.name}
            />
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="captured-me" style="width: {SQUARE_WIDTH * 9}px;">
    <!-- 持ち駒のロジックは別途実装 -->
  </div>
</div>

<style>
  .game-board {
    /* これが駒の配置の基準点になる */
    position: relative;
    display: inline-block;
  }

  /* .pieces-layerは省略可能ですが、駒をまとめる層としてあると便利 */
  .pieces-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* 盤のクリックを妨げないようにする */
    pointer-events: none; 
  }

  .piece-wrapper {
    /* 駒自身のイベントは有効にする */
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* その他は変更なし */
  .canvas { /* canvasクラスを追加したと仮定 */
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 20px;
  }
  .captured-opponent {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: right;
  }
  .captured-me {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: left;
  }
</style>