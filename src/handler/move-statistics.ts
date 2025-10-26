import { flipMove, flipSfenx } from "@/domain/sfenx";
import { MoveStatisticsRepository } from "@/lib/supabase/move-statistics";
import { GameRecordsRepository } from "@/lib/supabase/game-records";
import { NodesStore } from "@/store/kifu-node.svelte";
import { MoveStatisticsStore } from "@/store/move-statistics.svelte";
import { MetadataStore } from "@/store/metadata.svelte";
import { generateGameHash } from "@/domain/game-records";
import { checkGameDuplicate } from "@/handler/duplicate-check";
import type { MoveStatistics, MoveStatisticsInsertParams } from "@/types/shogi";

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

// とりあえず先手スタート前提
export async function fetchAndSetMoveStatisticsMulti(sfenxes: string[]) {
  sfenxes = sfenxes.map((sfenx, idx) =>
    idx % 2 === 0 ? sfenx : flipSfenx(sfenx)
  );
  // ToDo: user?.id を使うようにする
  const result = await MoveStatisticsRepository.fetchMulti(sfenxes);
  for (let i = 0; i < sfenxes.length; ++i) {
    if (!MoveStatisticsStore.get(sfenxes[i])) {
      const total = result[i].length;
      const moveStats = new Map<string, { apparents: number; wins: number }>();
      for (const record of result[i]) {
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
      MoveStatisticsStore.set(sfenxes[i], data);
    }
  }
}
