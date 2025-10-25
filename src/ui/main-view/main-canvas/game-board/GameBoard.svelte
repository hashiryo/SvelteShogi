<script lang="ts">
  import Grid from "./Grid.svelte";
  import Piece from "./Piece.svelte";
  import Captured from "./Captured.svelte";
  import type { PieceType } from "@/types/shogi.d.ts";

  import {
    GridStore,
    CapturesStore,
    HandPieceStore,
    ReverseStore,
  } from "@/store/game-board.svelte";

  // --- 状態 (State) ---
  let {
    squareWidth = 55,
    squareHeight = 60,
    pieceScale = 0.9,
    fontSize = 38,
    squareElements = $bindable([]) as HTMLDivElement[],
    capturedSenteElements = $bindable([]) as {
      piece: PieceType;
      element: HTMLDivElement;
    }[],
    capturedGoteElements = $bindable([]) as {
      piece: PieceType;
      element: HTMLDivElement;
    }[],
    clickSquareHandler = (row: number, col: number) => {
      console.log(`Clicked on square at row ${row}, col ${col}`);
    },
    clickCapturedHandler = (piece: PieceType, isSente: boolean) => {
      console.log(`Clicked on captured piece: ${piece}, isSente: ${isSente}`);
    },
  } = $props();

  let reverse = $derived(ReverseStore.get());
  let handPiece = $derived(HandPieceStore.get());

  // 3. ボード全体のコンテナ要素とその座標
  let gameBoardElement: HTMLDivElement | undefined = $state();

  let relativeSquarePositions: { x: number; y: number }[] = $derived(
    (() => {
      // squarePositionsが更新されたときに、相対座標を計算
      const boardRect = gameBoardElement?.getBoundingClientRect();
      if (boardRect) {
        // ボードの座標が取得できた場合、相対座標を計算
        return squareElements.map((el) => {
          const pos = el.getBoundingClientRect();
          return {
            x: pos.left - boardRect.left,
            y: pos.top - boardRect.top,
          };
        });
      }
      return squareElements.map(() => ({ x: 0, y: 0 }));
    })()
  );

  let grid = $derived(GridStore.get());
</script>

<div class="canvas">
  <div class="captured-opponent" style="height: {squareHeight * 1.2}px;">
    {#if reverse}
      <Captured
        {fontSize}
        {squareWidth}
        {squareHeight}
        {pieceScale}
        capturedPieces={CapturesStore.get(true)}
        reverse={true}
        handPiece={handPiece && !handPiece.position && handPiece.isSente
          ? handPiece.piece
          : null}
        clickHandler={(piece: PieceType) => clickCapturedHandler(piece, true)}
        bind:capturedElements={capturedSenteElements}
      />
    {:else}
      <Captured
        {fontSize}
        {squareWidth}
        {squareHeight}
        {pieceScale}
        capturedPieces={CapturesStore.get(false)}
        reverse={true}
        handPiece={handPiece && !handPiece.position && !handPiece.isSente
          ? handPiece.piece
          : null}
        clickHandler={(piece: PieceType) => clickCapturedHandler(piece, false)}
        bind:capturedElements={capturedGoteElements}
      />
    {/if}
  </div>

  <!-- position: relative を設定して、中の駒の配置基準にする -->
  <div class="game-board" bind:this={gameBoardElement}>
    <Grid
      {squareWidth}
      {squareHeight}
      {reverse}
      clickHandler={clickSquareHandler}
      bind:squareElements
    />

    <!-- 盤上の駒を配置するレイヤー -->
    <!-- squareElements と gameBoardElement の両方が準備できてから描画 -->
    {#if squareElements.length > 0 && gameBoardElement}
      <div class="pieces-layer">
        {#each { length: 9 }, row}
          {#each { length: 9 }, col}
            {@const index = row * 9 + col}
            {@const square = grid[index]}
            {#if square}
              <!-- 駒が存在する場合のみ表示 -->
              <!-- 駒を配置するためのラッパー -->
              <div
                class="piece-wrapper"
                style="
                  position: absolute;
                  top: {relativeSquarePositions[index]?.y}px;
                  left: {relativeSquarePositions[index]?.x}px;
                  width: {squareWidth}px;
                  height: {squareHeight}px;
                  z-index: {reverse
                  ? (10 - row) * 10 + col + 1
                  : (row + 1) * 10 + 10 - col};
                "
              >
                <Piece
                  {fontSize}
                  width={squareWidth}
                  height={squareHeight}
                  scale={pieceScale}
                  reverse={reverse ? square.isSente : !square.isSente}
                  character={square.piece}
                  isHanded={handPiece && handPiece.position
                    ? handPiece.position.row === row &&
                      handPiece.position.col === col
                    : false}
                />
              </div>
            {/if}
          {/each}
        {/each}
      </div>
    {/if}
  </div>
  <div class="front-layer">
    <div class="captured-me" style="height: {squareHeight * 1.2}px;">
      {#if reverse}
        <Captured
          {fontSize}
          {squareWidth}
          {squareHeight}
          {pieceScale}
          capturedPieces={CapturesStore.get(false)}
          handPiece={handPiece && !handPiece.position && !handPiece.isSente
            ? handPiece.piece
            : null}
          clickHandler={(piece: PieceType) =>
            clickCapturedHandler(piece, false)}
          bind:capturedElements={capturedGoteElements}
        />
      {:else}
        <Captured
          {fontSize}
          {squareWidth}
          {squareHeight}
          {pieceScale}
          capturedPieces={CapturesStore.get(true)}
          handPiece={handPiece && !handPiece.position && handPiece.isSente
            ? handPiece.piece
            : null}
          clickHandler={(piece: PieceType) => clickCapturedHandler(piece, true)}
          bind:capturedElements={capturedSenteElements}
        />
      {/if}
    </div>
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
    display: flex;
    width: 100%;
  }

  .captured-me {
    display: flex;
    width: 100%;
    height: 100%;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: left;
  }
</style>
