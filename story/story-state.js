// Story state tracking
export const storyState = {
    visitedNodes: new Set(),
    completedChoices: new Set(),
    
    // Mark a node as visited
    visitNode(nodeId) {
        this.visitedNodes.add(nodeId);
    },
    
    // Check if a node has been visited
    hasVisited(nodeId) {
        return this.visitedNodes.has(nodeId);
    },
    
    // Mark a specific choice as completed
    completeChoice(nodeId, choiceIndex) {
        this.completedChoices.add(`${nodeId}-${choiceIndex}`);
    },
    
    // Check if a specific choice has been completed
    hasCompletedChoice(nodeId, choiceIndex) {
        return this.completedChoices.has(`${nodeId}-${choiceIndex}`);
    }
};