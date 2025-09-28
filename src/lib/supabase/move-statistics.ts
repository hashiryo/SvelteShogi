import { supabase } from "./client";
import type { Database } from "./types";

type MoveStatisticsRow =
  Database["public"]["Tables"]["shogi_moves_statistics"]["Row"];
type MoveStatisticsInsert =
  Database["public"]["Tables"]["shogi_moves_statistics"]["Insert"];

interface MoveStatisticsInsertParams {
  sfenx: string;
  move: string;
  win: boolean;
  lose: boolean;
  timeout: boolean;
  userId?: string;
}

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
    move?: string,
    userId?: string
  ): Promise<MoveStatisticsRow[]> {
    let query = supabase.from(TABLE).select("*").eq("sfenx", sfenx);

    // moveが指定された場合は該当する手のみ
    if (move) {
      query = query.eq("move", move);
    }

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
   * 新しい統計情報レコードを挿入
   * @param params 挿入パラメータ
   * @throws データベースエラーが発生した場合
   */
  static async insert(params: MoveStatisticsInsertParams): Promise<void> {
    const insertData: MoveStatisticsInsert = {
      sfenx: params.sfenx,
      move: params.move,
      win: params.win,
      lose: params.lose,
      timeout: params.timeout,
      user_id: params.userId || null,
    };

    const { error } = await supabase.from(TABLE).insert(insertData);

    if (error) {
      console.error("統計情報の挿入に失敗しました:", error);
      throw error;
    }
  }

  /**
   * 指定条件の統計情報レコードを削除
   * @param sfenx 対象局面のSFENX表記（必須）
   * @param move 特定の手の表記（オプション、指定時はその手のみ削除）
   * @param userId ユーザーID（オプション、権限制御に使用）
   * @throws データベースエラーが発生した場合
   */
  static async delete(
    sfenx: string,
    move?: string,
    userId?: string
  ): Promise<void> {
    let query = supabase.from(TABLE).delete().eq("sfenx", sfenx);

    // moveが指定された場合は該当する手のみ削除
    if (move) {
      query = query.eq("move", move);
    }

    // user_idがnullの場合は is で比較、値がある場合は eq で比較
    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      query = query.is("user_id", null);
    }

    const { error } = await query;

    if (error) {
      console.error("統計情報の削除に失敗しました:", error);
      throw error;
    }
  }
}