// skill-tree-ui.js - Handles skill tree UI rendering and interactions
import { SkillTreeData, getBranchSkills, getSkill } from './skill-tree-data.js';
import { 
    applySkillPoint, 
    getSkillRank, 
    getBranchPoints, 
    canSkillBeUpgraded 
} from './skill-tree-manager.js';
import { playerState } from './player.js';

let currentBranch = 'accuracyBranch';
let selectedSkill = null;

// Initialize the skill tree UI
export function initSkillTreeUI() {
    updateAvailablePoints();
    renderSkillBranches();
    setupEventListeners();
}

// Update the number of available skill points
function updateAvailablePoints() {
    const pointsElement = document.getElementById('available-skill-points');
    if (pointsElement) {
        pointsElement.textContent = playerState.skillPoints;
    }
}

// Render all skill branches
function renderSkillBranches() {
    // Render the currently active branch
    renderSkillBranch(currentBranch);
}

// Render a specific skill branch
function renderSkillBranch(branchId) {
    const branchContainer = document.getElementById(branchId);
    if (!branchContainer) return;
    
    // Clear existing content
    branchContainer.innerHTML = '';
    
    // Get skills for this branch
    const skills = getBranchSkills(branchId);
    
    // Create skeleton structure based on maximum rows and columns
    const maxRow = Math.max(...skills.map(skill => skill.position.row));
    const maxCol = Math.max(...skills.map(skill => skill.position.column));
    
    // Create a grid for skill placement
    const grid = [];
    for (let i = 0; i <= maxRow; i++) {
        grid[i] = [];
        for (let j = 0; j <= maxCol; j++) {
            grid[i][j] = null;
        }
    }
    
    // Place skills in the grid
    skills.forEach(skill => {
        grid[skill.position.row][skill.position.column] = skill;
    });
    
    // First, create a container for connectors that will sit behind nodes
    const connectorsLayer = document.createElement('div');
    connectorsLayer.className = 'connectors-layer';
    branchContainer.appendChild(connectorsLayer);
    
    // Create skill nodes container that will sit above connectors
    const nodesContainer = document.createElement('div');
    nodesContainer.className = 'nodes-container';
    branchContainer.appendChild(nodesContainer);
    
    // Create the grid in the DOM
    for (let row = 1; row <= maxRow; row++) {
        const rowElement = document.createElement('div');
        rowElement.className = 'skill-row';
        
        for (let col = 1; col <= maxCol; col++) {
            const cellElement = document.createElement('div');
            cellElement.className = 'skill-cell';
            cellElement.dataset.row = row;
            cellElement.dataset.col = col;
            
            const skill = grid[row][col];
            if (skill) {
                const skillNode = createSkillNode(skill, branchId);
                cellElement.appendChild(skillNode);
                skillNode.dataset.skillId = skill.id;
            }
            
            rowElement.appendChild(cellElement);
        }
        
        nodesContainer.appendChild(rowElement);
    }
    
    // Now add connectors after all nodes are placed
    // This way we can access the actual DOM positions
    skills.forEach(skill => {
        if (skill.prerequisites && skill.prerequisites.length > 0) {
            skill.prerequisites.forEach(prereq => {
                const prereqSkill = skills.find(s => s.id === prereq.skillId);
                if (prereqSkill) {
                    const startNode = document.querySelector(`.skill-node[data-skill-id="${prereqSkill.id}"]`);
                    const endNode = document.querySelector(`.skill-node[data-skill-id="${skill.id}"]`);
                    
                    if (startNode && endNode) {
                        createConnector(connectorsLayer, startNode, endNode);
                    }
                }
            });
        }
    });
}

