// Typewriter effect for text display
let typewriterActive = false;
let typewriterCancel = false;
let typewriterComplete = false;
let typewriterPromise = null;

// Function to cancel any active typewriter effect
export const cancelTypewriter = () => {
    if (typewriterActive) {
        typewriterCancel = true;
        return new Promise(resolve => {
            // Wait for the cancellation to be processed
            const checkCancelled = () => {
                if (!typewriterActive) {
                    resolve();
                } else {
                    setTimeout(checkCancelled, 10);
                }
            };
            checkCancelled();
        });
    }
    return Promise.resolve();
};

// Function to complete the typewriter effect immediately
export const completeTypewriter = () => {
    if (typewriterActive) {
        typewriterComplete = true;
        return new Promise(resolve => {
            // Wait for the completion to be processed
            const checkCompleted = () => {
                if (!typewriterActive) {
                    resolve();
                } else {
                    setTimeout(checkCompleted, 10);
                }
            };
            checkCompleted();
        });
    }
    return Promise.resolve();
};

// The main typewriter effect function
function typewriterEffect(element, text, speed = 1) {
    // If there's already a typewriter effect running, cancel it first
    if (typewriterActive) {
        return cancelTypewriter().then(() => typewriterEffect(element, text, speed));
    }
    
    // Reset all state flags
    typewriterCancel = false;
    typewriterComplete = false;
    typewriterActive = true;
    
    // Clear the element
    element.innerHTML = '';
    
    // Store a reference to this promise
    typewriterPromise = new Promise(resolve => {
        let i = 0;
        
        function typeNextChar() {
            // Handle cancellation
            if (typewriterCancel) {
                typewriterActive = false;
                resolve();
                return;
            }
            
            // Handle immediate completion
            if (typewriterComplete) {
                element.innerHTML = text;
                typewriterActive = false;
                
                // Add click indicator
                addClickIndicator();
                
                resolve();
                return;
            }
            
            // Normal typing behavior
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeNextChar, speed);
            } else {
                // Typing finished naturally
                typewriterActive = false;
                
                // Add click indicator
                addClickIndicator();
                
                resolve();
            }
        }
        
        // Start the typing process
        typeNextChar();
    });
    
    return typewriterPromise;
}

// Helper function to add the click indicator
function addClickIndicator() {
    const textBox = document.getElementById('cinematic-text-box');
    if (!document.querySelector('.click-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'click-indicator';
        indicator.textContent = 'Click to continue...';
        textBox.appendChild(indicator);
    }
}

// Export the necessary functions and state
export { typewriterEffect, typewriterActive };
