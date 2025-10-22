// canvas/gridManager.js

import { CELL_STATES } from "./cellStates.js";

class GridManager {
  constructor(rows, columns) {
    if (rows < 1 || columns < 1) {
      throw new Error("Grid must have at least 1 row and 1 column");
    }
 
    this.startPosition = null;
    this.endPosition = null;
    this.grid = [];
    this.rows = rows;
    this.columns = columns;

    this.initializeGrid();
  }

  initializeGrid() {
    this.grid = [];
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.columns; col++) {
        this.grid[row][col] = CELL_STATES.EMPTY;
      }
    }

    this.startPosition = null;
    this.endPosition = null;
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.columns;
  }

  getCell(row, col) {
    //Validate position
    if (!this.isValidPosition(row, col)) {
      throw new Error(`Position (${row}, ${col}) is outside grid boundaries.`);
    }
    return this.grid[row][col];
  }

  setCell(row, col, newState) {
    //Validate position
    if (!this.isValidPosition(row, col)) {
      throw new Error(`Position (${row}, ${col}) is outside grid boundaries.`);
    };

    //Validate state
    if (!Object.values(CELL_STATES).includes(newState)) {
      throw new Error(`Invalid cell state: ${newState}`);
    };

    const currentState = this.grid[row][col];

    //Handle special cases for START and END
    if (newState === CELL_STATES.START) {
      if (this.startPosition) {
        this.grid[this.startPosition.row][this.startPosition.col] =
          CELL_STATES.EMPTY;
      };
      this.startPosition = { row, col };
    };

    if (newState === CELL_STATES.END) {
      if (this.endPosition) {
        this.grid[this.endPosition.row][this.endPosition.col] =
          CELL_STATES.EMPTY;
      }
      this.endPosition = { row, col };
    }

    // If we're changing a START cell to something else, clear startPosition
    if (currentState === CELL_STATES.START && newState !== CELL_STATES.START) {
      this.startPosition = null;
    }

    // If we're changing an END cell to something else, clear endPosition
    if (currentState === CELL_STATES.END && newState !== CELL_STATES.END) {
      this.endPosition = null;
    }

    // Update the cell
    this.grid[row][col] = newState;
  }

  // Get grid dimensions
  getDimensions() {
    return { rows: this.rows, columns: this.columns };
  }

  // Get start and end positions
  getStartPosition() {
    return this.startPosition ? { ...this.startPosition } : null;
  }

  getEndPosition() {
    return this.endPosition ? { ...this.endPosition } : null;
  }

  // Check if grid has both start and end
  isReadyForPathfinding() {
    return this.startPosition !== null && this.endPosition !== null;
  }

  // Reset entire grid to empty
  clearGrid() {
    this.initializeGrid();
  }

  // Resize grid (useful when user changes dimensions)
  resizeGrid(newRows, newColumns) {
    this.rows = newRows;
    this.columns = newColumns;
    this.initializeGrid();
  }
}

export default GridManager;
