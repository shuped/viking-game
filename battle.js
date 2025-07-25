import { playerState, addExperience, addWeaponExperience, getWeaponTypeLevel, getWeaponTypeLevelProgress, getWeaponTypeDamageBonus } from './player.js';
import { transitionToScreen } from './transitions.js';
import { displayStoryText } from './story.js';
import { screens } from './main.js';
import { getEquippedWeapon, weaponAbilities, findAbilityById } from './weapons.js';
import { refreshCharacterUI } from './character.js';
import { applyModifiers,ModifierType, processStatusEffects, calculateCriticalHit } from './combat-modifiers.js';

// Enemy types with their stats and experience rewards
const ENEMY_TYPES = {
    SAXON_SCOUT: {
        name: 'Saxon Scout',
        health: 80,
        maxHealth: 80,
        energy: 70,
        maxEnergy: 70,
        agility: 6,
        endurance: 4,
        weaponSkill: 5,
        coordination: 4,
        description: "A quick and agile Saxon scout equipped with a short sword.",
        expReward: 50
    },
    SAXON_DEFENDER: {
        name: 'Saxon Defender',
        health: 120,
        maxHealth: 120,
        energy: 60,
        maxEnergy: 60,
        agility: 4,
        endurance: 7,
        weaponSkill: 6,
        coordination: 6,
        description: "A battle-hardened Saxon defender with chainmail and a heavy axe.",
        expReward: 100
    },
    SAXON_BERSERKER: {
        name: 'Saxon Berserker',
        health: 150,
        maxHealth: 150,
        energy: 80,
        maxEnergy: 80,
        agility: 7,
        endurance: 7,
        weaponSkill: 8,
        coordination: 5,
        description: "A fearsome Saxon berserker who fights with reckless abandon.",
        expReward: 150
    }
};

// Function to calculate damage reduction from armor
function calculateDamageReduction(armorValue) {
    // Base formula: Each point of armor reduces damage by 2%, capped at 75%
    const damageReduction = Math.min(0.75, armorValue * 0.02);
    return damageReduction;
}

// Battle state
let enemy = null;
let battleType = '';
let battleActive = false;
let playerDefending = false;
let currentTurn = 'player';

// Battle System
const battleState = {
    playerHealth: 100,
    playerMaxHealth: 100,
    playerEnergy: 65,
    playerMaxEnergy: 65,
    enemyHealth: 100,
    enemyMaxHealth: 100,
    enemyEnergy: 60,
    enemyMaxEnergy: 60,
    enemyAgility: 5,
    enemyEndurance: 5,
    enemyWeaponSkill: 5,
    enemyCoordination: 5,
    enemyName: 'Saxon Warrior',
    enemyType: null, // Reference to the enemy type
    turnCount: 0,
    battlePhase: 'player',
    battleType: 'first',
    battleLog: [],
    isActive: false,
    showingWeaponAbilities: false,
    equippedWeapon: null,
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
    battleState.showingWeaponAbilities = false;
    battleState.equippedWeapon = getEquippedWeapon(); // Set player's equipped weapon
    
    // Set enemy stats based on battle type
    if (battleType === 'first') {
        battleState.enemyType = ENEMY_TYPES.SAXON_SCOUT;
    } else {
        battleState.enemyType = ENEMY_TYPES.SAXON_DEFENDER;
    }

    const enemyType = battleState.enemyType;
    battleState.enemyName = enemyType.name;
    battleState.enemyHealth = enemyType.health;
    battleState.enemyMaxHealth = enemyType.maxHealth;
    battleState.enemyEnergy = enemyType.energy;
    battleState.enemyMaxEnergy = enemyType.maxEnergy;
    battleState.enemyAgility = enemyType.agility;
    battleState.enemyEndurance = enemyType.endurance;
    battleState.enemyWeaponSkill = enemyType.weaponSkill;
    battleState.enemyCoordination = enemyType.coordination;

    // Set initial battle message
    updateBattleText(enemyType.description);
    
    // Update UI
    updateBattleUI();
    
    // Add event listeners to battle actions
    setupBattleEventListeners();
}

