# 将棋ウォーズ棋譜ダウンローダー

このスクリプトは、[SHOGI-EXTEND](https://www.shogi-extend.com/swars/search) から将棋ウォーズの棋譜を自動的にダウンロードするツールです。

## 機能

- 指定したユーザーIDの棋譜を一括ダウンロード
- ページネーション対応（全ページを自動巡回）
- 既存ファイルのスキップ（重複ダウンロードなし）
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

### ローカルでの手動実行

```bash
# 仮想環境を有効化してから
source venv/bin/activate
python main.py
```

ダウンロードされた棋譜は `kifu/` ディレクトリに保存されます。

### ユーザーIDの変更

`main.py` の以下の行を編集してください：

```python
USER_ID = "hashiryoma"  # ここを変更
```

## GitHub Actions での自動実行

このリポジトリでは、GitHub Actions を使用して毎日自動的に棋譜をダウンロードします。

- **自動実行時刻**: 毎日 00:00 JST（UTC 15:00）
- **ワークフロー**: `.github/workflows/kifu_download.yml`

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
    - cron: '0 15 * * 0'  # 0 = 日曜日
```

## ファイル構成

```
kifu_downloader/
├── README.md           # このファイル
├── main.py             # メインスクリプト
├── requirements.txt    # Python依存パッケージ
├── venv/               # 仮想環境（gitignore対象）
└── kifu/               # ダウンロードされた棋譜の保存先
    └── *.kif           # 棋譜ファイル
```

## 仕組み

1. Playwright を使用して検索ページにアクセス
2. 棋譜一覧から各対局のIDを抽出
3. 棋譜のダウンロードURL（`.kif` 形式）を構築
4. `requests` ライブラリで棋譜ファイルをダウンロード
5. 次のページがあれば移動して繰り返し

## トラブルシューティング

### ダウンロードが失敗する

- ネットワーク接続を確認してください
- サイトの仕様が変更された可能性があります（HTMLの構造など）
- しばらく待ってから再実行してみてください

### GitHub Actions が動かない

- リポジトリの `Actions` タブで実行ログを確認してください
- Workflow のパーミッション設定を確認してください（`Settings` > `Actions` > `General`）

## ライセンス

このスクリプトは個人利用を想定しています。サイトの利用規約を遵守してください。
