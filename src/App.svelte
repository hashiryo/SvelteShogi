<script lang="ts">
  import { onMount } from "svelte";
  import { initializeAuth } from "@/handler/auth";
  import { AppStatusStore } from "@/store/app-status.svelte";
  import AuthPage from "@/pages/AuthPage.svelte";
  import MainPage from "@/pages/MainPage.svelte";
  import LoadingSpinner from "@/pages/LoadingSpinner.svelte";

  let status = $derived(AppStatusStore.get());

  // 初期化処理を onMount で実行
  onMount(async () => {
    await initializeAuth();
  });
</script>

<main>
  {#if status === "LOADING"}
    <LoadingSpinner />
  {:else if status === "UNAUTHENTICATED"}
    <AuthPage />
  {:else if status === "AUTHENTICATED"}
    <MainPage />
  {/if}
</main>

<style>
  main {
    width: 100%;
    min-height: 100vh;
  }

  :global(.favorite-moves-section) {
    margin-bottom: 8px;
  }
</style>
