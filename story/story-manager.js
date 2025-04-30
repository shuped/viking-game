import eventManager, { EventType } from './event-system.js';
import { storyState } from '../story.js';
import { NodeType, convertLegacyNodes } from './story-node.js';
import relationshipManager from './relationship-system.js';

// Chapters registry for dynamic loading
const chapters = {
    'prologue': () => import('./prologue.js'),
    'chapter-one': () => import('./chapter-one.js')
    // Add more chapters here as they're created
};

// Track current chapter and loaded nodes
let currentChapter = null;
let loadedNodes = {};
let activeNode = null;

/**
 * Initialize the story manager
 * @param {String} startingChapter - The chapter to start with 
 */
export async function initStoryManager(startingChapter = 'prologue') {
    // Reset any existing state
    resetStoryManager();
    
    // Load the starting chapter
    await loadChapter(startingChapter);
    
    // Set up event listeners
    setupEventListeners();
    
    // Trigger chapter started event
    eventManager.trigger(EventType.CHAPTER_STARTED, { chapter: startingChapter });
    
    return loadedNodes;
}

/**
 * Set up event listeners for story events
 */
function setupEventListeners() {
    // Listen for node transitions
    eventManager.on(EventType.STORY_NODE_ENTERED, 'story-manager-node-enter', (event) => {
        const { nodeId } = event;
        activeNode = nodeId;
        
        // Check for end of chapter
        const node = loadedNodes[nodeId];
        if (node && node.end) {
            handleChapterEnd(node);
        }
    });
    
    // Listen for player stats that might affect story paths
    eventManager.on(EventType.PLAYER_STAT_CHANGED, 'story-manager-stat-change', (event) => {
        const { stat, value } = event;
        
        // Could dynamically unlock story paths based on stats
    });
}

/**
 * Handle the end of a chapter
 * @param {Object} node - The end node
 */
async function handleChapterEnd(node) {
    // Trigger chapter completed event
    eventManager.trigger(EventType.CHAPTER_COMPLETED, { 
        chapter: currentChapter,
        endNode: node.id 
    });
    
    // Save relationships
    relationshipManager.saveRelationships();
    
    // If there's a next chapter, queue it up
    if (node.nextChapter) {
        await loadChapter(node.nextChapter);
        
        // Trigger chapter started event
        eventManager.trigger(EventType.CHAPTER_STARTED, { 
            chapter: node.nextChapter
        });
    }
}

/**
 * Load a story chapter
 * @param {String} chapterName - The name of the chapter to load
 * @returns {Object} The loaded story nodes
 */
export async function loadChapter(chapterName) {
    if (!chapters[chapterName]) {
        console.error(`Chapter ${chapterName} not found`);
        return null;
    }
    
    try {
        // Dynamically import the chapter module
        const chapterModule = await chapters[chapterName]();
        let nodes = chapterModule.storyNodes;
        
        // Convert legacy nodes if needed
        if (!nodes[Object.keys(nodes)[0]].type) {
            nodes = convertLegacyNodes(nodes);
        }
        
        // Update state
        currentChapter = chapterName;
        loadedNodes = nodes;
        
        return nodes;
    } catch (error) {
        console.error(`Error loading chapter ${chapterName}:`, error);
        return null;
    }
}

/**
 * Get a story node by ID
 * @param {String|Number} nodeId - The ID of the node to get
 * @returns {Object} The story node
 */
export function getNode(nodeId) {
    // Handle both string and numeric IDs
    const id = typeof nodeId === 'string' ? nodeId : nodeId.toString();
    return loadedNodes[id];
}

/**
 * Get all loaded story nodes
 * @returns {Object} All loaded story nodes
 */
export function getAllNodes() {
    return loadedNodes;
}

/**
 * Reset the story manager
 */
export function resetStoryManager() {
    currentChapter = null;
    loadedNodes = {};
    activeNode = null;
    
    // Clear relevant event listeners
    eventManager.off(EventType.STORY_NODE_ENTERED, 'story-manager-node-enter');
    eventManager.off(EventType.PLAYER_STAT_CHANGED, 'story-manager-stat-change');
}

/**
 * Get the current chapter
 * @returns {String} The current chapter name
 */
export function getCurrentChapter() {
    return currentChapter;
}

/**
 * Get the active node ID
 * @returns {String} The active node ID
 */
export function getActiveNodeId() {
    return activeNode;
}

/**
 * Check if nodes have unvisited choices
 * @returns {Array} IDs of nodes with unvisited choices
 */
export function getNodesWithUnvisitedChoices() {
    return Object.keys(loadedNodes).filter(nodeId => {
        const node = loadedNodes[nodeId];
        
        // Skip nodes without choices
        if (!node.choices || node.choices.length === 0) {
            return false;
        }
        
        // Check if any choices haven't been taken yet
        return node.choices.some(choice => {
            return !storyState.hasCompletedChoice(nodeId, choice.text);
        });
    });
}

/**
 * Create a story branch that can be dynamically inserted
 * @param {Object} branchConfig - Configuration for the branch
 * @returns {Object} The created branch nodes
 */
export function createDynamicBranch(branchConfig) {
    const { entryNode, nodes, exitNodeId } = branchConfig;
    const branchNodes = {};
    
    // Process each node in the branch
    Object.keys(nodes).forEach(nodeId => {
        branchNodes[nodeId] = nodes[nodeId];
    });
    
    // Point the entry node to our branch
    loadedNodes[entryNode].next = nodes[Object.keys(nodes)[0]].id;
    
    // Add all branch nodes to loaded nodes
    Object.assign(loadedNodes, branchNodes);
    
    return branchNodes;
}

/**
 * Create a story node dynamically and add it to the current chapter
 * @param {Object} nodeConfig - The node configuration
 * @returns {Object} The created node
 */
export function createDynamicNode(nodeConfig) {
    // Generate a unique ID if not provided
    if (!nodeConfig.id) {
        nodeConfig.id = `dynamic-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    // Create the node
    const node = nodeConfig;
    
    // Add it to loaded nodes
    loadedNodes[node.id] = node;
    
    return node;
}

// Export the module
export default {
    initStoryManager,
    loadChapter,
    getNode,
    getAllNodes,
    getCurrentChapter,
    getActiveNodeId,
    getNodesWithUnvisitedChoices,
    createDynamicBranch,
    createDynamicNode,
    resetStoryManager
};