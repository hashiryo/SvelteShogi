<script lang="ts">
  let {
    startX = 0,
    startY = 0,
    endX = 0,
    endY = 0,
  } = $props();

  const width = 20; // 矢印の太さ
  let length = $derived(Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2));
  let angle = $derived(Math.atan2(endY - startY, endX - startX) * (180 / Math.PI));
  let marker = $derived(100 - 30 * 100 / length);
  $inspect({ startX, startY, endX, endY, length, angle, marker });  
</script>

<div 
  class="arrow"
  style="width: {length}px;
         height: {width}px;
         left: {startX}px;
         top: {startY - width / 2}px; /* 矢印の中心を合わせるために半分引く */
         clip-path: polygon(0 0, {marker}% 0, 100% 50%, {marker}% 100%, 0 100%);
         transform: rotate({angle}deg);
         "
>
</div>

<style>
.arrow {
  position: absolute;
  transform-origin: left center;
  /* より金ピカなグラデーション */
  background: linear-gradient(135deg, 
    #FFD700 0%, 
    #FFEF94 25%, 
    #FFD700 50%, 
    #FF8C00 75%, 
    #FFD700 100%);
  /* 光沢効果を追加 */
  box-shadow: 
    0 0 10px rgba(255, 215, 0, 0.6),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  z-index: 20;
  /* アニメーション効果 */
  animation: shine 2s infinite;
}

/* 光る効果のアニメーション */
@keyframes shine {
  0%, 100% { 
    filter: brightness(1) saturate(1); 
  }
  50% { 
    filter: brightness(1.3) saturate(1.5); 
  }
}
</style>