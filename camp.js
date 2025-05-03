import { playerState } from './player.js';
import { transitionToScreen } from './transitions.js';
import { displayStoryText, proceedWithNextMainNode } from './story.js';
import { screens } from './main.js';
import { getCurrentChapter } from './story/story-manager.js';
import { storyState } from './story/story-state.js';
import { showTravelMap } from './travel.js';

// Camp UI Logic
let campTimeRemaining = 5; // Start with 5 time units
const campResultContent = document.getElementById('camp-result-content');

// Initialize camp UI
function initCamp() {
    // Reset camp time
    campTimeRemaining = 5;
    updateTimeDisplay();
    
    // Clear any previous results
    campResultContent.innerHTML = '<p>Welcome to camp. Choose an activity to begin.</p>';
    
    // Set up event listeners for camp activities
    setupCampEventListeners();
}

function updateTimeDisplay() {
    document.getElementById('time-value').textContent = campTimeRemaining;
}

function setupCampEventListeners() {
    // Activity buttons
    document.querySelectorAll('.camp-activity:not(.locked)').forEach(activity => {
        activity.addEventListener('click', () => {
            const activityType = activity.dataset.activity;
            openActivityModal(activityType);
        });
    });
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
    
    // Continue journey button
    document.getElementById('continue-journey').addEventListener('click', () => {
        proceedWithNextMainNode('camp', screens);
    });
    
    // Training modal options
    document.querySelectorAll('#training-modal .option-btn').forEach(button => {
        button.addEventListener('click', () => {
            const option = button.dataset.option;
            handleTraining(option);
            closeAllModals();
        });
    });
    
    // Rest modal options
    document.querySelectorAll('#rest-modal .option-btn').forEach(button => {
        button.addEventListener('click', () => {
            const option = button.dataset.option;
            handleRest(option);
            closeAllModals();
        });
    });
    
    // Companions modal options
    document.querySelectorAll('#companions-modal .option-btn').forEach(button => {
        button.addEventListener('click', () => {
            const option = button.dataset.option;
            handleCompanions(option);
            closeAllModals();
        });
    });
}

function openActivityModal(activityType) {
    // Check if we have time for activities
    if (campTimeRemaining <= 0) {
        campResultContent.innerHTML = '<p>You have no more time remaining. You must continue your journey.</p>';
        return;
    }
    
    // Open the appropriate modal based on activity type
    switch (activityType) {
        case 'training':
            document.getElementById('training-modal').classList.add('active');
            break;
        case 'rest':
            document.getElementById('rest-modal').classList.add('active');
            break;
        case 'companions':
            document.getElementById('companions-modal').classList.add('active');
            break;
        case 'travel':
            handleTravel();
            break;
        default:
            campResultContent.innerHTML = '<p>That activity is not available.</p>';
    }
}

