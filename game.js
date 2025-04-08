// Screen management
 const screens = {
    start: document.getElementById('start-screen'),
    prologue: document.getElementById('cinematic-ui'),
    camp: document.getElementById('camp-ui'),
    battle: document.getElementById('battle-ui')
};

// Structured story object
const storyNodes = {
    0: {
        text: "..You emerge from vague, unsatisfying fever dream... The crossroads, the ravens... a choice... resonance... faces... delirium...",
        next: 1
    },
    1: {
        text: "You awaken, uncharacteristically thankful for the ceaseless salt-spit breeze. Your fever recedes... You've been sailing for 8 days now, aboard one of the three Snekkja comprising Hersir Olaf's warband. Erik stirs before waking up with a familiar groan of dissatisfaction, he hasn't taken well to the sea... an embarrassing detail noted by your proud crewmates, but he is still your friend after all.",
        next: 2
    },
    2: {
        text: "Following the barked commands and surefooted actions of your more seasoned crewmates, you and Erik prepare to land... *Crash* … The ship bucks suddenly, tilting and causing men left and right to stumble and fall...",
        choices: [
            { text: "Try to keep your balance", nextNode: 3 },
            { text: "Brace against the tide", nextNode: 4 }
        ]
    },
    3: {
        text: "You struggle to maintain your footing, but the ship's violent motion throws you off balance. You tumble to the deck, banging your knee painfully against the wood. Several of your comrades snicker as you pick yourself up, your pride more wounded than your body.",
        next: 5
    },
    4: {
        text: "As others lose their balance around you, you widen your stance and lower your center of gravity. You remain standing even as the ship bucks and tilts. Several of your crewmates nod approvingly at your display of seamanship. Your reputation among the warband increases slightly.",
        next: 5
    },
    5: {
        text: "Steps away, the steering ore sits vacant as the shore approaches at a menacing pace...",
        choices: [
            { text: "Fall in line, obeying the scattered commands of more experienced seamen", nextNode: 6 },
            { text: "Seize the steering ore, taking matters into your own hands", nextNode: 7 }
        ]
    },
    6: {
        text: "You follow the shouted orders of the more experienced warriors around you, helping to secure ropes and prepare for landing. The situation gradually comes under control as the ship lurches toward the shore. Your actions, while helpful, go largely unnoticed in the chaos.",
        next: 10
    },
    7: {
        text: "You leap toward the unmanned steering ore, gripping it firmly in your hands. The weight of it surprises you as you struggle to control the direction of the ship...",
        choices: [
            { text: "Push through the struggle", nextNode: 8 },
            { text: "Give up and let someone else handle it", nextNode: 9 }
        ]
    },
    8: {
        text: "Summoning your resolve, you wrestle with the heavy steering ore. Your muscles strain as you fight against the current, but you manage to guide the groaning vessel safely toward the shore. As the calamity dissipates, your comrades grumble quiet words of approval. Your reputation has increased among the warband.",
        next: 10
    },
    9: {
        text: "You struggle with the ore in an embarrassing display of weakness. Your arms shake with the effort before you're unceremoniously shoved aside by a pair of stronger hands. 'Out of the way, weakling!' growls a bearded warrior as he takes control. Your cheeks burn with shame as several crewmates smirk at your failure.",
        next: 10
    },
    10: {
        text: "Just as the third and final Snekkja anchors to the shore, a rush of excitement breaks through the disorganized mass of your warband... 'SAXONS!' The cry goes up, and warriors scramble for their weapons. Through the trees, you glimpse figures moving—local defenders rushing to repel your landing.",
        next: 11
    },
    11: {
        text: "The Saxons charge from the treeline, their weapons glinting in the sunlight. Your heart pounds as you grip your weapon, preparing for your first real battle on Saxon soil.",
        next: 12
    },
    12: {
        text: "The clash of steel fades as the last Saxon falls. Breathing heavily, you contemplate your actions in the battle...",
        choices: [
            { text: "Rejoice in your victory", nextNode: 13 },
            { text: "Question the senseless violence", nextNode: 14 }
        ]
    },
    13: {
        text: "You raise your weapon and let out a victorious cry that is echoed by your comrades. The thrill of battle still courses through your veins, and you feel a deep satisfaction in your triumph over the enemy. The Black Raven's shadow seems to pass over you, approving of your warrior spirit.",
        next: 15
    },
    14: {
        text: "As your comrades celebrate around you, you stare down at the bodies of the fallen with unease. Was this slaughter necessary? These people were simply defending their homes. A strange feeling washes over you, as if a White Raven watches your moment of doubt with interest.",
        next: 15
    },
    15: {
        text: "With the immediate threat dispatched, you must decide how to use the brief moment of respite...",
        choices: [
            { text: "Search for loot among the dead", nextNode: 16 },
            { text: "Take the opportunity to rest", nextNode: 17 }
        ]
    },
    16: {
        text: "You move among the fallen Saxons, searching their bodies for anything of value. You find a few small trinkets and coins, but the effort leaves you more exhausted than before. Your fatigue increases, but your small haul might prove useful later.",
        next: 18
    },
    17: {
        text: "You find a quiet spot to sit and catch your breath. The brief rest revitalizes you somewhat, clearing your mind and reducing your fatigue. Erik joins you, grateful for the moment of peace before the next challenge.",
        next: 18
    },
    18: {
        text: "The Saxon insurgence was desperate and disorganized... victory here is only the beginning. Hersir Olaf assigns a small party of mysterious warriors to scout the area while the rest of your party makes camp. It won't be long before you see more serious combat...",
        next: 19
    },
    19: {
        text: "As evening approaches, your warband establishes a camp in a clearing near the shore. Tents are erected, fires are lit, and the smell of cooking food fills the air. You have some time before you must rest for tomorrow's march.",
        next: 20
    },
    20: {
        text: "The time has come to move on. Your warband breaks camp at dawn, moving inland with purpose. By midday, a church on a hill comes into view, with a modest if not idyllic town surrounding it. The Hersir maintains a tight grip on your eager companions, but it won't last forever...",
        next: 21
    },
    21: {
        text: "The Saxon resistance forms even as your party closes the gap between them and the village. Before long, your party is standing face to face with a Saxon contingent of roughly equal size, their weapons drawn and faces grim with determination.",
        next: 22
    },
    22: {
        text: "Tension fills the air as both sides measure each other. Then, with a thunderous war cry, Hersir Olaf signals the attack. Your warband surges forward, and you find yourself charging toward the Saxon line.",
        next: 23
    },
    23: {
        text: "The Saxon resistance shatters, their warriors no match for your own... what had been a disciplined cohort of Viking warriors devolves into a wave of blood-red savagery... a free-for-all...",
        next: 24
    },
    24: {
        text: "You find yourself at the foot of the town, violent activity surrounding you. The screams of villagers mix with the triumphant shouts of your fellow warriors. What will you do next?",
        choices: [
            { text: "Go straight for the church", nextNode: 25 },
            { text: "Go into the nearest house", nextNode: 26 },
            { text: "Walk around aimlessly", nextNode: 27 },
            { text: "Listen to Erik", nextNode: 28 }
        ]
    },
    25: {
        text: "You make your way toward the church on the hill, drawn to the prominent structure overlooking the town. As you approach, you notice several of your fellow warriors heading in the same direction, likely expecting valuable treasures inside...",
        next: 29
    },
    26: {
        text: "You push open the door to the nearest house. Inside, you find simple furnishings and signs of a hasty departure. You search through some personal belongings but find little of value. Time passes, and you hear the continued sounds of chaos outside.",
        next: 30
    },
    27: {
        text: "You wander through the streets of the small town, observing the destruction around you. Warriors pillage homes while terrified villagers flee or hide. You spend some time taking in the scene, but accomplish little. The day wears on.",
        next: 30
    },
    28: {
        text: "Erik gestures for you to follow him. 'I heard the Hersir mention that the church would have the most valuable items,' he says with a gleam in his eye. 'We should head there before the others take everything!'",
        next: 25
    },
    29: {
        text: "You approach the church, its stone walls looming above you. The wooden doors stand ajar, and you can hear voices inside. This seems to be where the real treasures of the village are kept. Chapter 1 continues...",
        end: true
    },
    30: {
        text: "As you finish exploring, you realize that most of your warband seems to be converging on the church. Perhaps that's where you should go next...",
        choices: [
            { text: "Go to the church", nextNode: 25 },
            { text: "Check another house", nextNode: 26 },
            { text: "Continue wandering", nextNode: 27 }
        ]
    }
};

