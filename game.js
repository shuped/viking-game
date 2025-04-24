// Main entry point for the game - imports all modules and starts the application
import { initGame } from './main.js';
import { initStorySystem } from './story/story-manager.js';

// Initialize the story system with prologue chapter
document.addEventListener('DOMContentLoaded', async () => {
    // First initialize the story system
    await initStorySystem('prologue');
    
    // Then initialize the game
    initGame();
});