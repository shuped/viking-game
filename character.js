// Character management system
import { playerState, getWeaponTypeLevel, getWeaponTypeLevelProgress } from './player.js';
import { screens } from './main.js';

// DOM Elements
const characterButton = document.getElementById('character-button');
const characterScreen = document.getElementById('character-screen');
const closeCharacterButton = document.getElementById('close-character');

// Track previous active screen
let previousActiveScreen = null;

// Initialize the character management system
export function initCharacter() {
    console.log('Character Management System Initialized');
    
    // Add character screen to screens object
    if (screens) {
        screens.character = characterScreen;
    }

    // Set up event listeners
    characterButton.addEventListener('click', openCharacterScreen);
    closeCharacterButton.addEventListener('click', closeCharacterScreen);

    // Initial UI update
    updateCharacterUI();
}

// Open character screen
function openCharacterScreen() {
    // Close any open activity modals in the camp UI 
    document.querySelectorAll('.activity-modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
    
    // Store the current active screen
    previousActiveScreen = document.querySelector('.screen.active:not(#character-screen)');
    
    // Update character UI with latest player stats
    updateCharacterUI();
    
    // Set high z-index to ensure character screen appears on top
    characterScreen.style.zIndex = "1001";
    
    // Show character screen
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen !== characterScreen) {
            screen.classList.remove('active');
        }
    });
    
    characterScreen.classList.add('active');
    
    // Force display properties to ensure visibility
    characterScreen.style.display = 'block';
    characterScreen.style.visibility = 'visible';
    
    // Ensure camp screen is behind if we're coming from it
    if (previousActiveScreen && previousActiveScreen.id === 'camp-ui') {
        previousActiveScreen.style.zIndex = "90";
    }
}

// Close character screen and return to previous screen
function closeCharacterScreen() {
    // Reset all overridden styles
    characterScreen.style.zIndex = "";
    characterScreen.style.display = "";
    characterScreen.style.visibility = "";
    characterScreen.classList.remove('active');
    
    if (previousActiveScreen) {
        // Reset any overridden z-index
        previousActiveScreen.style.zIndex = "";
        previousActiveScreen.classList.add('active');
    } else {
        // Default to cinematic UI if no previous screen
        screens.cinematicUI.classList.add('active');
    }
}

// Update all UI elements based on player state
function updateCharacterUI() {
    try {
        // Update level and experience
        updateLevelDisplay(playerState.level, playerState.exp);
        
        // Update stats
        updateStatBar('strength', playerState.strength, 20);
        updateStatBar('agility', playerState.agility, 20);
        updateStatBar('endurance', playerState.endurance, 20);
        updateStatBar('coordination', playerState.coordination, 20);
        updateStatBar('vitality', playerState.vitality, 20);
        updateStatBar('weaponSkill', playerState.weaponSkill, 20);
        
        // Update weapon mastery levels
        updateWeaponMasteryDisplay();
        
        // Update health and energy
        updateResourceBar('health', playerState.health, playerState.maxHealth);
        updateResourceBar('energy', playerState.energy, playerState.maxEnergy);
        updateResourceBar('fatigue', playerState.fatigue, 100);
        
        // Update reputation and ravens
        updateReputationBar(playerState.reputation, playerState.whiteRaven, playerState.blackRaven);
        
        // Update inventory
        updateInventoryItems(playerState.inventory);
    } catch (error) {
        console.error('Error updating character UI:', error);
    }
}

// Update a stat bar
function updateStatBar(statName, value, maxValue) {
    const fillElement = document.querySelector(`.${statName}-fill`);
    if (!fillElement) {
        console.warn(`Stat fill element for ${statName} not found`);
        return;
    }
    
    const valueElement = fillElement.parentElement.querySelector('.stat-value');
    if (!valueElement) {
        console.warn(`Stat value element for ${statName} not found`);
        return;
    }
    
    const percentage = (value / maxValue) * 100;
    fillElement.style.width = `${percentage}%`;
    valueElement.textContent = value;
}

