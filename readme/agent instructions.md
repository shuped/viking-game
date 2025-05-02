## Project Structure Overview - May 2, 2025

This Viking game is a narrative-driven game with RPG elements. Here's a breakdown of the key components:

### Design Patterns:

1. **Story State Management**
   - Story progress is tracked through visited nodes and completed choices
   - Story chapters are dynamically loaded when needed
   - Scene transitions can now resume from specific story nodes

2. **Dynamic UI Elements**
   - UI elements change based on game state and player progress
   - Travel map shows available locations based on story progress

3. **Time as a Resource**
   - Camp activities consume time units (default: 5 units per camp visit)
   - Players must manage time effectively for optimal character development

### Core Systems:

1. **Story System**
   - `story.js` - Main story engine with display functions and navigation
     - Handles screen transitions with resumable story nodes
     - Provides `proceedWithNextMainNode()` function to resume story after transitions
   - `story/story-manager.js` - Manages chapter loading and transitions
   - `story/story-state.js` - Tracks player progress through story nodes and scene transitions
   - `story/prologue.js`, `story/chapter-one.js` - Story content for each chapter

2. **Player State**
   - `player.js` - Manages character attributes, inventory, and reputation
   - Encapsulated design with private state and public getters/setters
   - Character types with stat bundles: WARRIOR, EXPLORER, SHIELDMAIDEN, DEFAULT
   - Core stats: strength, agility, intelligence, charisma, health, energy, fatigue
   - Special stats: reputation, blackRaven/whiteRaven (moral alignment system)
   - Flag system for tracking gameplay choices and character backgrounds

3. **Game Initialization & Flow**
   - `game.js` - Contains the reusable initialization function for both first load and game restart
   - `initGameSystem()` - Handles proper story and game system initialization
   - Death is permanent - when player dies, they can begin a new saga from the start
   - Game over screen tracks achievements based on story progress

4. **Game Screens**
   - Multiple UI screens: cinematic, camp, battle, game over
   - `transitions.js` - Handles transitions between screens
   - `typewriter.js` - For narrative text effects

5. **Camp System**
   - `camp.js` - Camp activities and time management
   - Activities: training, rest, companions, travel, scavenging, crafting, medic
   - Each activity consumes time and provides different benefits
   - Can resume story nodes after completing camp activities

6. **Travel System**
   - `travel.js` - Manages travel locations, map UI, and story integration
   - Dynamically shows locations based on current chapter and story state
   - Locations unlock based on story progress (which nodes player has visited)
   - Each location links to a specific story node when selected

7. **Battle System**
   - `battle.js` - Handles combat encounters
   - Different battle types can be triggered from story nodes
   - Can resume story nodes after completing battles

### Story Node Structure:

Story nodes can have these key properties:
- `text` - The narrative text to display
- `choices` - Optional array of player choices
- `next` - ID of the next story node
- `end` - Boolean indicating if this is a chapter end
- `nextChapter` - The next chapter to transition to
- `transitionTo` - Type of screen transition, can be either:
  - Simple string format: `'camp'`, `'battle'`, `'gameOver'`
  - Object format for resumable transitions: `{ scene: 'camp', next: 38 }`
- `deathCause` - Used with gameOver transition to describe player's death

### Scene Transition System:

The game supports a resumable transition system that allows story nodes to continue after special scenes:

1. **Transition State Management**
   - `story-state.js` tracks the next story node for each scene type
   - Uses `nextNodeAfterTransition` object to store node IDs by scene type
   - Provides methods to get/set next nodes for transitions

2. **Transition Flow**
   - Story nodes can specify a next node ID in their transition: `transitionTo: { scene: 'camp', next: 38 }`
   - `handleScreenTransition()` stores this node ID before transitioning to the scene
   - Special scenes (camp, battle) can call `proceedWithNextMainNode('camp', screens)` to resume
   - System returns to story mode and continues from the specified node
