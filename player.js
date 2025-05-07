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
        gold: 10,
        level: 1,
        exp: 0,
        skillPoints: 10,
        armorValue: 0, // Added armor value for damage reduction
        // Weapon experience and levels
        weaponExp: {
            sword: 0,
            mace: 0,
            axe: 0,
            polearm: 0
        },
        weaponLevel: {
            sword: 1,
            mace: 1,
            axe: 1,
            polearm: 1
        }
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
        gold: 8,
        level: 1,
        exp: 0,
        skillPoints: 0,
        armorValue: 0, // Added armor value for damage reduction
        // Weapon experience and levels
        weaponExp: {
            sword: 0,
            mace: 0,
            axe: 0,
            polearm: 0
        },
        weaponLevel: {
            sword: 1,
            mace: 1,
            axe: 1,
            polearm: 1
        }
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
        gold: 12,
        level: 1,
        exp: 0,
        skillPoints: 0,
        armorValue: 0, // Added armor value for damage reduction
        // Weapon experience and levels
        weaponExp: {
            sword: 0,
            mace: 0,
            axe: 0,
            polearm: 0
        },
        weaponLevel: {
            sword: 1,
            mace: 1,
            axe: 1,
            polearm: 1
        }
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
        gold: 10,
        level: 1,
        exp: 0,
        skillPoints: 0,
        armorValue: 0, // Added armor value for damage reduction
        // Weapon experience and levels
        weaponExp: {
            sword: 0,
            mace: 0,
            axe: 0,
            polearm: 0
        },
        weaponLevel: {
            sword: 1,
            mace: 1,
            axe: 1,
            polearm: 1
        }
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
window.playerState = playerState;
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

// Experience and level functions
function addExperience(amount) {
    if (amount <= 0) return;
    
    _playerState.exp += amount;
    console.log(`Added ${amount} experience. Total: ${_playerState.exp}`);
    
    // Check for level up
    checkForLevelUp();
    
    // Return true if the player leveled up
    return _playerState.exp >= _playerState.level * 100;
}

function checkForLevelUp() {
    const expToLevel = _playerState.level * 100;
    
    if (_playerState.exp >= expToLevel) {
        // Level up the player
        _playerState.level += 1;
        _playerState.exp -= expToLevel;
        
        // Add skill points instead of automatically increasing stats
        _playerState.skillPoints += 3;
        
        // Increase max health and energy - these still increase automatically
        _playerState.maxHealth += 10;
        _playerState.health = _playerState.maxHealth;
        _playerState.maxEnergy += 5;
        _playerState.energy = _playerState.maxEnergy;
        
        console.log(`Level up! Player is now level ${_playerState.level} and gained 3 skill points (total: ${_playerState.skillPoints})`);
        
        // Check for additional level ups if we gained enough exp
        checkForLevelUp();
        
        return true;
    }
    
    return false;
}

function getCurrentLevelProgress() {
    const expToLevel = _playerState.level * 100;
    return {
        currentExp: _playerState.exp,
        requiredExp: expToLevel,
        progress: (_playerState.exp / expToLevel) * 100
    };
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

// Weapon experience and level functions
function addWeaponExperience(weaponType, amount) {
    if (!weaponType || amount <= 0) return false;
    
    // Make sure the weapon type is valid
    if (!_playerState.weaponExp.hasOwnProperty(weaponType)) {
        console.error(`Weapon type ${weaponType} does not exist`);
        return false;
    }
    
    // Add experience to the weapon type
    _playerState.weaponExp[weaponType] += amount;
    console.log(`Added ${amount} experience to ${weaponType}. Total: ${_playerState.weaponExp[weaponType]}`);
    
    // Check for weapon level up
    checkForWeaponLevelUp(weaponType);
    
    return true;
}

function checkForWeaponLevelUp(weaponType) {
    if (!_playerState.weaponExp.hasOwnProperty(weaponType)) {
        console.error(`Weapon type ${weaponType} does not exist`);
        return false;
    }
    
    const currentLevel = _playerState.weaponLevel[weaponType];
    const expToLevel = currentLevel * 100;
    
    if (_playerState.weaponExp[weaponType] >= expToLevel) {
        // Level up the weapon type
        _playerState.weaponLevel[weaponType] += 1;
        _playerState.weaponExp[weaponType] -= expToLevel;
        
        console.log(`${weaponType.charAt(0).toUpperCase() + weaponType.slice(1)} mastery increased to level ${_playerState.weaponLevel[weaponType]}!`);
        
        // Check for additional level ups if we gained enough exp
        checkForWeaponLevelUp(weaponType);
        
        return true;
    }
    
    return false;
}

function getWeaponTypeLevel(weaponType) {
    if (!_playerState.weaponLevel.hasOwnProperty(weaponType)) {
        return 0;
    }
    return _playerState.weaponLevel[weaponType];
}

function getWeaponTypeLevelProgress(weaponType) {
    if (!_playerState.weaponExp.hasOwnProperty(weaponType)) {
        return { currentExp: 0, requiredExp: 100, progress: 0 };
    }
    
    const currentLevel = _playerState.weaponLevel[weaponType];
    const expToLevel = currentLevel * 100;
    const currentExp = _playerState.weaponExp[weaponType];
    
    return {
        currentExp,
        requiredExp: expToLevel,
        progress: (currentExp / expToLevel) * 100
    };
}

// Get weapon type damage bonus based on mastery level
function getWeaponTypeDamageBonus(weaponType) {
    if (!_playerState.weaponLevel.hasOwnProperty(weaponType)) {
        return 0;
    }
    // Each level adds 2 damage (starting from level 2)
    return (_playerState.weaponLevel[weaponType] - 1) * 2;
}

// Directly set weapon level and exp for testing/simulator purposes
function setWeaponLevel(weaponType, level) {
    if (!_playerState.weaponLevel.hasOwnProperty(weaponType)) {
        console.error(`Weapon type ${weaponType} does not exist`);
        return false;
    }
    
    _playerState.weaponLevel[weaponType] = level;
    _playerState.weaponExp[weaponType] = 0; // Reset exp when setting level directly
    return true;
}

// For debugging purposes
window.debugPlayerState = () => ({..._playerState});

export { 
    playerState, 
    updatePlayerAttribute, 
    setPlayerAttribute,
    addExperience,
    checkForLevelUp,
    getCurrentLevelProgress,
    addInventoryItem, 
    removeInventoryItem,
    getInventoryItems,
    initializePlayerStats,
    setPlayerFlag,
    getPlayerFlag,
    addWeaponExperience,
    checkForWeaponLevelUp,
    getWeaponTypeLevel,
    getWeaponTypeLevelProgress,
    getWeaponTypeDamageBonus,
    setWeaponLevel,
    STAT_BUNDLES
};
