import { typewriterEffect, cancelTypewriter } from './typewriter.js';
import { transitionToScreen } from './transitions.js';
import { initCamp } from './camp.js';
import { initBattle } from './battle.js';
import { playerState } from './player.js';

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
        text: "Erik has always had a nose for trouble. He tugs at your sleeve and points to a lone farmhouse on the edge of the settlement. 'There's something... interesting over there,' he says with an odd glint in his eye. 'Come with me, away from the others.'",
        choices: [
            { text: "Accompany Erik", nextNode: 31 },
            { text: "Disagree and return to the town", nextNode: 30 }
        ]
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
    },
    31: {
        text: "You follow Erik to the farmhouse, moving contraposed to the inertia of all the activity around you. As you reach the edge of the settlement, Erik pauses and puts his finger to his lips, gesturing for quiet. A strange rhythmic thumping emanates from within the humble structure. It shows no sign of stopping or slowing. Erik urges you to step inside with a series of hastened gestures.",
        next: 32
    },
    32: {
        text: "Gunnar's lifeless body heaves stiffly with each successive stab... Grimr is hovering over him, facing away from you... Erik freezes, a morbid grimace etched in the lines of his face... It's immediately apparent to you that Gunnar has been dead for quite some time already as Grimr, and the farmhouse floor are uniformly soaked with blood... Thump...Thump...Thump...",
        next: 33
    },
    33: {
        text: "Grimr stops... and slowly turns to face you, the madness in his eyes sends a jolt through your spine and you and Erik both take up a martial stance. But Grimr's expression seems to morph impossibly from one of raving murderous glee, to his usual placid, if colorless demeanor. He stands up, leaving the dagger embedded in Gunnar's chest. Offering you an apologetic half smile, Grimr wordlessly subjects himself to your judgment...",
        choices: [
            { text: "Execute this lunatic", nextNode: 34 },
            { text: "Let him go (back away slowly)", nextNode: 35 },
            { text: "Demand an explanation", nextNode: 36 }
        ]
    },
    34: {
        text: "Without hesitation, you draw your weapon and deliver swift justice to Grimr. His blood mingles with Gunnar's on the farmhouse floor. Erik nods grimly, approving of your decision. 'He was too far gone,' he mutters. 'It had to be done.' You leave the farmhouse, the image of Grimr's final moments etched in your memory.",
        next: 39
    },
    35: {
        text: "You and Erik exchange a nervous glance before slowly backing toward the door. Grimr remains motionless, watching you leave with empty eyes. As you exit the farmhouse, Erik grips your arm tightly. 'We should keep an eye on him,' he whispers. 'Who knows what he might do next...' The encounter leaves you unsettled, knowing that Grimr still walks among your warband.",
        next: 39
    },
    36: {
        text: "You steady your weapon but don't strike. 'Explain yourself,' you demand, voice tight with tension. Grimr's eyes shift to the corpse, then back to you. 'Gunnar violated our agreement,' he says flatly. 'He took what was promised to me. I merely collected my due.' His cold logic chills you more than any display of madness could. Erik shifts uncomfortably beside you.",
        choices: [
            { text: "Execute him anyway", nextNode: 34 },
            { text: "Let him go after his explanation", nextNode: 35 },
            { text: "Invite Grimr to join you and Erik", nextNode: 37 }
        ]
    },
    37: {
        text: "Something about Grimr's brutal efficiency intrigues you. 'Join us,' you say, surprising even yourself. 'We could use someone with your... dedication.' Erik's eyes widen in disbelief, but he says nothing. Grimr studies you for a long moment before nodding. 'I will come,' he says simply. 'And your secret is safe with me.' As you leave the farmhouse together, you feel you've made either a powerful ally or a dangerous mistake.",
        next: 38
    },
    38: {
        text: "The three of you return to the town, Grimr now part of your inner circle. Erik remains uneasy, but Grimr shows no further signs of the madness you witnessed. Still, you can't help but wonder what you've gotten yourself into by keeping his bloody secret.",
        next: 24
    },
    39: {
        text: "You return to the town, the encounter at the farmhouse weighing heavily on your mind. The raid continues around you, but your thoughts keep returning to Grimr and what you witnessed.",
        next: 24
    },
};

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

// Setup story navigation listeners
function setupStoryListeners(screens) {
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
}

export { displayStoryText, setupStoryListeners, storyNodes, currentNodeId };