import { updatePlayerAttribute, addInventoryItem, setPlayerAttribute, setPlayerFlag } from '../player.js';
import { displayStatChange, storyState } from '../story.js';

const townPillagingChoices = [
    { text: "Go straight for the church", nextNode: 25 },
    {
        text: "Go into the nearest house",
        nextNode: 26,
        condition: () => !storyState.hasVisited(26)
    },
    {
        text: "Walk around aimlessly",
        nextNode: 27,
        condition: () => !storyState.hasVisited(27)
    },
    {
        text: "Listen to Erik",
        nextNode: 28,
        condition: () => !storyState.hasVisited(28)
    }
];

// Structured story object
export const storyNodes = {
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
            { 
                text: "Try to keep your balance", 
                statCheck: {
                    stat: "agility",
                    threshold: 5,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('reputation', 1);
                            updatePlayerAttribute('agility', 1);
                            
                            return "With quick reflexes, you adjust your stance and maintain your balance while others tumble around you. Several crewmates notice your dexterity.<br><br>" +
                                   "Reputation +1<br>" +
                                   "Agility +1";
                        },
                        nextNode: 4,
                    },
                    failure: {
                        onSelect: () => {
                            return "Despite your efforts, the ship's violent motion throws you off balance.";
                        },
                        nextNode: 3,
                    }
                }
            },
            { 
                text: "Brace against the tide", 
                statCheck: {
                    stat: "strength",
                    threshold: 5,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('reputation', 1);
                            updatePlayerAttribute('strength', 1);
                            
                            return "You plant your feet firmly and tense your muscles, standing firm as the ship lurches. Your display of strength impresses those around you.<br><br>" +
                                   "Reputation +1<br>" +
                                   "Strength +1";
                        },
                        nextNode: 4,
                    },
                    failure: {
                        onSelect: () => {
                            return "You try to brace yourself, but the force is too much.";
                        },
                        nextNode: 3,
                    }
                }
            }
        ]
    },
    3: {
        text: "You struggle to maintain your footing, but the ship's violent motion throws you off balance. You tumble to the deck, banging your knee painfully against the wood. Several of your comrades snicker as you pick yourself up, your pride more wounded than your body.",
        next: 5,
        onEnter: () => {
            updatePlayerAttribute('reputation', -1);
            updatePlayerAttribute('health', -2);
        }
    },
    4: {
        text: "As others lose their balance around you, you widen your stance and lower your center of gravity. You remain standing even as the ship bucks and tilts. Several of your crewmates nod approvingly at your display of seamanship. Your reputation among the warband increases slightly.",
        next: 5
    },
    5: {
        text: "Steps away, the steering ore sits vacant as the shore approaches at a menacing pace...",
        choices: [
            { 
                text: "Fall in line, obeying the scattered commands of more experienced seamen", 
                nextNode: 6,
                onSelect: (success = true) => {
                    updatePlayerAttribute('reputation', 1);
                    
                    return "You follow orders and help where needed.<br><br>" +
                           "Reputation +1";
                }
            },
            { 
                text: "Seize the steering ore, taking matters into your own hands", 
                nextNode: 7,
                onSelect: (success = true) => {
                    updatePlayerAttribute('blackRaven', 1);
                    
                    return "You boldly take control of the situation.<br><br>" +
                           "Black Raven +1";
                }
            }
        ]
    },
    6: {
        text: "You follow the shouted orders of the more experienced warriors around you, helping to secure ropes and prepare for landing. The situation gradually comes under control as the ship lurches toward the shore. Your actions, while helpful, go largely unnoticed in the chaos.",
        next: 10
    },
    7: {
        text: "You leap toward the unmanned steering ore, gripping it firmly in your hands. The weight of it surprises you as you struggle to control the direction of the ship...",
        choices: [
            { 
                text: "Push through the struggle", 
                statCheck: {
                    stat: "strength",
                    threshold: 6,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('reputation', 3);
                            updatePlayerAttribute('strength', 1);
                            
                            return "With tremendous effort, you manage to control the ship's direction.<br><br>" +
                                   "Reputation +3<br>" +
                                   "Strength +1";
                        },
                        nextNode: 8,
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('reputation', -2);
                            
                            return "You struggle with the ore, but it's too much for you to handle.<br><br>" +
                                   "Reputation -2";
                        },
                        nextNode: 9,
                    }
                }
            },
            { 
                text: "Give up and let someone else handle it", 
                nextNode: 9,
                onSelect: (success = true) => {
                    updatePlayerAttribute('reputation', -1);
                    
                    return "You recognize your limitations and back away.<br><br>" +
                           "Reputation -1";
                }
            }
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
        next: 11,
        transitionTo: 'battle',
        battleType: 'first'
    },
    11: {
        text: "The Saxons charge from the treeline, their weapons glinting in the sunlight. Your heart pounds as you grip your weapon, preparing for your first real battle on Saxon soil.",
        next: 12
    },
    12: {
        text: "The clash of steel fades as the last Saxon falls. Breathing heavily, you contemplate your actions in the battle...",
        choices: [
            { 
                text: "Rejoice in your victory", 
                nextNode: 13,
                onSelect: (success = true) => {
                    updatePlayerAttribute('blackRaven', 3);
                    updatePlayerAttribute('strength', 1);
                    
                    return "You embrace the thrill of victory and bloodshed.<br><br>" +
                           "Black Raven +3<br>" +
                           "Strength +1";
                }
            },
            { 
                text: "Question the senseless violence", 
                nextNode: 14,
                onSelect: (success = true) => {
                    updatePlayerAttribute('whiteRaven', 3);
                    updatePlayerAttribute('intelligence', 1);
                    
                    return "You reflect on the cost of violence and conquest.<br><br>" +
                           "White Raven +3<br>" +
                           "Intelligence +1";
                }
            }
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
            { 
                text: "Search for loot among the dead", 
                nextNode: 16,
                onSelect: (success = true) => {
                    updatePlayerAttribute('fatigue', 5);
                    updatePlayerAttribute('gold', 3);
                    
                    return "You search the fallen for valuables.<br><br>" +
                           "Fatigue +5<br>" +
                           "Gold +3";
                }
            },
            { 
                text: "Take the opportunity to rest", 
                nextNode: 17,
                onSelect: (success = true) => {
                    updatePlayerAttribute('fatigue', -10);
                    updatePlayerAttribute('energy', 5);
                    
                    return "You take a moment to catch your breath.<br><br>" +
                           "Fatigue -10<br>" +
                           "Energy +5";
                }
            }
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
        next: 19,
        transitionTo: 'camp'
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
        next: 22,
        transitionTo: 'battle',
        battleType: 'second'
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
        choices: townPillagingChoices
    },
    25: {
        text: "You make your way toward the church on the hill, drawn to the prominent structure overlooking the town. As you approach, you notice several of your fellow warriors heading in the same direction, likely expecting valuable treasures inside...",
        next: 29
    },
    26: {
        text: "Rushing into the nearest abode, your eyes adjust to the dust and dark... A sound of shuffling ahead alerts you to danger.",
        choices: [
            { 
                text: "React quickly", 
                statCheck: {
                    stat: "agility",
                    threshold: 6,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('agility', 1);
                            
                            return "With lightning reflexes, you dodge the incoming attack.<br><br>" +
                                   "Agility +1";
                        },
                        nextNode: 40,
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('health', -10);
                            
                            return "You fail to react in time and take a painful blow.<br><br>" +
                                   "Health -10";
                        },
                        nextNode: 41,
                    }
                }
            }
        ]
    },
    27: {
        text: "You decide to wander through the chaos of the raid. Which path do you take?",
        choices: [
            { text: "Wander through the streets looking for valuables", nextNode: 50 },
            { text: "Follow the sound of a nearby scuffle", nextNode: 55 }
        ]
    },
    28: {
        text: "Erik has always had a nose for trouble. He tugs at your sleeve and points to a lone farmhouse on the edge of the settlement. 'There's something... interesting over there,' he says with an odd glint in his eye. 'Come with me, away from the others.'",
        choices: [
            { text: "Accompany Erik", nextNode: 31 },
            { text: "Disagree and return to the town", nextNode: 24 }
        ]
    },
    29: {
        text: "Whatever scene you expected you'd fine upon entering the church, this was a far cry. A stand off between the mysterious stranger with his party on one side. The Hersir flanked by Sven and Astrid and the larger portion of housecarls on the other. The mysterious stranger kneels in anguish, his blood drenched hand clutched to his eye...",
        end: true
    },
    30: {
        text: "As you finish exploring, you realize that most of your warband seems to be converging on the church. Perhaps that's where you should go next...",
        choices: townPillagingChoices
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
    40: {
        text: "You react instantly, sidestepping the clumsy blow of a desperate townsman. The axe swings wide, missing you entirely. A terrified man holding the simple axe stands trembling before you... his two small children cowering behind him... he waves the axe threateningly, preparing for another attempt.",
        next: 42
    },
    41: {
        text: "You fail to react in time as the axe catches you on the shoulder. Pain shoots through your arm as you stagger back. Though the wound isn't deep, blood seeps through your tunic. A terrified townsman stands trembling before you... his two small children cowering behind him... he waves the axe threateningly, emboldened by his successful strike.",
        next: 42
    },
    42: {
        text: "The townsman lunges at you with his axe, desperation in his eyes...",
        choices: [
            { 
                text: "Fight the townsman", 
                statCheck: {
                    stat: "strength",
                    threshold: 5,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('strength', 1);
                            
                            return "You overpower the townsman and defeat him in combat.<br><br>" +
                                   "Strength +1";
                        },
                        nextNode: 43,
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('health', -50);
                            
                            return "The townsman fights with desperate strength and lands a fatal blow.<br><br>" +
                                   "Health -50";
                        },
                        nextNode: 44,
                    }
                }
            }
        ]
    },
    43: {
        text: "The townsman's lifeless body crumples to the floor with a sickening exhale until only the sound of your heaving breaths occupy the small abode... you look at the drained and horrified faces of the children... a young boy and girl...",
        choices: [
            { text: "Spare them", nextNode: 45 },
            { text: "Spare them and give them something to help", nextNode: 46 },
            { text: "Apprehend them to be taken as slaves", nextNode: 47 },
            { text: "Put them out of their misery", nextNode: 48 }
        ]
    },
    44: {
        text: "The townsman fights with unexpected ferocity, his desperate need to protect his children lending him strength. His axe finds a vital spot, and you collapse to the ground as life drains from your body. The peasants' fate is sealed, and your saga ends here...",
        end: true
    },
    45: {
        text: "You lower your weapon and back away from the children, gesturing toward the door. They remain frozen in fear, unsure of your intentions. After a few tense moments, you simply turn and leave, allowing them to live. As you exit, you feel as though a White Raven watches with approval.",
        next: 49,
        onEnter: () => {
            updatePlayerAttribute('whiteRaven', 3);
            updatePlayerAttribute('reputation', 1);
        }
    },
    46: {
        text: "You reach into your pouch and pull out a few coins, placing them on a nearby table. It's not much, but it might help them survive in the chaos to come. The children stare at you with confusion and lingering terror as you back away and leave the house. You feel a strange sense of peace, as if a White Raven nods in approval at your rare act of mercy.",
        next: 49,
        onEnter: () => {
            updatePlayerAttribute('whiteRaven', 5);
            updatePlayerAttribute('reputation', 2);
            updatePlayerAttribute('gold', -3);
        }
    },
    47: {
        text: "You grab the children by their arms, ignoring their terrified cries as you drag them outside. Other warriors nod approvingly at your capture - young slaves fetch a good price. As you hand them off to be secured with the other captives, you feel a dark satisfaction, as if a Black Raven's wings brush against your soul.",
        next: 49,
        onEnter: () => {
            updatePlayerAttribute('blackRaven', 3);
            updatePlayerAttribute('reputation', 1);
            updatePlayerAttribute('gold', 5);
        }
    },
    48: {
        text: "You approach the cowering children, your weapon raised. Their cries are short-lived. As you leave the house, you feel a cold certainty in your actions - no witnesses, no problems. The shadow of a Black Raven seems to follow you approvingly as you rejoin your fellow warriors.",
        next: 49,
        onEnter: () => {
            updatePlayerAttribute('blackRaven', 5);
        }
    },
    49: {
        text: "You return to the chaotic streets of the town, the encounter in the house still fresh in your mind. Time has passed, and the initial frenzy of the raid has begun to settle into methodical plundering.",
        next: 30
    },
    50: {
        text: "You wander aimlessly through the carnage-ridden street looking for anything that might be valuable...",
        choices: [
            { 
                text: "Search carefully for valuables", 
                statCheck: {
                    stat: "intelligence",
                    threshold: 5,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('intelligence', 1);
                            updatePlayerAttribute('gold', 5);
                            
                            return "Your careful searching pays off as you find hidden valuables.<br><br>" +
                                   "Intelligence +1<br>" +
                                   "Gold +5";
                        },
                        nextNode: 53,
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('fatigue', 5);
                            
                            return "Despite your efforts, you find nothing of value.<br><br>" +
                                   "Fatigue +5";
                        },
                        nextNode: 51,
                    }
                }
            },
            { 
                text: "Search quickly and aggressively", 
                statCheck: {
                    stat: "strength",
                    threshold: 6,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('gold', 3);
                            
                            return "Your strength allows you to break into locked chests and cabinets.<br><br>" +
                                   "Gold +3";
                        },
                        nextNode: 53,
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('health', -5);
                            
                            return "You injure yourself while breaking into a locked chest.<br><br>" +
                                   "Health -5";
                        },
                        nextNode: 52,
                    }
                }
            }
        ]
    },
    51: {
        text: "You spend considerable time rummaging through abandoned homes and stalls, but find nothing of value. The commotion from the church grows louder as your frustration mounts. You've wasted precious time with nothing to show for it.",
        next: 54
    },
    52: {
        text: "While searching through debris, you cut your hand on a jagged piece of metal. Pain shoots up your arm as blood seeps from the wound. You curse your luck as you bind the injury with a strip of cloth. This will hinder your ability to fight effectively for a while.",
        next: 54
    },
    53: {
        text: "Fortune smiles upon you! Hidden beneath the floorboards of an abandoned home, you discover a small pouch of silver coins and a decorative brooch. This valuable find will serve you well when you return home.",
        next: 54
    },
    54: {
        text: "Time passes... you know that most of the action is centered around the church... you shouldn't tarry long...",
        next: 24
    },
    55: {
        text: "As you wander around, your attention is captured by the sound of a nearby scuffle... following the sounds to an isolated alleyway, you discover a pitiable sight. Three of your Viking companions have a small party of five peasants cornered against a wooden fence. A woman lies dead and blood-soaked, three women and two pitchfork-brandishing men face the Vikings in a doomed standoff.\n\n'Eh? Bugger off man, there's only enough for the three of us!' One of the Vikings, a gaunt and vicious looking Bondi, growls at you.",
        choices: [
            { text: "Agree, and walk away (-Rep)", nextNode: 56 },
            { text: "Intervene, brandishing your own weapon (-Rep)", nextNode: 57 }
        ]
    },
    56: {
        text: "You shrug and turn away, leaving the peasants to their fate. The screams that follow haunt you as you make your way back through the town. Your reputation among some of your comrades diminishes slightly for your unwillingness to challenge your fellow Vikings.",
        next: 54
    },
    57: {
        text: "You draw your weapon and step forward, placing yourself between the Vikings and the terrified peasants. The leader scoffs, 'This shouldn't take long...' as his two companions hold the peasants at bay, he moves to confront you.",
        choices: [
            { 
                text: "Fight with strength and raw power", 
                statCheck: {
                    stat: "strength",
                    threshold: 7,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('strength', 1);
                            updatePlayerAttribute('reputation', 2);
                            
                            return "Your powerful strikes overwhelm the Viking leader.<br><br>" +
                                   "Strength +1<br>" +
                                   "Reputation +2";
                        },
                        nextNode: 58,
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('health', -50);
                            
                            return "The Viking proves stronger than you anticipated.<br><br>" +
                                   "Health -50";
                        },
                        nextNode: 59,
                    }
                }
            },
            { 
                text: "Rely on your agility and technique", 
                statCheck: {
                    stat: "agility",
                    threshold: 7,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('agility', 1);
                            updatePlayerAttribute('reputation', 2);
                            
                            return "You dance around the Viking's attacks and find openings in his defense.<br><br>" +
                                   "Agility +1<br>" +
                                   "Reputation +2";
                        },
                        nextNode: 58,
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('health', -50);
                            
                            return "The Viking anticipates your movements and strikes a fatal blow.<br><br>" +
                                   "Health -50";
                        },
                        nextNode: 59,
                    }
                }
            }
        ]
    },
    58: {
        text: "The Viking leader falls before your superior combat skills. Blood pools around his body as you turn to face his companions. The other two look at you, then at each other... their resolve weakening.",
        next: 60,
        onEnter: () => {
            // Add item to inventory when defeating the Viking
            addInventoryItem({
                name: "Viking Armband",
                description: "A silver armband taken from a defeated Viking. A trophy of your victory.",
                type: "treasure",
                value: 5,
                icon: "⚔️"
            });
        }
    },
    59: {
        text: "Despite your bravery, the Viking proves to be the better warrior. His blade finds a gap in your defense, and you fall to the ground as life drains from your body. The peasants' fate is sealed, and your saga ends here...",
        transitionTo: 'gameOver',
        deathCause: "Killed while defending Saxon peasants from your own Viking comrades",
        end: true
    },
    60: {
        text: "You stand over the body of their leader, your weapon still wet with his blood. 'Leave now,' you growl at the remaining Vikings, 'or join him.'",
        choices: [
            { 
                text: "Intimidate them with your reputation", 
                statCheck: {
                    stat: "reputation",
                    threshold: 5,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('reputation', 2);
                            
                            return "Your fearsome reputation causes them to back down.<br><br>" +
                                   "Reputation +2";
                        },
                        nextNode: 64,
                    },
                    failure: {
                        onSelect: () => {
                            return "Your reputation isn't strong enough to intimidate them.";
                        },
                        nextNode: 61,
                    }
                }
            },
            { 
                text: "Prepare for another fight", 
                nextNode: 61,
                onSelect: (success = true) => {
                    updatePlayerAttribute('blackRaven', 1);
                    updatePlayerAttribute('strength', 1);
                    
                    return "You ready yourself for more bloodshed.<br><br>" +
                           "Black Raven +1<br>" +
                           "Strength +1";
                }
            }
        ]
    },
    61: {
        text: "The Vikings refuse to back down, emboldened by their numbers. They release the peasants and rush toward you, weapons raised. Unexpectedly, the peasants seize the opportunity, grabbing their pitchforks and joining your side against the two remaining Vikings.",
        choices: [
            { 
                text: "Lead the fight with tactical precision", 
                statCheck: {
                    stat: "intelligence",
                    threshold: 6,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('intelligence', 1);
                            
                            return "You coordinate with the peasants to outmaneuver the Vikings.<br><br>" +
                                   "Intelligence +1";
                        },
                        nextNode: 62,
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('health', -50);
                            
                            return "Your plan fails, and a Viking blade finds its mark.<br><br>" +
                                   "Health -50";
                        },
                        nextNode: 63,
                    }
                }
            },
            { 
                text: "Fight with reckless courage", 
                statCheck: {
                    stat: "strength",
                    threshold: 8,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('blackRaven', 2);
                            updatePlayerAttribute('strength', 1);
                            updatePlayerAttribute('health', -10);
                            
                            return "You throw yourself at the Vikings with wild abandon, taking some wounds but emerging victorious.<br><br>" +
                                   "Black Raven +2<br>" +
                                   "Strength +1<br>" +
                                   "Health -10";
                        },
                        nextNode: 62,
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('health', -50);
                            
                            return "Your recklessness proves fatal as you are overwhelmed.<br><br>" +
                                   "Health -50";
                        },
                        nextNode: 63,
                    }
                }
            }
        ]
    },
    62: {
        text: "Together with the peasants, you manage to defeat the remaining Vikings. As the last one falls, the peasants look at you with a mixture of fear, confusion, and gratitude. They clearly didn't expect to be saved by one of the raiders.",
        choices: [
            { 
                text: "Nod to the grateful peasants and take your leave", 
                nextNode: 65,
                onSelect: (success = true) => {
                    updatePlayerAttribute('whiteRaven', 5);
                    updatePlayerAttribute('charisma', 1);
                    
                    return "You show mercy to the peasants, earning their silent gratitude.<br><br>" +
                           "White Raven +5<br>" +
                           "Charisma +1";
                }
            },
            { 
                text: "Slaughter the peasants and loot everyone", 
                nextNode: 66,
                onSelect: (success = true) => {
                    updatePlayerAttribute('blackRaven', 5);
                    updatePlayerAttribute('gold', 8);
                    
                    return "You decide to eliminate all witnesses and claim all the loot.<br><br>" +
                           "Black Raven +5<br>" +
                           "Gold +8";
                }
            }
        ]
    },
    63: {
        text: "Despite the aid of the peasants, the Vikings prove too skilled. A blade slides between your ribs, and you collapse to the ground. The peasants scatter as you fall, and darkness claims you. Your saga ends here...",
        transitionTo: 'gameOver',
        deathCause: "Killed in battle against fellow Vikings while defending Saxon peasants",
        end: true
    },
    64: {
        text: "The Vikings grumble under their breath, but your victory over their leader has made an impression. They back away slowly before turning to seek easier targets elsewhere. The peasants stare at you in disbelief, unsure whether to flee or thank you.",
        choices: [
            { 
                text: "Nod to the grateful peasants and take your leave", 
                nextNode: 65,
                onSelect: (success = true) => {
                    updatePlayerAttribute('whiteRaven', 5);
                    updatePlayerAttribute('charisma', 1);
                    
                    return "You show mercy to the peasants, earning their silent gratitude.<br><br>" +
                           "White Raven +5<br>" +
                           "Charisma +1";
                }
            },
            { 
                text: "Slaughter the peasants and take their valuables", 
                nextNode: 66,
                onSelect: (success = true) => {
                    updatePlayerAttribute('blackRaven', 5);
                    updatePlayerAttribute('gold', 5);
                    
                    return "You decide to eliminate the witnesses and claim their goods.<br><br>" +
                           "Black Raven +5<br>" +
                           "Gold +5";
                }
            }
        ]
    },
    65: {
        text: "You give the peasants a simple nod and turn to leave, ignoring their whispered thanks. As you walk away, you feel a strange sensation, as if a White Raven watches your act of mercy with approval. The peasants will live to see another day because of your intervention.",
        next: 54,
        onEnter: () => {
            // Add a special item for the merciful path
            addInventoryItem({
                name: "White Feather",
                description: "A pristine white feather that appeared mysteriously after you spared the peasants. It seems to glow softly in the dark.",
                type: "special",
                icon: "⚪"
            });
        }
    },
    66: {
        text: "You consider the peasants for a moment, then make your decision. They have no place in the new world your people are creating here. Your blade makes quick work of them, and afterward, you loot both their bodies and those of the fallen Vikings. As you walk away with your spoils, you feel as though a Black Raven's shadow passes over you approvingly.",
        next: 54,
        onEnter: () => {
            // Add a special item for the ruthless path
            addInventoryItem({
                name: "Black Feather",
                description: "A jet-black feather that appeared mysteriously after your slaughter. It seems to absorb light around it.",
                type: "special",
                icon: "⚫"
            });
        }
    }
};