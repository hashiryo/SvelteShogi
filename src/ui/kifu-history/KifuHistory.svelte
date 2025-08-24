<script lang="ts">
  import type { HistoryNode } from "@/types/shogi";
  import { getNode, initHistory } from "@/store/kifu-history.svelte";

  import { getGrid, getCaptured } from "@/store/game-board.svelte";
  import {shogiPositionToSfenx } from "@/domain/sfenx"
  import { get } from "svelte/store";

  initHistory({
    display: "初期局面",
    sfenx: shogiPositionToSfenx(getGrid(), getCaptured(true), getCaptured(false)),
    prev: -1,
    next: -1,
    br_next: 0,
    br_prev: 0,
    isSente: true,
    move: "",
    isFavorite: false
  })

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

  function clickHandler(node: HistoryNode) {
    console.log(node);
  }
</script>

<div class="kifu-history">
  {#each ids as id, index}
  {@const node = getNode(id)}
    <div class="kifu-history-item"
         class:even={index % 2 === 1}
         role="button"
         tabindex="0"
         onclick={() => clickHandler(node)}
           onkeydown={(e) => {
             if (e.key === 'Enter' || e.key === ' ') {
              clickHandler(node);
             }
           }}>{node.display}</div>
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
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  --item-height: 24px;
  align-content: start;
}

.kifu-history-item {
  height: var(--item-height);
  padding: 4px 8px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
}

.kifu-history-item.even {
  margin-top: calc(var(--item-height) / 2);
}

</style>