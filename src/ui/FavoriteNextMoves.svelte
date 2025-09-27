<script lang="ts">
  import { getFavoriteMoves } from "@/store/favorite-moves.svelte";
  import { getNode, getCurrentIndex } from "@/store/kifu-node.svelte";
  import { getDisplayMoveFromMoveStr } from "@/domain/display";
  import { flipMove, flipSfenx } from "@/domain/sfenx";
  import { getLastPos } from "@/store/play-game.svelte";
  import { getGrid, getIsSenteTurn } from "@/store/game-board.svelte";

  let isSente = $derived(getIsSenteTurn());

  // リアクティブな現在インデックスの監視
  let currentIndex = $derived(getCurrentIndex());

  // お気に入りの手の取得
  let favoriteMoves = $derived.by(() => {
    const currentNode = getNode(currentIndex);
    if (isSente) {
      return getFavoriteMoves(currentNode.sfenx) || [];
    } else {
      return (getFavoriteMoves(flipSfenx(currentNode.sfenx)) || []).map(
        flipMove
      );
    }
  });

  // 表示用の手データ変換
  let displayMoves = $derived.by((): string[] => {
    if (favoriteMoves.length === 0) return [];

    // 現在局面の盤面情報を取得
    const grid = getGrid();
    const lastPos = getLastPos();

    return favoriteMoves.map((move: string): string =>
      getDisplayMoveFromMoveStr(grid, move, isSente, lastPos)
    );
  });

  // 表示件数
  let displayCount = $derived(displayMoves.length);
</script>

<div class="favorite-next-moves">
  <div class="card-header">
    お気に入りの次の一手
    {#if displayCount > 0}
      <span class="count-badge">({displayCount}件)</span>
    {/if}
  </div>
  <div
    class="favorite-next-moves-list"
    role="listbox"
    aria-label="お気に入りの次の一手"
  >
    {#if displayCount > 0}
      {#each displayMoves as moveData}
        <div class="favorite-next-moves-item" role="listitem">
          <div class="favorite-next-moves-item-favorite">
            <div class="favorite-next-moves-item-favorite-content">★</div>
          </div>
          <div class="favorite-next-moves-item-display">
            {moveData}
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

  .count-badge {
    background-color: #2196f3;
    color: white;
    font-size: 10px;
    padding: 1px 4px;
    border-radius: 8px;
    font-weight: 500;
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
