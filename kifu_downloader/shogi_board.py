"""
将棋盤の状態管理とSFENX形式への変換を行うモジュール
"""
from dataclasses import dataclass
from typing import Optional


@dataclass
class PlayerPiece:
    piece: str  # P, L, N, S, G, B, R, K, T, V, U, M, H, D
    is_sente: bool


@dataclass
class Captures:
    pawn: int = 0
    lance: int = 0
    knight: int = 0
    silver: int = 0
    gold: int = 0
    bishop: int = 0
    rook: int = 0


PIECE_TYPE_TO_CHAR = {
    "歩": "P", "香": "L", "桂": "N", "銀": "S", "金": "G",
    "角": "B", "飛": "R", "玉": "K",
    "と": "T", "杏": "V", "圭": "U", "全": "M", "馬": "H", "竜": "D",
}

CHAR_TO_PIECE_TYPE = {v: k for k, v in PIECE_TYPE_TO_CHAR.items()}

# 成り駒への変換
PROMOTE_MAP = {"P": "T", "L": "V", "N": "U", "S": "M", "B": "H", "R": "D"}

# 成り駒から元の駒への変換
UNPROMOTE_MAP = {v: k for k, v in PROMOTE_MAP.items()}


def get_initial_grid() -> list[Optional[PlayerPiece]]:
    """平手の初期配置を返す"""
    grid: list[Optional[PlayerPiece]] = [None] * 81
    
    # 後手の駒（上側）
    # 1段目
    grid[0] = PlayerPiece("L", False)
    grid[1] = PlayerPiece("N", False)
    grid[2] = PlayerPiece("S", False)
    grid[3] = PlayerPiece("G", False)
    grid[4] = PlayerPiece("K", False)
    grid[5] = PlayerPiece("G", False)
    grid[6] = PlayerPiece("S", False)
    grid[7] = PlayerPiece("N", False)
    grid[8] = PlayerPiece("L", False)
    # 2段目
    grid[10] = PlayerPiece("R", False)
    grid[16] = PlayerPiece("B", False)
    # 3段目
    for c in range(9):
        grid[18 + c] = PlayerPiece("P", False)
    
    # 先手の駒（下側）
    # 7段目
    for c in range(9):
        grid[54 + c] = PlayerPiece("P", True)
    # 8段目
    grid[61] = PlayerPiece("B", True)
    grid[67] = PlayerPiece("R", True)
    # 9段目
    grid[72] = PlayerPiece("L", True)
    grid[73] = PlayerPiece("N", True)
    grid[74] = PlayerPiece("S", True)
    grid[75] = PlayerPiece("G", True)
    grid[76] = PlayerPiece("K", True)
    grid[77] = PlayerPiece("G", True)
    grid[78] = PlayerPiece("S", True)
    grid[79] = PlayerPiece("N", True)
    grid[80] = PlayerPiece("L", True)
    
    return grid


def grid_to_str(grid: list[Optional[PlayerPiece]]) -> str:
    """盤面をSFENX形式の文字列に変換"""
    result = ""
    for y in range(9):
        empty_count = 0
        for x in range(9):
            square = grid[x + y * 9]
            if square:
                if empty_count > 0:
                    result += str(empty_count)
                    empty_count = 0
                char = square.piece
                result += char if square.is_sente else char.lower()
            else:
                empty_count += 1
        if empty_count > 0:
            result += str(empty_count)
    return result


def captures_to_str(captures: Captures) -> str:
    """持ち駒をSFENX形式の文字列に変換"""
    nums = [ord("a")] * 4
    nums[0] += captures.pawn
    nums[1] += captures.lance + captures.knight * 5
    nums[2] += captures.silver + captures.gold * 5
    nums[3] += captures.bishop + captures.rook * 5
    return "".join(chr(n) for n in nums)


def board_to_sfenx(grid: list[Optional[PlayerPiece]], cap_sente: Captures, cap_gote: Captures) -> str:
    """盤面と持ち駒をSFENX形式に変換"""
    grid_str = grid_to_str(grid)
    cap_str = captures_to_str(cap_sente) + captures_to_str(cap_gote)
    return f"{grid_str} {cap_str}"


def flip_sfenx(sfenx: str) -> str:
    """SFENX形式の盤面を反転（後手視点に変換）"""
    import re
    match = re.match(r"^([a-zA-Z0-9]*) ([a-z]{8})$", sfenx)
    if not match:
        raise ValueError(f"Invalid sfenx: {sfenx}")
    
    grid, cap = match.groups()
    
    # 盤面を反転
    new_grid = ""
    for ch in reversed(grid):
        if ch.islower():
            new_grid += ch.upper()
        elif ch.isupper():
            new_grid += ch.lower()
        else:
            new_grid += ch
    
    # 持ち駒を入れ替え
    new_cap = cap[4:] + cap[:4]
    
    return f"{new_grid} {new_cap}"


