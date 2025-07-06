<script lang="ts">
  let isHanded = $state(false);
  
  function toggleHighlight() {
    isHanded = !isHanded;
  }
</script>

<div 
  class="piece {isHanded ? 'highlighted' : ''}"
  role="button"
  tabindex="0"
  onclick={toggleHighlight}
  onkeydown={(e) => e.key === 'Enter' && toggleHighlight()}
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
      /* メインの影 */
      0 2px 4px rgba(0, 0, 0, 0.3),
      /* より柔らかい外側の影 */
      0 4px 12px rgba(0, 0, 0, 0.15),
      /* 内側のハイライト */
      inset 0 1px 2px rgba(255, 255, 255, 0.5),
      /* 内側の微細な影 */
      inset 0 -1px 1px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .piece.highlighted::before {
    transform: scale(1.05);
    box-shadow: 
      /* メインの影（ホバー時は強く） */
      0 4px 8px rgba(0, 0, 0, 0.4),
      /* より大きな外側の影 */
      0 8px 20px rgba(0, 0, 0, 0.2),
      /* 光る効果 */
      0 0 0 1px rgba(255, 215, 0, 0.3),
      /* 内側のハイライト */
      inset 0 1px 2px rgba(255, 255, 255, 0.6),
      /* 内側の影 */
      inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  }

  .piece-character,
  .piece.highlighted .piece-character {
    transform: translate(-50%, -50%) scale(1.05);
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