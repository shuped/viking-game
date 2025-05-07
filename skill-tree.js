// Skill tree system for weapon abilities and combat modifiers
import { playerState, setPlayerAttribute } from './player.js';
import { addModifier, ModifierType, ModifierSource } from './combat-modifiers.js';

// Define skill tree branches and skills
export const SkillTree = {
    // Accuracy Branch
    accuracyBranch: {
        improvedAccuracy: {
            id: 'improvedAccuracy',
            name: 'Improved Accuracy',
            description: 'Increases hit chance by 10% for all attacks.',
            maxRank: 3,
            skillPointCost: 1,
            onApply: (rank) => {
                // Add a hit chance modifier (10% per rank)
                addModifier({
                    target: 'global',
                    targetId: null, 
                    type: 'flat',
                    value: 0.1,
                    source: `skill_improvedAccuracy_${rank}`,
                    modifierType: ModifierType.HIT_CHANCE
                });
            }
        },
        criticalPrecision: {
            id: 'criticalPrecision',
            name: 'Critical Precision',
            description: 'Increases critical hit chance by 5%.',
            maxRank: 3,
            skillPointCost: 1,
            requiresSkillPoints: 2, // Requires 2 points in the accuracy branch
            onApply: (rank) => {
                addModifier({
                    target: 'global',
                    targetId: null,
                    type: 'flat',
                    value: 0.05,
                    source: `skill_criticalPrecision_${rank}`,
                    modifierType: ModifierType.CRITICAL_CHANCE
                });
            }
        },
        statusMastery: {
            id: 'statusMastery',
            name: 'Status Mastery',
            description: 'Increases chance to apply status effects by 10%.',
            maxRank: 3,
            skillPointCost: 1,
            requiresSkillPoints: 4, // Requires 4 points in the accuracy branch
            onApply: (rank) => {
                addModifier({
                    target: 'global',
                    targetId: null,
                    type: 'flat',
                    value: 0.1,
                    source: `skill_statusMastery_${rank}`,
                    modifierType: ModifierType.STATUS_CHANCE
                });
            }
        },
        // Special ability that requires points in accuracy branch
        armorPiercer: {
            id: 'armorPiercer',
            name: 'Armor Piercer',
            description: 'Unlocks a new attack that ignores 30% of enemy armor.',
            maxRank: 1,
            skillPointCost: 2,
            requiresSkillPoints: 4, // Requires 4 points in accuracy branch
            weaponType: 'sword', // This skill is specific to swords
            onApply: (rank) => {
                // This would unlock a new ability for swords
                // Implementation for unlocking abilities will be added later
                console.log("Armor Piercer ability unlocked");
            }
        }
    },
    
    // Damage Branch
    damageBranch: {
        improvedDamage: {
            id: 'improvedDamage',
            name: 'Improved Damage',
            description: 'Increases damage by 10% for all attacks.',
            maxRank: 3,
            skillPointCost: 1,
            onApply: (rank) => {
                addModifier({
                    target: 'global',
                    targetId: null,
                    type: 'percent',
                    value: 0.1,
                    source: `skill_improvedDamage_${rank}`,
                    modifierType: ModifierType.DAMAGE_MULTIPLIER
                });
            }
        },
        criticalPower: {
            id: 'criticalPower',
            name: 'Critical Power',
            description: 'Increases critical hit damage by 15%.',
            maxRank: 3,
            skillPointCost: 1,
            requiresSkillPoints: 2, // Requires 2 points in the damage branch
            onApply: (rank) => {
                addModifier({
                    target: 'global',
                    targetId: null,
                    type: 'percent',
                    value: 0.15,
                    source: `skill_criticalPower_${rank}`,
                    modifierType: ModifierType.CRITICAL_DAMAGE
                });
            }
        },
        statusIntensity: {
            id: 'statusIntensity',
            name: 'Status Intensity',
            description: 'Increases the power of status effects by 15%.',
            maxRank: 3,
            skillPointCost: 1,
            requiresSkillPoints: 4, // Requires 4 points in the damage branch
            onApply: (rank) => {
                addModifier({
                    target: 'global',
                    targetId: null,
                    type: 'percent',
                    value: 0.15,
                    source: `skill_statusIntensity_${rank}`,
                    modifierType: ModifierType.STATUS_EFFECT
                });
            }
        }
    }
};

// Initialize player's skill ranks
const skillRanks = {};
const branchPoints = {
    accuracyBranch: 0,
    damageBranch: 0
};

// Get branch total points
function getBranchPoints(branchName) {
    return branchPoints[branchName] || 0;
}

// Initialize skill ranks
function initSkillRanks() {
    // Reset branch points
    Object.keys(branchPoints).forEach(branch => {
        branchPoints[branch] = 0;
    });
    
    // Initialize all skills to rank 0
    for (const branchName in SkillTree) {
        const branch = SkillTree[branchName];
        for (const skillId in branch) {
            skillRanks[skillId] = 0;
        }
    }
}

// Apply skill point to a skill
function applySkillPoint(branchName, skillId) {
    // Make sure the branch and skill exist
    if (!SkillTree[branchName] || !SkillTree[branchName][skillId]) {
        console.error(`Skill ${skillId} in branch ${branchName} does not exist.`);
        return false;
    }
    
    const skill = SkillTree[branchName][skillId];
    const currentRank = skillRanks[skillId] || 0;
    
    // Check if we can rank up the skill
    if (currentRank >= skill.maxRank) {
        console.log(`${skill.name} is already at maximum rank.`);
        return false;
    }
    
    // Check if player has enough skill points
    if (playerState.skillPoints < skill.skillPointCost) {
        console.log(`Not enough skill points. Need ${skill.skillPointCost}, have ${playerState.skillPoints}.`);
        return false;
    }
    
    // Check for branch point requirements
    if (skill.requiresSkillPoints && getBranchPoints(branchName) < skill.requiresSkillPoints) {
        console.log(`Need ${skill.requiresSkillPoints} points in ${branchName} first.`);
        return false;
    }
    
    // Check for weapon type restriction
    if (skill.weaponType) {
        // We could add a check here if the player has appropriate weapon skills
        // For now we'll just log a message
        console.log(`Skill is specific to ${skill.weaponType} weapons.`);
    }
    
    // All checks passed, apply the skill point
    skillRanks[skillId] = currentRank + 1;
    
    // Track points in this branch
    branchPoints[branchName] = (branchPoints[branchName] || 0) + 1;
    
    // Deduct skill point
    setPlayerAttribute('skillPoints', playerState.skillPoints - skill.skillPointCost);
    
    // Apply the skill's effect
    if (skill.onApply) {
        skill.onApply(skillRanks[skillId]);
    }
    
    console.log(`Successfully applied skill point to ${skill.name}. Now at rank ${skillRanks[skillId]}.`);
    return true;
}

// Get the current rank of a skill
function getSkillRank(skillId) {
    return skillRanks[skillId] || 0;
}

// Get all unlocked skills
function getUnlockedSkills() {
    const unlockedSkills = [];
    
    for (const branchName in SkillTree) {
        const branch = SkillTree[branchName];
        for (const skillId in branch) {
            const rank = skillRanks[skillId] || 0;
            if (rank > 0) {
                unlockedSkills.push({
                    id: skillId,
                    name: branch[skillId].name,
                    rank,
                    maxRank: branch[skillId].maxRank
                });
            }
        }
    }
    
    return unlockedSkills;
}

// Initialize skill ranks
initSkillRanks();

export {
    applySkillPoint,
    getSkillRank,
    getBranchPoints,
    getUnlockedSkills,
    initSkillRanks
};