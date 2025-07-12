import type { PieceType } from "../types/shogi";

function getGoldMoveVec(): {r: number, c: number, slide: boolean}[] {
  return [
    {r: 1, c: 0, slide: false}, // 下
    {r: 0, c: 1, slide: false}, // 右
    {r: 0, c: -1, slide: false}, // 左
    {r: -1, c: 0, slide: false}, // 上
    {r: -1, c: 1, slide: false}, // 右上
    {r: -1, c: -1, slide: false} // 左上
  ];
}

// 先手目線
export function getPieceMoveVec(piece: PieceType): {r: number, c: number, slide: boolean}[] {
  switch (piece) {
    case "歩":
      return [{r: -1, c: 0, slide: false}];
    case "香":
      return [{r: -1, c: 0, slide: true}];
    case "桂":
      return [{r: -2, c: 1, slide: false}, {r: -2, c: -1, slide: false}];
    case "銀":
      return [
        {r: -1, c: 0, slide: false}, // 上
        {r: -1, c: 1, slide: false}, // 右
        {r: -1, c: -1, slide: false}, // 左
        {r: 1, c: 1, slide: false}, // 右下
        {r: 1, c: -1, slide: false} // 左下
      ];
    case "玉":
      return [
        {r: -1, c: 0, slide: false}, // 上
        {r: 0, c: 1, slide: false}, // 右
        {r: 0, c: -1, slide: false}, // 左
        {r: 1, c: 0, slide: false}, // 下
        {r: -1, c: 1, slide: false}, // 右上
        {r: -1, c: -1, slide: false}, // 左上
        {r: 1, c: 1, slide: false}, // 右下
        {r: 1, c: -1, slide: false} // 左下
      ];
    case "角":
      return [
        {r: 1, c: 1, slide: true}, 
        {r: 1, c: -1, slide: true},
        {r: -1, c: 1, slide: true},
        {r: -1, c: -1, slide: true}
      ];
    case "飛":
      return [
        {r: 1, c: 0, slide: true}, 
        {r: 0, c: 1, slide: true}, 
        {r: 0, c: -1, slide: true},
        {r: -1, c: 0, slide: true}
      ];
    case "馬":
      return [
        {r: 1, c: 1, slide: true},
        {r: 1, c: -1, slide: true},
        {r: -1, c: 1, slide: true},
        {r: -1, c: -1, slide: true},
        {r: -1, c: 0, slide: false}, // 上
        {r: 0, c: 1, slide: false}, // 右
        {r: 0, c: -1, slide: false}, // 左
        {r: 1, c: 0, slide: false}, // 下
      ];
    case "龍":
      return [
        {r: 1, c: 0, slide: true},
        {r: 0, c: 1, slide: true},
        {r: 0, c: -1, slide: true},
        {r: -1, c: 0, slide: true},
        {r: -1, c: 1, slide: false}, // 右上
        {r: -1, c: -1, slide: false}, // 左上
        {r: 1, c: 1, slide: false}, // 右下
        {r: 1, c: -1, slide: false} // 左下
      ];
    default: // 金、と、杏、圭、全
      return getGoldMoveVec();
  }
}
