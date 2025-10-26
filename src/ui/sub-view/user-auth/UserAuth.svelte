<script lang="ts">
  import { AuthAPI } from "@/lib/supabase/auth";
  import { CurrentUserStore } from "@/store/auth.svelte";

  const authAPI = new AuthAPI();

  let email = $state("");
  let password = $state("");
  let isSigningUp = $state(false);
  let error = $state("");
  let isLoading = $state(false);

  let user = $derived(CurrentUserStore.get());

  async function handleAuth() {
    error = "";
    isLoading = true;

    try {
      if (isSigningUp) {
        const newUser = await authAPI.signUp(email, password);
        if (newUser) {
          CurrentUserStore.set(newUser);
        }
      } else {
        const authenticatedUser = await authAPI.signIn(email, password);
        if (authenticatedUser) {
          CurrentUserStore.set(authenticatedUser);
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
      {isLoading ? "処理中..." : isSigningUp ? "アカウント作成" : "サインイン"}
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
  </div>
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

  .auth-form {
    padding: 16px;
    background-color: #f9f9f9;
    border-radius: 4px;
    margin-bottom: 16px;
  }

  .form-group {
    margin-bottom: 12px;
  }

  .auth-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
  }

  .auth-btn {
    width: 100%;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    margin-bottom: 8px;
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
    color: #4caf50;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;
  }

  .toggle-btn:hover:not(:disabled) {
    background-color: #f0f0f0;
  }

  .error-message {
    color: #f44336;
    background-color: #ffebee;
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 12px;
    font-size: 14px;
  }
</style>
