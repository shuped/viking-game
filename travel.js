// travel.js - Handles the travel UI and travel location selection

import { transitionToScreen } from './transitions.js';
import { displayStoryText } from './story.js';
import { screens } from './main.js';
import { storyState } from './story/story-state.js';
import { getCurrentChapter } from './story/story-manager.js';

// Available travel destinations based on chapter and story state
const travelDestinations = {
    'prologue': [
        {
            id: 'village',
            name: 'Saxon Village',
            description: 'A small Saxon settlement with limited defenses.',
            requiredNode: null, // Always available
            storyNode: 10,
            position: { x: 70, y: 40 } // % of map width/height
        }
    ],
    'chapter-one': [
        {
            id: 'monastery',
            name: 'Lindisfarne Monastery',
            description: 'A wealthy monastery with valuable religious artifacts.',
            requiredNode: 5, // Only available after node 5
            storyNode: 25,
            position: { x: 30, y: 20 }
        },
        {
            id: 'forest',
            name: 'Deep Forest',
            description: 'A dark forest rumored to have hidden treasures and dangers.',
            requiredNode: 10,
            storyNode: 35,
            position: { x: 60, y: 50 }
        },
        {
            id: 'town',
            name: 'Fortified Town',
            description: 'A well-defended Saxon town with a garrison of soldiers.',
            requiredNode: 15,
            storyNode: 45,
            position: { x: 80, y: 70 }
        }
    ]
};

// Travel map HTML template
const mapTemplate = `
<div id="travel-map-container">
    <div id="travel-map">
        <div id="map-title">Travel Map</div>
        <div id="travel-locations"></div>
        <div id="location-details"></div>
        <button id="close-map-button">Return to Camp</button>
    </div>
</div>
`;

// CSS for the travel map
const mapStyles = `
<style>
    #travel-map-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    #travel-map {
        width: 80%;
        height: 80%;
        background-image: url('assets/prologue_screen.png'); /* Placeholder - should create a map bg */
        background-size: cover;
        background-position: center;
        position: relative;
        border: 3px solid #8B4513;
        border-radius: 8px;
    }
    
    #map-title {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 24px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
    }
    
    .travel-location {
        position: absolute;
        width: 30px;
        height: 30px;
        background-color: #c00;
        border-radius: 50%;
        box-shadow: 0 0 10px #f00;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }
    
    .travel-location:hover {
        transform: scale(1.2);
        box-shadow: 0 0 15px #f00;
    }
    
    .travel-location.unavailable {
        background-color: #555;
        box-shadow: 0 0 10px #888;
    }
    
    #location-details {
        position: absolute;
        bottom: 20px;
        left: 20px;
        width: 60%;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 15px;
        border: 1px solid #8B4513;
        border-radius: 5px;
    }
    
    #close-map-button {
        position: absolute;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background-color: #8B4513;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    
    #close-map-button:hover {
        background-color: #a26023;
    }
</style>
`;

// Show the travel map
function showTravelMap() {
    // Create map UI if it doesn't exist
    if (!document.getElementById('travel-map-container')) {
        // Add the CSS styles to the document
        document.head.insertAdjacentHTML('beforeend', mapStyles);
        
        // Add the map HTML to the document
        document.body.insertAdjacentHTML('beforeend', mapTemplate);
        
        // Set up event listener for the close button
        document.getElementById('close-map-button').addEventListener('click', hideTravelMap);
    } else {
        // If map already exists, just show it
        document.getElementById('travel-map-container').style.display = 'flex';
    }
    
    // Update locations based on current chapter
    updateTravelLocations();
}

// Hide the travel map
function hideTravelMap() {
    const mapContainer = document.getElementById('travel-map-container');
    if (mapContainer) {
        mapContainer.style.display = 'none';
    }
}

// Update travel locations on the map based on current chapter and story state
function updateTravelLocations() {
    const locationsContainer = document.getElementById('travel-locations');
    locationsContainer.innerHTML = '';
    
    const currentChapter = getCurrentChapter();
    const locations = travelDestinations[currentChapter] || [];
    const chapterState = storyState.getChapterState(currentChapter);
    
    locations.forEach(location => {
        const locationElement = document.createElement('div');
        locationElement.classList.add('travel-location');
        locationElement.dataset.locationId = location.id;
        
        // Position the location on the map
        locationElement.style.left = `${location.position.x}%`;
        locationElement.style.top = `${location.position.y}%`;
        
        // Check if location is available based on story progress
        const isAvailable = !location.requiredNode || 
                            chapterState.visitedNodes.has(location.requiredNode);
        
        if (!isAvailable) {
            locationElement.classList.add('unavailable');
        } else {
            // Add click event listener for available locations
            locationElement.addEventListener('click', () => {
                travelToLocation(location);
            });
            
            // Add hover event to show location details
            locationElement.addEventListener('mouseover', () => {
                showLocationDetails(location);
            });
        }
        
        locationsContainer.appendChild(locationElement);
    });
    
    // Initial empty state for location details
    document.getElementById('location-details').innerHTML = '<p>Hover over a location to see details</p>';
}

// Show details about a location on hover
function showLocationDetails(location) {
    const detailsContainer = document.getElementById('location-details');
    
    let content = `
        <h3>${location.name}</h3>
        <p>${location.description}</p>
    `;
    
    detailsContainer.innerHTML = content;
}

// Travel to selected location
function travelToLocation(location) {
    hideTravelMap();
    
    // Transition to the cinematic UI and display the appropriate story node
    transitionToScreen(screens.camp, screens.cinematicUI, () => {
        displayStoryText(location.storyNode);
    });
}

export { showTravelMap, hideTravelMap, travelDestinations };