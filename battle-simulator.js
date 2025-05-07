// Battle Simulator - For testing battle mechanics
import { playerState, setPlayerAttribute, setWeaponLevel, STAT_BUNDLES } from './player.js';
import { screens } from './main.js';
import { transitionToScreen } from './transitions.js';
import { initBattle } from './battle.js';
import { DAMAGE_MULTIPLIERS } from './weapons.js';

// Stats that can be adjusted in simulator
const ADJUSTABLE_STATS = [
    'strength',
    'agility',
    'endurance',
    'coordination',
    'vitality',
    'weaponSkill',
    'health',
    'maxHealth',
    'energy',
    'maxEnergy'
];

// Weapon types for mastery level adjustment
const WEAPON_TYPES = [
    'sword',
    'mace',
    'axe',
    'polearm'
];

// Function to generate slider config from the multiplier key
function getMultiplierConfig(key, value) {
    // Generate a human-readable label from the key
    const label = key.split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
    
    // Set sensible min/max/step based on the value
    let min, max, step;
    
    if (value <= 0.1) {
        min = 0;
        max = 0.5;
        step = 0.01;
    } else if (value <= 0.5) {
        min = 0;
        max = 1;
        step = 0.05;
    } else if (value <= 1) {
        min = 0.1;
        max = 2;
        step = 0.1;
    } else {
        min = 0.5;
        max = Math.max(5, value * 2);
        step = 0.1;
    }
    
    // Generate a description based on the key
    let description;
    if (key.includes('BONUS')) {
        description = `How much this stat contributes to damage`;
    } else if (key.includes('MULTIPLIER')) {
        description = `Base multiplier for damage calculation`;
    } else {
        description = `Damage adjustment parameter`;
    }
    
    return {
        min,
        max,
        step,
        label,
        description
    };
}

// Store original multiplier values to allow resetting
const ORIGINAL_MULTIPLIERS = { ...DAMAGE_MULTIPLIERS };

// Initialize the simulator
export function initBattleSimulator() {
    // Set up event listeners for simulator UI elements
    document.getElementById('battle-simulator').addEventListener('click', openSimulator);
    document.getElementById('close-simulator').addEventListener('click', closeSimulator);
    document.getElementById('start-battle-btn').addEventListener('click', startSimulatedBattle);
    document.getElementById('reset-multipliers-btn').addEventListener('click', resetMultipliers);
    
    // Create damage multiplier sliders dynamically
    createDamageMultiplierSliders();
    
    // Set up event listeners for template buttons
    document.querySelectorAll('.template-btn').forEach(button => {
        button.addEventListener('click', () => {
            const template = button.dataset.template;
            applyTemplate(template);
            
            // Update UI to show the selected template
            document.querySelectorAll('.template-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            button.classList.add('selected');
        });
    });
    
    // Set up event listeners for battle type selection
    document.querySelectorAll('.battle-type-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.battle-type-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
        });
    });
    
    // Set up event listeners for all stat sliders
    ADJUSTABLE_STATS.forEach(stat => {
        const slider = document.getElementById(`${stat}-slider`);
        const valueDisplay = document.getElementById(`${stat}-value`);
        
        slider.addEventListener('input', () => {
            valueDisplay.textContent = slider.value;
        });
    });
    
    // Set up event listeners for all weapon mastery sliders
    WEAPON_TYPES.forEach(weaponType => {
        const slider = document.getElementById(`${weaponType}-mastery-slider`);
        const valueDisplay = document.getElementById(`${weaponType}-mastery-value`);
        
        if (slider && valueDisplay) {
            slider.addEventListener('input', () => {
                valueDisplay.textContent = slider.value;
            });
        }
    });
    
    // Link health and maxHealth sliders
    const healthSlider = document.getElementById('health-slider');
    const maxHealthSlider = document.getElementById('maxHealth-slider');
    
    healthSlider.addEventListener('input', () => {
        if (parseInt(healthSlider.value) > parseInt(maxHealthSlider.value)) {
            maxHealthSlider.value = healthSlider.value;
            document.getElementById('maxHealth-value').textContent = maxHealthSlider.value;
        }
    });
    
    maxHealthSlider.addEventListener('input', () => {
        if (parseInt(maxHealthSlider.value) < parseInt(healthSlider.value)) {
            healthSlider.value = maxHealthSlider.value;
            document.getElementById('health-value').textContent = healthSlider.value;
        }
    });
    
    // Link energy and maxEnergy sliders
    const energySlider = document.getElementById('energy-slider');
    const maxEnergySlider = document.getElementById('maxEnergy-slider');
    
    energySlider.addEventListener('input', () => {
        if (parseInt(energySlider.value) > parseInt(maxEnergySlider.value)) {
            maxEnergySlider.value = energySlider.value;
            document.getElementById('maxEnergy-value').textContent = maxEnergySlider.value;
        }
    });
    
    maxEnergySlider.addEventListener('input', () => {
        if (parseInt(maxEnergySlider.value) < parseInt(energySlider.value)) {
            energySlider.value = maxEnergySlider.value;
            document.getElementById('energy-value').textContent = energySlider.value;
        }
    });
}

