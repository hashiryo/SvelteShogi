<script lang="ts">
  import GameBoard from './game-board/GameBoard.svelte';
  import type { PieceOnBoard } from '../../types/shogi.d.ts';

  // 仮の盤上の駒データ
  let piecesOnBoard: PieceOnBoard[] = [
    {
      piece: "歩",
      is_sente: true,
      row: 6,
      col: 0
    },
    {
      piece: "香",
      is_sente: true,
      row: 7,
      col: 0
    },
    {
      piece: "玉",
      is_sente: false,
      row: 0,
      col: 4
    }
  ];
</script>

<main>
  <GameBoard {piecesOnBoard} />
</main>

<style>

</style>
