<script lang="ts">
  import { CurrentIndexStore, NodesStore } from "@/store/kifu-node.svelte";
  import { jumpToKifu } from "@/handler/kifu-node";
  import { clickFavoriteIcon } from "@/handler/favorite-moves";
  import { isSpecialMove } from "@/domain/sfenx";

  let ids = $derived(NodesStore.getPath(0));
  let currentIndex = $derived(CurrentIndexStore.get());
  let containerRef: HTMLDivElement;

  // currentIndexが変更されたときに自動スクロール
  $effect(() => {
    const currentPos = ids.indexOf(currentIndex);
    if (currentPos !== -1 && containerRef) {
      const currentItem = containerRef.children[currentPos] as HTMLElement;
      if (currentItem) {
        // ビューポート基準での位置を取得
        const itemRect = currentItem.getBoundingClientRect();
        const containerRect = containerRef.getBoundingClientRect();

        // コンテナ内での相対位置を計算
        const itemRelativeTop = itemRect.top - containerRect.top;
        const itemRelativeBottom = itemRect.bottom - containerRect.top;

        // アイテムがコンテナの表示範囲外にある場合のみスクロール
        if (itemRelativeTop < 0) {
          // 上方向にスクロール（アイテムが上に隠れている）
          containerRef.scrollTop += itemRelativeTop;
        } else if (itemRelativeBottom > containerRect.height) {
          // 下方向にスクロール（アイテムが下に隠れている）
          containerRef.scrollTop += itemRelativeBottom - containerRect.height;
        }
        // アイテムが既に表示範囲内にある場合は何もしない
      }
    }
  });

  function handleKeyDown(e: KeyboardEvent) {
    if (
      e.key !== "ArrowDown" &&
      e.key !== "ArrowUp" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    )
      return;
    e.preventDefault();
    const pos = ids.indexOf(currentIndex);
    let newPos = pos === -1 ? 0 : pos;
    if (e.key === "ArrowDown") {
      if (pos < ids.length - 1) newPos = pos + 1;
    } else if (e.key === "ArrowUp") {
      if (pos > 0) newPos = pos - 1;
    } else if (e.key === "ArrowLeft") {
      newPos = 0;
    } else if (e.key === "ArrowRight") {
      newPos = ids.length - 1;
    }

    const newId = ids[newPos];
    if (newId !== undefined && newId !== currentIndex) {
      jumpToKifu(newId);
      // フォーカスを外す（preventScrollで画面スクロールを防ぐ）
      containerRef.focus({ preventScroll: true });
    }
  }

  function handleGlobalKeyDown(e: KeyboardEvent) {
    // 特定の条件下でのみ実行（例：入力フィールドにフォーカスがない時）
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return; // 入力フィールドにフォーカスがある場合は無視
    }
    handleKeyDown(e);
  }

  $effect(() => {
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  });
</script>

<div class="kifu-history">
  <div class="card-header">
    指し手
    <div class="kifu-history-keyboard-hint">
      <kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd>
    </div>
  </div>
  <div
    class="kifu-history-list"
    tabindex="-1"
    role="listbox"
    bind:this={containerRef}
  >
    {#each ids as id}
      {@const node = NodesStore.getNode(id)}
      <div
        class="kifu-history-item"
        class:current={id === currentIndex}
        role="button"
        tabindex="-1"
        aria-current={id === currentIndex ? "true" : undefined}
        onclick={() => jumpToKifu(id)}
        onkeydown={(e) => {
          if (e.key === "Enter") {
            jumpToKifu(id);
          }
        }}
      >
        <div class="kifu-history-item-display">
          {node.display}
        </div>
        {#if !isSpecialMove(node.move)}
          <div
            class="kifu-history-item-favorite"
            class:favorite={node.isFavorite}
            role="button"
            tabindex="-1"
            onclick={id === currentIndex
              ? () => clickFavoriteIcon(id)
              : undefined}
            onkeydown={id === currentIndex
              ? (e) => {
                  if (e.key === "Enter") {
                    clickFavoriteIcon(id);
                  }
                }
              : undefined}
          >
            <div class="kifu-history-item-favorite-content">★</div>
          </div>
          <div class="has-branch-flg">
            {#if node.br_next !== id}
              <div class="has-branch-flg-content">＋</div>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .kifu-history {
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }
  .kifu-history-list {
    padding: 0px 8px 0 8px;
    height: 400px;
    overflow-y: auto;
    display: grid;
    gap: 2px;
    --item-height: 24px;
    scroll-behavior: auto;
    align-content: start;
    overscroll-behavior: contain;
  }

  @media (max-width: 768px) {
    .kifu-history-list {
      height: 350px;
    }
  }

  @media (max-width: 500px) {
    .kifu-history-list {
      height: 300px;
      padding: 0px 4px;
    }
  }
  .kifu-history-list:focus {
    outline: none;
  }

  .kifu-history-item {
    height: var(--item-height);
    padding: 4px 8px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
    color: var(--text-color);
  }
  .kifu-history-item:focus {
    outline: none;
  }
  .kifu-history-item.current {
    background-color: var(--selected-bg-color);
    color: var(--selected-text-color);
    border-radius: 4px;
  }
  .kifu-history-item-display {
    width: 70%;
    text-align: left;
  }
  .kifu-history-item-favorite {
    display: flex;
    width: 16%;
    color: var(--text-color);
    opacity: 0.3;
    padding: 0;
  }
  .kifu-history-item-favorite:focus {
    outline: none;
  }
  .kifu-history-item.current .kifu-history-item-favorite-content:hover {
    transform: scale(1.3);
  }

  .kifu-history-item.current .kifu-history-item-favorite {
    color: var(--selected-text-color);
    opacity: 0.5;
  }

  .kifu-history-item-favorite.favorite {
    color: rgb(243, 220, 74);
    opacity: 1;
  }

  .kifu-history-item.current .kifu-history-item-favorite.favorite {
    color: rgb(244, 212, 5);
    opacity: 1;
  }

  .kifu-history-item:nth-child(odd) .kifu-history-item-favorite {
    justify-content: flex-end;
  }
  .kifu-history-item:nth-child(even) .kifu-history-item-favorite {
    justify-content: flex-start;
  }
  .has-branch-flg {
    width: 14%;
    display: flex;
    align-items: center;
    margin: 0;
    justify-content: flex-end;
  }
  .has-branch-flg-content {
    text-align: right;
    color: var(--text-color);
    opacity: 0.5;
    font-weight: bold;
  }

  .kifu-history-keyboard-hint {
    margin-left: auto;
  }
</style>
