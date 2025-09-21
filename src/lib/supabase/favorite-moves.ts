import { supabase } from "./client";

const TABLE = "favorite_shogi_moves";

export async function fetchFavoriteMoves(sfenx: string, userId?: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("move")
    .eq("sfenx", sfenx)
    .eq("user_id", userId || null);

  if (error) {
    console.error("お気に入りの取得に失敗しました:", error);
    throw error;
  }

  return data.map((item) => item.move);
}
