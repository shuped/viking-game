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
            { text: "Agility Check Success: Deftly avoid the incoming attack", nextNode: 40 },
            { text: "Agility Check Failure: Fail to react in time", nextNode: 41 }
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
            { text: "Battle: Victory", nextNode: 43 },
            { text: "Battle: Death", nextNode: 44 }
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
        text: "The townsman fights with unexpected ferocity, his desperate need to protect his children lending him strength. His axe finds a vital spot, and you collapse to the floor. As darkness claims you, the last thing you see is the man gathering his children and fleeing the house. Your saga ends here...",
        end: true
    },
    45: {
        text: "You lower your weapon and back away from the children, gesturing toward the door. They remain frozen in fear, unsure of your intentions. After a few tense moments, you simply turn and leave, allowing them to live. As you exit, you feel as though a White Raven watches with approval.",
        next: 49
    },
    46: {
        text: "You reach into your pouch and pull out a few coins, placing them on a nearby table. It's not much, but it might help them survive in the chaos to come. The children stare at you with confusion and lingering terror as you back away and leave the house. You feel a strange sense of peace, as if a White Raven nods in approval at your rare act of mercy.",
        next: 49
    },
    47: {
        text: "You grab the children by their arms, ignoring their terrified cries as you drag them outside. Other warriors nod approvingly at your capture - young slaves fetch a good price. As you hand them off to be secured with the other captives, you feel a dark satisfaction, as if a Black Raven's wings brush against your soul.",
        next: 49
    },
    48: {
        text: "You approach the cowering children, your weapon raised. Their cries are short-lived. As you leave the house, you feel a cold certainty in your actions - no witnesses, no problems. The shadow of a Black Raven seems to follow you approvingly as you rejoin your fellow warriors.",
        next: 49
    },
    49: {
        text: "You return to the chaotic streets of the town, the encounter in the house still fresh in your mind. Time has passed, and the initial frenzy of the raid has begun to settle into methodical plundering.",
        next: 30
    },
    50: {
        text: "You wander aimlessly through the carnage-ridden street looking for anything that might be valuable...",
        choices: [
            { text: "Check fails: You waste time searching", nextNode: 51 },
            { text: "Critical fail: You injure yourself while searching", nextNode: 52 },
            { text: "Check passes: Your search is successful", nextNode: 53 }
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
            { text: "Battle: Victory", nextNode: 58 },
            { text: "Battle: Death", nextNode: 59 }
        ]
    },
    58: {
        text: "The Viking leader falls before your superior combat skills. Blood pools around his body as you turn to face his companions. The other two look at you, then at each other... their resolve weakening. Your reputation increases among those who value strength above all.",
        choices: [
            { text: "Tell them to leave or suffer the same fate", nextNode: 60 }
        ]
    },
    59: {
        text: "Despite your bravery, the Viking proves to be the better warrior. His blade finds a gap in your defense, and you fall to the ground as life drains from your body. The peasants' fate is sealed, and your saga ends here...",
        end: true
    },
    60: {
        text: "You stand over the body of their leader, your weapon still wet with his blood. 'Leave now,' you growl at the remaining Vikings, 'or join him.'",
        choices: [
            { text: "They refuse and attack (Rep Check: FAIL)", nextNode: 61 },
            { text: "They back down and leave (Rep Check: SUCCESS)", nextNode: 64 }
        ]
    },
    61: {
        text: "The Vikings refuse to back down, emboldened by their numbers. They release the peasants and rush toward you, weapons raised. Unexpectedly, the peasants seize the opportunity, grabbing their pitchforks and joining your side against the two remaining Vikings.",
        choices: [
            { text: "Battle: Victory", nextNode: 62 },
            { text: "Battle: Death", nextNode: 63 }
        ]
    },
    62: {
        text: "Together with the peasants, you manage to defeat the remaining Vikings. As the last one falls, the peasants look at you with a mixture of fear, confusion, and gratitude. They clearly didn't expect to be saved by one of the raiders.",
        choices: [
            { text: "Nod to the grateful peasants wordlessly and take your leave (+White Raven)", nextNode: 65 },
            { text: "Slaughter the peasants, looting them and the fallen Vikings (+Black Raven/+Loot)", nextNode: 66 }
        ]
    },
    63: {
        text: "Despite the aid of the peasants, the Vikings prove too skilled. A blade slides between your ribs, and you collapse to the ground. The peasants scatter as you fall, and darkness claims you. Your saga ends here...",
        end: true
    },
    64: {
        text: "The Vikings grumble under their breath, but your victory over their leader has made an impression. They back away slowly before turning to seek easier targets elsewhere. The peasants stare at you in disbelief, unsure whether to flee or thank you.",
        choices: [
            { text: "Nod to the grateful peasants wordlessly and take your leave (+White Raven)", nextNode: 65 },
            { text: "Slaughter the peasants, looting them and the fallen Vikings (+Black Raven/+Loot)", nextNode: 66 }
        ]
    },
    65: {
        text: "You give the peasants a simple nod and turn to leave, ignoring their whispered thanks. As you walk away, you feel a strange sensation, as if a White Raven watches your act of mercy with approval. The peasants will live to see another day because of your intervention.",
        next: 54
    },
    66: {
        text: "You consider the peasants for a moment, then make your decision. They have no place in the new world your people are creating here. Your blade makes quick work of them, and afterward, you loot both their bodies and those of the fallen Vikings. As you walk away with your spoils, you feel as though a Black Raven's shadow passes over you approvingly.",
        next: 54
    }
};