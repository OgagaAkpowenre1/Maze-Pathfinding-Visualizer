// algorithms/AlgorithmController.js
import { StateManager } from "../ui/stateManager.js";
import { UIManager } from "../ui/uiManager.js";
import BFS from "./BFS.js";
// We'll import other algorithms as we implement them
// import DFS from './DFS.js';
// import Dijkstra from './Dijkstra.js';
// import AStar from './AStar.js';

export class AlgorithmController {
  constructor(gridManager, canvasRenderer) {
    this.gridManager = gridManager;
    this.canvasRenderer = canvasRenderer;
    this.currentAlgorithm = null;
    this.visualizationTimer = null;
    this.isVisualizing = false;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for algorithm changes
    StateManager.onAlgorithmChange = (algorithm) => {
      console.log(`Algorithm changed to: ${algorithm}`);
      // We don't instantiate until visualization starts
    };

    // Listen for visualization speed changes
    StateManager.onSpeedChange = (speed) => {
      if (this.isVisualizing && this.visualizationTimer) {
        this.stopVisualization();
        this.startVisualization(); // Restart with new speed
      }
    };
  }

  // Algorithm factory - creates the appropriate algorithm instance
  createAlgorithm(algorithmName) {
    const start = this.gridManager.getStartPosition();
    const end = this.gridManager.getEndPosition();

    if (!start || !end) {
      throw new Error(
        "Start and end positions must be set before running algorithm"
      );
    }

    switch (algorithmName) {
      case "BFS":
        return new BFS(this.gridManager);
      // case 'DFS':
      //     return new DFS(this.gridManager);
      // case 'Dijkstra':
      //     return new Dijkstra(this.gridManager);
      // case 'AStar':
      //     return new AStar(this.gridManager);
      default:
        throw new Error(`Unknown algorithm: ${algorithmName}`);
    }
  }

  // Start visualization
  // In algorithms/AlgorithmController.js - update startVisualization method
  startVisualization() {
    try {
      console.log("🔄 Starting visualization...");

      // Stop any running visualization first
      this.stopVisualization();

      // Create algorithm instance
      const algorithmName = StateManager.getCurrentAlgorithm();
      console.log("Algorithm selected:", algorithmName);

      // Check if start and end positions are set
      const start = this.gridManager.getStartPosition();
      const end = this.gridManager.getEndPosition();
      console.log("Start position:", start);
      console.log("End position:", end);

      if (!start || !end) {
        throw new Error(
          "Start and end positions must be set before running algorithm"
        );
      }

      this.currentAlgorithm = this.createAlgorithm(algorithmName);
      console.log("Algorithm instance created");

      // Set up algorithm callbacks
      this.setupAlgorithmCallbacks();

      // Update state
      this.isVisualizing = true;
      StateManager.setVisualizationState({
        isRunning: true,
        isPaused: false,
      });

      // Start the algorithm
      // console.log(this.currentAlgorithm)
      this.currentAlgorithm.begin();
      console.log("Algorithm started");

      // Start the visualization loop
      this.startVisualizationLoop();
      console.log("Visualization loop started");

      console.log(`✅ Started ${algorithmName} visualization`);
    } catch (error) {
      console.error("❌ Failed to start visualization:", error);
      this.handleVisualizationError(error.message);
    }
  }

  setupAlgorithmCallbacks() {
    // Called on each algorithm step
    this.currentAlgorithm.onStep = (visualizationState) => {
      this.updateVisualization(visualizationState);
    };

    // Called when algorithm completes
    this.currentAlgorithm.onComplete = (results) => {
      this.handleAlgorithmComplete(results);
    };

    // Called when no path is found
    this.currentAlgorithm.onNoPath = (message) => {
      this.handleNoPath(message);
    };

    // Called when path is found
    this.currentAlgorithm.onPathFound = (results) => {
      this.handlePathFound(results);
    };
  }

  // Visualization loop using requestAnimationFrame for smooth rendering
  startVisualizationLoop() {
    const speed = StateManager.getVisualizationState().speed;
    const stepInterval = this.calculateStepInterval(speed);
    let lastStepTime = 0;

    const step = (timestamp) => {
      if (!this.isVisualizing || !this.currentAlgorithm) return;

      // Check if we should take another step based on speed
      if (timestamp - lastStepTime >= stepInterval) {
        this.currentAlgorithm.step();
        lastStepTime = timestamp;
      }

      // Continue the loop if algorithm is still running
      if (
        this.currentAlgorithm.isRunning &&
        !this.currentAlgorithm.isComplete
      ) {
        this.visualizationTimer = requestAnimationFrame(step);
      } else {
        this.cleanupVisualization();
      }
    };

    this.visualizationTimer = requestAnimationFrame(step);
  }

  // Convert speed (1-10) to time interval between steps
  calculateStepInterval(speed) {
    // Speed 1 (slowest) = 500ms, Speed 10 (fastest) = 50ms
    return 550 - speed * 50;
  }

  updateVisualization(visualizationState) {
    // Update canvas with current algorithm state
    this.canvasRenderer.drawAlgorithmState(visualizationState);

    // Update statistics in UI
    this.updateStatistics(visualizationState);
  }

