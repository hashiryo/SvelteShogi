<script lang="ts">
  let {
    startX = 0,
    startY = 0,
    endX = 0,
    endY = 0,
    color = { r: 0, g: 0, b: 255 }, // RGB color
    width = 30,
    info = ''
  } = $props();

  let length = $derived(Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2));
  let angle = $derived(Math.atan2(endY - startY, endX - startX) * (180 / Math.PI));
  let marker = $derived(100 - width * 70 / length);
</script>

<div 
  class="arrow"
  style="width: {length}px;
         height: {width}px;
         background: {`rgba(${color.r}, ${color.g}, ${color.b}, 1)`};
         left: {startX}px;
         top: {startY - width / 2}px; /* 矢印の中心を合わせるために半分引く */
         clip-path: polygon(0 0, {marker}% 0, 100% 50%, {marker}% 100%, 0 100%);
         transform: rotate({angle}deg);
         "
></div>

{#if info}
<div 
  class="info-text"
  style="left: {endX + 10}px;
         top: {endY - 10}px;
         color: {`rgba(${color.r}, ${color.g}, ${color.b}, 1)`};"
>
  {info}
</div>
{/if}

<style>
.arrow {
  position: absolute;
  transform-origin: left center;
  opacity: 0.8;
}

.info-text {
  position: absolute;
  font-size: 14px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  z-index: 10;
}
</style>