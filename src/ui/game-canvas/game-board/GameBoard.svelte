<script lang="ts">
  import Grid from './Grid.svelte';
  import Piece from './Piece.svelte';
  import Captured from './Captured.svelte';
  import type { PieceType, PieceOnBoard } from '../../../types/shogi.d.ts';

  // --- 定数 ---
  const SQUARE_WIDTH = 55;
  const SQUARE_HEIGHT = 60;
  const FONT_SIZE = 40;
  const PIECE_SCALE = 0.95;

  // --- 状態 (State) ---
  let {
    piecesOnBoard = [] as PieceOnBoard[],
    capturedPiecesMe = [] as { piece: PieceType; num: number }[],
    capturedPiecesOpponent = [] as { piece: PieceType; num: number }[],
    squareElements = $bindable([]) as HTMLDivElement[],
    reverse = false
  } = $props();

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
    <Captured
      fontSize={FONT_SIZE}
      squareWidth={SQUARE_WIDTH}
      squareHeight={SQUARE_HEIGHT}
      pieceScale={PIECE_SCALE}
      capturedPieces={reverse? capturedPiecesMe: capturedPiecesOpponent}
      reverse={true}
    />
  </div>

  <!-- position: relative を設定して、中の駒の配置基準にする -->
  <div class="game-board" bind:this={gameBoardElement}>
    <Grid 
      squareWidth={SQUARE_WIDTH} 
      squareHeight={SQUARE_HEIGHT} 
      reverse={reverse}
      bind:squareElements={squareElements}
    />

    <!-- 盤上の駒を配置するレイヤー -->
    <!-- squareElements と gameBoardElement の両方が準備できてから描画 -->
    {#if squareElements.length > 0 && gameBoardElement}
      <div class="pieces-layer">
        {#each piecesOnBoard as piece}
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
              reverse={reverse? piece.is_sente: !piece.is_sente}
              character={piece.piece}
            />
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="captured-me" style="width: {SQUARE_WIDTH * 9}px;">
    <Captured
      fontSize={FONT_SIZE}
      squareWidth={SQUARE_WIDTH}
      squareHeight={SQUARE_HEIGHT}
      pieceScale={PIECE_SCALE}
      capturedPieces={reverse?  capturedPiecesOpponent: capturedPiecesMe}
    />
  </div>
</div>

<style>
  
  .canvas {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 20px;
  }

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