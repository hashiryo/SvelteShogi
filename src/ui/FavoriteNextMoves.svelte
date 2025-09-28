<script lang="ts">
  import { getDisplayMoveFromMoveStr } from "@/domain/display";
  import { LastPosStore } from "@/store/play-game.svelte";
  import { getGrid, getIsSenteTurn } from "@/store/game-board.svelte";
  import { executeMove } from "@/handler/execute-move";
  import { getCurFavorite } from "@/handler/favorite-moves";
  import { getCurrentIndex, getNode } from "@/store/kifu-node.svelte";

  let isSente = $derived(getIsSenteTurn());

  let favoriteMoves = $derived.by(() => {
    const { sfenx } = getNode(getCurrentIndex());
    return getCurFavorite(isSente, sfenx);
  });

  // 表示件数
  let moveCount = $derived(favoriteMoves.length);
</script>

<div class="favorite-next-moves">
  <div class="card-header">
    お気に入りの次の一手
    {#if moveCount > 0}
      <span class="count-badge">({moveCount}件)</span>
    {/if}
  </div>
  <div
    class="favorite-next-moves-list"
    role="listbox"
    aria-label="お気に入りの次の一手"
  >
    {#if moveCount > 0}
      {@const grid = getGrid()}
      {@const lastPos = LastPosStore.get()}
      {#each favoriteMoves as move}
        {@const display = getDisplayMoveFromMoveStr(
          grid,
          move,
          isSente,
          lastPos
        )}
        <div
          class="favorite-next-moves-item"
          role="button"
          tabindex="-1"
          onclick={() => {
            executeMove(display, move);
          }}
          onkeydown={(e) => {
            if (e.key === "Enter") {
              executeMove(display, move);
            }
          }}
        >
          <div class="favorite-next-moves-item-favorite">
            <div class="favorite-next-moves-item-favorite-content">★</div>
          </div>
          <div class="favorite-next-moves-item-display">
            {display}
          </div>
        </div>
      {/each}
    {:else}
      <!-- 空状態表示 -->
      <div class="favorite-next-moves-empty" aria-live="polite">
        この局面にお気に入りの手は登録されていません
      </div>
    {/if}
  </div>
</div>

<style>
  .favorite-next-moves {
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .favorite-next-moves-list {
    padding: 0px 8px 0 8px;
    height: 100px;
    overflow-y: auto;
    display: grid;
    gap: 2px;
    --item-height: 24px;
    scroll-behavior: smooth;
    align-content: start;
  }

  .favorite-next-moves-item {
    height: var(--item-height);
    padding: 4px 8px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
  }

  .favorite-next-moves-item-display {
    width: 92%;
    text-align: left;
  }

  .favorite-next-moves-item-favorite {
    width: 8%;
    color: rgb(243, 220, 74);
  }

  .favorite-next-moves-empty {
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
