// Main entry point for the game - imports all modules and starts the application
import { initGame } from './main.js';
import { initStorySystem } from './story/story-manager.js';

// Standalone function to initialize the game system with a specified chapter
// This can be called both on initial page load and when starting a new game
export async function initGameSystem(startingChapter = 'prologue') {
    console.log(`Initializing game system with chapter: ${startingChapter}`);
    
    // Initialize the story system
    await initStorySystem(startingChapter);
    
    // Then initialize the game
    initGame();
}

// Initialize the game when the page loads for the first time
document.addEventListener('DOMContentLoaded', async () => {
    await initGameSystem();
});