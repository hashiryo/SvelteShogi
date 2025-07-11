<script lang="ts">
  let {
    startX = 0,
    startY = 0,
    endX = 0,
    endY = 0,
  } = $props();

  const width = 15; // 矢印の太さ
  let length = $derived(Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2));
  let angle = $derived(Math.atan2(endY - startY, endX - startX) * (180 / Math.PI));
  let marker = $derived(100 - 30 * 100 / length);
  // $inspect({ startX, startY, endX, endY, length, angle, marker });  
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
  /* より金ピカなグラデーション（透明度を追加） */
  background: linear-gradient(135deg, 
    rgba(255, 215, 0, 1) 0%, 
    rgba(255, 239, 148, 1) 25%, 
    rgba(255, 215, 0, 1) 100%);
  opacity: 0.8; /* 半透明にして光沢感を強調 */
}

</style>