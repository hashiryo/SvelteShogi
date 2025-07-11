<script lang="ts">
  let {
    winningRate = 0.5,
    appearanceRate = 0.5,
    strokeLength = 100,
    maxWidth = 50,
  } = $props();

  function getStrokeColor(v: number) {
    let r = 0, g = 0, b = 0;
    if (v < 0.5) {
      const t = v / 0.5;
      r = 0;
      g = Math.round(255 * t);
      b = Math.round(255 * (1 - t));
    } else {
      const t = (v - 0.5) / 0.5;
      r = Math.round(255 * t);
      g = Math.round(255 * (1 - t));
      b = 0;
    }
    return `rgba(${r}, ${g}, ${b}, 0.8)`;
  }
</script>

<div class="arrow"
     style="background:{getStrokeColor(winningRate)};
            width: {strokeLength}px;
            height: {appearanceRate * maxWidth}px;"
></div>

<style>
.arrow {
  display: inline-block;
  clip-path: polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%);
}
</style>