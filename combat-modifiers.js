// combat-modifiers.js - Status effects and combat modifiers for skill tree

// Status Effect System
export const StatusEffectType = {
    BLEED: 'bleed',
    STUN: 'stun',
    WEAKEN: 'weaken',
    POISON: 'poison',
    BURN: 'burn'
};

// Modifier registry system for skills
export const ModifierType = {
    HIT_CHANCE: 'hitChance',
    CRITICAL_CHANCE: 'criticalChance',
    CRITICAL_DAMAGE: 'criticalDamage',
    BASE_DAMAGE: 'baseDamage', 
    DAMAGE_MULTIPLIER: 'damageMultiplier',
    STATUS_CHANCE: 'statusChance',
    STATUS_DURATION: 'statusDuration',
    STATUS_EFFECT: 'statusEffect',
    DEFENSE: 'defense',
    EVASION: 'evasion',
    ARMOR_PENETRATION: 'armorPenetration'
};

export const ModifierSource = {
    WEAPON_MASTERY: 'weaponMastery',
    SKILL_TREE: 'skillTree',
    EQUIPMENT: 'equipment',
    TEMPORARY: 'temporary' // For buffs, potions, etc.
};

// Store all active modifiers
const combatModifiers = {
    global: {},        // Applies to all weapons/attacks
    byWeaponType: {},  // Weapon-specific modifiers
    byAbilityId: {}    // Ability-specific modifiers
};
window.combatModifiers = combatModifiers; // Expose for debugging
// Function to apply modifiers to a base value
export function applyModifiers(baseValue, modifierType, context = {}) {
    let result = baseValue;
    const { weaponType, abilityId } = context;
    
    // Apply global modifiers
    if (combatModifiers.global[modifierType]) {
        for (const modifier of combatModifiers.global[modifierType]) {
            if (modifier.type === 'flat') {
                result += modifier.value;
            } else if (modifier.type === 'percent') {
                result *= (1 + modifier.value);
            }
        }
    }
    
    // Apply weapon type specific modifiers
    if (weaponType && combatModifiers.byWeaponType[weaponType]?.[modifierType]) {
        for (const modifier of combatModifiers.byWeaponType[weaponType][modifierType]) {
            if (modifier.type === 'flat') {
                result += modifier.value;
            } else if (modifier.type === 'percent') {
                result *= (1 + modifier.value);
            }
        }
    }
    
    // Apply ability specific modifiers
    if (abilityId && combatModifiers.byAbilityId[abilityId]?.[modifierType]) {
        for (const modifier of combatModifiers.byAbilityId[abilityId][modifierType]) {
            if (modifier.type === 'flat') {
                result += modifier.value;
            } else if (modifier.type === 'percent') {
                result *= (1 + modifier.value);
            }
        }
    }
    
    return result;
}

// Function to add a new modifier
export function addModifier(modifierData) {
    const { target, targetId, type, value, source, modifierType } = modifierData;
    
    // Select the appropriate target collection
    let targetCollection;
    switch (target) {
        case 'global':
            targetCollection = combatModifiers.global;
            break;
        case 'weaponType':
            if (!combatModifiers.byWeaponType[targetId]) {
                combatModifiers.byWeaponType[targetId] = {};
            }
            targetCollection = combatModifiers.byWeaponType[targetId];
            break;
        case 'ability':
            if (!combatModifiers.byAbilityId[targetId]) {
                combatModifiers.byAbilityId[targetId] = {};
            }
            targetCollection = combatModifiers.byAbilityId[targetId];
            break;
        default:
            console.error(`Invalid modifier target: ${target}`);
            return false;
    }
    
    // Initialize the modifier type array if it doesn't exist
    if (!targetCollection[modifierType]) {
        targetCollection[modifierType] = [];
    }
    
    // Add the new modifier
    targetCollection[modifierType].push({
        type, // 'flat' or 'percent'
        value,
        source
    });
    
    return true;
}

