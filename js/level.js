/**
 * level.js
 * Cadmus: The Scroll Quest
 */

const LEVELS = [
  // === LEVEL 1: THE AGORA ===
  {
    name: 'Level 1: The Agora',
    targetWord: 'PEACE',
    bgType: 'columns',
    bgColor: '#333333',
    platforms: [
      {x:0, y:472, w:1600, h:32, type:'grass'},
      {x:200, y:380, w:120, h:24, type:'stone'},
      {x:450, y:300, w:140, h:24, type:'stone'},
      {x:750, y:220, w:100, h:24, type:'stone'},
      {x:1050, y:380, w:120, h:24, type:'stone'},
      {x:1300, y:300, w:100, h:24, type:'stone'},
    ],
    scrolls: [
      {x:240, y:350, letter:'P'},
      {x:500, y:270, letter:'E'},
      {x:790, y:190, letter:'A'},
      {x:1100, y:350, letter:'C'},
      {x:1330, y:270, letter:'E'},
    ],
    enemies: [
      {type:'SkeletonSoldier', x:350, y:400, patrolMin:200, patrolMax:580},
      {type:'SkeletonSoldier', x:900, y:400, patrolMin:750, patrolMax:1100},
    ],
    playerStart: {x:50, y:400},
  },
  // Level 2-5 would follow similar structure with different bgTypes and decorations
];

function drawLevel(ctx, level, camX) {
  const p = PALETTE;
  
  // 1. Background Layer (Atmospheric)
  ctx.fillStyle = level.bgColor;
  ctx.fillRect(0, 0, 960, 504);
  
  // Decorative Columns / Statues (Parallax-ish)
  if (level.bgType === 'columns') {
    ctx.fillStyle = '#222222';
    for (let i = 0; i < 2000; i += 300) {
      const x = i - camX * 0.5;
      ctx.fillRect(x, 0, 40, 504);
      ctx.fillStyle = '#111111';
      ctx.fillRect(x + 10, 0, 20, 504);
      ctx.fillStyle = '#222222';
    }
  }

  // 2. Platforms
  for (const plat of level.platforms) {
    const px = plat.x - camX;
    if (px + plat.w < 0 || px > 960) continue;
    const py = plat.y - 36;

    // Platform Body
    ctx.fillStyle = plat.type === 'grass' ? p.primary : p.mid;
    ctx.fillRect(px, py, plat.w, plat.h);

    // Outline / Detail
    ctx.strokeStyle = p.bg;
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, plat.w, plat.h);

    // Decorative "Stone" lines
    ctx.beginPath();
    for (let i = 32; i < plat.w; i += 32) {
      ctx.moveTo(px + i, py);
      ctx.lineTo(px + i, py + plat.h);
    }
    ctx.stroke();
    
    // Top highlight
    ctx.fillStyle = p.text;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(px, py, plat.w, 4);
    ctx.globalAlpha = 1.0;
  }

  // 3. Scrolls
  ctx.fillStyle = p.text;
  ctx.strokeStyle = p.primary;
  for (const sc of level.scrolls) {
    if (sc.collected) continue;
    const sx = sc.x - camX, sy = sc.y - 36;
    if (sx < -20 || sx > 980) continue;
    
    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = p.primary;
    ctx.fillRect(sx - 8, sy - 12, 16, 24);
    ctx.strokeRect(sx - 8, sy - 12, 16, 24);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = p.bg;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(sc.letter, sx, sy + 6);
  }
}

function createEnemies(levelDef) {
  const arr = [];
  for (const e of levelDef.enemies) {
    if (e.type === 'SkeletonSoldier') arr.push(new SkeletonSoldier(e.x, e.y, e.patrolMin, e.patrolMax));
    else if (e.type === 'Harpy') arr.push(new Harpy(e.x, e.y, e.range));
    else if (e.type === 'StoneGolem') arr.push(new StoneGolem(e.x, e.y, e.patrolMin, e.patrolMax));
  }
  return arr;
}
