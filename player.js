// Player character state
const playerState = {
    strength: 5,
    agility: 5,
    intelligence: 5,
    charisma: 5,
    health: 100,
    maxHealth: 100,
    energy: 65,
    maxEnergy: 65,
    fatigue: 0,
    reputation: 0,
    blackRaven: 0,
    whiteRaven: 0,
    gold: 10,
    inventory: []
};

// Functions to update player state
function updatePlayerAttribute(attribute, value) {
    if (playerState.hasOwnProperty(attribute)) {
        playerState[attribute] += value;
        return true;
    }
    console.error(`Attribute ${attribute} does not exist on playerState`);
    return false;
}

function addInventoryItem(item) {
    playerState.inventory.push(item);
}

function removeInventoryItem(item) {
    const index = playerState.inventory.indexOf(item);
    if (index !== -1) {
        playerState.inventory.splice(index, 1);
        return true;
    }
    return false;
}

export { playerState, updatePlayerAttribute, addInventoryItem, removeInventoryItem };
