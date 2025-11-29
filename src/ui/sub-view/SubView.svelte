<script lang="ts">
  import KifuHistory from "./kifu-history/KifuHistory.svelte";
  import KifuBranch from "./kifu-history/KifuBranch.svelte";
  import FavoriteNextMoves from "./favorite-next-moves/FavoriteNextMoves.svelte";
  import NextMoveStatistics from "./next-move-statistics/NextMoveStatistics.svelte";
  import FileImport from "./file-import/FileImport.svelte";
  import UserAuth from "./user-auth/UserAuth.svelte";

  let activeTab = $state("kifu"); // "kifu" | "data" | "settings"
  let innerWidth = $state(0);

  // 768px未満をモバイルとする
  let isMobile = $derived(innerWidth < 1000);

  function setTab(tab: string) {
    activeTab = tab;
  }
</script>

<svelte:window bind:innerWidth />

<div class="sub-view">
  {#if isMobile}
    <!-- モバイル用タブナビゲーション -->
    <div class="tabs">
      <button
        class:active={activeTab === "kifu"}
        onclick={() => setTab("kifu")}
      >
        棋譜
      </button>
      <button
        class:active={activeTab === "data"}
        onclick={() => setTab("data")}
      >
        検討
      </button>
      <button
        class:active={activeTab === "settings"}
        onclick={() => setTab("settings")}
      >
        設定
      </button>
    </div>

    <div class="tab-content">
      {#if activeTab === "kifu"}
        <div class="tab-pane">
          <KifuHistory />
          <KifuBranch />
        </div>
      {:else if activeTab === "data"}
        <div class="tab-pane">
          <FavoriteNextMoves />
          <NextMoveStatistics />
        </div>
      {:else if activeTab === "settings"}
        <div class="tab-pane">
          <UserAuth />
          <FileImport />
        </div>
      {/if}
    </div>
  {:else}
    <!-- PC用レイアウト（一覧表示） -->
    <div class="pc-layout">
      <div class="section">
        <UserAuth />
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

  /* タブスタイル */
  .tabs {
    display: flex;
    border-bottom: 1px solid #444;
    margin-bottom: 16px;
  }

  .tabs button {
    flex: 1;
    padding: 12px;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: #aaa;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0;
    transition: all 0.2s;
    font-size: 14px;
  }

  @media (max-width: 500px) {
    .tabs {
      margin-bottom: 12px;
    }

    .tabs button {
      padding: 10px 8px;
      font-size: 13px;
    }
  }

  .tabs button:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: #ddd;
  }

  .tabs button.active {
    color: #646cff;
    border-bottom-color: #646cff;
  }

  .tab-content {
    flex: 1;
    overflow-y: auto;
  }

  .tab-pane {
    display: flex;
    flex-direction: column;
    gap: 16px;
    animation: fadeIn 0.2s ease-out;
  }

  /* PC用スタイル */
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

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
