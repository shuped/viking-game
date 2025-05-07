// Weapon System - Defines weapons and their abilities
import { playerState } from './player.js';
import { createStatusEffect, StatusEffectType, applyModifiers, ModifierType } from './combat-modifiers.js';

// Configurable damage multipliers for fine-tuning balance
export const DAMAGE_MULTIPLIERS = {
    WEAPON_SKILL_BONUS: 0.3,     // How much weapon skill contributes to damage
    BASE_WEAPON_SKILL_DMG_MULTIPLIER: 1.0, // Base multiplier for thrust damage
    BASE_WEAK_AGILITY_WEAPON_DMG_MULTIPLIER: 1.1,  // Base multiplier for swing damage
};

// Ability System
// Each ability has standard properties and a damage calculation function
// This allows for flexible ability definitions that can scale with player stats
class WeaponAbility {
    constructor({
        id,
        name,
        description,
        energyCost,
        damageMultiplier = 1,
        damageFormula,
        hitChanceModifier = 0,
        effectFunction = null,
        weaponType = null,
        statusEffectType = null,
        statusEffectChance = 0,
        statusEffectDuration = 2,
        statusEffectDamage = 0,
        statusEffectPower = 1.0
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.energyCost = energyCost;
        this.damageMultiplier = damageMultiplier;
        this.damageFormula = damageFormula;
        this.hitChanceModifier = hitChanceModifier;
        this.effectFunction = effectFunction;
        this.weaponType = weaponType;
        this.statusEffectType = statusEffectType;
        this.statusEffectChance = statusEffectChance;
        this.statusEffectDuration = statusEffectDuration;
        this.statusEffectDamage = statusEffectDamage;
        this.statusEffectPower = statusEffectPower;
    }
    
    // Calculate the damage based on weapon base damage, player stats and weapon mastery bonus
    calculateDamage(weaponBaseDamage, masteryBonus = 0) {
        // Pass weapon's base damage and mastery bonus to the formula
        const baseDamage = this.damageFormula(weaponBaseDamage, this.damageMultiplier, playerState, masteryBonus);
        
        // Apply global damage modifiers from skills
        const context = {
            weaponType: this.weaponType,
            abilityId: this.id
        };
        
        return Math.floor(applyModifiers(baseDamage, ModifierType.DAMAGE_MULTIPLIER, context));
    }
    
    // Get a display description with damage calculation including mastery bonus
    getDisplayDescription(weaponBaseDamage, masteryBonus = 0) {
        const calculatedDamage = this.calculateDamage(weaponBaseDamage, masteryBonus);
        return `${this.description} (Damage: ~${calculatedDamage}, Energy: ${this.energyCost})`;
    }
    
    // Execute any special effects
    executeEffect(battleState) {
        // First check for predefined status effect
        if (this.statusEffectType) {
            // Get base chance for status effect
            let statusChance = this.statusEffectChance;
            
            // Apply modifiers to status chance
            statusChance = applyModifiers(statusChance, ModifierType.STATUS_CHANCE, {
                weaponType: this.weaponType,
                abilityId: this.id
            });
            
            // Check if status effect applies
            if (Math.random() <= statusChance) {
                // Calculate duration with modifiers
                let duration = this.statusEffectDuration;
                duration = applyModifiers(duration, ModifierType.STATUS_DURATION, {
                    weaponType: this.weaponType,
                    abilityId: this.id
                });
                
                // Calculate effect power with modifiers (for damage or other scaling)
                let power = this.statusEffectPower;
                power = applyModifiers(power, ModifierType.STATUS_EFFECT, {
                    weaponType: this.weaponType,
                    abilityId: this.id
                });
                
                // Create the status effect
                const effect = createStatusEffect(
                    this.statusEffectType,
                    this.statusEffectDamage,
                    Math.floor(duration),
                    power
                );
                
                // Add the effect to battle state
                if (!battleState.statusEffects) {
                    battleState.statusEffects = [];
                }
                battleState.statusEffects.push(effect);
                
                // Return a message about the status effect
                const effectName = this.statusEffectType.charAt(0).toUpperCase() + this.statusEffectType.slice(1);
                return `applying ${effectName} for ${Math.floor(duration)} turns`;
            }
        }
        
        // If no predefined status effect or it didn't proc, use the legacy effect function
        if (this.effectFunction) {
            return this.effectFunction(battleState, playerState);
        }
        
        return null;
    }
}

// Weapon Class
class Weapon {
    constructor({
        id,
        name,
        description,
        baseDamage, // New: base damage is now a weapon property
        weaponType, // New: weapon type (sword, mace, axe, polearm)
        abilities
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.baseDamage = baseDamage; // Store the base damage value
        this.weaponType = weaponType; // Store the weapon type
        this.abilities = abilities;
    }
    
    // Get an ability by id
    getAbility(abilityId) {
        return this.abilities.find(ability => ability.id === abilityId);
    }
}

// Define standard ability types with their damage formulas

// Thrust - Low energy, modest damage
const thrust = new WeaponAbility({
    id: 'thrust',
    name: 'Thrust',
    description: 'A quick stabbing attack',
    energyCost: 6,
    damageFormula: (weaponBaseDamage, multiplier, playerStats, masteryBonus) => {
        return Math.floor(weaponBaseDamage * multiplier + (playerStats.weaponSkill * DAMAGE_MULTIPLIERS.BASE_WEAPON_SKILL_DMG_MULTIPLIER) + (playerStats.weaponSkill * DAMAGE_MULTIPLIERS.WEAPON_SKILL_BONUS) + masteryBonus);
    },
    hitChanceModifier: 0.05, // +5% hit chance
    weaponType: 'sword'
});

// Swing - Medium energy, agility-based damage
const swing = new WeaponAbility({
    id: 'swing',
    name: 'Swing',
    description: 'A wide arcing attack. Adds one-third of agility to damage.',
    energyCost: 9,
    damageFormula: (weaponBaseDamage, multiplier, playerStats, masteryBonus) => {
        return Math.floor(weaponBaseDamage * multiplier + (playerStats.agility / DAMAGE_MULTIPLIERS.BASE_WEAK_AGILITY_WEAPON_DMG_MULTIPLIER) + (playerStats.weaponSkill * DAMAGE_MULTIPLIERS.WEAPON_SKILL_BONUS) + masteryBonus);
    },
    hitChanceModifier: -0.05, // -5% hit chance
    weaponType: 'sword'
});

// Bleeding Strike - Applies a bleed effect
const bleedingStrike = new WeaponAbility({
    id: 'bleeding_strike',
    name: 'Bleeding Strike',
    description: 'A precise strike that causes bleeding.',
    energyCost: 12,
    damageFormula: (weaponBaseDamage, multiplier, playerStats, masteryBonus) => {
        return Math.floor((weaponBaseDamage * 0.8) * multiplier + (playerStats.weaponSkill * DAMAGE_MULTIPLIERS.WEAPON_SKILL_BONUS) + masteryBonus);
    },
    hitChanceModifier: 0,
    weaponType: 'sword',
    statusEffectType: StatusEffectType.BLEED,
    statusEffectChance: 0.4, // 40% chance to apply bleed
    statusEffectDuration: 2, // Lasts 2 turns
    statusEffectDamage: 5, // Base damage per turn
    statusEffectPower: 1.0 // Base power multiplier
});

// Armor Piercer - Ignores portion of enemy armor (unlocked via skill tree)
const armorPiercer = new WeaponAbility({
    id: 'armor_piercer',
    name: 'Armor Piercer',
    description: 'A powerful thrust that ignores 30% of enemy armor.',
    energyCost: 15,
    damageFormula: (weaponBaseDamage, multiplier, playerStats, masteryBonus) => {
        return Math.floor(weaponBaseDamage * 1.2 + (playerStats.strength * 0.5) + (playerStats.weaponSkill * 0.5) + masteryBonus);
    },
    hitChanceModifier: -0.1, // -10% hit chance due to difficulty
    weaponType: 'sword',
    // Special effect to handle armor penetration will be implemented in battle.js
    effectFunction: (battleState) => {
        return 'bypassing 30% of enemy armor';
    }
});

// Define actual weapons
const rustyShortSword = new Weapon({
    id: 'rusty_short_sword',
    name: 'Rusty Short Sword',
    description: 'A weathered blade, though still sharp enough to be dangerous.',
    baseDamage: 10, // Example base damage value
    weaponType: 'sword', // Example weapon type
    abilities: [thrust, swing, bleedingStrike]
});

// Define more advanced weapons
const vikingBlade = new Weapon({
    id: 'viking_blade',
    name: 'Viking Blade',
    description: 'A finely crafted steel sword with Norse runes etched into the blade.',
    baseDamage: 15,
    weaponType: 'sword',
    abilities: [thrust, swing, bleedingStrike]
});

const battleAxe = new Weapon({
    id: 'battle_axe',
    name: 'Battle Axe',
    description: 'A heavy axe capable of devastating blows.',
    baseDamage: 18,
    weaponType: 'axe',
    abilities: [
        // Basic axe attack
        new WeaponAbility({
            id: 'chop',
            name: 'Chop',
            description: 'A strong downward strike with the axe.',
            energyCost: 8,
            damageFormula: (weaponBaseDamage, multiplier, playerStats, masteryBonus) => {
                return Math.floor(weaponBaseDamage * multiplier + (playerStats.strength * 0.5) + masteryBonus);
            },
            hitChanceModifier: 0,
            weaponType: 'axe'
        }),
        // Heavy axe attack
        new WeaponAbility({
            id: 'cleave',
            name: 'Cleave',
            description: 'A powerful swing that can wound deeply.',
            energyCost: 14,
            damageFormula: (weaponBaseDamage, multiplier, playerStats, masteryBonus) => {
                return Math.floor(weaponBaseDamage * 1.3 + (playerStats.strength * 0.8) + masteryBonus);
            },
            hitChanceModifier: -0.15,
            weaponType: 'axe',
            statusEffectType: StatusEffectType.WEAKEN,
            statusEffectChance: 0.3,
            statusEffectDuration: 3,
        })
    ]
});

// Map of all weapons with unlockable abilities
const weaponAbilities = {
    'sword': {
        // Standard abilities available to all sword users
        standard: [thrust, swing],
        // Abilities unlocked through skill tree or game progression
        unlockable: [bleedingStrike, armorPiercer]
    },
    'axe': {
        standard: [battleAxe.abilities[0], battleAxe.abilities[1]],
        unlockable: []
    },
    'mace': {
        standard: [],
        unlockable: []
    },
    'polearm': {
        standard: [],
        unlockable: []
    }
};

// Export a mapping of all weapons for easy access
const weaponsMap = {
    rusty_short_sword: rustyShortSword,
    viking_blade: vikingBlade,
    battle_axe: battleAxe
};

// Function to get player's currently equipped weapon
// In the future, this could check player inventory/equipment
function getEquippedWeapon() {
    // For now, always return the rusty sword
    return rustyShortSword;
}

// Function to check if a player has unlocked a specific ability
function hasUnlockedAbility(abilityId) {
    // This would be expanded to check skill tree unlocks
    // For now, just return true for standard abilities
    const ability = findAbilityById(abilityId);
    if (!ability) return false;
    
    // Look through standard abilities for each weapon type
    for (const weaponType in weaponAbilities) {
        if (weaponAbilities[weaponType].standard.some(a => a.id === abilityId)) {
            return true;
        }
    }
    
    // For unlockable abilities, we'd check against player's skill tree
    // This will be implemented later
    return false;
}

// Helper function to find an ability by ID
function findAbilityById(abilityId) {
    for (const weaponType in weaponAbilities) {
        // Check standard abilities
        const standardAbility = weaponAbilities[weaponType].standard.find(a => a.id === abilityId);
        if (standardAbility) return standardAbility;
        
        // Check unlockable abilities
        const unlockableAbility = weaponAbilities[weaponType].unlockable.find(a => a.id === abilityId);
        if (unlockableAbility) return unlockableAbility;
    }
    return null;
}

export { 
    WeaponAbility, 
    Weapon, 
    getEquippedWeapon, 
    weaponsMap,
    weaponAbilities,
    hasUnlockedAbility,
    findAbilityById
};