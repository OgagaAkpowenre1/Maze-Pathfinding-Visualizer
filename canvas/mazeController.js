// canvas/MazeController.js

import { debug } from "../script.js";
import { CanvasRenderer } from "./canvasRenderer.js";
import { InputHandler } from "./inputHandler.js";

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

    this.setupEventListeners();
    this.initializeCanvas();
  }

  
  setupEventListeners() {
    this.stateManager.onMazeConfigChange((config) => {
      debug("State Manager Maze Config Change Acknowledged at MazeController");
      this.handleGridResize(config);
    });

    this.stateManager.onToolChange((tool) => {
      // Could change cursor style based on tool
    });
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
