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

## Character Management System - April 26, 2025

We've implemented a character management screen that allows players to view their character stats, resources, reputation, and inventory at any time during gameplay.

### Key Components:

1. **Global Access Button**
   - A persistent character button appears in the top-left corner of all game screens
   - Clicking this button opens the character screen overlay while preserving the current game state
   - When closing the character screen, the game returns to the previous screen

2. **UI Architecture Considerations**
   - Character screen uses z-index management to appear above other UI elements (z-index: 1001)
   - Screen transitions properly store/restore the previous active screen
   - Automatic closing of any open modals (e.g., camp activity modals) when opening character screen
   - Explicit display and visibility properties ensure consistent rendering across all contexts

3. **Character Stats Display**
   - Core attributes: strength, agility, intelligence, charisma (displayed as stat bars)
   - Resources: health, energy, fatigue (displayed as resource bars with current/max values)
   - Reputation system: White Raven and Black Raven levels with visual representation
   - Inventory: grid-based display of collected items with tooltips for descriptions

4. **Data Integration**
   - Character screen reads directly from the player state in player.js
   - UI updates automatically when the character screen is opened
   - Other modules can trigger UI updates with refreshCharacterUI() function
   - Robust error handling prevents UI glitches when player state changes

### Implementation Best Practices:

1. **Screen Transitions**: When implementing new UI screens that need to interact with the character screen, ensure proper z-index management and screen state preservation.

2. **Modal Management**: Always close any active modals when transitioning between screens to prevent UI conflicts.

3. **Error Handling**: Include robust error checking when updating UI elements to prevent null reference errors.

4. **Specific Selectors**: Use specific DOM selectors when working with complex UI structures to ensure the correct elements are updated.

5. **Consistent Styling**: Follow the established visual language with border images, color schemes, and layout patterns.

The character management system provides players with clear feedback on their character's development throughout the game, making progression more tangible and rewarding.

## Stat Change Display System - April 27, 2025

We've implemented an improved system for displaying character stat changes directly within the story text flow instead of using floating notifications. This creates a more integrated narrative experience.

### Key Components:

1. **Integrated Stat Change Display**
   - Stat changes appear in gray text directly within the story text box
   - Players must click to acknowledge stat changes before continuing to the next story node
   - Creates a more cohesive storytelling experience by embedding character development in the narrative

2. **OnSelect Return Pattern**
   - All `onSelect` callback functions now return a string with formatted stat change text
   - This string is displayed in the story text box after the player makes a choice
   - Format: `"You chose [choice]. [reason/outcome]<br><br>[stat] +/-[value]<br>[stat] +/-[value]"`

3. **Event Handling System**
   - Global flag `isDisplayingStatChanges` prevents conflicts between multiple click handlers
   - Custom click handler management using `_clickHandler` property for clean tracking and removal
   - Small delay (300ms) before registering click handler prevents accidental immediate clicks

4. **Display Flow Control**
   - The `displayStatChangeText` function manages the display and continuation flow
   - Story won't advance until player explicitly clicks after seeing stat changes
   - Clean event handler management prevents race conditions and handler conflicts

### Implementation Best Practices:

1. **Return Strings from onSelect**: Always have `onSelect` functions return a formatted string with stat changes rather than calling `displayStatChange` directly.

2. **Descriptive Messages**: Include a brief narrative explanation of why stats changed, not just the raw numbers.

3. **Consistent Formatting**: Use HTML breaks (`<br>`) for formatting the stat change text with proper spacing.

4. **Flag Management**: The `isDisplayingStatChanges` flag must be properly set and cleared to ensure proper event handling.

5. **Event Handler Cleanup**: Always remove event listeners when they're no longer needed to prevent memory leaks.

This stat change display system improves narrative immersion by integrating character development directly into the story flow, making player choices feel more impactful and meaningful.
