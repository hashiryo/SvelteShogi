<script lang="ts">
  import StatisticsArrow from './StatisticsArrow.svelte';

  let {
    relativeSquarePositions = [] as { x: number, y: number }[],
  }
  = $props();

  let arrows = [
    {
      id: 0,
      startRow: 8,
      startCol: 0,
      endRow: 0,
      endCol: 0,
      color: { r: 0, g: 0, b: 255 },
      width: 30
    },
    {
      id: 1,
      startRow: 5,
      startCol: 0,
      endRow: 5,
      endCol: 8,
      color: { r: 255, g: 0, b: 0 },
      width: 30
    },
    {
      id: 2,
      startRow: 4,
      startCol: 4,
      endRow: 8,
      endCol: 8,
      color: { r: 255, g: 255, b: 255 },
      width: 15
    }
  ];

  // 表示中の矢印を管理
  let displayedArrows: {
    arrow: typeof arrows[0];
    opacity: number;
    startTime: number;
    displayDuration: number;
  }[] = $state([]);

  // width に基づく重み計算
  function getArrowWeights() {
    return arrows.map(arrow => arrow.width);
  }

  // 重み付きランダム選択
  function selectRandomArrow() {
    const weights = getArrowWeights();
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < arrows.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return arrows[i];
      }
    }
    return arrows[arrows.length - 1]; // フォールバック
  }

  // 表示時間を width に基づいて計算（基本2秒 + width比例）
  function getDisplayDuration(width: number) {
    const baseTime = 2000; // 2秒
    const widthFactor = 100; // width 1px につき 100ms
    return baseTime + (width * widthFactor);
  }

  // 新しい矢印を追加
  function addNewArrow() {
    // 既に2本表示されている場合は何もしない
    if (displayedArrows.length >= 2) return;
    
    // 現在表示中の矢印と同じものは選ばない
    const displayedIds = displayedArrows.map(item => item.arrow.id);
    const availableArrows = arrows.filter(arrow => !displayedIds.includes(arrow.id));
    
    if (availableArrows.length === 0) return;
    
    // 利用可能な矢印から重み付きランダム選択
    const weights = availableArrows.map(arrow => arrow.width);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    let selectedArrow = availableArrows[0];
    for (let i = 0; i < availableArrows.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedArrow = availableArrows[i];
        break;
      }
    }
    
    const displayDuration = getDisplayDuration(selectedArrow.width);
    
    displayedArrows.push({
      arrow: selectedArrow,
      opacity: 0,
      startTime: Date.now(),
      displayDuration
    });
  }

  // 矢印の透明度と表示状態を更新
  function updateArrows() {
    const currentTime = Date.now();
    const fadeTime = 500; // フェードイン・アウト時間（0.5秒）
    
    displayedArrows = displayedArrows.filter(item => {
      const elapsed = currentTime - item.startTime;
      
      if (elapsed < fadeTime) {
        // フェードイン
        item.opacity = elapsed / fadeTime;
        return true;
      } else if (elapsed < item.displayDuration - fadeTime) {
        // 完全表示
        item.opacity = 1.0;
        return true;
      } else if (elapsed < item.displayDuration) {
        // フェードアウト
        item.opacity = (item.displayDuration - elapsed) / fadeTime;
        return true;
      } else {
        // 表示終了
        return false;
      }
    });
  }

  // タイマー管理
  $effect(() => {
    // 最初の矢印を即座に表示
    addNewArrow();
    
    // 定期的に新しい矢印を追加（1.5秒間隔）
    const addInterval = setInterval(() => {
      addNewArrow();
    }, 1500);
    
    // 透明度の更新（50ms間隔）
    const updateInterval = setInterval(() => {
      updateArrows();
    }, 50);
    
    return () => {
      clearInterval(addInterval);
      clearInterval(updateInterval);
    };
  });
</script>


<div class="arrows-layer">
  {#each displayedArrows as item}
    {@const arrow = item.arrow}
    {@const startX = relativeSquarePositions[arrow.startRow * 9 + arrow.startCol].x}
    {@const startY = relativeSquarePositions[arrow.startRow * 9 + arrow.startCol].y}
    {@const endX = relativeSquarePositions[arrow.endRow * 9 + arrow.endCol].x}
    {@const endY = relativeSquarePositions[arrow.endRow * 9 + arrow.endCol].y}
    <StatisticsArrow startX={startX} 
            startY={startY} 
            endX={endX} 
            endY={endY}
            color={arrow.color}
            width={arrow.width}
            opacity={item.opacity} />
  {/each}
</div>



<style>

.arrows-layer {
  pointer-events: none; /* 矢印のクリックイベントを無効化 */
  z-index: 1000; /* 矢印のレイヤーを上に */
}
</style>