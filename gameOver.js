// Game over screen implementation
import { playerState } from './player.js';
import { screens } from './main.js';
import { initGameSystem } from './game.js';

// DOM elements
const gameOverScreen = document.getElementById('game-over-ui');
const deathCauseElement = document.getElementById('death-cause');
const deathTimeElement = document.getElementById('death-time');
const achievementsList = document.getElementById('achievements-list');
const newGameButton = document.getElementById('new-game');

// Initialize the Game Over screen
export function initGameOver() {
    console.log('Game Over System Initialized');
    
    // Add game over screen to screens object
    screens.gameOver = gameOverScreen;
    
    // Set up event listeners
    newGameButton.addEventListener('click', startNewGame);
}

// Show the Game Over screen with a specific death cause
export function showGameOver(deathCause) {
    // Update death cause text
    if (deathCause) {
        deathCauseElement.textContent = deathCause;
    } else {
        deathCauseElement.textContent = 'Your saga has ended.';
    }
    
    // Update time of death
    const now = new Date();
    deathTimeElement.textContent = `Time of death: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    
    // Update final stats display
    document.getElementById('final-str').textContent = playerState.strength;
    document.getElementById('final-agi').textContent = playerState.agility;
    document.getElementById('final-end').textContent = playerState.endurance;
    document.getElementById('final-crd').textContent = playerState.coordination;
    document.getElementById('final-vit').textContent = playerState.vitality;
    document.getElementById('final-wpn').textContent = playerState.weaponSkill;
    document.getElementById('final-rep').textContent = playerState.reputation;
    
    // Set alignment text based on ravens
    const alignment = determineAlignment(playerState.whiteRaven, playerState.blackRaven);
    document.getElementById('final-alignment').textContent = alignment;
    
    // Display achievements
    displayAchievements();
    
    // Show the Game Over screen
    activateScreen(screens.gameOver);
}

// Determine alignment text based on white and black raven values
function determineAlignment(whiteRaven, blackRaven) {
    if (whiteRaven >= 3 && blackRaven >= 3) {
        return 'Balanced';
    } else if (whiteRaven >= 5 && blackRaven < 2) {
        return 'Honorable';
    } else if (blackRaven >= 5 && whiteRaven < 2) {
        return 'Ruthless';
    } else if (whiteRaven > blackRaven) {
        return 'Kind';
    } else if (blackRaven > whiteRaven) {
        return 'Harsh';
    } else {
        return 'Neutral';
    }
}

// Display achievements based on story progress
function displayAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = ''; // Clear existing achievements
    
    const achievements = [];
    
    // Basic prologue completion
    if (storyState.hasVisited(12)) {
        achievements.push("Completed the prologue introduction");
    }
    
    // Erik storyline
    if (storyState.hasCompletedChoice(17, 0)) {
        achievements.push("Agreed to help Erik with his scheme");
    } else if (storyState.hasCompletedChoice(17, 1)) {
        achievements.push("Chose the honorable path over Erik's schemes");
    }
    
    // Challenge warriors
    if (storyState.hasVisited(25)) {
        if (storyState.hasVisited(29)) {
            achievements.push("Defeated a seasoned warrior in honorable combat");
        } else if (storyState.hasVisited(52)) {
            achievements.push("Challenged a warrior beyond your skills");
        }
    }
    
    // Storytelling path
    if (storyState.hasVisited(50)) {
        achievements.push("Impressed warriors with your storytelling ability");
    }
    
    // Death by insulting mothers
    if (storyState.hasVisited(27)) {
        achievements.push("Insulted Viking mothers (unwise decision)");
    }
    
    // Add placeholder achievement if none were earned
    if (achievements.length === 0) {
        achievements.push("Your journey was brief, but your memory will live on in the sagas");
    }
    
    // Add achievements to the list
    achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.textContent = achievement;
        achievementsList.appendChild(li);
    });
}

// Start a new game when the button is clicked
async function startNewGame() {
    console.log("Starting new game");
    
    // Reset player stats with the default stat bundle
    initializePlayerStats('DEFAULT');
    
    // Reset story state
    storyState.reset();
    
    // Transition back to start screen
    const gameOverScreen = document.getElementById('game-over-ui');
    const startScreen = document.getElementById('start-screen');
    
    transitionToScreen(gameOverScreen, startScreen, async () => {
        // Re-initialize the game system with the prologue chapter
        await initGameSystem('prologue');
    });
}