function closeAllModals() {
    document.querySelectorAll('.activity-modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Roll a random number between 1 and 20 (D20)
function rollD20() {
    return Math.floor(Math.random() * 20) + 1;
}

// Handle training activities
function handleTraining(option) {
    // Deduct time
    campTimeRemaining -= 1;
    updateTimeDisplay();
    
    const roll = rollD20();
    let result = '';
    
    switch (option) {
        case 'solo':
            if (roll + playerState.strength > 15) {
                playerState.strength += 1;
                playerState.endurance += 1;
                result = '<p>You push yourself hard in training, focusing on your form. Your strength and endurance have increased!</p>';
            } else {
                playerState.fatigue += 5;
                result = '<p>You train hard but make little progress. You feel more fatigued.</p>';
            }
            break;
            
        case 'tier1':
            if (roll + playerState.reputation > 12) {
                playerState.strength += 1;
                playerState.coordination += 1;
                playerState.reputation += 1;
                result = '<p>You train with your crewmates, showing your skills. Your strength, coordination, and reputation have improved!</p>';
            } else {
                result = '<p>The training session is awkward. Your crewmates don\'t seem impressed.</p>';
            }
            break;
            
        case 'tier2':
            if (roll + playerState.reputation > 15) {
                playerState.strength += 1;
                playerState.agility += 1;
                playerState.weaponSkill += 1;
                result = '<p>The veterans share valuable techniques with you. Your strength, agility, and weapon skill have improved significantly!</p>';
            } else {
                result = '<p>The veterans find you lacking. They spend little time showing you their techniques.</p>';
                playerState.reputation -= 1;
            }
            break;
            
        case 'tier3':
            if (roll + playerState.reputation > 18) {
                playerState.strength += 1;
                playerState.agility += 1;
                playerState.weaponSkill += 2;
                playerState.reputation += 2;
                result = '<p>Hersir Olaf personally instructs you. His guidance greatly improves your skills and standing in the warband!</p>';
            } else {
                result = '<p>Hersir Olaf quickly loses patience with your fumbling. He walks away disappointed.</p>';
                playerState.reputation -= 2;
            }
            break;
    }
    
    campResultContent.innerHTML = result;
}

// Handle rest activities
function handleRest(option) {
    // Deduct time
    campTimeRemaining -= 1;
    updateTimeDisplay();
    
    const roll = rollD20();
    let result = '';
    
    switch (option) {
        case 'sleep':
            playerState.fatigue = Math.max(0, playerState.fatigue - 10);
            playerState.vitality += 1;
            result = '<p>You find a quiet spot and get some much-needed rest. Your fatigue is reduced and vitality improved.</p>';
            break;
            
        case 'drink':
            if (roll > 15) {
                playerState.fatigue = Math.max(0, playerState.fatigue - 5);
                playerState.reputation += 1;
                playerState.coordination += (roll > 18) ? 1 : 0; // Small chance to improve coordination
                result = '<p>You share mead with your crewmates, telling boastful stories of your exploits. Your reputation increases!</p>';
                if (roll > 18) {
                    result += '<p>The experience improves your social coordination with the crew.</p>';
                }
            } else {
                playerState.fatigue += 5;
                result = '<p>You drink too much and make a fool of yourself. You wake up with a headache.</p>';
            }
            break;
            
        case 'pray':
            if (playerState.blackRaven > playerState.whiteRaven) {
                playerState.blackRaven += 1;
                playerState.weaponSkill += (roll > 17) ? 1 : 0; // Small chance to improve weapon skill through Odin's blessing
                result = '<p>You offer prayers to Odin for victory in battle. You feel the Black Raven\'s gaze upon you.</p>';
                if (roll > 17) {
                    result += '<p>Your prayers are answered with clarity of mind regarding combat techniques.</p>';
                }
            } else {
                playerState.whiteRaven += 1;
                playerState.endurance += (roll > 17) ? 1 : 0; // Small chance to improve endurance through meditation
                result = '<p>You contemplate the nature of fate and your place in it. The White Raven\'s wisdom fills your thoughts.</p>';
                if (roll > 17) {
                    result += '<p>Your meditation provides insights into preserving your stamina in challenging situations.</p>';
                }
            }
            playerState.fatigue = Math.max(0, playerState.fatigue - 5);
            break;
            
        case 'gamble':
            if (roll > 10) {
                playerState.gold += 5;
                result = '<p>Your luck holds! You win 5 gold in the games of chance.</p>';
            } else {
                playerState.gold = Math.max(0, playerState.gold - 3);
                result = '<p>Fortune does not favor you today. You lose 3 gold.</p>';
            }
            break;
    }
    
    campResultContent.innerHTML = result;
}

// Handle companion interactions
function handleCompanions(option) {
    // Deduct time
    campTimeRemaining -= 1;
    updateTimeDisplay();
    
    let result = '';
    
    switch (option) {
        case 'erik':
            result = '<p>"I don\'t know about you," Erik says, cleaning his blade, "but I\'m looking forward to seeing what treasures that church holds. The Saxons value their religious artifacts highly."</p>';
            break;
            
        case 'olaf':
            result = '<p>Hersir Olaf looks up from his map. "We move at dawn," he says gruffly. "Make sure you\'re prepared. I won\'t wait for stragglers."</p>';
            playerState.reputation += 1;
            break;
            
        case 'random':
            const conversations = [
                '<p>A grizzled warrior tells you tales of his many raids in Frankia. You listen attentively, noting useful tactics.</p>',
                '<p>Two brothers argue about the best way to split their loot. They ask for your opinion, but seem dissatisfied with any suggestion.</p>',
                '<p>A young warrior boasts about his first kill today. His enthusiasm makes you reflect on your own feelings about combat.</p>'
            ];
            result = conversations[Math.floor(Math.random() * conversations.length)];
            break;
    }
    
    campResultContent.innerHTML = result;
}

// Handle travel
function handleTravel() {
    // Check if we have time for activities
    if (campTimeRemaining <= 0) {
        campResultContent.innerHTML = '<p>You have no more time remaining. You must continue your journey.</p>';
        return;
    }

    // Deduct time for traveling
    campTimeRemaining -= 1;
    updateTimeDisplay();
    
    // Show the travel map
    showTravelMap();
    
    // Updated message for the camp screen that will be visible when they return
    campResultContent.innerHTML = '<p>Select a destination on the map to travel there.</p>';
}

// Handle scavenging
function handleScavenge() {
    // Deduct time
    campTimeRemaining -= 1;
    updateTimeDisplay();
    
    const roll = rollD20();
    const coordinationBonus = Math.floor(playerState.coordination / 3); // Coordination helps with finding items
    const effectiveRoll = roll + coordinationBonus;
    let result = '';
    
    if (effectiveRoll > 17) {
        playerState.gold += 5;
        result = `<p>Your keen eye and steady hands help you find a well-hidden cache of Saxon valuables! You gain 5 gold.</p>`;
        if (coordinationBonus > 0) {
            result += `<p>Your coordination skills were crucial in uncovering this hiding spot.</p>`;
        }
    } else if (effectiveRoll > 14) {
        playerState.gold += 3;
        result = '<p>You find some valuable items that can be traded for 3 gold.</p>';
    } else if (effectiveRoll > 10) {
        playerState.inventory.push('Herbs');
        result = '<p>You gather some useful medicinal herbs from the forest edge.</p>';
    } else if (effectiveRoll > 5) {
        playerState.inventory.push('Wood');
        result = '<p>You collect some good firewood and materials that could be useful for crafting.</p>';
    } else {
        playerState.fatigue += 3;
        result = '<p>You search for hours but find nothing of value. The fruitless effort has tired you.</p>';
    }
    
    campResultContent.innerHTML = result;
}

// Handle crafting
function handleCrafting() {
    // Deduct time
    campTimeRemaining -= 1;
    updateTimeDisplay();
    
    const roll = rollD20();
    const weaponSkillBonus = Math.floor(playerState.weaponSkill / 4);
    const effectiveRoll = roll + weaponSkillBonus;
    
    if (effectiveRoll > 15) {
        playerState.weaponSkill += 1;
        let result = '<p>You spend time maintaining your equipment with expert precision. Your blade has never been sharper, and your armor fits perfectly. The process improves your weapon skill.</p>';
        if (weaponSkillBonus > 0) {
            result += '<p>Your existing weapon knowledge helps you make even better improvements.</p>';
        }
        campResultContent.innerHTML = result;
    } else {
        campResultContent.innerHTML = '<p>You spend time maintaining your equipment, sharpening your blade and repairing your armor. Your gear is in better condition now.</p>';
    }
}

// Handle medic activities
function handleMedic() {
    // Deduct time
    campTimeRemaining -= 1;
    updateTimeDisplay();
    
    const vitalityBonus = Math.floor(playerState.vitality / 4);
    
    if (playerState.health < playerState.maxHealth) {
        // Vitality improves healing effectiveness
        const healAmount = 10 + vitalityBonus;
        playerState.health = Math.min(playerState.maxHealth, playerState.health + healAmount);
        
        let result = `<p>You tend to your wounds, cleaning and bandaging them properly. Your health improves by ${healAmount} points.</p>`;
        if (vitalityBonus > 0) {
            result += `<p>Your vitality helps you recover more effectively.</p>`;
        }
        campResultContent.innerHTML = result;
        
        // Small chance to improve vitality from the experience
        if (Math.random() > 0.8) {
            playerState.vitality += 1;
            campResultContent.innerHTML += `<p>The experience of treating your own wounds has increased your vitality.</p>`;
        }
    } else {
        campResultContent.innerHTML = '<p>You have no wounds that need tending. You help others in the camp with their injuries instead.</p>';
        playerState.reputation += 1;
    }
}

export { initCamp, campTimeRemaining, updateTimeDisplay };