let currentNodeId = 0;
const textBox = document.getElementById('cinematic-text-box');
const textContent = document.getElementById('cinematic-text-content');
const choiceBox = document.getElementById('cinematic-button-box');

// Typewriter effect for text display
let typewriterActive = false;
let typewriterCancel = false;

function typewriterEffect(element, text, speed = 10) {
    // If there's already a typewriter effect running, cancel it
    if (typewriterActive) {
        typewriterCancel = true;
        // Give a small delay to ensure the previous typewriter is properly stopped
        return new Promise(resolve => {
            setTimeout(() => {
                typewriterCancel = false;
                return typewriterEffect(element, text, speed).then(resolve);
            }, 50);
        });
    }

    element.innerHTML = '';
    let i = 0;
    typewriterActive = true;
    typewriterCancel = false;
    
    return new Promise(resolve => {
        function typeNextChar() {
            if (typewriterCancel) {
                typewriterActive = false;
                resolve();
                return;
            }

            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeNextChar, speed);
            } else {
                typewriterActive = false;
                resolve();
                // Add click indicator after text is fully typed
                if (!document.querySelector('.click-indicator')) {
                    const indicator = document.createElement('div');
                    indicator.className = 'click-indicator';
                    indicator.textContent = 'Click to continue...';
                    textBox.appendChild(indicator);
                }
            }
        }
        typeNextChar();
    });
}

