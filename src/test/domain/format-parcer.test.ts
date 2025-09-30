import { describe, it, expect } from "vitest";
import type { Square } from "@/types/shogi";
import { parseKif } from "@/domain/format-parcer";

describe("parseKif", () => {
  it("正常系", () => {
    let text = `ファイル内容: 開始日時：2025/06/08 13:46:40
終了日時：2025/06/08 14:14:59
棋戦：R対局 早指し2(猶予1分)
手合割：平手
先手：hashiryo1(1598)
後手：hashiryo2(1552)
手数----指手---------消費時間--
1 ２六歩(27)   ( 0:00/00:00:00)
2 ３四歩(33)   ( 0:01/00:00:01)
3 ２五歩(26)   ( 0:12/00:00:12)
4 ３三角(22)   ( 0:02/00:00:03)
5 ７六歩(77)   ( 0:05/00:00:17)
6 ４二銀(31)   ( 0:00/00:00:03)
7 ３三角成(88)   ( 0:03/00:00:20)
8 ３三銀(42)   ( 0:01/00:00:04)
9 ８八銀(79)   ( 0:04/00:00:24)
10 投了   ( 0:05/00:10:15)
まで9手で先手の勝ち`;
    const { metadata, moves } = parseKif(text);
    expect(metadata).toEqual({
      endTime: "2025/06/08 14:14:59",
      event: "R対局 早指し2(猶予1分)",
      handicap: "平手",
      result: "まで9手で先手の勝ち",
      blackPlayer: "hashiryo1(1598)",
      whitePlayer: "hashiryo2(1552)",
    });
    expect(moves).toEqual([
      "2g2f",
      "3c3d",
      "2f2e",
      "2b3c",
      "7g7f",
      "3a4b",
      "8h3c+",
      "4b3c",
      "7i8h",
      "resign",
    ]);
  });
});