// New function: Calculate hit chance based on attacker's and defender's stats with full context
function calculateHitChance(options = {}) {
    // Extract parameters from options object with default values
    const {
        attackerWeaponSkill = 5,
        defenderAgility = 5,
        defenderEnergy = 50,
        defenderMaxEnergy = 50,
        defenderEndurance = 5,
        abilityModifier = 0,
        isDefending = false,
        context = {}
    } = options;
    
    const baseHitChance = 0.60; // 60% base chance to hit
    const weaponSkillBonus = attackerWeaponSkill * 0.04; // Each point of weapon skill adds 4%
    const agilityPenalty = defenderAgility * 0.05; // Each point of agility reduces chance by 5%
    
    // Energy factor: as energy decreases, dodge chance decreases (easier to hit)
    const energyProportion = Math.max(0, defenderEnergy / defenderMaxEnergy);
    const energyFactor = (1 - energyProportion) * defenderEndurance * 0.03;
    
    // Calculate initial hit chance
    let hitChance = baseHitChance + weaponSkillBonus - (agilityPenalty * energyProportion) + energyFactor;
    
    // Apply ability-specific modifier
    hitChance += abilityModifier;
    
    // Apply defending status (-30% chance to hit if defender is defending)
    if (isDefending) {
        hitChance -= 0.3;
    }
    
    // Apply any modifiers from the combat modifiers system
    if (context.abilityId || context.weaponType) {
        hitChance = applyModifiers(hitChance, ModifierType.HIT_CHANCE, context);
    }
    
    // Cap between 10% and 95% chance
    hitChance = Math.min(0.95, Math.max(0.1, hitChance));
    
    return hitChance;
}

