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

  // 統計サマリー
  let statisticsSummary = $derived.by(() => {
    if (moveStatistics.length === 0) return null;

    const totalApparent = moveStatistics.reduce(
      (sum, stat) => sum + stat.apparentCount,
      0,
    );

    return {
      totalApparent,
    };
  });
</script>

<div class="next-move-statistics">
  <div class="card-header">
    次の一手統計
    {#if moveCount > 0}
      <span class="count-badge">({moveCount}件)</span>
      {#if statisticsSummary}
        <span class="summary-info">総{statisticsSummary.totalApparent}回</span>
      {/if}
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
          lastPos,
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
          <div class="next-move-statistics-item-stats">
            <div class="stat-main">
              出現率: {dat.apparentCount}回 ({(dat.apparentRate * 100).toFixed(
                1,
              )}%)
            </div>
            <div
              class="stat-sub"
              class:high-win-rate={dat.winRate >= 0.6}
              class:low-win-rate={dat.winRate < 0.4}
            >
              勝率: {dat.winCount}/{dat.apparentCount} ({(
                dat.winRate * 100
              ).toFixed(1)}%)
            </div>
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
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }

  .summary-info {
    color: var(--text-color);
    opacity: 0.6;
    font-size: 10px;
    margin-left: auto;
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
    color: var(--text-color);
  }

  .next-move-statistics-item-display {
    width: 60%;
    text-align: left;
  }

  .next-move-statistics-item-stats {
    width: 40%;
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.1;
  }

  .stat-main {
    font-size: 11px;
    color: var(--text-color);
    opacity: 0.8;
    margin-bottom: 1px;
  }

  @media (max-width: 500px) {
    .next-move-statistics-list {
      height: 80px;
      padding: 0px 4px;
    }

    .stat-main {
      font-size: 10px;
    }
  }

  .stat-sub {
    font-size: 10px;
    color: var(--text-color);
    opacity: 0.6;
  }

  .stat-sub.high-win-rate {
    color: var(--success-color);
    opacity: 1;
  }

  .stat-sub.low-win-rate {
    color: var(--error-color);
    opacity: 1;
  }

  .next-move-statistics-empty {
    padding: 8px;
    text-align: center;
    color: var(--text-color);
    opacity: 0.7;
    font-size: 12px;
    height: var(--item-height);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
