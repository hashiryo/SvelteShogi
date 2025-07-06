<script lang="ts">
</script>

<div 
  class="piece"
  role="button"
  tabindex="0"
>
  <span class="piece-character">歩</span>
</div>

<style>
  .piece {
    /* スケール変数で全体のサイズを制御 */
    --piece-scale: 1;
    --piece-width: calc(40px * var(--piece-scale));
    --piece-height: calc(48px * var(--piece-scale));
    --font-size: calc(22px * var(--piece-scale));
    
    position: relative;
    width: var(--piece-width);
    height: var(--piece-height);
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
    margin: 2px;
    border: 1px solid red;
  }

  /* 五角形の形状をCSSで作成 */
  .piece::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(145deg, #f5f5dc, #e4c77c);
    clip-path: polygon(50% 0%, 95% 20%, 100% 100%, 0% 100%, 5% 20%);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.5);
  }

  .piece-character {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: var(--font-size);
    font-weight: bold;
    color: #2c1810;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
    font-family: 'MS Mincho', 'Yu Mincho', serif;
    line-height: 1;
    z-index: 1;
    transition: transform 0.2s ease;
  }
</style>