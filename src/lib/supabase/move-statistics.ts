import type { MoveStatisticsInsertParams } from "@/types/shogi";
import { supabase } from "./client";
import type { Database } from "./types";

type MoveStatisticsRow =
  Database["public"]["Tables"]["shogi_moves_statistics"]["Row"];
type MoveStatisticsInsert =
  Database["public"]["Tables"]["shogi_moves_statistics"]["Insert"];

const TABLE = "shogi_moves_statistics";

export class MoveStatisticsRepository {
  /**
   * 指定された局面と手の統計情報を取得
   * @param sfenx 対象局面のSFENX表記（必須）
   * @param move 特定の手の表記（オプション、指定時はその手のみ取得）
   * @param userId ユーザーID（オプション、未指定時は匿名データのみ取得）
   * @returns 統計情報レコードの配列
   * @throws データベースエラーが発生した場合
   */
  static async fetch(
    sfenx: string,
    userId?: string
  ): Promise<MoveStatisticsRow[]> {
    let query = supabase.from(TABLE).select("*").eq("sfenx", sfenx);

    // user_idがnullの場合は is で比較、値がある場合は eq で比較
    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      query = query.is("user_id", null);
    }

    const { data, error } = await query;

    if (error) {
      console.error("統計情報の取得に失敗しました:", error);
      throw error;
    }

    return data || [];
  }

  /**
   * 複数の局面と手の統計情報を取得
   * @param sfenxes 対象局面のSFENX表記の配列（必須）
   * @param userId ユーザーID（オプション、未指定時は匿名データのみ取得）
   * @returns 統計情報レコードの配列
   * @throws データベースエラーが発生した場合
   */
  static async fetchMulti(
    sfenxes: string[],
    userId?: string
  ): Promise<MoveStatisticsRow[][]> {
    let query = supabase.from(TABLE).select("*").in("sfenx", sfenxes);

    // user_idがnullの場合は is で比較、値がある場合は eq で比較
    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      query = query.is("user_id", null);
    }

    const { data, error } = await query;

    if (error) {
      console.error("統計情報の取得に失敗しました:", error);
      throw error;
    }

    return (
      data?.reduce<MoveStatisticsRow[][]>(
        (acc, cur) => {
          const index = sfenxes.indexOf(cur.sfenx);
          if (index !== -1) {
            acc[index].push(cur);
          }
          return acc;
        },
        sfenxes.map(() => [])
      ) || []
    );
  }

  /**
   * 複数の統計情報レコードを一括挿入
   * @param paramsArray 挿入パラメータの配列
   * @throws データベースエラーが発生した場合
   */
  static async bulkInsert(
    paramsArray: MoveStatisticsInsertParams[],
    userId?: string
  ): Promise<void> {
    const insertDataArray: MoveStatisticsInsert[] = paramsArray.map(
      (params) => ({
        sfenx: params.sfenx,
        move: params.move,
        win: params.win,
        lose: params.lose,
        timeout: params.timeout,
        user_id: userId || null,
      })
    );

    const { error } = await supabase.from(TABLE).insert(insertDataArray);

    if (error) {
      console.error("統計情報の一括挿入に失敗しました:", error);
      throw error;
    }
  }
}
