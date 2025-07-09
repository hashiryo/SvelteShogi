export type PieceType = "歩" | "香" | "桂" | "銀" | "金" | "角" | "飛" | "玉" | "と" | "杏" | "圭" | "全"  | "馬" | "龍";

export type PieceOnBoard = {
  piece: PieceType; // 駒の種類
  is_sente: boolean; // true for 先手, false for 後手
  row: number; // 盤上の行番号 (0-8)
  col: number; // 盤上の列番号 (0-8)
};