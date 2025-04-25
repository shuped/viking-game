import { typewriterEffect, cancelTypewriter } from './typewriter.js';
import { transitionToScreen } from './transitions.js';
import { initCamp } from './camp.js';
import { initBattle } from './battle.js';
import { playerState } from './player.js';
import { storyState } from './story/story-state.js';
import { 
    getCurrentStoryNodes, 
    getCurrentChapter,
    transitionToChapter 
} from './story/story-manager.js';

let currentNodeId = 0;
const textBox = document.getElementById('cinematic-text-box');
const textContent = document.getElementById('cinematic-text-content');
const choiceBox = document.getElementById('cinematic-button-box');

// Display story text for the current node
async function displayStoryText(nodeId) {
    // Cancel any active typewriter effect
    cancelTypewriter();
    
    // Small delay to ensure typewriter is cancelled
    await new Promise(resolve => setTimeout(resolve, 10));
    
    currentNodeId = nodeId;
    const storyNodes = getCurrentStoryNodes();
    const currentNode = storyNodes[nodeId];
    
    // Mark this node as visited in our story state
    storyState.visitNode(nodeId);
    
    // Clear any existing choices
    choiceBox.innerHTML = '';
    
    // Remove any existing click indicators
    const existingIndicator = document.querySelector('.click-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Prepare text box but keep it invisible
    textBox.style.opacity = '0';
    textBox.classList.add('visible');
    
    // Clear text content before starting new typewriter effect
    textContent.innerHTML = '';
    
    // Fade in text box with animation
    await new Promise(resolve => {
        setTimeout(() => {
            // Start fade-in animation
            textBox.style.transition = 'opacity 0.5s ease-in';
            textBox.style.opacity = '1';
            
            // Wait for fade-in to complete before continuing
            setTimeout(resolve, 500);
        }, 100); // Small delay to ensure CSS transition works properly
    });
    
    // Display the text with typewriter effect after text box has faded in
    await typewriterEffect(textContent, currentNode.text);
    
    // Check if this node has choices
    if (currentNode.choices) {
        displayChoices(currentNode.choices);
    }
}

// Display choices for the current node
function displayChoices(choices) {
    // Existing code remains the same
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
            handleChoiceSelection(choice.nextNode);
        });
        
        choiceList.appendChild(choiceItem);
    });
    
    choiceContainer.appendChild(choiceList);
    choiceBox.appendChild(choiceContainer);
}

// Handle the player's choice selection
function handleChoiceSelection(nextNodeId) {
    displayStoryText(nextNodeId);
}

// Setup story navigation listeners
function setupStoryListeners(screens) {
    document.getElementById('cinematic-frame').addEventListener('click', async () => {
        const storyNodes = getCurrentStoryNodes();
        const currentNode = storyNodes[currentNodeId];
        
        // Only allow advancing if we're not showing choices
        if (!currentNode.choices) {
            if (currentNode.next) {
                // Check if this node has a transition property
                if (currentNode.transitionTo) {
                    // Handle different screen transitions based on transitionTo property
                    if (currentNode.transitionTo === 'camp') {
                        transitionToScreen(screens.cinematicUI, screens.camp, () => {
                            initCamp();
                        });
                    }
                    else if (currentNode.transitionTo === 'battle') {
                        transitionToScreen(screens.cinematicUI, screens.battle, () => {
                            // Use the battleType property to determine which battle to initialize
                            initBattle(currentNode.battleType || 'first');
                        });
                    }
                } 
                else {
                    // Normal progression to next story node
                    displayStoryText(currentNode.next);
                }
            } else if (currentNode.end) {
                // Check if there's a next chapter to transition to
                if (currentNode.nextChapter) {
                    console.log(`Transitioning to chapter: ${currentNode.nextChapter}`);
                    const success = await transitionToChapter(currentNode.nextChapter);
                    if (success) {
                        // Start at the beginning of the new chapter (node 0)
                        displayStoryText(0);
                    } else {
                        console.error("Failed to load next chapter");
                    }
                } else {
                    console.log("End of story reached"); 
                    // Here you could add code to end the game or show credits
                }
            }
        }
    });
}

export { displayStoryText, setupStoryListeners, currentNodeId, storyState };