// canvas/MazeController.js

import { CanvasRenderer } from './canvasRenderer.js';
import { InputHandler } from './inputHandler.js';

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
        // Redraw when grid changes (we'll implement grid change events)
        this.stateManager.onMazeConfigChange = (config) => {
            this.handleGridResize(config);
        };
        
        this.stateManager.onToolChange = (tool) => {
            // Could change cursor style based on tool
        };
    }
    
    initializeCanvas() {
        this.renderer.resizeCanvas();
        this.renderer.drawGrid();
    }
    
    handleGridResize(config) {
        this.gridManager.resizeGrid(config.rows, config.columns);
        this.renderer.resizeCanvas();
    }
    
    redraw() {
        this.renderer.drawGrid();
    }
}