// canvas/canvasRenderer.js

import { CELL_STATES } from "./cellStates.js";
import { debug } from "../script.js";

export class CanvasRenderer {
  constructor(canvasElement, gridManager) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");
    this.gridManager = gridManager;
    this.cellSize = 30;

    this.colors = {
      [CELL_STATES.EMPTY]: "#FFFFFF",
      [CELL_STATES.WALL]: "#2c3e50",
      [CELL_STATES.TRAP]: "#e74c3c",
      [CELL_STATES.START]: "#27ae60",
      [CELL_STATES.END]: "#e67e22",
      // Algorithm visualization states
      VISITED: "#3498db", // Light blue for visited nodes
      CURRENT: "#f1c40f", // Yellow for current node
      PATH: "#2ecc71", // Bright green for final path
      FRONTIER: "#f39c12", // Orange for frontier nodes
      CONSIDERING: "#9b59b6", // Purple for nodes being considered
    };

    this.animationStates = {
      visited: new Set(),
      frontier: [],
      path: [],
      current: null,
      isComplete: false,
    };
  }

  // drawGrid() {
  //   const { rows, columns } = this.gridManager.getDimensions();

  //   //Clear canvas
  //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  //   //Draw each cell
  //   for (let row = 0; row < rows; row++) {
  //     for (let col = 0; col < columns; col++) {
  //       this.drawCell(row, col);
  //     }
  //   }

  //   // Draw algorithm visualization on top if active
  //   this.drawAlgorithmOverlay();
  // }

  // In canvas/canvasRenderer.js - update drawCell method
drawCell(row, col) {
  const state = this.gridManager.getCell(row, col);
  const x = col * this.cellSize;
  const y = row * this.cellSize;

  //Fill cell with color
  this.ctx.fillStyle = this.colors[state];
  this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

  //Draw grid lines
  this.ctx.strokeStyle = "#bdc3c7";
  this.ctx.lineWidth = 1;
  this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);

  // Add labels for start and end
  if (state === CELL_STATES.START) {
    this.drawCellLabel(x, y, "S", "#FFFFFF");
  } else if (state === CELL_STATES.END) {
    this.drawCellLabel(x, y, "E", "#FFFFFF");
  } else if (state === CELL_STATES.TRAP) {
    // Show trap weight
    const trapWeight = this.gridManager.getCellWeightForDisplay(row, col);
    this.drawCellLabel(x, y, trapWeight.toString(), "#FFFFFF");
  }
}

  drawCellLabel(x, y, text, color) {
    this.ctx.fillStyle = color;
    this.ctx.font = "bold 16px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(text, x + this.cellSize / 2, y + this.cellSize / 2);
  }

  // New method: Update algorithm visualization state
  updateAlgorithmState(algorithmState) {
    this.animationStates = {
      visited: new Set(
        algorithmState.visited.map((cell) => this.cellToString(cell))
      ),
      frontier: algorithmState.frontier || [],
      path: algorithmState.path || [],
      current: algorithmState.current,
      isComplete: algorithmState.isComplete || false,
    };

    // Redraw the grid with algorithm overlay
    this.drawGrid();
  }

  // Draw algorithm visualization on top of base grid
  drawAlgorithmOverlay() {
    const { visited, frontier, path, current, isComplete } =
      this.animationStates;

    // Draw visited cells (semi-transparent overlay)
    visited.forEach((cellStr) => {
      const cell = this.stringToCell(cellStr);
      this.drawAlgorithmCell(cell.row, cell.col, this.colors.VISITED, 0.6);
    });

    // Draw frontier cells
    frontier.forEach((cell) => {
      this.drawAlgorithmCell(cell.row, cell.col, this.colors.FRONTIER, 0.7);
    });

    // Draw current cell (highlighted)
    if (current) {
      this.drawAlgorithmCell(
        current.row,
        current.col,
        this.colors.CURRENT,
        0.9
      );
      this.drawCellPulse(current.row, current.col);
    }

    // Draw final path (if complete)
    if (isComplete && path.length > 0) {
      path.forEach((cell) => {
        this.drawAlgorithmCell(cell.row, cell.col, this.colors.PATH, 0.8);
      });

      // Highlight start and end of path
      if (path[0]) this.drawCellPulse(path[0].row, path[0].col, "#27ae60");
      if (path[path.length - 1])
        this.drawCellPulse(
          path[path.length - 1].row,
          path[path.length - 1].col,
          "#e67e22"
        );
    }
  }

  drawAlgorithmCell(row, col, color, alpha = 0.7) {
    const x = col * this.cellSize;
    const y = row * this.cellSize;

    // Don't overlay on start/end cells
    const baseState = this.gridManager.getCell(row, col);
    if (baseState === CELL_STATES.START || baseState === CELL_STATES.END) {
      return;
    }

    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
    this.ctx.restore();
  }

  drawCellPulse(row, col, color = this.colors.CURRENT) {
    const x = col * this.cellSize;
    const y = row * this.cellSize;

    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
    this.ctx.restore();
  }

  // Clear algorithm visualization
 // In canvas/canvasRenderer.js - enhance clearAlgorithmState
clearAlgorithmState() {
  this.animationStates = {
    visited: new Set(),
    frontier: [],
    path: [],
    current: null,
    isComplete: false,
  };
  
  // Force a complete redraw of the base grid only
  this.drawBaseGridOnly();
}

// Add this new method to draw only the base grid without any algorithm overlays
drawBaseGridOnly() {
  const { rows, columns } = this.gridManager.getDimensions();

  // Clear the entire canvas
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  // Draw only the base cells (no algorithm visualization)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      this.drawCell(row, col);
    }
  }
}

// Also update the drawGrid method to be more explicit
drawGrid() {
  this.drawBaseGridOnly();
  this.drawAlgorithmOverlay();
}

  // Method specifically for AlgorithmController to call
  drawAlgorithmState(algorithmState) {
    this.updateAlgorithmState(algorithmState);
  }

  resizeCanvas() {
    const { rows, columns } = this.gridManager.getDimensions();
    this.canvas.width = columns * this.cellSize;
    this.canvas.height = rows * this.cellSize;
    this.drawGrid();
  }

  // Helper methods for cell string conversion
  cellToString(cell) {
    return `${cell.row},${cell.col}`;
  }

  stringToCell(str) {
    const [row, col] = str.split(",").map(Number);
    return { row, col };
  }
}
