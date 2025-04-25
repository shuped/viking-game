# Agent Instructions

## Story System Refactoring Notes - April 24, 2025

The story system has been refactored to use explicit transition properties instead of hard-coded node IDs. This makes the system more flexible and easier to maintain.

### Changes Made:

1. **Added new properties to story nodes in chapter-one.js**:
   - Added `transitionTo: 'battle'` and `battleType: 'first'` to node 10
   - Added `transitionTo: 'camp'` to node 18
   - Added `transitionTo: 'battle'` and `battleType: 'second'` to node 21

2. **Updated story.js to use the new properties**:
   - Modified `setupStoryListeners` function to check for the `transitionTo` property
   - Used the `transitionTo` value to determine which screen to transition to
   - For battle transitions, used the `battleType` property to determine which battle to initialize

### Benefits:

- **More maintainable**: Transitions are defined in the story nodes themselves
- **More flexible**: New transition types can be easily added in the future
- **Self-documenting**: Story nodes clearly indicate when they trigger a transition

### Future Improvements:

- Consider adding more transition types (e.g., to new game modes or screens)
- Look for other hard-coded values that could be refactored in a similar way
- Potentially implement a more sophisticated state machine for complex story flows

Remember that when adding new story nodes with transitions, you need to include the appropriate `transitionTo` property and any additional properties needed for that specific transition (like `battleType` for battles).