// Create a skill node element
function createSkillNode(skill, branchId) {
    const currentRank = getSkillRank(skill.id);
    const isUpgradable = canSkillBeUpgraded(branchId, skill.id);
    
    // Create the skill node element
    const node = document.createElement('div');
    node.className = 'skill-node';
    node.dataset.skillId = skill.id;
    node.dataset.branch = branchId;
    
    if (currentRank >= skill.maxRank) {
        node.classList.add('max-rank');
    } else if (!isUpgradable) {
        node.classList.add('locked');
    }
    
    if (selectedSkill && selectedSkill.id === skill.id && selectedSkill.branchId === branchId) {
        node.classList.add('selected');
    }
    
    // Add the skill icon
    const icon = document.createElement('div');
    icon.className = 'skill-icon';
    icon.textContent = skill.icon;
    node.appendChild(icon);
    
    // Add the skill rank indicator if the skill has been learned
    if (currentRank > 0) {
        const rankBadge = document.createElement('div');
        rankBadge.className = 'skill-rank';
        rankBadge.textContent = currentRank;
        node.appendChild(rankBadge);
    }
    
    // Add tooltip on hover
    node.addEventListener('mouseover', (e) => {
        const tooltip = createTooltip(skill, branchId);
        document.body.appendChild(tooltip);
        
        // Position the tooltip
        positionTooltip(tooltip, e);
        
        // Store tooltip reference for removal
        node.tooltip = tooltip;
    });
    
    node.addEventListener('mousemove', (e) => {
        if (node.tooltip) {
            positionTooltip(node.tooltip, e);
        }
    });
    
    node.addEventListener('mouseout', () => {
        if (node.tooltip) {
            document.body.removeChild(node.tooltip);
            node.tooltip = null;
        }
    });
    
    // Add click handler to select the skill
    node.addEventListener('click', () => {
        selectSkill(skill, branchId);
    });
    
    return node;
}

// Create connector between skills using actual DOM elements
function createConnector(connectorsLayer, startNode, endNode) {
    const connector = document.createElement('div');
    connector.className = 'skill-connector';
    
    // Get the actual positions from the DOM
    const startRect = startNode.getBoundingClientRect();
    const endRect = endNode.getBoundingClientRect();
    const containerRect = connectorsLayer.getBoundingClientRect();
    
    // Calculate center points relative to the connector layer
    const startX = startRect.left + (startRect.width / 2) - containerRect.left;
    const startY = startRect.top + (startRect.height / 2) - containerRect.top;
    const endX = endRect.left + (endRect.width / 2) - containerRect.left;
    const endY = endRect.top + (endRect.height / 2) - containerRect.top;
    
    // Calculate angle and length
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
    
    // Set connector styles
    connector.style.width = `${length}px`;
    connector.style.height = '4px';
    connector.style.position = 'absolute';
    connector.style.left = `${startX}px`;
    connector.style.top = `${startY}px`;
    connector.style.transform = `rotate(${angle}deg)`;
    connector.style.transformOrigin = '0 50%';
    
    connectorsLayer.appendChild(connector);
}

// Create tooltip element
function createTooltip(skill, branchId) {
    const currentRank = getSkillRank(skill.id);
    
    const tooltip = document.createElement('div');
    tooltip.className = 'skill-tooltip';
    tooltip.innerHTML = `
        <div class="skill-tooltip-title">${skill.name}</div>
        <div class="skill-tooltip-desc">${skill.description}</div>
        <div class="skill-tooltip-rank">Rank: ${currentRank}/${skill.maxRank}</div>
        <div class="skill-tooltip-cost">Cost: ${skill.skillPointCost} Skill Point${skill.skillPointCost > 1 ? 's' : ''}</div>
    `;
    
    // Add requirements if they exist
    if ((skill.requiresBranchPoints || (skill.prerequisites && skill.prerequisites.length > 0)) && currentRank === 0) {
        const reqsDiv = document.createElement('div');
        reqsDiv.className = 'skill-tooltip-reqs';
        
        if (skill.requiresBranchPoints) {
            const branchPointsReq = document.createElement('div');
            const currentPoints = getBranchPoints(branchId);
            const isMet = currentPoints >= skill.requiresBranchPoints;
            
            branchPointsReq.className = isMet ? 'requirement-met' : 'requirement-unmet';
            branchPointsReq.textContent = `Requires ${skill.requiresBranchPoints} points in this branch (${currentPoints}/${skill.requiresBranchPoints})`;
            reqsDiv.appendChild(branchPointsReq);
        }
        
        if (skill.prerequisites && skill.prerequisites.length > 0) {
            skill.prerequisites.forEach(prereq => {
                const prereqSkill = Object.values(SkillTreeData)
                    .flatMap(branch => Object.values(branch.skills))
                    .find(s => s.id === prereq.skillId);
                
                if (prereqSkill) {
                    const prereqDiv = document.createElement('div');
                    const prereqRank = getSkillRank(prereq.skillId);
                    const isMet = prereqRank >= prereq.rank;
                    
                    prereqDiv.className = isMet ? 'requirement-met' : 'requirement-unmet';
                    prereqDiv.textContent = `Requires ${prereqSkill.name} (Rank ${prereqRank}/${prereq.rank})`;
                    reqsDiv.appendChild(prereqDiv);
                }
            });
        }
        
        tooltip.appendChild(reqsDiv);
    }
    
    // Add special notes for weapon-specific skills
    if (skill.weaponType) {
        const weaponNote = document.createElement('div');
        weaponNote.className = 'skill-tooltip-weapon';
        weaponNote.textContent = `Specific to ${skill.weaponType} weapons`;
        tooltip.appendChild(weaponNote);
    }
    
    return tooltip;
}

