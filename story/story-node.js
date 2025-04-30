// filepath: c:\Users\S\Documents\code\viking-game\story\story-node.js
import { storyState } from '../story.js';
import { updatePlayerAttribute, addInventoryItem, setPlayerAttribute, setPlayerFlag, getPlayerAttribute } from '../player.js';

/**
 * NodeType enum defining the different types of story nodes
 */
export const NodeType = {
    NARRATIVE: 'narrative',
    DIALOGUE: 'dialogue',
    COMBAT: 'combat',
    DECISION: 'decision',
    CUTSCENE: 'cutscene',
    TRANSITION: 'transition'
};

/**
 * Base class for story nodes with standardized structure
 */
export class StoryNode {
    /**
     * Create a story node
     * @param {Object} config - Node configuration
     */
    constructor(config) {
        this.id = config.id || null;
        this.type = config.type || NodeType.NARRATIVE;
        this.text = config.text || '';
        this.next = config.next || null;
        this.choices = config.choices || [];
        this.conditions = config.conditions || {
            visible: () => true,
            enabled: () => true
        };
        this.triggers = {
            onEnter: config.onEnter || (() => {}),
            onExit: config.onExit || (() => {})
        };
        this.metadata = config.metadata || {
            chapter: '',
            location: '',
            tags: []
        };
        this.end = config.end || false;
        this.nextChapter = config.nextChapter || null;
        this.transitionTo = config.transitionTo || null;
        
        // Special properties for specific node types
        if (this.type === NodeType.COMBAT) {
            this.battleType = config.battleType || 'generic';
        }
        if (this.type === NodeType.TRANSITION && this.transitionTo === 'gameOver') {
            this.deathCause = config.deathCause || '';
        }
    }

    /**
     * Check if this node should be visible based on conditions
     * @returns {Boolean} If the node is visible
     */
    isVisible() {
        return this.conditions.visible();
    }

    /**
     * Check if this node should be enabled based on conditions
     * @returns {Boolean} If the node is enabled
     */
    isEnabled() {
        return this.conditions.enabled();
    }

    /**
     * Handle entering this node
     */
    enter() {
        if (this.triggers.onEnter) {
            this.triggers.onEnter();
        }
    }

    /**
     * Handle exiting this node
     */
    exit() {
        if (this.triggers.onExit) {
            this.triggers.onExit();
        }
    }
}

/**
 * Component class for node choices with standardized structure
 */
export class NodeChoice {
    /**
     * Create a node choice
     * @param {Object} config - Choice configuration
     */
    constructor(config) {
        this.id = config.id || null;
        this.text = config.text || '';
        this.nextNode = config.nextNode || null;
        this.conditions = {
            visible: config.condition || (() => true),
            enabled: config.enabled || (() => true)
        };
        this.onSelect = config.onSelect || null;
        this.statCheck = config.statCheck || null;
        this.metadata = config.metadata || {
            type: 'standard',
            tags: []
        };
    }

    /**
     * Check if this choice should be visible based on conditions
     * @returns {Boolean} If the choice is visible
     */
    isVisible() {
        return this.conditions.visible();
    }

    /**
     * Check if this choice should be enabled based on conditions
     * @returns {Boolean} If the choice is enabled
     */
    isEnabled() {
        return this.conditions.enabled();
    }

    /**
     * Handle selecting this choice
     * @param {Boolean} success - If the choice was successful (for stat checks)
     * @returns {String} Feedback text
     */
    select(success = true) {
        if (this.onSelect) {
            return this.onSelect(success);
        }
        return '';
    }
}

/**
 * Helper class for creating stat checks
 */
export class StatCheck {
    /**
     * Create a stat check
     * @param {String} stat - The stat to check
     * @param {Number} threshold - The threshold to meet
     * @param {Object} success - Success outcome
     * @param {Object} failure - Failure outcome
     */
    constructor(stat, threshold, success, failure) {
        this.stat = stat;
        this.threshold = threshold;
        this.success = success;
        this.failure = failure;
    }

    /**
     * Check if the player passes this stat check
     * @returns {Boolean} If the check passes
     */
    passes() {
        const statValue = getPlayerAttribute(this.stat);
        return statValue >= this.threshold;
    }

