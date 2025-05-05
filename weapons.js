// Weapon System - Defines weapons and their abilities
import { playerState } from './player.js';

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
    
    // Calculate the damage based on weapon base damage and player stats
    calculateDamage(weaponBaseDamage) {
        // Pass weapon's base damage to the formula instead of ability's damageBase
        return this.damageFormula(weaponBaseDamage, this.damageMultiplier, playerState);
    }
    
    // Get a display description with damage calculation
    getDisplayDescription(weaponBaseDamage) {
        const calculatedDamage = this.calculateDamage(weaponBaseDamage);
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
        abilities
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.baseDamage = baseDamage; // Store the base damage value
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
    damageFormula: (weaponBaseDamage, multiplier, playerStats) => {
        return Math.floor(weaponBaseDamage * multiplier + (playerStats.weaponSkill * 0.3));
    },
    hitChanceModifier: 0.05 // +5% hit chance
});

// Swing - Medium energy, agility-based damage
const swing = new WeaponAbility({
    id: 'swing',
    name: 'Swing',
    description: 'A wide arcing attack. Adds one-third of agility to damage.',
    energyCost: 9,
    damageFormula: (weaponBaseDamage, multiplier, playerStats) => {
        return Math.floor(weaponBaseDamage * multiplier + (playerStats.agility / 3) + + (playerStats.weaponSkill * 0.3));
    },
    hitChanceModifier: -0.05 // -5% hit chance
});

// Define actual weapons
const rustyShortSword = new Weapon({
    id: 'rusty_short_sword',
    name: 'Rusty Short Sword',
    description: 'A weathered blade, though still sharp enough to be dangerous.',
    baseDamage: 10, // Example base damage value
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