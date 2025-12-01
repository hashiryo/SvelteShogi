<div class="loading-container">
  <div class="loading-spinner"></div>
  <p>読み込み中...</p>
</div>

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 16px;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--border-color, #e0e0e0);
    border-top-color: var(--success-color, #4caf50);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-container p {
    color: var(--text-color, #333);
    font-size: 14px;
    margin: 0;
  }
</style>
