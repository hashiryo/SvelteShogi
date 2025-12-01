<script lang="ts">
  import { AuthAPI } from "@/lib/supabase/auth";
  import { AppStatusStore } from "@/store/app-status.svelte";

  const authAPI = new AuthAPI();
  let password = $state("");
  let isLoading = $state(false);
  let error = $state("");
  let successMessage = $state("");
  let showPassword = $state(false);

  async function handleUpdatePassword() {
    error = "";
    successMessage = "";
    isLoading = true;
    try {
      await authAPI.updatePassword(password);
      successMessage = "パスワードを更新しました。";

      // パスワードリセットフラグをクリア
      sessionStorage.removeItem("password_reset_in_progress");

      setTimeout(() => {
        // ハッシュを完全に削除してからリロード
        // リロード後、AMRフィールドに recovery がなくなり、通常の認証フローになる
        history.replaceState(null, "", window.location.pathname);
        window.location.reload();
      }, 1500);
    } catch (e) {
      error = e instanceof Error ? e.message : "エラーが発生しました";
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="auth-page">
  <div class="auth-container">
    <div class="app-logo">
      <h1>将棋分析アプリ</h1>
    </div>

    <div class="auth-card">
      {#if successMessage}
        <div class="verification-message">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="check-icon"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h3>パスワード更新完了</h3>
          <p>{successMessage}</p>
          <p>アプリへ移動します...</p>
        </div>
      {:else}
        <h3>パスワード再設定</h3>

        {#if error}
          <div class="error-message">{error}</div>
        {/if}

        <p class="instruction">新しいパスワードを入力してください。</p>

        <div class="form-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="新しいパスワード"
            bind:value={password}
            disabled={isLoading}
            class="auth-input"
          />
          <button
            type="button"
            class="password-toggle-btn"
            onclick={() => (showPassword = !showPassword)}
            aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
          >
            {#if showPassword}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                ></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            {/if}
          </button>
        </div>

        <button
          class="auth-btn"
          onclick={handleUpdatePassword}
          disabled={isLoading || !password}
        >
          {isLoading ? "更新中..." : "パスワードを更新"}
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .auth-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: var(--bg-color);
    padding: 20px;
  }

  .auth-container {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .app-logo {
    text-align: center;
  }

  .app-logo h1 {
    margin: 0;
    color: var(--header-text-color);
    font-size: 28px;
    font-weight: 700;
  }

  .auth-card {
    background-color: var(--header-bg-color);
    padding: 32px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-color);
  }

  h3 {
    margin-top: 0;
    margin-bottom: 24px;
    text-align: center;
    color: var(--header-text-color);
    font-size: 20px;
  }

  .instruction {
    text-align: center;
    margin-bottom: 20px;
    color: var(--text-color);
    font-size: 14px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .password-group {
    position: relative;
  }

  .password-group .auth-input {
    padding-right: 44px;
  }

  .password-toggle-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: var(--text-color);
    opacity: 0.6;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
  }

  .password-toggle-btn:hover {
    opacity: 1;
  }

  .auth-input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s;
    background-color: var(--bg-color);
    color: var(--text-color);
  }

  .auth-input:focus {
    border-color: var(--success-color);
    outline: none;
  }

  .auth-btn {
    width: 100%;
    padding: 12px;
    background-color: var(--success-color);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 16px;
    transition: background-color 0.2s;
    margin-top: 8px;
  }

  .auth-btn:hover:not(:disabled) {
    opacity: 0.9;
  }

  .auth-btn:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
  }

  .error-message {
    color: var(--error-color);
    background-color: var(--selected-bg-color);
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
    font-size: 13px;
    text-align: center;
    border: 1px solid var(--error-color);
  }

  .verification-message {
    text-align: center;
  }

  .verification-message .check-icon {
    color: var(--success-color);
    margin-bottom: 16px;
  }

  .verification-message h3 {
    margin: 0 0 16px 0;
    color: var(--header-text-color);
    font-size: 18px;
  }

  .verification-message p {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: var(--text-color);
    line-height: 1.5;
  }
</style>
