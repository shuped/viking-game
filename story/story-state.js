// Story state tracking
export const storyState = {
    chapterStates: {},
    currentChapter: null,
    // Track the next node IDs for different scene types
    nextNodeAfterTransition: {},

    // Initialize state for a new chapter
    initChapter(chapterName) {
        if (!this.chapterStates[chapterName]) {
            this.chapterStates[chapterName] = {
                visitedNodes: new Set(),
                completedChoices: new Set()
            };
        }
        this.currentChapter = chapterName;
    },

    // Mark a node as visited
    visitNode(nodeId) {
        if (this.currentChapter) {
            this.chapterStates[this.currentChapter].visitedNodes.add(nodeId);
        }
    },

    // Check if a node has been visited
    hasVisited(nodeId) {
        return this.currentChapter && this.chapterStates[this.currentChapter].visitedNodes.has(nodeId);
    },

    // Mark a specific choice as completed
    completeChoice(nodeId, choiceIndex) {
        if (this.currentChapter) {
            this.chapterStates[this.currentChapter].completedChoices.add(`${nodeId}-${choiceIndex}`);
        }
    },

    // Check if a specific choice has been completed
    hasCompletedChoice(nodeId, choiceIndex) {
        return this.currentChapter && this.chapterStates[this.currentChapter].completedChoices.has(`${nodeId}-${choiceIndex}`);
    },

    // Get state for a specific chapter
    getChapterState(chapterName) {
        return this.chapterStates[chapterName] || { visitedNodes: new Set(), completedChoices: new Set() };
    },
    
    // Store the next node ID to visit after a scene transition
    setNextNodeAfterTransition(sceneType, nodeId) {
        this.nextNodeAfterTransition[sceneType] = nodeId;
    },
    
    // Get the next node ID for a specific scene type
    getNextNodeAfterTransition(sceneType) {
        return this.nextNodeAfterTransition[sceneType];
    },
    
    // Reset the entire story state
    reset() {
        this.chapterStates = {};
        this.currentChapter = null;
        this.nextNodeAfterTransition = {};
    }
};
window.storystate = storyState; // For debugging purposes