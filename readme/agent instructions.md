## Project Structure Overview - May 6, 2025

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
   - Core stats: strength, agility, endurance, coordination, weapon skill, health, energy, fatigue
   - Special stats: reputation, blackRaven/whiteRaven (moral alignment system)
   - Flag system for tracking gameplay choices and character backgrounds
   - Character leveling with experience points (100 XP per level)
   - Skill points gained on level-up (3 points per level)
   - Weapon mastery system for tracking proficiency with different weapon types

3. **Character Leveling System**
   - Players start at level 1
   - Each level requires 100 XP
   - Leveling up grants:
     - 3 skill points
     - +10 max health
     - +5 max energy
   - Experience can be gained from story events with `expReward` property
   - UI shows current level, XP progress, and available skill points

4. **Skill Tree System**
   - `skill-tree.js` - Main entry point for skill tree functionality
   - `skill-tree-data.js` - Defines all skill branches and individual skills
   - `skill-tree-manager.js` - Handles skill point application logic and prerequisites
   - `skill-tree-ui.js` - Renders the skill tree interface and connectors
   - Skills organized into branches (e.g., accuracy, defense, tactics)
   - Skills can have prerequisites and branch requirements
   - Branch tabs allow toggling between different skill specializations
   - Visual connections between prerequisite skills and their dependent skills
   - Tooltips show skill descriptions, requirements, and ranks
   - Skills can grant passive bonuses or unlock new combat abilities
   - UI dynamically reflects skill ranks, availability, and requirements
   - Layer-based rendering system allows connectors to appear behind skill nodes

5. **Weapon Mastery System**
   - Four weapon types: swords, maces, axes, polearms
   - Each weapon type has its own experience and level tracking
   - Defeating enemies grants experience to the equipped weapon's type
   - Each weapon type level requires 100 XP
   - Higher weapon mastery levels provide damage bonuses (+2 damage per level)
   - Damage bonuses apply automatically to all weapon abilities
   - UI displays weapon type levels and their current damage bonuses
   - Direct manipulation functions (`setWeaponLevel`) available for testing

6. **Game Initialization & Flow**
   - `game.js` - Contains the reusable initialization function for both first load and game restart
   - `initGameSystem()` - Handles proper story and game system initialization
   - Death is permanent - when player dies, they can begin a new saga from the start
   - Game over screen tracks achievements based on story progress

7. **Game Screens**
   - Multiple UI screens: cinematic, camp, battle, game over, simulator
   - `transitions.js` - Handles transitions between screens
   - `typewriter.js` - For narrative text effects

8. **Camp System**
   - `camp.js` - Camp activities and time management
   - Activities: training, rest, companions, travel, scavenging, crafting, medic
   - Each activity consumes time and provides different benefits
   - Can resume story nodes after completing camp activities

9. **Travel System**
   - `travel.js` - Manages travel locations, map UI, and story integration
   - Dynamically shows locations based on current chapter and story state
   - Locations unlock based on story progress (which nodes player has visited)
   - Each location links to a specific story node when selected

10. **Battle System**
   - `battle.js` - Handles combat encounters
   - Different battle types can be triggered from story nodes
   - Can resume story nodes after completing battles
   - Centralized hit chance calculation system:
     - Base hit chance (60%)
     - Attacker's weapon skill bonus (4% per point)
     - Defender's agility penalty (5% per point)
     - Defender's energy level (scaled by endurance)
     - Integrated with combat modifiers system
     - Defenses (defending reduces hit chance by 30%)
     - Global cap system (10% minimum, 95% maximum hit chance)
   - Weapon-based attack system with different abilities
   - Battle UI displays hit percentages and ability details
   - Enemy types with predefined stats and experience rewards
   - Upon victory, players earn weapon mastery experience based on enemy type

