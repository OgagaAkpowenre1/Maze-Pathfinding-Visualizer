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
  weights: {
    trapWeight: 5, // Default trap weight
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

  getTrapWeight() {
    return AppState.weights.trapWeight;
  },
  
  setTrapWeight(weight) {
    AppState.weights.trapWeight = Math.max(1, Math.min(100, weight)); // Limit between 1-100
    // You could add a callback here if needed
  },

  getVisualizationState() {
    return { ...AppState.visualization };
  },

  setVisualizationSpeed(speed) {
    AppState.visualization.speed = speed;
    this._speedChangeCallbacks.forEach((callback) => callback(speed));
  },

  // Visualization state management
  setVisualizationState(updates) {
    AppState.visualization = { ...AppState.visualization, ...updates };
    // You could add a callback here if needed: this._visualizationChangeCallbacks?.forEach(cb => cb(AppState.visualization));
  },

  // Individual visualization controls
  startVisualization() {
    this.setVisualizationState({ isRunning: true, isPaused: false });
  },

  pauseVisualization() {
    this.setVisualizationState({ isPaused: true });
  },

  resumeVisualization() {
    this.setVisualizationState({ isPaused: false });
  },

  stopVisualization() {
    this.setVisualizationState({ isRunning: false, isPaused: false });
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
    this._sidebarStateCallbacks.forEach((callback) => callback(AppState.ui));
  },

  toggleInfoPanel() {
    AppState.ui.infoPanelCollapsed = !AppState.ui.infoPanelCollapsed;
    this._sidebarStateCallbacks.forEach((callback) => callback(AppState.ui));
  },

  // Callback for sidebar state changes
  _sidebarStateCallbacks: [],

  onSidebarStateChange(callback) {
    this._sidebarStateCallbacks.push(callback);
  },
};
