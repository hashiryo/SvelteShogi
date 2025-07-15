<script lang="ts">
  import Grid from './Grid.svelte';
  import Piece from './Piece.svelte';
  import Captured from './Captured.svelte';
  import type { PieceType} from '../../../types/shogi.d.ts';

  import { getSquare, getCaptured, getHandPiece } from '../../../store/game-board-store.svelte';

  // --- 定数 ---
  const SQUARE_WIDTH = 55;
  const SQUARE_HEIGHT = 60;
  const FONT_SIZE = 38;
  const PIECE_SCALE = 0.9;

  // --- 状態 (State) ---
  let {
    squareElements = $bindable([]) as HTMLDivElement[],
    capturedSenteElements = $bindable([]) as { piece: PieceType; element: HTMLDivElement }[],
    capturedGoteElements = $bindable([]) as { piece: PieceType; element: HTMLDivElement }[],
    clickSquareHandler = (row: number, col: number) => { console.log(`Clicked on square at row ${row}, col ${col}`); },
    clickCapturedHandler = (piece: PieceType, isSente: boolean) => { console.log(`Clicked on captured piece: ${piece}, isSente: ${isSente}`); },
  } = $props();

  let reverse = $state(false); // 盤の向きを反転するかどうか

  let handPiece = $derived(getHandPiece());

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
  <div class="captured-opponent">
    {#if reverse}
      <Captured
        fontSize={FONT_SIZE}
        squareWidth={SQUARE_WIDTH}
        squareHeight={SQUARE_HEIGHT}
        pieceScale={PIECE_SCALE}
        capturedPieces={[...getCaptured(true)].reverse()}
        reverse={true}
        handPiece={handPiece && 'piece' in handPiece  && handPiece.isSente? handPiece.piece : null}
        clickHandler={(piece: PieceType) => clickCapturedHandler(piece, true)}
        bind:capturedElements={capturedSenteElements}
      />
    {:else}
      <Captured
        fontSize={FONT_SIZE}
        squareWidth={SQUARE_WIDTH}
        squareHeight={SQUARE_HEIGHT}
        pieceScale={PIECE_SCALE}
        capturedPieces={[...getCaptured(false)].reverse()}
        reverse={true}
        handPiece={handPiece && 'piece' in handPiece  && !handPiece.isSente? handPiece.piece : null}
        clickHandler={(piece: PieceType) => clickCapturedHandler(piece, false)}
        bind:capturedElements={capturedGoteElements}
      />
    {/if}
  </div>

  <!-- position: relative を設定して、中の駒の配置基準にする -->
  <div class="game-board" bind:this={gameBoardElement}>
      <Grid
        squareWidth={SQUARE_WIDTH} 
        squareHeight={SQUARE_HEIGHT} 
        reverse={reverse}
        clickHandler={clickSquareHandler}
        bind:squareElements={squareElements}
      />

    <!-- 盤上の駒を配置するレイヤー -->
    <!-- squareElements と gameBoardElement の両方が準備できてから描画 -->
    {#if squareElements.length > 0 && gameBoardElement}
      <div class="pieces-layer">
        {#each {length: 9}, row}
          {#each {length: 9}, col}
            {@const index = row * 9 + col}
            {@const square = getSquare(row, col)}
            {#if square}
              <!-- 駒が存在する場合のみ表示 -->
              <!-- 駒を配置するためのラッパー -->
              <div 
                class="piece-wrapper"
                style="
                  position: absolute;
                  top: {relativeSquarePositions[index]?.y}px;
                  left: {relativeSquarePositions[index]?.x}px;
                  width: {SQUARE_WIDTH}px;
                  height: {SQUARE_HEIGHT}px;
                  z-index: {reverse? (10-row)* 10 + col + 1: (row+1) * 10 + 10 - col};
                "
              >
                <Piece 
                  fontSize={FONT_SIZE} 
                  width={SQUARE_WIDTH}  
                  height={SQUARE_HEIGHT} 
                  scale={PIECE_SCALE} 
                  reverse={reverse? square.isSente: !square.isSente}
                  character={square.piece}
                  isHanded={handPiece && 'row' in handPiece ? handPiece.row === row && handPiece.col === col : false}
                />
              </div>
            {/if}
          {/each}
        {/each}
      </div>
    {/if}
  </div>
  <div class="front-layer">
    <div class="captured-me">
      {#if reverse}
        <Captured
          fontSize={FONT_SIZE}
          squareWidth={SQUARE_WIDTH}
          squareHeight={SQUARE_HEIGHT}
          pieceScale={PIECE_SCALE}
          capturedPieces={getCaptured(false)}
          handPiece={handPiece && 'piece' in handPiece  && !handPiece.isSente? handPiece.piece : null}
          clickHandler={(piece: PieceType) => clickCapturedHandler(piece, false)}
          bind:capturedElements={capturedGoteElements}
        />
      {:else}      
        <Captured
          fontSize={FONT_SIZE}
          squareWidth={SQUARE_WIDTH}
          squareHeight={SQUARE_HEIGHT}
          pieceScale={PIECE_SCALE}
          capturedPieces={getCaptured(true)}
          handPiece={handPiece && 'piece' in handPiece  && handPiece.isSente? handPiece.piece : null}
          clickHandler={(piece: PieceType) => clickCapturedHandler(piece, true)}
          bind:capturedElements={capturedSenteElements}
        />
      {/if}
    </div>
    <button class="reverse-button" onclick={() => reverse = !reverse}>
      {reverse ? '反転解除' : '盤を反転'}
    </button>
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
    pointer-events: none; 
  }

  .captured-opponent {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: right;
  }

  .front-layer {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .captured-me {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: left;
  }
</style>