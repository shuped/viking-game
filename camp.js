import { playerState } from './player.js';
import { transitionToScreen } from './transitions.js';
import { displayStoryText } from './story.js';
import { screens } from './main.js';
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
        // Return to story at node 20
        transitionToScreen(screens.camp, screens.prologue, () => {
            displayStoryText(20);
        });
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
        case 'events':
            handleRandomEvent();
            break;
        case 'scavenge':
            handleScavenge();
            break;
        case 'crafting':
            handleCrafting();
            break;
        case 'medic':
            handleMedic();
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
                result = '<p>You push yourself hard in training, focusing on your form. Your strength has increased!</p>';
            } else {
                playerState.fatigue += 5;
                result = '<p>You train hard but make little progress. You feel more fatigued.</p>';
            }
            break;
            
        case 'tier1':
            if (roll + playerState.reputation > 12) {
                playerState.strength += 1;
                playerState.reputation += 1;
                result = '<p>You train with your crewmates, showing your skills. Both your strength and reputation have improved!</p>';
            } else {
                result = '<p>The training session is awkward. Your crewmates don\'t seem impressed.</p>';
            }
            break;
            
        case 'tier2':
            if (roll + playerState.reputation > 15) {
                playerState.strength += 2;
                playerState.agility += 1;
                result = '<p>The veterans share valuable techniques with you. Your strength and agility have improved significantly!</p>';
            } else {
                result = '<p>The veterans find you lacking. They spend little time showing you their techniques.</p>';
                playerState.reputation -= 1;
            }
            break;
            
        case 'tier3':
            if (roll + playerState.reputation > 18) {
                playerState.strength += 2;
                playerState.agility += 1;
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
            result = '<p>You find a quiet spot and get some much-needed rest. Your fatigue is reduced.</p>';
            break;
            
        case 'drink':
            if (roll > 15) {
                playerState.fatigue = Math.max(0, playerState.fatigue - 5);
                playerState.reputation += 1;
                result = '<p>You share mead with your crewmates, telling boastful stories of your exploits. Your reputation increases!</p>';
            } else {
                playerState.fatigue += 5;
                result = '<p>You drink too much and make a fool of yourself. You wake up with a headache.</p>';
            }
            break;
            
        case 'pray':
            if (playerState.blackRaven > playerState.whiteRaven) {
                playerState.blackRaven += 1;
                result = '<p>You offer prayers to Odin for victory in battle. You feel the Black Raven\'s gaze upon you.</p>';
            } else {
                playerState.whiteRaven += 1;
                result = '<p>You contemplate the nature of fate and your place in it. The White Raven\'s wisdom fills your thoughts.</p>';
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

// Handle random events
function handleRandomEvent() {
    // Deduct time
    campTimeRemaining -= 1;
    updateTimeDisplay();
    
    const events = [
        '<p>A heated argument breaks out between two warriors over a missing trinket. You help resolve it before blades are drawn.</p>',
        '<p>You spot Saxon scouts watching the camp from the treeline. You alert the guards, who chase them off.</p>',
        '<p>An unexpected rain shower soaks the camp. You help secure shelters and keep the fire going.</p>',
        '<p>Mysterious lights appear in the distant forest. Some warriors see it as an omen, others dismiss it as natural.</p>'
    ];
    
    const result = events[Math.floor(Math.random() * events.length)];
    campResultContent.innerHTML = result;
}

// Handle scavenging
function handleScavenge() {
    // Deduct time
    campTimeRemaining -= 1;
    updateTimeDisplay();
    
    const roll = rollD20();
    let result = '';
    
    if (roll > 15) {
        playerState.gold += 3;
        result = '<p>You find a small cache of Saxon valuables hidden nearby! You gain 3 gold.</p>';
    } else if (roll > 10) {
        playerState.inventory.push('Herbs');
        result = '<p>You gather some useful medicinal herbs from the forest edge.</p>';
    } else if (roll > 5) {
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
    
    // Simple crafting for now
    campResultContent.innerHTML = '<p>You spend time maintaining your equipment, sharpening your blade and repairing your armor. Your gear is in better condition now.</p>';
}

// Handle medic activities
function handleMedic() {
    // Deduct time
    campTimeRemaining -= 1;
    updateTimeDisplay();
    
    if (playerState.health < 100) {
        playerState.health = Math.min(100, playerState.health + 10);
        campResultContent.innerHTML = '<p>You tend to your wounds, cleaning and bandaging them properly. Your health improves.</p>';
    } else {
        campResultContent.innerHTML = '<p>You have no wounds that need tending. You help others in the camp with their injuries instead.</p>';
        playerState.reputation += 1;
    }
}

export { initCamp, campTimeRemaining, updateTimeDisplay };