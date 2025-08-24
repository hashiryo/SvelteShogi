<script lang="ts">
  import { getCurrentIndex, getNode, initHistory } from "@/store/kifu-history.svelte";

  initHistory({
    display: "初期局面",
    sfenx: "sfenx",
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
    <div class="kifu-history-item" class:even={index % 2 === 1}>{node.display}</div>
  {/each}
</div>


<style>
.kifu-history {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  max-height: 400px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.kifu-history-item {
  padding: 4px 8px;
  border-bottom: 1px solid #eee;
  min-height: 24px;
  display: flex;
  align-items: center;
}

</style>