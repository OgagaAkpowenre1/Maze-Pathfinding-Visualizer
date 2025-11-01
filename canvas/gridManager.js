// canvas/gridManager.js

import { debug } from "../script.js";
import { CELL_STATES } from "./cellStates.js";
import { StateManager } from "../ui/stateManager.js";

class GridManager {
  constructor(rows, columns) {
    if (rows < 1 || columns < 1) {
      throw new Error("Grid must have at least 1 row and 1 column");
    }

    this.startPosition = null;
    this.endPosition = null;
    this.grid = [];
    this.cellWeights = new Map(); // NEW: Store weights per cell
    this.rows = rows;
    this.columns = columns;
    this.currentTrapWeight = 5; // Default weight for new traps

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

  // Add method to set current trap weight for NEW traps
  setCurrentTrapWeight(weight) {
    this.currentTrapWeight = Math.max(1, Math.min(100, weight));
  }

  getCurrentTrapWeight() {
    return this.currentTrapWeight;
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
    }

    //Validate state
    if (!Object.values(CELL_STATES).includes(newState)) {
      throw new Error(`Invalid cell state: ${newState}`);
    }

    const currentState = this.grid[row][col];

    //Handle special cases for START and END
    if (newState === CELL_STATES.START) {
      if (this.startPosition) {
        this.grid[this.startPosition.row][this.startPosition.col] =
          CELL_STATES.EMPTY;
      }
      this.startPosition = { row, col };
    }

    if (newState === CELL_STATES.END) {
      if (this.endPosition) {
        this.grid[this.endPosition.row][this.endPosition.col] =
          CELL_STATES.EMPTY;
      }
      this.endPosition = { row, col };
    }

    // If we're changing a cell to TRAP, set its weight
    if (newState === CELL_STATES.TRAP) {
      const cellKey = this.cellToString(row, col);
      this.cellWeights.set(cellKey, this.currentTrapWeight);
    } else if (
      currentState === CELL_STATES.TRAP &&
      newState !== CELL_STATES.TRAP
    ) {
      // If we're removing a trap, remove its weight
      const cellKey = this.cellToString(row, col);
      this.cellWeights.delete(cellKey);
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
    this.cellWeights.clear();
  }

  // Resize grid (useful when user changes dimensions)
  resizeGrid(newRows, newColumns) {
    debug("Grid Manager resizing grid", newRows, newColumns);
    this.rows = newRows;
    this.columns = newColumns;
    this.initializeGrid();
    this.cellWeights.clear();
  }

  // In canvas/gridManager.js - add these methods
  // Update getCellWeight to use individual cell weights
  getCellWeight(row, col) {
    const state = this.getCell(row, col);
    const cellKey = this.cellToString(row, col);

    switch (state) {
      case CELL_STATES.WALL:
        return Infinity; // Impassable
      case CELL_STATES.TRAP:
        return this.cellWeights.get(cellKey) || this.currentTrapWeight; // Use stored weight or current default
      case CELL_STATES.START:
      case CELL_STATES.END:
      case CELL_STATES.EMPTY:
      default:
        return 1; // Normal movement cost
    }
  }

  // Helper method to convert cell to string key
  cellToString(row, col) {
    return `${row},${col}`;
  }

  // Optional: Get weight for display purposes
  getCellWeightForDisplay(row, col) {
    const state = this.getCell(row, col);
    if (state === CELL_STATES.TRAP) {
      return StateManager.getTrapWeight();
    }
    return 1;
  }
}

export default GridManager;
