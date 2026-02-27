/**
 * anagram.js
 * Cadmus: The Scroll Quest
 * ---------------------------------------------------------
 * Fully keyboard-driven anagram puzzle.
 * Collect 5 letters → unscramble into target word.
 * Left/Right to select slot, ENTER to confirm, BACKSPACE to reset.
 * After 2 failed attempts, show a hint.
 * ---------------------------------------------------------
 */

const Anagram = (() => {
  let targetWord  = '';
  let letters     = [];  // collected letters (e.g. ['P','E','A','C','E'])
  let slots       = [];  // player's current arrangement
  let bank        = [];  // remaining letters not yet placed
  let selected    = 0;   // index of selected slot (0-4)
  let attempts    = 0;
  let slotsDOM, bankDOM, hintDOM;

  function init(word) {
    targetWord = word.toUpperCase();
    letters    = word.toUpperCase().split('');
    // Shuffle letters for bank
    bank = [...letters].sort(() => Math.random() - 0.5);
    slots = Array(5).fill(null);
    selected = 0;
    attempts = 0;

    slotsDOM = document.getElementById('letter-slots');
    bankDOM  = document.getElementById('letter-bank');
    hintDOM  = document.getElementById('anagram-hint');

    hintDOM.classList.add('hidden');
    _render();
  }

  function update() {
    // Left/Right: navigate slots
    if (Input.justPressed('left')) {
      selected = (selected - 1 + 5) % 5;
      _render();
    }
    if (Input.justPressed('right')) {
      selected = (selected + 1) % 5;
      _render();
    }

    // BACKSPACE: clear current slot if occupied, else move back
    if (Input.justPressed('back')) {
      if (slots[selected]) {
        bank.push(slots[selected]);
        slots[selected] = null;
        _render();
      } else {
        // Move left and clear
        if (selected > 0) {
          selected -= 1;
          if (slots[selected]) {
            bank.push(slots[selected]);
            slots[selected] = null;
          }
          _render();
        }
      }
    }

    // ENTER: place next bank letter into current slot (or verify if full)
    if (Input.justPressed('confirm')) {
      // If all slots full, verify
      if (!slots.includes(null)) {
        const guess = slots.join('');
        if (guess === targetWord) {
          return 'correct';
        } else {
          attempts++;
          if (attempts >= 2) _showHint();
          // Flash error (in real impl you'd animate, here just clear+refill bank)
          slots.forEach(l => { if(l) bank.push(l); });
          slots = Array(5).fill(null);
          selected = 0;
          _render();
          return 'wrong';
        }
      } else {
        // Place first letter from bank into selected slot if empty
        if (!slots[selected] && bank.length > 0) {
          slots[selected] = bank.shift();
          // auto-move right
          selected = (selected + 1) % 5;
          _render();
        }
      }
    }

    return null;
  }

  function _render() {
    // Render slots
    slotsDOM.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const tile = document.createElement('div');
      tile.className = 'letter-tile';
      if (i === selected) tile.classList.add('selected');
      if (!slots[i]) tile.classList.add('empty');
      tile.textContent = slots[i] || '';
      slotsDOM.appendChild(tile);
    }

    // Render bank (unused letters)
    bankDOM.innerHTML = '';
    for (const l of bank) {
      const tile = document.createElement('div');
      tile.className = 'letter-tile';
      tile.textContent = l;
      bankDOM.appendChild(tile);
    }
  }

  function _showHint() {
    hintDOM.classList.remove('hidden');
    // Hint: show target word in scrambled form again (or definition)
    hintDOM.textContent = `Hint: Think about... (${targetWord[0]}...${targetWord.slice(-1)})`;
  }

  return { init, update };
})();
