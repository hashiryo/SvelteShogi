<script lang="ts">
  import { parseKif, readFileAsText } from "@/domain/format-parcer";

  let files: FileList | undefined | null = $state();
  let isLoading = $state(false);
  let error = $state<string | null>(null);

  async function handleFileImport(file: File) {
    isLoading = true;
    error = null;

    try {
      console.log(`ファイル読み込み開始: ${file.name} (${file.size} bytes)`);

      // ファイルをテキストとして読み込み
      const content = await readFileAsText(file);
      console.log("ファイル内容:", content);

      // KIF形式をパース
      const result = parseKif(content);
      console.log("パース結果:", result);
      console.log("メタデータ:", result.metadata);
      console.log("指し手:", result.moves);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "不明なエラーが発生しました";
      error = errorMessage;
      console.error("ファイル処理エラー:", err);
    } finally {
      isLoading = false;
      files = null;
    }
  }

  $effect(() => {
    if (files && files.length > 0) {
      // 最初のファイルを処理
      const file = files[0];
      handleFileImport(file);
    }
  });
</script>

<div>
  <h3>棋譜のimport</h3>

  <input accept=".kif" bind:files type="file" />

  {#if isLoading}
    <p>ファイルを処理中...</p>
  {/if}

  {#if error}
    <p style="color: red;">エラー: {error}</p>
  {/if}

  {#if files && files.length > 0}
    <p>選択されたファイル: {files[0].name}</p>
  {/if}
</div>
