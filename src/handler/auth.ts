import { supabase } from "@/lib/supabase/client";
import { CurrentUserStore } from "@/store/auth.svelte";
import { AppStatusStore } from "@/store/app-status.svelte";
import { initializeGame } from "@/handler/initialize";

// パスワードリセットフロー検出用のフラグ
// Supabaseがハッシュを処理する前に読み取る必要がある
// モジュールロード時に即座に実行される
const isPasswordRecoveryFlow = window.location.hash.includes("type=recovery");

export async function initializeAuth() {
  AppStatusStore.set("LOADING");

  // 初回のセッション確認
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  console.log('🔍 Initial Auth Check:', {
    hash: window.location.hash,
    isRecovery: isPasswordRecoveryFlow,
    hasSession: !!session,
    amr: (session?.user as any)?.amr
  });

  if (isPasswordRecoveryFlow) {
    if (session?.user) {
      CurrentUserStore.set(session.user);
    }
    AppStatusStore.set("PASSWORD_RESET");
  } else if (session?.user) {
    CurrentUserStore.set(session.user);
    await initializeGame();
    AppStatusStore.set("AUTHENTICATED");
  } else {
    AppStatusStore.set("UNAUTHENTICATED");
  }

  // 認証状態の変更監視
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('🔍 Auth State Change:', {
      event,
      hash: window.location.hash,
      hasRecovery: window.location.hash.includes("type=recovery"),
      currentStatus: AppStatusStore.get(),
      amr: (session?.user as any)?.amr,
      isPasswordRecoveryFlow
    });

    // パスワードリセットフローの検出
    // 1. PASSWORD_RECOVERYイベント
    // 2. 保存されたフラグ（ハッシュ処理前に取得）
    // 3. AMRフィールドの認証方法が recovery
    const amr = (session?.user as any)?.amr as Array<{method: string, timestamp: number}> | undefined;
    const isPasswordRecovery = 
      event === "PASSWORD_RECOVERY" ||
      isPasswordRecoveryFlow ||
      amr?.some(item => item.method === "recovery");

    if (isPasswordRecovery) {
      if (session?.user) {
        CurrentUserStore.set(session.user);
      }
      AppStatusStore.set("PASSWORD_RESET");
      return;
    }

    if (session?.user) {
      const previousStatus = AppStatusStore.get();
      CurrentUserStore.set(session.user);

      // PASSWORD_RESET状態からの遷移は、パスワード更新後のみ許可
      if (previousStatus === "PASSWORD_RESET") {
        // パスワード更新後にのみ認証済み状態へ遷移を許可
        return;
      }

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