// Position tooltip near the mouse
function positionTooltip(tooltip, event) {
    const offset = 15;
    tooltip.style.left = `${event.pageX + offset}px`;
    tooltip.style.top = `${event.pageY + offset}px`;
    tooltip.style.opacity = '1';
}

// Select a skill and update the info panel
function selectSkill(skill, branchId) {
    // Update selected skill
    selectedSkill = { ...skill, branchId };
    
    // Update UI to show this skill is selected
    document.querySelectorAll('.skill-node').forEach(node => {
        node.classList.remove('selected');
    });
    
    const selectedNode = document.querySelector(`.skill-node[data-skill-id="${skill.id}"][data-branch="${branchId}"]`);
    if (selectedNode) {
        selectedNode.classList.add('selected');
    }
    
    // Update the info panel
    updateSkillInfoPanel(skill, branchId);
}

// Update the info panel with selected skill details
function updateSkillInfoPanel(skill, branchId) {
    const nameElement = document.getElementById('selected-skill-name');
    const descElement = document.getElementById('selected-skill-description');
    const rankElement = document.getElementById('selected-skill-rank');
    const reqsElement = document.getElementById('selected-skill-requirements');
    const applyButton = document.getElementById('apply-skill-point');
    
    // Set name and description
    nameElement.textContent = skill.name;
    descElement.textContent = skill.description;
    
    // Set current rank
    const currentRank = getSkillRank(skill.id);
    rankElement.textContent = `${currentRank}/${skill.maxRank}`;
    
    // Clear and update requirements
    reqsElement.innerHTML = '';
    
    // Check if skill can be upgraded
    const isUpgradable = canSkillBeUpgraded(branchId, skill.id);
    
    // Add requirements if not met
    if (!isUpgradable && currentRank < skill.maxRank) {
        // Add skill point requirement
        if (playerState.skillPoints < skill.skillPointCost) {
            const pointsReq = document.createElement('div');
            pointsReq.className = 'requirement-unmet';
            pointsReq.textContent = `Need ${skill.skillPointCost} skill point${skill.skillPointCost > 1 ? 's' : ''} (Have ${playerState.skillPoints})`;
            reqsElement.appendChild(pointsReq);
        }
        
        // Add branch points requirement
        if (skill.requiresBranchPoints) {
            const currentPoints = getBranchPoints(branchId);
            if (currentPoints < skill.requiresBranchPoints) {
                const branchPointsReq = document.createElement('div');
                branchPointsReq.className = 'requirement-unmet';
                branchPointsReq.textContent = `Need ${skill.requiresBranchPoints} points in ${SkillTreeData[branchId].name} branch (Have ${currentPoints})`;
                reqsElement.appendChild(branchPointsReq);
            }
        }
        
        // Add prerequisite skills
        if (skill.prerequisites && skill.prerequisites.length > 0) {
            skill.prerequisites.forEach(prereq => {
                const prereqSkill = Object.values(SkillTreeData)
                    .flatMap(branch => Object.values(branch.skills))
                    .find(s => s.id === prereq.skillId);
                
                if (prereqSkill) {
                    const prereqRank = getSkillRank(prereq.skillId);
                    if (prereqRank < prereq.rank) {
                        const prereqDiv = document.createElement('div');
                        prereqDiv.className = 'requirement-unmet';
                        prereqDiv.textContent = `Need ${prereqSkill.name} Rank ${prereq.rank} (Current: ${prereqRank})`;
                        reqsElement.appendChild(prereqDiv);
                    }
                }
            });
        }
    } else if (currentRank >= skill.maxRank) {
        // If already at max rank
        const maxRankDiv = document.createElement('div');
        maxRankDiv.textContent = 'Skill at maximum rank';
        reqsElement.appendChild(maxRankDiv);
    } else {
        // If can be upgraded, show the cost
        const costDiv = document.createElement('div');
        costDiv.textContent = `Cost: ${skill.skillPointCost} Skill Point${skill.skillPointCost > 1 ? 's' : ''}`;
        reqsElement.appendChild(costDiv);
    }
    
    // Update apply button state
    applyButton.disabled = !isUpgradable;
    
    // Update apply button text
    if (currentRank === 0) {
        applyButton.textContent = 'Learn Skill';
    } else if (currentRank < skill.maxRank) {
        applyButton.textContent = 'Upgrade Skill';
    } else {
        applyButton.textContent = 'Maxed';
    }
}

