<script lang="ts">
  let { 
    character = '歩',
    isHanded = false,
    scale = 1,
    reverse = false,
    width = 40,
    height = 44,
    fontSize = 30
  } = $props();
</script>

<div class="square {isHanded ? 'handed' : ''}"
  style="--square-width: {width}px; --square-height: {height}px;">
  <div 
    class="piece {reverse ? 'reversed' : ''}"
    role="button"
    tabindex="0"
    style="--font-size: {fontSize}px; 
           --piece-scale: {scale}; 
           --piece-top: {reverse ? '5%' : '25%'};
           --piece-rotate: {reverse ? '180deg' : '0deg'};"
  >
    <span class="piece-character">{character}</span>
  </div>
</div>


<style>
  .square {
    width: var(--square-width);
    height: var(--square-height);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    transition: all 0.1s ease;
    /* filter: drop-shadow(0 2px 1px rgba(0, 0, 0, 0.7)); */
    /* filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.7)); */
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.7));
    /* filter: drop-shadow(1px 0px 1px rgba(0, 0, 0, 0.7)); */
  }

  .square.handed {
    filter: drop-shadow(4px 8px 3px rgba(0, 0, 0, 0.7));
    transform: scale(1.02) translateY(-8px);
  }

  .piece {
    /* スケール変数で全体のサイズを制御 */
    --piece-width: calc(var(--square-width) * var(--piece-scale));
    --piece-height: calc(var(--square-height) * var(--piece-scale));
    --font-size: calc(var(--font-size) * var(--piece-scale));

    position: relative;
    width: var(--piece-width);
    height: var(--piece-height);
    cursor: pointer;
    user-select: none;
    border: 1px solid transparent; /* 駒の境界線 */
  }

  /* 五角形の形状をCSSで作成 */
  .piece::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background: linear-gradient(135deg, #f0e68c, #b88400); */
    /* background: #ecd25e; */
    /* background: white; */
    /* background: #e4e0a0; */
    background-color: #f7ecb7;
    background-image: url("https://www.transparenttextures.com/patterns/wood-pattern.png");
    /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
    clip-path: polygon(50% 0%, 90% 20%, 100% 100%, 0% 100%, 10% 20%);
  }

  .piece.reversed::before{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background: linear-gradient(135deg, #f0e68c, #b88400); */
    /* background: #ecde5e; */
    /* background: rgb(255, 255, 255); */
    background-color: #f7ecb7;
    background-image: url("https://www.transparenttextures.com/patterns/wood-pattern.png");
    clip-path: polygon(0% 0%, 100% 0%, 90% 80%, 50% 100%, 10% 80%);
  }

  .piece-character {
    position: absolute;
    top: var(--piece-top);
    transform: translate(-50%, 0) rotate(var(--piece-rotate));
    font-size: var(--font-size);
    font-weight: bold;
    color: #2c1810;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
    font-family: 'MS Mincho', 'Yu Mincho', serif;
    line-height: 1;
  }
</style>