// filepath: c:\Users\S\Documents\code\viking-game\story\relationship-system.js
/**
 * Relationship system for tracking character relationships with the player
 */

// Define relationship trait ranges
const TRAIT_MIN = -10;
const TRAIT_MAX = 10;

/**
 * Relationship status definitions based on trait combinations
 */
const RELATIONSHIP_STATUS = {
    // Friendship-based
    LOYAL_FRIEND: { name: 'Loyal Friend', description: 'Will stand by you no matter what' },
    FRIEND: { name: 'Friend', description: 'Considers you a friend' },
    ACQUAINTANCE: { name: 'Acquaintance', description: 'Knows you casually' },
    SUSPICIOUS: { name: 'Suspicious', description: 'Doesn't fully trust you' },
    ENEMY: { name: 'Enemy', description: 'Actively works against you' },
    
    // Trust-based
    TRUSTED_ALLY: { name: 'Trusted Ally', description: 'Completely trusts you' },
    TENTATIVE_ALLY: { name: 'Tentative Ally', description: 'Cautiously trusts you' },
    DISTRUSTFUL: { name: 'Distrustful', description: 'Doesn't trust you' },
    BETRAYED: { name: 'Betrayed', description: 'Feels betrayed by you' },
    
    // Respect-based
    ADMIRER: { name: 'Admirer', description: 'Greatly admires your actions' },
    RESPECTFUL: { name: 'Respectful', description: 'Respects you' },
    NEUTRAL: { name: 'Neutral', description: 'Has no strong opinion of you' },
    DISRESPECTFUL: { name: 'Disrespectful', description: 'Doesn't respect you' },
    CONTEMPTUOUS: { name: 'Contemptuous', description: 'Holds you in contempt' },
    
    // Special combined states
    BLOOD_BROTHER: { name: 'Blood Brother', description: 'Bound by oath and blood' },
    MORTAL_ENEMY: { name: 'Mortal Enemy', description: 'Sworn to destroy you' },
    ROMANTIC: { name: 'Romantic', description: 'Has romantic feelings for you' }
};

/**
 * Character relationship class
 */
class CharacterRelationship {
    /**
     * Create a new character relationship
     * @param {String} characterId - Unique character identifier
     * @param {Object} config - Initial configuration
     */
    constructor(characterId, config = {}) {
        this.characterId = characterId;
        this.traits = {
            trust: config.trust || 0,
            friendship: config.friendship || 0, 
            respect: config.respect || 0,
            fear: config.fear || 0,
            attraction: config.attraction || 0
        };
        this.flags = config.flags || {};
        this.events = config.events || [];
        this.lastInteraction = config.lastInteraction || null;
    }
    
    /**
     * Update a relationship trait
     * @param {String} trait - The trait to update
     * @param {Number} value - The value to adjust by
     * @returns {Number} The new trait value
     */
    updateTrait(trait, value) {
        if (!this.traits.hasOwnProperty(trait)) {
            this.traits[trait] = 0;
        }
        
        this.traits[trait] += value;
        
        // Keep within bounds
        if (this.traits[trait] > TRAIT_MAX) {
            this.traits[trait] = TRAIT_MAX;
        } else if (this.traits[trait] < TRAIT_MIN) {
            this.traits[trait] = TRAIT_MIN;
        }
        
        return this.traits[trait];
    }
    
    /**
     * Set a relationship flag
     * @param {String} flag - The flag to set
     * @param {*} value - The value to set
     */
    setFlag(flag, value) {
        this.flags[flag] = value;
    }
    
    /**
     * Check if a flag is set
     * @param {String} flag - The flag to check
     * @returns {Boolean} If the flag is set
     */
    hasFlag(flag) {
        return this.flags.hasOwnProperty(flag) && this.flags[flag];
    }
    
    /**
     * Record an interaction event
     * @param {String} eventType - Type of event
     * @param {Object} details - Event details
     */
    recordEvent(eventType, details = {}) {
        const event = {
            type: eventType,
            details: details,
            timestamp: Date.now()
        };
        
        this.events.push(event);
        this.lastInteraction = event;
    }
    
    /**
     * Get the current relationship status
     * @returns {Object} The relationship status
     */
    getStatus() {
        const { trust, friendship, respect, fear } = this.traits;
        
        // Check for special combined states first
        if (trust >= 8 && friendship >= 8 && respect >= 8) {
            return RELATIONSHIP_STATUS.BLOOD_BROTHER;
        }
        
        if (trust <= -8 && friendship <= -8 && fear >= 8) {
            return RELATIONSHIP_STATUS.MORTAL_ENEMY;
        }
        
        if (friendship >= 5 && this.traits.attraction >= 5) {
            return RELATIONSHIP_STATUS.ROMANTIC;
        }
        
        // Otherwise, use the dominant trait to determine status
        if (friendship >= 8) return RELATIONSHIP_STATUS.LOYAL_FRIEND;
        if (friendship >= 5) return RELATIONSHIP_STATUS.FRIEND;
        if (friendship >= 0) return RELATIONSHIP_STATUS.ACQUAINTANCE;
        if (friendship >= -5) return RELATIONSHIP_STATUS.SUSPICIOUS;
        return RELATIONSHIP_STATUS.ENEMY;
    }
}

/**
 * Singleton class to manage all character relationships
 */
class RelationshipManager {
    constructor() {
        this.relationships = {};
    }
    
    /**
     * Get or create a character relationship
     * @param {String} characterId - Character identifier
     * @returns {CharacterRelationship} The character relationship
     */
    getRelationship(characterId) {
        if (!this.relationships[characterId]) {
            this.relationships[characterId] = new CharacterRelationship(characterId);
        }
        return this.relationships[characterId];
    }
    
    /**
     * Update a character relationship trait
     * @param {String} characterId - Character identifier
     * @param {String} trait - The trait to update
     * @param {Number} value - The value to adjust by
     * @returns {Number} The new trait value
     */
    updateRelationship(characterId, trait, value) {
        const relationship = this.getRelationship(characterId);
        return relationship.updateTrait(trait, value);
    }
    
    /**
     * Get a character relationship status
     * @param {String} characterId - Character identifier
     * @returns {Object} The relationship status
     */
    getRelationshipStatus(characterId) {
        const relationship = this.getRelationship(characterId);
        return relationship.getStatus();
    }
    
    /**
     * Record an interaction event with a character
     * @param {String} characterId - Character identifier
     * @param {String} eventType - Type of event
     * @param {Object} details - Event details
     */
    recordInteraction(characterId, eventType, details = {}) {
        const relationship = this.getRelationship(characterId);
        relationship.recordEvent(eventType, details);
    }
    
    /**
     * Set a relationship flag for a character
     * @param {String} characterId - Character identifier
     * @param {String} flag - The flag to set
     * @param {*} value - The value to set
     */
    setRelationshipFlag(characterId, flag, value) {
        const relationship = this.getRelationship(characterId);
        relationship.setFlag(flag, value);
    }
    
    /**
     * Check if a character has a relationship flag
     * @param {String} characterId - Character identifier
     * @param {String} flag - The flag to check
     * @returns {Boolean} If the flag is set
     */
    hasRelationshipFlag(characterId, flag) {
        const relationship = this.getRelationship(characterId);
        return relationship.hasFlag(flag);
    }
    
    /**
     * Save relationships to local storage
     */
    saveRelationships() {
        localStorage.setItem('relationships', JSON.stringify(this.relationships));
    }
    
    /**
     * Load relationships from local storage
     */
    loadRelationships() {
        const saved = localStorage.getItem('relationships');
        if (saved) {
            const data = JSON.parse(saved);
            
            // Convert plain objects back to CharacterRelationship instances
            Object.keys(data).forEach(characterId => {
                this.relationships[characterId] = new CharacterRelationship(
                    characterId, 
                    data[characterId]
                );
            });
        }
    }
    
    /**
     * Reset all relationships
     */
    resetRelationships() {
        this.relationships = {};
    }
}

// Export singleton instance
export const relationshipManager = new RelationshipManager();

// Event types for relationship interactions
export const RelationshipEventType = {
    HELPED: 'helped',
    BETRAYED: 'betrayed',
    SAVED_LIFE: 'saved_life',
    ENDANGERED: 'endangered',
    FOUGHT_ALONGSIDE: 'fought_alongside',
    FOUGHT_AGAINST: 'fought_against',
    GAVE_GIFT: 'gave_gift',
    INSULTED: 'insulted',
    PRAISED: 'praised',
    SHARED_SECRET: 'shared_secret'
};

// Export for use in other modules
export default relationshipManager;