// Update a resource bar
function updateResourceBar(resourceName, value, maxValue) {
    // First, make sure we're only searching within the character screen
    const characterScreen = document.getElementById('character-screen');
    
    // Now find the specific resource container by looking for the resource-name div with matching text
    const resourceContainers = characterScreen.querySelectorAll('.resource-container');
    let targetContainer = null;
    
    for (const container of resourceContainers) {
        const nameElement = container.querySelector('.resource-name');
        if (nameElement && nameElement.textContent.toLowerCase().includes(resourceName.toLowerCase())) {
            targetContainer = container;
            break;
        }
    }
    
    if (!targetContainer) {
        console.warn(`Resource container for ${resourceName} not found in character screen`);
        return;
    }
    
    // Now find the fill and value elements within this specific container
    const fillElement = targetContainer.querySelector(`.resource-fill`);
    const valueElement = targetContainer.querySelector(`.resource-value`);
    
    if (!fillElement) {
        console.warn(`Resource fill element for ${resourceName} not found`);
        return;
    }
    
    if (!valueElement) {
        console.warn(`Resource value element for ${resourceName} not found`);
        return;
    }
    
    const percentage = (value / maxValue) * 100;
    fillElement.style.width = `${percentage}%`;
    valueElement.textContent = `${value}/${maxValue}`;
}

// Update reputation bar and raven levels
function updateReputationBar(reputation, whiteRaven, blackRaven) {
    try {
        // Update raven levels
        const whiteRavenElement = document.querySelector('.white-raven .raven-level');
        const blackRavenElement = document.querySelector('.black-raven .raven-level');
        const reputationFillElement = document.querySelector('.reputation-fill');
        
        if (whiteRavenElement) whiteRavenElement.textContent = whiteRaven;
        if (blackRavenElement) blackRavenElement.textContent = blackRaven;
        
        // Update reputation bar
        if (reputationFillElement) {
            const reputationPercentage = ((reputation + 100) / 200) * 100; // Convert -100 to 100 scale to 0-100%
            reputationFillElement.style.width = `${reputationPercentage}%`;
        }
    } catch (error) {
        console.error('Error updating reputation bar:', error);
    }
}

// Update level and experience display
function updateLevelDisplay(level, exp) {
    try {
        const levelElement = document.querySelector('.character-level');
        const expBarElement = document.querySelector('.exp-fill');
        const expValueElement = document.querySelector('.exp-value');
        const skillPointsElement = document.querySelector('.skill-points-value');
        
        if (!levelElement || !expBarElement || !expValueElement) {
            console.warn('Level display elements not found, creating them');
            createLevelDisplayElements();
            return updateLevelDisplay(level, exp); // Try again after creating elements
        }
        
        // Update level number
        levelElement.textContent = level;
        
        // Calculate exp percentage and required exp to level
        const expToLevel = level * 100;
        const expPercentage = (exp / expToLevel) * 100;
        
        // Update exp bar and text
        expBarElement.style.width = `${expPercentage}%`;
        expValueElement.textContent = `${exp}/${expToLevel} XP`;
        
        // Update skill points if element exists
        if (skillPointsElement) {
            skillPointsElement.textContent = playerState.skillPoints || 0;
        }
    } catch (error) {
        console.error('Error updating level display:', error);
    }
}

// Create level display elements if they don't exist
function createLevelDisplayElements() {
    const characterScreen = document.getElementById('character-screen');
    if (!characterScreen) return;
    
    // Check if a stats container already exists
    let statsContainer = characterScreen.querySelector('.stats-container');
    
    if (!statsContainer) {
        // Create stats container if it doesn't exist
        statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';
        characterScreen.appendChild(statsContainer);
    }
    
    // Create level display section
    const levelSection = document.createElement('div');
    levelSection.className = 'level-section';
    
    // Create level display
    const levelDisplay = document.createElement('div');
    levelDisplay.className = 'level-display';
    
    const levelLabel = document.createElement('div');
    levelLabel.className = 'level-label';
    levelLabel.textContent = 'Level:';
    
    const levelValue = document.createElement('div');
    levelValue.className = 'character-level';
    levelValue.textContent = '1';
    
    levelDisplay.appendChild(levelLabel);
    levelDisplay.appendChild(levelValue);
    
    // Create exp bar
    const expContainer = document.createElement('div');
    expContainer.className = 'exp-container';
    
    const expBar = document.createElement('div');
    expBar.className = 'exp-bar';
    
    const expFill = document.createElement('div');
    expFill.className = 'exp-fill';
    
    const expValue = document.createElement('div');
    expValue.className = 'exp-value';
    expValue.textContent = '0/100 XP';
    
    expBar.appendChild(expFill);
    expContainer.appendChild(expBar);
    expContainer.appendChild(expValue);
    
    // Create skill points display
    const skillPointsContainer = document.createElement('div');
    skillPointsContainer.className = 'skill-points-container';
    
    const skillPointsLabel = document.createElement('div');
    skillPointsLabel.className = 'skill-points-label';
    skillPointsLabel.textContent = 'Skill Points:';
    
    const skillPointsValue = document.createElement('div');
    skillPointsValue.className = 'skill-points-value';
    skillPointsValue.textContent = '0';
    
    skillPointsContainer.appendChild(skillPointsLabel);
    skillPointsContainer.appendChild(skillPointsValue);
    
    // Add everything to the level section
    levelSection.appendChild(levelDisplay);
    levelSection.appendChild(expContainer);
    levelSection.appendChild(skillPointsContainer);
    
    // Insert at the top of the stats container
    statsContainer.insertBefore(levelSection, statsContainer.firstChild);
}

