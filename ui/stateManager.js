// ui/stateManager.js

const AppState = {
    currentAlgorithm: 'BFS',
    mazeConfig: {
        rows: 4,
        columns: 4
    },
    tools: {
        activeTool: 'wall',
        startPosition: null,
        endPosition: null
    },
    visualization: {
        isRunning: false,
        speed: 5,
        isPaused: false
    }
};

// State getters and setters
const StateManager = {
    getCurrentAlgorithm() {
        return AppState.currentAlgorithm;
    },

    setCurrentAlgorithm(algorithm) {
        if (AlgorithmData[algorithm]) {
            AppState.currentAlgorithm = algorithm;
            this.onAlgorithmChange?.(algorithm);
        }
    },

    getMazeConfig() {
        return { ...AppState.mazeConfig };
    },

    setMazeConfig(config) {
        AppState.mazeConfig = { ...AppState.mazeConfig, ...config };
        this.onMazeConfigChange?.(AppState.mazeConfig);
    },

    getActiveTool() {
        return AppState.tools.activeTool;
    },

    setActiveTool(tool) {
        AppState.tools.activeTool = tool;
        this.onToolChange?.(tool);
    },

    getVisualizationState() {
        return { ...AppState.visualization };
    },

    setVisualizationSpeed(speed) {
        AppState.visualization.speed = speed;
        this.onSpeedChange?.(speed);
    },

    // Event callbacks (to be set by UIManager)
    onAlgorithmChange: null,
    onMazeConfigChange: null,
    onToolChange: null,
    onSpeedChange: null
};