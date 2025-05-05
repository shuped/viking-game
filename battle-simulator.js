// Battle Simulator - For testing battle mechanics
import { playerState, setPlayerAttribute, STAT_BUNDLES } from './player.js';
import { screens } from './main.js';
import { transitionToScreen } from './transitions.js';
import { initBattle } from './battle.js';

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

// Initialize the simulator
export function initBattleSimulator() {
    // Set up event listeners for simulator UI elements
    document.getElementById('battle-simulator').addEventListener('click', openSimulator);
    document.getElementById('close-simulator').addEventListener('click', closeSimulator);
    document.getElementById('start-battle-btn').addEventListener('click', startSimulatedBattle);
    
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
    
    // Set up event listeners for all sliders
    ADJUSTABLE_STATS.forEach(stat => {
        const slider = document.getElementById(`${stat}-slider`);
        const valueDisplay = document.getElementById(`${stat}-value`);
        
        slider.addEventListener('input', () => {
            valueDisplay.textContent = slider.value;
        });
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

// Start the simulated battle with custom stats
function startSimulatedBattle() {
    // Get the selected battle type
    const selectedBattleType = document.querySelector('.battle-type-option.selected').dataset.battleType;
    
    // Apply all custom stats to player
    ADJUSTABLE_STATS.forEach(stat => {
        const slider = document.getElementById(`${stat}-slider`);
        setPlayerAttribute(stat, parseInt(slider.value));
    });
    
    // Start the battle
    transitionToScreen(screens.simulator, screens.battle, () => {
        initBattle(selectedBattleType);
    });
}