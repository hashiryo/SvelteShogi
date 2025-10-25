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

export async function executeSave(nodeIndex: number) {
  const currentNode = NodesStore.getNode(nodeIndex);

  // 入力検証
  if (!currentNode) {
    console.warn("無効なノードインデックスです");
    return;
  }

  if (currentNode.isSaved) {
    console.log("既に保存済みです");
    return;
  }

  if (currentNode.move !== "resign") {
    console.warn("セーブ機能は投了状態のみで使用できます");
    return;
  }

  try {
    // 勝者判定 (投了した側の逆が勝者)
    const winner = !currentNode.isSente;

    // 統計レコード配列を初期化
    const statisticsArray: {
      sfenx: string;
      move: string;
      win: boolean;
      lose: boolean;
      timeout: boolean;
      userId?: string;
    }[] = [];

    // 現在のノードから親ノードを遡りながら統計レコードを構築
    let current = nodeIndex;
    let node = NodesStore.getNode(current);
    while (node.prev !== -1) {
      const prevNode = NodesStore.getNode(node.prev);

      // 統計レコード生成
      const win = node.isSente === winner;
      const lose = !win;

      let sfenx = prevNode.sfenx;
      let move = node.move;

      if (node.isSente) {
        sfenx = flipSfenx(sfenx);
        move = flipMove(move);
      }

      statisticsArray.push({
        sfenx,
        move,
        win,
        lose,
        timeout: false, // 投了による終了のため false 固定
        userId: undefined, // 匿名データとして保存
      });

      // 親ノードに移動
      current = node.prev;
      node = prevNode;
    }

    // バルクインサート実行
    if (statisticsArray.length > 0) {
      await MoveStatisticsRepository.bulkInsert(statisticsArray);
      console.log(`${statisticsArray.length}件の統計レコードを保存しました`);
    }

    // isSavedフラグを更新
    NodesStore.setSaved(nodeIndex, true);
    console.log(`投了ノード（インデックス: ${nodeIndex}）を保存しました`);
  } catch (error) {
    console.error("統計データの保存に失敗しました:", error);
    throw error;
  }
}
