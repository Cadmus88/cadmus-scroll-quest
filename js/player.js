/**
 * player.js
 * Cadmus: The Scroll Quest
 * ---------------------------------------------------------
 * Cadmus character: physics, animation state, rendering.
 * Sprite is drawn procedurally on canvas using the 4-colour palette.
 * ---------------------------------------------------------
 */
const PALETTE = {
 bg: '#333333',
 primary: '#1EDB07',
 mid: '#9EFF8B',
 text: '#FFFFFF',
};
class Player {
 constructor(x, y) {
 // Position & size
 this.x = x;
 this.y = y;
 this.w = 24; // sprite width (px, matches 32x32 tile grid)
 this.h = 32; // sprite height
 // Physics
 this.vx = 0;
 this.vy = 0;
 this.speed = 180; // px/s horizontal
 this.jumpForce = -450; // px/s initial vertical impulse
 this.gravity = 1100; // px/s^2
 this.onGround = false;
 // Combat
 this.maxHp = 5;
 this.hp = 5;
 this.attacking = false;
 this.attackTimer = 0;
 this.attackDuration = 0.2; // seconds
 this.attackCooldown = 0;
 this.attackCooldownMax = 0.4;
 this.invincible = false;
 this.invincibleTimer = 0;
 this.invincibleDuration = 1.0; // 1s after hit
 // Animation
 this.state = 'idle'; // idle | run | jump | attack | hurt | dead
 this.facing = 1; // 1 = right, -1 = left
 this.animFrame = 0;
 this.animTimer = 0;
 this.animSpeed = 0.12; // seconds per frame
 }
 update(dt, platforms) {
 if (this.state === 'dead') return;
 // --- Horizontal movement ---
 const moveX = (Input.held('right') ? 1 : 0) - (Input.held('left') ? 1 : 0);
 this.vx = moveX * this.speed;
 if (moveX !== 0) this.facing = moveX;
 // --- Jump ---
 if (Input.justPressed('jump') && this.onGround) {
 this.vy = this.jumpForce;
 this.onGround = false;
 }
 // --- Attack ---
 this.attackCooldown -= dt;
 if (Input.justPressed('attack') && this.attackCooldown <= 0 && !this.attacking) {
 this.attacking = true;
 this.attackTimer = this.attackDuration;
 this.attackCooldown = this.attackCooldownMax;
 }
 if (this.attacking) {
 this.attackTimer -= dt;
 if (this.attackTimer <= 0) this.attacking = false;
 }
 // --- Gravity ---
 this.vy += this.gravity * dt;
 
 // --- Integrate position & Resolve Collision (Axis by Axis) ---
 // Resolve Y first (crucial for landing)
 this.y += this.vy * dt;
 this.onGround = false;
 for (const p of platforms) {
 if (this._collidesAABB(p)) {
 // Landing on top
 if (this.vy > 0 && this.y + this.h - this.vy * dt <= p.y) {
 this.y = p.y - this.h;
 this.vy = 0;
 this.onGround = true;
 } 
 // Hitting head
 else if (this.vy < 0 && this.y - this.vy * dt >= p.y + p.h) {
 this.y = p.y + p.h;
 this.vy = 0;
 }
 }
 }

 // Resolve X
 this.x += this.vx * dt;
 for (const p of platforms) {
 if (this._collidesAABB(p)) {
 if (this.vx > 0) this.x = p.x - this.w;
 else if (this.vx < 0) this.x = p.x + p.w;
 }
 }

 // Pit Death
 if (this.y > 600) this.takeDamage(5);

 // --- Invincibility frames ---
 if (this.invincible) {
 this.invincibleTimer -= dt;
 if (this.invincibleTimer <= 0) this.invincible = false;
 }
 // --- Animation state machine ---
 this._updateAnim(dt);
 }
 _collidesAABB(rect) {
 return this.x < rect.x + rect.w &&
 this.x + this.w > rect.x &&
 this.y < rect.y + rect.h &&
 this.y + this.h > rect.y;
 }
 _updateAnim(dt) {
 let nextState = 'idle';
 if (this.state === 'dead') { nextState = 'dead'; }
 else if (this.attacking) { nextState = 'attack'; }
 else if (!this.onGround) { nextState = 'jump'; }
 else if (this.vx !== 0) { nextState = 'run'; }
 else { nextState = 'idle'; }
 if (nextState !== this.state) {
 this.state = nextState;
 this.animFrame = 0;
 this.animTimer = 0;
 } else {
 this.animTimer += dt;
 if (this.animTimer >= this.animSpeed) {
 this.animTimer = 0;
 this.animFrame++;
 }
 }
 }
 takeDamage(amount = 1) {
 if (this.invincible || this.state === 'dead') return;
 this.hp -= amount;
 this.invincible = true;
 this.invincibleTimer = this.invincibleDuration;
 if (this.hp <= 0) {
 this.hp = 0;
 this.state = 'dead';
 }
 }
 getAttackHitbox() {
 if (!this.attacking) return null;
 return {
 x: this.facing === 1 ? this.x + this.w : this.x - 20,
 y: this.y + 4,
 w: 20,
 h: 16,
 };
 }
 draw(ctx, camX) {
 const sx = Math.floor(this.x - camX);
 const sy = Math.floor(this.y);
 if (this.invincible && Math.floor(Date.now() / 80) % 2 === 0) return;
 ctx.save();
 if (this.facing === -1) {
 ctx.translate(sx + this.w, sy);
 ctx.scale(-1, 1);
 } else {
 ctx.translate(sx, sy);
 }
 this._drawSprite(ctx);
 ctx.restore();
 }
 _drawSprite(ctx) {
 const p = PALETTE;
 ctx.fillStyle = p.mid;
 ctx.fillRect(4, 8, 16, 16); 
 ctx.fillRect(6, 0, 12, 10); 
 ctx.fillStyle = p.primary;
 ctx.fillRect(6, 2, 12, 7); 
 ctx.fillStyle = p.text;
 ctx.fillRect(8, 4, 4, 3); 
 ctx.fillStyle = p.mid;
 ctx.fillRect(4, 24, 6, 8); 
 ctx.fillRect(14, 24, 6, 8); 
 ctx.fillStyle = p.primary;
 if (this.attacking) {
 ctx.fillRect(20, 10, 10, 4); 
 ctx.fillRect(16, 8, 6, 8); 
 } else {
 ctx.fillRect(16, 10, 4, 10); 
 }
 ctx.fillRect(0, 10, 4, 10); 
 ctx.fillStyle = p.text;
 ctx.fillRect(0, 8, 4, 14); 
 }
}
