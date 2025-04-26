// Screen management
const screens = {
    start: document.getElementById('start-screen'),
    cinematicUI: document.getElementById('cinematic-ui'),
    camp: document.getElementById('camp-ui'),
    battle: document.getElementById('battle-ui'),
    character: document.getElementById('character-screen')
};

// Import all necessary modules
import { transitionToScreen } from './transitions.js';
import { displayStoryText, setupStoryListeners } from './story.js';
import { initCamp } from './camp.js';
import { initBattle } from './battle.js';
import { initCharacter } from './character.js';

// Initialize the game
function initGame() {
    console.log('Viking Game Initialized');
    
    // Set up event listeners
    document.getElementById('start-game').addEventListener('click', () => {
        transitionToScreen(screens.start, screens.cinematicUI, () => {
            displayStoryText(0);
        });
    });
    
    // Set up story navigation listeners
    setupStoryListeners(screens);
    
    // Initialize all game subsystems
    initCamp();
    initBattle();
    initCharacter();
}
window.goToNode = function(node) {
    transitionToScreen(screens.start, screens.cinematicUI, () => {
        displayStoryText(node);
    });
};

// Export what other modules will need
export { screens, initGame };

// Start the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);
