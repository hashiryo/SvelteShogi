<script lang="ts">
  import Piece from './Piece.svelte';
  import type { PieceType } from '@/types/shogi.d.ts';
  import { promotePiece } from '@/domain/shogi-rule';

  let {
    squareWidth = 40,
    squareHeight = 44,
    pieceScale = 0.9,
    fontSize = 32,
    reverse = false,
    piece = '歩' as PieceType,
    clickHandler = (getPromote: boolean) => { console.log(`getPromote: ${getPromote}`); },
  } = $props();
</script>

<div class="promote">
  <div class="promote-piece"
        role="button"
        tabindex="-1"
        onclick={() => clickHandler(true)}
        onkeydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            clickHandler(true);
          }
        }}
  >
    <Piece
      width={squareWidth}
      height={squareHeight}
      fontSize={fontSize}
      character={promotePiece(piece)}
      reverse={reverse}
      scale={pieceScale}
    />
  </div>
  <div class="original-piece"
        role="button"
        tabindex="-1"
        onclick={() => clickHandler(false)}
        onkeydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            clickHandler(false);
          }
        }}
  >
    <Piece
      width={squareWidth}
      height={squareHeight}
      fontSize={fontSize}
      character={piece}
      reverse={reverse}
      scale={pieceScale}
    />
  </div>
</div>

<style>
  .promote {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .promote-piece{
    background: rgba(255, 255, 0, 0.5);
  }
  .original-piece {
    background: rgba(0, 0, 0, 0.5);
  }
</style>