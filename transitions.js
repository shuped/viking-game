// Transition between screens
function transitionToScreen(fromScreen, toScreen, callback) {
    const overlay = document.getElementById('black-overlay');
    
    // First phase: Fade to black completely
    overlay.classList.add('active');
    
    // Wait for the overlay to become completely black (overlay transition duration)
    setTimeout(() => {
        // Hide all screens initially during the completely black phase
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.visibility = 'hidden';
        });
        
        // Now that the overlay is fully black, switch the active screens
        fromScreen.classList.remove('active');
        toScreen.classList.add('active');
        
        // Short delay to ensure DOM updates
        setTimeout(() => {
            // Make the active screen visible again while still behind black overlay
            toScreen.style.visibility = 'visible';
            
            // Begin fade-out transition
            overlay.classList.remove('active');
            
            // Wait for overlay to fade out completely before executing callback
            setTimeout(() => {
                if (typeof callback === 'function') {
                    callback();
                }
            }, 1000); // Time for the overlay to fade out
        }, 50); // Small delay for DOM updates
    }, 1000); // Time for the overlay to fade to black
}

export { transitionToScreen };
