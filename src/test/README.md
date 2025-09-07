# テスト環境について

このプロジェクトでは Vitest を使用してテストを実行しています。

## 利用可能なコマンド

```bash
# テストをウォッチモードで実行
npm test

# テストを一度だけ実行
npm run test:run
```

## テストファイルの配置

テストファイルは `src/test/` ディレクトリに配置してください。

- ファイル名は `*.test.ts` または `*.spec.ts` にしてください
- TypeScript を使用できます
- `@/` エイリアスを使って src ディレクトリをインポートできます

## 設定

- **テスト環境**: happy-dom (DOM 環境をシミュレート)
- **設定ファイル**: `vitest.config.ts`
- **対象ファイル**: `src/test/**/*.{test,spec}.{js,ts}`

## 例

```typescript
import { describe, it, expect } from "vitest";
import { KANJI_NUM } from "@/domain/display";

describe("Display Functions", () => {
  it("should have correct constants", () => {
    expect(KANJI_NUM).toHaveLength(9);
    expect(KANJI_NUM[0]).toBe("一");
  });
});
```