// Display story text for the current node
async function displayStoryText(nodeId) {
    // Cancel any active typewriter effect
    typewriterCancel = true;
    
    // Small delay to ensure typewriter is cancelled
    await new Promise(resolve => setTimeout(resolve, 50));
    
    currentNodeId = nodeId;
    const currentNode = storyNodes[nodeId];
    
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
    
    choices.forEach((choice, index) => {
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

// Handle click to advance text when there are no choices
document.getElementById('cinematic-frame').addEventListener('click', () => {
    const currentNode = storyNodes[currentNodeId];
    
    // Only allow advancing if we're not showing choices
    if (!currentNode.choices) {
        if (currentNode.next) {
            // If the next node is the camp node, transition to camp UI
            if (currentNode.next === 19) {
                transitionToScreen(screens.prologue, screens.camp, () => {
                    initCamp();
                });
            } 
            // If the next node is a battle node, transition to battle UI
            else if (currentNode.next === 11 || currentNode.next === 22) {
                transitionToScreen(screens.prologue, screens.battle, () => {
                    initBattle(currentNode.next === 11 ? 'first' : 'second');
                });
            } 
            else {
                displayStoryText(currentNode.next);
            }
        } else if (currentNode.end) {
            console.log("End of story reached"); 
            // Here you could add code to end the game or move to the next chapter
        }
    }
});

// Player character state
const playerState = {
    strength: 5,
    agility: 5,
    intelligence: 5,
    charisma: 5,
    health: 100,
    maxHealth: 100,
    energy: 65,
    maxEnergy: 65,
    fatigue: 0,
    reputation: 0,
    blackRaven: 0,
    whiteRaven: 0,
    gold: 10,
    inventory: []
};

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

// Battle System
const battleState = {
    playerHealth: 100,
    playerMaxHealth: 100,
    playerEnergy: 65,
    playerMaxEnergy: 65,
    enemyHealth: 100,
    enemyMaxHealth: 100,
    enemyName: 'Saxon Warrior',
    turnCount: 0,
    battlePhase: 'player', // 'player', 'enemy', 'end'
    battleType: 'first', // 'first', 'second'
    battleLog: [],
    isActive: false
};

function initBattle(battleType) {
    // Reset battle state
    battleState.playerHealth = playerState.health;
    battleState.playerMaxHealth = playerState.maxHealth;
    battleState.playerEnergy = playerState.energy;
    battleState.playerMaxEnergy = playerState.maxEnergy;
    battleState.turnCount = 0;
    battleState.battlePhase = 'player';
    battleState.battleType = battleType;
    battleState.battleLog = [];
    battleState.isActive = true;
    
    // Set enemy stats based on battle type
    if (battleType === 'first') {
        battleState.enemyName = 'Saxon Scout';
        battleState.enemyHealth = 80;
        battleState.enemyMaxHealth = 80;
        
        // Set initial battle message
        updateBattleText("A Saxon scout charges at you, wielding a short sword. The clash of steel rings through the air as your warband engages the enemy.");
    } else {
        battleState.enemyName = 'Saxon Defender';
        battleState.enemyHealth = 120;
        battleState.enemyMaxHealth = 120;
        
        // Set initial battle message
        updateBattleText("A battle-hardened Saxon defender blocks your path to the village. His chainmail glints in the sunlight as he raises his axe, ready to defend his home.");
    }
    
    // Update UI
    updateBattleUI();
    
    // Add event listeners to battle actions
    setupBattleEventListeners();
}

function setupBattleEventListeners() {
    document.querySelectorAll('.battle-action').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            if (battleState.battlePhase === 'player') {
                handlePlayerAction(action);
            }
        });
    });
}

