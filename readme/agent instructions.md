## Project Structure Overview - April 24, 2025

This Viking game is a narrative-driven game with RPG elements. Here's a breakdown of the key components:

### Design Patterns:

1. **Story State Management**
   - Story progress is tracked through visited nodes and completed choices
   - Story chapters are dynamically loaded when needed

2. **Dynamic UI Elements**
   - UI elements change based on game state and player progress
   - Travel map shows available locations based on story progress

3. **Time as a Resource**
   - Camp activities consume time units (default: 5 units per camp visit)
   - Players must manage time effectively for optimal character development

### Core Systems:

1. **Story System**
   - `story.js` - Main story engine with display functions and navigation
   - `story/story-manager.js` - Manages chapter loading and transitions
   - `story/story-state.js` - Tracks player progress through story nodes
   - `story/prologue.js`, `story/chapter-one.js` - Story content for each chapter

2. **Player State**
   - `player.js` - Manages character attributes, inventory, and reputation
   - Stats include: strength, agility, intelligence, charisma, health, energy, fatigue
   - Special stats: reputation, blackRaven/whiteRaven (likely moral alignment system)

3. **Game Screens**
   - Multiple UI screens: cinematic, camp, battle
   - `transitions.js` - Handles transitions between screens
   - `typewriter.js` - For narrative text effects

4. **Camp System**
   - `camp.js` - Camp activities and time management
   - Activities: training, rest, companions, travel, scavenging, crafting, medic
   - Each activity consumes time and provides different benefits

5. **Travel System**
   - `travel.js` - Manages travel locations, map UI, and story integration
   - Dynamically shows locations based on current chapter and story state
   - Locations unlock based on story progress (which nodes player has visited)
   - Each location links to a specific story node when selected

6. **Battle System**
   - `battle.js` - Handles combat encounters
   - Different battle types can be triggered from story nodes

### Story Node Structure:

Story nodes can have these key properties:
- `text` - The narrative text to display
- `choices` - Optional array of player choices
- `next` - ID of the next story node
- `end` - Boolean indicating if this is a chapter end
- `nextChapter` - The next chapter to transition to
- `transitionTo` - Type of screen transition ('camp', 'battle', etc.)
# Agent Instructions

## Travel System Implementation - April 26, 2025

We've replaced the "Events" camp option with a dynamic travel system that enables players to explore story locations based on their choices and progress.

### Key Components:

1. **Dynamic Travel Locations**
   - Locations appear/disappear based on story progress and player choices
   - `isAvailable()` functions determine when locations are accessible
   - Each location connects to a specific story node when selected

2. **Story Integration**
   - Travel locations can start quest lines that return to camp when completed
   - Story nodes can have a `transitionTo: 'camp'` property to return to camp UI
   - Story nodes can have a `travelReturn: true` flag to indicate travel-based storylines

3. **State Management**
   - Using `storyState.hasVisited(nodeId)` to check if a story node has been visited
   - Using `storyState.hasCompletedChoice(nodeId, choiceIndex)` to check player choices
   - Combining conditions for complex availability logic (e.g., available after a choice but unavailable after visiting)

### Implementation Examples:

#### 1. Basic Location with Simple Condition:
```javascript
{
    id: 'town-square',
    name: 'Víkstad Town Square',
    description: 'The bustling center of Víkstad where warriors gather.',
    isAvailable: () => storyState.hasVisited(12), // Available after visiting node 12
    storyNode: 13,
    position: { x: 40, y: 60 }
}
```

#### 2. Location with Complex Conditions:
```javascript
{
    id: 'training-grounds',
    name: 'Training Grounds',
    description: 'Where warriors practice their combat skills.',
    // Only available if player chose to help Erik AND hasn't visited yet
    isAvailable: () => storyState.hasCompletedChoice(17, 0) && !storyState.hasVisited(20),
    storyNode: 20,
    position: { x: 20, y: 80 }
}
```

#### 3. Story Node Setup for Travel:
```javascript
18: {
    text: "Erik's eyes gleam with approval. \"Meet me at the training grounds later.\"",
    transitionTo: 'camp' // Returns to camp after this node
}
```

### Best Practices:

1. **Use isAvailable Functions**: Always use `isAvailable` functions for determining location availability rather than hardcoded rules.

2. **One-Time Locations**: For quest locations that should only be visited once, include `!storyState.hasVisited(nodeId)` in the availability check.

3. **Choice-Based Locations**: Use `storyState.hasCompletedChoice(nodeId, choiceIndex)` to unlock locations based on player choices.

4. **Camp Transitions**: Add `transitionTo: 'camp'` to story nodes that should return to the camp UI.

5. **Debugging**: The storyState object is exposed as window.storystate for debugging in the browser console.

This travel system creates a more dynamic and immersive game experience by allowing players to make meaningful choices about where to go, when to pursue storylines, and enabling non-linear progression through the game's narrative.
