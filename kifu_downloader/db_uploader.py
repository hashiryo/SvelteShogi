"""
Supabaseへの棋譜データアップロードを行うモジュール
"""
import hashlib
import json
import os
from dataclasses import dataclass
from datetime import datetime
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from supabase import Client

from kif_parser import KifMetadata
from shogi_board import ShogiBoard, flip_sfenx, flip_move


@dataclass
class MoveStatisticsRecord:
    sfenx: str
    move: str
    win: bool
    lose: bool
    timeout: bool


def get_supabase_client() -> "Client":
    """Supabaseクライアントを取得"""
    from supabase import create_client
    
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not key:
        raise ValueError("SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY 環境変数を設定してください")
    
    return create_client(url, key)


def generate_game_hash(moves: list[str], metadata: KifMetadata) -> str:
    """棋譜全体の一意性を判定するハッシュを生成"""
    game_signature = {
        "moves": moves,
        "startTime": metadata.start_time,
        "endTime": metadata.end_time,
        "players": sorted([metadata.black_player or "", metadata.white_player or ""]),
        "result": metadata.result,
    }
    
    data = json.dumps(game_signature, ensure_ascii=False, sort_keys=True).encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def upload_game(
    client: "Client",
    moves: list[str],
    metadata: KifMetadata,
    user_id: Optional[str] = None,
    skip_duplicate_check: bool = False
) -> bool:
    """
    棋譜をDBにアップロード
    
    Returns:
        bool: アップロードが成功したかどうか
    """
    game_hash = generate_game_hash(moves, metadata)
    
    # 重複チェック（ハッシュのみで判定、日数制限なし）
    if not skip_duplicate_check:
        query = client.table("game_records").select("id").eq("game_hash", game_hash)
        if user_id:
            query = query.eq("user_id", user_id)
        else:
            query = query.is_("user_id", "null")
        result = query.execute()
        
        if len(result.data) > 0:
            print("  スキップ: 重複する棋譜が既に存在します")
            return False
    
    # 盤面を再生して統計データを構築
    board = ShogiBoard()
    statistics_records: list[MoveStatisticsRecord] = []
    
    # 最後の手が投了かどうかで勝者を判定
    winner_is_sente = None
    if moves and moves[-1] == "resign":
        # 投了した側の逆が勝者
        # 投了時点での手番（is_sente_turn）が投了した側
        # movesの長さが奇数なら先手の手番で投了 = 先手負け
        winner_is_sente = len(moves) % 2 == 0
    
    for i, move in enumerate(moves):
        is_sente_turn = (i % 2 == 0)
        prev_sfenx = board.get_sfenx()
        
        # 盤面を更新
        board.apply_move(move)
        
        # 統計レコードを生成（特殊な手以外のみ）
        if move not in ("resign", "timeout", "interrupt", "repetition", "sennichite", "foul"):
            sfenx = prev_sfenx
            stat_move = move
            
            # 先手の手は反転して保存（常に手番側視点で統計を取る）
            if is_sente_turn:
                sfenx = flip_sfenx(sfenx)
                stat_move = flip_move(move)
            
            win = False
            lose = False
            if winner_is_sente is not None:
                win = is_sente_turn == winner_is_sente
                lose = not win
            
            statistics_records.append(MoveStatisticsRecord(
                sfenx=sfenx,
                move=stat_move,
                win=win,
                lose=lose,
                timeout=False,
            ))
    
    if not statistics_records:
        print(f"  スキップ: 統計データがありません")
        return False
    
    # 統計データをバルクインサート
    stats_data = [
        {
            "sfenx": r.sfenx,
            "move": r.move,
            "win": r.win,
            "lose": r.lose,
            "timeout": r.timeout,
            "user_id": user_id,
        }
        for r in statistics_records
    ]
    
    client.table("shogi_moves_statistics").insert(stats_data).execute()
    
    # ゲームレコードを挿入
    game_record = {
        "game_hash": game_hash,
        "start_time": metadata.start_time,
        "end_time": metadata.end_time,
        "black_player": metadata.black_player,
        "white_player": metadata.white_player,
        "event": metadata.event,
        "handicap": metadata.handicap,
        "result": metadata.result,
        "move_count": len(statistics_records),
        "recorded_at": datetime.now().isoformat(),
        "user_id": user_id,
    }
    
    client.table("game_records").insert(game_record).execute()
    
    print(f"  アップロード完了: {len(statistics_records)}手")
    return True
