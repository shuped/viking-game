// Typewriter effect for text display
let typewriterActive = false;
let typewriterCancel = false;

export const cancelTypewriter = () => typewriterCancel = true;

function typewriterEffect(element, text, speed = 1) {
    // If there's already a typewriter effect running, cancel it
    if (typewriterActive) {
        typewriterCancel = true;
        // Give a small delay to ensure the previous typewriter is properly stopped
        return new Promise(resolve => {
            setTimeout(() => {
                typewriterCancel = false;
                return typewriterEffect(element, text, speed).then(resolve);
            }, speed);
        });
    }

    element.innerHTML = '';
    let i = 0;
    typewriterActive = true;
    typewriterCancel = false;
    
    return new Promise(resolve => {
        function typeNextChar() {
            if (typewriterCancel) {
                typewriterActive = false;
                resolve();
                return;
            }

            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeNextChar, speed);
            } else {
                typewriterActive = false;
                resolve();
                // Add click indicator after text is fully typed
                const textBox = document.getElementById('cinematic-text-box');
                if (!document.querySelector('.click-indicator')) {
                    const indicator = document.createElement('div');
                    indicator.className = 'click-indicator';
                    indicator.textContent = 'Click to continue...';
                    textBox.appendChild(indicator);
                }
            }
        }
        typeNextChar();
    });
}

export { typewriterEffect, typewriterActive, typewriterCancel };
