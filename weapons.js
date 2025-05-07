// Weapon System - Defines weapons and their abilities
import { playerState } from './player.js';

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
        damageMultiplier = 1, // Changed: from damageBase to damageMultiplier
        damageFormula,
        hitChanceModifier = 0,
        effectFunction = null
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.energyCost = energyCost;
        this.damageMultiplier = damageMultiplier; // Store as multiplier instead of base damage
        this.damageFormula = damageFormula;
        this.hitChanceModifier = hitChanceModifier;
        this.effectFunction = effectFunction;
    }
    
    // Calculate the damage based on weapon base damage, player stats and weapon mastery bonus
    calculateDamage(weaponBaseDamage, masteryBonus = 0) {
        // Pass weapon's base damage and mastery bonus to the formula
        return this.damageFormula(weaponBaseDamage, this.damageMultiplier, playerState, masteryBonus);
    }
    
    // Get a display description with damage calculation including mastery bonus
    getDisplayDescription(weaponBaseDamage, masteryBonus = 0) {
        const calculatedDamage = this.calculateDamage(weaponBaseDamage, masteryBonus);
        return `${this.description} (Damage: ~${calculatedDamage}, Energy: ${this.energyCost})`;
    }
    
    // Execute any special effects
    executeEffect(battleState) {
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
    hitChanceModifier: 0.05 // +5% hit chance
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
    hitChanceModifier: -0.05 // -5% hit chance
});

// Define actual weapons
const rustyShortSword = new Weapon({
    id: 'rusty_short_sword',
    name: 'Rusty Short Sword',
    description: 'A weathered blade, though still sharp enough to be dangerous.',
    baseDamage: 10, // Example base damage value
    weaponType: 'sword', // Example weapon type
    abilities: [thrust, swing]
});

// Export a mapping of all weapons for easy access
const weaponsMap = {
    rusty_short_sword: rustyShortSword
};

// Function to get player's currently equipped weapon
// In the future, this could check player inventory/equipment
function getEquippedWeapon() {
    // For now, always return the rusty sword
    return rustyShortSword;
}

export { 
    WeaponAbility, 
    Weapon, 
    getEquippedWeapon, 
    weaponsMap 
};