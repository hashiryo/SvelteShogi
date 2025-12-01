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
  import { MetadataStore } from "@/store/metadata.svelte";

  let files: FileList | undefined | null = $state();
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  let isDragging = $state(false);
  let fileInput: HTMLInputElement;
  let metadata = $derived(MetadataStore.get());

  async function handleFileImport(file: File) {
    if (!file.name.endsWith(".kif")) {
      error = "KIFファイルのみ対応しています";
      return;
    }

    isLoading = true;
    error = null;
    MetadataStore.clear();

    try {
      console.log(`ファイル読み込み開始: ${file.name} (${file.size} bytes)`);

      // まずUTF-8で読み込みを試行
      let content: string;
      let encoding = "UTF-8";

      try {
        console.log("エンコーディング: UTF-8 で読み込み試行...");
        content = await readFileAsText(file, "UTF-8");
        console.log("UTF-8での読み込み完了、パース開始");

        const parsedData = parseKif(content);

        // メタデータが空の場合、エンコーディングが間違っている可能性がある
        if (
          Object.keys(parsedData.metadata).length === 0 &&
          parsedData.moves.length === 0
        ) {
          console.warn(
            "UTF-8でのパースが空の結果になりました。Shift_JISで再試行します...",
          );
          encoding = "Shift_JIS";
          content = await readFileAsText(file, "Shift_JIS");
          console.log("Shift_JISでの読み込み完了、パース開始");
        } else {
          console.log(`✅ UTF-8でのパース成功`, parsedData);
          await processKifData(parsedData);
          return;
        }
      } catch (utf8Error) {
        console.warn("UTF-8でのパースに失敗:", utf8Error);
        console.log("Shift_JISで再試行します...");
        encoding = "Shift_JIS";
        content = await readFileAsText(file, "Shift_JIS");
        console.log("Shift_JISでの読み込み完了、パース開始");
      }

      // Shift_JISでのパース
      const parsedData = parseKif(content);
      console.log(`✅ ${encoding}でのパース完了:`, parsedData);
      await processKifData(parsedData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "不明なエラーが発生しました";
      error = errorMessage;
      console.error("❌ ファイル処理エラー:", err);
      console.error("エラーの詳細:", errorMessage);

      // エラーを確実に表示するため、アラートも追加
      alert(`棋譜の読み込みに失敗しました:\n\n${errorMessage}`);
    } finally {
      isLoading = false;
      files = null;
    }
  }

  async function processKifData(parsedData: {
    metadata: any;
    moves: string[];
  }) {
    const moves = parsedData.moves;
    MetadataStore.set(parsedData.metadata);

    console.log("ノード生成開始");
    let { grid, capturedSente, capturedGote, isSente, nodes } =
      movesToNodes(moves);
    console.log(`ノード生成完了: ${nodes.length}個のノード`);

    const sfenxes = nodes.map((node) => node.sfenx);
    console.log("お気に入り手取得中...");
    await fetchAndSetFavoriteMovesMulti(sfenxes);
    console.log("統計情報取得中...");
    await fetchAndSetMoveStatisticsMulti(sfenxes);

    const n = nodes.length;
    for (let i = 0; i + 1 < n; i++) {
      const favoriteMoves = getCurrentFavorites(
        nodes[i].isSente,
        nodes[i].sfenx,
      );
      const move = nodes[i + 1].move;
      const isFavorite = favoriteMoves ? favoriteMoves.includes(move) : false;
      if (isFavorite) {
        nodes[i + 1].isFavorite = true;
      }
    }

    console.log("ストア更新中...");
    GridStore.set(grid);
    CapturesStore.set(true, capturedSente);
    CapturesStore.set(false, capturedGote);
    IsSenteTurnStore.set(isSente);
    NodesStore.set(nodes);
    CurrentIndexStore.set(nodes.length - 1);

    console.log("✅ 棋譜の取り込みが完了しました！");
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFileImport(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function handleClick() {
    fileInput.click();
  }

  function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      handleFileImport(target.files[0]);
    }
  }
</script>

<div class="import-container">
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="drop-zone"
    class:dragging={isDragging}
    ondrop={handleDrop}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    onclick={handleClick}
  >
    <input
      type="file"
      accept=".kif"
      bind:this={fileInput}
      onchange={handleFileSelect}
      style="display: none;"
    />

    <div class="icon-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
    </div>
    <p class="drop-text">
      {#if isLoading}
        読み込み中...
      {:else}
        KIFファイルをドロップ<br />またはクリックして選択
      {/if}
    </p>
  </div>

  {#if error}
    <p class="error-message">{error}</p>
  {/if}

  {#if metadata}
    <div class="metadata-section">
      <h4>棋譜情報</h4>
      <table>
        <tbody>
          {#if metadata.startTime}
            <tr>
              <td>開始日時</td>
              <td>{metadata.startTime}</td>
            </tr>
          {/if}
          {#if metadata.endTime}
            <tr>
              <td>終了日時</td>
              <td>{metadata.endTime}</td>
            </tr>
          {/if}
          {#if metadata.event}
            <tr>
              <td>棋戦</td>
              <td>{metadata.event}</td>
            </tr>
          {/if}
          {#if metadata.blackPlayer}
            <tr>
              <td>先手</td>
              <td>{metadata.blackPlayer}</td>
            </tr>
          {/if}
          {#if metadata.whitePlayer}
            <tr>
              <td>後手</td>
              <td>{metadata.whitePlayer}</td>
            </tr>
          {/if}
          {#if metadata.result}
            <tr>
              <td>結果</td>
              <td>{metadata.result}</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .import-container {
    width: 100%;
  }

  .drop-zone {
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    padding: 24px 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: var(--header-bg-color);
    color: var(--text-color);
  }

  .drop-zone:hover {
    border-color: var(--success-color);
    background-color: var(--selected-bg-color);
    color: var(--success-color);
  }

  .drop-zone.dragging {
    border-color: var(--success-color);
    background-color: var(--selected-bg-color);
    transform: scale(1.02);
  }

  .icon-container {
    margin-bottom: 8px;
    opacity: 0.7;
  }

  .drop-text {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
  }

  .error-message {
    color: var(--error-color);
    font-size: 13px;
    margin-top: 8px;
    text-align: center;
  }

  .metadata-section {
    margin-top: 16px;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: var(--bg-color);
  }

  .metadata-section h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: var(--header-text-color);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 4px;
  }

  .metadata-section table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .metadata-section td {
    padding: 4px 0;
    vertical-align: top;
  }

  .metadata-section td:first-child {
    color: var(--text-color);
    opacity: 0.7;
    width: 70px;
    white-space: nowrap;
  }

  .metadata-section td:last-child {
    color: var(--text-color);
    font-weight: 500;
  }
</style>
