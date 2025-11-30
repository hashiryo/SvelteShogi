"""
KIF形式の棋譜ファイルをパースするモジュール
"""
import re
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class KifMetadata:
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    event: Optional[str] = None
    handicap: Optional[str] = None
    black_player: Optional[str] = None
    white_player: Optional[str] = None
    result: Optional[str] = None


def zenkaku_to_number(char: str) -> int:
    mapping = {"１": 1, "２": 2, "３": 3, "４": 4, "５": 5, "６": 6, "７": 7, "８": 8, "９": 9}
    if char not in mapping:
        raise ValueError(f"不正な数字: {char}")
    return mapping[char]


def kanji_to_abc(char: str) -> str:
    mapping = {"一": "a", "二": "b", "三": "c", "四": "d", "五": "e", "六": "f", "七": "g", "八": "h", "九": "i"}
    if char not in mapping:
        raise ValueError(f"不正な文字: {char}")
    return mapping[char]


def piece_kanji_to_alphabet(char: str) -> str:
    mapping = {"歩": "P", "香": "L", "桂": "N", "銀": "S", "角": "B", "飛": "R", "玉": "K", "金": "G"}
    if char not in mapping:
        raise ValueError(f"不正な文字: {char}")
    return mapping[char]


def parse_kif(kif_content: str) -> tuple[KifMetadata, list[str]]:
    """
    KIF形式の文字列をパースする
    
    Returns:
        tuple[KifMetadata, list[str]]: メタデータと指し手のリスト
    """
    lines = [line.strip() for line in kif_content.split("\n")]
    metadata = KifMetadata()
    moves: list[str] = []
    
    is_moves_section = False
    prev_position = ""
    
    for line_index, line in enumerate(lines):
        if not line:
            continue
        
        try:
            # メタデータの解析
            if line.startswith("開始日時："):
                metadata.start_time = line.replace("開始日時：", "")
            elif line.startswith("終了日時："):
                metadata.end_time = line.replace("終了日時：", "")
            elif line.startswith("棋戦："):
                metadata.event = line.replace("棋戦：", "")
            elif line.startswith("手合割："):
                metadata.handicap = line.replace("手合割：", "")
            elif line.startswith("先手："):
                metadata.black_player = line.replace("先手：", "")
            elif line.startswith("後手："):
                metadata.white_player = line.replace("後手：", "")
            elif "手数----指手---------" in line:
                is_moves_section = True
                continue
            
            # 指し手の解析
            if is_moves_section:
                # コメント行をスキップ
                if line.startswith("*"):
                    continue
                
                if "まで" in line and "手で" in line:
                    metadata.result = line
                    break
                
                # 特別な手（投了など）のチェック
                special_match = re.match(r"^(\d+)\s+(投了|中断|持将棋|千日手|切れ負け|反則負け|詰み)", line)
                if special_match:
                    display = special_match.group(2).strip()
                    special_moves = {
                        "投了": "resign",
                        "中断": "interrupt",
                        "持将棋": "repetition",
                        "千日手": "sennichite",
                        "切れ負け": "timeout",
                        "反則負け": "foul",
                        "詰み": "resign",  # 詰みは投了と同一視
                    }
                    if display in special_moves:
                        moves.append(special_moves[display])
                else:
                    display = ""
                    # 時間付きパターン
                    move_match = re.match(r"^(\d+)\s+(.+?)\s+\(\s*(.+?)\s*\)", line)
                    if move_match:
                        display = move_match.group(2).strip()
                    else:
                        # 時間なしパターン
                        simple_match = re.match(r"^(\d+)\s+(.+?)(?:\s+|$)", line)
                        if simple_match:
                            display = simple_match.group(2).strip()
                    
                    if display:
                        # 移動先座標を抽出
                        position_match = re.search(r"([１２３４５６７８９])([一二三四五六七八九])|同(　?)", display)
                        # 駒の種類を抽出
                        piece_match = re.search(r"(玉|飛|龍|竜|角|馬|金|銀|成銀|全|桂|成桂|圭|香|成香|杏|歩|と)", display)
                        # 移動元座標を抽出
                        from_match = re.search(r"\(([1-9])([1-9])\)", display)
                        # 装飾子を抽出
                        decoration_match = re.search(r"(打|成)", display)
                        
                        if not position_match:
                            raise ValueError(f"不正な指し手: {display}")
                        
                        to = ""
                        if position_match.group(1) and position_match.group(2):
                            to_col = position_match.group(1)
                            to_row = position_match.group(2)
                            to = f"{zenkaku_to_number(to_col)}{kanji_to_abc(to_row)}"
                        elif position_match.group(3) is not None:
                            to = prev_position
                        
                        prev_position = to
                        
                        if from_match and position_match:
                            from_col = from_match.group(1)
                            from_row = from_match.group(2)
                            adjust_from_row = chr(96 + int(from_row))
                            from_pos = f"{from_col}{adjust_from_row}"
                            move = f"{from_pos}{to}"
                            if decoration_match and decoration_match.group(1) == "成":
                                move += "+"
                            moves.append(move)
                        elif decoration_match and decoration_match.group(1) == "打" and piece_match:
                            move = f"{piece_kanji_to_alphabet(piece_match.group(1))}*{to}"
                            moves.append(move)
                        else:
                            raise ValueError(f"不正な指し手: {display}")
        
        except Exception as e:
            raise ValueError(f"棋譜パースエラー (行 {line_index + 1}): {e}\n問題の行: \"{line}\"")
    
    return metadata, moves
