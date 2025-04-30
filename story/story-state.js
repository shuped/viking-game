import eventManager, { EventType } from './event-system.js';

/**
 * StoryState class for tracking story progression
 */
class StoryState {
    constructor() {
        this.visitedNodes = new Set();
        this.completedChoices = {};
        this.flags = {};
        this.currentNode = null;
        this.previousNode = null;
        this.chapterProgress = {};
        this.worldState = {
            locations: {},
            characters: {}
        };
    }

    /**
     * Marks a node as visited
     * @param {String|Number} nodeId - The ID of the node
     */
    visitNode(nodeId) {
        const id = nodeId.toString();
        this.previousNode = this.currentNode;
        this.currentNode = id;
        this.visitedNodes.add(id);
        
        // Update chapter progress
        const chapter = this.getActiveChapter();
        if (chapter) {
            if (!this.chapterProgress[chapter]) {
                this.chapterProgress[chapter] = {
                    visitedNodes: new Set(),
                    completedChoices: {}
                };
            }
            this.chapterProgress[chapter].visitedNodes.add(id);
        }
        
        // Trigger event for node visited
        eventManager.trigger(EventType.STORY_NODE_ENTERED, { nodeId: id, previousNodeId: this.previousNode });
    }

    /**
     * Check if a node has been visited
     * @param {String|Number} nodeId - The ID of the node
     * @returns {Boolean} Whether the node has been visited
     */
    hasVisited(nodeId) {
        return this.visitedNodes.has(nodeId.toString());
    }

    /**
     * Record that a choice was made in a node
     * @param {String|Number} nodeId - The ID of the node
     * @param {String|Number} choiceId - The ID or text of the choice
     * @param {Object} result - The result of the choice
     */
    completeChoice(nodeId, choiceId, result = {}) {
        const id = nodeId.toString();
        const choiceKey = choiceId.toString();
        
        // Initialize if needed
        if (!this.completedChoices[id]) {
            this.completedChoices[id] = {};
        }
        
        // Record the choice completion
        this.completedChoices[id][choiceKey] = {
            timestamp: Date.now(),
            result
        };
        
        // Update chapter progress
        const chapter = this.getActiveChapter();
        if (chapter && this.chapterProgress[chapter]) {
            if (!this.chapterProgress[chapter].completedChoices[id]) {
                this.chapterProgress[chapter].completedChoices[id] = {};
            }
            this.chapterProgress[chapter].completedChoices[id][choiceKey] = {
                timestamp: Date.now(),
                result
            };
        }
        
        // Trigger event for choice made
        eventManager.trigger(EventType.STORY_CHOICE_MADE, { 
            nodeId: id, 
            choiceId: choiceKey,
            result
        });
    }

    /**
     * Check if a choice has been completed in a node
     * @param {String|Number} nodeId - The ID of the node
     * @param {String|Number} choiceId - The ID or text of the choice
     * @returns {Boolean} Whether the choice has been completed
     */
    hasCompletedChoice(nodeId, choiceId) {
        const id = nodeId.toString();
        const choiceKey = choiceId.toString();
        return !!(this.completedChoices[id] && this.completedChoices[id][choiceKey]);
    }

    /**
     * Set a story flag
     * @param {String} flag - The flag name
     * @param {*} value - The flag value
     */
    setFlag(flag, value) {
        this.flags[flag] = value;
        
        // Trigger event for flag set
        eventManager.trigger(EventType.PLAYER_FLAG_SET, { flag, value });
    }

    /**
     * Check if a flag exists and has a specific value
     * @param {String} flag - The flag name
     * @param {*} value - Optional value to check against
     * @returns {Boolean} Whether the flag exists and matches the value
     */
    hasFlag(flag, value = undefined) {
        if (value === undefined) {
            return flag in this.flags;
        }
        return this.flags[flag] === value;
    }

    /**
     * Get a flag value
     * @param {String} flag - The flag name
     * @returns {*} The flag value
     */
    getFlag(flag) {
        return this.flags[flag];
    }

    /**
     * Update the state of a world location
     * @param {String} locationId - Location identifier
     * @param {Object} state - Location state data
     */
    updateLocation(locationId, state) {
        this.worldState.locations[locationId] = {
            ...this.worldState.locations[locationId] || {},
            ...state
        };
        
        // Trigger location event
        if (state.discovered) {
            eventManager.trigger(EventType.LOCATION_DISCOVERED, { locationId, state });
        }
    }

    /**
     * Update the state of a character in the world
     * @param {String} characterId - Character identifier
     * @param {Object} state - Character state data
     */
    updateCharacter(characterId, state) {
        this.worldState.characters[characterId] = {
            ...this.worldState.characters[characterId] || {},
            ...state
        };
        
        // Trigger character events
        if (state.met && !this.worldState.characters[characterId]?.met) {
            eventManager.trigger(EventType.CHARACTER_MET, { characterId });
        }
        
        if (state.dead && !this.worldState.characters[characterId]?.dead) {
            eventManager.trigger(EventType.CHARACTER_DIED, { characterId });
        }
    }

    /**
     * Get the current chapter
     * @returns {String} The current chapter
     */
    getActiveChapter() {
        // This would need to be linked to the story-manager
        return window.currentChapter || null;
    }

    /**
     * Get progress percentage for a chapter
     * @param {String} chapter - The chapter name
     * @returns {Number} Progress percentage (0-100)
     */
    getChapterProgress(chapter) {
        const chapterData = this.chapterProgress[chapter];
        if (!chapterData) return 0;
        
        // This is a simplified calculation
        // In a real game, you might have a total count of nodes in the chapter
        return Math.min(100, chapterData.visitedNodes.size * 5);
    }

    /**
     * Reset all story state
     */
    reset() {
        this.visitedNodes = new Set();
        this.completedChoices = {};
        this.flags = {};
        this.currentNode = null;
        this.previousNode = null;
        this.chapterProgress = {};
        this.worldState = {
            locations: {},
            characters: {}
        };
    }

    /**
     * Save story state to local storage
     */
    save() {
        const stateData = {
            visitedNodes: Array.from(this.visitedNodes),
            completedChoices: this.completedChoices,
            flags: this.flags,
            currentNode: this.currentNode,
            previousNode: this.previousNode,
            chapterProgress: Object.fromEntries(
                Object.entries(this.chapterProgress).map(([chapter, data]) => [
                    chapter, 
                    {
                        visitedNodes: Array.from(data.visitedNodes),
                        completedChoices: data.completedChoices
                    }
                ])
            ),
            worldState: this.worldState
        };
        
        localStorage.setItem('story-state', JSON.stringify(stateData));
    }

    /**
     * Load story state from local storage
     * @returns {Boolean} Whether the load was successful
     */
    load() {
        const savedState = localStorage.getItem('story-state');
        if (!savedState) return false;
        
        try {
            const stateData = JSON.parse(savedState);
            
            this.visitedNodes = new Set(stateData.visitedNodes);
            this.completedChoices = stateData.completedChoices;
            this.flags = stateData.flags;
            this.currentNode = stateData.currentNode;
            this.previousNode = stateData.previousNode;
            
            // Rebuild chapter progress with proper Sets
            this.chapterProgress = {};
            Object.entries(stateData.chapterProgress).forEach(([chapter, data]) => {
                this.chapterProgress[chapter] = {
                    visitedNodes: new Set(data.visitedNodes),
                    completedChoices: data.completedChoices
                };
            });
            
            this.worldState = stateData.worldState;
            return true;
        } catch (error) {
            console.error('Error loading story state:', error);
            return false;
        }
    }
}

// Export singleton instance
export const storyState = new StoryState();
export default storyState;