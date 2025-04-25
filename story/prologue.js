// Prologue story nodes
export const storyNodes = {
    // INTRO SECTION
    0: {
        text: "Welcome to the Tale of Two Ravens...\nThis adventure is set in quasi-historical fictional universe based on the Viking Age... Death is Permanent, and every decision matters... how your tale unfolds is up to you...\n... and the will of the gods...",
        next: 1
    },
    1: {
        text: "You are...",
        choices: [
            { text: "Bjorn, a mighty warrior", nextNode: 2 },
            { text: "Leif, a clever explorer", nextNode: 2 },
            { text: "Freya, a fierce shieldmaiden", nextNode: 2 }
        ]
    },
    2: {
        text: "Tonight is the eve of your eighteenth birthday... As you close your eyes and drift to sleep you find yourself reflecting on your life until now... You wonder why the gods saw fit you should be born into a family of...",
        choices: [
            { text: "Poor farmers", nextNode: 3 },
            { text: "Modest Fisherfolk", nextNode: 3 },
            { text: "Comfortable Craftsmen", nextNode: 3 }
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
            { text: "Choose the Left White Raven path", nextNode: 6 },
            { text: "Choose the Right Black Raven path", nextNode: 6 }
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
            { text: "Agree to help Erik 'acquire' the needed gear", nextNode: 18 },
            { text: "Disagree and find an honest way to get gear", nextNode: 19 }
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
            { text: "Challenge their strongest warrior to a duel", nextNode: 25 },
            { text: "Regale them with a gripping story", nextNode: 26 },
            { text: "Insult their mothers... and prepare to run for your life", nextNode: 27 }
        ]
    },
    
    // DUEL PATH
    25: {
        text: "Puffing out your chest and squaring your shoulders you look from man to man, \"Who among you is the strongest?\" A tall Viking with an elaborately braided red beard steps towards you with a hearty chuckle... moments later the stage is set for a proper duel, wooden swords and old shields will be used.",
        next: 28
    },
    
    // STORYTELLING PATH
    26: {
        text: "The Vikings gather around you, mesmerized by your vivid recounting of one of Vikstad local legends. While you hold their attention, you notice Erik slipping quietly around the edges of the group, up to something in the background.",
        next: 29
    },
    
    // INSULT PATH
    27: {
        text: "The Vikings waste no time, chasing you with murderous intent across the field and into the woods... It seems for a moment like you might be done for, but you run like the wind... They at last give up the chase... you just hope you won't run into them again before you set sail tomorrow...",
        next: 29
    },
    
    // DUEL COMBAT
    28: {
        text: "DUEL (Choose your approach):",
        choices: [
            { text: "STR - Rely on your strength to overpower the Red Beard", nextNode: 29 },
            { text: "AGI - Focus on dexterity and quick attacks to overwhelm your foe", nextNode: 29 },
            { text: "END - Exhaust your opponent, focusing on dodging and defense", nextNode: 29 }
        ]
    },

    // SUCCESS OUTCOME (ALL PATHS LEAD HERE)
    29: {
        text: "You walk back to the tavern with your head held high. You find Erik in his room...\n\nErik: \"If it isn't the champion of Vikstad himself!\"\nYou: \"...I just hope it was all worth it, did you get the loot?\"\nErik: *Shrugging and flashing you his characteristic scoundrel's half smile* \"Have I ever let you down before!?\"\nYou: \"...\" \"...\" \"...\"\nErik: \"All right, all right! Here, your share of the loot.\"",
        next: 30
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