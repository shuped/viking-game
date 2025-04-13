import { playerState } from './player.js';
import { transitionToScreen } from './transitions.js';
import { displayStoryText } from './story.js';
import { screens } from './main.js';

// Battle System
const battleState = {
    playerHealth: 100,
    playerMaxHealth: 100,
    playerEnergy: 65,
    playerMaxEnergy: 65,
    enemyHealth: 100,
    enemyMaxHealth: 100,
    enemyName: 'Saxon Warrior',
    turnCount: 0,
    battlePhase: 'player', // 'player', 'enemy', 'end'
    battleType: 'first', // 'first', 'second'
    battleLog: [],
    isActive: false
};

window.battleState = battleState; // For debugging purposes

function initBattle(battleType) {
    // Reset battle state
    battleState.playerHealth = playerState.health;
    battleState.playerMaxHealth = playerState.maxHealth;
    battleState.playerEnergy = playerState.energy;
    battleState.playerMaxEnergy = playerState.maxEnergy;
    battleState.turnCount = 0;
    battleState.battlePhase = 'player';
    battleState.battleType = battleType;
    battleState.battleLog = [];
    battleState.isActive = true;
    
    // Set enemy stats based on battle type
    if (battleType === 'first') {
        battleState.enemyName = 'Saxon Scout';
        battleState.enemyHealth = 80;
        battleState.enemyMaxHealth = 80;
        
        // Set initial battle message
        updateBattleText("A Saxon scout charges at you, wielding a short sword. The clash of steel rings through the air as your warband engages the enemy.");
    } else {
        battleState.enemyName = 'Saxon Defender';
        battleState.enemyHealth = 120;
        battleState.enemyMaxHealth = 120;
        
        // Set initial battle message
        updateBattleText("A battle-hardened Saxon defender blocks your path to the village. His chainmail glints in the sunlight as he raises his axe, ready to defend his home.");
    }
    
    // Update UI
    updateBattleUI();
    
    // Add event listeners to battle actions
    setupBattleEventListeners();
}

function setupBattleEventListeners() {
    document.querySelectorAll('.battle-action').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            if (battleState.battlePhase === 'player') {
                handlePlayerAction(action);
            }
        });
    });
}

function updateBattleText(text) {
    document.getElementById('battle-text-content').textContent = text;
}

function appendBattleText(text) {
    const currentText = document.getElementById('battle-text-content').textContent;
    document.getElementById('battle-text-content').textContent = currentText + " " + text;
}

function updateBattleUI() {
    // Update health and energy bars
    const hpFill = document.querySelector('.hp-fill');
    const energyFill = document.querySelector('.energy-fill');
    const hpText = document.querySelector('.hp-bar .bar-text');
    const energyText = document.querySelector('.energy-bar .bar-text');
    
    const hpPercentage = (battleState.playerHealth / battleState.playerMaxHealth) * 100;
    const energyPercentage = (battleState.playerEnergy / battleState.playerMaxEnergy) * 100;
    
    hpFill.style.width = hpPercentage + '%';
    energyFill.style.width = energyPercentage + '%';
    
    hpText.textContent = `${battleState.playerHealth} / ${battleState.playerMaxHealth}`;
    energyText.textContent = `${battleState.playerEnergy} / ${battleState.playerMaxEnergy}`;
    
    // Update player name
    document.querySelector('.status-name').textContent = 'Viking Warrior';
    
    // Update action buttons based on available energy
    document.querySelectorAll('.battle-action').forEach(button => {
        const action = button.dataset.action;
        let energyCost = 0;
        
        switch (action) {
            case 'attack': energyCost = 10; break;
            case 'feint': energyCost = 15; break;
            case 'throw': energyCost = 20; break;
            case 'defend': energyCost = 5; break;
            case 'recover': energyCost = 0; break;
            case 'evade': energyCost = 10; break;
        }
        
        if (energyCost > battleState.playerEnergy) {
            button.disabled = true;
            button.style.opacity = '0.5';
        } else {
            button.disabled = false;
            button.style.opacity = '1';
        }
    });
    
    // If battle is over, disable all actions
    if (battleState.battlePhase === 'end') {
        document.querySelectorAll('.battle-action').forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
        });
    }
}

