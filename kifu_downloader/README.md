# 将棋ウォーズ棋譜ダウンローダー & インポーター

このツールは、[SHOGI-EXTEND](https://www.shogi-extend.com/swars/search) から将棋ウォーズの棋譜を自動的にダウンロードし、Supabaseデータベースにインポートします。

## 機能

- 指定したユーザーIDの棋譜を一括ダウンロード
- ページネーション対応（全ページを自動巡回）
- 既存ファイルのスキップ（重複ダウンロードなし）
- **棋譜のパースとSupabaseへのインポート**
- **重複チェック（同じ棋譜の二重登録防止）**
- GitHub Actions による自動定期実行（毎日 00:00 JST）

## セットアップ

### 1. Python環境（ダウンロード用）

```bash
# プロジェクトルートから実行
cd kifu_downloader

# 仮想環境の作成
python3 -m venv venv

# 仮想環境の有効化
source venv/bin/activate  # macOS/Linux
# または
.\venv\Scripts\activate  # Windows

# 依存パッケージのインストール
pip install -r requirements.txt

# Playwright ブラウザのインストール
playwright install chromium
```

### 2. Node.js環境（インポート用）

プロジェクトルートで依存関係をインストールします。

```bash
npm install
```

### 3. 環境変数の設定

`.env` または `.env.local` ファイルを作成し、以下の変数を設定してください。

```env
SUPABASE_URL="your-supabase-url"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
UPLOAD_USER_ID="your-user-id"  # オプション
```

## 使い方

### 棋譜のダウンロード

```bash
# 仮想環境を有効化してから
python kifu_downloader/main.py
```

ダウンロードされた棋譜は `kifu_downloader/kifu/` ディレクトリに保存されます。

### 棋譜のインポート

TypeScriptで書かれたインポートツールを使用します。

```bash
# インポート実行
npm run import-kifu -- kifu_downloader/kifu

# ドライラン（DBには書き込まない）
npm run import-kifu -- kifu_downloader/kifu --dry-run

# 特定のファイルのみインポート
npm run import-kifu -- kifu_downloader/kifu/specific-game.kif

# 重複チェックをスキップ
npm run import-kifu -- kifu_downloader/kifu --skip-duplicate-check
```

### ユーザーIDの変更

ダウンロード対象のユーザーIDを変更するには、`kifu_downloader/main.py` の以下の行を編集してください：

```python
USER_ID = "hashiryoma"  # ここを変更
```

## GitHub Actions での自動実行

このリポジトリでは、GitHub Actions を使用して毎日自動的に棋譜をダウンロード＆インポートします。

- **自動実行時刻**: 毎日 00:00 JST（UTC 15:00）
- **ワークフロー**: `.github/workflows/kifu_download.yml`

### 必要なSecrets設定

リポジトリの `Settings` > `Secrets and variables` > `Actions` で以下を設定してください：

| Secret名                    | 説明                                        |
| --------------------------- | ------------------------------------------- |
| `VITE_SUPABASE_URL`         | SupabaseプロジェクトのURL（デプロイと共用） |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key（anon keyではなく）        |
| `UPLOAD_USER_ID`            | アップロード先のユーザーID                  |

**取得方法:**

- `VITE_SUPABASE_URL`: 既に設定済み（デプロイと共用）
- `SUPABASE_SERVICE_ROLE_KEY`: Supabaseダッシュボード → Project Settings → API → service_role キー
- `UPLOAD_USER_ID`: Supabaseダッシュボード → Authentication → Users → 対象ユーザーのUID

### 手動実行

GitHub のリポジトリページから手動でワークフローを実行することもできます：

1. `Actions` タブを開く
2. `Download Kifu` ワークフローを選択
3. `Run workflow` ボタンをクリック

### スケジュールの変更

実行頻度を変更したい場合は、`.github/workflows/kifu_download.yml` のcron設定を編集してください：

```yaml
on:
  schedule:
    # 毎週日曜日の00:00 JST に変更する例
    - cron: "0 15 * * 0" # 0 = 日曜日
```

## ファイル構成

```
kifu_downloader/
├── README.md           # このファイル
├── main.py             # 棋譜ダウンロードスクリプト (Python)
├── import_kifu.ts      # 棋譜インポートCLI (TypeScript)
├── requirements.txt    # Python依存パッケージ
├── venv/               # 仮想環境（gitignore対象）
└── kifu/               # ダウンロードされた棋譜の保存先
    └── *.kif           # 棋譜ファイル
```

## 仕組み

### ダウンロード処理 (Python)

1. Playwright を使用して検索ページにアクセス
2. 棋譜一覧から各対局のIDを抽出
3. 棋譜のダウンロードURL（`.kif` 形式）を構築
4. `requests` ライブラリで棋譜ファイルをダウンロード
5. 次のページがあれば移動して繰り返し

### インポート処理 (TypeScript)

1. KIFファイルをパースしてメタデータと指し手を抽出 (`src/domain/format-parcer.ts` を再利用)
2. 盤面を再生しながら各局面のSFENXを生成 (`src/domain/move.ts`, `src/domain/sfenx.ts` を再利用)
3. 重複チェック（同じハッシュの棋譜が既に存在しないか）
4. 統計データ（`shogi_moves_statistics`）をバルクインサート
5. ゲームレコード（`game_records`）を挿入

## トラブルシューティング

### ダウンロードが失敗する

- ネットワーク接続を確認してください
- サイトの仕様が変更された可能性があります（HTMLの構造など）
- しばらく待ってから再実行してみてください

### インポートが失敗する

- 環境変数が正しく設定されているか確認してください
- Service Role Keyを使用しているか確認してください（anon keyでは権限不足の可能性）
- Supabaseのテーブル構造が正しいか確認してください

### GitHub Actions が動かない

- リポジトリの `Actions` タブで実行ログを確認してください
- Secretsが正しく設定されているか確認してください
- Workflow のパーミッション設定を確認してください（`Settings` > `Actions` > `General`）

## ライセンス

このスクリプトは個人利用を想定しています。サイトの利用規約を遵守してください。
