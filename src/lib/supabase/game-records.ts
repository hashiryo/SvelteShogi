import type {
  GameRecordsInsertParams,
  KifMetadata,
  KifuNode,
} from "@/types/shogi";
import { supabase } from "./client";
import type { Database } from "./types";

type GameRecordsRow = Database["public"]["Tables"]["game_records"]["Row"];
type GameRecordsInsert = Database["public"]["Tables"]["game_records"]["Insert"];
const TABLE = "game_records";

/**
 * ゲーム記録に関するリポジトリ
 */
export class GameRecordsRepository {
  /**
   * ゲーム記録を挿入
   */
  static async insert(
    gameHash: string,
    moveCount: number,
    metadata: KifMetadata,
    recordedAt?: string,
    userId?: string
  ): Promise<void> {
    const insertData: GameRecordsInsert = {
      game_hash: gameHash,
      start_time: metadata.startTime,
      end_time: metadata.endTime,
      black_player: metadata.blackPlayer,
      white_player: metadata.whitePlayer,
      event: metadata.event,
      handicap: metadata.handicap,
      result: metadata.result,
      move_count: moveCount,
      recorded_at: recordedAt || new Date().toISOString(),
      user_id: userId || null, // 認証されていない場合はnullで匿名データとして保存
    };

    const { error } = await supabase.from(TABLE).insert(insertData);

    if (error) {
      console.error("ゲーム記録の挿入に失敗しました:", error);
      throw error;
    }
  }

  /**
   * ゲームハッシュで既存記録を検索
   */
  static async getByGameHash(
    gameHash: string,
    userId?: string
  ): Promise<GameRecordsRow | null> {
    let query = supabase.from(TABLE).select("*").eq("game_hash", gameHash);

    // ユーザーIDがある場合はユーザー固有のデータを取得
    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      // 匿名ユーザーの場合は匿名データ（user_id が null）を取得
      query = query.is("user_id", null);
    }

    const { data, error } = await query.single();

    if (error && error.code !== "PGRST116") {
      // PGRST116は「見つからない」エラーなので無視
      console.error("ゲーム記録の取得に失敗しました:", error);
      throw error;
    }

    return data;
  }

  /**
   * 日時情報で既存記録を検索（確実な重複検知）
   */
  static async getByDateTime(
    startTime?: string,
    endTime?: string,
    userId?: string
  ): Promise<GameRecordsRow[]> {
    if (!startTime && !endTime) {
      return [];
    }

    let query = supabase.from(TABLE).select("*");

    if (startTime) {
      query = query.eq("start_time", startTime);
    }
    if (endTime) {
      query = query.eq("end_time", endTime);
    }

    // ユーザーIDがある場合はユーザー固有のデータを取得
    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      // 匿名ユーザーの場合は匿名データ（user_id が null）を取得
      query = query.is("user_id", null);
    }

    const { data, error } = await query;

    if (error) {
      console.error("日時による ゲーム記録の取得に失敗しました:", error);
      throw error;
    }

    if (!data) return [];

    return data;
  }

  /**
   *
   */
  static async getByGameHashWithDay(
    gameHash: string,
    day: number,
    userId?: string
  ): Promise<GameRecordsRow[]> {
    // 1日前の日時を計算
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - day);

    let query = supabase
      .from(TABLE)
      .select("*")
      .eq("game_hash", gameHash)
      .gte("recorded_at", dayAgo.toISOString());

    // ユーザーIDがある場合はユーザー固有のデータを取得
    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      // 匿名ユーザーの場合は匿名データ（user_id が null）を取得
      query = query.is("user_id", null);
    }

    const { data, error } = await query.order("recorded_at", {
      ascending: false,
    });

    if (error) {
      console.error("最近のゲーム記録の取得に失敗しました:", error);
      throw error;
    }

    if (!data) return [];

    // 型安全な変換
    return data;
  }
}
