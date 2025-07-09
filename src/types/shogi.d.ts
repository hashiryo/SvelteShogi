type Piece = "歩" | "香" | "桂" | "銀" | "金" | "角" | "飛" | "玉" | "と" | "杏" | "圭" | "全"  | "馬" | "龍";

type PieceWithPlayer = {
  piece: Piece;
  is_sente: boolean; // true for 先手, false for 後手
};
