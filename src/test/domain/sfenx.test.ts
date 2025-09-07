import { describe, it, expect } from "vitest";
import { sfenxToShogiPosition, shogiPositionToSfenx } from "@/domain/sfenx";

describe("sfenxToShogiPosition", () => {
  it("空の場合", () => {
    const sfenx = "999999999 aaaaaaaa";
    const { grid, capturedSente, capturedGote } = sfenxToShogiPosition(sfenx);
    expect(grid).toEqual(Array(81).fill(null));
    expect(capturedSente).toEqual([]);
    expect(capturedGote).toEqual([]);
  });

  it("すべての持ち駒を持った場合", () => {
    const sfenx = "999999999 syymaaaa";
    const { grid, capturedSente, capturedGote } = sfenxToShogiPosition(sfenx);
    expect(grid).toEqual(Array(81).fill(null));
    expect(capturedSente).toEqual([
      { piece: "歩", num: 18 },
      { piece: "香", num: 4 },
      { piece: "桂", num: 4 },
      { piece: "銀", num: 4 },
      { piece: "金", num: 4 },
      { piece: "角", num: 2 },
      { piece: "飛", num: 2 },
    ]);
    expect(capturedGote).toEqual([]);
  });

  it("盤面がすべて先手の歩の場合", () => {
    const sfenx =
      "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP aaaaaaaa";
    const { grid, capturedSente, capturedGote } = sfenxToShogiPosition(sfenx);
    expect(grid).toEqual(Array(81).fill({ piece: "歩", isSente: true }));
    expect(capturedSente).toEqual([]);
    expect(capturedGote).toEqual([]);
  });

  it("盤面がすべて後手の歩の場合", () => {
    const sfenx =
      "ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp aaaaaaaa";
    const { grid, capturedSente, capturedGote } = sfenxToShogiPosition(sfenx);
    expect(grid).toEqual(Array(81).fill({ piece: "歩", isSente: false }));
    expect(capturedSente).toEqual([]);
    expect(capturedGote).toEqual([]);
  });
});

describe("shogiPositionToSfenx", () => {
  it("空の場合", () => {
    expect(shogiPositionToSfenx(Array(81).fill(null), [], [])).toEqual(
      "999999999 aaaaaaaa"
    );
  });

  it("すべての持ち駒を持った場合", () => {
    expect(
      shogiPositionToSfenx(
        Array(81).fill(null),
        [
          { piece: "歩", num: 18 },
          { piece: "香", num: 4 },
          { piece: "桂", num: 4 },
          { piece: "銀", num: 4 },
          { piece: "金", num: 4 },
          { piece: "角", num: 2 },
          { piece: "飛", num: 2 },
        ],
        []
      )
    ).toEqual("999999999 syymaaaa");
  });

  it("盤面がすべて先手の歩の場合", () => {
    expect(
      shogiPositionToSfenx(
        Array(81).fill({ piece: "歩", isSente: true }),
        [],
        []
      )
    ).toEqual(
      "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP aaaaaaaa"
    );
  });

  it("盤面がすべて後手の歩の場合", () => {
    expect(
      shogiPositionToSfenx(
        Array(81).fill({ piece: "歩", isSente: false }),
        [],
        []
      )
    ).toEqual(
      "ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp aaaaaaaa"
    );
  });
});
