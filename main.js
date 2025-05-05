// Screen management
const screens = {
    start: document.getElementById('start-screen'),
    cinematicUI: document.getElementById('cinematic-ui'),
    camp: document.getElementById('camp-ui'),
    battle: document.getElementById('battle-ui'),
    character: document.getElementById('character-screen'),
    gameOver: document.getElementById('game-over-ui'),
    simulator: document.getElementById('simulator-screen')
};

// Import all necessary modules
import { transitionToScreen } from './transitions.js';
import { displayStoryText, setupStoryListeners } from './story.js';
import { initCamp } from './camp.js';
import { initBattle } from './battle.js';
import { initCharacter } from './character.js';
import { initGameOver } from './gameOver.js';
import { initBattleSimulator } from './battle-simulator.js';

// Initialize the game
function initGame() {
    console.log('Viking Game Initialized');
    
    // Set up event listeners
    document.getElementById('start-game').addEventListener('click', () => {
        transitionToScreen(screens.start, screens.cinematicUI, () => {
            displayStoryText(0);
        });
    });
    
    // Initialize all game subsystems first
    initCamp();
    initBattle();
    initCharacter();
    initGameOver();
    
    // Setup story navigation listeners AFTER all systems are initialized
    setupStoryListeners(screens);
}

window.goToNode = function(node) {
    transitionToScreen(screens.start, screens.cinematicUI, () => {
        displayStoryText(node);
    });
};

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    
    // Setup Start Screen event listener
    document.getElementById('start-game').addEventListener('click', () => {
        initGame();
    });
    
    // Initialize Battle Simulator separately from main game flow
    initBattleSimulator();
});

// Export what other modules will need
export { screens, initGame };
