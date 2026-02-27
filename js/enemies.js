/**
 * enemies.js
 * Cadmus: The Scroll Quest
 * ---------------------------------------------------------
 * Three enemy types from the GDD:
 *   SkeletonSoldier  — patrols a range, 2 hits to defeat
 *   Harpy            — flies in sine wave, 1 hit to defeat
 *   StoneGolem       — slow, charges when player in range, 4 hits
 * All drawn procedurally within the 4-colour palette.
 * ---------------------------------------------------------
 */

class Enemy {
  constructor(x, y, w, h, hp) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.hp = hp;
    this.maxHp = hp;
    this.alive = true;
    this.vx = 0; this.vy = 0;
    this.onGround = false;
    this.gravity = 900;
    // Knockback state
    this.knockTimer = 0;
    this.KNOCK_DUR  = 0.15;
  }

  hit(damage = 1) {
    if (!this.alive) return;
    this.hp -= damage;
    this.knockTimer = this.KNOCK_DUR;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }
  }

  _applyGravity(dt, platforms) {
    this.vy += this.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.onGround = false;
    for (const p of platforms) {
      if (this._collidesAABB(p)) this._resolveAABB(p);
    }
  }

  _collidesAABB(r) {
    return this.x < r.x+r.w && this.x+this.w > r.x &&
           this.y < r.y+r.h && this.y+this.h > r.y;
  }

  _resolveAABB(r) {
    const ox = Math.min(this.x+this.w-r.x, r.x+r.w-this.x);
    const oy = Math.min(this.y+this.h-r.y, r.y+r.h-this.y);
    if (oy <= ox) {
      if (this.y+this.h/2 < r.y+r.h/2) { this.y = r.y-this.h; this.vy=0; this.onGround=true; }
      else { this.y = r.y+r.h; this.vy=0; }
    } else {
      if (this.x+this.w/2 < r.x+r.w/2) { this.x=r.x-this.w; } else { this.x=r.x+r.w; }
      this.vx = -this.vx;
    }
  }

  /** Checks if player attack box hits this enemy */
  checkHit(player) {
    if (!this.alive || !player.attacking) return;
    const hb = player.getAttackHitbox();
    if (!hb) return;
    if (hb.x < this.x+this.w && hb.x+hb.w > this.x &&
        hb.y < this.y+this.h && hb.y+hb.h > this.y) {
      this.hit(1);
    }
  }

  /** Deals damage to player on contact */
  touchPlayer(player) {
    if (!this.alive) return;
    if (this.x < player.x+player.w && this.x+this.w > player.x &&
        this.y < player.y+player.h && this.y+this.h > player.y) {
      player.takeDamage(1);
    }
  }
}

/* =============================================================
   SKELETON SOLDIER
   Patrols left/right between patrolMin and patrolMax.
   2 hits to defeat.
   ============================================================= */
class SkeletonSoldier extends Enemy {
  constructor(x, y, patrolMin, patrolMax) {
    super(x, y, 20, 30, 2);
    this.patrolMin = patrolMin;
    this.patrolMax = patrolMax;
    this.speed = 60;
    this.vx = this.speed;
    this.facing = 1;
  }

  update(dt, platforms, player) {
    if (!this.alive) return;
    if (this.knockTimer > 0) { this.knockTimer -= dt; return; }

    // Patrol
    if (this.x <= this.patrolMin) { this.vx =  this.speed; this.facing =  1; }
    if (this.x + this.w >= this.patrolMax) { this.vx = -this.speed; this.facing = -1; }

    this._applyGravity(dt, platforms);
    this.checkHit(player);
    this.touchPlayer(player);
  }

  draw(ctx, camX) {
    if (!this.alive) return;
    const sx = Math.floor(this.x - camX), sy = Math.floor(this.y);
    const p = PALETTE;
    ctx.save();
    if (this.facing === -1) { ctx.translate(sx+this.w, sy); ctx.scale(-1,1); } else ctx.translate(sx, sy);
    // Skull
    ctx.fillStyle = p.text;
    ctx.fillRect(4, 0, 12, 10);
    ctx.fillStyle = p.bg;
    ctx.fillRect(5, 3, 3, 3);  // left eye socket
    ctx.fillRect(12, 3, 3, 3); // right eye socket
    // Ribcage / body
    ctx.fillStyle = p.text;
    ctx.fillRect(3, 10, 14, 12);
    ctx.fillStyle = p.bg;
    for (let i=0; i<3; i++) ctx.fillRect(5, 11+i*3, 10, 2);
    // Legs
    ctx.fillStyle = p.text;
    ctx.fillRect(3, 22, 5, 8);
    ctx.fillRect(12, 22, 5, 8);
    // Sword
    ctx.fillStyle = p.primary;
    ctx.fillRect(17, 8, 4, 14);
    ctx.restore();
  }
}

/* =============================================================
   HARPY
   Flies in a sine wave horizontally. 1 hit to defeat.
   ============================================================= */