    /**
     * Get the appropriate outcome based on check result
     * @returns {Object} The outcome (success or failure)
     */
    getOutcome() {
        return this.passes() ? this.success : this.failure;
    }
}

/**
 * Factory function to create a narrative node
 * @param {Object} config - Node configuration
 * @returns {StoryNode} A narrative story node
 */
export function createNarrativeNode(config) {
    return new StoryNode({
        ...config,
        type: NodeType.NARRATIVE
    });
}

/**
 * Factory function to create a dialogue node
 * @param {Object} config - Node configuration
 * @returns {StoryNode} A dialogue story node
 */
export function createDialogueNode(config) {
    return new StoryNode({
        ...config,
        type: NodeType.DIALOGUE
    });
}

/**
 * Factory function to create a combat node
 * @param {Object} config - Node configuration
 * @returns {StoryNode} A combat story node
 */
export function createCombatNode(config) {
    return new StoryNode({
        ...config,
        type: NodeType.COMBAT
    });
}

/**
 * Factory function to create a decision node
 * @param {Object} config - Node configuration
 * @returns {StoryNode} A decision story node
 */
export function createDecisionNode(config) {
    return new StoryNode({
        ...config,
        type: NodeType.DECISION
    });
}

/**
 * Factory function to create a node choice
 * @param {Object} config - Choice configuration
 * @returns {NodeChoice} A node choice
 */
export function createChoice(config) {
    return new NodeChoice(config);
}

/**
 * Factory function to create a stat check
 * @param {String} stat - The stat to check
 * @param {Number} threshold - The threshold to meet
 * @param {Object} success - Success outcome
 * @param {Object} failure - Failure outcome
 * @returns {Object} A stat check object
 */
export function createStatCheck(stat, threshold, success, failure) {
    return {
        stat,
        threshold,
        success,
        failure
    };
}

/**
 * Create an effect that updates a player attribute
 * @param {String} attribute - The attribute to update
 * @param {Number} value - The value to update by
 * @returns {Function} An effect function
 */
export function createAttributeEffect(attribute, value) {
    return () => {
        updatePlayerAttribute(attribute, value);
        return `${attribute} ${value >= 0 ? '+' : ''}${value}`;
    };
}

/**
 * Create an effect that adds an item to inventory
 * @param {Object} item - The item to add
 * @returns {Function} An effect function
 */
export function createItemEffect(item) {
    return () => {
        addInventoryItem(item);
        return `Added ${item.name} to inventory`;
    };
}

/**
 * Create an effect that sets a player flag
 * @param {String} flag - The flag to set
 * @param {*} value - The value to set
 * @returns {Function} An effect function
 */
export function createFlagEffect(flag, value) {
    return () => {
        setPlayerFlag(flag, value);
        return `Set ${flag} to ${value}`;
    };
}

/**
 * Create an effect that combines multiple effects
 * @param {Array} effects - Array of effect functions
 * @returns {Function} A combined effect function
 */
export function createCompositeEffect(...effects) {
    return () => {
        const results = [];
        effects.forEach(effect => {
            const result = effect();
            if (result) {
                results.push(result);
            }
        });
        return results.join('<br>');
    };
}

/**
 * Convert traditional story nodes to the new format
 * @param {Object} legacyNodes - The old format story nodes
 * @returns {Object} The new format story nodes
 */
export function convertLegacyNodes(legacyNodes) {
    const newNodes = {};
    
    Object.entries(legacyNodes).forEach(([id, node]) => {
        let nodeType = NodeType.NARRATIVE;
        
        if (node.transitionTo === 'battle') {
            nodeType = NodeType.COMBAT;
        } else if (node.choices && node.choices.length > 0) {
            nodeType = NodeType.DECISION;
        }
        
        const newNode = new StoryNode({
            id,
            type: nodeType,
            text: node.text,
            next: node.next,
            choices: node.choices,
            onEnter: node.onEnter,
            onExit: node.onExit,
            end: node.end,
            nextChapter: node.nextChapter,
            transitionTo: node.transitionTo,
            battleType: node.battleType,
            deathCause: node.deathCause
        });
        
        newNodes[id] = newNode;
    });
    
    return newNodes;
}