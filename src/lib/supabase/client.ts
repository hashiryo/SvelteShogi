import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// 開発環境の判定
const isDevelopment = import.meta.env.DEV;

// 環境に応じてSupabaseの設定を切り替え
const getSupabaseConfig = () => {
  if (isDevelopment) {
    // ローカル開発環境の場合
    const localUrl = import.meta.env.VITE_SUPABASE_LOCAL_URL;
    const localKey = import.meta.env.VITE_SUPABASE_LOCAL_ANON_KEY;

    // ローカル設定がある場合はローカルを使用
    if (localUrl && localKey) {
      return { url: localUrl, key: localKey, env: "local" };
    }
  }

  // 本番環境またはローカル設定がない場合
  const prodUrl = import.meta.env.VITE_SUPABASE_URL;
  const prodKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return { url: prodUrl, key: prodKey, env: "production" };
};

const config = getSupabaseConfig();

if (!config.url || !config.key) {
  const errorMessage =
    `Supabase環境変数が設定されていません。.env.localファイルを確認してください。\n` +
    `現在の環境: ${config.env}\n` +
    `必要な変数: VITE_SUPABASE_${
      config.env === "local" ? "LOCAL_" : ""
    }URL, VITE_SUPABASE_${config.env === "local" ? "LOCAL_" : ""}ANON_KEY`;

  console.error(errorMessage);
  throw new Error(errorMessage);
}

export const supabase = createClient<Database>(config.url, config.key);
