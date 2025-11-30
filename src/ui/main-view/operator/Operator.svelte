<script>
  import { ReverseStore } from "@/store/game-board.svelte";
  import { CurrentIndexStore, NodesStore } from "@/store/kifu-node.svelte";
  import { jumpToKifu } from "@/handler/kifu-node";
  import { executeResign, executeTimeout } from "@/handler/execute-move";
  import { executeSave } from "@/handler/save";

  let reverse = $derived(ReverseStore.get());
  let ids = $derived(NodesStore.getPath(0));

  let currentIndex = $derived(CurrentIndexStore.get());
  let currentNode = $derived(
    currentIndex >= 0 ? NodesStore.getNode(currentIndex) : null,
  );

  // 現在位置の計算
  let currentPos = $derived(ids.indexOf(currentIndex));

  // 投了状態の判定
  let isResignState = $derived(
    currentNode?.display === "投了" || currentNode?.display === "切れ負け",
  );
  let isSavedState = $derived(currentNode?.isSaved ?? false);
  let shouldShowSaveButton = $derived(isResignState);
  let isSaveButtonDisabled = $derived(isSavedState);

  // ボタンの有効/無効状態
  let canGoToFirst = $derived(ids.length > 0 && currentPos > 0);
  let canGoPrevious = $derived(ids.length > 0 && currentPos > 0);
  let canGoNext = $derived(ids.length > 0 && currentPos < ids.length - 1);
  let canGoToLast = $derived(ids.length > 0 && currentPos < ids.length - 1);

  // ナビゲーション関数
  function goToFirst() {
    if (canGoToFirst) {
      jumpToKifu(ids[0]);
    }
  }

  function goPrevious() {
    if (canGoPrevious) {
      jumpToKifu(ids[currentPos - 1]);
    }
  }

  function goNext() {
    if (canGoNext) {
      jumpToKifu(ids[currentPos + 1]);
    }
  }

  function goToLast() {
    if (canGoToLast) {
      jumpToKifu(ids[ids.length - 1]);
    }
  }
</script>

<div class="operator-container">
  <!-- 履歴ナビゲーションボタン -->
  <button
    class="nav-btn first-btn"
    aria-label="初期局面へ"
    disabled={!canGoToFirst}
    onclick={goToFirst}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M6 18V6h2v12zm11 0l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6z"
        stroke-width="1"
        stroke="currentColor"
      />
    </svg>
  </button>

  <button
    class="nav-btn prev-btn"
    aria-label="一つ戻る"
    disabled={!canGoPrevious}
    onclick={goPrevious}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="m14 18l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6z"
        stroke-width="1"
        stroke="currentColor"
      />
    </svg>
  </button>

  <button
    class="nav-btn next-btn"
    aria-label="一つ進む"
    disabled={!canGoNext}
    onclick={goNext}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6z"
        stroke-width="1"
        stroke="currentColor"
      />
    </svg>
  </button>

  <button
    class="nav-btn last-btn"
    aria-label="最終局面へ"
    disabled={!canGoToLast}
    onclick={goToLast}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="m7 18l-1.4-1.4l4.6-4.6l-4.6-4.6L7 6l6 6zm9 0V6h2v12z"
        stroke-width="1"
        stroke="currentColor"
      />
    </svg>
  </button>

  {#if shouldShowSaveButton}
    <button
      aria-label="save"
      onclick={() => {
        executeSave(currentIndex);
      }}
      disabled={isSaveButtonDisabled}
      class="save-btn {isSaveButtonDisabled ? 'disabled' : ''}"
    >
      セーブ
    </button>
  {:else}
    <button aria-label="resign" onclick={executeResign}> 投了 </button>
    <button aria-label="timeout" onclick={executeTimeout}> 切れ負け </button>
  {/if}
  <button
    class="reverse-btn {reverse ? 'reverse' : ''}"
    aria-label="reverse"
    onclick={() => {
      ReverseStore.set(!reverse);
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99zM9 3L5 6.99h3V14h2V6.99h3z"
        stroke-width="1.1"
        stroke="currentColor"
      />
    </svg>
  </button>
</div>

<style>
  .operator-container {
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-wrap: wrap;
  }

  @media (max-width: 500px) {
    .operator-container {
      gap: 6px;
    }
  }

  .nav-btn {
    background-color: var(--header-bg-color);
    color: var(--button-text-color);
    border: 1px solid var(--button-border-color);
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 36px;
  }

  .nav-btn:hover:not(:disabled) {
    background-color: var(--button-hover-bg-color);
    border-color: var(--button-border-color);
  }

  .nav-btn:active:not(:disabled) {
    background-color: var(--button-disabled-bg-color);
    transform: translateY(1px);
  }

  .nav-btn:disabled {
    background-color: var(--button-disabled-bg-color);
    color: var(--button-disabled-text-color);
    border-color: var(--border-color);
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: 1000px) {
    .nav-btn {
      padding: 12px 18px;
      min-width: 50px;
      height: 50px;
    }
    .nav-btn svg {
      width: 28px;
      height: 28px;
    }
  }

  @media (max-width: 500px) {
    .nav-btn {
      padding: 10px 14px;
      min-width: 44px;
      height: 44px;
    }
    .nav-btn svg {
      width: 24px;
      height: 24px;
    }
  }

  .nav-btn:focus {
    outline: 2px solid var(--success-color);
    outline-offset: 2px;
  }

  .reverse-btn {
    background-color: var(--button-border-color);
    color: var(--button-text-color);
    border: 1px solid var(--button-border-color);
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 36px;
  }

  .reverse-btn.reverse {
    background-color: var(--success-color);
    color: white;
  }

  .reverse-btn:hover {
    opacity: 0.8;
  }

  .reverse-btn:focus {
    outline: 2px solid var(--success-color);
    outline-offset: 2px;
  }

  @media (max-width: 1000px) {
    .reverse-btn {
      padding: 12px 18px;
      min-width: 50px;
      height: 50px;
    }
    .reverse-btn svg {
      width: 28px;
      height: 28px;
    }
  }

  @media (max-width: 500px) {
    .reverse-btn {
      padding: 10px 14px;
      min-width: 44px;
      height: 44px;
    }
    .reverse-btn svg {
      width: 24px;
      height: 24px;
    }
  }

  .save-btn {
    background-color: var(--success-color);
    color: white;
    border: 1px solid var(--success-color);
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 60px;
    height: 36px;
  }

  .save-btn:hover:not(.disabled) {
    opacity: 0.9;
  }

  .save-btn:active:not(.disabled) {
    transform: translateY(1px);
  }

  .save-btn.disabled {
    background-color: var(--button-disabled-bg-color);
    color: var(--button-disabled-text-color);
    border-color: var(--button-border-color);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .save-btn:focus {
    outline: 2px solid var(--success-color);
    outline-offset: 2px;
  }

  @media (max-width: 1000px) {
    .save-btn {
      padding: 12px 18px;
      min-width: 80px;
      height: 50px;
      font-size: 18px;
    }
  }

  @media (max-width: 500px) {
    .save-btn {
      padding: 10px 14px;
      min-width: 70px;
      height: 44px;
      font-size: 14px;
    }
  }

  button {
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 60px;
    height: 36px;
  }

  @media (max-width: 1000px) {
    button {
      padding: 12px 18px;
      min-width: 80px;
      height: 50px;
      font-size: 18px;
    }
  }

  @media (max-width: 500px) {
    button {
      padding: 10px 14px;
      min-width: 70px;
      height: 44px;
      font-size: 14px;
    }
  }
</style>