function handlePlayerAction(action) {
    // Prevent actions during enemy turn or when battle is over
    if (battleState.battlePhase !== 'player' || battleState.isActive === false) {
        return;
    }
    
    let damage = 0;
    let energyCost = 0;
    let actionText = '';
    
    // Calculate damage and energy cost based on action
    switch (action) {
        case 'attack':
            damage = Math.floor(5 + Math.random() * 10) + Math.floor(playerState.strength / 2);
            energyCost = 10;
            actionText = `You swing your weapon at the ${battleState.enemyName}, dealing ${damage} damage!`;
            break;
            
        case 'feint':
            damage = Math.floor(8 + Math.random() * 15) + Math.floor(playerState.agility / 2);
            energyCost = 15;
            actionText = `You fake a move and catch the ${battleState.enemyName} off guard, striking for ${damage} damage!`;
            break;
            
        case 'throw':
            damage = Math.floor(12 + Math.random() * 20);
            energyCost = 20;
            actionText = `You throw your weapon with precision, striking the ${battleState.enemyName} for ${damage} damage!`;
            break;
            
        case 'defend':
            damage = 0;
            energyCost = 5;
            battleState.playerDefending = true;
            actionText = `You raise your shield, preparing to block the next attack.`;
            break;
            
        case 'recover':
            damage = 0;
            energyCost = 0;
            const energyRecovered = Math.floor(10 + Math.random() * 10);
            battleState.playerEnergy = Math.min(battleState.playerMaxEnergy, battleState.playerEnergy + energyRecovered);
            actionText = `You take a moment to catch your breath, recovering ${energyRecovered} energy.`;
            break;
            
        case 'evade':
            damage = 0;
            energyCost = 10;
            battleState.playerEvading = true;
            actionText = `You prepare to dodge the next attack, making yourself harder to hit.`;
            break;
    }
    
    // Apply energy cost
    battleState.playerEnergy = Math.max(0, battleState.playerEnergy - energyCost);
    
    // Update battle text
    updateBattleText(actionText);
    
    // Apply damage to enemy
    if (damage > 0) {
        // Play attack animation
        const playerCharacter = document.querySelector('.character-placeholder.viking');
        playerCharacter.classList.add('attack-animation');
        setTimeout(() => {
            playerCharacter.classList.remove('attack-animation');
            
            // Play enemy hurt animation
            const enemyCharacter = document.querySelector('.character-placeholder.saxon');
            enemyCharacter.classList.add('hurt-animation');
            setTimeout(() => {
                enemyCharacter.classList.remove('hurt-animation');
            }, 500);
            
            battleState.enemyHealth = Math.max(0, battleState.enemyHealth - damage);
            
            // Check if enemy is defeated
            if (battleState.enemyHealth <= 0) {
                handleEnemyDefeated();
                return;
            }
            
            // Enemy turn after a short delay
            setTimeout(() => {
                handleEnemyTurn();
            }, 1000);
        }, 500);
    } else {
        // Enemy turn after a short delay
        setTimeout(() => {
            handleEnemyTurn();
        }, 1000);
    }
    
    // Update UI
    updateBattleUI();
}