11. **Combat Modifiers System**
   - `combat-modifiers.js` - Modular system for combat calculations
   - Provides hooks for modifying damage, hit chance, and other combat values
   - Integrates with the skill tree to apply skill-based bonuses
   - Contextualized modifiers allow identifying source of combat bonuses

12. **Weapon System**
   - `weapons.js` - Defines weapons and their abilities
   - Modular weapon ability architecture:
     - Abilities have energy costs, damage multipliers, and hit chance modifiers
     - Weapons have base damage and weapon type that's used by abilities
     - Custom damage formulas can incorporate different player stats and mastery bonuses
     - Configurable damage multipliers stored in `DAMAGE_MULTIPLIERS` object
     - Interactive UI with tooltips showing damage calculations including mastery bonuses
     - Enhanced tooltips display all ability information on hover

13. **Battle Simulator**
   - `battle-simulator.js` - Testing environment for battle mechanics
   - Accessible from the start menu
   - Features for testing:
     - Character template selection (DEFAULT, WARRIOR, EXPLORER, SHIELDMAIDEN)
     - Individual stat adjustment via sliders
     - Weapon mastery level adjustment sliders
     - Dynamic damage multiplier adjustment sliders
     - Health and energy level customization
     - Enemy type selection
     - Direct access to battles with custom stats
   - Dynamic UI generation:
     - Damage multiplier controls are dynamically generated from `DAMAGE_MULTIPLIERS` object
     - Slider ranges and steps are intelligently determined from multiplier values
     - Reset functionality to restore default multiplier values

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
- `expReward` - Amount of experience points to award the player at this node

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

### Combat System Details:

1. **Hit Chance Calculation**
   - Centralized in the `calculateHitChance` function with consistent calculation
   - Base hit chance (60%)
   - Attacker's weapon skill adds 4% per point
   - Defender's agility subtracts 5% per point
   - Energy levels impact dodge chance: lower energy = easier to hit
   - Endurance amplifies energy's effect on dodge chance
   - Various actions modify hit chance (defending reduces chance to be hit by 30%)
   - Hit chance is capped between 10% minimum and 95% maximum
   - Similar approach for feint chance calculation using agility vs coordination

2. **Weapon Abilities**
   - Each weapon provides unique combat abilities
   - Abilities have different energy costs, damage calculations, and hit modifiers
   - Current abilities for rusty sword:
     - Thrust: Low energy (6), modest damage, +5% hit chance
     - Swing: Medium energy (9), agility-based damage bonus, -5% hit chance
   - Weapon mastery damage bonuses are automatically added to ability damage
   - Hover tooltips show complete ability information including mastery bonuses
   
3. **Feint System**
   - Success based on attacker's agility vs defender's coordination
   - Energy cost: 5 if successful, 10 if failed
   - Successful feint reduces enemy energy by 15
   - UI displays success chance percentage

4. **Enemy Types**
   - Predefined enemy types with unique stats and experience rewards
   - SAXON_SCOUT: Quick and agile, 50 XP reward
   - SAXON_DEFENDER: Durable and strong, 100 XP reward
   - SAXON_BERSERKER: Powerful and aggressive, 150 XP reward

5. **Combat UI**
   - Dynamic tooltips for ability details
   - Shows hit chances and damage calculations
   - Energy costs displayed with abilities
   - Weapon abilities appear when selecting "Attack"
   - Tooltips dynamically update to show weapon mastery bonuses

6. **Damage Multiplier System**
   - Configurable multipliers stored in `DAMAGE_MULTIPLIERS` object in weapons.js
   - Current multipliers:
     - WEAPON_SKILL_BONUS: How much weapon skill contributes to damage
     - AGILITY_SWING_BONUS: How much agility contributes to swing damage
     - BASE_THRUST_MULTIPLIER: Base multiplier for thrust damage
     - BASE_SWING_MULTIPLIER: Base multiplier for swing damage
   - Dynamically adjustable through battle simulator
   - Adding new multipliers to weapons.js automatically adds them to the simulator UI
