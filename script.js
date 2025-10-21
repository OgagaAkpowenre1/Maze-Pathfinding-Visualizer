console.log("Starting")

// Import everything at the top
import GridManager from "./canvas/gridManager.js";
console.log("Imported grid");
import { CELL_STATES } from "./canvas/cellStates.js";
import { AlgorithmData } from "./algorithms/algorithmData.js";
import { AlgorithmInfo } from "./algorithms/algorithmInfo.js";
import { StateManager } from "./ui/stateManager.js";
import { UIManager } from "./ui/uiManager.js";

// Main application initialization
document.addEventListener("DOMContentLoaded", function () {
  // Initialize UI Manager
  UIManager.init();

  // Set up state change listeners
  StateManager.onAlgorithmChange = (algorithm) => {
    console.log("Algorithm changed to:", algorithm);
    // This will be used by canvas later
    // canvasManager.setAlgorithm(algorithm);
  };

  StateManager.onToolChange = (tool) => {
    console.log("Active tool changed to:", tool);
    // This will be used by canvas later
    // canvasManager.setActiveTool(tool);
  };

  StateManager.onMazeConfigChange = (config) => {
    console.log("Maze config changed:", config);
    // This will be used by canvas later
    // canvasManager.resizeGrid(config.rows, config.columns);
  };

  StateManager.onSpeedChange = (speed) => {
    console.log("Speed changed to:", speed);
    // This will be used by visualization later
  };

  // Log initial state
  console.log("Application initialized");
  console.log("Current algorithm:", StateManager.getCurrentAlgorithm());
  console.log("Maze config:", StateManager.getMazeConfig());

  // Create a 5x5 grid
  const gridManager = new GridManager(5, 5);

  // Set some walls
  gridManager.setCell(0, 1, CELL_STATES.WALL);
  gridManager.setCell(1, 1, CELL_STATES.WALL);

  // Set start and end
  gridManager.setCell(0, 0, CELL_STATES.START);
  gridManager.setCell(4, 4, CELL_STATES.END);

  // Get cell state
  console.log(gridManager.getCell(0, 0)); // Returns 3 (START)

  // Check if ready for pathfinding
  console.log(gridManager.isReadyForPathfinding()); // Returns true
});
