<script lang="ts">
  import KifuHistory from "./kifu-history/KifuHistory.svelte";
  import KifuBranch from "./kifu-history/KifuBranch.svelte";
  import FavoriteNextMoves from "./favorite-next-moves/FavoriteNextMoves.svelte";
  import NextMoveStatistics from "./next-move-statistics/NextMoveStatistics.svelte";
  import FileImport from "./file-import/FileImport.svelte";
</script>

<div class="sub-view">
  <KifuHistory />
  <KifuBranch />
  <FavoriteNextMoves />
  <NextMoveStatistics />
  <FileImport />
</div>

<style>
  .sub-view {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
