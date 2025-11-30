<script lang="ts">
  import { onMount } from "svelte";
  import { initialize } from "@/handler/initialize";
  import MainView from "@/ui/main-view/MainView.svelte";
  import SubView from "@/ui/sub-view/SubView.svelte";

  let isInitialized = $state(false);
  let innerWidth = $state(window.innerWidth);
  let isMobile = $derived(innerWidth < 1000);

  // 初期化処理を onMount で実行
  onMount(async () => {
    await initialize();
    isInitialized = true;
  });
</script>

<svelte:window bind:innerWidth />

<main>
  {#if !isInitialized}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>読み込み中...</p>
    </div>
  {:else}
    <div class="container" class:mobile={isMobile}>
      <div class="main-section">
        <MainView />
      </div>
      <div class="sub-section">
        <SubView />
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    width: 100%;
    min-height: 100vh;
  }

  .container {
    display: flex;
    gap: 20px;
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* PC版レイアウト */
  .main-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .sub-section {
    width: 350px;
    display: flex;
    flex-direction: column;
  }

  /* モバイル版レイアウト */
  .container.mobile {
    flex-direction: column;
    padding: 0; /* パディングをなくして画面いっぱいにする */
    gap: 0;
    height: 100dvh; /* ビューポートの高さに固定 */
    overflow: hidden; /* スクロール禁止 */
  }

  .container.mobile .main-section {
    flex: 1; /* 残りのスペースを全て使う */
    overflow: hidden; /* 内部でのみスクロール可能にするならここを調整 */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container.mobile .sub-section {
    width: 100%;
    flex: 0 0 60px; /* ボトムナビゲーションの高さ分確保 */
    min-height: auto;
    z-index: 1000; /* メインビューより上に表示（念のため） */
  }

  :global(.favorite-moves-section) {
    margin-bottom: 8px;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 16px;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--border-color, #e0e0e0);
    border-top-color: var(--success-color, #4caf50);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-container p {
    color: var(--text-color, #333);
    font-size: 14px;
    margin: 0;
  }
</style>
