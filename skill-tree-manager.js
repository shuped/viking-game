// skill-tree-manager.js - Manages skill point allocation and application
import { playerState, setPlayerAttribute } from './player.js';
import { addModifier, ModifierSource, removeModifiersBySource } from './combat-modifiers.js';
import { SkillTreeData, getSkill } from './skill-tree-data.js';
import { findAbilityById, weaponAbilities } from './weapons.js';

// Track skill ranks and branch points
const skillRanks = {};
const branchPoints = {
    accuracyBranch: 0,
    damageBranch: 0
};

// Initialize skill tree system
export function initializeSkillTree() {
    // Reset branch points
    Object.keys(branchPoints).forEach(branch => {
        branchPoints[branch] = 0;
    });
    
    // Reset all skill ranks
    for (const branchId in SkillTreeData) {
        const branch = SkillTreeData[branchId];
        for (const skillId in branch.skills) {
            skillRanks[skillId] = 0;
        }
    }
    
    // Clear any existing modifiers from the skill tree
    removeModifiersBySource(ModifierSource.SKILL_TREE);
}

// Apply a skill point to a skill
export function applySkillPoint(branchId, skillId) {
    // Validate branch and skill exist
    const skill = getSkill(branchId, skillId);
    if (!skill) {
        console.error(`Skill ${skillId} in branch ${branchId} does not exist.`);
        return {
            success: false,
            message: 'Skill does not exist.'
        };
    }
    
    // Check current rank
    const currentRank = getSkillRank(skillId);
    
    // Validate rank isn't maxed out
    if (currentRank >= skill.maxRank) {
        return {
            success: false,
            message: `${skill.name} is already at maximum rank.`
        };
    }
    
    // Check if player has enough skill points
    if (playerState.skillPoints < skill.skillPointCost) {
        return {
            success: false,
            message: `Not enough skill points. Need ${skill.skillPointCost}, have ${playerState.skillPoints}.`
        };
    }
    
    // Check branch point requirements
    if (skill.requiresBranchPoints && getBranchPoints(branchId) < skill.requiresBranchPoints) {
        return {
            success: false,
            message: `Need ${skill.requiresBranchPoints} points in ${SkillTreeData[branchId].name} branch first.`
        };
    }
    
    // Check prerequisites
    if (skill.prerequisites && skill.prerequisites.length > 0) {
        for (const prereq of skill.prerequisites) {
            const prereqRank = getSkillRank(prereq.skillId);
            if (prereqRank < prereq.rank) {
                const prereqSkill = Object.values(SkillTreeData)
                    .flatMap(branch => Object.values(branch.skills))
                    .find(s => s.id === prereq.skillId);
                
                const prereqName = prereqSkill ? prereqSkill.name : prereq.skillId;
                
                return {
                    success: false,
                    message: `Requires ${prereqName} (Rank ${prereq.rank}) first.`
                };
            }
        }
    }
    
    // Check weapon type restriction for ability unlock
    if (skill.weaponType) {
        // In the future, could validate if player has appropriate weapon skills
        // For now we'll just log a message
        console.log(`Skill is specific to ${skill.weaponType} weapons.`);
    }
    
    // All checks passed, apply the skill point
    skillRanks[skillId] = currentRank + 1;
    
    // Increment branch points
    branchPoints[branchId] = (branchPoints[branchId] || 0) + 1;
    
    // Deduct skill point
    setPlayerAttribute('skillPoints', playerState.skillPoints - skill.skillPointCost);
    
    // Apply modifiers
    applySkillModifiers(skill, currentRank + 1);
    
    // Handle special ability unlocks
    if (skill.unlockAbility) {
        unlockSpecialAbility(skill.unlockAbility, skill.weaponType);
    }
    
    return {
        success: true,
        message: `Successfully applied skill point to ${skill.name}. Now at rank ${skillRanks[skillId]}.`
    };
}

// Apply skill modifiers based on the skill and its rank
function applySkillModifiers(skill, rank) {
    if (!skill.modifiers || skill.modifiers.length === 0) {
        return;
    }
    
    // Apply each modifier with the correct scaling for the current rank
    skill.modifiers.forEach(modifier => {
        const scaledModifier = { ...modifier };
        
        // Scale the modifier value based on rank
        scaledModifier.value = modifier.value * rank;
        
        // Use skill ID as source for easy removal later if needed
        scaledModifier.source = `${ModifierSource.SKILL_TREE}_${skill.id}_${rank}`;
        
        // Add the modifier to the system
        addModifier(scaledModifier);
    });
}

// Get the current rank of a skill
export function getSkillRank(skillId) {
    return skillRanks[skillId] || 0;
}

// Get the number of points spent in a branch
export function getBranchPoints(branchId) {
    return branchPoints[branchId] || 0;
}

// Get all unlocked skills
export function getUnlockedSkills() {
    const unlockedSkills = [];
    
    for (const branchId in SkillTreeData) {
        const branch = SkillTreeData[branchId];
        for (const skillId in branch.skills) {
            const rank = skillRanks[skillId] || 0;
            if (rank > 0) {
                const skill = branch.skills[skillId];
                unlockedSkills.push({
                    id: skillId,
                    name: skill.name,
                    rank,
                    maxRank: skill.maxRank,
                    branchId
                });
            }
        }
    }
    
    return unlockedSkills;
}

// Check if a skill is unlocked
export function isSkillUnlocked(skillId) {
    return getSkillRank(skillId) > 0;
}

// Check if a skill can be upgraded
export function canSkillBeUpgraded(branchId, skillId) {
    const skill = getSkill(branchId, skillId);
    if (!skill) return false;
    
    const currentRank = getSkillRank(skillId);
    
    // Check max rank
    if (currentRank >= skill.maxRank) {
        return false;
    }
    
    // Check skill points
    if (playerState.skillPoints < skill.skillPointCost) {
        return false;
    }
    
    // Check branch points
    if (skill.requiresBranchPoints && getBranchPoints(branchId) < skill.requiresBranchPoints) {
        return false;
    }
    
    // Check prerequisites
    if (skill.prerequisites && skill.prerequisites.length > 0) {
        for (const prereq of skill.prerequisites) {
            if (getSkillRank(prereq.skillId) < prereq.rank) {
                return false;
            }
        }
    }
    
    return true;
}

// Unlock special abilities
function unlockSpecialAbility(abilityId, weaponType) {
    console.log(`Unlocking ability: ${abilityId} for weapon type: ${weaponType}`);
    
    // Find the ability
    const ability = findAbilityById(abilityId);
    
    if (!ability) {
        console.error(`Ability ${abilityId} not found.`);
        return false;
    }
    
    // Add the ability to the player's unlocked abilities for this weapon type
    if (!playerState.unlockedAbilities[weaponType]) {
        playerState.unlockedAbilities[weaponType] = [];
    }
    
    if (!playerState.unlockedAbilities[weaponType].includes(abilityId)) {
        playerState.unlockedAbilities[weaponType].push(abilityId);
        console.log(`Added ${ability.name} to player's unlocked abilities for ${weaponType}`);
    }
    
    return true;
}

// Initialize the skill tree on module load
initializeSkillTree();