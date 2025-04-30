import { typewriterEffect, cancelTypewriter, completeTypewriter, typewriterActive } from './typewriter.js';
import { transitionToScreen } from './transitions.js';
import { initCamp } from './camp.js';
import { initBattle } from './battle.js';
import { initGameOver } from './gameOver.js';
import { playerState } from './player.js';
import { storyState } from './story/story-state.js';
import { 
    getCurrentStoryNodes, 
    getCurrentChapter,
    transitionToChapter 
} from './story/story-manager.js';

// State variables
let currentNodeId = 0;
let isDisplayingStatChanges = false;

// DOM elements
const textBox = document.getElementById('cinematic-text-box');
const textContent = document.getElementById('cinematic-text-content');
const choiceBox = document.getElementById('cinematic-button-box');

// Common UI Rendering Functions
function clearUI() {
    choiceBox.innerHTML = '';
    const existingIndicator = document.querySelector('.click-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
}

async function renderTextBox(text) {
    textBox.style.opacity = '0';
    textBox.classList.add('visible');
    textContent.innerHTML = '';
    
    await fadeInTextBox();
    await typewriterEffect(textContent, text);
}

function fadeInTextBox() {
    return new Promise(resolve => {
        setTimeout(() => {
            textBox.style.transition = 'opacity 0.5s ease-in';
            textBox.style.opacity = '1';
            setTimeout(resolve, 500);
        }, 100);
    });
}

// Core Logic Functions
function processStatCheck(statCheck) {
    const { stat, threshold, success, failure } = statCheck;
    const playerStatValue = playerState[stat] || 0;
    const passed = playerStatValue >= threshold;
    
    console.log(`Stat check: ${stat}(${playerStatValue}) vs threshold(${threshold}) - ${passed ? 'PASS' : 'FAIL'}`);
    
    return {
        passed,
        handler: passed ? success : failure
    };
}

async function handleStatChangeText(handler, nextNodeId) {
    if (!handler || !handler.onSelect) return nextNodeId;
    
    const statChangeText = handler.onSelect(handler.passed !== false);
    if (statChangeText) {
        await displayStatChangeText(statChangeText, handler.nextNode || nextNodeId);
        return null; // Already handled transition
    }
    
    return handler.nextNode || nextNodeId;
}

// Display story text for the current node
async function displayStoryText(nodeId) {
    // Start by ensuring any previous typewriter effect is cancelled
    await cancelTypewriter();
    
    currentNodeId = nodeId;
    const storyNodes = getCurrentStoryNodes();
    const currentNode = storyNodes[nodeId];
    
    // Mark this node as visited in our story state
    storyState.visitNode(nodeId);
    
    // Execute the onEnter function if it exists
    if (currentNode.onEnter) {
        currentNode.onEnter();
    }
    
    // Clear UI elements
    clearUI();
    
    // Handle node-level stat checks
    if (currentNode.statCheck) {
        await renderTextBox(currentNode.text);
        
        const { handler } = processStatCheck(currentNode.statCheck);
        const nextNodeId = await handleStatChangeText(handler, currentNode.next);
        
        if (nextNodeId) {
            await displayStoryText(nextNodeId);
        }
        return;
    }
    
    // Standard node display logic
    await renderTextBox(currentNode.text);
    
    // Only display choices after typewriter has fully completed
    if (currentNode.choices) {
        displayChoices(currentNode.choices);
    }
}

// Setup story navigation listeners
function setupStoryListeners(screens) {
    document.getElementById('cinematic-frame').addEventListener('click', async () => {
        const storyNodes = getCurrentStoryNodes();
        
        // Guard against null/undefined storyNodes or invalid currentNodeId
        if (!storyNodes || currentNodeId === undefined || !(currentNodeId in storyNodes)) {
            console.error(`Invalid story node: ${currentNodeId}`);
            return;
        }
        
        const currentNode = storyNodes[currentNodeId];
        
        // If typewriter is active, complete it instead of advancing
        if (typewriterActive) {
            await completeTypewriter();
            return;
        }
        
        // Only allow advancing if we're not showing choices and not displaying stat changes
        if (!currentNode.choices && !isDisplayingStatChanges) {
            // Try screen transitions first
            if (handleScreenTransition(currentNode, screens)) {
                return;
            }
            
            // Try chapter transitions next
            if (await handleChapterTransition(currentNode)) {
                return;
            }
            
            // Normal progression to next story node
            if (currentNode.next) {
                displayStoryText(currentNode.next);
            }
        }
    });
}

// Handle screen transitions
function handleScreenTransition(currentNode, screens) {
    if (currentNode.transitionTo) {
        const transitions = {
            'camp': () => transitionToScreen(screens.cinematicUI, screens.camp, initCamp),
            'battle': () => transitionToScreen(screens.cinematicUI, screens.battle, 
                      () => initBattle(currentNode.battleType || 'first')),
            'gameOver': () => transitionToScreen(screens.cinematicUI, screens.gameOver, 
                      () => initGameOver(currentNode.deathCause))
        };
        
        if (transitions[currentNode.transitionTo]) {
            transitions[currentNode.transitionTo]();
            return true;
        }
    }
    return false;
}

// Handle chapter transitions
async function handleChapterTransition(currentNode) {
    if (currentNode.end && currentNode.nextChapter) {
        console.log(`Transitioning to chapter: ${currentNode.nextChapter}`);
        const success = await transitionToChapter(currentNode.nextChapter);
        if (success) {
            // Start at the beginning of the new chapter (node 0)
            displayStoryText(0);
            return true;
        } else {
            console.error("Failed to load next chapter");
        }
    } else if (currentNode.end) {
        console.log("End of story reached");
        // Here you could add code to end the game or show credits
    }
    return false;
}

// Display player state changes in the UI
function displayStatChange(attribute, value) {
    // Create a floating notification
    const statChangeNotification = document.createElement('div');
    statChangeNotification.className = 'stat-change-notification';
    statChangeNotification.innerText = `${attribute} ${value > 0 ? '+' : ''}${value}`;
    statChangeNotification.style.position = 'absolute';
    statChangeNotification.style.bottom = '100px';
    statChangeNotification.style.left = '50%';
    statChangeNotification.style.transform = 'translateX(-50%)';
    statChangeNotification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    statChangeNotification.style.color = 'white';
    statChangeNotification.style.padding = '10px 20px';
    statChangeNotification.style.borderRadius = '10px';
    statChangeNotification.style.pointerEvents = 'none';
    document.body.appendChild(statChangeNotification);
    
    // Animate the notification
    setTimeout(() => {
        statChangeNotification.style.transition = 'all 0.5s ease';
        statChangeNotification.style.transform = 'translateX(-50%) translateY(-10px)';
        statChangeNotification.style.opacity = '0';
    }, 100);
    
    // Remove the notification after the animation
    setTimeout(() => {
        document.body.removeChild(statChangeNotification);
    }, 600);
}

// Handle the player's choice selection
async function handleChoiceSelection(nextNodeId, choice) {
    // Process stat check if present
    if (choice.statCheck) {
        const { passed, handler } = processStatCheck(choice.statCheck);
        const nextNode = await handleStatChangeText(handler, nextNodeId);
        
        if (nextNode) {
            await displayStoryText(nextNode);
        }
        return;
    }
    
    // Apply regular choice effects
    if (choice.onSelect) {
        const statChangeText = choice.onSelect(true);
        if (statChangeText) {
            // Display the stat change text first before continuing to the next node
            await displayStatChangeText(statChangeText, nextNodeId);
            return;
        }
    }
    
    // Continue with normal story progression
    await displayStoryText(nextNodeId);
}

// Display stat change text in the story box and wait for player to continue
async function displayStatChangeText(statChangeText, nextNodeId) {
    // Set flag to prevent global click handler from interfering
    isDisplayingStatChanges = true;
    
    // Clear any existing choices
    choiceBox.innerHTML = '';
    
    // Create a container for the stat changes
    const statChangeContainer = document.createElement('div');
    statChangeContainer.style.color = '#a0a0a0'; // Grey text for stat changes
    statChangeContainer.style.marginTop = '15px';
    statChangeContainer.style.fontSize = '0.9em';
    
    // Add the stat change information
    statChangeContainer.innerHTML = statChangeText;
    
    // Add to the text content
    textContent.appendChild(statChangeContainer);
    
    // Return a promise that resolves when the user clicks to continue
    return new Promise(resolve => {
        // First, remove any existing click handlers on the cinematic frame
        const frame = document.getElementById('cinematic-frame');
        const oldClickHandler = frame._clickHandler;
        if (oldClickHandler) {
            frame.removeEventListener('click', oldClickHandler);
        }
        
        // Create our one-time click handler
        const onStatChangeClick = (event) => {
            // Remove this handler to prevent multiple calls
            frame.removeEventListener('click', onStatChangeClick);
            
            // Reset the flag before proceeding
            isDisplayingStatChanges = false;
            
            // Save a reference to this handler in case we need to clean it up later
            frame._clickHandler = null;
            
            // Continue to the next node
            displayStoryText(nextNodeId);
            resolve();
        };
        
        // Save a reference to this handler
        frame._clickHandler = onStatChangeClick;
        
        // Add the click handler with a slight delay to prevent accidental clicks
        setTimeout(() => {
            frame.addEventListener('click', onStatChangeClick);
        }, 300);
    });
}

// Display choices for the current node
function displayChoices(choices) {
    // Only display choices if typewriter is not active
    if (typewriterActive) {
        console.log('Attempted to display choices while typewriter is active - delaying');
        setTimeout(() => displayChoices(choices), 100);
        return;
    }
    
    choiceBox.innerHTML = '';
    
    // Create a styled container for the choices that resembles the text box
    const choiceContainer = document.createElement('div');
    choiceContainer.style.position = 'absolute';
    choiceContainer.style.bottom = '20px';
    choiceContainer.style.left = '20px';
    choiceContainer.style.right = '20px';
    choiceContainer.style.padding = '20px';
    choiceContainer.style.color = 'white';
    choiceContainer.style.fontSize = 'clamp(1rem, 1.5vw, 1.2rem)';
    
    // Apply the same border image as the text box
    choiceContainer.style.border = '9px solid transparent';
    choiceContainer.style.borderImageSource = 'url(\'assets/Text_Box.png\')';
    choiceContainer.style.borderImageSlice = '9';
    choiceContainer.style.borderImageWidth = '1';
    choiceContainer.style.borderImageOutset = '0.4';
    choiceContainer.style.borderImageRepeat = 'stretch';
    choiceContainer.style.backgroundColor = 'rgba(25, 21, 44, 0.8)';
    
    // Create a header for choices
    const choiceHeader = document.createElement('div');
    choiceHeader.textContent = 'What will you do?';
    choiceHeader.style.marginBottom = '15px';
    choiceHeader.style.fontStyle = 'italic';
    choiceHeader.style.textAlign = 'center';
    choiceContainer.appendChild(choiceHeader);
    
    // Create a list for choices
    const choiceList = document.createElement('ul');
    choiceList.style.listStyleType = 'none';
    choiceList.style.padding = '0';
    choiceList.style.margin = '0';
    choiceList.style.display = 'flex';
    choiceList.style.flexDirection = 'column';
    choiceList.style.gap = '10px';
    
    // Filter choices based on conditions
    const availableChoices = choices.filter((choice) => {
        if (choice.condition && !choice.condition()) {
            return false;
        }
        return true;
    });
    
    // Create UI elements for available choices
    availableChoices.forEach((choice, index) => {
        const choiceItem = document.createElement('li');
        choiceItem.textContent = `${index + 1}. ${choice.text}`;
        choiceItem.style.cursor = 'pointer';
        choiceItem.style.transition = 'transform 0.2s, color 0.2s';
        choiceItem.style.padding = '5px 10px';
        
        // Highlight effect on hover
        choiceItem.addEventListener('mouseover', () => {
            choiceItem.style.transform = 'translateX(10px)';
            choiceItem.style.color = '#4a90e2';
        });
        
        choiceItem.addEventListener('mouseout', () => {
            choiceItem.style.transform = 'translateX(0)';
            choiceItem.style.color = 'white';
        });
        
        choiceItem.addEventListener('click', () => {
            // Find the original index of this choice in the unfiltered list
            const originalIndex = choices.findIndex(c => c.text === choice.text);
            storyState.completeChoice(currentNodeId, originalIndex);            
            
            // Call the async function
            handleChoiceSelection(choice.nextNode, choice);
        });
        
        choiceList.appendChild(choiceItem);
    });
    
    choiceContainer.appendChild(choiceList);
    choiceBox.appendChild(choiceContainer);
}

export { displayStoryText, setupStoryListeners, currentNodeId, storyState, displayStatChange };