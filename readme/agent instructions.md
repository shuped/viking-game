## Project Structure Overview - April 24, 2025

This Viking game is a narrative-driven game with RPG elements. Here's a breakdown of the key components:

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
- `battleType` - For battle transitions, the type of battle to initialize
- `requiredNode` - For travel locations, the story node that must be visited to unlock

### Travel Location Structure:

Travel destinations are organized by chapter with properties:
```
{
    id: 'locationId',
    name: 'Location Name',
    description: 'Description of the location.',
    requiredNode: 5, // Story node that must be visited to unlock
    storyNode: 25,   // Target story node when selected
    position: { x: 30, y: 20 } // % position on map
}
```

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

### Recent Implementation: Travel System

The events camp option was replaced with a travel system that:
- Shows a map with clickable locations
- Dynamically displays available destinations based on story progress
- Transitions to appropriate story nodes when locations are selected
- Provides a tooltip with location details on hover
- Creates a framework for adding new locations as the story progresses

This travel system enables a more open-world feeling while still maintaining the narrative structure of the game.

Added new properties to story nodes in chapter-one.js:
- Added `transitionTo: 'battle'` and `battleType: 'first'` to node 10
- Added `transitionTo: 'camp'` to node 18
- Added `transitionTo: 'battle'` and `battleType: 'second'` to node 21

Updated story.js to use the new properties:
- Modified `setupStoryListeners` function to check for the `transitionTo` property
- Used the `transitionTo` value to determine which screen to transition to
- For battle transitions, used the `battleType` property to determine which battle to initialize
