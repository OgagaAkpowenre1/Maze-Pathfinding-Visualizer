// canvas/MazeController.js

import { debug } from "../script.js";
import { CanvasRenderer } from "./canvasRenderer.js";
import { InputHandler } from "./inputHandler.js";
import { AlgorithmController } from "../algorithms/algorithmController.js";

export class MazeController {
  constructor(canvasElement, gridManager, stateManager) {
    this.canvas = canvasElement;
    this.gridManager = gridManager;
    this.stateManager = stateManager;

    this.renderer = new CanvasRenderer(canvasElement, gridManager);
    this.inputHandler = new InputHandler(
      canvasElement,
      gridManager,
      stateManager,
      () => this.redraw()
    );

    // Add AlgorithmController
    this.algorithmController = new AlgorithmController(gridManager, this.renderer);

    this.setupEventListeners();
    this.initializeCanvas();
    console.log("Maze controller set up")
  }

  
  setupEventListeners() {
    this.stateManager.onMazeConfigChange((config) => {
      // debug("State Manager Maze Config Change Acknowledged at MazeController");
      this.handleGridResize(config);
    });

    this.stateManager.onToolChange((tool) => {
      // Could change cursor style based on tool
    });

    this.setupAlgorithmEvents();
  }

//   setupAlgorithmEvents() {
//     // We'll connect these to UI buttons in UIManager
//     // window.startVisualization = () => this.algorithmController.startVisualization();
//     // window.pauseVisualization = () => this.algorithmController.pauseVisualization();
//     // window.resumeVisualization = () => this.algorithmController.resumeVisualization();
//     // window.stopVisualization = () => this.algorithmController.stopVisualization();
//     // window.resetVisualization = () => this.algorithmController.resetVisualization();
    
// }

setupAlgorithmEvents() {
  // TEMPORARILY COMMENT OUT
  window.startVisualization = () => this.algorithmController.startVisualization();
  window.pauseVisualization = () => this.algorithmController.pauseVisualization();
  window.resumeVisualization = () => this.algorithmController.resumeVisualization();
  window.stopVisualization = () => this.algorithmController.stopVisualization();
  window.resetVisualization = () => this.algorithmController.resetVisualization();
  
  // Add placeholder functions
  // window.startVisualization = () => console.log("Visualization disabled - fix imports first");
  // window.pauseVisualization = () => console.log("Visualization disabled");
  // window.resumeVisualization = () => console.log("Visualization disabled");
  // window.stopVisualization = () => console.log("Visualization disabled");
  // window.resetVisualization = () => console.log("Visualization disabled");
}

  initializeCanvas() {
    this.renderer.resizeCanvas();
    this.renderer.drawGrid();
  }

  handleGridResize(config) {
    debug("Maze controller is now resizing grid");
    this.gridManager.resizeGrid(config.rows, config.columns);
    this.renderer.resizeCanvas();
  }

  redraw() {
    this.renderer.drawGrid();
  }
}
