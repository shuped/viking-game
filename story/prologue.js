// Prologue story nodes
import { updatePlayerAttribute, addInventoryItem } from '../player.js';
import { displayStatChange } from '../story.js';

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
                nextNode: 25,
                onSelect: (success = true) => {
                    updatePlayerAttribute('reputation', 2);
                    updatePlayerAttribute('fatigue', 5);
                    
                    return "You challenge their strongest warrior to a duel.<br><br>" +
                           "Reputation +2<br>" +
                           "Fatigue +5";
                },
                statCheck: {
                    stat: "strength",
                    threshold: 7,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('reputation', 3);
                            updatePlayerAttribute('strength', 1);
                            
                            return "Your impressive strength wins the duel!<br><br>" +
                                   "Reputation +3<br>" +
                                   "Strength +1";
                        }
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('reputation', -1);
                            updatePlayerAttribute('health', -10);
                            
                            return "You lose the duel and take a beating.<br><br>" +
                                   "Reputation -1<br>" +
                                   "Health -10";
                        }
                    }
                }
            },
            { 
                text: "Regale them with a gripping story", 
                nextNode: 26,
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
                        }
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('reputation', -2);
                            
                            return "Your story falls flat and the warriors mock you.<br><br>" +
                                   "Reputation -2";
                        }
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
    
    // DUEL COMBAT
    25: {
        text: "Puffing out your chest and squaring your shoulders you look from man to man, \"Who among you is the strongest?\" A tall Viking with an elaborately braided red beard steps towards you with a hearty chuckle... moments later the stage is set for a proper duel, wooden swords and old shields will be used.",
        next: 28
    },
    28: {
        text: "DUEL (Choose your approach):",
        choices: [
            { 
                text: "STR - Rely on your strength to overpower the Red Beard", 
                nextNode: 29,
                statCheck: {
                    stat: "strength",
                    threshold: 8,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('strength', 1);
                            updatePlayerAttribute('reputation', 3);
                            updatePlayerAttribute('health', -5);
                            
                            return "You overpower the Red Beard with your impressive strength!<br><br>" +
                                   "Strength +1<br>" +
                                   "Reputation +3<br>" +
                                   "Health -5";
                        }
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('health', -20);
                            updatePlayerAttribute('energy', -15);
                            updatePlayerAttribute('reputation', -2);
                            
                            return "The Red Beard proves too strong for you.<br><br>" +
                                   "Health -20<br>" +
                                   "Energy -15<br>" +
                                   "Reputation -2";
                        }
                    }
                }
            },
            { 
                text: "AGI - Focus on dexterity and quick attacks to overwhelm your foe", 
                nextNode: 29,
                statCheck: {
                    stat: "agility",
                    threshold: 7,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('agility', 1);
                            updatePlayerAttribute('reputation', 2);
                            updatePlayerAttribute('energy', -10);
                            
                            return "Your quick movements and attacks leave the Red Beard struggling to keep up!<br><br>" +
                                   "Agility +1<br>" +
                                   "Reputation +2<br>" +
                                   "Energy -10";
                        }
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('health', -15);
                            updatePlayerAttribute('energy', -20);
                            
                            return "Your agility isn't enough - the Red Beard anticipates your movements.<br><br>" +
                                   "Health -15<br>" +
                                   "Energy -20";
                        }
                    }
                }
            },
            { 
                text: "END - Exhaust your opponent, focusing on dodging and defense", 
                nextNode: 29,
                onSelect: (success = true) => {
                    updatePlayerAttribute('energy', -15);
                    
                    return "You focus on defensive maneuvers, trying to exhaust your opponent.<br><br>" +
                           "Energy -15";
                },
                statCheck: {
                    stat: "agility",
                    threshold: 6,
                    success: {
                        onSelect: () => {
                            updatePlayerAttribute('energy', -5);
                            updatePlayerAttribute('reputation', 1);
                            updatePlayerAttribute('agility', 1);
                            
                            return "Your endurance strategy works! The Red Beard tires out before you do.<br><br>" +
                                   "Energy -5<br>" +
                                   "Reputation +1<br>" +
                                   "Agility +1";
                        }
                    },
                    failure: {
                        onSelect: () => {
                            updatePlayerAttribute('health', -10);
                            updatePlayerAttribute('energy', -10);
                            
                            return "Your endurance fails you. The Red Beard outlasts your defensive efforts.<br><br>" +
                                   "Health -10<br>" +
                                   "Energy -10";
                        }
                    }
                }
            }
        ]
    },
    
    // At node 29, give the player a weapon for completing Erik's quest
    29: {
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
};