import os
import time
import requests
import json
from datetime import datetime

USER_ID = "hashiryo"
GAME_TYPES = ["shogi10", "shogi", "shogi2"]  # 10分, 5分, 2分
DOWNLOAD_DIR = os.path.join(os.path.dirname(__file__), "kifu_quest")

# APIエンドポイント
HISTORY_API = "https://c-loft.com/shogi/quest/history/"
DOWNLOAD_API = "https://c-loft.com/shogi/quest/history/download/"

def get_game_history(user_id, gtype):
    """
    対局履歴を取得
    
    Args:
        user_id: ユーザーID
        gtype: 対局種別 (shogi10, shogi, shogi2)
    
    Returns:
        dict: 対局履歴データ（JSON）
    """
    try:
        params = {
            "userId": user_id,
            "gtype": gtype
        }
        print(f"  Fetching history for {gtype}...")
        response = requests.get(HISTORY_API, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"  Failed to get history for {gtype}: {e}")
        return None

def download_kifu(game_id):
    """
    棋譜をダウンロード
    
    Args:
        game_id: 対局ID
    
    Returns:
        str: CSA形式の棋譜テキスト
    """
    try:
        params = {"id": game_id}
        response = requests.get(DOWNLOAD_API, params=params, allow_redirects=True, timeout=10)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"  Failed to download kifu {game_id}: {e}")
        return None

def format_timestamp(iso_time):
    """
    ISO 8601形式のタイムスタンプをファイル名用の形式に変換
    
    Args:
        iso_time: ISO 8601形式の時刻文字列 (例: 2025-11-22T12:13:37.086Z)
    
    Returns:
        str: ファイル名用の時刻文字列 (例: 20251122_121337)
    """
    try:
        # ISO 8601形式をパース (Zは除去)
        dt = datetime.fromisoformat(iso_time.replace('Z', '+00:00'))
        # ファイル名用の形式に変換
        return dt.strftime("%Y%m%d_%H%M%S")
    except Exception as e:
        print(f"  Warning: Failed to parse timestamp {iso_time}: {e}")
        # フォールバック: ISOタイムスタンプから直接抽出
        return iso_time.replace('T', '_').replace(':', '').replace('.', '_').replace('Z', '')[:15]

def save_kifu(kifu_text, user_id, gtype, game_id, timestamp):
    """
    棋譜をファイルに保存
    
    Args:
        kifu_text: 棋譜テキスト
        user_id: ユーザーID
        gtype: 対局種別
        game_id: 対局ID
        timestamp: タイムスタンプ
    
    Returns:
        bool: 保存成功時True
    """
    try:
        time_str = format_timestamp(timestamp)
        # ファイル名: {user_id}_{gtype}_{timestamp}_{game_id}.csa
        filename = f"{user_id}_{gtype}_{time_str}_{game_id}.csa"
        filepath = os.path.join(DOWNLOAD_DIR, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(kifu_text)
        
        print(f"  ✓ Saved: {filename}")
        return True
    except Exception as e:
        print(f"  ✗ Failed to save {game_id}: {e}")
        return False

def run():
    """メイン処理"""
    print("=" * 60)
    print("将棋クエスト棋譜ダウンローダー")
    print("=" * 60)
    print(f"User ID: {USER_ID}")
    print(f"Download directory: {DOWNLOAD_DIR}")
    print()
    
    # ダウンロードディレクトリの作成
    if not os.path.exists(DOWNLOAD_DIR):
        os.makedirs(DOWNLOAD_DIR)
        print(f"Created directory: {DOWNLOAD_DIR}\n")
    
    total_games = 0
    total_downloads = 0
    
    # 各対局種別ごとに処理
    for gtype in GAME_TYPES:
        gtype_name = {
            "shogi10": "10分将棋",
            "shogi": "5分将棋",
            "shogi2": "2分将棋"
        }.get(gtype, gtype)
        
        print(f"[{gtype_name}]")
        
        # 対局履歴を取得
        history = get_game_history(USER_ID, gtype)
        
        if not history or "games" not in history:
            print(f"  No games found or error occurred.\n")
            continue
        
        games = history["games"]
        game_count = len(games)
        total_games += game_count
        print(f"  Found {game_count} games")
        
        # 各対局の棋譜をダウンロード
        new_downloads = 0
        for i, game in enumerate(games, 1):
            game_id = game.get("id")
            move_exists = game.get("moveExists", False)
            created = game.get("created", "")
            
            if not game_id:
                continue
            
            if not move_exists:
                print(f"  [{i}/{game_count}] {game_id}: No moves available (skipped)")
                continue
            
            # ファイル名を生成してダウンロード済みかチェック
            time_str = format_timestamp(created)
            filename = f"{USER_ID}_{gtype}_{time_str}_{game_id}.csa"
            filepath = os.path.join(DOWNLOAD_DIR, filename)
            
            if os.path.exists(filepath):
                # print(f"  [{i}/{game_count}] {game_id}: Already exists (skipped)")
                continue
            
            # 棋譜をダウンロード
            print(f"  [{i}/{game_count}] Downloading {game_id}...")
            kifu = download_kifu(game_id)
            
            if kifu:
                if save_kifu(kifu, USER_ID, gtype, game_id, created):
                    new_downloads += 1
                    total_downloads += 1
                time.sleep(0.5)  # サーバーに優しく
            else:
                print(f"  ✗ Failed to download {game_id}")
        
        print(f"  Summary: {new_downloads} new files downloaded\n")
    
    # 最終サマリー
    print("=" * 60)
    print("Download complete!")
    print(f"Total games found: {total_games}")
    print(f"New files downloaded: {total_downloads}")
    print("=" * 60)

if __name__ == "__main__":
    run()
