<script lang="ts">
  import { getCurrentIndex, getNode, initHistory } from "@/store/kifu-history.svelte";
  import { getGrid, getCaptured } from "@/store/game-board.svelte";
  import  {shogiPositionToSfenx } from "@/domain/sfenx"

  import { jumpToKifu } from "@/handler/kifu-history"


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
</script>

<div class="kifu-history">
  {#each ids as id, index}
  {@const node = getNode(id)}
    <div class="kifu-history-item"
         class:even={index % 2 === 1}
         class:current={id === getCurrentIndex()}
         role="button"
         tabindex="0"
         aria-current={id === getCurrentIndex() ? 'true' : undefined}
         onclick={() => jumpToKifu(id)}
           onkeydown={(e) => {
             if (e.key === 'Enter' || e.key === ' ') {
              jumpToKifu(id);
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

.kifu-history-item.current {
  background-color: #e8f4ff; /* 淡い青 */
  border: 1px solid #a6d8ff;
  border-radius: 4px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.03);
}

</style>