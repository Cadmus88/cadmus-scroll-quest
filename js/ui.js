/**
 * ui.js
 * Cadmus: The Scroll Quest
 * ---------------------------------------------------------
 * UI Screen Manager (state machine)
 * Screens: start, game, anagram, pause, gameover, complete
 * All screen transitions are keyboard-driven.
 * ---------------------------------------------------------
 */

const UI = (() => {
  let currentScreen = 'start';
  const screens = {};
  let pauseMenuIndex = 0;

  function init() {
    // Cache all screen DOMs
    screens.start    = document.getElementById('screen-start');
    screens.game     = document.getElementById('screen-game');
    screens.anagram  = document.getElementById('screen-anagram');
    screens.pause    = document.getElementById('screen-pause');
    screens.gameover = document.getElementById('screen-gameover');
    screens.complete = document.getElementById('screen-complete');

    // Update HUD refs
    UI.hud = {
      healthFill: document.getElementById('health-fill'),
      levelName:  document.getElementById('level-name'),
      scrollCount: document.getElementById('scroll-count'),
    };

    showScreen('start');
  }

  function showScreen(name) {
    for (const key in screens) {
      screens[key].classList.remove('active');
    }
    screens[name].classList.add('active');
    currentScreen = name;
  }

  function updateStartScreen() {
    if (Input.justPressed('confirm')) {
      return 'startGame';  // trigger Game to start level 1
    }
    return null;
  }

  function updatePauseScreen() {
    const menu = document.querySelectorAll('#pause-menu li');
    // Up/Down: navigate
    if (Input.justPressed('up')) {
      pauseMenuIndex = (pauseMenuIndex - 1 + menu.length) % menu.length;
      _renderPauseMenu(menu);
    }
    if (Input.justPressed('down')) {
      pauseMenuIndex = (pauseMenuIndex + 1) % menu.length;
      _renderPauseMenu(menu);
    }
    // ENTER: select
    if (Input.justPressed('confirm')) {
      const action = menu[pauseMenuIndex].getAttribute('data-action');
      if (action === 'resume')  return 'resume';
      if (action === 'restart') return 'restart';
      if (action === 'quit')    return 'quit';
    }
    return null;
  }

  function _renderPauseMenu(items) {
    items.forEach((el, i) => {
      if (i === pauseMenuIndex) el.classList.add('selected');
      else el.classList.remove('selected');
    });
  }

  function updateGameOverScreen() {
    if (Input.justPressed('confirm')) return 'restart';
    return null;
  }

  function updateLevelCompleteScreen() {
    if (Input.justPressed('confirm')) return 'nextLevel';
    return null;
  }

  function setLevelName(name) {
    UI.hud.levelName.textContent = name;
  }

  function setScrollCount(count) {
    UI.hud.scrollCount.textContent = count;
  }

  function setHealth(hp, maxHp) {
    const pct = (hp / maxHp) * 100;
    UI.hud.healthFill.style.width = pct + '%';
  }

  function setCompleteWord(word) {
    document.getElementById('complete-word').textContent = `You solved: "${word}"`;
  }

  return {
    init,
    showScreen,
    updateStartScreen,
    updatePauseScreen,
    updateGameOverScreen,
    updateLevelCompleteScreen,
    setLevelName,
    setScrollCount,
    setHealth,
    setCompleteWord,
    hud: null,
    get currentScreen() { return currentScreen; },
  };
})();
