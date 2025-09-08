<script lang="ts">
  import {
    getCurrentIndex,
    getNode,
    initKifuNodes,
    toggleFavorite,
  } from "@/store/kifu-node.svelte";
  import { getGrid, getCaptured } from "@/store/game-board.svelte";
  import { shogiPositionToSfenx } from "@/domain/sfenx";

  import { jumpToKifu } from "@/handler/kifu-node";

  initKifuNodes({
    display: "初期局面",
    sfenx: shogiPositionToSfenx(
      getGrid(),
      getCaptured(true),
      getCaptured(false)
    ),
    prev: -1,
    next: -1,
    br_next: 0,
    isSente: true,
    move: "",
    isFavorite: false,
  });

  function getIds() {
    let ret = [];
    let cur = 0;
    while (cur !== -1) {
      ret.push(cur);
      const node = getNode(cur);
      cur = node.next;
    }
    return ret;
  }

  let ids = $derived(getIds());
  let containerRef: HTMLDivElement;

  // currentIndexが変更されたときに自動スクロール
  $effect(() => {
    const currentIndex = getCurrentIndex();
    const currentPos = ids.indexOf(currentIndex);

    if (currentPos !== -1 && containerRef) {
      const currentItem = containerRef.children[currentPos] as HTMLElement;
      currentItem?.scrollIntoView({
        behavior: "smooth",
        block: "nearest", // 必要最小限のスクロール
      });
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
    const cur = getCurrentIndex();
    const pos = ids.indexOf(cur);
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
    if (newId !== undefined && newId !== cur) {
      jumpToKifu(newId);
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

<div class="kifu-history" role="listbox" bind:this={containerRef}>
  {#each ids as id}
    {@const node = getNode(id)}
    <div
      class="kifu-history-item"
      class:current={id === getCurrentIndex()}
      role="button"
      tabindex="-1"
      aria-current={id === getCurrentIndex() ? "true" : undefined}
      onclick={() => jumpToKifu(id)}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          jumpToKifu(id);
        }
      }}
    >
      <div class="kifu-history-item-display">
        {node.display}
      </div>
      {#if id != 0}
        <div
          class="kifu-history-item-favorite"
          class:favorite={node.isFavorite}
          role="button"
          tabindex="-1"
          onclick={id === getCurrentIndex()
            ? () => toggleFavorite(id)
            : undefined}
          onkeydown={id === getCurrentIndex()
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  toggleFavorite(id);
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

<style>
  .kifu-history {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    height: 400px;
    overflow-y: auto;
    display: grid;
    gap: 2px;
    --item-height: 24px;
    scroll-behavior: smooth;
    align-content: start;
  }

  .kifu-history-item {
    height: var(--item-height);
    padding: 4px 8px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
  }
  .kifu-history-item:focus {
    outline: none;
  }
  .kifu-history-item.current {
    background-color: #e8f4ff; /* 淡い青 */
    border-radius: 4px;
  }
  .kifu-history-item-display {
    width: 70%;
    text-align: left;
  }
  .kifu-history-item-favorite {
    display: flex;
    width: 16%;
    color: #eee;
    padding: 0;
  }
  .kifu-history-item-favorite:focus {
    outline: none;
  }
  .kifu-history-item.current .kifu-history-item-favorite-content:hover {
    transform: scale(1.3);
  }

  .kifu-history-item.current .kifu-history-item-favorite {
    color: #ddd;
  }

  .kifu-history-item-favorite.favorite {
    color: rgb(243, 220, 74);
  }

  .kifu-history-item.current .kifu-history-item-favorite.favorite {
    color: rgb(244, 212, 5);
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
  }
</style>
