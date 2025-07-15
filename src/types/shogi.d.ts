export type PieceType = "歩" | "香" | "桂" | "銀" | "金" | "角" | "飛" | "玉" | "と" | "杏" | "圭" | "全"  | "馬" | "龍";

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
  position: {row: number, col: number} | null;
}