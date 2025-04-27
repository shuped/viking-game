// Game Over Screen functionality
import { playerState, initializePlayerStats } from './player.js';
import { transitionToScreen } from './transitions.js';
import { storyState } from './story/story-state.js';
import { initGameSystem } from './game.js';

// Initialize the game over screen with stats and accomplishments
function initGameOver(deathCause) {
    console.log("Initializing game over screen");
    
    // Set death cause if provided
    if (deathCause) {
        document.getElementById('death-cause').textContent = deathCause;
    } else {
        document.getElementById('death-cause').textContent = "Your saga has ended...";
    }
    
    // Set final stats
    document.getElementById('final-str').textContent = playerState.strength || 0;
    document.getElementById('final-agi').textContent = playerState.agility || 0;
    document.getElementById('final-int').textContent = playerState.intelligence || 0;
    document.getElementById('final-cha').textContent = playerState.charisma || 0;
    document.getElementById('final-rep').textContent = playerState.reputation || 0;
    
    // Determine alignment based on white/black raven values
    const whiteRaven = playerState.whiteRaven || 0;
    const blackRaven = playerState.blackRaven || 0;
    let alignment = "Neutral";
    
    if (whiteRaven > blackRaven + 5) {
        alignment = "Honorable";
    } else if (blackRaven > whiteRaven + 5) {
        alignment = "Dishonorable";
    } else if (whiteRaven > blackRaven) {
        alignment = "Slightly Honorable";
    } else if (blackRaven > whiteRaven) {
        alignment = "Slightly Dishonorable";
    }
    
    document.getElementById('final-alignment').textContent = alignment;
    
    // Set the time of death
    const now = new Date();
    document.getElementById('death-time').textContent = 
        `Journey ended on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
    
    // Display achievements based on story nodes visited
    displayAchievements();
    
    // Add event listener to the new game button
    document.getElementById('new-game').addEventListener('click', startNewGame);
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

export { initGameOver };