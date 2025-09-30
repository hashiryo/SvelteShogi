import { describe, it, expect } from "vitest";
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
1 ７六歩(77)   ( 0:00/00:00:00)
2 ３四歩(33)   ( 0:01/00:00:01)
3 ２二角成(88)   ( 0:03/00:00:20)
4 同銀(31)   ( 0:01/00:00:04)
5 ４五角打   ( 0:04/00:00:24)
6 投了   ( 0:05/00:10:15)
まで5手で先手の勝ち`;
    const { metadata, moves } = parseKif(text);
    expect(metadata).toEqual({
      endTime: "2025/06/08 14:14:59",
      event: "R対局 早指し2(猶予1分)",
      handicap: "平手",
      result: "まで5手で先手の勝ち",
      blackPlayer: "hashiryo1(1598)",
      whitePlayer: "hashiryo2(1552)",
    });
    expect(moves).toEqual(["7g7f", "3c3d", "8h2b+", "3a2b", "B*4e", "resign"]);
  });
});
