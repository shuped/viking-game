// Story visualizer that loads the story nodes dynamically
import { storyState } from '../story/story-state.js';

// Store for available chapters and their story nodes
const storyChapters = {};

// Current active chapter
let currentChapter = 'prologue';
let storyNodes = null;

// Function to dynamically import a chapter
async function importChapter(chapterName) {
    try {
        const module = await import(`../story/${chapterName}.js`);
        storyChapters[chapterName] = module.storyNodes;
        console.log(`Successfully loaded chapter: ${chapterName}`);
        return true;
    } catch (error) {
        console.error(`Failed to load chapter: ${chapterName}`, error);
        return false;
    }
}

// Function to discover and load all chapters
async function discoverChapters() {
    // Known chapters from story-manager.js
    const knownChapters = ['prologue', 'chapter-one'];
    
    // Load each chapter
    for (const chapter of knownChapters) {
        await importChapter(chapter);
    }
    
    // Update chapter selector in UI
    updateChapterSelector();
    
    // Load initial chapter
    await loadChapter(currentChapter);
}

// Function to update the chapter selector dropdown
function updateChapterSelector() {
    const selector = document.getElementById('chapter');
    selector.innerHTML = ''; // Clear existing options
    
    Object.keys(storyChapters).forEach(chapterName => {
        const option = document.createElement('option');
        option.value = chapterName;
        option.textContent = formatChapterName(chapterName);
        selector.appendChild(option);
    });
    
    // Set current chapter as selected
    selector.value = currentChapter;
}

// Format chapter name for display (e.g., "chapter-one" -> "Chapter One")
function formatChapterName(chapterName) {
    return chapterName.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Function to prepare the data for D3
function prepareGraphData(storyNodes) {
    const nodes = [];
    const links = [];
    
    // Create nodes
    Object.entries(storyNodes).forEach(([id, node]) => {
        const nodeData = { 
            id: parseInt(id), 
            text: node.text.substring(0, 30) + (node.text.length > 30 ? '...' : ''),
            fullText: node.text,
            hasChoices: !!node.choices,
            end: !!node.end,
            nextChapter: node.nextChapter || null
        };
        nodes.push(nodeData);
    });
    
    // Create links
    Object.entries(storyNodes).forEach(([id, node]) => {
        const sourceId = parseInt(id);
        if (node.next) {
            links.push({
                source: sourceId,
                target: node.next,
                value: 1
            });
        }
        if (node.choices) {
            node.choices.forEach(choice => {
                links.push({
                    source: sourceId,
                    target: choice.nextNode,
                    value: 1,
                    choice: choice.text
                });
            });
        }
    });
    
    return { nodes, links };
}

// Function to load a specific chapter
async function loadChapter(chapterName) {
    // If chapter isn't loaded yet, try to load it
    if (!storyChapters[chapterName]) {
        const success = await importChapter(chapterName);
        if (!success) return false;
    }
    
    currentChapter = chapterName;
    storyNodes = storyChapters[chapterName];
    renderVisualization();
    return true;
}

// Function to render the visualization
function renderVisualization() {
    // Clear existing visualization
    d3.select("#chart svg").remove();
    
    // Prepare the data
    const graphData = prepareGraphData(storyNodes);
    
    // Set up the SVG dimensions
    const width = 1500;
    const height = 800;
    
    // Create SVG
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(d3.zoom().on("zoom", function(event) {
            g.attr("transform", event.transform);
        }));
    
    const g = svg.append("g");
    
    // Create a tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    // Set up the force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
        .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.1));
    
    // Create links with arrow markers
    const link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graphData.links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke-width", d => Math.sqrt(d.value) * 2)
        .attr("marker-end", "url(#arrowhead)");

    // Create arrow markers for links
    svg.append("defs").selectAll("marker")
        .data(["arrowhead"])
        .enter().append("marker")
        .attr("id", d => d)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)  // Position away from node
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#555");
    
    // Create nodes
    const node = g.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graphData.nodes)
        .enter().append("g")
        .attr("class", "node")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            
            let tooltipContent = `<strong>Node ${d.id}</strong><br>${d.fullText}`;
            // Check if there are choices from this node
            const nodeChoices = storyNodes[d.id].choices;
            if (nodeChoices) {
                tooltipContent += '<br><br><strong>Choices:</strong>';
                nodeChoices.forEach(choice => {
                    tooltipContent += `<br>• ${choice.text} (to Node ${choice.nextNode})`;
                });
            } else if (storyNodes[d.id].next) {
                tooltipContent += `<br><br>Next: Node ${storyNodes[d.id].next}`;
            }
            
            if (d.end) {
                tooltipContent += `<br><br><strong>End of Chapter</strong>`;
                if (d.nextChapter) {
                    tooltipContent += `<br>Next Chapter: ${d.nextChapter}`;
                }
            }
            
            tooltip.html(tooltipContent)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    
    // Add circles to nodes
    node.append("circle")
        .attr("r", d => d.hasChoices ? 12 : 8)
        .attr("fill", d => {
            if (d.id === 0) return "#ff6347"; // Start node (red)
            if (d.end) return "#32cd32"; // End node (green)
            return d.hasChoices ? "#ffa500" : "#4a90e2"; // Choice nodes (orange) vs regular nodes (blue)
        });
    
    // Add text labels to nodes
    node.append("text")
        .attr("dy", 20)
        .attr("text-anchor", "middle")
        .text(d => `Node ${d.id}`);
    
    // Define tick function for simulation
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    
        node
            .attr("transform", d => `translate(${d.x},${d.y})`);
    });
    
    // Drag functions
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

// Once the DOM is loaded, create the visualization
document.addEventListener('DOMContentLoaded', async () => {
    // Set up chapter selector
    const chapterSelector = document.getElementById('chapter');
    chapterSelector.addEventListener('change', function() {
        loadChapter(this.value);
    });
    
    // Discover and load all chapters
    await discoverChapters();
    
    // Zoom controls
    document.getElementById('zoomIn').addEventListener('click', function() {
        const currentTransform = d3.zoomTransform(d3.select("#chart svg").node());
        const newScale = currentTransform.k * 1.3;
        d3.select("#chart svg").call(d3.zoom().transform, d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(newScale));
    });
    
    document.getElementById('zoomOut').addEventListener('click', function() {
        const currentTransform = d3.zoomTransform(d3.select("#chart svg").node());
        const newScale = currentTransform.k / 1.3;
        d3.select("#chart svg").call(d3.zoom().transform, d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(newScale));
    });
    
    document.getElementById('resetView').addEventListener('click', function() {
        d3.select("#chart svg").call(d3.zoom().transform, d3.zoomIdentity);
    });
    
    // Export SVG
    document.getElementById('exportSVG').addEventListener('click', function() {
        exportSVG();
    });
});

// Function to export the current view as an SVG file
window.exportSVG = function() {
    const svgData = document.querySelector("#chart svg").outerHTML;
    const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `viking-story-map-${currentChapter}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};