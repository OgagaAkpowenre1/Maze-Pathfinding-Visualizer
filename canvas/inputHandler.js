// canvas/inputHandler.js

import { CELL_STATES } from "./cellStates.js";
import { debug, debugError } from "../script.js";


export class InputHandler {
    constructor(canvasElement, gridManager, stateManager, onCellChange) {
        this.canvas = canvasElement;
        this.gridManager = gridManager;
        this.stateManager = stateManager;
        this.isDrawing = false;
        this.onCellChange = onCellChange

        debug("InputHandler initialized with:", {
            hasStateManager: !!stateManager,
            hasGetActiveTool: stateManager && typeof stateManager.getActiveTool === 'function',
            hasGridManager: !!gridManager
        });

        this.setupEventListeners();
    }

    setupEventListeners(){
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));

        //Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    getGridCoordinates(clientX, clientY){
        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const cellSize = 30;
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);

        return { row, col };
    }

    handleCellClick(row, col){
        try {
            // ✅ Add validation
            if (!this.stateManager || typeof this.stateManager.getActiveTool !== 'function') {
                debugError("INPUT HANDLER CELL CLICK", "StateManager not properly initialized in InputHandler");
                return false;
            }

            const activeTool = this.stateManager.getActiveTool();
            debug("Active tool:", activeTool);

            // Map tool names to cell states
            const toolToState = {
                'wall': CELL_STATES.WALL,
                'trap': CELL_STATES.TRAP,
                'finish': CELL_STATES.END,
                'start': CELL_STATES.START,
                'eraser': CELL_STATES.EMPTY,
            }

            if (toolToState[activeTool] !== undefined){
                this.gridManager.setCell(row, col, toolToState[activeTool]);
                debug(`Set cell (${row}, ${col}) to ${activeTool}`);

                if (this.onCellChange){
                    this.onCellChange();
                }

                debug(`Grid: ${this.gridManager.grid}`)
                return true;
            }

            return false;
        } catch (error) {
            debugError("INPUT HANDLER CELL CLICK ERROR CATCH", "Error in handleCellClick:", error);
            return false;
        }
    }

    // Mouse event handlers...
    handleMouseDown(event) {
        this.isDrawing = true;
        const { row, col } = this.getGridCoordinates(event.clientX, event.clientY);
        this.handleCellClick(row, col);
    }
    
    handleMouseMove(event) {
        if (this.isDrawing) {
            const { row, col } = this.getGridCoordinates(event.clientX, event.clientY);
            this.handleCellClick(row, col);
        }
    }
    
    handleMouseUp() {
        this.isDrawing = false;
    }
    
    // Touch event handlers...
    handleTouchStart(event) {
        this.isDrawing = true;
        const { row, col } = this.getGridCoordinates(event.clientX, event.clientY);
        this.handleCellClick(row, col);
    }
    
    handleTouchMove(event) {
        if (this.isDrawing) {
            const { row, col } = this.getGridCoordinates(event.clientX, event.clientY);
            this.handleCellClick(row, col);
        }
    }
    
    handleTouchEnd() {
        this.isDrawing = false;
    }
}