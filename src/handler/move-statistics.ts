import { flipMove, flipSfenx } from "@/domain/sfenx";
import { MoveStatisticsRepository } from "@/lib/supabase/move-statistics";
import { MoveStatisticsStore } from "@/store/move-statistics.svelte";
import type { MoveStatistics } from "@/types/shogi";

export function getCurrentStatistics(isSente: boolean, sfenx: string) {
  return isSente
    ? MoveStatisticsStore.get(sfenx) || []
    : (MoveStatisticsStore.get(flipSfenx(sfenx)) || []).map((dat) => {
        return {
          ...dat,
          move: flipMove(dat.move),
        };
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
    const moveStats = new Map<string, { total: number; wins: number }>();
    for (const record of records) {
      const move = record.move;
      const existing = moveStats.get(move) || { total: 0, wins: 0 };
      moveStats.set(move, {
        total: existing.total + 1,
        wins: existing.wins + (record.win ? 1 : 0),
      });
    }
    const data: MoveStatistics[] = Array.from(moveStats.entries()).map(
      ([move, { total, wins }]) => ({
        move,
        totalCount: total,
        winCount: wins,
        apparentRate: total > 0 ? (wins / total) * 100 : 0,
        winRate: total > 0 ? (wins / total) * 100 : 0,
      })
    );
    MoveStatisticsStore.set(sfenx, data);
  }
}
