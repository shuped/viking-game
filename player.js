// Player character state management

// Initial stat bundles for different character types
const STAT_BUNDLES = {
    DEFAULT: {
        strength: 5,
        agility: 5,
        endurance: 5,
        coordination: 5,
        vitality: 5,
        weaponSkill: 5,
        health: 100,
        maxHealth: 100,
        energy: 65,
        maxEnergy: 65,
        fatigue: 0,
        maxFatigue: 100,
        reputation: 0,
        blackRaven: 0,
        whiteRaven: 0,
        gold: 10
    },
    WARRIOR: {
        strength: 8,
        agility: 6,
        endurance: 6,
        coordination: 4,
        vitality: 6,
        weaponSkill: 8,
        health: 120,
        maxHealth: 120,
        energy: 60,
        maxEnergy: 60,
        fatigue: 0,
        maxFatigue: 100,
        reputation: 0,
        blackRaven: 0,
        whiteRaven: 0,
        gold: 8
    },
    EXPLORER: {
        strength: 4,
        agility: 7,
        endurance: 6,
        coordination: 7,
        vitality: 5,
        weaponSkill: 4,
        health: 90,
        maxHealth: 90,
        energy: 70,
        maxEnergy: 70,
        fatigue: 0,
        maxFatigue: 100,
        reputation: 0,
        blackRaven: 0,
        whiteRaven: 0,
        gold: 12
    },
    SHIELDMAIDEN: {
        strength: 6,
        agility: 8,
        endurance: 5,
        coordination: 6,
        vitality: 4,
        weaponSkill: 7,
        health: 100,
        maxHealth: 100,
        energy: 75,
        maxEnergy: 75,
        fatigue: 0,
        maxFatigue: 100,
        reputation: 0,
        blackRaven: 0,
        whiteRaven: 0,
        gold: 10
    }
};

// Private player state object - will be exported via getters and setters
const _playerState = {
    ...STAT_BUNDLES.DEFAULT, // Initialize with default stats
    inventory: [],
    
    // Background attributes for story options
    background: null,
    
    // Special flags for gameplay events
    flags: {}
};

// Public player state object with getters - this is what we export
const playerState = {};

// Create getters for all properties in _playerState
for (const key in _playerState) {
    if (key === 'inventory' || key === 'flags') {
        // For objects, return a copy to prevent direct mutation
        Object.defineProperty(playerState, key, {
            get: function() { return [..._playerState[key]]; }
        });
    } else {
        Object.defineProperty(playerState, key, {
            get: function() { return _playerState[key]; },
            set: function(value) { _playerState[key] = value; }
        });
    }
}

// Functions to update player state
function updatePlayerAttribute(attribute, value) {
    if (_playerState.hasOwnProperty(attribute)) {
        _playerState[attribute] += value;
        return true;
    }
    console.error(`Attribute ${attribute} does not exist on playerState`);
    return false;
}

function setPlayerAttribute(attribute, value) {
    if (_playerState.hasOwnProperty(attribute)) {
        _playerState[attribute] = value;
        return true;
    }
    console.error(`Attribute ${attribute} does not exist on playerState`);
    return false;
}

function addInventoryItem(item) {
    _playerState.inventory.push(item);
}

function removeInventoryItem(item) {
    const index = _playerState.inventory.findIndex(i => i.name === item.name);
    if (index !== -1) {
        _playerState.inventory.splice(index, 1);
        return true;
    }
    return false;
}

function initializePlayerStats(characterType = 'DEFAULT') {
    // Reset player stats with the selected bundle
    const bundle = STAT_BUNDLES[characterType] || STAT_BUNDLES.DEFAULT;
    
    // Copy all stats from bundle to _playerState
    for (const key in bundle) {
        _playerState[key] = bundle[key];
    }
    
    // Clear inventory
    _playerState.inventory = [];
    
    // Reset flags
    _playerState.flags = {};
    
    console.log(`Player initialized with ${characterType} stat bundle`);
}

function getInventoryItems() {
    return [..._playerState.inventory];
}

function setPlayerFlag(flag, value = true) {
    _playerState.flags[flag] = value;
}

function getPlayerFlag(flag) {
    return _playerState.flags[flag] || false;
}

// For debugging purposes
window.debugPlayerState = () => ({..._playerState});

export { 
    playerState, 
    updatePlayerAttribute, 
    setPlayerAttribute,
    addInventoryItem, 
    removeInventoryItem,
    getInventoryItems,
    initializePlayerStats,
    setPlayerFlag,
    getPlayerFlag,
    STAT_BUNDLES
};