function handleEnemyTurn() {
    battleState.battlePhase = 'enemy';
    
    // Reset defense and evasion flags
    const wasDefending = battleState.playerDefending || false;
    const wasEvading = battleState.playerEvading || false;
    battleState.playerDefending = false;
    battleState.playerEvading = false;
    
    // Enemy AI - simple random choice
    const enemyActions = ['attack', 'heavy_attack', 'special'];
    const enemyAction = enemyActions[Math.floor(Math.random() * enemyActions.length)];
    
    let damage = 0;
    let actionText = '';
    
    // Calculate enemy damage based on action
    switch (enemyAction) {
        case 'attack':
            damage = Math.floor(5 + Math.random() * 8);
            actionText = `The ${battleState.enemyName} swings their weapon at you`;
            break;
            
        case 'heavy_attack':
            damage = Math.floor(10 + Math.random() * 5);
            actionText = `The ${battleState.enemyName} delivers a powerful blow`;
            break;
            
        case 'special':
            if (battleState.battleType === 'first') {
                damage = Math.floor(8 + Math.random() * 7);
                actionText = `The ${battleState.enemyName} attempts a quick thrust with their sword`;
            } else {
                damage = Math.floor(12 + Math.random() * 8);
                actionText = `The ${battleState.enemyName} swings their axe in a wide arc`;
            }
            break;
    }
    
    // Apply defense or evasion effects
    if (wasDefending) {
        damage = Math.floor(damage * 0.5);
        actionText += `, but your shield absorbs much of the impact`;
    } else if (wasEvading) {
        if (Math.random() > 0.3) {
            damage = 0;
            actionText += `, but you successfully dodge out of the way`;
        } else {
            actionText += `, and despite your attempt to dodge, the attack connects`;
        }
    }
    
    // Play enemy attack animation
    const enemyCharacter = document.querySelector('.character-placeholder.saxon');
    enemyCharacter.classList.add('attack-animation');
    
    setTimeout(() => {
        enemyCharacter.classList.remove('attack-animation');
        
        if (damage > 0) {
            // Play player hurt animation
            const playerCharacter = document.querySelector('.character-placeholder.viking');
            playerCharacter.classList.add('hurt-animation');
            setTimeout(() => {
                playerCharacter.classList.remove('hurt-animation');
            }, 500);
            
            // Apply damage to player
            battleState.playerHealth = Math.max(0, battleState.playerHealth - damage);
            actionText += `, dealing ${damage} damage!`;
        } else {
            actionText += `.`;
        }
        
        // Update battle text
        updateBattleText(actionText);
        
        // Check if player is defeated
        if (battleState.playerHealth <= 0) {
            handlePlayerDefeated();
            return;
        }
        
        // Return to player turn
        setTimeout(() => {
            battleState.battlePhase = 'player';
            battleState.turnCount++;
            updateBattleUI();
            appendBattleText(" What will you do?");
        }, 1000);
    }, 500);
    
    // Update UI
    updateBattleUI();
}

function handlePlayerDefeated() {
    battleState.battlePhase = 'end';
    battleState.isActive = false;
    
    // Show defeat message
    updateBattleText(`You have fallen in battle. The world grows dark around you...`);
    
    // After a delay, show game over or restart option
    setTimeout(() => {
        appendBattleText(" (Click to try again)");
        document.getElementById('battle-scene').addEventListener('click', restartBattle);
    }, 2000);
    
    // Update UI
    updateBattleUI();
}

function handleEnemyDefeated() {
    battleState.battlePhase = 'end';
    battleState.isActive = false;
    
    // Update player state with battle results
    playerState.health = battleState.playerHealth;
    playerState.energy = battleState.playerEnergy;
    
    // Show victory message
    updateBattleText(`The ${battleState.enemyName} falls before your might! Victory is yours!`);
    
    // After a delay, return to story
    setTimeout(() => {
        appendBattleText(" (Click to continue)");
        document.getElementById('battle-scene').addEventListener('click', returnToStory);
    }, 2000);
    
    // Update UI
    updateBattleUI();
}

function restartBattle() {
    // Remove event listener to prevent multiple calls
    document.getElementById('battle-scene').removeEventListener('click', restartBattle);
    
    // Reset player health
    playerState.health = playerState.maxHealth;
    playerState.energy = playerState.maxEnergy;
    
    // Restart the battle
    initBattle(battleState.battleType);
}

function returnToStory() {
    // Remove event listener to prevent multiple calls
    document.getElementById('battle-scene').removeEventListener('click', returnToStory);
    
    // Determine which story node to return to based on battle type
    let nextNodeId;
    if (battleState.battleType === 'first') {
        nextNodeId = 12; // After first battle
    } else {
        nextNodeId = 23; // After second battle
    }
    
    // Transition back to story screen
    transitionToScreen(screens.battle, screens.cinematicUI, () => {
        displayStoryText(nextNodeId);
    });
}

export { initBattle, battleState };