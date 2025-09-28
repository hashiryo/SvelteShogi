import type { MoveStatistics } from "@/types/shogi";

// レコード追加時のパラメータ型
export interface AddRecordParams {
  sfenx: string;
  move: string;
  result: "win" | "lose" | "timeout";
  userId?: string;
}

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