function updateBattleText(text) {
    document.getElementById('battle-text-content').textContent = text;
}

function appendBattleText(text) {
    const currentText = document.getElementById('battle-text-content').textContent;
    document.getElementById('battle-text-content').textContent = currentText + " " + text;
}

function updateBattleUI() {
    // Update health and energy bars
    const hpFill = document.querySelector('.hp-fill');
    const energyFill = document.querySelector('.energy-fill');
    const hpText = document.querySelector('.hp-bar .bar-text');
    const energyText = document.querySelector('.energy-bar .bar-text');
    
    const hpPercentage = (battleState.playerHealth / battleState.playerMaxHealth) * 100;
    const energyPercentage = (battleState.playerEnergy / battleState.playerMaxEnergy) * 100;
    
    hpFill.style.width = hpPercentage + '%';
    energyFill.style.width = energyPercentage + '%';
    
    hpText.textContent = `${battleState.playerHealth} / ${battleState.playerMaxHealth}`;
    energyText.textContent = `${battleState.playerEnergy} / ${battleState.playerMaxEnergy}`;
    
    // Update player name
    document.querySelector('.status-name').textContent = 'Viking Warrior';
    
    // Update action buttons based on available energy
    document.querySelectorAll('.battle-action').forEach(button => {
        const action = button.dataset.action;
        let energyCost = 0;
        
        switch (action) {
            case 'attack': energyCost = 10; break;
            case 'feint': energyCost = 15; break;
            case 'throw': energyCost = 20; break;
            case 'defend': energyCost = 5; break;
            case 'recover': energyCost = 0; break;
            case 'evade': energyCost = 10; break;
        }
        
        if (energyCost > battleState.playerEnergy) {
            button.disabled = true;
            button.style.opacity = '0.5';
        } else {
            button.disabled = false;
            button.style.opacity = '1';
        }
    });
    
    // If battle is over, disable all actions
    if (battleState.battlePhase === 'end') {
        document.querySelectorAll('.battle-action').forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
        });
    }
}

