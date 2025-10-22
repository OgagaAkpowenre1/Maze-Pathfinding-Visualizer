import { AlgorithmInfo } from "../algorithms/algorithmInfo.js";
import { AlgorithmData } from "../algorithms/algorithmData.js";

export const AppState = {
  currentAlgorithm: "BFS",
  mazeConfig: {
    rows: 4,
    columns: 4,
  },
  tools: {
    activeTool: "wall",
    startPosition: null,
    endPosition: null,
  },
  visualization: {
    isRunning: false,
    speed: 5,
    isPaused: false,
  },
  grid: null,
  ui: {
    optionsPanelCollapsed: false,
    infoPanelCollapsed: false,
  },
};

// State getters and setters
export const StateManager = {
  getCurrentAlgorithm() {
    return AppState.currentAlgorithm;
  },

  setCurrentAlgorithm(algorithm) {
    if (AlgorithmData[algorithm]) {
      AppState.currentAlgorithm = algorithm;
      this._algorithmChangeCallbacks.forEach((callback) => callback(algorithm));
    }
  },

  getMazeConfig() {
    return { ...AppState.mazeConfig };
  },

  setMazeConfig(config) {
    AppState.mazeConfig = { ...AppState.mazeConfig, ...config };
    this._mazeConfigChangeCallbacks.forEach((callback) =>
      callback(AppState.mazeConfig)
    );
  },

  getActiveTool() {
    return AppState.tools.activeTool;
  },

  setActiveTool(tool) {
    AppState.tools.activeTool = tool;
    this._toolChangeCallbacks.forEach((callback) => callback(tool));
  },

  getVisualizationState() {
    return { ...AppState.visualization };
  },

  setVisualizationSpeed(speed) {
    AppState.visualization.speed = speed;
    this._speedChangeCallbacks.forEach((callback) => callback(speed));
  },

  setGridManager(gridManager) {
    AppState.grid = gridManager;
  },

  getGridManager() {
    return AppState.grid;
  },

  // Multiple callback support
  _mazeConfigChangeCallbacks: [],
  _algorithmChangeCallbacks: [],
  _toolChangeCallbacks: [],
  _speedChangeCallbacks: [],

  onMazeConfigChange(callback) {
    this._mazeConfigChangeCallbacks.push(callback);
  },

  onAlgorithmChange(callback) {
    this._algorithmChangeCallbacks.push(callback);
  },

  onToolChange(callback) {
    this._toolChangeCallbacks.push(callback);
  },

  onSpeedChange(callback) {
    this._speedChangeCallbacks.push(callback);
  },

   // Sidebar state methods
    getSidebarStates() {
        return { ...AppState.ui };
    },
    
    toggleOptionsPanel() {
        AppState.ui.optionsPanelCollapsed = !AppState.ui.optionsPanelCollapsed;
        this._sidebarStateCallbacks.forEach(callback => callback(AppState.ui));
    },
    
    toggleInfoPanel() {
        AppState.ui.infoPanelCollapsed = !AppState.ui.infoPanelCollapsed;
        this._sidebarStateCallbacks.forEach(callback => callback(AppState.ui));
    },
    
    // Callback for sidebar state changes
    _sidebarStateCallbacks: [],
    
    onSidebarStateChange(callback) {
        this._sidebarStateCallbacks.push(callback);
    }
};
