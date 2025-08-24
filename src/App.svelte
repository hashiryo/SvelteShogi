<script lang="ts">
  import GameCanvas from './ui/main-canvas/MainCanvasPlay.svelte';
  import KifuHistory  from './ui/kifu-history/KifuHistory.svelte';
</script>

<main>
  <div class="container">
    <GameCanvas />
    <KifuHistory />
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
