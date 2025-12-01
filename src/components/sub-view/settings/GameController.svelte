<script>
  import { CurrentIndexStore, NodesStore } from "@/store/kifu-node.svelte";
  import { executeInsertKifu } from "@/handler/insert-kifu";

  let currentIndex = $derived(CurrentIndexStore.get());
  let currentNode = $derived(
    currentIndex >= 0 ? NodesStore.getNode(currentIndex) : null,
  );

  let isResignState = $derived(
    currentNode?.display === "投了" || currentNode?.display === "切れ負け",
  );
  let isSavedState = $derived(currentNode?.isSaved ?? false);

  let canSave = $derived(isResignState && !isSavedState);
</script>

<div class="game-controller">
  <button
    class="save-btn"
    disabled={!canSave}
    onclick={() => executeInsertKifu(currentIndex)}
  >
    {isSavedState ? "登録済み" : "棋譜をDBに登録"}
  </button>
</div>

<style>
  .game-controller {
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--bg-color);
  }

  .save-btn {
    width: 100%;
    padding: 12px;
    background-color: var(--success-color);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .save-btn:disabled {
    background-color: var(--button-disabled-bg-color);
    color: var(--button-disabled-text-color);
    cursor: not-allowed;
    opacity: 0.7;
  }

  .save-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .save-btn:active:not(:disabled) {
    transform: translateY(0);
  }
</style>
