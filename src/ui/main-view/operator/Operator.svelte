<script>
  import { ReverseStore } from "@/store/game-board.svelte";
  import { CurrentIndexStore, NodesStore } from "@/store/kifu-node.svelte";
  import { jumpToKifu } from "@/handler/kifu-node";
  
  let reverse = $derived(ReverseStore.get());
  
  // 履歴IDsの取得（KifuHistory.svelteから参考）
  function getIds() {
    let ret = [];
    let cur = 0;
    while (cur !== -1) {
      ret.push(cur);
      const node = NodesStore.getNode(cur);
      cur = node.next;
    }
    return ret;
  }
  
  let ids = $derived(getIds());
  let currentIndex = $derived(CurrentIndexStore.get());
  
  // 現在位置の計算
  let currentPos = $derived(ids.indexOf(currentIndex));
  
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
    ⏮️
  </button>
  
  <button
    class="nav-btn prev-btn"
    aria-label="一つ戻る"
    disabled={!canGoPrevious}
    onclick={goPrevious}
  >
    ⏪
  </button>
  
  <button
    class="nav-btn next-btn"
    aria-label="一つ進む"
    disabled={!canGoNext}
    onclick={goNext}
  >
    ⏩
  </button>
  
  <button
    class="nav-btn last-btn"
    aria-label="最終局面へ"
    disabled={!canGoToLast}
    onclick={goToLast}
  >
    ⏭️
  </button>
  
  <!-- 既存の盤面反転ボタン -->
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
  }
  
  .nav-btn {
    background-color: #f5f5f5;
    color: #333333;
    border: 1px solid #cccccc;
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
    background-color: #e8e8e8;
    border-color: #999999;
  }
  
  .nav-btn:active:not(:disabled) {
    background-color: #d8d8d8;
    transform: translateY(1px);
  }
  
  .nav-btn:disabled {
    background-color: #f9f9f9;
    color: #cccccc;
    border-color: #e0e0e0;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .nav-btn:focus {
    outline: 2px solid #4CAF50;
    outline-offset: 2px;
  }

  .reverse-btn {
    background-color: #cccccc;
    color: #555555;
    border: 1px solid #999999;
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
    background-color: rgb(2, 162, 109);
    color: white;
  }
  
  .reverse-btn:hover {
    opacity: 0.8;
  }
  
  .reverse-btn:focus {
    outline: 2px solid #4CAF50;
    outline-offset: 2px;
  }
</style>
