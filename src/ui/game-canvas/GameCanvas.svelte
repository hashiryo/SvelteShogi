<script lang="ts">
  import GameBoard from './game-board/GameBoard.svelte';
  import type { PieceType, PieceOnBoard } from '../../types/shogi.d.ts';

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

  // 仮の持ち駒データ
  let capturedPiecesMe: { piece: PieceType; num: number }[] = [
    { piece: "歩", num: 2 },
    { piece: "香", num: 1 }
  ];
  let capturedPiecesOpponent: { piece: PieceType; num: number }[] = [
    { piece: "銀", num: 1 },
    { piece: "角", num: 1 }
  ];
</script>

<main>
  <GameBoard {piecesOnBoard} {capturedPiecesMe} {capturedPiecesOpponent} />
</main>

<style>

</style>
