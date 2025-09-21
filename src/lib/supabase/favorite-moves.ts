import { supabase } from "./client";
import type { Database } from "./types";

type FavoriteMoveRow =
  Database["public"]["Tables"]["favorite_shogi_moves"]["Row"];
type FavoriteMoveInsert =
  Database["public"]["Tables"]["favorite_shogi_moves"]["Insert"];

// Result型パターンでエラーハンドリングを実装
type Result<T, E = Error> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: E;
    };

const TABLE = "favorite_shogi_moves";

/**
 * 指定されたSFENXに対するお気に入りの手を取得
 * @param sfenx 局面のSFENX表記
 * @param userId ユーザーID（オプション）
 * @returns お気に入りの手のリスト
 */
export async function fetchFavoriteMoves(
  sfenx: string,
  userId?: string
): Promise<Result<string[]>> {
  try {
    let query = supabase.from(TABLE).select("move").eq("sfenx", sfenx);

    // user_idがnullの場合は is で比較、値がある場合は eq で比較
    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      query = query.is("user_id", null);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("お気に入りの取得に失敗しました:", error);
      return { success: false, error };
    }

    return {
      success: true,
      data: data.map((item) => item.move),
    };
  } catch (error) {
    console.error("予期しないエラーが発生しました:", error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * お気に入りの手を追加
 * @param sfenx 局面のSFENX表記
 * @param move 手の表記
 * @param userId ユーザーID（オプション）
 * @returns 追加結果
 */
export async function addFavoriteMove(
  sfenx: string,
  move: string,
  userId?: string
): Promise<Result<FavoriteMoveRow>> {
  try {
    const insertData: FavoriteMoveInsert = {
      sfenx,
      move,
      user_id: userId || null,
    };

    const { data, error } = await supabase
      .from(TABLE)
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("お気に入りの追加に失敗しました:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("予期しないエラーが発生しました:", error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * お気に入りの手を削除
 * @param sfenx 局面のSFENX表記
 * @param move 手の表記
 * @param userId ユーザーID（オプション）
 * @returns 削除結果
 */
export async function removeFavoriteMove(
  sfenx: string,
  move: string,
  userId?: string
): Promise<Result<void>> {
  try {
    let query = supabase
      .from(TABLE)
      .delete()
      .eq("sfenx", sfenx)
      .eq("move", move);

    // user_idがnullの場合は is で比較、値がある場合は eq で比較
    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      query = query.is("user_id", null);
    }

    const { error } = await query;

    if (error) {
      console.error("お気に入りの削除に失敗しました:", error);
      return { success: false, error };
    }

    return { success: true, data: undefined };
  } catch (error) {
    console.error("予期しないエラーが発生しました:", error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
