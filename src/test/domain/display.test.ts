import { describe, it, expect, expectTypeOf } from "vitest";
import type { PlayerPiece } from "@/types/shogi";
import {
  getDisplayMoveFromGrid,
  getDisplayMoveFromMoveStr,
} from "@/domain/display";

describe("getDisplayMoveFromGrid", () => {
  // https://www.shogi.or.jp/faq/kihuhyouki.html
  describe("到達地点に複数の同じ駒が動ける場合、「上」または「寄」または「引」を記入します", () => {
    it("A", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[1 * 9 + 6] = { piece: "金", isSente: true };
      grid[2 * 9 + 8] = { piece: "金", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 2, col: 8 },
          { row: 1, col: 7 },
          null
        )
      ).toBe("☗８二金上");

      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 1, col: 6 },
          { row: 1, col: 7 },
          null
        )
      ).toBe("☗８二金寄");
    });

    it("A-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[7 * 9 + 2] = { piece: "金", isSente: false };
      grid[6 * 9 + 0] = { piece: "金", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 6, col: 0 },
          { row: 7, col: 1 },
          null
        )
      ).toBe("☖２八金上");

      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 7, col: 2 },
          { row: 7, col: 1 },
          null
        )
      ).toBe("☖２八金寄");
    });

    it("B", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[0 * 9 + 2] = { piece: "金", isSente: true };
      grid[2 * 9 + 3] = { piece: "金", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 2, col: 3 },
          { row: 1, col: 2 },
          null
        )
      ).toBe("☗３二金上");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 2 },
          { row: 1, col: 2 },
          null
        )
      ).toBe("☗３二金引");
    });

    it("B-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[8 * 9 + 6] = { piece: "金", isSente: false };
      grid[6 * 9 + 5] = { piece: "金", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 6, col: 5 },
          { row: 7, col: 6 },
          null
        )
      ).toBe("☖７八金上");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 6 },
          { row: 7, col: 6 },
          null
        )
      ).toBe("☖７八金引");
    });

    it("C", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[4 * 9 + 3] = { piece: "金", isSente: true };
      grid[5 * 9 + 4] = { piece: "金", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 5, col: 4 },
          { row: 4, col: 4 },
          null
        )
      ).toBe("☗５五金上");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 4, col: 3 },
          { row: 4, col: 4 },
          null
        )
      ).toBe("☗５五金寄");
    });

    it("C-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[4 * 9 + 5] = { piece: "金", isSente: false };
      grid[3 * 9 + 4] = { piece: "金", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 3, col: 4 },
          { row: 4, col: 4 },
          null
        )
      ).toBe("☖５五金上");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 4, col: 5 },
          { row: 4, col: 4 },
          null
        )
      ).toBe("☖５五金寄");
    });

    it("D", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[6 * 9 + 6] = { piece: "銀", isSente: true };
      grid[8 * 9 + 7] = { piece: "銀", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 7 },
          { row: 7, col: 7 },
          null
        )
      ).toBe("☗８八銀上");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 6, col: 6 },
          { row: 7, col: 7 },
          null
        )
      ).toBe("☗８八銀引");
    });

    it("D-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[2 * 9 + 2] = { piece: "銀", isSente: false };
      grid[0 * 9 + 1] = { piece: "銀", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 1 },
          { row: 1, col: 1 },
          null
        )
      ).toBe("☖２二銀上");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 2, col: 2 },
          { row: 1, col: 1 },
          null
        )
      ).toBe("☖２二銀引");
    });

    it("E", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[6 * 9 + 1] = { piece: "銀", isSente: true };
      grid[8 * 9 + 3] = { piece: "銀", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 3 },
          { row: 7, col: 2 },
          null
        )
      ).toBe("☗３八銀上");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 6, col: 1 },
          { row: 7, col: 2 },
          null
        )
      ).toBe("☗３八銀引");
    });

    it("E-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[2 * 9 + 7] = { piece: "銀", isSente: false };
      grid[0 * 9 + 5] = { piece: "銀", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 5 },
          { row: 1, col: 6 },
          null
        )
      ).toBe("☖７二銀上");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 2, col: 7 },
          { row: 1, col: 6 },
          null
        )
      ).toBe("☖７二銀引");
    });
  });

  describe("到達地点に2枚の同じ駒が動ける場合、動作でどの駒が動いたかわからない時は、「左」「右」を記入します。", () => {
    it("Ａ･･･同じ駒で上がる駒が2枚ある場合「上」を省略して「左」「右」を記入します", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[1 * 9 + 6] = { piece: "金", isSente: true };
      grid[1 * 9 + 8] = { piece: "金", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 1, col: 8 },
          { row: 0, col: 7 },
          null
        )
      ).toBe("☗８一金左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 1, col: 6 },
          { row: 0, col: 7 },
          null
        )
      ).toBe("☗８一金右");
    });

    it("Ａ-後手･･･同じ駒で上がる駒が2枚ある場合「上」を省略して「左」「右」を記入します", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[7 * 9 + 2] = { piece: "金", isSente: false };
      grid[7 * 9 + 0] = { piece: "金", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 7, col: 0 },
          { row: 8, col: 1 },
          null
        )
      ).toBe("☖２九金左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 7, col: 2 },
          { row: 8, col: 1 },
          null
        )
      ).toBe("☖２九金右");
    });

    it("Ｂ･･･同じ駒で寄る駒が2枚ある場合「寄」を省略して「左」「右」を記入します。", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[1 * 9 + 0] = { piece: "金", isSente: true };
      grid[1 * 9 + 2] = { piece: "金", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 1, col: 2 },
          { row: 1, col: 1 },
          null
        )
      ).toBe("☗２二金左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 1, col: 0 },
          { row: 1, col: 1 },
          null
        )
      ).toBe("☗２二金右");
    });

    it("Ｂ-後手･･･同じ駒で寄る駒が2枚ある場合「寄」を省略して「左」「右」を記入します。", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[7 * 9 + 8] = { piece: "金", isSente: false };
      grid[7 * 9 + 6] = { piece: "金", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 7, col: 6 },
          { row: 7, col: 7 },
          null
        )
      ).toBe("☖８八金左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 7, col: 8 },
          { row: 7, col: 7 },
          null
        )
      ).toBe("☖８八金右");
    });

    it("Ｃ･･･同じ駒で引く駒が2枚ある場合「引」を省略して「左」「右」を記入します。", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[4 * 9 + 3] = { piece: "銀", isSente: true };
      grid[4 * 9 + 5] = { piece: "銀", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 4, col: 5 },
          { row: 5, col: 4 },
          null
        )
      ).toBe("☗５六銀左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 4, col: 3 },
          { row: 5, col: 4 },
          null
        )
      ).toBe("☗５六銀右");
    });

    it("Ｃ-後手･･･同じ駒で引く駒が2枚ある場合「引」を省略して「左」「右」を記入します。", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[4 * 9 + 5] = { piece: "銀", isSente: false };
      grid[4 * 9 + 3] = { piece: "銀", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 4, col: 3 },
          { row: 3, col: 4 },
          null
        )
      ).toBe("☖５四銀左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 4, col: 5 },
          { row: 3, col: 4 },
          null
        )
      ).toBe("☖５四銀右");
    });

    it("Ｄ･･･例外で、金銀が横に2枚以上並んでいる場合のみ1段上に上がる時「直」を記入します。", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[8 * 9 + 6] = { piece: "金", isSente: true };
      grid[8 * 9 + 7] = { piece: "金", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 7 },
          { row: 7, col: 6 },
          null
        )
      ).toBe("☗７八金左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 6 },
          { row: 7, col: 6 },
          null
        )
      ).toBe("☗７八金直");
    });

    it("Ｄ-後手･･･例外で、金銀が横に2枚以上並んでいる場合のみ1段上に上がる時「直」を記入します。", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[0 * 9 + 2] = { piece: "金", isSente: false };
      grid[0 * 9 + 1] = { piece: "金", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 1 },
          { row: 1, col: 2 },
          null
        )
      ).toBe("☖３二金左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 2 },
          { row: 1, col: 2 },
          null
        )
      ).toBe("☖３二金直");
    });

    it("E", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[8 * 9 + 1] = { piece: "銀", isSente: true };
      grid[8 * 9 + 2] = { piece: "銀", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 2 },
          { row: 7, col: 2 },
          null
        )
      ).toBe("☗３八銀直");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 1 },
          { row: 7, col: 2 },
          null
        )
      ).toBe("☗３八銀右");
    });

    it("E-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[0 * 9 + 7] = { piece: "銀", isSente: false };
      grid[0 * 9 + 6] = { piece: "銀", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 6 },
          { row: 1, col: 6 },
          null
        )
      ).toBe("☖７二銀直");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 7 },
          { row: 1, col: 6 },
          null
        )
      ).toBe("☖７二銀右");
    });
  });

  describe("到達地点に3枚以上の同じ駒が動ける場合、動作でどの駒が動いたかわからない時は以下のように記入します。", () => {
    it("A", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[2 * 9 + 3] = { piece: "金", isSente: true };
      grid[2 * 9 + 4] = { piece: "金", isSente: true };
      grid[2 * 9 + 5] = { piece: "金", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 2, col: 5 },
          { row: 1, col: 4 },
          null
        )
      ).toBe("☗５二金左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 2, col: 4 },
          { row: 1, col: 4 },
          null
        )
      ).toBe("☗５二金直");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 2, col: 3 },
          { row: 1, col: 4 },
          null
        )
      ).toBe("☗５二金右");
    });

    it("A-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[6 * 9 + 5] = { piece: "金", isSente: false };
      grid[6 * 9 + 4] = { piece: "金", isSente: false };
      grid[6 * 9 + 3] = { piece: "金", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 6, col: 3 },
          { row: 7, col: 4 },
          null
        )
      ).toBe("☖５八金左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 6, col: 4 },
          { row: 7, col: 4 },
          null
        )
      ).toBe("☖５八金直");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 6, col: 5 },
          { row: 7, col: 4 },
          null
        )
      ).toBe("☖５八金右");
    });

    it("B", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[6 * 9 + 7] = { piece: "と", isSente: true };
      grid[7 * 9 + 8] = { piece: "と", isSente: true };
      grid[8 * 9 + 6] = { piece: "と", isSente: true };
      grid[8 * 9 + 7] = { piece: "と", isSente: true };
      grid[8 * 9 + 8] = { piece: "と", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 6 },
          { row: 7, col: 7 },
          null
        )
      ).toBe("☗８八と右");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 7 },
          { row: 7, col: 7 },
          null
        )
      ).toBe("☗８八と直");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 8 },
          { row: 7, col: 7 },
          null
        )
      ).toBe("☗８八と左上");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 7, col: 8 },
          { row: 7, col: 7 },
          null
        )
      ).toBe("☗８八と寄");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 6, col: 7 },
          { row: 7, col: 7 },
          null
        )
      ).toBe("☗８八と引");
    });

    it("B-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[2 * 9 + 1] = { piece: "と", isSente: false };
      grid[1 * 9 + 0] = { piece: "と", isSente: false };
      grid[0 * 9 + 2] = { piece: "と", isSente: false };
      grid[0 * 9 + 1] = { piece: "と", isSente: false };
      grid[0 * 9 + 0] = { piece: "と", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 2 },
          { row: 1, col: 1 },
          null
        )
      ).toBe("☖２二と右");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 1 },
          { row: 1, col: 1 },
          null
        )
      ).toBe("☖２二と直");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 0 },
          { row: 1, col: 1 },
          null
        )
      ).toBe("☖２二と左上");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 1, col: 0 },
          { row: 1, col: 1 },
          null
        )
      ).toBe("☖２二と寄");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 2, col: 1 },
          { row: 1, col: 1 },
          null
        )
      ).toBe("☖２二と引");
    });

    it("C", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[6 * 9 + 0] = { piece: "銀", isSente: true };
      grid[6 * 9 + 2] = { piece: "銀", isSente: true };
      grid[8 * 9 + 1] = { piece: "銀", isSente: true };
      grid[8 * 9 + 2] = { piece: "銀", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 1 },
          { row: 7, col: 1 },
          null
        )
      ).toBe("☗２八銀直");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 6, col: 0 },
          { row: 7, col: 1 },
          null
        )
      ).toBe("☗２八銀右");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 2 },
          { row: 7, col: 1 },
          null
        )
      ).toBe("☗２八銀左上");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 6, col: 2 },
          { row: 7, col: 1 },
          null
        )
      ).toBe("☗２八銀左引");
    });

    it("C-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[2 * 9 + 8] = { piece: "銀", isSente: false };
      grid[2 * 9 + 6] = { piece: "銀", isSente: false };
      grid[0 * 9 + 7] = { piece: "銀", isSente: false };
      grid[0 * 9 + 6] = { piece: "銀", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 7 },
          { row: 1, col: 7 },
          null
        )
      ).toBe("☖８二銀直");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 2, col: 8 },
          { row: 1, col: 7 },
          null
        )
      ).toBe("☖８二銀右");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 6 },
          { row: 1, col: 7 },
          null
        )
      ).toBe("☖８二銀左上");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 2, col: 6 },
          { row: 1, col: 7 },
          null
        )
      ).toBe("☖８二銀左引");
    });
  });

  describe("竜が2枚の場合はやはり動作を優先します。ただし、「直」は使わずに「左」「右」で記入します。", () => {
    it("A", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[0 * 9 + 8] = { piece: "竜", isSente: true };
      grid[3 * 9 + 7] = { piece: "竜", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 8 },
          { row: 1, col: 7 },
          null
        )
      ).toBe("☗８二竜引");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 3, col: 7 },
          { row: 1, col: 7 },
          null
        )
      ).toBe("☗８二竜上");
    });

    it("A-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[8 * 9 + 0] = { piece: "竜", isSente: false };
      grid[5 * 9 + 1] = { piece: "竜", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 0 },
          { row: 7, col: 1 },
          null
        )
      ).toBe("☖２八竜引");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 5, col: 1 },
          { row: 7, col: 1 },
          null
        )
      ).toBe("☖２八竜上");
    });

    it("B", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[1 * 9 + 4] = { piece: "竜", isSente: true };
      grid[2 * 9 + 1] = { piece: "竜", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 2, col: 1 },
          { row: 2, col: 3 },
          null
        )
      ).toBe("☗４三竜寄");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 1, col: 4 },
          { row: 2, col: 3 },
          null
        )
      ).toBe("☗４三竜引");
    });

    it("B-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[7 * 9 + 4] = { piece: "竜", isSente: false };
      grid[6 * 9 + 7] = { piece: "竜", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 6, col: 7 },
          { row: 6, col: 5 },
          null
        )
      ).toBe("☖６七竜寄");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 7, col: 4 },
          { row: 6, col: 5 },
          null
        )
      ).toBe("☖６七竜引");
    });

    it("C", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[4 * 9 + 0] = { piece: "竜", isSente: true };
      grid[4 * 9 + 4] = { piece: "竜", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 4, col: 4 },
          { row: 4, col: 2 },
          null
        )
      ).toBe("☗３五竜左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 4, col: 0 },
          { row: 4, col: 2 },
          null
        )
      ).toBe("☗３五竜右");
    });

    it("C-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[4 * 9 + 8] = { piece: "竜", isSente: false };
      grid[4 * 9 + 4] = { piece: "竜", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 4, col: 4 },
          { row: 4, col: 6 },
          null
        )
      ).toBe("☖７五竜左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 4, col: 8 },
          { row: 4, col: 6 },
          null
        )
      ).toBe("☖７五竜右");
    });

    it("D", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[8 * 9 + 7] = { piece: "竜", isSente: true };
      grid[8 * 9 + 8] = { piece: "竜", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 8 },
          { row: 7, col: 7 },
          null
        )
      ).toBe("☗８八竜左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 7 },
          { row: 7, col: 7 },
          null
        )
      ).toBe("☗８八竜右");
    });

    it("D-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[0 * 9 + 1] = { piece: "竜", isSente: false };
      grid[0 * 9 + 0] = { piece: "竜", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 0 },
          { row: 1, col: 1 },
          null
        )
      ).toBe("☖２二竜左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 1 },
          { row: 1, col: 1 },
          null
        )
      ).toBe("☖２二竜右");
    });

    it("E", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[7 * 9 + 1] = { piece: "竜", isSente: true };
      grid[8 * 9 + 0] = { piece: "竜", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 7, col: 1 },
          { row: 6, col: 0 },
          null
        )
      ).toBe("☗１七竜左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 0 },
          { row: 6, col: 0 },
          null
        )
      ).toBe("☗１七竜右");
    });

    it("E-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[1 * 9 + 7] = { piece: "竜", isSente: false };
      grid[0 * 9 + 8] = { piece: "竜", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 1, col: 7 },
          { row: 2, col: 8 },
          null
        )
      ).toBe("☖９三竜左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 8 },
          { row: 2, col: 8 },
          null
        )
      ).toBe("☖９三竜右");
    });
  });

  describe("馬が2枚の場合もやはり動作を優先します。竜と同様、「直」は使わずに「左」「右」で記入します。", () => {
    it("A", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[0 * 9 + 7] = { piece: "馬", isSente: true };
      grid[0 * 9 + 8] = { piece: "馬", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 8 },
          { row: 1, col: 7 },
          null
        )
      ).toBe("☗８二馬左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 7 },
          { row: 1, col: 7 },
          null
        )
      ).toBe("☗８二馬右");
    });

    it("A-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[8 * 9 + 1] = { piece: "馬", isSente: false };
      grid[8 * 9 + 0] = { piece: "馬", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 0 },
          { row: 7, col: 1 },
          null
        )
      ).toBe("☖２八馬左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 1 },
          { row: 7, col: 1 },
          null
        )
      ).toBe("☖２八馬右");
    });

    it("B", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[2 * 9 + 5] = { piece: "馬", isSente: true };
      grid[4 * 9 + 8] = { piece: "馬", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 4, col: 8 },
          { row: 4, col: 7 },
          null
        )
      ).toBe("☗８五馬寄");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 2, col: 5 },
          { row: 4, col: 7 },
          null
        )
      ).toBe("☗８五馬引");
    });

    it("B-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[6 * 9 + 3] = { piece: "馬", isSente: false };
      grid[4 * 9 + 0] = { piece: "馬", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 4, col: 0 },
          { row: 4, col: 1 },
          null
        )
      ).toBe("☖２五馬寄");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 6, col: 3 },
          { row: 4, col: 1 },
          null
        )
      ).toBe("☖２五馬引");
    });

    it("C", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[0 * 9 + 0] = { piece: "馬", isSente: true };
      grid[3 * 9 + 2] = { piece: "馬", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 0 },
          { row: 1, col: 0 },
          null
        )
      ).toBe("☗１二馬引");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 3, col: 2 },
          { row: 1, col: 0 },
          null
        )
      ).toBe("☗１二馬上");
    });

    it("C-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[8 * 9 + 8] = { piece: "馬", isSente: false };
      grid[5 * 9 + 6] = { piece: "馬", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 8 },
          { row: 7, col: 8 },
          null
        )
      ).toBe("☖９八馬引");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 5, col: 6 },
          { row: 7, col: 8 },
          null
        )
      ).toBe("☖９八馬上");
    });

    it("D", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[8 * 9 + 4] = { piece: "馬", isSente: true };
      grid[8 * 9 + 8] = { piece: "馬", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 8 },
          { row: 6, col: 6 },
          null
        )
      ).toBe("☗７七馬左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 8, col: 4 },
          { row: 6, col: 6 },
          null
        )
      ).toBe("☗７七馬右");
    });

    it("D-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[0 * 9 + 4] = { piece: "馬", isSente: false };
      grid[0 * 9 + 0] = { piece: "馬", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 0 },
          { row: 2, col: 2 },
          null
        )
      ).toBe("☖３三馬左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 0, col: 4 },
          { row: 2, col: 2 },
          null
        )
      ).toBe("☖３三馬右");
    });

    it("E", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[6 * 9 + 3] = { piece: "馬", isSente: true };
      grid[7 * 9 + 0] = { piece: "馬", isSente: true };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 6, col: 3 },
          { row: 8, col: 1 },
          null
        )
      ).toBe("☗２九馬左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 7, col: 0 },
          { row: 8, col: 1 },
          null
        )
      ).toBe("☗２九馬右");
    });

    it("E-後手", () => {
      let grid: (PlayerPiece | null)[] = Array(81).fill(null);
      grid[2 * 9 + 5] = { piece: "馬", isSente: false };
      grid[1 * 9 + 8] = { piece: "馬", isSente: false };
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 2, col: 5 },
          { row: 0, col: 7 },
          null
        )
      ).toBe("☖８一馬左");
      expect(
        getDisplayMoveFromGrid(
          grid,
          { row: 1, col: 8 },
          { row: 0, col: 7 },
          null
        )
      ).toBe("☖８一馬右");
    });
  });
});

