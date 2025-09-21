<script lang="ts">
import { getFavoriteMoves } from '@/store/favorite-moves.svelte';
import { getNode, getCurrentIndex } from '@/store/kifu-node.svelte';
import { getDisplayMoveFromGrid, getDisplayMoveFromCaptured } from '@/domain/display';
import { getGrid } from '@/store/game-board.svelte';
import { sfenxToShogiPosition, strToPosition } from '@/domain/sfenx';
import type { KifuNode } from '@/types/shogi';

interface Props {
  className?: string;
  maxDisplay?: number;
  showEmpty?: boolean;
}

interface DisplayMove {
  original: string;
  display: string;
  index: number;
}

let { className, maxDisplay = 5, showEmpty = true }: Props = $props();

// リアクティブな現在インデックスの監視
let currentIndex = $derived(getCurrentIndex());

// 現在ノードの取得
let currentNode = $derived.by(() => {
  try {
    if (currentIndex < 0) return null;
    return getNode(currentIndex);
  } catch (error) {
    console.error('Failed to get current node:', error);
    return null;
  }
});

// 現在のsfenxの取得
let currentSfenx = $derived.by(() => {
  const node = currentNode;
  if (!node) return null;
  return node.sfenx;
});

// お気に入りの手の取得
let favoriteMoves = $derived.by(() => {
  const sfenx = currentSfenx;
  if (!sfenx) return [];
  try {
    const moves = getFavoriteMoves(sfenx);
    return moves || [];
  } catch (error) {
    console.error('Failed to get favorite moves:', error);
    return [];
  }
});

// 表示用の手データ変換
let displayMoves = $derived.by((): DisplayMove[] => {
  const sfenx = currentSfenx;
  const moves = favoriteMoves;
  if (!sfenx || moves.length === 0) return [];
  
  try {
    // 現在局面の盤面情報を取得
    const { grid, capturedSente, capturedGote } = sfenxToShogiPosition(sfenx);
    
    return moves
      .slice(0, maxDisplay)
      .map((move: string, index: number): DisplayMove => {
        try {
          let displayText = '';
          
          // 手の種類を判定（持ち駒打ちか盤上移動か）
          if (move.includes('*')) {
            // 持ち駒打ちの場合: "P*2d" -> "２四歩打"
            const match = move.match(/^([A-Z])\*(\d)([a-i])$/);
            if (match) {
              const [, pieceChar, colStr, rowStr] = match;
              const { row, col } = strToPosition(`${colStr}${rowStr}`);
              
              // 文字から駒の種類への変換マップ
              const charToPieceMap: Record<string, import('@/types/shogi').PieceType> = {
                'P': '歩', 'L': '香', 'N': '桂', 'S': '銀', 'G': '金',
                'B': '角', 'R': '飛', 'K': '玉'
              };
              
              const piece = charToPieceMap[pieceChar];
              if (piece) {
                displayText = getDisplayMoveFromCaptured(grid, row, col, piece, true);
              }
            }
          } else {
            // 盤上移動の場合: "2g2f" -> "２六歩"
            const match = move.match(/^(\d)([a-i])(\d)([a-i])(\+)?$/);
            if (match) {
              const [, fromColStr, fromRowStr, toColStr, toRowStr] = match;
              const from = strToPosition(`${fromColStr}${fromRowStr}`);
              const to = strToPosition(`${toColStr}${toRowStr}`);
              
              // 最後の手の位置情報（同○表示用）
              let lastPos: { row: number; col: number } | null = null;
              if (currentIndex > 0) {
                try {
                  const prevNode = getNode(currentIndex - 1);
                  if (prevNode && prevNode.move) {
                    const prevMatch = prevNode.move.match(/^(\d)([a-i])(\d)([a-i])(\+)?$/);
                    if (prevMatch) {
                      const [, , , prevToColStr, prevToRowStr] = prevMatch;
                      lastPos = strToPosition(`${prevToColStr}${prevToRowStr}`);
                    }
                  }
                } catch (e) {
                  // 前の手が取得できない場合はnullのまま
                }
              }
              
              displayText = getDisplayMoveFromGrid(grid, from, to, lastPos);
            }
          }
          
          return {
            original: move,
            display: displayText || move, // 変換できない場合は元の文字列
            index
          };
        } catch (error) {
          console.error(`Failed to convert move: ${move}`, error);
          return {
            original: move,
            display: move, // エラーの場合は元の文字列をそのまま表示
            index
          };
        }
      });
  } catch (error) {
    console.error('Failed to process display moves:', error);
    return [];
  }
});

// 表示件数
let displayCount = $derived.by(() => {
  const moves = displayMoves;
  return moves.length;
});

// 空状態かどうか
let isEmpty = $derived.by(() => {
  const count = displayCount;
  return count === 0;
});
</script>

<div 
  class="favorite-next-moves {className || ''}"
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
  {#if !isEmpty}
    <ul class="moves-list" role="list">
      {#each displayMoves as moveData (moveData.original)}
        <li class="move-item" role="listitem">
          <span class="move-icon" aria-hidden="true">⭐</span>
          <span class="move-text">{moveData.display}</span>
        </li>
      {/each}
    </ul>
  {:else if showEmpty}
    <!-- 空状態表示 -->
    <div class="empty-state" aria-live="polite">
      <span class="empty-icon" aria-hidden="true">📝</span>
      <p class="empty-message">この局面にお気に入りの手は登録されていません</p>
      <p class="empty-description">手を指した後、お気に入りボタンで登録できます</p>
    </div>
  {/if}
</div>

<style>
.favorite-next-moves {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
  font-family: 'Hiragino Sans', 'Yu Gothic UI', sans-serif;
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
  font-family: 'Hiragino Sans', 'Yu Gothic UI', monospace;
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