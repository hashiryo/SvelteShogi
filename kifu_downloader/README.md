# 将棋棋譜ダウンローダー & インポーター

このツールは、以下のサイトから棋譜を自動的にダウンロードし、Supabaseデータベースにインサートします。

- **将棋ウォーズ**: [SHOGI-EXTEND](https://www.shogi-extend.com/swars/search)
- **将棋クエスト**: [将棋クエスト履歴検索β](https://c-loft.com/shogi/quest/)

## 機能

### 共通機能
- **棋譜のパースとSupabaseへのインサート**
- **重複チェック（同じ棋譜の二重登録防止）**
- 既存ファイルのスキップ（重複ダウンロードなし）
- GitHub Actions による自動定期実行

### 将棋ウォーズ (`download-wars.py`)
- 指定したユーザーIDの棋譜を一括ダウンロード（KIF形式）
- ページネーション対応（全ページを自動巡回）
- 毎日 00:00 JST に自動実行

### 将棋クエスト (`download-quest.py`)
- 指定したユーザーIDの棋譜を一括ダウンロード（CSA形式）
- 3種類の対局種別に対応（10分/5分/2分）
- ⚠️ **制限**: 各対局種別ごとに最新30局のみ取得可能
- 毎日 01:00 JST に自動実行

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

### 2. Node.js環境（インサート用）

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

#### 将棋ウォーズ

```bash
# 仮想環境を有効化してから
python kifu_downloader/download-wars.py
```

ダウンロードされた棋譜は `kifu_downloader/kifu/` ディレクトリに保存されます。

#### 将棋クエスト

```bash
# requestsライブラリだけで動作（venv不要でも可）
python kifu_downloader/download-quest.py
```

ダウンロードされた棋譜は `kifu_downloader/kifu_quest/` ディレクトリに保存されます。

### 棋譜のインサート

TypeScriptで書かれたインサートツールを使用します。

```bash
# 将棋ウォーズの棋譜をインサート
npm run insert-kifu -- kifu_downloader/kifu

# 将棋クエストの棋譜をインサート
npm run insert-kifu -- kifu_downloader/kifu_quest

# ドライラン（DBには書き込まない）
npm run insert-kifu -- kifu_downloader/kifu --dry-run

# 特定のファイルのみインサート
npm run insert-kifu -- kifu_downloader/kifu/specific-game.kif

# 重複チェックをスキップ
npm run insert-kifu -- kifu_downloader/kifu --skip-duplicate-check
```

### ユーザーIDの変更

ダウンロード対象のユーザーIDを変更するには、各スクリプトの以下の行を編集してください：

**将棋ウォーズ** (`kifu_downloader/download-wars.py`):
```python
USER_ID = "hashiryoma"  # ここを変更
```

**将棋クエスト** (`kifu_downloader/download-quest.py`):
```python
USER_ID = "hashiryo"  # ここを変更
```

## GitHub Actions での自動実行

このリポジトリでは、GitHub Actions を使用して毎日自動的に棋譜をダウンロード＆インサートします。

### ワークフロー

| ワークフロー | 対象 | 実行時刻 | ファイル |
|------------|------|---------|---------|
| Download Kifu | 将棋ウォーズ | 毎日 00:00 JST（UTC 15:00） | `.github/workflows/kifu_download.yml` |
| Download Quest Kifu | 将棋クエスト | 毎日 01:00 JST（UTC 16:00） | `.github/workflows/kifu_download_quest.yml` |

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
2. 実行したいワークフロー（`Download Kifu` または `Download Quest Kifu`）を選択
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
├── README.md                # このファイル
├── QUEST_ANALYSIS.md        # 将棋クエスト実現可能性分析レポート
├── download-wars.py         # 将棋ウォーズ棋譜ダウンロードスクリプト
├── download-quest.py        # 将棋クエスト棋譜ダウンロードスクリプト
├── analyze_quest.py         # 将棋クエストAPI調査スクリプト（開発用）
├── insert-kifu.ts           # 棋譜インサートCLI (TypeScript)
├── requirements.txt         # Python依存パッケージ
├── venv/                    # 仮想環境（gitignore対象）
├── kifu/                    # 将棋ウォーズの棋譜保存先
│   └── *.kif                # KIF形式の棋譜ファイル
└── kifu_quest/              # 将棋クエストの棋譜保存先
    └── *.csa                # CSA形式の棋譜ファイル
```

## 仕組み

### ダウンロード処理

#### 将棋ウォーズ (Python + Playwright)

1. Playwright を使用して検索ページにアクセス
2. 棋譜一覧から各対局のIDを抽出
3. 棋譜のダウンロードURL（`.kif` 形式）を構築
4. `requests` ライブラリで棋譜ファイルをダウンロード
5. 次のページがあれば移動して繰り返し

#### 将棋クエスト (Python + HTTP API)

1. HTTP APIで対局履歴を取得（JSON形式）
2. 3種類の対局種別（10分/5分/2分）をそれぞれ処理
3. 各対局のIDを抽出
4. 棋譜ダウンロードAPIを呼び出し（CSA形式）
5. ファイルに保存

### インサート処理 (TypeScript)

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

### インサートが失敗する

- 環境変数が正しく設定されているか確認してください
- Service Role Keyを使用しているか確認してください（anon keyでは権限不足の可能性）
- Supabaseのテーブル構造が正しいか確認してください

### GitHub Actions が動かない

- リポジトリの `Actions` タブで実行ログを確認してください
- Secretsが正しく設定されているか確認してください
- Workflow のパーミッション設定を確認してください（`Settings` > `Actions` > `General`）

## ライセンス

このスクリプトは個人利用を想定しています。サイトの利用規約を遵守してください。