// Function to remove modifiers by source
export function removeModifiersBySource(source) {
    // Remove from global modifiers
    for (const modifierType in combatModifiers.global) {
        combatModifiers.global[modifierType] = combatModifiers.global[modifierType].filter(
            modifier => modifier.source !== source
        );
    }
    
    // Remove from weapon type modifiers
    for (const weaponType in combatModifiers.byWeaponType) {
        for (const modifierType in combatModifiers.byWeaponType[weaponType]) {
            combatModifiers.byWeaponType[weaponType][modifierType] = 
                combatModifiers.byWeaponType[weaponType][modifierType].filter(
                    modifier => modifier.source !== source
                );
        }
    }
    
    // Remove from ability modifiers
    for (const abilityId in combatModifiers.byAbilityId) {
        for (const modifierType in combatModifiers.byAbilityId[abilityId]) {
            combatModifiers.byAbilityId[abilityId][modifierType] = 
                combatModifiers.byAbilityId[abilityId][modifierType].filter(
                    modifier => modifier.source !== source
                );
        }
    }
}

// Function to get critical hit information
export function calculateCriticalHit(context = {}) {
    const { weaponType, abilityId } = context;
    
    // Base critical chance (5%)
    let critChance = 0.05;
    
    // Apply modifiers to critical chance
    critChance = applyModifiers(critChance, ModifierType.CRITICAL_CHANCE, context);
    
    // Determine if critical hit occurs
    const isCritical = Math.random() <= critChance;
    
    // Calculate critical multiplier (base: 50% extra damage)
    let critMultiplier = 1.5;
    
    if (isCritical) {
        critMultiplier = applyModifiers(critMultiplier, ModifierType.CRITICAL_DAMAGE, context);
    }
    
    return { 
        isCritical, 
        critMultiplier,
        critChance
    };
}

// Process status effects each turn
export function processStatusEffects(battleState) {
    // Initialize statusEffects array if it doesn't exist
    if (!battleState.statusEffects) {
        battleState.statusEffects = [];
        return;
    }
    
    // Process each status effect
    for (let i = 0; i < battleState.statusEffects.length; i++) {
        const effect = battleState.statusEffects[i];
        
        // Apply effect based on type
        switch (effect.type) {
            case StatusEffectType.BLEED:
                // Calculate damage (base damage modified by effect power)
                const bleedDamage = Math.floor(effect.damage * effect.power);
                battleState.enemyHealth -= bleedDamage;
                battleState.lastStatusMessage = `The ${battleState.enemyName} bleeds for ${bleedDamage} damage!`;
                break;
                
            case StatusEffectType.STUN:
                // Stun prevents enemy action next turn
                battleState.enemyStunned = true;
                battleState.lastStatusMessage = `The ${battleState.enemyName} is stunned!`;
                break;
                
            case StatusEffectType.WEAKEN:
                // Weaken reduces enemy damage (applied elsewhere)
                battleState.lastStatusMessage = `The ${battleState.enemyName} is weakened!`;
                break;
                
            case StatusEffectType.POISON:
                // Poison deals damage and reduces energy
                const poisonDamage = Math.floor(effect.damage * effect.power);
                battleState.enemyHealth -= poisonDamage;
                battleState.enemyEnergy = Math.max(0, battleState.enemyEnergy - 5);
                battleState.lastStatusMessage = `The ${battleState.enemyName} takes ${poisonDamage} poison damage!`;
                break;
                
            case StatusEffectType.BURN:
                // Burn deals high damage
                const burnDamage = Math.floor(effect.damage * effect.power);
                battleState.enemyHealth -= burnDamage;
                battleState.lastStatusMessage = `The ${battleState.enemyName} takes ${burnDamage} burn damage!`;
                break;
        }
        
        // Reduce effect duration
        battleState.statusEffects[i].duration--;
    }
    
    // Remove expired effects
    battleState.statusEffects = battleState.statusEffects.filter(
        effect => effect.duration > 0
    );
}

// Helper to create a status effect
export function createStatusEffect(type, baseDamage = 0, duration = 2, power = 1.0) {
    return {
        type,
        damage: baseDamage,
        duration: duration,
        power: power
    };
}