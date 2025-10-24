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

export interface Square {
  piece: PieceType;
  isSente: boolean;
}

export type Captures = { piece: PieceType; num: number }[];

interface FavoriteFromSquare {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

interface FavoriteFromCaptured {
  piece: PieceType;
  isSente: boolean;
  endRow: number;
  endCol: number;
}

export type FavoriteFrom = FavoriteFromSquare | FavoriteFromCaptured;

interface StatisticsFromSquare {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  apparentRate: number;
  winRate: number;
}

interface StatisticsFromCaptured {
  piece: PieceType;
  isSente: boolean;
  endRow: number;
  endCol: number;
  apparentRate: number;
  winRate: number;
}

export type StatisticsFrom = StatisticsFromSquare | StatisticsFromCaptured;

export interface HandPieceFrom {
  piece: PieceType;
  isSente: boolean;
  position: { row: number; col: number } | null;
}

// 棋譜履歴のノード
export interface KifuNode {
  display: string; // 表示用の棋譜
  sfenx: string; // SFENのような形式の文字列, 絶対的なもの
  prev: number; // 親のノード
  next: number; // 子のノード
  br_next: number; // 兄弟ノードのうち次のノード
  isSente: boolean; // 手番
  move: string; // 直前の移動文字列（例: "7g7f"） 空文字ならば初期局面
  isFavorite: boolean; // お気に入りの一手かどうか
  isSaved: boolean; // 保存済みかどうか (投了ノード等のみで使う想定)
}

// 集計済み統計データの型
export interface MoveStatistics {
  move: string;
  apparentCount: number;
  winCount: number;
  apparentRate: number;
  winRate: number;
}

// KIF形式のメタデータ
export interface KifMetadata {
  startTime?: string;
  endTime?: string;
  event?: string;
  handicap?: string;
  blackPlayer?: string;
  whitePlayer?: string;
  result?: string;
}
