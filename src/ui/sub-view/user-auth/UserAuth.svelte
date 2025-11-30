<script lang="ts">
  import { AuthAPI } from "@/lib/supabase/auth";
  import { CurrentUserStore } from "@/store/auth.svelte";
  import { FavoriteMovesStore } from "@/store/favorite-moves.svelte";
  import { MoveStatisticsStore } from "@/store/move-statistics.svelte";
  import { NodesStore } from "@/store/kifu-node.svelte";
  import { fetchAndSetFavoriteMovesMulti } from "@/handler/favorite-moves";
  import { fetchAndSetMoveStatisticsMulti } from "@/handler/move-statistics";

  const authAPI = new AuthAPI();

  let email = $state("");
  let password = $state("");
  let isSigningUp = $state(false);
  let error = $state("");
  let isLoading = $state(false);
  let dialog: HTMLDialogElement;
  let isMenuOpen = $state(false);

  let user = $derived(CurrentUserStore.get());

  async function refreshData() {
    FavoriteMovesStore.clear();
    MoveStatisticsStore.clear();
    const nodes = NodesStore.get();
    const sfenxes = nodes.map((node) => node.sfenx);
    await Promise.all([
      fetchAndSetFavoriteMovesMulti(sfenxes),
      fetchAndSetMoveStatisticsMulti(sfenxes),
    ]);
  }

  async function handleAuth() {
    error = "";
    isLoading = true;

    try {
      if (isSigningUp) {
        const newUser = await authAPI.signUp(email, password);
        if (newUser) {
          CurrentUserStore.set(newUser);
          await refreshData();
          dialog?.close();
        }
      } else {
        const authenticatedUser = await authAPI.signIn(email, password);
        if (authenticatedUser) {
          CurrentUserStore.set(authenticatedUser);
          await refreshData();
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
      await refreshData();
      isMenuOpen = false;
    } catch (err) {
      error =
        err instanceof Error
          ? err.message
          : "不明なサインアウトエラーが発生しました";
    }
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<div class="auth-header">
  {#if user}
    <div class="user-menu-container">
      <button
        class="avatar-btn"
        onclick={toggleMenu}
        aria-label="ユーザーメニュー"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>

      {#if isMenuOpen}
        <div class="dropdown-menu">
          <div class="user-info">
            <span class="user-email">{user.email}</span>
          </div>
          <div class="menu-divider"></div>
          <button
            class="menu-item logout-btn"
            onclick={handleSignOut}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {isLoading ? "処理中..." : "サインアウト"}
          </button>
        </div>
      {/if}
    </div>
  {:else}
    <button class="login-trigger-btn" onclick={() => dialog?.showModal()}>
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
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
        <polyline points="10 17 15 12 10 7"></polyline>
        <line x1="15" y1="12" x2="3" y2="12"></line>
      </svg>
      <span>ログイン</span>
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
</div>

<style>
  .auth-header {
    display: flex;
    justify-content: flex-end;
    padding: 8px 0;
    margin-bottom: 8px;
  }

  /* User Menu & Avatar */
  .user-menu-container {
    position: relative;
  }

  .avatar-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: var(--header-bg-color);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-color);
    transition: all 0.2s;
    padding: 0;
  }

  .avatar-btn:hover {
    background-color: var(--selected-bg-color);
    color: var(--selected-text-color);
  }

  /* Dropdown Menu */
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background-color: var(--bg-color);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid var(--border-color);
    min-width: 200px;
    z-index: 100;
    overflow: hidden;
    animation: fadeIn 0.1s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .user-info {
    padding: 12px 16px;
    background-color: var(--header-bg-color);
  }

  .user-email {
    display: block;
    font-size: 13px;
    color: var(--text-color);
    font-weight: 500;
    word-break: break-all;
  }

  .menu-divider {
    height: 1px;
    background-color: var(--border-color);
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 10px 16px;
    background: none;
    border: none;
    text-align: left;
    font-size: 13px;
    cursor: pointer;
    color: var(--text-color);
    transition: background-color 0.2s;
  }

  .menu-item:hover {
    background-color: var(--selected-bg-color);
    color: var(--selected-text-color);
  }

  .logout-btn {
    color: var(--error-color);
  }

  .logout-btn:hover {
    background-color: var(--selected-bg-color);
    color: var(--error-color);
  }

  /* Login Trigger Button (Logged Out State) */
  .login-trigger-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background-color: transparent;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-color);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .login-trigger-btn:hover {
    background-color: var(--header-bg-color);
    border-color: var(--border-color);
    color: var(--text-color);
  }

  /* Dialog & Form Styles (Existing but refined) */
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
    background-color: var(--bg-color);
    border-radius: 8px;
    width: 320px;
    max-width: 90vw;
  }

  .auth-form h3 {
    margin-top: 0;
    margin-bottom: 20px;
    text-align: center;
    color: var(--header-text-color);
    font-size: 18px;
  }

  .form-group {
    margin-bottom: 16px;
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
    margin-bottom: 12px;
    transition: background-color 0.2s;
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
    font-size: 12px;
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
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 16px;
    font-size: 13px;
    text-align: center;
  }
</style>
