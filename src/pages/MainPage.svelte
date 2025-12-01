<script lang="ts">
  import MainView from "@/components/main-view/MainView.svelte";
  import SubView from "@/components/sub-view/SubView.svelte";

  let innerWidth = $state(window.innerWidth);
  let isMobile = $derived(innerWidth < 1000);
</script>

<svelte:window bind:innerWidth />
<div class="container" class:mobile={isMobile}>
  <div class="main-section">
    <MainView />
  </div>
  <div class="sub-section">
    <SubView />
  </div>
</div>

<style>
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
    z-index: 10000; /* メインビューより上に表示（念のため） */
  }
</style>
