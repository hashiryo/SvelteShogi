import { supabase } from "@/lib/supabase/client";
import { CurrentUserStore } from "@/store/auth.svelte";
import { AppStatusStore } from "@/store/app-status.svelte";
import { initializeGame } from "@/handler/initialize";

export async function initializeAuth() {
  AppStatusStore.set("LOADING");

  // 初回のセッション確認
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    CurrentUserStore.set(session.user);
    await initializeGame();
    AppStatusStore.set("AUTHENTICATED");
  } else {
    AppStatusStore.set("UNAUTHENTICATED");
  }

  // 認証状態の変更監視
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const previousStatus = AppStatusStore.get();
      CurrentUserStore.set(session.user);
      
      // 未認証状態から認証済みになった場合のみゲーム初期化を実行
      if (previousStatus !== "AUTHENTICATED") {
        await initializeGame();
        AppStatusStore.set("AUTHENTICATED");
      }
    } else {
      CurrentUserStore.clear();
      AppStatusStore.set("UNAUTHENTICATED");
    }
  });
}