function handlePlayerAction(action) {
    // Prevent actions during enemy turn or when battle is over
    if (battleState.battlePhase !== 'player' || battleState.isActive === false) {
        return;
    }
    
    let damage = 0;
    let energyCost = 0;
    let actionText = '';
    
    // Calculate damage and energy cost based on action
    switch (action) {
        case 'attack':
            damage = Math.floor(5 + Math.random() * 10) + Math.floor(playerState.strength / 2);
            energyCost = 10;
            actionText = `You swing your weapon at the ${battleState.enemyName}, dealing ${damage} damage!`;
            break;
            
        case 'feint':
            damage = Math.floor(8 + Math.random() * 15) + Math.floor(playerState.agility / 2);
            energyCost = 15;
            actionText = `You fake a move and catch the ${battleState.enemyName} off guard, striking for ${damage} damage!`;
            break;
            
        case 'throw':
            damage = Math.floor(12 + Math.random() * 20);
            energyCost = 20;
            actionText = `You throw your weapon with precision, striking the ${battleState.enemyName} for ${damage} damage!`;
            break;
            
        case 'defend':
            damage = 0;
            energyCost = 5;
            battleState.playerDefending = true;
            actionText = `You raise your shield, preparing to block the next attack.`;
            break;
            
        case 'recover':
            damage = 0;
            energyCost = 0;
            const energyRecovered = Math.floor(10 + Math.random() * 10);
            battleState.playerEnergy = Math.min(battleState.playerMaxEnergy, battleState.playerEnergy + energyRecovered);
            actionText = `You take a moment to catch your breath, recovering ${energyRecovered} energy.`;
            break;
            
        case 'evade':
            damage = 0;
            energyCost = 10;
            battleState.playerEvading = true;
            actionText = `You prepare to dodge the next attack, making yourself harder to hit.`;
            break;
    }
    
    // Apply energy cost
    battleState.playerEnergy = Math.max(0, battleState.playerEnergy - energyCost);
    
    // Update battle text
    updateBattleText(actionText);
    
    // Apply damage to enemy
    if (damage > 0) {
        // Play attack animation
        const playerCharacter = document.querySelector('.character-placeholder.viking');
        playerCharacter.classList.add('attack-animation');
        setTimeout(() => {
            playerCharacter.classList.remove('attack-animation');
            
            // Play enemy hurt animation
            const enemyCharacter = document.querySelector('.character-placeholder.saxon');
            enemyCharacter.classList.add('hurt-animation');
            setTimeout(() => {
                enemyCharacter.classList.remove('hurt-animation');
            }, 500);
            
            battleState.enemyHealth = Math.max(0, battleState.enemyHealth - damage);
            
            // Check if enemy is defeated
            if (battleState.enemyHealth <= 0) {
                handleEnemyDefeated();
                return;
            }
            
            // Enemy turn after a short delay
            setTimeout(() => {
                handleEnemyTurn();
            }, 1000);
        }, 500);
    } else {
        // Enemy turn after a short delay
        setTimeout(() => {
            handleEnemyTurn();
        }, 1000);
    }
    
    // Update UI
    updateBattleUI();
}

function handleEnemyTurn() {
    battleState.battlePhase = 'enemy';
    
    // Reset defense and evasion flags
    const wasDefending = battleState.playerDefending || false;
    const wasEvading = battleState.playerEvading || false;
    battleState.playerDefending = false;
    battleState.playerEvading = false;
    
    // Enemy AI - simple random choice
    const enemyActions = ['attack', 'heavy_attack', 'special'];
    const enemyAction = enemyActions[Math.floor(Math.random() * enemyActions.length)];
    
    let damage = 0;
    let actionText = '';
    
    // Calculate enemy damage based on action
    switch (enemyAction) {
        case 'attack':
            damage = Math.floor(5 + Math.random() * 8);
            actionText = `The ${battleState.enemyName} swings their weapon at you`;
            break;
            
        case 'heavy_attack':
            damage = Math.floor(10 + Math.random() * 5);
            actionText = `The ${battleState.enemyName} delivers a powerful blow`;
            break;
            
        case 'special':
            if (battleState.battleType === 'first') {
                damage = Math.floor(8 + Math.random() * 7);
                actionText = `The ${battleState.enemyName} attempts a quick thrust with their sword`;
            } else {
                damage = Math.floor(12 + Math.random() * 8);
                actionText = `The ${battleState.enemyName} swings their axe in a wide arc`;
            }
            break;
    }
    
    // Apply defense or evasion effects
    if (wasDefending) {
        damage = Math.floor(damage * 0.5);
        actionText += `, but your shield absorbs much of the impact`;
    } else if (wasEvading) {
        if (Math.random() > 0.3) {
            damage = 0;
            actionText += `, but you successfully dodge out of the way`;
        } else {
            actionText += `, and despite your attempt to dodge, the attack connects`;
        }
    }
    
    // Play enemy attack animation
    const enemyCharacter = document.querySelector('.character-placeholder.saxon');
    enemyCharacter.classList.add('attack-animation');
    
    setTimeout(() => {
        enemyCharacter.classList.remove('attack-animation');
        
        if (damage > 0) {
            // Play player hurt animation
            const playerCharacter = document.querySelector('.character-placeholder.viking');
            playerCharacter.classList.add('hurt-animation');
            setTimeout(() => {
                playerCharacter.classList.remove('hurt-animation');
            }, 500);
            
            // Apply damage to player
            battleState.playerHealth = Math.max(0, battleState.playerHealth - damage);
            actionText += `, dealing ${damage} damage!`;
        } else {
            actionText += `.`;
        }
        
        // Update battle text
        updateBattleText(actionText);
        
        // Check if player is defeated
        if (battleState.playerHealth <= 0) {
            handlePlayerDefeated();
            return;
        }
        
        // Return to player turn
        setTimeout(() => {
            battleState.battlePhase = 'player';
            battleState.turnCount++;
            updateBattleUI();
            appendBattleText(" What will you do?");
        }, 1000);
    }, 500);
    
    // Update UI
    updateBattleUI();
}

