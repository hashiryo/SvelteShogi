<script lang="ts">
  let files: FileList | undefined = $state();

  $effect(() => {
    if (files) {
      // Note that `files` is of type `FileList`, not an Array:
      // https://developer.mozilla.org/en-US/docs/Web/API/FileList
      console.log(files);

      for (const file of files) {
        console.log(`${file.name}: ${file.size} bytes`);
      }
    }
  });
</script>

<div>
  棋譜のimport
  <input accept=".kif" bind:files type="file" />
</div>