def flip_move(move: str) -> str:
    """指し手を反転（後手視点に変換）"""
    if move in ("resign", "timeout", "interrupt", "repetition", "sennichite", "foul"):
        return move
    
    import re
    
    def transform_letter(ch: str) -> str:
        return chr(ord("i") - (ord(ch) - ord("a")))
    
    # 盤上の移動
    match1 = re.match(r"^(\d)([a-i])(\d)([a-i])(\+)?$", move)
    if match1:
        d1, l1, d2, l2, plus = match1.groups()
        new_d1 = str(10 - int(d1))
        new_d2 = str(10 - int(d2))
        new_l1 = transform_letter(l1)
        new_l2 = transform_letter(l2)
        return new_d1 + new_l1 + new_d2 + new_l2 + (plus or "")
    
    # 駒打ち
    match2 = re.match(r"^([A-Z])\*(\d)([a-i])$", move)
    if match2:
        upper, d, l = match2.groups()
        new_d = str(10 - int(d))
        new_l = transform_letter(l)
        return upper + "*" + new_d + new_l
    
    raise ValueError(f"入力形式が不正です: {move}")


class ShogiBoard:
    """将棋盤の状態を管理するクラス"""
    
    def __init__(self):
        self.grid = get_initial_grid()
        self.cap_sente = Captures()
        self.cap_gote = Captures()
        self.is_sente_turn = True
    
    def get_sfenx(self) -> str:
        return board_to_sfenx(self.grid, self.cap_sente, self.cap_gote)
    
    def apply_move(self, move: str) -> None:
        """指し手を適用して盤面を更新"""
        import re
        
        # 特殊な手はスキップ
        if move in ("resign", "timeout", "interrupt", "repetition", "sennichite", "foul"):
            self.is_sente_turn = not self.is_sente_turn
            return
        
        # 駒打ち
        drop_match = re.match(r"^([A-Z])\*(\d)([a-i])$", move)
        if drop_match:
            piece, col_str, row_str = drop_match.groups()
            col = int(col_str) - 1
            row = ord(row_str) - ord("a")
            index = row * 9 + col
            
            self.grid[index] = PlayerPiece(piece, self.is_sente_turn)
            
            # 持ち駒から減らす
            cap = self.cap_sente if self.is_sente_turn else self.cap_gote
            if piece == "P":
                cap.pawn -= 1
            elif piece == "L":
                cap.lance -= 1
            elif piece == "N":
                cap.knight -= 1
            elif piece == "S":
                cap.silver -= 1
            elif piece == "G":
                cap.gold -= 1
            elif piece == "B":
                cap.bishop -= 1
            elif piece == "R":
                cap.rook -= 1
            
            self.is_sente_turn = not self.is_sente_turn
            return
        
        # 盤上の移動
        move_match = re.match(r"^(\d)([a-i])(\d)([a-i])(\+)?$", move)
        if move_match:
            from_col_str, from_row_str, to_col_str, to_row_str, promote = move_match.groups()
            from_col = int(from_col_str) - 1
            from_row = ord(from_row_str) - ord("a")
            to_col = int(to_col_str) - 1
            to_row = ord(to_row_str) - ord("a")
            
            from_index = from_row * 9 + from_col
            to_index = to_row * 9 + to_col
            
            moving_piece = self.grid[from_index]
            if not moving_piece:
                raise ValueError(f"移動元に駒がありません: {move}")
            
            # 駒を取る場合
            captured = self.grid[to_index]
            if captured:
                # 成り駒は元に戻す
                piece = captured.piece
                if piece in UNPROMOTE_MAP:
                    piece = UNPROMOTE_MAP[piece]
                
                cap = self.cap_sente if self.is_sente_turn else self.cap_gote
                if piece == "P":
                    cap.pawn += 1
                elif piece == "L":
                    cap.lance += 1
                elif piece == "N":
                    cap.knight += 1
                elif piece == "S":
                    cap.silver += 1
                elif piece == "G":
                    cap.gold += 1
                elif piece == "B":
                    cap.bishop += 1
                elif piece == "R":
                    cap.rook += 1
            
            # 駒を移動
            piece = moving_piece.piece
            if promote == "+":
                piece = PROMOTE_MAP.get(piece, piece)
            
            self.grid[from_index] = None
            self.grid[to_index] = PlayerPiece(piece, self.is_sente_turn)
            
            self.is_sente_turn = not self.is_sente_turn
            return
        
        raise ValueError(f"不正な指し手形式: {move}")
