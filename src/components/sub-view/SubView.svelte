<script lang="ts">
  import KifuHistory from "./kifu-history/KifuHistory.svelte";
  import KifuBranch from "./kifu-history/KifuBranch.svelte";
  import FavoriteNextMoves from "./favorite-next-moves/FavoriteNextMoves.svelte";
  import NextMoveStatistics from "./next-move-statistics/NextMoveStatistics.svelte";
  import FileImport from "./file-import/FileImport.svelte";
  import User from "./user/User.svelte";
  import GameController from "./settings/GameController.svelte";
  import { fade, fly } from "svelte/transition";

  let activeTab = $state("kifu"); // "kifu" | "data" | "settings"
  let isDialogOpen = $state(false); // ダイアログの表示状態
  let innerWidth = $state(window.innerWidth);

  // 1000px未満をモバイルとする
  let isMobile = $derived(innerWidth < 1000);

  function openTab(tab: string) {
    activeTab = tab;
    isDialogOpen = true;
  }

  function closeDialog() {
    isDialogOpen = false;
  }
</script>

<svelte:window bind:innerWidth />

<div class="sub-view">
  {#if isMobile}
    <!-- モバイル用：ボトムナビゲーション -->
    <div class="bottom-nav">
      <button
        class:active={activeTab === "kifu" && isDialogOpen}
        onclick={() => openTab("kifu")}
      >
        <span class="icon">📝</span>
        <span class="label">棋譜</span>
      </button>
      <button
        class:active={activeTab === "data" && isDialogOpen}
        onclick={() => openTab("data")}
      >
        <span class="icon">📊</span>
        <span class="label">検討</span>
      </button>
      <button
        class:active={activeTab === "settings" && isDialogOpen}
        onclick={() => openTab("settings")}
      >
        <span class="icon">⚙️</span>
        <span class="label">設定</span>
      </button>
    </div>

    <!-- モバイル用：モーダルダイアログ -->
    {#if isDialogOpen}
      <div
        class="modal-overlay"
        onclick={closeDialog}
        transition:fade={{ duration: 200 }}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === "Escape" && closeDialog()}
        aria-label="Close dialog"
      >
        <div
          class="modal-content"
          onclick={(e) => e.stopPropagation()}
          transition:fly={{ y: 50, duration: 200 }}
          role="document"
        >
          <div class="modal-header">
            <h3>
              {#if activeTab === "kifu"}棋譜リスト
              {:else if activeTab === "data"}検討データ
              {:else if activeTab === "settings"}設定
              {/if}
            </h3>
            <button class="close-button" onclick={closeDialog}>×</button>
          </div>
          <div class="modal-body">
            {#if activeTab === "kifu"}
              <KifuHistory />
              <KifuBranch />
            {:else if activeTab === "data"}
              <FavoriteNextMoves />
              <NextMoveStatistics />
            {:else if activeTab === "settings"}
              <User />
              <GameController />
              <FileImport />
            {/if}
          </div>
        </div>
      </div>
    {/if}
  {:else}
    <!-- PC用レイアウト（一覧表示） -->
    <div class="pc-layout">
      <div class="section">
        <User />
        <GameController />
      </div>
      <div class="section">
        <KifuHistory />
        <KifuBranch />
      </div>
      <div class="section">
        <FavoriteNextMoves />
        <NextMoveStatistics />
      </div>
      <div class="section">
        <FileImport />
      </div>
    </div>
  {/if}
</div>

<style>
  .sub-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  /* --- モバイル用スタイル --- */
  .bottom-nav {
    display: flex;
    justify-content: space-around;
    background-color: var(--header-bg-color);
    border-top: 1px solid var(--border-color);
    padding: 8px 0;
    padding-bottom: env(safe-area-inset-bottom, 8px); /* iPhone X以降対応 */
    width: 100%;
    height: 100%; /* 親コンテナの高さに合わせる */
    align-items: center;
  }

  .bottom-nav button {
    background: transparent;
    border: none;
    color: var(--text-color);
    opacity: 0.7;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .bottom-nav button .icon {
    font-size: 20px;
  }

  .bottom-nav button.active {
    color: var(--link-color);
    background-color: var(--selected-bg-color);
    opacity: 1;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
  }

  .modal-content {
    background-color: var(--bg-color);
    width: 100%;
    max-width: 500px;
    max-height: 80vh;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border-color);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--header-bg-color);
  }

  .modal-header h3 {
    margin: 0;
    font-size: 16px;
    color: var(--header-text-color);
  }

  .close-button {
    background: transparent;
    border: none;
    color: var(--text-color);
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    padding: 0 4px;
  }

  .modal-body {
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* --- PC用スタイル --- */
  .pc-layout {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