describe("getDisplayMoveFromMoveStr", () => {
  it("金と玉と成り駒は成・不成はつけない", () => {
    let grid: (PlayerPiece | null)[] = Array(81).fill(null);
    grid[0 * 9 + 0] = { piece: "と", isSente: true };
    grid[0 * 9 + 1] = { piece: "杏", isSente: true };
    grid[0 * 9 + 2] = { piece: "圭", isSente: true };
    grid[0 * 9 + 3] = { piece: "全", isSente: true };
    grid[0 * 9 + 4] = { piece: "金", isSente: true };
    grid[0 * 9 + 5] = { piece: "玉", isSente: true };
    grid[0 * 9 + 6] = { piece: "馬", isSente: true };
    grid[0 * 9 + 7] = { piece: "竜", isSente: true };
    expect(getDisplayMoveFromMoveStr(grid, "1a1b", true, null)).toBe("☗１二と");
    expect(getDisplayMoveFromMoveStr(grid, "2a2b", true, null)).toBe("☗２二杏");
    expect(getDisplayMoveFromMoveStr(grid, "3a3b", true, null)).toBe("☗３二圭");
    expect(getDisplayMoveFromMoveStr(grid, "4a4b", true, null)).toBe("☗４二全");
    expect(getDisplayMoveFromMoveStr(grid, "5a5b", true, null)).toBe("☗５二金");
    expect(getDisplayMoveFromMoveStr(grid, "6a6b", true, null)).toBe("☗６二玉");
    expect(getDisplayMoveFromMoveStr(grid, "7a7b", true, null)).toBe("☗７二馬");
    expect(getDisplayMoveFromMoveStr(grid, "8a8b", true, null)).toBe("☗８二竜");
  });
});
