/**
 * level.js
 * Cadmus: The Scroll Quest
 * ---------------------------------------------------------
 * All 5 level data definitions: name, platforms, scrolls, enemies, target word.
 * Each level scrolls collected from 5 letters to form a 5-letter word.
 * Also includes renderer functions for backgrounds and tiles.
 * ---------------------------------------------------------
 */

const LEVELS = [
  // === LEVEL 1: THE AGORA === (PEACE)
  {
    name: 'Level 1: The Agora',
    targetWord: 'PEACE',
    bgColor: PALETTE.bg,
    platforms: [
      {x:0, y:472, w:960, h:32},      // floor
      {x:200, y:380, w:120, h:16},
      {x:450, y:300, w:140, h:16},
      {x:750, y:220, w:100, h:16},
      {x:1050, y:380, w:120, h:16},
      {x:1300, y:300, w:100, h:16},
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
    playerStart: {x:50, y:420},
  },

  // === LEVEL 2: TEMPLE RUINS === (ARENA)
  {
    name: 'Level 2: Temple Ruins',
    targetWord: 'ARENA',
    bgColor: PALETTE.bg,
    platforms: [
      {x:0, y:472, w:960, h:32},
      {x:100, y:400, w:100, h:16},
      {x:300, y:340, w:80, h:16},
      {x:500, y:280, w:120, h:16},
      {x:750, y:360, w:100, h:16},
      {x:1000, y:300, w:100, h:16},
      {x:1250, y:240, w:120, h:16},
    ],
    scrolls: [
      {x:135, y:370, letter:'A'},
      {x:335, y:310, letter:'R'},
      {x:550, y:250, letter:'E'},
      {x:785, y:330, letter:'N'},
      {x:1285, y:210, letter:'A'},
    ],
    enemies: [
      {type:'Harpy', x:400, y:200, range:200},
      {type:'SkeletonSoldier', x:650, y:400, patrolMin:500, patrolMax:950},
      {type:'Harpy', x:1100, y:180, range:180},
    ],
    playerStart: {x:30, y:420},
  },

  // === LEVEL 3: THE LABYRINTH === (Homer)
  {
    name: 'Level 3: The Labyrinth',
    targetWord: 'HOMER',
    bgColor: PALETTE.bg,
    platforms: [
      {x:0, y:472, w:960, h:32},
      {x:150, y:420, w:80, h:16},
      {x:340, y:360, w:80, h:16},
      {x:520, y:300, w:100, h:16},
      {x:720, y:360, w:100, h:16},
      {x:920, y:300, w:80, h:16},
      {x:1100, y:420, w:100, h:16},
      {x:1300, y:360, w:100, h:16},
    ],
    scrolls: [
      {x:175, y:390, letter:'H'},
      {x:365, y:330, letter:'O'},
      {x:555, y:270, letter:'M'},
      {x:945, y:270, letter:'E'},
      {x:1330, y:330, letter:'R'},
    ],
    enemies: [
      {type:'SkeletonSoldier', x:240, y:400, patrolMin:150, patrolMax:420},
      {type:'StoneGolem', x:650, y:400, patrolMin:520, patrolMax:900},
      {type:'Harpy', x:1000, y:220, range:200},
    ],
    playerStart: {x:50, y:420},
  },

  // === LEVEL 4: THE SUMMIT === (ATLAS)
  {
    name: 'Level 4: The Summit',
    targetWord: 'ATLAS',
    bgColor: PALETTE.bg,
    platforms: [
      {x:0, y:472, w:960, h:32},
      {x:100, y:400, w:100, h:16},
      {x:280, y:340, w:100, h:16},
      {x:460, y:280, w:100, h:16},
      {x:640, y:220, w:120, h:16},
      {x:840, y:280, w:100, h:16},
      {x:1020, y:340, w:100, h:16},
      {x:1200, y:400, w:120, h:16},
    ],
    scrolls: [
      {x:140, y:370, letter:'A'},
      {x:320, y:310, letter:'T'},
      {x:680, y:190, letter:'L'},
      {x:1060, y:310, letter:'A'},
      {x:1240, y:370, letter:'S'},
    ],
    enemies: [
      {type:'Harpy', x:200, y:200, range:160},
      {type:'StoneGolem', x:500, y:200, patrolMin:460, patrolMax:900},
      {type:'Harpy', x:950, y:160, range:200},
      {type:'SkeletonSoldier', x:1100, y:400, patrolMin:1020, patrolMax:1300},
    ],
    playerStart: {x:30, y:420},
  },

  // === LEVEL 5: THE UNDERWORLD === (HADES)
  {
    name: 'Level 5: The Underworld',
    targetWord: 'HADES',
    bgColor: PALETTE.bg,
    platforms: [
      {x:0, y:472, w:960, h:32},
      {x:120, y:420, w:80, h:16},
      {x:300, y:360, w:80, h:16},
      {x:480, y:300, w:100, h:16},
      {x:680, y:240, w:100, h:16},
      {x:880, y:300, w:100, h:16},
      {x:1080, y:360, w:80, h:16},
      {x:1260, y:420, w:100, h:16},
    ],
    scrolls: [
      {x:155, y:390, letter:'H'},
      {x:330, y:330, letter:'A'},
      {x:515, y:270, letter:'D'},
      {x:1110, y:330, letter:'E'},
      {x:1295, y:390, letter:'S'},
    ],
    enemies: [
      {type:'StoneGolem', x:350, y:400, patrolMin:120, patrolMax:560},
      {type:'Harpy', x:700, y:160, range:240},
      {type:'StoneGolem', x:1000, y:400, patrolMin:680, patrolMax:1340},
    ],
    playerStart: {x:30, y:420},
  },
];

/* =============================================================
   Level Renderer
   ============================================================= */
function drawLevel(ctx, level, camX) {
  const p = PALETTE;
  // Background fill
  ctx.fillStyle = level.bgColor;
  ctx.fillRect(0, 0, 960, 504);

  // Draw platforms (stone tiles in mid-tone)
  ctx.fillStyle = p.mid;
  for (const plat of level.platforms) {
    const px = plat.x - camX;
    // Only draw if on-screen
    if (px + plat.w < 0 || px > 960) continue;
    ctx.fillRect(px, plat.y - 36, plat.w, plat.h); // -36 for HUD offset
    // Add tile grid lines for detail
    ctx.strokeStyle = p.bg;
    ctx.lineWidth = 1;
    for (let i = 0; i <= plat.w; i += 32) {
      ctx.beginPath();
      ctx.moveTo(px + i, plat.y - 36);
      ctx.lineTo(px + i, plat.y - 36 + plat.h);
      ctx.stroke();
    }
  }

  // Draw scrolls (not yet collected)
  ctx.fillStyle = p.text;
  ctx.strokeStyle = p.primary;
  ctx.lineWidth = 2;
  for (const sc of level.scrolls) {
    if (sc.collected) continue;
    const sx = sc.x - camX;
    if (sx < -20 || sx > 980) continue;
    const sy = sc.y - 36; // HUD offset
    // Scroll icon: white bg + green outline + letter
    ctx.fillStyle = p.text;
    ctx.fillRect(sx - 8, sy - 12, 16, 24);
    ctx.strokeStyle = p.primary;
    ctx.strokeRect(sx - 8, sy - 12, 16, 24);
    ctx.fillStyle = p.bg;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sc.letter, sx, sy);
  }
}

function createEnemies(levelDef) {
  const arr = [];
  for (const e of levelDef.enemies) {
    if (e.type === 'SkeletonSoldier') arr.push(new SkeletonSoldier(e.x, e.y, e.patrolMin, e.patrolMax));
    else if (e.type === 'Harpy')      arr.push(new Harpy(e.x, e.y, e.range));
    else if (e.type === 'StoneGolem') arr.push(new StoneGolem(e.x, e.y, e.patrolMin, e.patrolMax));
  }
  return arr;
}
