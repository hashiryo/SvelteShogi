import { supabase } from "./client";
import type { Database } from "./types";

type FavoriteMoveInsert =
  Database["public"]["Tables"]["favorite_shogi_moves"]["Insert"];

const TABLE = "favorite_shogi_moves";

/**
 * 指定されたSFENXに対するお気に入りの手を取得
 * @param sfenx 局面のSFENX表記
 * @param userId ユーザーID（オプション）
 * @returns お気に入りの手のリスト
 * @throws データベースエラーが発生した場合
 */
export async function fetchFavoriteMoves(
  sfenx: string,
  userId?: string
): Promise<string[]> {
  let query = supabase.from(TABLE).select("move").eq("sfenx", sfenx);

  // user_idがnullの場合は is で比較、値がある場合は eq で比較
  if (userId) {
    query = query.eq("user_id", userId);
  } else {
    query = query.is("user_id", null);
  }

  const { data, error } = await query;

  if (error) {
    console.error("お気に入りの取得に失敗しました:", error);
    throw error;
  }

  return data.map((item) => item.move);
}

/**
 * お気に入りの手を追加
 * @param sfenx 局面のSFENX表記
 * @param move 手の表記
 * @param userId ユーザーID（オプション）
 * @throws データベースエラーが発生した場合
 */
export async function addFavoriteMove(
  sfenx: string,
  move: string,
  userId?: string
): Promise<void> {
  const insertData: FavoriteMoveInsert = {
    sfenx,
    move,
    user_id: userId || null,
  };

  const { error } = await supabase.from(TABLE).insert(insertData);

  if (error) {
    console.error("お気に入りの追加に失敗しました:", error);
    throw error;
  }
}

/**
 * お気に入りの手を削除
 * @param sfenx 局面のSFENX表記
 * @param move 手の表記
 * @param userId ユーザーID（オプション）
 * @throws データベースエラーが発生した場合
 */
export async function removeFavoriteMove(
  sfenx: string,
  move: string,
  userId?: string
): Promise<void> {
  let query = supabase.from(TABLE).delete().eq("sfenx", sfenx).eq("move", move);

  // user_idがnullの場合は is で比較、値がある場合は eq で比較
  if (userId) {
    query = query.eq("user_id", userId);
  } else {
    query = query.is("user_id", null);
  }

  const { error } = await query;

  if (error) {
    console.error("お気に入りの削除に失敗しました:", error);
    throw error;
  }
}
