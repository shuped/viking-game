import { storyState } from './story-state.js';

// Store for available chapters
const chapters = {
    'prologue': null,
    'chapter-one': null
};

// Track current chapter
let currentChapter = 'prologue';
let currentStoryNodes = null;

// Lazy-load chapter modules when needed
async function loadChapter(chapterName) {
    if (!chapters[chapterName]) {
        try {
            // Dynamically import the chapter module
            const module = await import(`./${chapterName}.js`);
            chapters[chapterName] = module.storyNodes;
            console.log(`Successfully loaded chapter: ${chapterName}`);
        } catch (error) {
            console.error(`Failed to load chapter: ${chapterName}`, error);
            return false;
        }
    }
    
    // Update current chapter and nodes
    currentChapter = chapterName;
    currentStoryNodes = chapters[chapterName];
    storyState.initChapter(chapterName);
    return true;
}

// Get current story nodes
function getCurrentStoryNodes() {
    return currentStoryNodes;
}

// Get current chapter name
function getCurrentChapter() {
    return currentChapter;
}

// Transition to next chapter
async function transitionToChapter(chapterName) {
    // Reset certain aspects of story state if needed
    // storyState.resetForNewChapter();
    
    // Load the new chapter
    const success = await loadChapter(chapterName);
    return success;
}

// Initialize the story system with the first chapter
async function initStorySystem(startingChapter = 'prologue') {
    await loadChapter(startingChapter);
}

export { 
    getCurrentStoryNodes, 
    getCurrentChapter, 
    transitionToChapter, 
    initStorySystem 
};