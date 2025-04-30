// filepath: c:\Users\S\Documents\code\viking-game\story\event-system.js
/**
 * Event system for game events and story reactions
 */

/**
 * EventType enum for standardized event types
 */
export const EventType = {
    // Story progression events
    STORY_NODE_ENTERED: 'story:node:entered',
    STORY_NODE_EXITED: 'story:node:exited',
    STORY_CHOICE_MADE: 'story:choice:made',
    CHAPTER_STARTED: 'story:chapter:started',
    CHAPTER_COMPLETED: 'story:chapter:completed',
    
    // Character events
    CHARACTER_MET: 'character:met',
    CHARACTER_DIED: 'character:died',
    RELATIONSHIP_CHANGED: 'relationship:changed',
    
    // Player events
    PLAYER_STAT_CHANGED: 'player:stat:changed',
    PLAYER_INVENTORY_CHANGED: 'player:inventory:changed',
    PLAYER_FLAG_SET: 'player:flag:set',
    PLAYER_DIED: 'player:died',
    
    // Combat events
    COMBAT_STARTED: 'combat:started',
    COMBAT_ENDED: 'combat:ended',
    COMBAT_ACTION: 'combat:action',
    
    // Location events
    LOCATION_DISCOVERED: 'location:discovered',
    LOCATION_ENTERED: 'location:entered',
    LOCATION_EXITED: 'location:exited',
    
    // Custom events
    CUSTOM: 'custom'
};

/**
 * Event manager singleton for handling game events
 */
class EventManager {
    constructor() {
        this.listeners = {};
        this.oneTimeListeners = {};
        this.eventHistory = [];
    }
    
    /**
     * Register an event listener
     * @param {String} eventType - Type of event to listen for
     * @param {String} listenerId - Unique identifier for this listener
     * @param {Function} callback - Function to call when event occurs
     * @param {Boolean} once - If true, listener will be removed after first trigger
     */
    on(eventType, listenerId, callback, once = false) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = {};
        }
        
        // Store listener configuration
        this.listeners[eventType][listenerId] = {
            callback,
            once
        };
    }
    
    /**
     * Register a one-time event listener
     * @param {String} eventType - Type of event to listen for
     * @param {String} listenerId - Unique identifier for this listener
     * @param {Function} callback - Function to call when event occurs
     */
    once(eventType, listenerId, callback) {
        this.on(eventType, listenerId, callback, true);
    }
    
    /**
     * Remove an event listener
     * @param {String} eventType - Type of event
     * @param {String} listenerId - Identifier of listener to remove
     */
    off(eventType, listenerId) {
        if (this.listeners[eventType] && this.listeners[eventType][listenerId]) {
            delete this.listeners[eventType][listenerId];
        }
    }
    
    /**
     * Trigger an event
     * @param {String} eventType - Type of event to trigger
     * @param {Object} eventData - Data associated with the event
     */
    trigger(eventType, eventData = {}) {
        // Record event in history
        const event = {
            type: eventType,
            data: eventData,
            timestamp: Date.now()
        };
        this.eventHistory.push(event);
        
        // Limit history size to prevent memory issues
        if (this.eventHistory.length > 100) {
            this.eventHistory.shift();
        }
        
        // Check for listeners
        if (!this.listeners[eventType]) {
            return;
        }
        
        // Notify all listeners
        Object.keys(this.listeners[eventType]).forEach(listenerId => {
            const listener = this.listeners[eventType][listenerId];
            
            // Call the listener callback
            listener.callback(eventData);
            
            // Remove if it was a one-time listener
            if (listener.once) {
                this.off(eventType, listenerId);
            }
        });
    }
    
    /**
     * Check if an event has occurred
     * @param {String} eventType - Type of event to check
     * @param {Function} predicate - Optional function to filter events
     * @returns {Boolean} True if event has occurred
     */
    hasOccurred(eventType, predicate = null) {
        const events = this.eventHistory.filter(event => event.type === eventType);
        
        if (events.length === 0) {
            return false;
        }
        
        if (predicate) {
            return events.some(event => predicate(event.data));
        }
        
        return true;
    }
    
    /**
     * Get all occurrences of an event
     * @param {String} eventType - Type of event to get
     * @param {Function} predicate - Optional function to filter events
     * @returns {Array} Array of matching events
     */
    getEvents(eventType, predicate = null) {
        const events = this.eventHistory.filter(event => event.type === eventType);
        
        if (predicate) {
            return events.filter(event => predicate(event.data));
        }
        
        return events;
    }
    
    /**
     * Clear all event listeners
     */
    clearListeners() {
        this.listeners = {};
    }
    
    /**
     * Clear event history
     */
    clearHistory() {
        this.eventHistory = [];
    }
    
    /**
     * Reset the event system
     */
    reset() {
        this.clearListeners();
        this.clearHistory();
    }
}

// Export singleton instance
export const eventManager = new EventManager();
export default eventManager;