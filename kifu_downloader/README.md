# 将棋ウォーズ棋譜ダウンローダー & アップローダー

このツールは、[SHOGI-EXTEND](https://www.shogi-extend.com/swars/search) から将棋ウォーズの棋譜を自動的にダウンロードし、Supabaseデータベースにアップロードします。

## 機能

- 指定したユーザーIDの棋譜を一括ダウンロード
- ページネーション対応（全ページを自動巡回）
- 既存ファイルのスキップ（重複ダウンロードなし）
- **棋譜のパースとSupabaseへのアップロード**
- **重複チェック（同じ棋譜の二重登録防止）**
- GitHub Actions による自動定期実行（毎日 00:00 JST）

## セットアップ

### 1. 依存関係のインストール

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

## 使い方

### 棋譜のダウンロード

```bash
source venv/bin/activate
python main.py
```

ダウンロードされた棋譜は `kifu/` ディレクトリに保存されます。

### 棋譜のアップロード

```bash
# 環境変数を設定
export SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export UPLOAD_USER_ID="your-user-id"  # オプション

# アップロード実行
python upload_kifu.py

# ドライラン（DBには書き込まない）
python upload_kifu.py --dry-run

# 特定のファイルのみアップロード
python upload_kifu.py kifu/specific-game.kif

# 重複チェックをスキップ
python upload_kifu.py --skip-duplicate-check
```

### ユーザーIDの変更

`main.py` の以下の行を編集してください：

```python
USER_ID = "hashiryoma"  # ここを変更
```

## GitHub Actions での自動実行

このリポジトリでは、GitHub Actions を使用して毎日自動的に棋譜をダウンロード＆アップロードします。

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
├── main.py             # 棋譜ダウンロードスクリプト
├── upload_kifu.py      # 棋譜アップロードCLI
├── kif_parser.py       # KIF形式パーサー
├── shogi_board.py      # 盤面管理・SFENX変換
├── db_uploader.py      # Supabaseアップロード処理
├── requirements.txt    # Python依存パッケージ
├── venv/               # 仮想環境（gitignore対象）
└── kifu/               # ダウンロードされた棋譜の保存先
    └── *.kif           # 棋譜ファイル
```

## 仕組み

### ダウンロード処理

1. Playwright を使用して検索ページにアクセス
2. 棋譜一覧から各対局のIDを抽出
3. 棋譜のダウンロードURL（`.kif` 形式）を構築
4. `requests` ライブラリで棋譜ファイルをダウンロード
5. 次のページがあれば移動して繰り返し

### アップロード処理

1. KIFファイルをパースしてメタデータと指し手を抽出
2. 盤面を再生しながら各局面のSFENXを生成
3. 重複チェック（同じハッシュの棋譜が既に存在しないか）
4. 統計データ（`shogi_moves_statistics`）をバルクインサート
5. ゲームレコード（`game_records`）を挿入

## トラブルシューティング

### ダウンロードが失敗する

- ネットワーク接続を確認してください
- サイトの仕様が変更された可能性があります（HTMLの構造など）
- しばらく待ってから再実行してみてください

### アップロードが失敗する

- 環境変数が正しく設定されているか確認してください
- Service Role Keyを使用しているか確認してください（anon keyでは権限不足の可能性）
- Supabaseのテーブル構造が正しいか確認してください

### GitHub Actions が動かない

- リポジトリの `Actions` タブで実行ログを確認してください
- Secretsが正しく設定されているか確認してください
- Workflow のパーミッション設定を確認してください（`Settings` > `Actions` > `General`）

## ライセンス

このスクリプトは個人利用を想定しています。サイトの利用規約を遵守してください。
