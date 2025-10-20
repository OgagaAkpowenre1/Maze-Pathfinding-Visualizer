// script.js

// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI Manager
    UIManager.init();
    
    // Set up state change listeners
    StateManager.onAlgorithmChange = (algorithm) => {
        console.log('Algorithm changed to:', algorithm);
        // This will be used by canvas later
        // canvasManager.setAlgorithm(algorithm);
    };
    
    StateManager.onToolChange = (tool) => {
        console.log('Active tool changed to:', tool);
        // This will be used by canvas later
        // canvasManager.setActiveTool(tool);
    };
    
    StateManager.onMazeConfigChange = (config) => {
        console.log('Maze config changed:', config);
        // This will be used by canvas later
        // canvasManager.resizeGrid(config.rows, config.columns);
    };
    
    StateManager.onSpeedChange = (speed) => {
        console.log('Speed changed to:', speed);
        // This will be used by visualization later
    };

    // Log initial state
    console.log('Application initialized');
    console.log('Current algorithm:', StateManager.getCurrentAlgorithm());
    console.log('Maze config:', StateManager.getMazeConfig());
});