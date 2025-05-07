// skill-tree-data.js - Contains skill tree definitions
import { ModifierType } from './combat-modifiers.js';

// Define skill tree structure with branches and skills
export const SkillTreeData = {
    // Accuracy Branch
    accuracyBranch: {
        name: "Accuracy",
        description: "Skills focused on improving accuracy, critical hits, and status effects.",
        skills: {
            improvedAccuracy: {
                id: 'improvedAccuracy',
                name: 'Improved Accuracy',
                description: 'Increases hit chance by 10% for all attacks.',
                maxRank: 3,
                skillPointCost: 1,
                icon: '🎯',
                position: { row: 1, column: 2 },
                modifiers: [
                    {
                        target: 'global',
                        targetId: null,
                        type: 'flat',
                        value: 0.1,
                        modifierType: ModifierType.HIT_CHANCE
                    }
                ],
                prerequisites: []
            },
            criticalPrecision: {
                id: 'criticalPrecision',
                name: 'Critical Precision',
                description: 'Increases critical hit chance by 5%.',
                maxRank: 3,
                skillPointCost: 1,
                icon: '⚡',
                position: { row: 2, column: 1 },
                modifiers: [
                    {
                        target: 'global',
                        targetId: null, 
                        type: 'flat',
                        value: 0.05,
                        modifierType: ModifierType.CRITICAL_CHANCE
                    }
                ],
                prerequisites: [
                    { skillId: 'improvedAccuracy', rank: 1 }
                ],
                requiresBranchPoints: 2
            },
            statusMastery: {
                id: 'statusMastery',
                name: 'Status Mastery',
                description: 'Increases chance to apply status effects by 10%.',
                maxRank: 3,
                skillPointCost: 1,
                icon: '☠️',
                position: { row: 2, column: 3 },
                modifiers: [
                    {
                        target: 'global',
                        targetId: null,
                        type: 'flat',
                        value: 0.1,
                        modifierType: ModifierType.STATUS_CHANCE
                    }
                ],
                prerequisites: [
                    { skillId: 'improvedAccuracy', rank: 1 }
                ],
                requiresBranchPoints: 2
            },
            armorPiercer: {
                id: 'armorPiercer',
                name: 'Armor Piercer',
                description: 'Unlocks a new attack that ignores 30% of enemy armor.',
                maxRank: 1,
                skillPointCost: 2,
                icon: '🔪',
                position: { row: 3, column: 2 },
                weaponType: 'sword',
                unlockAbility: 'armor_piercer',
                modifiers: [],
                prerequisites: [
                    { skillId: 'criticalPrecision', rank: 1 },
                    { skillId: 'statusMastery', rank: 1 }
                ],
                requiresBranchPoints: 4
            }
        }
    },
    
    // Damage Branch
    damageBranch: {
        name: "Damage",
        description: "Skills focused on increasing damage, critical damage, and status effect power.",
        skills: {
            improvedDamage: {
                id: 'improvedDamage',
                name: 'Improved Damage',
                description: 'Increases damage by 10% for all attacks.',
                maxRank: 3,
                skillPointCost: 1,
                icon: '⚔️',
                position: { row: 1, column: 2 },
                modifiers: [
                    {
                        target: 'global',
                        targetId: null,
                        type: 'percent',
                        value: 0.1,
                        modifierType: ModifierType.DAMAGE_MULTIPLIER
                    }
                ],
                prerequisites: []
            },
            criticalPower: {
                id: 'criticalPower',
                name: 'Critical Power',
                description: 'Increases critical hit damage by 15%.',
                maxRank: 3,
                skillPointCost: 1,
                icon: '💥',
                position: { row: 2, column: 1 },
                modifiers: [
                    {
                        target: 'global',
                        targetId: null,
                        type: 'percent',
                        value: 0.15,
                        modifierType: ModifierType.CRITICAL_DAMAGE
                    }
                ],
                prerequisites: [
                    { skillId: 'improvedDamage', rank: 1 }
                ],
                requiresBranchPoints: 2
            },
            statusIntensity: {
                id: 'statusIntensity',
                name: 'Status Intensity',
                description: 'Increases the power of status effects by 15%.',
                maxRank: 3,
                skillPointCost: 1,
                icon: '🔥',
                position: { row: 2, column: 3 },
                modifiers: [
                    {
                        target: 'global',
                        targetId: null,
                        type: 'percent',
                        value: 0.15,
                        modifierType: ModifierType.STATUS_EFFECT
                    }
                ],
                prerequisites: [
                    { skillId: 'improvedDamage', rank: 1 }
                ],
                requiresBranchPoints: 2
            },
            devastatingBlows: {
                id: 'devastatingBlows',
                name: 'Devastating Blows',
                description: 'Your critical hits now have a 20% chance to stun the enemy for 1 turn.',
                maxRank: 1,
                skillPointCost: 2,
                icon: '🌋',
                position: { row: 3, column: 2 },
                modifiers: [],
                prerequisites: [
                    { skillId: 'criticalPower', rank: 1 },
                    { skillId: 'statusIntensity', rank: 1 }
                ],
                requiresBranchPoints: 4
            }
        }
    }
};

// Helper function to get a skill from the tree
export function getSkill(branchId, skillId) {
    if (!SkillTreeData[branchId] || !SkillTreeData[branchId].skills[skillId]) {
        return null;
    }
    
    return SkillTreeData[branchId].skills[skillId];
}

// Helper function to get all skills for a branch
export function getBranchSkills(branchId) {
    if (!SkillTreeData[branchId]) {
        return [];
    }
    
    return Object.values(SkillTreeData[branchId].skills);
}

// Helper function to get all branches
export function getAllBranches() {
    return Object.keys(SkillTreeData).map(branchId => ({
        id: branchId,
        name: SkillTreeData[branchId].name,
        description: SkillTreeData[branchId].description
    }));
}