// Apply a skill point to the selected skill
function applySelectedSkill() {
    if (!selectedSkill) return;
    
    const result = applySkillPoint(selectedSkill.branchId, selectedSkill.id);
    
    if (result.success) {
        // Update UI
        updateAvailablePoints();
        renderSkillBranches();
        updateSkillInfoPanel(selectedSkill, selectedSkill.branchId);
        
        // Show success message
        showFeedbackMessage(result.message, true);
    } else {
        // Show error message
        showFeedbackMessage(result.message, false);
    }
}

// Switch to a different skill branch
function switchBranch(branchId) {
    if (!SkillTreeData[branchId]) return;
    
    currentBranch = branchId;
    
    // Update active branch tab
    document.querySelectorAll('.skill-tree-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelector(`.skill-tree-tab[data-branch="${branchId}"]`).classList.add('active');
    
    // Update active branch content
    document.querySelectorAll('.skill-tree-branch').forEach(branch => {
        branch.classList.remove('active');
    });
    
    document.getElementById(branchId).classList.add('active');
    
    // Reset selected skill if it's not in this branch
    if (selectedSkill && selectedSkill.branchId !== branchId) {
        selectedSkill = null;
    }
    
    // Render the current branch
    renderSkillBranch(branchId);
}

// Show feedback message to the user
function showFeedbackMessage(message, isSuccess) {
    // Create a temporary message element
    const messageElement = document.createElement('div');
    messageElement.className = `skill-feedback ${isSuccess ? 'success' : 'error'}`;
    messageElement.textContent = message;
    
    // Add to skill tree container
    const container = document.getElementById('character-skill-tree');
    container.appendChild(messageElement);
    
    // Remove after a few seconds
    setTimeout(() => {
        container.removeChild(messageElement);
    }, 3000);
}

// Set up event listeners for skill tree UI
function setupEventListeners() {
    // Branch tab switching
    document.querySelectorAll('.skill-tree-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const branchId = tab.dataset.branch;
            switchBranch(branchId);
        });
    });
    
    // Apply skill point button
    const applyButton = document.getElementById('apply-skill-point');
    if (applyButton) {
        applyButton.addEventListener('click', applySelectedSkill);
    }
}

// Add additional CSS for feedback messages and skill tree components
const style = document.createElement('style');
style.textContent = `
    .skill-feedback {
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        text-align: center;
        animation: fadeIn 0.3s ease-in-out;
    }
    
    .skill-feedback.success {
        background-color: rgba(40, 167, 69, 0.2);
        border: 1px solid #28a745;
        color: #28a745;
    }
    
    .skill-feedback.error {
        background-color: rgba(220, 53, 69, 0.2);
        border: 1px solid #dc3545;
        color: #dc3545;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .skill-tree-branch {
        position: relative;
        min-height: 400px;
    }
    
    .connectors-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
    
    .nodes-container {
        position: relative;
        z-index: 2;
    }
    
    .skill-row {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        position: relative;
    }
    
    .skill-cell {
        width: 90px;
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 2;
    }
    
    .skill-connector {
        background: linear-gradient(to right, #8B4513, #CD853F);
        box-shadow: 0 0 5px rgba(205, 133, 63, 0.5);
        border-radius: 2px;
        z-index: 1;
    }
    
    .skill-node {
        background-color: #2a2a2a;
        border: 1px solid #555;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        transition: all 0.2s ease;
    }
    
    .skill-node:hover {
        box-shadow: 0 0 10px rgba(110, 178, 255, 0.6);
        transform: scale(1.1);
    }
    
    .skill-node.selected {
        border: 2px solid #6eb2ff;
        box-shadow: 0 0 15px rgba(110, 178, 255, 0.7);
    }
    
    .skill-node.locked {
        opacity: 0.6;
        cursor: default;
        background-color: #1a1a1a;
    }
    
    .skill-node.max-rank {
        border: 2px solid gold;
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    }
`;

document.head.appendChild(style);