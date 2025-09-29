<script>
  import { ReverseStore } from "@/store/game-board.svelte";
  let reverse = $derived(ReverseStore.get());
</script>

<button
  class="reverse-btn {reverse ? 'reverse' : ''}"
  aria-label="reverse"
  onclick={() => {
    ReverseStore.set(!reverse);
  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99zM9 3L5 6.99h3V14h2V6.99h3z"
      stroke-width="1.1"
      stroke="currentColor"
    />
  </svg>
</button>

<style>
  .reverse-btn {
    background-color: #cccccc;
    color: #555555;
    width: 10%;
    text-align: center;
    align-items: flex-end;
  }

  .reverse-btn.reverse {
    background-color: rgb(2, 162, 109);
    color: white;
  }
</style>
