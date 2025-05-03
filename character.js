// Character management system
import { playerState } from './player.js';
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
        // Update stats
        updateStatBar('strength', playerState.strength, 20);
        updateStatBar('agility', playerState.agility, 20);
        updateStatBar('endurance', playerState.endurance, 20);
        updateStatBar('coordination', playerState.coordination, 20);
        updateStatBar('vitality', playerState.vitality, 20);
        updateStatBar('weaponSkill', playerState.weaponSkill, 20);
        
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

// Public function to refresh character UI from other modules
export function refreshCharacterUI() {
    updateCharacterUI();
}