  // Handle algorithm completion
  handleAlgorithmComplete(results) {
    console.log("Algorithm completed:", results);

    // Update final visualization
    this.updateVisualization({
      ...this.currentAlgorithm.getVisualizationState(),
      isComplete: true,
    });

    // Show results in UI
    this.showResults(results);

    // Clean up
    this.cleanupVisualization();
  }

  handlePathFound(results) {
    console.log("Path found!", results);
    // You could trigger celebration effects here
  }

  handleNoPath(message) {
    console.log("No path found:", message);
    // Show error message to user
    this.showNotification(message, "error");
  }

  handleVisualizationError(errorMessage) {
    console.error("Visualization error:", errorMessage);
    this.showNotification(errorMessage, "error");
    this.cleanupVisualization();
  }

  // Pause visualization
  pauseVisualization() {
    if (this.currentAlgorithm) {
      // Stop the animation loop
      if (this.visualizationTimer) {
        cancelAnimationFrame(this.visualizationTimer);
        this.visualizationTimer = null;
      }

      this.currentAlgorithm.pause();
      StateManager.setVisualizationState({ isPaused: true });
      this.isVisualizing = false; // Important: stop the visualization flag
      console.log("Visualization paused");
    }
  }

  // Resume visualization
  resumeVisualization() {
    if (this.currentAlgorithm && this.currentAlgorithm.isPaused) {
      this.currentAlgorithm.resume();
      StateManager.setVisualizationState({ isPaused: false });
      this.isVisualizing = true; // Reset the visualization flag
      this.startVisualizationLoop(); // This will restart the animation
      console.log("Visualization resumed");
    }
  }

  // Stop visualization completely
  stopVisualization() {
    if (this.currentAlgorithm) {
      this.currentAlgorithm.stop();
    }
    this.cleanupVisualization();
    console.log("Visualization stopped");
  }

  // Step through algorithm manually (for debugging)
  stepForward() {
    if (this.currentAlgorithm && !this.currentAlgorithm.isComplete) {
      this.currentAlgorithm.step();
    }
  }

  // Reset everything
  // In algorithms/AlgorithmController.js - enhance the reset method
  resetVisualization() {
    this.stopVisualization();
    this.currentAlgorithm = null;
    StateManager.setVisualizationState({
      isRunning: false,
      isPaused: false,
    });

    // Clear algorithm visualization from canvas
    this.canvasRenderer.clearAlgorithmState();

    console.log("Visualization reset");
  }

  cleanupVisualization() {
    if (this.visualizationTimer) {
      cancelAnimationFrame(this.visualizationTimer);
      this.visualizationTimer = null;
    }
    this.isVisualizing = false;
    StateManager.setVisualizationState({
      isRunning: false,
      isPaused: false,
    });
  }

  // Update statistics in UI
  updateStatistics(visualizationState) {
    // We'll integrate this with UIManager later
    const stats = {
      steps: visualizationState.currentStep,
      visited: visualizationState.visited.length,
      pathLength: visualizationState.path.length,
      frontierSize: visualizationState.frontier.length,
    };

    // Temporary console output - we'll hook this to UI later
    console.log("Algorithm Stats:", stats);
  }

  // Show results in UI
  showResults(results) {
    const message = results.success
      ? `Path found! Length: ${results.pathLength}, Visited: ${results.visitedCount}`
      : "No path found!";

    this.showNotification(message, results.success ? "success" : "warning");

    // Update UI with detailed results
    if (window.UIManager && window.UIManager.updateAlgorithmResults) {
      window.UIManager.updateAlgorithmResults(results);
    }
  }

  // Simple notification system (we'll enhance this later)
  showNotification(message, type = "info") {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // TODO: Integrate with proper UI notification system
    alert(`${type.toUpperCase()}: ${message}`);
  }

  // Get current algorithm state (for debugging)
  getAlgorithmState() {
    return this.currentAlgorithm
      ? this.currentAlgorithm.getVisualizationState()
      : null;
  }

  // Update the showResults method
  showResults(results) {
    const stats = {
      visited: results.visitedCount,
      pathLength: results.pathLength,
      steps: results.totalSteps,
      executionTime: results.executionTime,
      success: results.success,
    };

    const message = results.success ? "🎉 Path Found!" : "❌ No Path Found";

    // Show toast with detailed stats (no auto-hide for completion)
    UIManager.showToast(message, stats, 0); // 0 = no auto-hide

    // Also update status bar
    // UIManager.showStatusBar(
    //   results.success ? "✅ Path Found!" : "❌ No Path Exists",
    //   stats,
    //   true
    // );
  }

  // Update updateStatistics to track real-time stats
  updateStatistics(visualizationState) {
    const stats = {
      steps: visualizationState.currentStep,
      visited: visualizationState.visited.length,
      pathLength: visualizationState.path.length,
      frontierSize: visualizationState.frontier.length,
    };

    // Update status bar with live stats if algorithm is running
    const vizState = StateManager.getVisualizationState();
    if (vizState.isRunning && !vizState.isPaused) {
      // UIManager.showStatusBar("🎯 Algorithm Running...", stats, false);
    }

    console.log("Algorithm Stats:", stats);
  }
}