// Calculate feint success chance based on attacker's agility and defender's coordination
function calculateFeintChance(attackerAgility, defenderCoordination, context = {}) {
    // Calculate base success chance
    let successChance = 0.5 + ((attackerAgility - defenderCoordination) * 0.05);
    
    // Apply any modifiers from the combat modifiers system
    if (context.abilityId || context.weaponType) {
        const { ModifierType, applyModifiers } = require('./combat-modifiers.js');
        successChance = applyModifiers(successChance, ModifierType.FEINT_CHANCE, context);
    }
    
    // Cap between 20% and 90%
    successChance = Math.min(0.9, Math.max(0.2, successChance));
    
    return successChance;
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
    
    // Calculate feint success chance for button text
    const feintChance = calculateFeintChance(playerState.agility, battleState.enemyCoordination);
    const feintSuccessPercent = Math.round(feintChance * 100);
    
    // Update action buttons based on available energy
    document.querySelectorAll('.battle-action').forEach(button => {
        const action = button.dataset.action;
        let energyCost = 0;
        
        switch (action) {
            case 'attack': 
                energyCost = 10; 
                button.textContent = 'Attack';
                break;
            case 'feint': 
                energyCost = 5;
                button.textContent = `Feint (${feintSuccessPercent}%)`;
                break;
            case 'throw': 
                energyCost = 20; 
                button.textContent = 'Throw';
                break;
            case 'defend': 
                energyCost = 5; 
                button.textContent = 'Defend';
                break;
            case 'recover': 
                energyCost = 0; 
                button.textContent = 'Recover';
                break;
            case 'evade': 
                energyCost = 10; 
                button.textContent = 'Evade';
                break;
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
    
    // Special case for Attack - show weapon abilities instead of attacking directly
    if (action === 'attack') {
        showWeaponAbilitySelection();
        return;
    }
    
    let potentialDamage = 0;
    let energyCost = 0;
    let actionText = '';
    
    // Calculate potential damage and energy cost based on action
    switch (action) {           
        case 'feint':
            // Feint has no direct damage but can drain enemy energy if successful
            potentialDamage = 0;
            // Initial cost is 5, but will be updated to 10 if the feint misses
            energyCost = 5;
            actionText = `You feint an attack, trying to tire out the ${battleState.enemyName}`;
            break;
            
        case 'throw':
            potentialDamage = Math.floor(12 + Math.random() * 20);
            energyCost = 20;
            actionText = `You throw your weapon with precision at the ${battleState.enemyName}`;
            break;
            
        case 'defend':
            potentialDamage = 0;
            energyCost = 5;
            battleState.playerDefending = true;
            actionText = `You raise your shield, preparing to block the next attack.`;
            break;
            
        case 'recover':
            potentialDamage = 0;
            energyCost = 0;
            const energyRecovered = Math.floor(10 + Math.random() * 10);
            battleState.playerEnergy = Math.min(battleState.playerMaxEnergy, battleState.playerEnergy + energyRecovered);
            actionText = `You take a moment to catch your breath, recovering ${energyRecovered} energy.`;
            break;
            
        case 'evade':
            potentialDamage = 0;
            energyCost = 10;
            battleState.playerEvading = true;
            actionText = `You prepare to dodge the next attack, making yourself harder to hit.`;
            break;
    }
    
    // Apply energy cost
    battleState.playerEnergy = Math.max(0, battleState.playerEnergy - energyCost);
    
    // Update battle text
    updateBattleText(actionText);
    
    // Apply damage to enemy if applicable
    if (potentialDamage > 0) {
        // Calculate hit chance using our centralized function with options object
        const hitChance = calculateHitChance({
            attackerWeaponSkill: playerState.weaponSkill,
            defenderAgility: battleState.enemyAgility,
            defenderEnergy: battleState.enemyEnergy,
            defenderMaxEnergy: battleState.enemyMaxEnergy,
            defenderEndurance: battleState.enemyEndurance
        });
        
        // Play attack animation
        const playerCharacter = document.querySelector('.character-placeholder.viking');
        playerCharacter.classList.add('attack-animation');
        
        setTimeout(() => {
            playerCharacter.classList.remove('attack-animation');
            
            // Determine if attack hits
            const roll = Math.random();
            if (roll <= hitChance) {
                // Attack hits!
                // Play enemy hurt animation
                const enemyCharacter = document.querySelector('.character-placeholder.saxon');
                enemyCharacter.classList.add('hurt-animation');
                setTimeout(() => {
                    enemyCharacter.classList.remove('hurt-animation');
                }, 500);
                
                // Apply damage and reduce enemy energy
                battleState.enemyHealth = Math.max(0, battleState.enemyHealth - potentialDamage);
                battleState.enemyEnergy = Math.max(0, battleState.enemyEnergy - Math.floor(potentialDamage * 0.3));
                appendBattleText(`, dealing ${potentialDamage} damage!`);
                
                // Check if enemy is defeated
                if (battleState.enemyHealth <= 0) {
                    handleEnemyDefeated();
                    return;
                }
            } else {
                // Attack misses!
                appendBattleText(`, but the ${battleState.enemyName} dodges your attack!`);
            }
            
            // Enemy turn after a short delay
            setTimeout(() => {
                handleEnemyTurn();
            }, 1000);
        }, 500);
    } else if (action === 'feint') {
        // For feint, use the centralized feint calculation with context
        const playerAgility = playerState.agility;
        const enemyCoordination = battleState.enemyCoordination || 5; // Default to 5 if not defined
        
        // Provide a context for modifiers to use
        const context = {
            abilityId: 'feint',
            weaponType: battleState.equippedWeapon?.weaponType
        };
        
        const successChance = calculateFeintChance(playerAgility, enemyCoordination, context);
        
        // Play feint animation
        const playerCharacter = document.querySelector('.character-placeholder.viking');
        playerCharacter.classList.add('attack-animation');
        
        setTimeout(() => {
            playerCharacter.classList.remove('attack-animation');
            
            // Determine if feint is successful
            const roll = Math.random();
            if (roll <= successChance) {
                // Feint succeeds - reduce enemy energy by 15
                const energyReduction = 15;
                battleState.enemyEnergy = Math.max(0, battleState.enemyEnergy - energyReduction);
                appendBattleText(`, successfully tiring out your opponent and draining ${energyReduction} energy!`);
            } else {
                // Feint fails - costs additional energy (10 total instead of 5)
                battleState.playerEnergy = Math.max(0, battleState.playerEnergy - 5); // Additional 5 energy cost
                appendBattleText(`, but the ${battleState.enemyName} doesn't fall for it!`);
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
    
    // Process any status effects on the enemy at the start of the turn
    processStatusEffects(battleState);
    
    // If there's a status effect message, display it before continuing
    if (battleState.lastStatusMessage) {
        updateBattleText(battleState.lastStatusMessage);
        battleState.lastStatusMessage = null;
        
        // Check if enemy is defeated by status effects
        if (battleState.enemyHealth <= 0) {
            setTimeout(() => {
                handleEnemyDefeated();
            }, 1000);
            return;
        }
        
        // Wait a moment before continuing with enemy turn
        setTimeout(() => {
            continueEnemyTurn();
        }, 1000);
        
        return;
    }
    
    // If no status effects, continue with enemy turn immediately
    continueEnemyTurn();
}

function continueEnemyTurn() {
    // Reset defense and evasion flags
    const wasDefending = battleState.playerDefending || false;
    const wasEvading = battleState.playerEvading || false;
    battleState.playerDefending = false;
    battleState.playerEvading = false;
    
    // If enemy is stunned, skip their action
    if (battleState.enemyStunned) {
        updateBattleText(`The ${battleState.enemyName} is stunned and cannot act!`);
        battleState.enemyStunned = false; // Clear stun after skipping turn
        
        // Return to player turn
        setTimeout(() => {
            battleState.battlePhase = 'player';
            battleState.turnCount++;
            updateBattleUI();
            appendBattleText(" What will you do?");
        }, 1000);
        
        return;
    }
    
    // Enemy AI - simple random choice
    const enemyActions = ['attack', 'heavy_attack', 'special'];
    
    // If enemy is low on energy, they might recover
    if (battleState.enemyEnergy < battleState.enemyMaxEnergy * 0.3 && Math.random() > 0.5) {
        const energyRecovered = Math.floor(8 + Math.random() * 7);
        battleState.enemyEnergy = Math.min(battleState.enemyMaxEnergy, battleState.enemyEnergy + energyRecovered);
        updateBattleText(`The ${battleState.enemyName} takes a moment to recover, regaining ${energyRecovered} energy.`);
        
        // Return to player turn
        setTimeout(() => {
            battleState.battlePhase = 'player';
            battleState.turnCount++;
            updateBattleUI();
            appendBattleText(" What will you do?");
        }, 1000);
        
        return;
    }
    
    const enemyAction = enemyActions[Math.floor(Math.random() * enemyActions.length)];
    
    let potentialDamage = 0;
    let energyCost = 0;
    let actionText = '';
    
    // Calculate enemy potential damage based on action
    switch (enemyAction) {
        case 'attack':
            potentialDamage = Math.floor(5 + Math.random() * 8);
            energyCost = 8;
            actionText = `The ${battleState.enemyName} swings their weapon at you`;
            break;
            
        case 'heavy_attack':
            potentialDamage = Math.floor(10 + Math.random() * 5);
            energyCost = 15;
            actionText = `The ${battleState.enemyName} delivers a powerful blow`;
            break;
            
        case 'special':
            if (battleState.battleType === 'first') {
                potentialDamage = Math.floor(8 + Math.random() * 7);
                energyCost = 12;
                actionText = `The ${battleState.enemyName} attempts a quick thrust with their sword`;
            } else {
                potentialDamage = Math.floor(12 + Math.random() * 8);
                energyCost = 18;
                actionText = `The ${battleState.enemyName} swings their axe in a wide arc`;
            }
            break;
    }
    
    // Reduce enemy energy
    battleState.enemyEnergy = Math.max(0, battleState.enemyEnergy - energyCost);
    
    // Create context for combat modifiers
    const context = {
        abilityId: enemyAction,
        weaponType: battleState.battleType === 'first' ? 'sword' : 'axe'
    };
    
    // Calculate hit chance using our centralized function
    const hitChance = calculateHitChance({
        attackerWeaponSkill: battleState.enemyWeaponSkill,
        defenderAgility: playerState.agility,
        defenderEnergy: battleState.playerEnergy,
        defenderMaxEnergy: battleState.playerMaxEnergy,
        defenderEndurance: playerState.endurance,
        isDefending: wasDefending,
        context
    });
    
    // Apply defense or evasion effects
    if (wasDefending) {
        potentialDamage = Math.floor(potentialDamage * 0.5);
        actionText += `, targeting your shield`;
    } else if (wasEvading) {
        actionText += `, as you try to dodge`;
    }
    
    // Play enemy attack animation
    const enemyCharacter = document.querySelector('.character-placeholder.saxon');
    enemyCharacter.classList.add('attack-animation');
    
    setTimeout(() => {
        enemyCharacter.classList.remove('attack-animation');
        
        // Determine if attack hits
        const roll = Math.random();
        if (roll <= hitChance) {
            // Play player hurt animation
            const playerCharacter = document.querySelector('.character-placeholder.viking');
            playerCharacter.classList.add('hurt-animation');
            setTimeout(() => {
                playerCharacter.classList.remove('hurt-animation');
            }, 500);
            
            // Apply damage reduction from armor
            const damageReduction = calculateDamageReduction(playerState.armorValue);
            const finalDamage = Math.floor(potentialDamage * (1 - damageReduction));
            
            // Apply damage to player and reduce energy
            battleState.playerHealth = Math.max(0, battleState.playerHealth - finalDamage);
            battleState.playerEnergy = Math.max(0, battleState.playerEnergy - Math.floor(finalDamage * 0.2));
            
            if (wasDefending) {
                actionText += `, but your shield absorbs much of the impact, taking ${finalDamage} damage!`;
            } else if (wasEvading) {
                actionText += `, and despite your attempt to dodge, the attack connects for ${finalDamage} damage!`;
            } else {
                if (playerState.armorValue > 0) {
                    actionText += `, dealing ${finalDamage} damage! (${Math.round(damageReduction * 100)}% reduced by armor)`;
                } else {
                    actionText += `, dealing ${finalDamage} damage!`;
                }
            }
        } else {
            if (wasEvading) {
                actionText += `, but you successfully dodge out of the way!`;
            } else {
                actionText += `, but misses as you narrowly avoid the strike!`;
            }
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
    
    // Get currently equipped weapon
    const equippedWeapon = battleState.equippedWeapon;
    
    // Get enemy experience reward
    const experienceReward = battleState.enemyType.expReward;
    
    // Add weapon experience if we have a valid weapon and weapon type
    if (equippedWeapon && equippedWeapon.weaponType) {
        addWeaponExperience(equippedWeapon.weaponType, experienceReward);
        
        // Get updated weapon level for the message
        const weaponLevel = getWeaponTypeLevel(equippedWeapon.weaponType);
        const levelProgress = getWeaponTypeLevelProgress(equippedWeapon.weaponType);
        
        // Show victory message with weapon experience
        updateBattleText(`The ${battleState.enemyName} falls before your might! Victory is yours! You gained ${experienceReward} ${equippedWeapon.weaponType} experience. (Level ${weaponLevel}: ${levelProgress.currentExp}/${levelProgress.requiredExp})`);
    } else {
        // Fallback if no weapon type is available
        updateBattleText(`The ${battleState.enemyName} falls before your might! Victory is yours!`);
    }
    
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

// Helper function for creating ability buttons
function createAbilityButton(ability, weapon) {
    // Create context for combat calculations
    const context = {
        weaponType: weapon.weaponType,
        abilityId: ability.id
    };
    
    // Calculate hit chance for this ability using the centralized function
    const hitChance = calculateHitChance({
        attackerWeaponSkill: playerState.weaponSkill,
        defenderAgility: battleState.enemyAgility,
        defenderEnergy: battleState.enemyEnergy,
        defenderMaxEnergy: battleState.enemyMaxEnergy,
        defenderEndurance: battleState.enemyEndurance,
        abilityModifier: ability.hitChanceModifier || 0,
        context
    });
    
    const hitChancePercent = Math.round(hitChance * 100);
    
    // Get weapon mastery damage bonus
    const masteryBonus = getWeaponTypeDamageBonus(weapon.weaponType);
    
    // Calculate damage for hover information with mastery bonus
    const calculatedDamage = ability.calculateDamage(weapon.baseDamage, masteryBonus);
    
    // Create ability button
    const abilityBtn = document.createElement('button');
    abilityBtn.className = 'battle-action weapon-ability';
    abilityBtn.dataset.abilityId = ability.id;
    abilityBtn.textContent = `${ability.name} (${hitChancePercent}%)`;
    
    // Create enhanced hover text with detailed information
    let hoverText = `${ability.name}\n\n`;
    hoverText += `${ability.description}\n`;
    hoverText += `Damage: ~${calculatedDamage}\n`;
    hoverText += `Energy Cost: ${ability.energyCost}`;
    
    abilityBtn.title = hoverText;
    
    // Disable if not enough energy
    if (ability.energyCost > battleState.playerEnergy) {
        abilityBtn.disabled = true;
        abilityBtn.style.opacity = '0.5';
    }
    
    // Add event listener
    abilityBtn.addEventListener('click', () => handleWeaponAbility(ability));
    
    return abilityBtn;
}

// Function to show weapon ability selection UI
function showWeaponAbilitySelection() {
    // Set flag to indicate we're showing weapon abilities
    battleState.showingWeaponAbilities = true;
    
    // Get the currently equipped weapon
    const weapon = battleState.equippedWeapon;
    
    if (!weapon || !weapon.abilities || weapon.abilities.length === 0) {
        console.error("No weapon equipped or weapon has no abilities!");
        return;
    }
    
    // Get the battle actions container
    const actionsContainer = document.getElementById('battle-actions');
    
    // Store the original content to restore later
    if (!battleState.originalActionsHTML) {
        battleState.originalActionsHTML = actionsContainer.innerHTML;
    }
    
    // Clear the container
    actionsContainer.innerHTML = '';
    
    // Create a heading for the weapon abilities
    const weaponHeader = document.createElement('div');
    weaponHeader.className = 'weapon-abilities-header';
    weaponHeader.textContent = `${weapon.name} Abilities:`;
    actionsContainer.appendChild(weaponHeader);
    
    // Get all abilities for this weapon type
    let allAbilities = [...weapon.abilities];
    
    // Add unlocked abilities from the skill tree
    if (playerState.unlockedAbilities && playerState.unlockedAbilities[weapon.weaponType]) {
        const unlockedAbilityIds = playerState.unlockedAbilities[weapon.weaponType];
        
        for (const abilityId of unlockedAbilityIds) {
            // Find the ability in the weaponAbilities collection
            const unlockableAbilities = weaponAbilities[weapon.weaponType]?.unlockable || [];
            const unlockedAbility = unlockableAbilities.find(a => a.id === abilityId);
            
            // Add unlocked ability if found and not already in the list
            if (unlockedAbility && !allAbilities.some(a => a.id === unlockedAbility.id)) {
                allAbilities.push(unlockedAbility);
            }
        }
    }
    
    // Create ability buttons in rows of 3
    const maxButtonsPerRow = 3;
    
    for (let i = 0; i < allAbilities.length; i += maxButtonsPerRow) {
        // Create a new row
        const abilityRow = document.createElement('div');
        abilityRow.className = 'action-row';
        
        // Add up to 3 ability buttons to this row
        const endIndex = Math.min(i + maxButtonsPerRow, allAbilities.length);
        for (let j = i; j < endIndex; j++) {
            const abilityBtn = createAbilityButton(allAbilities[j], weapon);
            abilityRow.appendChild(abilityBtn);
        }
        
        actionsContainer.appendChild(abilityRow);
    }
    
    // Add back button
    const backBtn = document.createElement('button');
    backBtn.className = 'battle-action back-button';
    backBtn.textContent = 'Back';
    backBtn.addEventListener('click', hideWeaponAbilitySelection);
    
    const backRow = document.createElement('div');
    backRow.className = 'action-row';
    backRow.appendChild(backBtn);
    
    actionsContainer.appendChild(backRow);
}

// Function to hide weapon ability selection and restore normal UI
function hideWeaponAbilitySelection() {
    if (!battleState.showingWeaponAbilities) return;
    
    battleState.showingWeaponAbilities = false;
    
    // Restore original battle actions
    if (battleState.originalActionsHTML) {
        const actionsContainer = document.getElementById('battle-actions');
        actionsContainer.innerHTML = battleState.originalActionsHTML;
        
        // Re-attach event listeners
        setupBattleEventListeners();
    }
    
    // Update the UI to refresh button states
    updateBattleUI();
}

// Function to handle when a weapon ability is selected
function handleWeaponAbility(ability) {
    // Hide the weapon ability selection UI
    hideWeaponAbilitySelection();
    
    // Check if player has enough energy
    if (ability.energyCost > battleState.playerEnergy) {
        updateBattleText("You don't have enough energy to use this ability!");
        return;
    }
    
    // Apply energy cost
    battleState.playerEnergy = Math.max(0, battleState.playerEnergy - ability.energyCost);
    
    // Get the weapon's base damage
    const weapon = battleState.equippedWeapon;
    
    // Get the mastery damage bonus for this weapon type
    const masteryBonus = getWeaponTypeDamageBonus(weapon.weaponType);
    
    // Calculate ability damage including mastery bonus
    let potentialDamage = ability.calculateDamage(weapon.baseDamage, masteryBonus);
    
    // Create context for combat calculations
    const context = {
        weaponType: weapon.weaponType,
        abilityId: ability.id
    };
    
    // Check for critical hit
    const critInfo = calculateCriticalHit(context);
    let critText = "";
    if (critInfo.isCritical) {
        // Apply critical damage multiplier
        potentialDamage = Math.floor(potentialDamage * critInfo.critMultiplier);
        critText = ` CRITICAL HIT! (x${critInfo.critMultiplier.toFixed(1)})`;
    }
    
    // Update battle text
    updateBattleText(`You use ${ability.name} with your ${weapon.name}!`);
    
    // Calculate hit chance with this ability's modifier
    let hitChance = calculateHitChance({
        attackerWeaponSkill: playerState.weaponSkill,
        defenderAgility: battleState.enemyAgility,
        defenderEnergy: battleState.enemyEnergy,
        defenderMaxEnergy: battleState.enemyMaxEnergy,
        defenderEndurance: battleState.enemyEndurance,
        abilityModifier: ability.hitChanceModifier || 0,
        context
    });
    
    // Play attack animation
    const playerCharacter = document.querySelector('.character-placeholder.viking');
    playerCharacter.classList.add('attack-animation');
    
    setTimeout(() => {
        playerCharacter.classList.remove('attack-animation');
        
        // Determine if attack hits
        const roll = Math.random();
        if (roll <= hitChance) {
            // Attack hits!
            // Play enemy hurt animation
            const enemyCharacter = document.querySelector('.character-placeholder.saxon');
            enemyCharacter.classList.add('hurt-animation');
            setTimeout(() => {
                enemyCharacter.classList.remove('hurt-animation');
            }, 500);
            
            // Check for armor piercing ability
            let armorPiercingPercentage = 0;
            if (ability.id === 'armor_piercer') {
                armorPiercingPercentage = 0.3; // 30% armor penetration
            }
            
            // Apply damage and reduce enemy energy
            battleState.enemyHealth = Math.max(0, battleState.enemyHealth - potentialDamage);
            battleState.enemyEnergy = Math.max(0, battleState.enemyEnergy - Math.floor(potentialDamage * 0.3));
            
            // Apply any special effects from the ability
            const effectResult = ability.executeEffect(battleState);
            if (effectResult) {
                appendBattleText(`,${critText} dealing ${potentialDamage} damage and ${effectResult}!`);
            } else {
                appendBattleText(`,${critText} dealing ${potentialDamage} damage!`);
            }
            
            // Check if enemy is defeated
            if (battleState.enemyHealth <= 0) {
                handleEnemyDefeated();
                return;
            }
        } else {
            // Attack misses!
            appendBattleText(`, but the ${battleState.enemyName} dodges your attack!`);
        }
        
        // Enemy turn after a short delay
        setTimeout(() => {
            handleEnemyTurn();
        }, 1000);
    }, 500);
    
    // Update UI
    updateBattleUI();
}

export { initBattle, battleState };