function handlePlayerDefeated() {
    battleState.battlePhase = 'end';
    battleState.isActive = false;
    
    // Show defeat message
    updateBattleText(`You have fallen in battle. The world grows dark around you...`);
    
    // After a delay, show game over or restart option
    setTimeout(() => {
        appendBattleText(" (Click to try again)");
        document.getElementById('battle-scene').addEventListener('click', restartBattle);
    }, 2000);
    
    // Update UI
    updateBattleUI();
    //todo: add game over screen with a restart option
}

function handleEnemyDefeated() {
    battleState.battlePhase = 'end';
    battleState.isActive = false;
    
    // Update player state with battle results
    playerState.health = battleState.playerHealth;
    playerState.energy = battleState.playerEnergy;
    
    // Show victory message
    updateBattleText(`The ${battleState.enemyName} falls before your might! Victory is yours!`);
    
    // After a delay, return to story
    setTimeout(() => {
        appendBattleText(" (Click to continue)");
        document.getElementById('battle-scene').addEventListener('click', returnToStory);
    }, 2000);
    
    // Update UI
    updateBattleUI();
}

function restartBattle() {
    // Remove event listener to prevent multiple calls
    document.getElementById('battle-scene').removeEventListener('click', restartBattle);
    
    // Reset player health
    playerState.health = playerState.maxHealth;
    playerState.energy = playerState.maxEnergy;
    
    // Restart the battle
    initBattle(battleState.battleType);
}

function returnToStory() {
    // Remove event listener to prevent multiple calls
    document.getElementById('battle-scene').removeEventListener('click', returnToStory);
    
    // Determine which story node to return to based on battle type
    let nextNodeId;
    if (battleState.battleType === 'first') {
        nextNodeId = 12; // After first battle
    } else {
        nextNodeId = 23; // After second battle
    }
    
    // Transition back to story screen
    transitionToScreen(screens.battle, screens.prologue, () => {
        displayStoryText(nextNodeId);
    });
}

// Transition between screens
function transitionToScreen(fromScreen, toScreen, callback) {
    const overlay = document.getElementById('black-overlay');
    
    // First phase: Fade to black completely
    overlay.classList.add('active');
    
    // Wait for the overlay to become completely black (overlay transition duration)
    setTimeout(() => {
        // Hide all screens initially during the completely black phase
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.visibility = 'hidden';
        });
        
        // Now that the overlay is fully black, switch the active screens
        fromScreen.classList.remove('active');
        toScreen.classList.add('active');
        
        // Short delay to ensure DOM updates
        setTimeout(() => {
            // Make the active screen visible again while still behind black overlay
            toScreen.style.visibility = 'visible';
            
            // Begin fade-out transition
            overlay.classList.remove('active');
            
            // Wait for overlay to fade out completely before executing callback
            setTimeout(() => {
                if (typeof callback === 'function') {
                    callback();
                }
            }, 1000); // Time for the overlay to fade out - increased to 1.5s
        }, 50); // Small delay for DOM updates
    }, 1000); // Time for the overlay to fade to black - increased to 1.5s
}

// Initialize the game
document.getElementById('start-game').addEventListener('click', () => {
    transitionToScreen(screens.start, screens.prologue, () => {
        displayStoryText(0);
    });
});