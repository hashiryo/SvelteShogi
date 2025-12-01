<script lang="ts">
  import { AuthAPI } from "@/lib/supabase/auth";

  const authAPI = new AuthAPI();

  let email = $state("");
  let password = $state("");
  let displayName = $state("");
  let isSigningUp = $state(false);
  let error = $state("");
  let isLoading = $state(false);
  let showVerificationMessage = $state(false);
  let showPassword = $state(false);

  async function handleAuth() {
    error = "";
    isLoading = true;

    try {
      if (isSigningUp) {
        const newUser = await authAPI.signUp(email, password, displayName);
        if (newUser) {
          showVerificationMessage = true;
        }
      } else {
        await authAPI.signIn(email, password);
        // サインイン成功時の状態更新は handler/auth.ts の onAuthStateChange で行われるため
        // ここでは何もしなくて良い
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "不明なエラーが発生しました";
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
      {#if showVerificationMessage}
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
            class="mail-icon"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
          <h3>確認メールを送信しました</h3>
          <p>
            <strong>{email}</strong> 宛に確認メールを送信しました。
          </p>
          <p>
            メール内のリンクをクリックして、アカウントの作成を完了してください。
          </p>
          <p class="note">
            メールが届かない場合は、迷惑メールフォルダをご確認ください。
          </p>
          <button
            class="auth-btn"
            onclick={() => (showVerificationMessage = false)}>戻る</button
          >
        </div>
      {:else}
        <h3>{isSigningUp ? "アカウント作成" : "サインイン"}</h3>

        {#if error}
          <div class="error-message">{error}</div>
        {/if}

        {#if isSigningUp}
          <div class="form-group">
            <input
              type="text"
              placeholder="表示名"
              bind:value={displayName}
              disabled={isLoading}
              class="auth-input"
            />
          </div>
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

        <div class="form-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="パスワード"
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
          onclick={handleAuth}
          disabled={isLoading ||
            !email ||
            !password ||
            (isSigningUp && !displayName)}
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

  .toggle-btn {
    width: 100%;
    padding: 8px;
    background-color: transparent;
    color: var(--text-color);
    border: none;
    font-size: 13px;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.2s;
  }

  .toggle-btn:hover:not(:disabled) {
    color: var(--link-hover-color);
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

  .verification-message .mail-icon {
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

  .verification-message .note {
    font-size: 12px;
    color: var(--text-color);
    opacity: 0.7;
    margin-bottom: 20px;
  }
</style>