class Harpy extends Enemy {
  constructor(x, y, range) {
    super(x, y, 24, 20, 1);
    this.startX = x;
    this.startY = y;
    this.range  = range; // horizontal patrol range px
    this.speed  = 80;
    this.time   = 0;
    this.vx     = this.speed;
    this.facing = 1;
    this.gravity = 0; // overrides — airborne creature
  }

  update(dt, platforms, player) {
    if (!this.alive) return;
    if (this.knockTimer > 0) { this.knockTimer -= dt; return; }

    this.time += dt;
    // Horizontal patrol
    this.x += this.vx * dt;
    if (this.x >= this.startX + this.range) { this.vx = -this.speed; this.facing = -1; }
    if (this.x <= this.startX)              { this.vx =  this.speed; this.facing =  1; }
    // Vertical sine
    this.y = this.startY + Math.sin(this.time * 2.5) * 40;

    this.checkHit(player);
    this.touchPlayer(player);
  }

  draw(ctx, camX) {
    if (!this.alive) return;
    const sx = Math.floor(this.x - camX), sy = Math.floor(this.y);
    const p = PALETTE;
    ctx.save();
    if (this.facing === -1) { ctx.translate(sx+this.w, sy); ctx.scale(-1,1); } else ctx.translate(sx,sy);
    // Body
    ctx.fillStyle = p.mid;
    ctx.fillRect(6, 6, 12, 10);
    // Head
    ctx.fillStyle = p.text;
    ctx.fillRect(8, 0, 8, 8);
    // Wings
    ctx.fillStyle = p.primary;
    ctx.fillRect(0, 4, 6, 8);
    ctx.fillRect(18, 4, 6, 8);
    // Talons
    ctx.fillStyle = p.text;
    ctx.fillRect(7, 16, 3, 4);
    ctx.fillRect(14, 16, 3, 4);
    ctx.restore();
  }
}

/* =============================================================
   STONE GOLEM
   Slow patrol. Charges when player within 120px. 4 hits.
   ============================================================= */
class StoneGolem extends Enemy {
  constructor(x, y, patrolMin, patrolMax) {
    super(x, y, 28, 40, 4);
    this.patrolMin = patrolMin;
    this.patrolMax = patrolMax;
    this.walkSpeed   = 30;
    this.chargeSpeed = 140;
    this.vx = this.walkSpeed;
    this.facing = 1;
    this.charging = false;
    this.chargeTimer = 0;
    this.CHARGE_DUR = 0.5;
  }

  update(dt, platforms, player) {
    if (!this.alive) return;
    if (this.knockTimer > 0) { this.knockTimer -= dt; return; }

    const distX = player.x - this.x;
    const inRange = Math.abs(distX) < 120 &&
                    Math.abs((player.y + player.h/2) - (this.y + this.h/2)) < 40;

    if (inRange && !this.charging) {
      this.charging = true;
      this.chargeTimer = this.CHARGE_DUR;
      this.vx = (distX > 0 ? 1 : -1) * this.chargeSpeed;
      this.facing = distX > 0 ? 1 : -1;
    }
    if (this.charging) {
      this.chargeTimer -= dt;
      if (this.chargeTimer <= 0) { this.charging = false; this.vx = this.walkSpeed * this.facing; }
    } else {
      // Normal patrol
      if (this.x <= this.patrolMin)            { this.vx =  this.walkSpeed; this.facing =  1; }
      if (this.x + this.w >= this.patrolMax)   { this.vx = -this.walkSpeed; this.facing = -1; }
    }

    this._applyGravity(dt, platforms);
    this.checkHit(player);
    this.touchPlayer(player);
  }

  draw(ctx, camX) {
    if (!this.alive) return;
    const sx = Math.floor(this.x - camX), sy = Math.floor(this.y);
    const p = PALETTE;
    ctx.save();
    if (this.facing === -1) { ctx.translate(sx+this.w, sy); ctx.scale(-1,1); } else ctx.translate(sx,sy);
    // Main block body
    ctx.fillStyle = p.mid;
    ctx.fillRect(0, 8, 28, 24);
    // Head
    ctx.fillStyle = p.text;
    ctx.fillRect(4, 0, 20, 10);
    // Cracks (dark detail)
    ctx.fillStyle = p.bg;
    ctx.fillRect(8, 2, 2, 6);
    ctx.fillRect(16, 3, 2, 4);
    ctx.fillRect(4, 14, 6, 2);
    ctx.fillRect(16, 20, 8, 2);
    // Eyes glow green
    ctx.fillStyle = p.primary;
    ctx.fillRect(6, 2, 4, 3);
    ctx.fillRect(18, 2, 4, 3);
    // Legs
    ctx.fillStyle = p.mid;
    ctx.fillRect(2, 32, 8, 8);
    ctx.fillRect(18, 32, 8, 8);
    ctx.restore();
  }
}