// Update inventory items
function updateInventoryItems(inventory) {
    const inventoryContainer = document.getElementById('inventory-items');
    if (!inventoryContainer) {
        console.warn('Inventory container not found');
        return;
    }
    
    // Clear existing items
    inventoryContainer.innerHTML = '';
    
    if (inventory.length === 0) {
        // Show empty inventory message
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-inventory';
        emptyDiv.textContent = 'Your inventory is empty.';
        inventoryContainer.appendChild(emptyDiv);
    } else {
        // Create item elements
        inventory.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            
            const iconDiv = document.createElement('div');
            iconDiv.className = 'item-icon';
            iconDiv.textContent = item.icon || '📦'; // Default icon if none provided
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'item-name';
            nameDiv.textContent = item.name;
            
            itemDiv.appendChild(iconDiv);
            itemDiv.appendChild(nameDiv);
            inventoryContainer.appendChild(itemDiv);
            
            // Add tooltip/description event
            itemDiv.addEventListener('click', () => {
                alert(`${item.name}: ${item.description || 'No description available.'}`);
            });
        });
    }
}

// Update weapon mastery display
function updateWeaponMasteryDisplay() {
    try {
        // Check if the section exists first
        let weaponMasterySection = document.getElementById('weapon-mastery-section');
        if (!weaponMasterySection) {
            // Create the section if it doesn't exist
            createWeaponMasterySection();
            return updateWeaponMasteryDisplay(); // Try again after creating section
        }
        
        // Get the container for weapon mastery levels
        const weaponMasteryContainer = document.getElementById('weapon-mastery-container');
        if (!weaponMasteryContainer) {
            console.warn('Weapon mastery container not found');
            return;
        }
        
        // Clear existing content
        weaponMasteryContainer.innerHTML = '';
        
        // Use the correct weapon types from our game
        const weaponTypes = ['sword', 'mace', 'axe', 'polearm'];
        
        // Create display for each weapon type
        weaponTypes.forEach(type => {
            const level = getWeaponTypeLevel(type);
            const progress = getWeaponTypeLevelProgress(type);
            
            const weaponRow = document.createElement('div');
            weaponRow.className = 'weapon-mastery-row';
            
            const weaponName = document.createElement('div');
            weaponName.className = 'weapon-type-name';
            weaponName.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}s`;
            
            const weaponLevel = document.createElement('div');
            weaponLevel.className = 'weapon-type-level';
            weaponLevel.textContent = level;
            
            weaponRow.appendChild(weaponName);
            weaponRow.appendChild(weaponLevel);
            
            weaponMasteryContainer.appendChild(weaponRow);
        });
    } catch (error) {
        console.error('Error updating weapon mastery display:', error);
    }
}

// Create weapon mastery section if it doesn't exist
function createWeaponMasterySection() {
    const characterStats = document.getElementById('character-stats');
    if (!characterStats) {
        console.warn('Character stats section not found');
        return;
    }
    
    // Create weapon mastery section
    const weaponMasterySection = document.createElement('div');
    weaponMasterySection.id = 'weapon-mastery-section';
    weaponMasterySection.className = 'stats-section';
    
    // Create section header
    const sectionHeader = document.createElement('h3');
    sectionHeader.textContent = 'Weapon Mastery';
    weaponMasterySection.appendChild(sectionHeader);
    
    // Create container for weapon mastery levels
    const weaponMasteryContainer = document.createElement('div');
    weaponMasteryContainer.id = 'weapon-mastery-container';
    weaponMasteryContainer.className = 'weapon-mastery-container';
    weaponMasterySection.appendChild(weaponMasteryContainer);
    
    // Add to character stats section
    characterStats.appendChild(weaponMasterySection);
}

// Public function to refresh character UI from other modules
export function refreshCharacterUI() {
    updateCharacterUI();
}