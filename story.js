// story.js - Main story display and navigation
import { getPlayerAttribute, updatePlayerAttribute } from './player.js';
import storyManager, { initStoryManager, getNode } from './story/story-manager.js';
import storyState from './story/story-state.js';
import eventManager, { EventType } from './story/event-system.js';
import relationshipManager from './story/relationship-system.js';
import { NodeType, StatCheck } from './story/story-node.js';
import { typewriter } from './typewriter.js';
import * as transitions from './transitions.js';

// UI references
const storyDisplay = document.getElementById('story-display');
const choicesDisplay = document.getElementById('choices');
const statFeedbackDisplay = document.getElementById('stat-feedback');

// Export for use in other modules
export { storyState };

// Initialize the story system
export async function initStory(startingChapter = 'prologue') {
    const nodes = await initStoryManager(startingChapter);
    
    if (!nodes) {
        console.error('Failed to load story nodes');
        return false;
    }
    
    // Set up event listeners for story events
    setupEventListeners();
    
    // Start with the first node
    showNode('0');
    
    return true;
}

// Set up event listeners for story events
function setupEventListeners() {
    // Listen for player stats changing to update UI
    eventManager.on(EventType.PLAYER_STAT_CHANGED, 'story-stat-change', (event) => {
        const { stat, value, oldValue } = event;
        if (value !== oldValue) {
            const change = value - oldValue;
            displayStatChange(stat, change);
        }
    });
    
    // Listen for character relationship changes
    eventManager.on(EventType.RELATIONSHIP_CHANGED, 'story-relationship-change', (event) => {
        const { characterId, trait, value, oldValue } = event;
        if (value !== oldValue) {
            const change = value - oldValue;
            displayRelationshipChange(characterId, trait, change);
        }
    });
}

// Display stat change feedback to the player
export function displayStatChange(stat, change) {
    if (!change || change === 0) return;
    
    const sign = change > 0 ? '+' : '';
    const statName = stat.charAt(0).toUpperCase() + stat.slice(1); // Capitalize stat name
    const message = `${statName} ${sign}${change}`;
    
    const feedbackElement = document.createElement('div');
    feedbackElement.classList.add('stat-feedback');
    feedbackElement.textContent = message;
    
    // Add appropriate styling based on positive or negative change
    if (change > 0) {
        feedbackElement.classList.add('positive');
    } else {
        feedbackElement.classList.add('negative');
    }
    
    statFeedbackDisplay.appendChild(feedbackElement);
    
    // Remove the feedback after animation completes
    setTimeout(() => {
        feedbackElement.classList.add('fade-out');
        setTimeout(() => {
            statFeedbackDisplay.removeChild(feedbackElement);
        }, 500);
    }, 2000);
}

// Display relationship change feedback to the player
export function displayRelationshipChange(characterId, trait, change) {
    if (!change || change === 0) return;
    
    const sign = change > 0 ? '+' : '';
    const character = characterId.charAt(0).toUpperCase() + characterId.slice(1); // Capitalize name
    const traitName = trait.charAt(0).toUpperCase() + trait.slice(1); // Capitalize trait
    const message = `${character}: ${traitName} ${sign}${change}`;
    
    const feedbackElement = document.createElement('div');
    feedbackElement.classList.add('relationship-feedback');
    feedbackElement.textContent = message;
    
    // Add appropriate styling based on positive or negative change
    if (change > 0) {
        feedbackElement.classList.add('positive');
    } else {
        feedbackElement.classList.add('negative');
    }
    
    statFeedbackDisplay.appendChild(feedbackElement);
    
    // Remove the feedback after animation completes
    setTimeout(() => {
        feedbackElement.classList.add('fade-out');
        setTimeout(() => {
            statFeedbackDisplay.removeChild(feedbackElement);
        }, 500);
    }, 2000);
}

// Display a story node to the player
export function showNode(nodeId) {
    // Get the node from the story manager
    const node = getNode(nodeId);
    if (!node) {
        console.error(`Node ${nodeId} not found`);
        return;
    }
    
    // Mark the node as visited
    storyState.visitNode(nodeId);
    
    // Execute onEnter trigger if present
    if (node.triggers && node.triggers.onEnter) {
        node.triggers.onEnter();
    }
    
    // Handle special node types
    if (handleSpecialNodeTypes(node)) {
        return; // Special handling took over
    }
    
    // Display the node text
    displayNodeText(node);
    
    // Display choices or next button
    displayChoices(node);
    
    // Handle auto-advance if needed
    handleAutoAdvance(node);
}

// Process any special node type handling
function handleSpecialNodeTypes(node) {
    // Handle transitions to other screens
    if (node.transitionTo) {
        switch (node.transitionTo) {
            case 'battle':
                transitions.transitionToBattle(node.battleType);
                return true;
            case 'camp':
                transitions.transitionToCamp();
                return true;
            case 'gameOver':
                transitions.transitionToGameOver(node.deathCause);
                return true;
        }
    }
    
    // Handle specific node types
    switch (node.type) {
        case NodeType.COMBAT:
            transitions.transitionToBattle(node.battleType);
            return true;
        case NodeType.CUTSCENE:
            // Handle cutscene presentation
            return false; // Continue with normal processing after cutscene
        default:
            return false;
    }
}

