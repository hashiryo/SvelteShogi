<script lang="ts">
  import { initialize } from "@/handler/initialize";
  import GameCanvas from "./ui/main-canvas/MainCanvasPlay.svelte";
  import KifuHistory from "./ui/kifu-history/KifuHistory.svelte";
  import KifuBranch from "./ui/kifu-history/KifuBranch.svelte";

  // 初期化処理
  await initialize();
</script>

<main>
  <div class="container">
    <GameCanvas />
    <div class="subcanvas">
      <KifuHistory />
      <KifuBranch />
    </div>
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
</style>
