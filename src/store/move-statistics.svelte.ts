import type { MoveStatistics } from "@/types/shogi";

// 局面別の統計データを保持するリアクティブ状態
let data: {
  [key: string]: MoveStatistics[] | undefined;
} = $state({});

export class MoveStatisticsStore {
  static get(sfenx: string): MoveStatistics[] | undefined {
    return data[sfenx];
  }
  static set(sfenx: string, statistics: MoveStatistics[]): void {
    data[sfenx] = statistics;
  }
}
