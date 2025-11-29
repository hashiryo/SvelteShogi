<script lang="ts">
  import { initialize } from "@/handler/initialize";
  import MainView from "@/ui/main-view/MainView.svelte";
  import SubView from "@/ui/sub-view/SubView.svelte";

  // 初期化処理
  await initialize();

  let innerWidth = $state(0);
  let isMobile = $derived(innerWidth < 1000);
</script>

<svelte:window bind:innerWidth />

<main>
  <div class="container" class:mobile={isMobile}>
    <div class="main-section">
      <MainView />
    </div>
    <div class="sub-section">
      <SubView />
    </div>
  </div>
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
    padding: 10px;
    gap: 12px;
  }

  .container.mobile .main-section {
    flex: 0 0 auto;
  }

  .container.mobile .sub-section {
    width: 100%;
    flex: 1;
    min-height: 300px;
  }

  :global(.favorite-moves-section) {
    margin-bottom: 8px;
  }
</style>
