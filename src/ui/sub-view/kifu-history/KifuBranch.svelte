<script lang="ts">
  import {
    BranchesStore,
    CurrentIndexStore,
    NodesStore,
  } from "@/store/kifu-node.svelte";

  import { switchBranch } from "@/handler/kifu-node";

  let containerRef: HTMLDivElement;

  let currentIndex = $derived(CurrentIndexStore.get());
  let branches = $derived(BranchesStore.get());
  let branchesCount = $derived(branches.length);

  // 自動スクロール
  $effect(() => {
    const currentPos = branches.indexOf(currentIndex);
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
    if (e.code !== "Space") return;
    e.preventDefault();
    switchBranch(NodesStore.getNode(currentIndex).br_next);
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

<div class="kifu-branch">
  <div class="card-header">
    変化
    {#if branchesCount > 1}
      <span class="count-badge">({branchesCount}件)</span>
    {/if}
    <div class="kifu-branch-keyboard-hint">
      <kbd>Space</kbd>
    </div>
  </div>
  <div class="kifu-branch-list" role="listbox" bind:this={containerRef}>
    {#each branches as id}
      {@const node = NodesStore.getNode(id)}
      <div
        class="kifu-branch-item"
        class:current={id === currentIndex}
        role="button"
        tabindex="-1"
        aria-current={id === currentIndex ? "true" : undefined}
        onclick={() => switchBranch(id)}
        onkeydown={(e) => {
          if (e.key === "Enter") {
            switchBranch(id);
          }
        }}
      >
        <div class="kifu-branch-item-favorite">
          {#if node.isFavorite}
            <div class="kifu-branch-item-favorite-content">★</div>
          {/if}
        </div>
        <div class="kifu-branch-item-display">
          {node.display}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .kifu-branch {
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }
  .kifu-branch-list {
    padding: 0px 8px 0 8px;
    height: 100px;
    overflow-y: auto;
    display: grid;
    gap: 2px;
    --item-height: 24px;
    scroll-behavior: auto;
    align-content: start;
    overscroll-behavior: contain;
  }
  .kifu-branch-item {
    height: var(--item-height);
    padding: 4px 8px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
    color: var(--text-color);
  }
  .kifu-branch-item:focus {
    outline: none;
  }
  .kifu-branch-item.current {
    background-color: var(--selected-bg-color);
    color: var(--selected-text-color);
    border-radius: 4px;
  }
  .kifu-branch-item-display {
    width: 92%;
    text-align: left;
  }
  .kifu-branch-item-favorite {
    width: 8%;
    color: rgb(243, 220, 74);
  }
  .kifu-branch-keyboard-hint {
    margin-left: auto;
  }
</style>
