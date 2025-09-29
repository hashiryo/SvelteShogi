<script lang="ts">
  import MainCanvas from "./main-canvas/MainCanvasPlay.svelte";
  import Operator from "./operator/Operator.svelte";
</script>

<div class="main-view">
  <MainCanvas />
  <Operator />
</div>

<style>
  .main-view {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
