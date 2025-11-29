<script lang="ts">
  import { AuthAPI } from "@/lib/supabase/auth";
  import { CurrentUserStore } from "@/store/auth.svelte";

  const authAPI = new AuthAPI();

  let email = $state("");
  let password = $state("");
  let isSigningUp = $state(false);
  let error = $state("");
  let isLoading = $state(false);
  let dialog: HTMLDialogElement;

  let user = $derived(CurrentUserStore.get());

  async function handleAuth() {
    error = "";
    isLoading = true;

    try {
      if (isSigningUp) {
        const newUser = await authAPI.signUp(email, password);
        if (newUser) {
          CurrentUserStore.set(newUser);
          dialog?.close();
        }
      } else {
        const authenticatedUser = await authAPI.signIn(email, password);
        if (authenticatedUser) {
          CurrentUserStore.set(authenticatedUser);
          dialog?.close();
        }
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "不明なエラーが発生しました";
    } finally {
      isLoading = false;
    }
  }

  async function handleSignOut() {
    try {
      await authAPI.signOut();
      CurrentUserStore.clear();
    } catch (err) {
      error =
        err instanceof Error
          ? err.message
          : "不明なサインアウトエラーが発生しました";
    }
  }
</script>

{#if user}
  <div class="auth-status">
    <span>ようこそ、{user.email}さん</span>
    <button class="auth-btn" onclick={handleSignOut} disabled={isLoading}>
      {isLoading ? "処理中..." : "サインアウト"}
    </button>
  </div>
{:else}
  <button class="auth-btn" onclick={() => dialog?.showModal()}>
    ログイン
  </button>

  <dialog bind:this={dialog} class="auth-dialog">
    <div class="auth-form">
      <h3>{isSigningUp ? "アカウント作成" : "サインイン"}</h3>

      {#if error}
        <div class="error-message">{error}</div>
      {/if}

      <div class="form-group">
        <input
          type="email"
          placeholder="メールアドレス"
          bind:value={email}
          disabled={isLoading}
          class="auth-input"
        />
      </div>

      <div class="form-group">
        <input
          type="password"
          placeholder="パスワード"
          bind:value={password}
          disabled={isLoading}
          class="auth-input"
        />
      </div>

      <button
        class="auth-btn"
        onclick={handleAuth}
        disabled={isLoading || !email || !password}
      >
        {isLoading
          ? "処理中..."
          : isSigningUp
            ? "アカウント作成"
            : "サインイン"}
      </button>

      <button
        class="toggle-btn"
        onclick={() => (isSigningUp = !isSigningUp)}
        disabled={isLoading}
      >
        {isSigningUp
          ? "既にアカウントをお持ちですか？サインイン"
          : "アカウントを作成しますか？"}
      </button>

      <button
        class="toggle-btn"
        onclick={() => dialog?.close()}
        disabled={isLoading}
        style="margin-top: 4px;"
      >
        キャンセル
      </button>
    </div>
  </dialog>
{/if}

<style>
  .auth-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background-color: #f5f5f5;
    border-radius: 4px;
    margin-bottom: 16px;
  }

  .auth-dialog {
    border: none;
    border-radius: 8px;
    padding: 0;
    background: transparent;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }

  .auth-dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  .auth-form {
    padding: 24px;
    background-color: #ffffff;
    border-radius: 8px;
    width: 320px;
    max-width: 90vw;
  }

  .auth-form h3 {
    margin-top: 0;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .auth-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }

  .auth-input:focus {
    border-color: #4caf50;
    outline: none;
  }

  .auth-btn {
    width: 100%;
    padding: 12px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 12px;
    transition: background-color 0.2s;
  }

  .auth-btn:hover:not(:disabled) {
    background-color: #45a049;
  }

  .auth-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .toggle-btn {
    width: 100%;
    padding: 8px;
    background-color: transparent;
    color: #666;
    border: none;
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.2s;
  }

  .toggle-btn:hover:not(:disabled) {
    color: #333;
  }

  .error-message {
    color: #d32f2f;
    background-color: #ffebee;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 16px;
    font-size: 13px;
    text-align: center;
  }
</style>
