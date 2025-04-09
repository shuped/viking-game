// Screen management
const screens = {
    start: document.getElementById('start-screen'),
    prologue: document.getElementById('cinematic-ui'),
    camp: document.getElementById('camp-ui'),
    battle: document.getElementById('battle-ui')
};

// Import all necessary modules
import { transitionToScreen } from './transitions.js';
import { displayStoryText, setupStoryListeners } from './story.js';
import { initCamp } from './camp.js';
import { initBattle } from './battle.js';

// Initialize the game
function initGame() {
    console.log('Viking Game Initialized');
    
    // Set up event listeners
    document.getElementById('start-game').addEventListener('click', () => {
        transitionToScreen(screens.start, screens.prologue, () => {
            displayStoryText(0);
        });
    });
    
    // Set up story navigation listeners
    setupStoryListeners(screens);
}

// Export what other modules will need
export { screens, initGame };

// Start the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);
