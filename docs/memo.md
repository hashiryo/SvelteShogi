ディレクトリのメモ
* types: 型 (.d.ts)
* store: ストア (.svelte.ts)
  * typesに依存
* domain: ドメイン (.ts)
  * typesに依存
* handler: ハンドラ (.ts)
  * types,store,domainに依存
* components: UIコンポーネント (.svelte)
  * types,store,domain,handlerに依存
* pages: ページ (.svelte)
  * types,store,domain,handler,componentsに依存