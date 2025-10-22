// canvas/canvasRenderer.js

import { CELL_STATES } from "./cellStates.js";
import { debug } from "../script.js";

export class CanvasRenderer{
    constructor (canvasElement, gridManager) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.gridManager = gridManager;
        this.cellSize = 30;

        this.colors = {
            [CELL_STATES.EMPTY]: '#FFFFFF',
            [CELL_STATES.WALL]: '#2c3e50',
            [CELL_STATES.TRAP]: '#e74c3c',
            [CELL_STATES.START]: '#27ae60',
            [CELL_STATES.END]: '#e67e22',
        }
    }

    drawGrid(){
        const { rows, columns } = this.gridManager.getDimensions();

        //Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Draw each cell
        for (let row = 0; row < rows; row++){
            for (let col = 0; col < columns; col++){
                this.drawCell(row, col);
            }
        }
    }


    drawCell(row, col){
        const state = this.gridManager.getCell(row, col);
        const x = col * this.cellSize;
        const y = row * this.cellSize;
        debug(`Drawing cell at (${x}, ${y}) with state ${state}`);

        //Fill cell with color
        this.ctx.fillStyle = this.colors[state];
        debug(`Filling cell with color ${this.colors[state]}`);
        this.ctx.fillRect(x, y, this.cellSize, this.cellSize) ;

        //Draw grid lines
        this.ctx.strokeStyle = '#bdc3c7';
        this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
    }

    resizeCanvas(){
        const { rows, columns } = this.gridManager.getDimensions();
        this.canvas.width = columns * this.cellSize;
        this.canvas.height = rows * this.cellSize;
        this.drawGrid();
    }
}