<script lang="ts">
  import { AuthAPI } from "@/lib/supabase/auth";
  import { CurrentUserStore } from "@/store/auth.svelte";
  import { FavoriteMovesStore } from "@/store/favorite-moves.svelte";
  import { MoveStatisticsStore } from "@/store/move-statistics.svelte";
  import { NodesStore } from "@/store/kifu-node.svelte";
  import { fetchAndSetFavoriteMovesMulti } from "@/handler/favorite-moves";
  import { fetchAndSetMoveStatisticsMulti } from "@/handler/move-statistics";

  const authAPI = new AuthAPI();

  let isMenuOpen = $state(false);
  let isLoading = $state(false);
  let error = $state("");

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

  async function handleSignOut() {
    isLoading = true;
    try {
      await authAPI.signOut();
      // 状態更新は handler/auth.ts の onAuthStateChange で行われる
      isMenuOpen = false;
    } catch (err) {
      error =
        err instanceof Error
          ? err.message
          : "不明なサインアウトエラーが発生しました";
    } finally {
      isLoading = false;
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
        class="user-profile-btn"
        onclick={toggleMenu}
        aria-label="ユーザーメニュー"
      >
        <div class="avatar-icon">
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
        </div>
        <span class="display-name">
          {user.user_metadata?.display_name || "名前未設定"}
        </span>
      </button>

      {#if isMenuOpen}
        <div class="dropdown-menu">
          <div class="user-info">
            <span class="user-display-name">
              {user.user_metadata?.display_name || "名前未設定"}
            </span>
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
  {/if}
</div>

<style>
  .auth-header {
    display: flex;
    justify-content: flex-end;
    padding: 8px 0;
    margin-bottom: 8px;
  }

  .user-menu-container {
    position: relative;
  }

  .user-profile-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px 6px 6px;
    border-radius: 18px;
    background-color: var(--header-bg-color);
    border: 1px solid var(--border-color);
    cursor: pointer;
    color: var(--text-color);
    transition: all 0.2s;
    font-size: 14px;
    font-weight: 500;
  }

  .user-profile-btn:hover {
    background-color: var(--selected-bg-color);
    color: var(--selected-text-color);
  }

  .avatar-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .display-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
  }

  /* モバイル表示時のレスポンシブ対応 */
  @media (max-width: 600px) {
    .display-name {
      max-width: 80px;
    }
  }

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

  .user-display-name {
    display: block;
    font-size: 14px;
    color: var(--text-color);
    font-weight: 600;
    margin-bottom: 4px;
  }

  .user-email {
    display: block;
    font-size: 12px;
    color: var(--text-color);
    opacity: 0.7;
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
</style>
