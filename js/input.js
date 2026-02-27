/**
 * input.js
 * Cadmus: The Scroll Quest
 * ---------------------------------------------------------
 * Single source of truth for all keyboard state.
 * Every other module reads from Input.keys / Input.pressed.
 * ---------------------------------------------------------
 */

const Input = (() => {
  // keys currently held down
  const keys = {};
  // keys pressed THIS frame only (cleared each frame by Game)
  const pressed = {};

  const MAPPED = {
    ArrowLeft:  'left',
    ArrowRight: 'right',
    ArrowUp:    'up',
    ArrowDown:  'down',
    KeyZ:       'attack',  // Z = melee attack
    KeyX:       'jump',    // X = jump (alt)
    Space:      'jump',    // Space = jump
    Enter:      'confirm',
    Escape:     'pause',
    Backspace:  'back',
  };

  function _onKeyDown(e) {
    const action = MAPPED[e.code];
    if (!action) return;
    e.preventDefault();
    if (!keys[action]) {
      pressed[action] = true;  // only true on first frame
    }
    keys[action] = true;
  }

  function _onKeyUp(e) {
    const action = MAPPED[e.code];
    if (!action) return;
    e.preventDefault();
    keys[action] = false;
  }

  function init() {
    window.addEventListener('keydown', _onKeyDown);
    window.addEventListener('keyup',   _onKeyUp);
  }

  /** Call once per frame AFTER all systems have read pressed[] */
  function clearPressed() {
    for (const k in pressed) delete pressed[k];
  }

  /** Is the action currently held? */
  function held(action) { return !!keys[action]; }

  /** Was the action pressed this frame? */
  function justPressed(action) { return !!pressed[action]; }

  return { init, clearPressed, held, justPressed, keys, pressed };
})();
