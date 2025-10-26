<script lang="ts">
  import { parseKif, readFileAsText } from "@/domain/format-parcer";
  import { movesToNodes } from "@/domain/move";
  import {
    fetchAndSetFavoriteMovesMulti,
    getCurrentFavorites,
  } from "@/handler/favorite-moves";
  import { fetchAndSetMoveStatisticsMulti } from "@/handler/move-statistics";
  import {
    CapturesStore,
    GridStore,
    IsSenteTurnStore,
  } from "@/store/game-board.svelte";
  import { CurrentIndexStore, NodesStore } from "@/store/kifu-node.svelte";
  import type { KifMetadata } from "@/types/shogi";

  let files: FileList | undefined | null = $state();
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  let metadata: KifMetadata | null = $state(null); // メタデータ表示用の状態変数を追加

  async function handleFileImport(file: File) {
    isLoading = true;
    error = null;
    metadata = null; // 新しいファイルインポート時にメタデータをリセット

    try {
      console.log(`ファイル読み込み開始: ${file.name} (${file.size} bytes)`);

      // ファイルをテキストとして読み込み
      const content = await readFileAsText(file);
      console.log("ファイル内容:", content);

      // KIF形式をパース
      const parsedData = parseKif(content);
      metadata = parsedData.metadata; // メタデータを状態変数に保存
      const moves = parsedData.moves;
      console.log("メタデータ:", metadata);
      console.log("指し手:", moves);

      let { grid, capturedSente, capturedGote, isSente, nodes } =
        movesToNodes(moves);

      const sfenxes = nodes.map((node) => node.sfenx);
      await fetchAndSetFavoriteMovesMulti(sfenxes);
      await fetchAndSetMoveStatisticsMulti(sfenxes);

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

  <!-- メタデータ表示セクションを追加 -->
  {#if metadata}
    <div class="metadata-section">
      <h4>棋譜メタデータ</h4>
      <table>
        <tbody>
          {#if metadata.startTime}
            <tr>
              <td>開始日時:</td>
              <td>{metadata.startTime}</td>
            </tr>
          {/if}
          {#if metadata.endTime}
            <tr>
              <td>終了日時:</td>
              <td>{metadata.endTime}</td>
            </tr>
          {/if}
          {#if metadata.event}
            <tr>
              <td>棋戦:</td>
              <td>{metadata.event}</td>
            </tr>
          {/if}
          {#if metadata.handicap}
            <tr>
              <td>手合割:</td>
              <td>{metadata.handicap}</td>
            </tr>
          {/if}
          {#if metadata.blackPlayer}
            <tr>
              <td>先手:</td>
              <td>{metadata.blackPlayer}</td>
            </tr>
          {/if}
          {#if metadata.whitePlayer}
            <tr>
              <td>後手:</td>
              <td>{metadata.whitePlayer}</td>
            </tr>
          {/if}
          {#if metadata.result}
            <tr>
              <td>結果:</td>
              <td>{metadata.result}</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .file-input {
    cursor: pointer;
  }

  /* メタデータ表示用のスタイルを追加 */
  .metadata-section {
    margin-top: 1rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .metadata-section h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  .metadata-section table {
    width: 100%;
    border-collapse: collapse;
  }

  .metadata-section td {
    padding: 0.25rem 0.5rem;
    border-bottom: 1px solid #eee;
  }

  .metadata-section td:first-child {
    font-weight: bold;
    width: 30%;
  }
</style>
