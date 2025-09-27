# 導入

<cite>
**このドキュメントで参照されるファイル**   
- [package.json](file://package.json#L1-L27)
- [vite.config.ts](file://vite.config.ts#L1-L9)
- [svelte.config.js](file://svelte.config.js#L1-L8)
- [tsconfig.json](file://tsconfig.json#L1-L8)
- [tsconfig.app.json](file://tsconfig.app.json#L1-L31)
- [vitest.config.ts](file://vitest.config.ts#L1-L12)
- [main.ts](file://src/main.ts#L1-L10)
- [README.md](file://README.md#L1-L48)
- [mise.toml](file://mise.toml#L1-L3) - *miseによるNode.jsバージョン管理の導入*
- [supabase/config.toml](file://supabase/config.toml#L1-L128) - *Supabaseのローカル開発環境設定*
</cite>

## 目次
1. [前提条件](#前提条件)
2. [依存関係のインストール](#依存関係のインストール)
3. [開発サーバーの起動](#開発サーバーの起動)
4. [本番ビルドの作成](#本番ビルドの作成)
5. [構成ファイルの概要](#構成ファイルの概要)
6. [Vitestによるテストの実行](#vitestによるテストの実行)
7. [セットアップの確認](#セットアップの確認)

## 前提条件

SvelteShogiの開発環境を構築する前に、以下の要件を満たしていることを確認してください。

- **Node.js**: バージョン24以上が推奨されます。`mise`によるバージョン管理が導入されているため、開発者は`mise`を使用して正確なバージョンを自動的に設定できます。
- **npmまたはyarn**: どちらのパッケージマネージャーも使用可能です。このガイドでは`npm`コマンドを使用しますが、同等の`yarn`コマンドも有効です。
- **TypeScriptの基礎知識**: コードベースはTypeScriptで記述されているため、TSの構文や型の概念に慣れ親しんでいると、開発やデバッグが容易になります。

これらの前提条件は、現代のSvelteおよびViteアプリケーションにとって標準的であり、本プロジェクトで使用されるツールとの互換性を保証します。

**セクションのソース**
- [README.md](file://README.md#L1-L48)
- [package.json](file://package.json#L1-L27)
- [mise.toml](file://mise.toml#L1-L3) - *miseによるNode.jsバージョン管理の導入*

## 依存関係のインストール

必要なすべての依存関係をインストールするには、プロジェクトのルートディレクトリに移動して以下のコマンドを実行します。

```bash
npm install
```

このコマンドは`package.json`ファイルを読み取り、`devDependencies`にリストされているすべての依存関係をインストールします。これには以下が含まれます：
- **Svelte** (v5.34.7): コアコンポーネントフレームワーク。
- **Vite** (v6.0.0): ビルドツールおよび開発サーバー。
- **@sveltejs/vite-plugin-svelte**: SvelteとViteの統合。
- **TypeScript** (~5.8.3): 型チェックおよびコンパイル。
- **Vitest**: ユニットテスト。
- **svelte-check**: Svelte固有の型チェック。
- **supabase**: ローカル開発用のSupabase CLI。

インストールには`vite-tsconfig-paths`（パスエイリアスのサポート）と`happy-dom`（テスト環境）も含まれます。

インストールが完了すると、`node_modules`ディレクトリが作成され、すべてのツールが使用可能になります。

**セクションのソース**
- [package.json](file://package.json#L1-L27)
- [supabase/config.toml](file://supabase/config.toml#L1-L128) - *Supabaseのローカル開発環境設定*

## 開発サーバーの起動

依存関係のインストール後、以下のコマンドで開発サーバーを起動します。

```bash
npm run dev
```

このコマンドは`package.json`で定義された`vite`スクリプトを実行します。Viteは以下の処理を行います：
- ローカル開発サーバーを起動。
- 高速な更新を可能にするホットモジュールリプレースメント（HMR）を有効化。
- 既定で`http://localhost:5173`でアプリケーションを提供。

ブラウザで指定されたアドレスにアクセスできます。ソースファイル（`.ts`、`.svelte`）に加えた変更は、即座にリロードをトリガーし、開発速度とフィードバックを向上させます。

**セクションのソース**
- [package.json](file://package.json#L7-L8)
- [vite.config.ts](file://vite.config.ts#L1-L9)

## 本番ビルドの作成

本番環境向けのビルドを作成するには、以下のコマンドを実行します。

```bash
npm run build
```

このコマンドは`vite build`を呼び出し、以下の処理を行います：
- すべてのアセット（JavaScript、CSS、Svelteコンポーネント）をコンパイルおよび最適化。
- 静的ファイルを`dist/`ディレクトリに出力。
- コードを最小化し、開発専用の構成を削除。
- `tsconfig.app.json`で定義されたパスエイリアスを解決。

生成された`dist`フォルダは、Netlify、Vercel、GitHub Pagesなどの任意の静的ホスティングサービスにデプロイできます。

ローカルで本番ビルドをプレビューするには、以下のコマンドを使用します。

```bash
npm run preview
```

これは`dist/`コンテンツを提供するローカルサーバーを起動し、本番環境の動作をシミュレートします。

**セクションのソース**
- [package.json](file://package.json#L9-L10)
- [vite.config.ts](file://vite.config.ts#L1-L9)

## 構成ファイルの概要

### package.json

このファイルはプロジェクトのメタデータ、依存関係、スクリプトを定義しています：
- **スクリプト**:
  - `dev`: Vite開発サーバーを起動。
  - `build`: 本番ビルドを作成。
  - `preview`: 本番ビルドを提供。
  - `check`: `svelte-check`と`tsc`で型チェックを実行。
  - `test`: ワッチモードでVitestを起動。
  - `test:run`: ワッチモードなしでテストを1回実行。
- **devDependencies**: すべての開発ツールとフレームワークをリスト。

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "check": "svelte-check --tsconfig ./tsconfig.app.json && tsc -p tsconfig.node.json",
  "test": "vitest",
  "test:run": "vitest run"
}
```

**セクションのソース**
- [package.json](file://package.json#L1-L27)

### vite.config.ts

Svelte統合およびパス解決のためのViteの構成：

```ts
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [svelte(), tsconfigPaths()],
})
```

主な機能：
- **svelte()**: SvelteのコンパイルとHMRを有効化。
- **tsconfigPaths()**: `@/store/*` → `src/store/*`などのパスエイリアスをサポート。

この構成により、適切なモジュール解決が保証され、開発が円滑になります。

**セクションのソース**
- [vite.config.ts](file://vite.config.ts#L1-L9)

### svelte.config.js

Svelteコンパイラのオプションを提供：

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
}
```

- **vitePreprocess()**: 標準のSvelteプリプロセッシング（例：`<style>`および`<script>`ブロックの処理）を有効化し、Viteと互換性を持たせます。

このファイルにより、Svelteコンポーネントが開発およびビルド中に正しくコンパイルされることを保証します。

**セクションのソース**
- [svelte.config.js](file://svelte.config.js#L1-L8)

### tsconfig.jsonおよびtsconfig.app.json

#### tsconfig.json
他のTS構成を参照するソリューションレベルの構成として機能：

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

この構成により、アプリケーションとNode.jsツールの構成が分離されます。

#### tsconfig.app.json
SvelteアプリケーションのためのTypeScriptを構成：

```json
{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "allowJs": true,
    "checkJs": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/types/*": ["src/types/*"],
      "@/store/*": ["src/store/*"],
      "@/domain/*": ["src/domain/*"],
      "@/handler/*": ["src/handler/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.js", "src/**/*.svelte"]
}
```

主な設定：
- **extends**: Svelte固有のTypeScriptデフォルトを継承。
- **paths**: クリーンなインポートのためのインポートエイリアスを有効化（例：`import GameStore from '@/store/play-game.svelte'`）。
- **allowJs/checkJs**: `.svelte`ファイル内のJavaScriptの型チェックを可能に。
- **include**: 関連するすべてのファイルがコンパイルに含まれることを保証。

**セクションのソース**
- [tsconfig.json](file://tsconfig.json#L1-L8)
- [tsconfig.app.json](file://tsconfig.app.json#L1-L31)

## Vitestによるテストの実行

プロジェクトでは**Vitest**がテストランナーとして使用されています。ワッチモードでテストを実行するには：

```bash
npm run test
```

これは`vitest`を実行し、以下の処理を行います：
- `src/test/**/*.{test,spec}.{js,ts}`に一致するテストファイルをスキャン。
- シミュレートされたブラウザ環境として`happy-dom`を使用。
- テスト結果をリアルタイムでフィードバック。

CI/CDでの一時的なテスト実行には、以下のコマンドを使用します。

```bash
npm run test:run
```

`vitest.config.ts`ファイルはテスト環境を構成しています：

```ts
export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST }), tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    include: ['src/test/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist']
  }
})
```

- **environment: 'happy-dom'**: 実際のブラウザなしでDOM操作をテスト可能に。
- **include/exclude**: テストファイルのパターンを定義し、関係のないディレクトリを除外。

例として、`src/test/setup.test.ts`（存在する場合）は検出され、実行されます。

**セクションのソース**
- [package.json](file://package.json#L13-L14)
- [vitest.config.ts](file://vitest.config.ts#L1-L12)

## セットアップの確認

開発環境が正しく構成されていることを確認するには：

1. `npm run dev`を実行し、ブラウザで`http://localhost:5173`を開きます。
2. SvelteShogiアプリケーションのインターフェースが表示されるはずです。
3. Svelteコンポーネント（例：`App.svelte`）に小さな変更を加え、ページが自動的に更新されることを確認します。
4. `npm run build`を実行し、最適化されたアセットで`dist/`フォルダが作成されることを確認します。
5. `npm run test`を実行し、エラーなしにテストが実行されることを確認します。

すべての手順が成功すれば、開発環境は完全に機能しています。

**セクションのソース**
- [main.ts](file://src/main.ts#L1-L10)
- [README.md](file://README.md#L1-L48)
- [package.json](file://package.json#L7-L10)