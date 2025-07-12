export type PieceType = "歩" | "香" | "桂" | "銀" | "金" | "角" | "飛" | "玉" | "と" | "杏" | "圭" | "全"  | "馬" | "龍";

export type PieceOnSquare = {
  piece: PieceType; // 駒の種類
  is_sente: boolean; // true for 先手, false for 後手
  row: number; // 盤上の行番号 (0-8)
  col: number; // 盤上の列番号 (0-8)
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


type HandPieceFromBoard = {
  row: number;
  col: number;
}

type HandPieceFromCaptured = {
  piece: PieceType;
  isSente: boolean;
}

export type HandPieceFrom = HandPieceFromBoard | HandPieceFromCaptured | null;