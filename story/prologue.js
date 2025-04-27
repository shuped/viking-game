// Prologue story nodes
import { updatePlayerAttribute, addInventoryItem } from '../player.js';
import { displayStatChange, storyState } from '../story.js';

export const storyNodes = {
    // INTRO SECTION
    0: {
        text: "Welcome to the Tale of Two Ravens...\nThis adventure is set in quasi-historical fictional universe based on the Viking Age... Death is Permanent, and every decision matters... how your tale unfolds is up to you...\n... and the will of the gods...",
        next: 1
    },
    1: {
        text: "You are...",
        choices: [
            { 
                text: "Bjorn, a mighty warrior", 
                nextNode: 2,
                onSelect: (success = true) => {
                    updatePlayerAttribute('strength', 2);
                    updatePlayerAttribute('agility', 1);
                    updatePlayerAttribute('intelligence', -1);
                    
                    // Return a string describing the stat changes
                    return "You chose Bjorn, a mighty warrior.<br><br>" +
                           "Strength +2<br>" +
                           "Agility +1<br>" +
                           "Intelligence -1";
                }
            },
            { 
                text: "Leif, a clever explorer", 
                nextNode: 2,
                onSelect: (success = true) => {
                    updatePlayerAttribute('intelligence', 2);
                    updatePlayerAttribute('agility', 1);
                    updatePlayerAttribute('charisma', -1);
                    
                    // Return a string describing the stat changes
                    return "You chose Leif, a clever explorer.<br><br>" +
                           "Intelligence +2<br>" +
                           "Agility +1<br>" +
                           "Charisma -1";
                }
            },
            { 
                text: "Freya, a fierce shieldmaiden", 
                nextNode: 2,
                onSelect: (success = true) => {
                    updatePlayerAttribute('strength', 1);
                    updatePlayerAttribute('agility', 2);
                    updatePlayerAttribute('charisma', -1);
                    
                    // Return a string describing the stat changes
                    return "You chose Freya, a fierce shieldmaiden.<br><br>" +
                           "Strength +1<br>" +
                           "Agility +2<br>" +
                           "Charisma -1";
                }
            }
        ]
    },
    2: {
        text: "Tonight is the eve of your eighteenth birthday... As you close your eyes and drift to sleep you find yourself reflecting on your life until now... You wonder why the gods saw fit you should be born into a family of...",
        choices: [
            { 
                text: "Poor farmers", 
                nextNode: 3,
                onSelect: (success = true) => {
                    updatePlayerAttribute('strength', 2);
                    updatePlayerAttribute('intelligence', -1);
                    updatePlayerAttribute('charisma', -1);
                    updatePlayerAttribute('fatigue', -5);
                    
                    return "You chose a family of poor farmers.<br><br>" +
                           "Strength +2<br>" +
                           "Intelligence -1<br>" +
                           "Charisma -1<br>" +
                           "Fatigue -5";
                }
            },
            { 
                text: "Modest Fisherfolk", 
                nextNode: 3,
                onSelect: (success = true) => {
                    updatePlayerAttribute('strength', 1);
                    updatePlayerAttribute('agility', 2);
                    updatePlayerAttribute('charisma', -1);
                    
                    return "You chose a family of modest fisherfolk.<br><br>" +
                           "Strength +1<br>" +
                           "Agility +2<br>" +
                           "Charisma -1";
                }
            },
            { 
                text: "Comfortable Craftsmen", 
                nextNode: 3,
                onSelect: (success = true) => {
                    updatePlayerAttribute('strength', -1);
                    updatePlayerAttribute('intelligence', 2);
                    updatePlayerAttribute('charisma', 1);
                    updatePlayerAttribute('gold', 5);
                    
                    return "You chose a family of comfortable craftsmen.<br><br>" +
                           "Strength -1<br>" +
                           "Intelligence +2<br>" +
                           "Charisma +1<br>" +
                           "Gold +5";
                }
            }
        ]
    },
    3: {
        text: "You've long been possessed of vivid dreams, but this one feels different... Your hearth and home glows distant in the void behind you, comfort and familiarity shrink to the size of a distant candle as you seem to flow forward along an ashen path, flanked by strangely nostalgic shadows...",
        next: 4
    },
    4: {
        text: "You arrive at a crossroads and pause... There is nothing to distinguish the left hand path from the right... The world around you seems to be holding its breath... Silence... Futility...\nA chestnut falls to the ground at your feet, startling you... you breath... you look up...",
        next: 5
    },
    5: {
        text: "Mirroring the left path and the right path hang two desiccated tree branches... On the left sits a White Raven, reposed in serene disinterest, its gaze fixed towards the left hand path... On the right, a Raven Black as jet is staring at you, it caws pleadingly before dropping another chestnut on the ground... an offering?",
        choices: [
            { 
                text: "Choose the Left White Raven path", 
                nextNode: 6,
                onSelect: (success = true) => {
                    updatePlayerAttribute('whiteRaven', 5);
                    updatePlayerAttribute('reputation', 2);
                    updatePlayerAttribute('intelligence', 1);
                    updatePlayerAttribute('charisma', 1);
                    
                    return "You chose the White Raven's path.<br><br>" +
                           "White Raven +5<br>" +
                           "Reputation +2<br>" +
                           "Intelligence +1<br>" +
                           "Charisma +1";
                }
            },
            { 
                text: "Choose the Right Black Raven path", 
                nextNode: 6,
                onSelect: (success = true) => {
                    updatePlayerAttribute('blackRaven', 5);
                    updatePlayerAttribute('strength', 1);
                    updatePlayerAttribute('agility', 1);
                    updatePlayerAttribute('reputation', 1);
                    
                    return "You chose the Black Raven's path.<br><br>" +
                           "Black Raven +5<br>" +
                           "Strength +1<br>" +
                           "Agility +1<br>" +
                           "Reputation +1";
                }
            }
        ]
    },
    6: {
        text: "The next morning begins like any other, but you feel somehow... different. The town of Víkstad is buzzing with activity this morning... Several Hersir ingress from the surrounding lands, with their retinues in tow.",
        next: 7
    },
    7: {
        text: "You recognize quickly what is happening... A warband is being assembled and thus perilous opportunity awaits any man capable of bearing arms... Your spirit seems to quake with interest... You eagerly attend the meeting grounds, another faceless prospective warrior in the crowd as you take in the scene...",
        next: 8
    },
    8: {
        text: "At the center of the gathering stands your own local Hersir Olaf... Kneeling before Olaf are three mysterious strangers, clad in black... whispers and hushed gossip from the crowd around you indicate that these are representatives of Jarl Oddr, the most powerful man in Norgard.",
        next: 9
    },
    9: {
        text: "The strangers consist of a rugged, sharp looking man flanked by a hulking brute of a man to his right, and a mystic woman to his left. The brute is larger than any man you'd ever seen, his stature lends credence to the countless legends and myths you'd often heard of mountain giants and trolls.",
        next: 10
    },
    10: {
        text: "The woman is strikingly beautiful even under a thick veneer of runic fetishes and paints... but your intuition tells you she may be the more dangerous of the two retainers, evoking a murderous atmosphere which sets your hair on end.",
        next: 11
    },
    11: {
        text: "The leader is the most non-descript of the trio, his stature hidden beneath thick black furs... But his striking ice blue eyes seem to glow with a singular purpose, as if he can see only the object of his greatest intentions... as if the world around him is ethereal, and unreal... the stuff of dreams.",
        next: 12
    },
    12: {
        text: "The Hersir accepts the strangers' bid to join the warband in the name of Jarl Oddr and dismisses them for now. A pact is struck... A warband is formed... A call goes out for volunteers... Bondi warriors... Men like you.",
        transitionTo: 'camp'
    },

    // JOIN UP QUEST SECTION - Accessible via Travel Menu
    13: {
        text: "The town square bustles with young, unproven warriors... and vendors of all types looking to capitalize on the uproar of activity... As you make your way through the crowd, you bump into your childhood friend Erik.",
        next: 14,
    },
    14: {
        text: "Erik: \"Hey! I thought it was you! You're signing up too eh? This seems like a real chance to change my luck, things have been pretty tough around here lately.\"",
        next: 15
    },
    15: {
        text: "You've always known Erik to be a decent sort... but he has a real knack for getting into all sorts of trouble, it seems he's fallen on hard times. You make your way to the Housecarl in charge of recruiting.",
        next: 17
    },
    17: {
        text: "Erik: *As you walk away Erik pauses, and in a slow, conspiratorial voice he says* \"Listen, I don't know about you, but I'm gonna need to think of a 'creative' way to acquire some gear... what do you say?\"",
        choices: [
            { 
                text: "Agree to help Erik 'acquire' the needed gear", 
                nextNode: 18,
                onSelect: (success = true) => {
                    updatePlayerAttribute('blackRaven', 3);
                    updatePlayerAttribute('reputation', -1);
                    
                    return "You chose to help Erik with his scheme.<br><br>" +
                           "Black Raven +3<br>" +
                           "Reputation -1";
                }
            },
            { 
                text: "Disagree and find an honest way to get gear", 
                nextNode: 19,
                onSelect: (success = true) => {
                    updatePlayerAttribute('whiteRaven', 3);
                    updatePlayerAttribute('reputation', 1);
                    updatePlayerAttribute('gold', -5);
                    
                    return "You chose the honest path.<br><br>" +
                           "White Raven +3<br>" +
                           "Reputation +1<br>" +
                           "Gold -5";
                }
            }
        ]
    },
    
    // ERIK'S PLAN PATH
    18: {
        text: "Erik's eyes gleam with a familiar scoundrel's charm as he chuckles approvingly. \"I knew I could count on you! Listen, meet me at the training grounds behind the old Hersir's place... I'll explain later...\"",
        transitionTo: 'camp'
    },
    
    // HONEST PATH
    19: {
        text: "Shooting you a melancholic half smile, Erik nods. \"Suit yourself old friend, as for me... I'll get what I need one way or another, I'm not gonna be left behind... not this time.\"",
        transitionTo: 'camp'
    },
    
    // ERIK'S SCHEME CONTINUES
    20: {
        text: "You arrive at the training grounds to find Erik leaning nonchalantly against the old stone wall, watching a group of Vikings from a far off village practice their martial skills... He looks at you with a strangely... apologetic? ...smile.",
        next: 21
    },
    21: {
        text: "Erik: \"I've got it all figured out, old friend! Listen... all you have to do is march over there and create a spectacle, I'll handle the hard part.\"",
        next: 22
    },
    22: {
        text: "You: \"...\" \"...\" \"A spectacle? And I don't suppose you've taken my impending demise into consideration?\"",
        next: 23
    },
    23: {
        text: "Erik: \"...I'm sure you'll be just fine, just don't do anything stupid... if you can get them all focused on you for just a few minutes, I'll handle my end of things... and we'll meet back at the tavern. Simple.\"",
        next: 24
    },
    24: {
        text: "You approach the warriors and they watch you with curiosity, pausing their exercises begrudgingly and sizing you up...",
        choices: [
            { 
                text: "Challenge their strongest warrior to a duel", 
                condition: () => !storyState.hasCompletedChoice(24, 0),
                onSelect: (success = true) => {                    
                    return "You challenge their strongest warrior to a duel.<br><br>"
                },
                statCheck: {
                    stat: "strength",
                    threshold: 7,
                    success: {
                        onSelect: () => {
                            return "Your appearance is enough to challenge the masculinity of the experienced warriors"
                        },
                        nextNode: 25,
                    },
                    failure: {
                        onSelect: () => {     
                            updatePlayerAttribute('reputation', -10);                       
                            return "The warriors look you up and down before howling with laughter, and returning to their activities.. at least you made an impression... You'll have to try something else...<br><br>" +
                                   "Reputation -10";
                        },
                        nextNode: 24,
                    }
                }
            },
            { 
                text: "Regale them with a gripping story", 
                nextNode: 26,
                condition: () => !storyState.hasCompletedChoice(24, 1),
                statCheck: {
                    stat: "charisma",
                    threshold: 5,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('reputation', 2);
                            updatePlayerAttribute('charisma', 1);
                            
                            return "Your story captivates the warriors!<br><br>" +
                                   "Reputation +2<br>" +
                                   "Charisma +1";
                        },
                        nextNode: 50,
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('reputation', -2);
                            
                            return "Your story falls flat and the warriors mock you.<br><br>" +
                                   "Reputation -2";
                        },
                        nextNode: 24,
                    }
                }
            },
            { 
                text: "Insult their mothers... and prepare to run for your life", 
                nextNode: 27,
                onSelect: (success = true) => {
                    updatePlayerAttribute('reputation', -2);
                    updatePlayerAttribute('blackRaven', 1);
                    updatePlayerAttribute('energy', -10);
                    
                    return "You insult their mothers and create quite a scene!<br><br>" +
                           "Reputation -2<br>" +
                           "Black Raven +1<br>" +
                           "Energy -10";
                }
            }
        ]
    },
    
    // INSULT MOTHERS PATH
    27: {
        text: "You take a deep breath, steel your resolve, and loudly proclaim that their mothers were so ugly they must have been fathered by trolls... For a moment there is absolute silence as the warriors process what you just said...",
        next: 31,
        statCheck: {
            stat: "agility",
            threshold: 6,
            success: {
                onSelect: () => {
                    updatePlayerAttribute('agility', 1);
                    updatePlayerAttribute('energy', -15);
                    
                    return "The Vikings waste no time, chasing you with murderous intent across the field and into the woods... It seems for a moment like you might be done for, but you run like the wind... They at last give up the chase... you just hope you won't run into them again before you set sail tomorrow...<br><br>" +
                           "Agility +1<br>" +
                           "Energy -15";
                },
                nextNode: 32,
            },
            failure: {
                onSelect: () => {
                    updatePlayerAttribute('health', -500);
                    
                    return "The Vikings waste no time, chasing you with murderous intent across the field and into the woods... It seems for a moment like you might outpace them... but your foot catches a gnarled root and you tumble to the ground... You begin to stand up, not daring to look behind you... *The world goes black*<br><br>" +
                           "Health -500<br>" +
                           "GAME OVER";
                },
                nextNode: 666, // Changed from 40 to 666 (game over node)
            }
        }
    },
    31: {
        text: "The warriors look at each other, and then at you, their faces contorting with rage. One of them gives a howl like a wolf and they all start towards you. You take off running as fast as your legs will carry you!",
        next: 32
    },
    32: {
        text: "You've escaped the warriors and made it back to the tavern. You find Erik in his room...\n\nErik: \"You're alive! I was starting to worry when I heard those Danes were on a rampage!\"\nYou: \"...I just hope it was all worth it, did you get the loot?\"\nErik: *Shrugging and flashing you his characteristic scoundrel's half smile* \"Have I ever let you down before!?\"\nYou: \"...\" \"...\" \"...\"\nErik: \"All right, all right! Here, your share of the loot.\"",
        next: 30,
        onEnter: () => {
            // Add a weapon to player inventory
            addInventoryItem({
                name: "Rusty Seax",
                description: "A short, single-edged blade. It's seen better days, but it's better than nothing.",
                type: "weapon",
                damage: 3,
                icon: "🗡️"
            });
        }
    },
    
    // Success branch for storytelling path
    50: {
        text: "You walk back to the tavern with your head held high, and your reputation improved. You handled yourself like an expert storyteller. You find Erik in his room...",
        next: 51
    },
    // Roughly same as 29
    51: {
        text: "You walk back to the tavern with your head held high. You find Erik in his room...\n\nErik: \"If it isn't the champion of Vikstad himself!\"\nYou: \"...I just hope it was all worth it, did you get the loot?\"\nErik: *Shrugging and flashing you his characteristic scoundrel's half smile* \"Have I ever let you down before!?\"\nYou: \"...\" \"...\" \"...\"\nErik: \"All right, all right! Here, your share of the loot.\"",
        next: 30,
        onEnter: () => {
            // Add a weapon to player inventory
            addInventoryItem({
                name: "Rusty Seax",
                description: "A short, single-edged blade. It's seen better days, but it's better than nothing.",
                type: "weapon",
                damage: 3,
                icon: "🗡️"
            });
        }
    },
    
    // Original nodes continue here
    // CAMP UI SECTION
    30: {
        text: "Weapon and armor aquired. Erik's trust gained.",
        transitionTo: 'camp'
    },
    
    // VARIOUS SOCIAL INTERACTIONS
    33: {
        text: "[Conversation with Sven would occur here]",
        transitionTo: 'camp'
    },
    34: {
        text: "[Conversation with Astrid would occur here]",
        transitionTo: 'camp'
    },
    35: {
        text: "[Observations of the mysterious strangers would occur here]",
        transitionTo: 'camp'
    },
    36: {
        text: "[Interaction with Erik at the dice game would occur here]",
        transitionTo: 'camp'
    },
    37: {
        text: "[Conversation with Grimr and Gunnar would occur here]",
        transitionTo: 'camp'
    },
    
    // FINAL TRANSITION TO CHAPTER ONE
    38: {
        text: `Housecarl: *The grizzled veteran looks you over with a disinterested sneer* "Well... that's more like it, at least now you might actually prove useful in Saxia... if only as a distraction... (+Rep)`,
        next: 39
    },
    39: {
        text: "After many days at sea, fever takes hold of you. Strange visions plague your dreams...",
        next: 40
    },
    40: {
        text: "The prologue of your story ends here, but your true journey is just beginning...",
        end: true,
        nextChapter: "chapter-one"  // This tells the story system to load chapter-one next
    },

    // DUEL PATH - Expanded duel system with multiple rounds
    25: {
        text: "A tall Viking with an elaborately braided red beard steps towards you with a hearty chuckle... moments later the stage is set for a proper duel, wooden swords and old shields will be used.",
        next: 28
    },
    28: {
        text: "DUEL: Round 1\n\nYou face off against the red-bearded warrior as the others gather around to watch. Choose your approach:",
        choices: [
            { 
                text: "STR - Rely on your strength to overpower Red Beard", 
                statCheck: {
                    stat: "strength",
                    threshold: 7,
                    success: {
                        onSelect: () => {
                            // Track successful round instead of immediately granting stats
                            storyState.duelRound1Success = true;
                            
                            return "The crowd watches in rapt silence as you batter your foe with a series of enraged heavy attacks... he stumbles and falls, but swiftly returns to his feet... his face is battered and bleeding as he howls with rage... it's not over yet...";
                        },
                        nextNode: 28.1, // Next round
                    },
                    failure: {
                        onSelect: () => {
                            storyState.duelRound1Success = false;
                            updatePlayerAttribute('health', -10);
                            
                            return "Your strength is pitiful when tested against the red bearded brute... He overpowers you easily, unleashing a devastating series of blows to your face and body... you're bleeding... All present watch with keen interest...<br><br>" +
                                   "Health -10";
                        },
                        nextNode: 28.1, // Next round
                    }
                }
            },
            { 
                text: "AGI - Focus on dexterity and quick attacks", 
                statCheck: {
                    stat: "agility",
                    threshold: 6,
                    success: {
                        onSelect: () => {
                            // Track successful round instead of immediately granting stats
                            storyState.duelRound1Success = true;
                            
                            return "You dash in a lightning blitz, rattling off blow after blow and covering your foe with a series of painful bruises... he staggers back, panting. The look of uncertainty on his face emboldens you, and you seize the moment slicing him in the neck with a brutal finisher. He falls to the ground... silence...";
                        },
                        nextNode: 28.1, // Next round
                    },
                    failure: {
                        onSelect: () => {
                            storyState.duelRound1Success = false;
                            updatePlayerAttribute('health', -10);
                            
                            return "You're clumsy and untrained blows fail to overwhelm the brute, with a strained grunt, he smashes you in the face with his shield... sending you reeling to the ground... for a moment the world goes dark...<br><br>" +
                                   "Health -10";
                        },
                        nextNode: 28.1, // Next round
                    }
                }
            },
            { 
                text: "END - Focus on defense and striking at opportune moments", 
                statCheck: {
                    stat: "endurance",
                    threshold: 6,
                    success: {
                        onSelect: () => {
                            // Track successful round instead of immediately granting stats
                            storyState.duelRound1Success = true;
                            
                            return "You keep your distance, humiliating and angering your opponent with each successful dodge, block and parry... he's frustrated and exhausted now, you seize an opening and smash his shield out of his hand, finishing with a flourish, your practice sword against his throat. The rapt silence of the onlookers breaks as they grumble their annoyances at your cheeky fighting style.";
                        },
                        nextNode: 28.1, // Next round
                    },
                    failure: {
                        onSelect: () => {
                            storyState.duelRound1Success = false;
                            updatePlayerAttribute('health', -10);
                            updatePlayerAttribute('energy', -15);
                            
                            return "You overestimated your abilities, as your stamina runs low, the red bearded brute carries on fighting. He still seems fresh, blocking, dodging and parrying blows until you're so exhausted that you can't lift your shield anymore... you fall to your knees... and take a swift and hard kick to the face... the world goes dark...<br><br>" +
                                   "Health -10<br>" +
                                   "Energy -15";
                        },
                        nextNode: 28.1, // Next round
                    }
                }
            }
        ]
    },
    28.1: {
        text: "DUEL: Round 2\n\nRed Beard adjusts his stance, clearly taking you more seriously now. Choose your approach for the second round:",
        choices: [
            { 
                text: "STR - Rely on your strength to overpower Red Beard", 
                statCheck: {
                    stat: "strength",
                    threshold: 8, // Harder check
                    success: {
                        onSelect: () => {
                            // Track successful round instead of immediately granting stats
                            storyState.duelRound2Success = true;
                            
                            return "With renewed determination, you unleash a devastating series of powerful blows. Red Beard attempts to block but your raw strength breaks through his defenses...";
                        },
                        nextNode: 28.2, // Final round
                    },
                    failure: {
                        onSelect: () => {
                            storyState.duelRound2Success = false;
                            updatePlayerAttribute('health', -15);
                            
                            return "Red Beard anticipates your straightforward approach and counters effortlessly, landing several painful blows that leave you staggering...<br><br>" +
                                   "Health -15";
                        },
                        nextNode: 28.2, // Final round
                    }
                }
            },
            { 
                text: "AGI - Focus on dexterity and quick attacks", 
                statCheck: {
                    stat: "agility",
                    threshold: 7, // Harder check
                    success: {
                        onSelect: () => {
                            // Track successful round instead of immediately granting stats
                            storyState.duelRound2Success = true;
                            
                            return "You dance around Red Beard, your speed making you nearly impossible to hit. You land several quick strikes that leave him frustrated and off-balance...";
                        },
                        nextNode: 28.2, // Final round
                    },
                    failure: {
                        onSelect: () => {
                            storyState.duelRound2Success = false;
                            updatePlayerAttribute('health', -15);
                            
                            return "Your fancy footwork fails you as Red Beard predicts your movements. He trips you, sending you sprawling into the dirt to the laughter of the onlookers...<br><br>" +
                                   "Health -15";
                        },
                        nextNode: 28.2, // Final round
                    }
                }
            },
            { 
                text: "END - Focus on defense and striking at opportune moments", 
                statCheck: {
                    stat: "endurance",
                    threshold: 7, // Harder check
                    success: {
                        onSelect: () => {
                            // Track successful round instead of immediately granting stats
                            storyState.duelRound2Success = true;
                            
                            return "You weather Red Beard's assault, conserving your energy while he tires himself out. The crowd begins to cheer as they recognize your tactical approach...";
                        },
                        nextNode: 28.2, // Final round
                    },
                    failure: {
                        onSelect: () => {
                            storyState.duelRound2Success = false;
                            updatePlayerAttribute('health', -15);
                            updatePlayerAttribute('energy', -15);
                            
                            return "Your defensive strategy falters as Red Beard overwhelms you with relentless attacks. Your arms grow weary from blocking his powerful blows...<br><br>" +
                                   "Health -15<br>" +
                                   "Energy -15";
                        },
                        nextNode: 28.2, // Final round
                    }
                }
            }
        ]
    },
    28.2: {
        text: "DUEL: Final Round\n\nThe crowd is fully engaged now, cheering and placing bets. This is the decisive moment - choose your final approach:",
        choices: [
            { 
                text: "STR - End this with overwhelming power", 
                statCheck: {
                    stat: "strength",
                    threshold: 9, // Hardest check
                    success: {
                        onSelect: () => {
                            // Track successful round instead of immediately granting stats
                            storyState.duelRound3Success = true;
                            
                            // Check if all three rounds were successful
                            const allRoundsSuccess = storyState.duelRound1Success && 
                                                    storyState.duelRound2Success && 
                                                    storyState.duelRound3Success;
                            
                            // Only grant reputation for complete victory
                            if (allRoundsSuccess) {
                                updatePlayerAttribute('reputation', 5);
                                return "With a mighty roar, you charge forward and deliver a devastating blow that shatters Red Beard's shield and sends him crashing to the ground. The crowd erupts in cheers at your display of raw power!<br><br>" +
                                       "Reputation +5";
                            } else {
                                return "With a mighty roar, you charge forward and deliver a devastating blow that shatters Red Beard's shield and sends him crashing to the ground. The crowd erupts in cheers at your display of raw power!";
                            }
                        },
                        nextNode: 29, // Victory path
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('reputation', -3);
                            updatePlayerAttribute('health', -20);
                            
                            return "Your final desperate attack leaves you exposed. Red Beard sidesteps and delivers a crushing counter that sends you sprawling to the ground in defeat...<br><br>" +
                                   "Reputation -3<br>" +
                                   "Health -20";
                        },
                        nextNode: 52, // Defeat path
                    }
                }
            },
            { 
                text: "AGI - Win with speed and precision", 
                statCheck: {
                    stat: "agility",
                    threshold: 8, // Hardest check
                    success: {
                        onSelect: () => {
                            // Track successful round instead of immediately granting stats
                            storyState.duelRound3Success = true;
                            
                            // Check if all three rounds were successful
                            const allRoundsSuccess = storyState.duelRound1Success && 
                                                    storyState.duelRound2Success && 
                                                    storyState.duelRound3Success;
                            
                            // Only grant reputation for complete victory
                            if (allRoundsSuccess) {
                                updatePlayerAttribute('reputation', 5);
                                return "You become a blur of motion, striking from impossible angles. Before Red Beard can even react, you've disarmed him and placed your practice sword at his throat. The crowd roars their approval!<br><br>" +
                                       "Reputation +5";
                            } else {
                                return "You become a blur of motion, striking from impossible angles. Before Red Beard can even react, you've disarmed him and placed your practice sword at his throat. The crowd roars their approval!";
                            }
                        },
                        nextNode: 29, // Victory path
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('reputation', -3);
                            updatePlayerAttribute('health', -20);
                            
                            return "Your attempt at a flashy finish backfires as Red Beard anticipates your movement. He catches your arm mid-swing and throws you painfully to the ground...<br><br>" +
                                   "Reputation -3<br>" +
                                   "Health -20";
                        },
                        nextNode: 52, // Defeat path
                    }
                }
            },
            { 
                text: "END - Outlast and outsmart your opponent", 
                statCheck: {
                    stat: "endurance",
                    threshold: 8, // Hardest check
                    success: {
                        onSelect: () => {
                            // Track successful round instead of immediately granting stats
                            storyState.duelRound3Success = true;
                            
                            // Check if all three rounds were successful
                            const allRoundsSuccess = storyState.duelRound1Success && 
                                                    storyState.duelRound2Success && 
                                                    storyState.duelRound3Success;
                            
                            // Only grant reputation for complete victory
                            if (allRoundsSuccess) {
                                updatePlayerAttribute('reputation', 5);
                                return "You maintain your defensive stance, letting Red Beard wear himself out completely. When he can barely lift his shield, you strike with precision, ending the match cleanly. Even the most skeptical warriors nod in respect at your tactical victory.<br><br>" +
                                       "Reputation +5";
                            } else {
                                return "You maintain your defensive stance, letting Red Beard wear himself out completely. When he can barely lift his shield, you strike with precision, ending the match cleanly. Even the most skeptical warriors nod in respect at your tactical victory.";
                            }
                        },
                        nextNode: 29, // Victory path
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('reputation', -3);
                            updatePlayerAttribute('health', -20);
                            updatePlayerAttribute('energy', -20);
                            
                            return "Your endurance finally gives out. As you struggle to catch your breath, Red Beard seizes the opportunity and delivers a finishing blow that sends you crashing to defeat...<br><br>" +
                                   "Reputation -3<br>" +
                                   "Health -20<br>" +
                                   "Energy -20";
                        },
                        nextNode: 52, // Defeat path
                    }
                }
            }
        ]
    },
    // Victory path after duel
    29: {
        text: "You walk back to the tavern with your head held high, and your reputation improved. You handled yourself like a true warrior. You find Erik in his room...",
        next: 53
    },
    53: {
        text: "Erik: \"If it isn't the champion of Vikstad himself!\"\n\nYou: \"...I just hope it was all worth it, did you get the loot?\"\n\nErik: *Shrugging and flashing you his characteristic scoundrel's half smile* \"Have I ever let you down before!?\"\n\nYou: \"...\" \"...\" \"...\"\n\nErik: \"All right, all right! Here, your share of the loot.\"",
        next: 30,
        onEnter: () => {
            // Add equipment to player inventory after successful duel
            addInventoryItem({
                name: "Sturdy Wooden Shield",
                description: "A well-made wooden shield reinforced with iron. It has seen some combat.",
                type: "armor",
                defense: 4,
                icon: "🛡️"
            });
            
            addInventoryItem({
                name: "Viking Seax",
                description: "A fine single-edged blade. Perfect for close combat.",
                type: "weapon",
                damage: 5,
                icon: "🗡️"
            });
        }
    },
    
    // Defeat path after duel
    52: {
        text: "You've made a proper fool of yourself, and have never been beaten so badly in your life... you limp back to the tavern, a bloodied mess... You find Erik in his room...",
        next: 54
    },
    54: {
        text: "Erik: \"...Odin's flaming eye... what happened to you back there!?\"\n\n*He tries to help you but you brush him off in anger*\n\nYou: \"...drop it Erik... just tell me you made out with the equipment.\"\n\nErik: \"...yea, about that...\"\n\nYou: \"...you have to be kidding me...\"\n\nErik: *with a strained laugh* \"Of course I am! Here, your share of the spoils!\"",
        next: 30,
        onEnter: () => {
            // Add basic equipment to player inventory after failed duel
            addInventoryItem({
                name: "Cracked Shield",
                description: "A shield that has seen better days, but still offers some protection.",
                type: "armor",
                defense: 2,
                icon: "🛡️"
            });
            
            addInventoryItem({
                name: "Rusty Seax",
                description: "A short, single-edged blade. It's seen better days, but it's better than nothing.",
                type: "weapon",
                damage: 3,
                icon: "🗡️"
            });
        }
    },
    666: {
        text: "You have died. Game Over.",
        end: true
    }
};