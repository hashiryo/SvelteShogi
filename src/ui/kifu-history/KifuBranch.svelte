<script lang="ts">
  import { getCurrentIndex, getNode } from "@/store/kifu-node.svelte";

  import { jumpToKifu } from "@/handler/kifu-history";

  function getIds() {
    let cur = getCurrentIndex();
    if (cur === 0) return [];
    let ret = [cur];
    cur = getNode(cur).br_next;
    while (cur !== getCurrentIndex()) {
      ret.push(cur);
      const node = getNode(cur);
      cur = node.br_next;
    }
    return ret;
  }

  let ids = $derived(getIds());
</script>

<div class="kifu-history" role="listbox">
  {#each ids as id, index}
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
      <div class="kifu-history-item-favorite">
        {#if node.isFavorite}
          <div class="kifu-history-item-favorite-content">★</div>
        {/if}
      </div>
      <div class="kifu-history-item-display">
        {node.display}
      </div>
    </div>
  {/each}
</div>

<style>
  .kifu-history {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    height: 100px;
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
    background-color: #e8fdff; /* 淡い青 */
    border-radius: 4px;
  }
  .kifu-history-item-display {
    width: 92%;
    text-align: left;
  }
  .kifu-history-item-favorite {
    width: 8%;
    color: rgb(243, 220, 74);
  }
</style>
