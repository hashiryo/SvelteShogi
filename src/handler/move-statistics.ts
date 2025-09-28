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
        apparentRate: (apparents / total) * 100,
        winRate: (wins / apparents) * 100,
      })
    );
    MoveStatisticsStore.set(sfenx, data);
  }
}