// Display node text with typewriter effect
function displayNodeText(node) {
    storyDisplay.innerHTML = '';
    
    // Apply typewriter effect to node text
    typewriter(storyDisplay, node.text);
}

// Display choices for a node
function displayChoices(node) {
    choicesDisplay.innerHTML = '';
    
    if (node.choices && node.choices.length > 0) {
        // Display all valid choices
        const availableChoices = node.choices.filter(choice => {
            // Check visibility condition
            return !choice.conditions || !choice.conditions.visible || choice.conditions.visible();
        });
        
        if (availableChoices.length > 0) {
            availableChoices.forEach((choice, index) => {
                const choiceButton = createChoiceButton(node, choice, index);
                choicesDisplay.appendChild(choiceButton);
            });
        } else {
            // No valid choices, show continue button
            displayContinueButton(node);
        }
    } else {
        // No choices, show continue button
        displayContinueButton(node);
    }
}

// Create a button for a choice
function createChoiceButton(node, choice, index) {
    const choiceButton = document.createElement('button');
    choiceButton.textContent = choice.text;
    choiceButton.classList.add('choice-button');
    
    // Check if choice should be enabled
    const isEnabled = !choice.conditions || !choice.conditions.enabled || choice.conditions.enabled();
    if (!isEnabled) {
        choiceButton.disabled = true;
        choiceButton.classList.add('disabled');
    }
    
    // Handle stat checks
    if (choice.statCheck) {
        const { stat, threshold } = choice.statCheck;
        const statValue = getPlayerAttribute(stat);
        
        // Add stat check info to button
        choiceButton.textContent = `${choice.text} [${stat.toUpperCase()} ${statValue}/${threshold}]`;
        
        // Determine if stat check passes
        const passesCheck = statValue >= threshold;
        
        if (!passesCheck) {
            // Visual indication of likely failure
            choiceButton.classList.add('risky-choice');
        }
    }
    
    // Set up click handler
    choiceButton.addEventListener('click', () => {
        handleChoiceSelection(node, choice, index);
    });
    
    return choiceButton;
}

// Handle player selecting a choice
function handleChoiceSelection(node, choice, index) {
    // Record the choice was made
    storyState.completeChoice(node.id, choice.text || index);
    
    // Clear choices display
    choicesDisplay.innerHTML = '';
    
    let feedbackText = '';
    let nextNodeId = null;
    
    // Handle stat checks
    if (choice.statCheck) {
        const { stat, threshold, success, failure } = choice.statCheck;
        const statValue = getPlayerAttribute(stat);
        const passesCheck = statValue >= threshold;
        
        if (passesCheck) {
            // Success path
            if (success.onSelect) {
                feedbackText = success.onSelect(true);
            }
            nextNodeId = success.nextNode;
        } else {
            // Failure path
            if (failure.onSelect) {
                feedbackText = failure.onSelect(false);
            }
            nextNodeId = failure.nextNode;
        }
    } else {
        // Normal choice without stat check
        if (choice.onSelect) {
            feedbackText = choice.onSelect(true);
        }
        nextNodeId = choice.nextNode;
    }
    
    // Display feedback if any
    if (feedbackText) {
        displayFeedback(feedbackText);
    }
    
    // Move to the next node
    if (nextNodeId !== null) {
        // Add a small delay for player to read feedback
        setTimeout(() => {
            showNode(nextNodeId);
        }, feedbackText ? 1500 : 0);
    } else if (node.next) {
        // Default to node's next property
        setTimeout(() => {
            showNode(node.next);
        }, feedbackText ? 1500 : 0);
    }
    
    // Execute onExit trigger if present
    if (node.triggers && node.triggers.onExit) {
        node.triggers.onExit();
    }
}

// Display a continue button for nodes without choices
function displayContinueButton(node) {
    if (node.end) {
        // End of chapter, no continue button
        return;
    }
    
    const continueButton = document.createElement('button');
    continueButton.textContent = 'Continue';
    continueButton.classList.add('choice-button', 'continue-button');
    
    continueButton.addEventListener('click', () => {
        // Execute onExit trigger if present
        if (node.triggers && node.triggers.onExit) {
            node.triggers.onExit();
        }
        
        // Move to the next node
        if (node.next) {
            showNode(node.next);
        }
    });
    
    choicesDisplay.appendChild(continueButton);
}

// Handle auto-advancement for nodes
function handleAutoAdvance(node) {
    if (node.autoAdvance) {
        const delay = node.autoAdvanceDelay || 3000; // Default 3 seconds
        
        setTimeout(() => {
            // Execute onExit trigger if present
            if (node.triggers && node.triggers.onExit) {
                node.triggers.onExit();
            }
            
            // Move to the next node
            if (node.next) {
                showNode(node.next);
            }
        }, delay);
    }
}

// Display feedback text (e.g., from stat checks)
function displayFeedback(feedbackText) {
    // Create a temporary element to display the feedback
    const feedbackElement = document.createElement('div');
    feedbackElement.classList.add('choice-feedback');
    feedbackElement.innerHTML = feedbackText;
    
    // Add to the story display
    storyDisplay.appendChild(feedbackElement);
    
    // Scroll to ensure it's visible
    feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
}