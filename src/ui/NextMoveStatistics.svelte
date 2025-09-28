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
      0
    );
    const averageWinRate =
      moveStatistics.length > 0
        ? moveStatistics.reduce((sum, stat) => sum + stat.winRate, 0) /
          moveStatistics.length
        : 0;

    return {
      totalApparent,
      averageWinRate,
    };
  });
</script>

<div class="next-move-statistics">
  <div class="card-header">
    <div class="header-title">
      次の一手統計
      {#if moveCount > 0}
        <span class="count-badge">({moveCount}件)</span>
      {/if}
    </div>
    {#if statisticsSummary}
      <div class="statistics-summary">
        <span class="summary-item"
          >総出現: {statisticsSummary.totalApparent}回</span
        >
        <span class="summary-item"
          >平均勝率: {(statisticsSummary.averageWinRate * 100).toFixed(
            1
          )}%</span
        >
      </div>
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
          <div class="move-display">
            {display}
          </div>
          <div class="statistics-info">
            <div class="stat-row">
              <span class="stat-label">出現:</span>
              <span class="stat-value"
                >{dat.apparentCount}回 ({(dat.apparentRate * 100).toFixed(
                  1
                )}%)</span
              >
            </div>
            <div class="stat-row">
              <span class="stat-label">勝率:</span>
              <span
                class="stat-value win-rate"
                class:high-win-rate={dat.winRate >= 0.6}
                class:low-win-rate={dat.winRate < 0.4}
              >
                {dat.winCount}/{dat.apparentCount} ({(
                  dat.winRate * 100
                ).toFixed(1)}%)
              </span>
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
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .card-header {
    padding: 8px 12px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
    border-radius: 4px 4px 0 0;
  }

  .header-title {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .count-badge {
    font-size: 12px;
    color: #666;
    font-weight: normal;
  }

  .statistics-summary {
    display: flex;
    gap: 12px;
    font-size: 11px;
    color: #666;
  }

  .summary-item {
    display: flex;
    align-items: center;
  }

  .next-move-statistics-list {
    padding: 0px 8px 0 8px;
    height: 200px;
    overflow-y: auto;
    display: grid;
    gap: 4px;
    --item-height: 60px;
    scroll-behavior: smooth;
    align-content: start;
  }

  .next-move-statistics-item {
    height: var(--item-height);
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background-color: #fafafa;
    transition: background-color 0.2s ease;
  }

  .next-move-statistics-item:hover {
    background-color: #f0f0f0;
  }

  .move-display {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 4px;
    color: #333;
  }

  .statistics-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
  }

  .stat-label {
    color: #666;
    font-weight: 500;
  }

  .stat-value {
    color: #333;
    font-weight: 600;
  }

  .win-rate.high-win-rate {
    color: #2e7d32; /* 緑色 - 高勝率 */
  }

  .win-rate.low-win-rate {
    color: #d32f2f; /* 赤色 - 低勝率 */
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
