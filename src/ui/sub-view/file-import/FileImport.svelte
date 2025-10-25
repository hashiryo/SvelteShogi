<script lang="ts">
  import { parseKif, readFileAsText } from "@/domain/format-parcer";
  import { movesToNodes } from "@/domain/move";
  import {
    fetchAndSetFavoriteMovesMulti,
    getCurrentFavorites,
  } from "@/handler/favorite-moves";
  import {
    CapturesStore,
    GridStore,
    IsSenteTurnStore,
  } from "@/store/game-board.svelte";
  import { CurrentIndexStore, NodesStore } from "@/store/kifu-node.svelte";

  let files: FileList | undefined | null = $state();
  let isLoading = $state(false);
  let error = $state<string | null>(null);

  async function handleFileImport(file: File) {
    isLoading = true;
    error = null;

    try {
      console.log(`ファイル読み込み開始: ${file.name} (${file.size} bytes)`);

      // ファイルをテキストとして読み込み
      const content = await readFileAsText(file);
      console.log("ファイル内容:", content);

      // KIF形式をパース
      const { metadata, moves } = parseKif(content);
      console.log("メタデータ:", metadata);
      console.log("指し手:", moves);

      let { grid, capturedSente, capturedGote, isSente, nodes } =
        movesToNodes(moves);

      const sfenxes = nodes.map((node) => node.sfenx);
      await fetchAndSetFavoriteMovesMulti(sfenxes);

      const n = nodes.length;
      for (let i = 0; i + 1 < n; i++) {
        const favoriteMoves = getCurrentFavorites(
          nodes[i].isSente,
          nodes[i].sfenx
        );
        const move = nodes[i + 1].move;
        const isFavorite = favoriteMoves ? favoriteMoves.includes(move) : false;
        if (isFavorite) {
          nodes[i + 1].isFavorite = true;
        }
      }
      GridStore.set(grid);
      CapturesStore.set(true, capturedSente);
      CapturesStore.set(false, capturedGote);
      IsSenteTurnStore.set(isSente);
      NodesStore.set(nodes);
      CurrentIndexStore.set(nodes.length - 1);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "不明なエラーが発生しました";
      error = errorMessage;
      console.error("ファイル処理エラー:", err);
    } finally {
      isLoading = false;
      files = null;
    }
  }

  $effect(() => {
    if (files && files.length > 0) {
      // 最初のファイルを処理
      const file = files[0];
      handleFileImport(file);
    }
  });
</script>

<div>
  <h3>棋譜のimport</h3>

  <input class="file-input" accept=".kif" bind:files type="file" />

  {#if isLoading}
    <p>ファイルを処理中...</p>
  {/if}

  {#if error}
    <p style="color: red;">エラー: {error}</p>
  {/if}

  {#if files && files.length > 0}
    <p>選択されたファイル: {files[0].name}</p>
  {/if}
</div>

<style>
  .file-input {
    cursor: pointer;
  }
</style>
