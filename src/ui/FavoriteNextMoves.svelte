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

<div
  class="favorite-next-moves"
  role="region"
  aria-label="お気に入りの次の一手"
>
  <!-- ヘッダーセクション -->
  <div class="header">
    <h3 class="title">お気に入りの次の一手</h3>
    {#if displayCount > 0}
      <span class="count-badge">({displayCount}件)</span>
    {/if}
  </div>

  <!-- 手の一覧表示 -->
  {#if displayCount > 0}
    <ul class="moves-list" role="list">
      {#each displayMoves as moveData}
        <li class="move-item" role="listitem">
          <span class="move-icon" aria-hidden="true">⭐</span>
          <span class="move-text">{moveData}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <!-- 空状態表示 -->
    <div class="empty-state" aria-live="polite">
      <span class="empty-icon" aria-hidden="true">📝</span>
      <p class="empty-message">この局面にお気に入りの手は登録されていません</p>
      <p class="empty-description">
        手を指した後、お気に入りボタンで登録できます
      </p>
    </div>
  {/if}
</div>

<style>
  .favorite-next-moves {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    background-color: #fafafa;
    font-family: "Hiragino Sans", "Yu Gothic UI", sans-serif;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
  }

  .title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .count-badge {
    background-color: #2196f3;
    color: white;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 12px;
    font-weight: 500;
  }

  .moves-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .move-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .move-item:hover {
    background-color: #f5f5f5;
    border-color: #2196f3;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .move-icon {
    font-size: 14px;
    color: #ff9800;
  }

  .move-text {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    font-family: "Hiragino Sans", "Yu Gothic UI", monospace;
  }

  .empty-state {
    text-align: center;
    padding: 24px 16px;
    color: #666;
  }

  .empty-icon {
    font-size: 24px;
    display: block;
    margin-bottom: 12px;
  }

  .empty-message {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 500;
    color: #666;
  }

  .empty-description {
    margin: 0;
    font-size: 12px;
    color: #999;
    line-height: 1.4;
  }

  /* レスポンシブ対応 */
  @media (max-width: 768px) {
    .favorite-next-moves {
      padding: 12px;
    }

    .title {
      font-size: 14px;
    }

    .move-text {
      font-size: 13px;
    }

    .moves-list {
      gap: 6px;
    }

    .move-item {
      padding: 6px 10px;
    }
  }

  @media (max-width: 480px) {
    .moves-list {
      max-height: 200px;
      overflow-y: auto;
    }
  }

  /* アクセシビリティ対応 */
  @media (prefers-reduced-motion: reduce) {
    .move-item {
      transition: none;
    }

    .move-item:hover {
      transform: none;
    }
  }

  /* 高コントラストテーマ対応 */
  @media (prefers-contrast: high) {
    .favorite-next-moves {
      border-color: #000;
    }

    .move-item {
      border-color: #000;
    }

    .title,
    .move-text {
      color: #000;
    }
  }
</style>
