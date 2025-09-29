<script lang="ts">
  import { initialize } from "@/handler/initialize";
  import MainView from "@/ui/main-view/MainView.svelte";
  import SubView from "@/ui/sub-view/SubView.svelte";

  // 初期化処理
  await initialize();
</script>

<main>
  <div class="container">
    <MainView />
    <SubView />
  </div>
</main>

<style>
  .container {
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: flex-start;
    max-width: 1200px;
    margin: 0 auto;
  }

  :global(.container > :first-child) {
    flex: 1;
  }

  :global(.container > :last-child) {
    width: 300px;
  }

  :global(.favorite-moves-section) {
    margin-bottom: 8px;
  }
</style>
