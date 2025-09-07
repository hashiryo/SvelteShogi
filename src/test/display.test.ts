import { describe, it, expect } from "vitest";
import {
  KANJI_NUM,
  ZENKAKU_NUM,
  getDisplayMoveFromCaptured,
} from "@/domain/display";

describe("Display Functions", () => {
  describe("Constants", () => {
    it("should have correct KANJI_NUM array", () => {
      expect(KANJI_NUM).toHaveLength(9);
      expect(KANJI_NUM[0]).toBe("一");
      expect(KANJI_NUM[8]).toBe("九");
    });

    it("should have correct ZENKAKU_NUM array", () => {
      expect(ZENKAKU_NUM).toHaveLength(9);
      expect(ZENKAKU_NUM[0]).toBe("１");
      expect(ZENKAKU_NUM[8]).toBe("９");
    });
  });

  describe("getDisplayMoveFromCaptured", () => {
    it("should create correct display for captured piece move", () => {
      // Create empty 9x9 grid
      const grid = Array(81).fill(null);

      // Test placing a captured piece
      const result = getDisplayMoveFromCaptured(grid, 4, 4, "歩", true);

      // Should show sente symbol, position (５五), piece type (歩)
      expect(result).toContain("☗");
      expect(result).toContain("５");
      expect(result).toContain("五");
      expect(result).toContain("歩");
    });

    it("should handle gote (white) piece correctly", () => {
      const grid = Array(81).fill(null);

      const result = getDisplayMoveFromCaptured(grid, 0, 0, "金", false);

      // Should show gote symbol
      expect(result).toContain("☖");
      expect(result).toContain("１");
      expect(result).toContain("一");
      expect(result).toContain("金");
    });
  });
});
