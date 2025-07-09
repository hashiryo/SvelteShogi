<script lang="ts">
  import Piece from './Piece.svelte';
  import type { PieceType } from '../../../types/shogi.d.ts';

  let {
    squareWidth = 40,
    squareHeight = 44,
    pieceScale = 0.9,
    fontSize = 32,
    capturedPieces = [] as { piece: PieceType; num: number }[],
    handPiece = null as PieceType | null,
    reverse = false
  } = $props();

  if (reverse) {
    capturedPieces = capturedPieces.reverse();
  }
</script>

<div class="captured">
  {#each capturedPieces as {piece, num}}
    <div class="piece-container" style="width: {squareWidth}px;">
      <div class="piece-top">
        <Piece
          width={squareWidth}
          height={squareHeight}
          fontSize={fontSize}
          character={piece}
          reverse={reverse}
          scale={pieceScale}
          isHanded={handPiece === piece}
        />
      </div>
      {#if num > 1}
        <div class="piece-below">
          <Piece
            width={squareWidth}
            height={squareHeight}
            fontSize={fontSize}
            character={piece}
            reverse={reverse}
            scale={pieceScale}
            isHanded={false}
          />
        </div>
        <span class="piece-count"> {num}</span>
      {/if}
    </div>
  {/each}
</div>

<style>
  .captured {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 4px;
    padding: 4px;
  }

  .piece-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .piece-top {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 20;
  }

  .piece-below {
    z-index: 10;
  }

  .piece-count {
    font-size: 30px;
    color: #555;
    z-index: 30;
  }
</style>
