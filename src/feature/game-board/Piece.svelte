<script lang="ts">
  interface PieceProps {
    character?: string;
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    fontSize?: number;
    scale?: number;
    reverse?: boolean;
    isHanded?: boolean;
  }

  let { 
    character = '歩',
    isHanded = false,
    scale = 1,
    reverse = false,
    top = 0,
    left = 0,
    width = 40,
    height = 44,
    fontSize = 30
  }: PieceProps = $props();
  
  function toggleHighlight() {
    isHanded = !isHanded;
  }
</script>

<div class="square"
  style="--square-width: {width}px; --square-height: {height}px; --top: {top}px; --left: {left}px;">
  <div 
    class="piece {reverse ? 'reversed' : ''} {isHanded ? 'handed' : ''}"
    role="button"
    tabindex="0"
    onclick={toggleHighlight}
    onkeydown={(e) => e.key === 'Enter' && toggleHighlight()}
    style="--font-size: {fontSize}px; --piece-scale: {scale}; --piece-rotate: {reverse ? '180deg' : '0deg'}; "
  >
    <span class="piece-character">{character}</span>
  </div>
</div>


<style>
  .square {
    position: absolute;
    width: var(--square-width);
    height: var(--square-height);
    top: var(--top);
    left: var(--left);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
  }

  .piece {
    /* スケール変数で全体のサイズを制御 */
    --piece-width: calc(var(--square-width) * var(--piece-scale));
    --piece-height: calc(var(--square-height) * var(--piece-scale));
    --font-size: calc(var(--font-size) * var(--piece-scale));

    width: var(--piece-width);
    height: var(--piece-height);
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
    z-index: 10; /* ボードの上に表示 */
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
    background: linear-gradient(135deg, #f0e68c, #b88400);
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

  .piece.reversed::before{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f0e68c, #b88400);
    clip-path: polygon(0% 0%, 100% 0%, 95% 80%, 50% 100%, 5% 80%);
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

  .piece.handed::before {
    transform: scale(1.02) translateY(-8px);
    box-shadow: 
      /* 持ち上がった時の大きな影 */
      0 12px 24px rgba(0, 0, 0, 0.4),
      /* さらに広がる薄い影 */
      0 20px 40px rgba(0, 0, 0, 0.2),
      /* 遠い影（地面との距離感） */
      0 30px 60px rgba(0, 0, 0, 0.1),
      /* 光る縁（選択効果） */
      0 0 0 2px rgba(255, 215, 0, 0.6),
      /* 内側のハイライト（より明るく） */
      inset 0 1px 3px rgba(255, 255, 255, 0.8),
      /* 内側の影 */
      inset 0 -1px 2px rgba(0, 0, 0, 0.15);
  }

  .piece-character {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(var(--piece-rotate));
    font-size: var(--font-size);
    font-weight: bold;
    color: #2c1810;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
    font-family: 'MS Mincho', 'Yu Mincho', serif;
    line-height: 1;
    z-index: 1;
    transition: transform 0.2s ease;
  }

  .piece.handed .piece-character {
    transform: translate(-50%, calc(-50% - 8px)) scale(1.02) rotate(var(--piece-rotate));
  }
</style>