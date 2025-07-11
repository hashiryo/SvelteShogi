<script lang="ts">
  import FavoriteOnBoard from './FavoriteOnBoard.svelte';
  import StatisticsOnBoard from './StatisticsOnBoard.svelte';
  import type { PieceType, FavoriteFrom, StatisticsFrom } from '../../../types/shogi.d.ts';

  let {
    relativeSquarePositions = [] as { x: number, y: number }[],
    relativeCapturedMePositions = new Map<PieceType, { x: number; y: number }>(),
    relativeCapturedOpponentPositions = new Map<PieceType, { x: number; y: number }>(),
  }
  = $props();


    let favoriteArrows: (FavoriteFrom)[] = [
    // {
    //   startRow: 8,
    //   startCol: 0,
    //   endRow: 0,
    //   endCol: 0
    // },
    // {
    //   startRow: 5,
    //   startCol: 0,
    //   endRow: 5,
    //   endCol: 8
    // },
    // {
    //   startRow: 4,
    //   startCol: 4,
    //   endRow: 8,
    //   endCol: 8,
    // },
    // {
    //   startRow: 2,
    //   startCol: 2,
    //   endRow: 3,
    //   endCol: 3,
    // },
    // {
    //   startRow: 1,
    //   startCol: 1,
    //   endRow: 1,
    //   endCol: 2,
    // },
    // {
    //   startRow: 0,
    //   startCol: 4,
    //   endRow: 6,
    //   endCol: 0,
    // },
    // {
    //   piece: "歩",
    //   is_sente: true,
    //   endRow: 6,
    //   endCol: 0,
    // },
    {
      piece: "銀",
      is_sente: false,
      endRow: 7,
      endCol: 0,
    }
  ];

  let statisticsArrows: (StatisticsFrom)[] = [
    {
      startRow: 8,
      startCol: 0,
      endRow: 0,
      endCol: 0,
      apparentRate: 0.8,
      winRate: 0.75,
    },
    {
      startRow: 5,
      startCol: 0,
      endRow: 5,
      endCol: 8,
      apparentRate: 0.7,
      winRate: 0.6,
    },
    {
      startRow: 4,
      startCol: 8,
      endRow: 8,
      endCol: 4,
      apparentRate: 0.6,
      winRate: 0.5,
    },
    {
      startRow: 2,
      startCol: 2,
      endRow: 3,
      endCol: 3,
      apparentRate: 0.4,
      winRate: 0.3,
    },
    {
      startRow: 1,
      startCol: 1,
      endRow: 1,
      endCol: 2,
      apparentRate: 0.2,
      winRate: 0.1,
    },
    {
      startRow: 1,
      startCol: 2,
      endRow: 1,
      endCol: 1,
      apparentRate: 0.9,
      winRate: 0.1,
    },
    {
      startRow: 0,
      startCol: 4,
      endRow: 6,
      endCol: 0,
      apparentRate: 0.8,
      winRate: 0.75,
    },
    {
      piece: "歩",
      is_sente: true,
      endRow: 6,
      endCol: 0,
      apparentRate: 0.9,
      winRate: 0.85,
    },
    {
      piece: "銀",
      is_sente: false,
      endRow: 7,
      endCol: 0,
      apparentRate: 0.7,
      winRate: 0.65,
    }
  ];
</script>


<FavoriteOnBoard
  {relativeSquarePositions}
  {relativeCapturedMePositions}
  {relativeCapturedOpponentPositions}
  arrows={favoriteArrows}
/>
<StatisticsOnBoard
  {relativeSquarePositions}
  {relativeCapturedMePositions}
  {relativeCapturedOpponentPositions}
  arrows={statisticsArrows}
/>