/**
 * game.js
 * Cadmus: The Scroll Quest
 * ---------------------------------------------------------
 * Main game loop (requestAnimationFrame).
 * Orchestrates all systems: player, enemies, levels, scrolls, anagram, UI.
 * State machine for: playing, paused, anagram, complete.
 * ---------------------------------------------------------
 */

(() => {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  let currentLevelIdx = 0;
  let levelData, player, enemies;
  let camX = 0;
  let gameState = 'menu';  // menu | playing | paused | anagram | complete
  let scrollsCollected = 0;

  let lastTime = 0;

  // == INIT ==
  window.addEventListener('load', () => {
    Input.init();
    UI.init();
    gameLoop(0);
  });

  function startLevel(levelIdx) {
    currentLevelIdx = levelIdx;
    levelData = LEVELS[currentLevelIdx];
    scrollsCollected = 0;

    // Reset scrolls collected flag
    levelData.scrolls.forEach(s => s.collected = false);

    // Create player
    player = new Player(levelData.playerStart.x, levelData.playerStart.y);

    // Create enemies
    enemies = createEnemies(levelData);

    // Update UI
    UI.setLevelName(levelData.name);
    UI.setScrollCount(0);
    UI.setHealth(player.hp, player.maxHp);
    UI.showScreen('game');
    gameState = 'playing';
  }

  function restartLevel() {
    startLevel(currentLevelIdx);
  }

  // == MAIN LOOP ==
  function gameLoop(time) {
    requestAnimationFrame(gameLoop);
    const dt = Math.min((time - lastTime) / 1000, 0.1); // cap dt at 100ms
    lastTime = time;

    // === MENU / START SCREEN ===
    if (gameState === 'menu') {
      const action = UI.updateStartScreen();
      if (action === 'startGame') {
        startLevel(0);
      }
      Input.clearPressed();
      return;
    }

    // === PLAYING ===
    if (gameState === 'playing') {
      // Pause
      if (Input.justPressed('pause')) {
        gameState = 'paused';
        UI.showScreen('pause');
        Input.clearPressed();
        return;
      }

      // Update
      player.update(dt, levelData.platforms);
      for (const e of enemies) e.update(dt, levelData.platforms, player);

      // Check scroll collection
      for (const sc of levelData.scrolls) {
        if (!sc.collected) {
          const dist = Math.hypot(player.x - sc.x, player.y - sc.y);
          if (dist < 30) {
            sc.collected = true;
            scrollsCollected++;
            UI.setScrollCount(scrollsCollected);
            if (scrollsCollected >= 5) {
              // All scrolls collected → anagram
              gameState = 'anagram';
              Anagram.init(levelData.targetWord);
              UI.showScreen('anagram');
            }
          }
        }
      }

      // Update HUD
      UI.setHealth(player.hp, player.maxHp);

      // Game over if dead
      if (player.state === 'dead') {
        gameState = 'gameover';
        UI.showScreen('gameover');
        Input.clearPressed();
        return;
      }

      // Update camera (follow player)
      camX = player.x - 480;  // center on player
      if (camX < 0) camX = 0;

      // === RENDER ===
      drawLevel(ctx, levelData, camX);
      player.draw(ctx, camX);
      for (const e of enemies) e.draw(ctx, camX);

      Input.clearPressed();
    }

    // === PAUSED ===
    else if (gameState === 'paused') {
      const action = UI.updatePauseScreen();
      if (action === 'resume') {
        gameState = 'playing';
        UI.showScreen('game');
      } else if (action === 'restart') {
        restartLevel();
      } else if (action === 'quit') {
        gameState = 'menu';
        UI.showScreen('start');
      }
      Input.clearPressed();
    }

    // === ANAGRAM PUZZLE ===
    else if (gameState === 'anagram') {
      const result = Anagram.update();
      if (result === 'correct') {
        // Level complete
        gameState = 'levelComplete';
        UI.setCompleteWord(levelData.targetWord);
        UI.showScreen('complete');
      }
      Input.clearPressed();
    }

    // === LEVEL COMPLETE ===
    else if (gameState === 'levelComplete') {
      const action = UI.updateLevelCompleteScreen();
      if (action === 'nextLevel') {
        if (currentLevelIdx < LEVELS.length - 1) {
          startLevel(currentLevelIdx + 1);
        } else {
          // All levels done → back to menu
          gameState = 'menu';
          UI.showScreen('start');
        }
      }
      Input.clearPressed();
    }

    // === GAME OVER ===
    else if (gameState === 'gameover') {
      const action = UI.updateGameOverScreen();
      if (action === 'restart') {
        restartLevel();
      }
      Input.clearPressed();
    }
  }
})();
