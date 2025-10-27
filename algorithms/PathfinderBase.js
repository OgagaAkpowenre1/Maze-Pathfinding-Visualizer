// algorithms/PathfinderBase.js
import { CELL_STATES } from "../canvas/cellStates.js";
import { debug, debugError } from "../script.js";

export default class PathfinderBase {
    constructor(gridManager) {
        this.gridManager = gridManager;
        this.grid = gridManager.grid;
        this.rows = gridManager.rows;
        this.columns = gridManager.columns;
        this.start = gridManager.getStartPosition();
        this.end = gridManager.getEndPosition();

        // Algorithm state
        this.isRunning = false;
        this.isPaused = false;
        this.isComplete = false;
        this.currentStep = 0;
        this.hasPath = false;

        // Data structures
        this.visited = new Set();
        this.frontier = [];
        this.cameFrom = new Map();
        this.path = [];
        this.visitedOrder = [];

        // Statistics
        this.stats = {
            nodesVisited: 0,
            pathLength: 0,
            executionTime: 0,
            startTime: 0,
        };

        // Callbacks
        this.onStep = null;
        this.onComplete = null;
        this.onPathFound = null;
        this.onNoPath = null;
    }

    // ===== PUBLIC INTERFACE =====
    begin() {
        if (!this.start || !this.end) {
            debugError("Cannot start algorithm: Start or end position not set");
            if (this.onNoPath) this.onNoPath("Start or end position not set");
            return;
        }

        this.isRunning = true;
        this.isPaused = false;
        this.isComplete = false;
        this.currentStep = 0;
        this.stats.startTime = performance.now();

        this.initialize();

        debug(`Started algorithm from ${this.start.row},${this.start.col} to ${this.end.row},${this.end.col}`);
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    stop() {
        this.isRunning = false;
        this.isComplete = true;
        this.stats.executionTime = performance.now() - this.stats.startTime;
    }

    step() {
        if (!this.isRunning || this.isPaused || this.isComplete) {
            return { complete: false };
        }

        this.currentStep++;
        const result = this.executeStep();

        // Update statistics
        this.stats.nodesVisited = this.visited.size;

        // Notify visualizer
        if (this.onStep) {
            this.onStep(this.getVisualizationState());
        }

        // Check completion
        if (result && result.complete) {
            this.isComplete = true;
            this.stats.executionTime = performance.now() - this.stats.startTime;

            if (result.success) {
                this.path = this.reconstructPath();
                this.stats.pathLength = this.path.length;
                this.hasPath = true;
                debug(`Path found! Length: ${this.path.length}, Visited: ${this.visited.size}`);
                if (this.onPathFound) this.onPathFound(this.getResults());
            } else {
                this.hasPath = false;
                debug("No path found");
                if (this.onNoPath) this.onNoPath("No path exists between start and end");
            }

            if (this.onComplete) {
                this.onComplete(this.getResults());
            }
        }

        return result;
    }

    getResults() {
        return {
            success: this.hasPath,
            path: this.path,
            visitedCount: this.visited.size,
            pathLength: this.path.length,
            executionTime: this.stats.executionTime,
            totalSteps: this.currentStep,
        };
    }

    getVisualizationState() {
        return {
            visited: Array.from(this.visited).map((str) => this.stringToCell(str)),
            frontier: this.frontier.slice(),
            path: this.path,
            currentStep: this.currentStep,
            isComplete: this.isComplete,
            current: this.getCurrentNode(),
        };
    }

    // ===== ALGORITHM-SPECIFIC METHODS (to be implemented by children) =====
    initialize() {
        throw new Error("initialize must be implemented by child class");
    }

    executeStep() {
        throw new Error("executeStep must be implemented by child class");
    }

    reset() {
        throw new Error("reset must be implemented by child class");
    }

    getCurrentNode() {
        return null;
    }

    // ===== COMMON HELPER METHODS =====
    getNeighbors(row, col) {
        const neighbors = [];
        const directions = [
            { row: -1, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 },
        ];

        for (const dir of directions) {
            const newRow = row + dir.row;
            const newCol = col + dir.col;

            if (this.isValidCell(newRow, newCol) && 
                this.grid[newRow][newCol] !== CELL_STATES.WALL) {
                neighbors.push({ row: newRow, col: newCol });
            }
        }

        return neighbors;
    }

    isValidCell(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.columns;
    }

    reconstructPath() {
        const path = [];
        let current = this.end;

        // Reconstruct from end to start
        while (current && !this.isEqual(current, this.start)) {
            path.unshift(current);
            const currentKey = this.cellToString(current);
            current = this.cameFrom.get(currentKey);
        }

        // Add start if we found a complete path
        if (current && this.isEqual(current, this.start)) {
            path.unshift(this.start);
            return path;
        }

        return []; // No complete path
    }

    isEqual(cellA, cellB) {
        return cellA.row === cellB.row && cellA.col === cellB.col;
    }

    cellToString(cell) {
        return `${cell.row},${cell.col}`;
    }

    stringToCell(str) {
        const [row, col] = str.split(",").map(Number);
        return { row, col };
    }

    isEndNode(node) {
        return this.isEqual(node, this.end);
    }

    isStartNode(node) {
        return this.isEqual(node, this.start);
    }
}