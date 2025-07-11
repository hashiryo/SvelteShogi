<script lang="ts">
  let {
    startX = 0,
    startY = 0,
    endX = 0,
    endY = 0,
    color = { r: 0, g: 0, b: 255 }, // RGB color
    width = 30,
  } = $props();

  const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
  const marker = 100 - 30 * 100 / length;
  console.log(`Arrow: startX=${startX}, startY=${startY}, endX=${endX}, endY=${endY}, length=${length}, angle=${angle}`);
</script>

<div 
  class="arrow"
  style="width: {length}px;
         height: {width}px;
         background: {`rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`};
         left: {startX}px;
         top: {startY - width / 2}px; /* 矢印の中心を合わせるために半分引く */
         clip-path: polygon(0 0, {marker}% 0, 100% 50%, {marker}% 100%, 0 100%);
         transform: rotate({angle}deg);
         "
></div>

<style>
.arrow {
  position: absolute;
  transform-origin: left center;
  z-index: 20;
}
</style>