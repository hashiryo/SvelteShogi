import type { PieceType } from "@/types/shogi";

function getGoldMoveVec(): { r: number; c: number; slide: boolean }[] {
  return [
    { r: 1, c: 0, slide: false }, // 下
    { r: 0, c: 1, slide: false }, // 右
    { r: 0, c: -1, slide: false }, // 左
    { r: -1, c: 0, slide: false }, // 上
    { r: -1, c: 1, slide: false }, // 右上
    { r: -1, c: -1, slide: false }, // 左上
  ];
}

// 先手目線
export function getPieceMoveVec(
  piece: PieceType
): { r: number; c: number; slide: boolean }[] {
  switch (piece) {
    case "歩":
      return [{ r: -1, c: 0, slide: false }];
    case "香":
      return [{ r: -1, c: 0, slide: true }];
    case "桂":
      return [
        { r: -2, c: 1, slide: false },
        { r: -2, c: -1, slide: false },
      ];
    case "銀":
      return [
        { r: -1, c: 0, slide: false }, // 上
        { r: -1, c: 1, slide: false }, // 右
        { r: -1, c: -1, slide: false }, // 左
        { r: 1, c: 1, slide: false }, // 右下
        { r: 1, c: -1, slide: false }, // 左下
      ];
    case "玉":
      return [
        { r: -1, c: 0, slide: false }, // 上
        { r: 0, c: 1, slide: false }, // 右
        { r: 0, c: -1, slide: false }, // 左
        { r: 1, c: 0, slide: false }, // 下
        { r: -1, c: 1, slide: false }, // 右上
        { r: -1, c: -1, slide: false }, // 左上
        { r: 1, c: 1, slide: false }, // 右下
        { r: 1, c: -1, slide: false }, // 左下
      ];
    case "角":
      return [
        { r: 1, c: 1, slide: true },
        { r: 1, c: -1, slide: true },
        { r: -1, c: 1, slide: true },
        { r: -1, c: -1, slide: true },
      ];
    case "飛":
      return [
        { r: 1, c: 0, slide: true },
        { r: 0, c: 1, slide: true },
        { r: 0, c: -1, slide: true },
        { r: -1, c: 0, slide: true },
      ];
    case "馬":
      return [
        { r: 1, c: 1, slide: true },
        { r: 1, c: -1, slide: true },
        { r: -1, c: 1, slide: true },
        { r: -1, c: -1, slide: true },
        { r: -1, c: 0, slide: false }, // 上
        { r: 0, c: 1, slide: false }, // 右
        { r: 0, c: -1, slide: false }, // 左
        { r: 1, c: 0, slide: false }, // 下
      ];
    case "竜":
      return [
        { r: 1, c: 0, slide: true },
        { r: 0, c: 1, slide: true },
        { r: 0, c: -1, slide: true },
        { r: -1, c: 0, slide: true },
        { r: -1, c: 1, slide: false }, // 右上
        { r: -1, c: -1, slide: false }, // 左上
        { r: 1, c: 1, slide: false }, // 右下
        { r: 1, c: -1, slide: false }, // 左下
      ];
    default: // 金、と、杏、圭、全
      return getGoldMoveVec();
  }
}

export function promotePiece(piece: PieceType): PieceType {
  switch (piece) {
    case "歩":
      return "と";
    case "香":
      return "杏";
    case "桂":
      return "圭";
    case "銀":
      return "全";
    case "角":
      return "馬";
    case "飛":
      return "竜";
    default:
      return piece; // 金、玉はプロモートしない
  }
}

export function originalPiece(piece: PieceType): PieceType {
  switch (piece) {
    case "と":
      return "歩";
    case "杏":
      return "香";
    case "圭":
      return "桂";
    case "全":
      return "銀";
    case "馬":
      return "角";
    case "竜":
      return "飛";
    default:
      return piece; // 金、玉は元の駒
  }
}
