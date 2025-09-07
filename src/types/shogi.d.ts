export type PieceType =
  | "歩"
  | "香"
  | "桂"
  | "銀"
  | "金"
  | "角"
  | "飛"
  | "玉"
  | "と"
  | "杏"
  | "圭"
  | "全"
  | "馬"
  | "竜";

export type Square = {
  piece: PieceType;
  isSente: boolean;
};

type FavoriteFromSquare = {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
};

type FavoriteFromCaptured = {
  piece: PieceType;
  is_sente: boolean;
  endRow: number;
  endCol: number;
};

export type FavoriteFrom = FavoriteFromSquare | FavoriteFromCaptured;

type StatisticsFromSquare = {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  apparentRate: number;
  winRate: number;
};

type StatisticsFromCaptured = {
  piece: PieceType;
  is_sente: boolean;
  endRow: number;
  endCol: number;
  apparentRate: number;
  winRate: number;
};

export type StatisticsFrom = StatisticsFromSquare | StatisticsFromCaptured;

export type HandPieceFrom = {
  piece: PieceType;
  isSente: boolean;
  position: { row: number; col: number } | null;
};

// 棋譜履歴のノード
export interface HistoryNode {
  display: string; // 表示用の棋譜
  sfenx: string; // SFENのような形式の文字列, 絶対的なもの
  prev: number; // 親のノード
  next: number; // 子のノード
  br_next: number; // 兄弟ノードのうち次のノード
  br_prev: number; // 兄弟ノードのうち前のノード
  isSente: boolean; // 手番
  move: string; // 直前の移動文字列（例: "7g7f"） 空文字ならば初期局面
  isFavorite: boolean; // お気に入りの一手かどうか
}