// Open the simulator screen
function openSimulator() {
    // Reset to default template first
    applyTemplate('DEFAULT');
    
    // Reset template button selection
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelector('[data-template="DEFAULT"]').classList.add('selected');
    
    // Reset battle type selection
    document.querySelectorAll('.battle-type-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    document.querySelector('[data-battle-type="first"]').classList.add('selected');
    
    // Reset weapon mastery sliders
    WEAPON_TYPES.forEach(weaponType => {
        const slider = document.getElementById(`${weaponType}-mastery-slider`);
        const valueDisplay = document.getElementById(`${weaponType}-mastery-value`);
        
        if (slider && valueDisplay) {
            slider.value = 0;
            valueDisplay.textContent = slider.value;
        }
    });
    
    // Reset damage multiplier sliders
    for (const key in ORIGINAL_MULTIPLIERS) {
        const slider = document.getElementById(`${key}-slider`);
        const valueDisplay = document.getElementById(`${key}-value`);
        
        if (slider && valueDisplay) {
            slider.value = ORIGINAL_MULTIPLIERS[key];
            valueDisplay.textContent = slider.value;
            DAMAGE_MULTIPLIERS[key] = ORIGINAL_MULTIPLIERS[key];
        }
    }
    
    // Transition to simulator screen
    transitionToScreen(screens.start, screens.simulator);
}

// Close the simulator screen
function closeSimulator() {
    transitionToScreen(screens.simulator, screens.start);
}

// Apply a character template from STAT_BUNDLES
function applyTemplate(templateName) {
    if (!STAT_BUNDLES[templateName]) {
        console.error(`Template ${templateName} not found!`);
        return;
    }
    
    const template = STAT_BUNDLES[templateName];
    
    // Update all sliders and value displays
    ADJUSTABLE_STATS.forEach(stat => {
        if (template.hasOwnProperty(stat)) {
            const slider = document.getElementById(`${stat}-slider`);
            const valueDisplay = document.getElementById(`${stat}-value`);
            
            // Set the slider value
            slider.value = template[stat];
            
            // Update the displayed value
            valueDisplay.textContent = template[stat];
        }
    });
}

// Reset damage multipliers to original values
function resetMultipliers() {
    for (const key in ORIGINAL_MULTIPLIERS) {
        const slider = document.getElementById(`${key}-slider`);
        const valueDisplay = document.getElementById(`${key}-value`);
        
        if (slider && valueDisplay) {
            slider.value = ORIGINAL_MULTIPLIERS[key];
            valueDisplay.textContent = slider.value;
            DAMAGE_MULTIPLIERS[key] = ORIGINAL_MULTIPLIERS[key];
        }
    }
}

// Start the simulated battle with custom stats
function startSimulatedBattle() {
    // Get the selected battle type
    const selectedBattleType = document.querySelector('.battle-type-option.selected').dataset.battleType;
    
    // Apply all custom stats to player
    ADJUSTABLE_STATS.forEach(stat => {
        const slider = document.getElementById(`${stat}-slider`);
        setPlayerAttribute(stat, parseInt(slider.value));
    });
    
    // Apply weapon mastery levels to player
    WEAPON_TYPES.forEach(weaponType => {
        const slider = document.getElementById(`${weaponType}-mastery-slider`);
        if (slider) {
            setWeaponLevel(weaponType, parseInt(slider.value));
        }
    });
    
    // Start the battle
    transitionToScreen(screens.simulator, screens.battle, () => {
        initBattle(selectedBattleType);
    });
}

// Dynamically create damage multiplier sliders
function createDamageMultiplierSliders() {
    const container = document.getElementById('damage-multiplier-sliders');
    container.innerHTML = ''; // Clear existing sliders

    // Create sliders based on the DAMAGE_MULTIPLIERS from weapons.js
    for (const key in DAMAGE_MULTIPLIERS) {
        const value = DAMAGE_MULTIPLIERS[key];
        const config = getMultiplierConfig(key, value);

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';

        // Add label with help text
        const label = document.createElement('label');
        label.textContent = config.label;
        label.title = config.description;
        sliderWrapper.appendChild(label);

        // Create slider element
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = `${key}-slider`;
        slider.min = config.min;
        slider.max = config.max;
        slider.step = config.step;
        slider.value = value;
        sliderWrapper.appendChild(slider);

        // Create value display
        const valueDisplay = document.createElement('span');
        valueDisplay.id = `${key}-value`;
        valueDisplay.textContent = value;
        sliderWrapper.appendChild(valueDisplay);

        // Add slider to container
        container.appendChild(sliderWrapper);

        // Set up event listener for this slider
        slider.addEventListener('input', () => {
            valueDisplay.textContent = slider.value;
            DAMAGE_MULTIPLIERS[key] = parseFloat(slider.value);
        });
    }
}