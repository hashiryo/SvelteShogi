import { flipMove, flipSfenx } from "@/domain/sfenx";
import { MoveStatisticsRepository } from "@/lib/supabase/move-statistics";
import { NodesStore } from "@/store/kifu-node.svelte";
import { MoveStatisticsStore } from "@/store/move-statistics.svelte";
import type { MoveStatistics } from "@/types/shogi";

export function getCurrentStatistics(
  isSente: boolean,
  sfenx: string
): MoveStatistics[] {
  const stats = isSente
    ? MoveStatisticsStore.get(sfenx) || []
    : (MoveStatisticsStore.get(flipSfenx(sfenx)) || []).map((dat) => {
        return {
          ...dat,
          move: flipMove(dat.move),
        };
      });
  // 出現率の高い順にソート（同率の場合は勝率の多い順）
  return [...stats].sort((a, b) => {
    return b.apparentCount === a.apparentCount
      ? b.winRate - a.winRate
      : b.apparentCount - a.apparentCount;
  });
}

export async function fetchAndSetMoveStatistics(
  isSente: boolean,
  sfenx: string
) {
  if (!isSente) {
    sfenx = flipSfenx(sfenx);
  }
  // ToDo: user?.id を使うようにする
  if (!MoveStatisticsStore.get(sfenx)) {
    const records = await MoveStatisticsRepository.fetch(sfenx);
    const total = records.length;
    const moveStats = new Map<string, { apparents: number; wins: number }>();
    for (const record of records) {
      const move = record.move;
      const existing = moveStats.get(move) || { apparents: 0, wins: 0 };
      moveStats.set(move, {
        apparents: existing.apparents + 1,
        wins: existing.wins + (record.win ? 1 : 0),
      });
    }
    const data: MoveStatistics[] = Array.from(moveStats.entries()).map(
      ([move, { apparents, wins }]) => ({
        move,
        apparentCount: apparents,
        winCount: wins,
        apparentRate: apparents / total,
        winRate: wins / apparents,
      })
    );
    MoveStatisticsStore.set(sfenx, data);
  }
}

export function executeSave(nodeIndex: number) {
  const currentNode = NodesStore.getNode(nodeIndex);
  if (currentNode.isSaved) return;
  if (currentNode.move !== "resign") {
    console.warn("セーブ機能は投了状態のみで使用できます");
    return;
  }

  console.log(`投了ノード（インデックス: ${nodeIndex}）を保存しました`);
  console.log(`ノード情報:`, {
    display: currentNode.display,
    move: currentNode.move,
    isSente: currentNode.isSente,
    sfenx: currentNode.sfenx,
  });

  // isSavedフラグを更新
  NodesStore.setSaved(nodeIndex, true);
}
