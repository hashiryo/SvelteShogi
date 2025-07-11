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
      {/if}
      {#if num > 1}
        <span class="piece-count" class:reverse style="--font-size: {fontSize * pieceScale * 0.6}px;">{num}</span>
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
    position: relative;
    z-index: 20;
  }

  .piece-below {
    position: absolute;
    top: 3px;
    left: 3px;
    z-index: 10;
  }

  .piece-count {
    position: absolute;
    font-weight: bold;
    font-size: var(--font-size);
    width: calc(var(--font-size) * 1.2);
    background-color: rgba(128, 128, 255, 0.9); 
    color: rgba(255, 255, 255, 1);
    border-radius: 60%;
    line-height: 1;
    bottom: -10%;
    right: -10%;
    z-index: 30;
    box-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  }

  .piece-count.reverse {
    top: -10%;
    bottom: auto;
  }
</style>
