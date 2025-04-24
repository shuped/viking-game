// Prologue story nodes
export const storyNodes = {
    0: {
        text: "Far to the north, in a land of ice and snow, your saga begins...",
        next: 1
    },
    1: {
        text: "Born to a small coastal village, you grew up hearing tales of warriors and their glorious raids across the seas.",
        next: 2
    },
    2: {
        text: "What kind of child were you?",
        choices: [
            { text: "Strong and eager to fight", nextNode: 3 },
            { text: "Curious and observant", nextNode: 4 }
        ]
    },
    3: {
        text: "From an early age, you showed promise with weapons. The village elders nodded approvingly as you sparred with other children, always emerging victorious.",
        next: 5
    },
    4: {
        text: "While others trained with weapons, you watched the horizon. You noted the patterns of stars, the movements of birds, and listened to the whispers of the waves.",
        next: 5
    },
    5: {
        text: "Years passed, and now you stand as a young warrior ready to join your first raid. The time has come to prove yourself.",
        next: 6
    },
    6: {
        text: "As you board the longship, an old man approaches you. His single eye gleams with ancient wisdom. 'The ravens watch your path,' he mutters before disappearing into the crowd.",
        next: 7
    },
    7: {
        text: "The journey begins. Wind fills the sail as your village shrinks behind you. What lies across the sea? Glory? Death? Perhaps both.",
        next: 8
    },
    8: {
        text: "After many days at sea, fever takes hold of you. Strange visions plague your dreams...",
        next: 9
    },
    9: {
        text: "The prologue of your story ends here, but your true journey is just beginning...",
        end: true,
        nextChapter: "chapter-one"  // This tells the story system to load chapter-one next
    }
};