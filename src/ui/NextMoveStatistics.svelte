<script lang="ts">
  import { getDisplayMoveFromMoveStr } from "@/domain/display";
  import { LastPosStore } from "@/store/play-game.svelte";
  import { GridStore, IsSenteTurnStore } from "@/store/game-board.svelte";
  import { executeMove } from "@/handler/execute-move";
  import { CurrentIndexStore, NodesStore } from "@/store/kifu-node.svelte";
  import { getCurrentStatistics } from "@/handler/move-statistics";

  let isSente = $derived(IsSenteTurnStore.get());

  let moveStatistics = $derived.by(() => {
    const { sfenx } = NodesStore.getNode(CurrentIndexStore.get());
    return getCurrentStatistics(isSente, sfenx);
  });

  // 表示件数
  let moveCount = $derived(moveStatistics.length);
</script>

<div class="next-move-statistics">
  <div class="card-header">
    次の一手統計
    {#if moveCount > 0}
      <span class="count-badge">({moveCount}件)</span>
    {/if}
  </div>
  <div
    class="next-move-statistics-list"
    role="listbox"
    aria-label="次の一手統計"
  >
    {#if moveCount > 0}
      {@const grid = GridStore.get()}
      {@const lastPos = LastPosStore.get()}
      {#each moveStatistics as dat}
        {@const display = getDisplayMoveFromMoveStr(
          grid,
          dat.move,
          isSente,
          lastPos
        )}
        <div
          class="next-move-statistics-item"
          role="button"
          tabindex="-1"
          onclick={() => {
            executeMove(display, dat.move);
          }}
          onkeydown={(e) => {
            if (e.key === "Enter") {
              executeMove(display, dat.move);
            }
          }}
        >
          <div class="next-move-statistics-item-display">
            {display}
          </div>
        </div>
      {/each}
    {:else}
      <!-- 空状態表示 -->
      <div class="next-move-statistics-empty" aria-live="polite">
        この局面に次の一手は登録されていません
      </div>
    {/if}
  </div>
</div>

<style>
  .next-move-statistics {
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .next-move-statistics-list {
    padding: 0px 8px 0 8px;
    height: 100px;
    overflow-y: auto;
    display: grid;
    gap: 2px;
    --item-height: 24px;
    scroll-behavior: smooth;
    align-content: start;
  }

  .next-move-statistics-item {
    height: var(--item-height);
    padding: 4px 8px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
  }

  .next-move-statistics-item-display {
    width: 92%;
    text-align: left;
  }

  .next-move-statistics-empty {
    padding: 8px;
    text-align: center;
    color: #666;
    font-size: 12px;
    height: var(--item-height);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
