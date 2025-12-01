# 認証リファクタリング計画

## 目的
現在の `initialize.ts` に混在している「認証ロジック」と「ゲーム初期化ロジック」を分離し、アプリケーションの状態（未認証、認証済みなど）に応じて適切な画面を表示する構成に変更する。

## 変更後のアーキテクチャ概要
`App.svelte` を状態監視ルーターとして機能させ、以下の状態に応じて表示を切り替える。

- **LOADING**: 初期ロード中
- **UNAUTHENTICATED**: サインイン画面 (`AuthPage`)
- **AUTHENTICATED**: メインアプリ画面 (`MainView` + `SubView`)

## 実装ステップ

### Step 1: アプリケーション状態管理の作成
- **作成**: `src/store/app-status.svelte.ts`
    - アプリ全体の状態 (`LOADING` | `UNAUTHENTICATED` | `AUTHENTICATED`) を管理するストア。

### Step 2: ハンドラーの分離と整理
- **作成**: `src/handler/auth.ts`
    - Supabaseの認証状態監視 (`onAuthStateChange`) を担当。
    - 認証状態の変化に応じて `AppStatusStore` を更新する。
    - サインイン成功時にゲーム初期化処理を呼び出す。
- **修正**: `src/handler/initialize.ts`
    - 関数名を `initializeGame` に変更。
    - 認証関連のコードを削除し、純粋な「盤面・棋譜データの初期化」のみに専念させる。

### Step 3: サインインページコンポーネントの作成
- **作成**: `src/ui/auth/AuthPage.svelte`
    - 未認証時に表示する専用ページ。
    - 現在の `UserAuth.svelte` にあるサインイン/登録フォームのロジックを移植。
    - ダイアログではなく、ページ全体を使ったレイアウトにする。

### Step 4: 既存 UserAuth コンポーネントの簡素化
- **修正**: `src/ui/sub-view/user-auth/UserAuth.svelte`
    - サインイン/登録フォーム、ダイアログ関連のコードを削除。
    - ユーザー情報の表示とログアウトボタンのみを残す（メイン画面表示時は認証済みであることが保証されるため）。

### Step 5: App.svelte の統合
- **修正**: `src/App.svelte`
    - `AppStatusStore` を監視。
    - 状態に応じて `Loading` / `AuthPage` / `MainView` を出し分けるロジックを実装。

## 将来的な展望
このリファクタリングにより、アプリケーションの状態管理が柔軟になり、以下のような機能拡張が容易になる。

- **パスワードリセットフロー**: `PASSWORD_RESET` 状態を追加し、専用の画面を表示する。
- **メンテナンスモード**: `MAINTENANCE` 状態を追加し、全ユーザーに対してメンテナンス画面を表示する（リモート設定などで制御）。
- **強制アップデート**: アプリのバージョンが古い場合に `UPDATE_REQUIRED` 状態にし、アップデートを促す画面を表示する。
- **オンボーディング**: 初回登録ユーザーに対して `ONBOARDING` 状態にし、チュートリアル画面を表示する。

