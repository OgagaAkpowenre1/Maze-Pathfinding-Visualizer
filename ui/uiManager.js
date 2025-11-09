// ui/uiManager

import { AlgorithmInfo } from "../algorithms/algorithmInfo.js";
import { AlgorithmData } from "../algorithms/algorithmData.js";
import { StateManager } from "./stateManager.js";
import { CELL_STATES } from "../canvas/cellStates.js";

export const UIManager = {
  init() {
    this.setupAlgorithmButtons();
    this.setupToolButtons();
    this.setupMazeConfigInputs();
    this.setupSpeedControl();
    this.setupHeaderButtons();
    this.setupSidebarToggles();
    this.setupControlButtons();
    // Set initial state
    this.updateAlgorithmInfo("BFS");
    this.highlightActiveAlgorithm("BFS");

    // Highlight initial active tool
    this.highlightActiveTool(StateManager.getActiveTool());
  },

  setupAlgorithmButtons() {
    const algorithmButtons = document.querySelectorAll(".algorithm-option");

    algorithmButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const algorithmKey = e.target.dataset.algorithm; // Using data attributes

        if (algorithmKey) {
          StateManager.setCurrentAlgorithm(algorithmKey);
          this.updateAlgorithmInfo(algorithmKey);
          this.highlightActiveAlgorithm(algorithmKey);
        }
      });
    });
  },

setupToolButtons() {
  const toolButtons = document.querySelectorAll(".design-tools");

  toolButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const tool = e.target.textContent.toLowerCase();
      
      if (tool === "update-weight") {
        // Special tool to update weights of existing traps
        this.activateWeightUpdateTool();
      } else {
        StateManager.setActiveTool(tool);
        this.highlightActiveTool(tool);
      }
    });
  });
},

activateWeightUpdateTool() {
  const currentWeight = StateManager.getTrapWeight();
  const newWeight = prompt(`Update all existing traps to weight:`, currentWeight);
  
  if (newWeight !== null) {
    const weight = parseInt(newWeight);
    if (!isNaN(weight) && weight >= 1 && weight <= 100) {
      // Update all existing traps to new weight
      this.updateAllTrapWeights(weight);
      StateManager.setTrapWeight(weight); // Also update for new traps
    } else {
      alert("Please enter a valid weight between 1 and 100");
    }
  }
},

updateAllTrapWeights(newWeight) {
  const gridManager = StateManager.getGridManager();
  if (!gridManager) return;

  const { rows, columns } = gridManager.getDimensions();
  let updatedCount = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (gridManager.getCell(row, col) === CELL_STATES.TRAP) {
        const cellKey = gridManager.cellToString(row, col);
        gridManager.cellWeights.set(cellKey, newWeight);
        updatedCount++;
      }
    }
  }

  console.log(`Updated ${updatedCount} traps to weight ${newWeight}`);
  
  // Redraw to show updated weights
  if (window.mazeController) {
    window.mazeController.redraw();
  }
},

  setupMazeConfigInputs() {
    const rowsInput = document.getElementById("rows");
    const columnsInput = document.getElementById("columns");
    const trapWeightInput = document.getElementById("trap-weight"); // NEW
    const applyButton = document.getElementById("apply-size");

    // Set initial trap weight value
    trapWeightInput.value = StateManager.getTrapWeight();

    // Trap weight change listener (immediate)
    trapWeightInput.addEventListener("input", (e) => {
      const weight = parseInt(e.target.value) || 5;
      StateManager.setTrapWeight(weight);

      // Optional: Show a tooltip or status message
    console.log(`Trap weight set to ${weight}. New traps will use this weight.`);
    });

    // ✅ FIX 3: Single apply button for better performance
    applyButton.addEventListener("click", () => {
      const config = {
        rows: Math.max(4, Math.min(50, parseInt(rowsInput.value) || 4)),
        columns: Math.max(4, Math.min(50, parseInt(columnsInput.value) || 4)),
      };

      // Validate inputs
      if (
        config.rows < 4 ||
        config.rows > 50 ||
        config.columns < 4 ||
        config.columns > 50
      ) {
        alert("Please enter values between 4 and 50");
        return;
      }

      StateManager.setMazeConfig(config);
    });
  },

  setupSpeedControl() {
    const speedInput = document.getElementById("speed");

    speedInput.addEventListener("input", (e) => {
      const speed = parseInt(e.target.value);
      StateManager.setVisualizationSpeed(speed);
    });
  },

  // Add to ui/uiManager.js
  setupControlButtons() {
    const controlButtons = document.querySelectorAll(
      ".controls button[data-control]"
    );

    controlButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const controlType = e.target.dataset.control;
        console.log(`Controls button clicked: ${controlType}`);

        switch (controlType) {
          case "pause":
            this.pauseVisualization();
            break;
          case "resume":
            this.resumeVisualization();
            break;
          case "visualize":
            this.startVisualization();
            break;
          default:
            console.log(`Unknown control button: ${controlType}`);
        }
      });
    });
  },

  setupHeaderButtons() {
    const headerButtons = document.querySelectorAll(
      ".header-quick-options button"
    );

    headerButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        const actions = ["clearMaze", "randomMaze", "startVisualization"];
        this.handleHeaderAction(actions[index]);
      });
    });
  },

  updateAlgorithmInfo(algorithmKey) {
    const info = AlgorithmInfo[algorithmKey];
    if (!info) return;

    this.updateInfoSection(0, info.title);
    this.updateInfoSection(1, info.history);
    this.updateInfoSection(2, info.howItWorks);
    this.updateInfoSection(3, info.timeComplexity);
    this.updateInfoSection(4, info.spaceComplexity);
    this.updateInfoSection(5, info.funFact);
  },

  updateInfoSection(sectionIndex, content) {
    const infoSections = document.querySelectorAll(".info-panel .info-section");
    if (infoSections[sectionIndex]) {
      const paragraph = infoSections[sectionIndex].querySelector("p");
      if (paragraph) {
        paragraph.textContent = content;
      }
    }
  },

  // ✅ FIX 2: Use data attributes for reliable algorithm highlighting
  highlightActiveAlgorithm(algorithmKey) {
    const algorithmButtons = document.querySelectorAll(".algorithm-option");

    algorithmButtons.forEach((button) => {
      if (button.dataset.algorithm === algorithmKey) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  },

  highlightActiveTool(tool) {
    const toolButtons = document.querySelectorAll(".design-tools");

    toolButtons.forEach((button) => {
      if (button.textContent.toLowerCase() === tool) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  },

  setupSidebarToggles() {
    const toggleOptions = document.getElementById("toggle-options");
    const toggleInfo = document.getElementById("toggle-info");

    toggleOptions.addEventListener("click", () => {
      StateManager.toggleOptionsPanel();
    });

    toggleInfo.addEventListener("click", () => {
      StateManager.toggleInfoPanel();
    });

    // Listen for sidebar state changes
    StateManager.onSidebarStateChange((sidebarStates) => {
      this.updateSidebarVisuals(sidebarStates);
    });
  },

  // In ui/uiManager.js - update the updateSidebarVisuals method
  updateSidebarVisuals(sidebarStates) {
    const optionsPanel = document.querySelector(".options-panel");
    const infoPanel = document.querySelector(".info-panel");
    const toggleOptionsIcon = document.querySelector("#toggle-options i");
    const toggleInfoIcon = document.querySelector("#toggle-info i");

    // Update options panel
    if (sidebarStates.optionsPanelCollapsed) {
      optionsPanel.classList.add("collapsed");
      toggleOptionsIcon.classList.add("rotated");
    } else {
      optionsPanel.classList.remove("collapsed");
      toggleOptionsIcon.classList.remove("rotated");
    }

    // Update info panel
    if (sidebarStates.infoPanelCollapsed) {
      infoPanel.classList.add("collapsed");
      toggleInfoIcon.classList.add("rotated");
    } else {
      infoPanel.classList.remove("collapsed");
      toggleInfoIcon.classList.remove("rotated");
    }
  },

  handleHeaderAction(action) {
    console.log(`🔘 Header action: ${action}`);
    switch (action) {
      case "clearMaze":
        console.log("Clearing maze...");
        this.clearCompletionToast();
        if (window.resetVisualization) {
          window.resetVisualization(); // Clear algorithm visualization first
        }
        const gridManager = StateManager.getGridManager();
        const mazeController = StateManager.getMazeController(); // Use StateManager
        
        if (gridManager && mazeController) {
          gridManager.clearGrid();
          mazeController.redraw();
        } else {
          console.error("GridManager or MazeController not available");
        }
        break;
      case "randomMaze":
        console.log("Generating random maze...");
        this.showMazeTypeSelector();
        break;
      case "startVisualization":
        console.log("Starting visualization from UI...");
        this.startVisualization();
        break;
    }
  },

  startVisualization() {
    console.log("UIManager: startVisualization called");
    if (window.startVisualization) {
      console.log("Calling window.startVisualization...");
      window.startVisualization();
    } else {
      console.error(
        "❌ AlgorithmController not initialized - window.startVisualization is undefined"
      );
    }
  },

  // Add these methods for other controls
  pauseVisualization() {
    if (window.pauseVisualization) {
      window.pauseVisualization();
    }
  },

  resumeVisualization() {
    if (window.resumeVisualization) {
      window.resumeVisualization();
    }
  },

  stopVisualization() {
    if (window.stopVisualization) {
      window.stopVisualization();
    }
  },

  resetVisualization() {
    if (window.resetVisualization) {
      window.resetVisualization();
    }
  },

  // Notification System
  showStatusBar(message, stats = null, closable = true) {
    const statusBar = document.getElementById("status-bar");
    const statusMessage = document.getElementById("status-message");
    const statusStats = document.getElementById("status-stats");

    statusMessage.textContent = message;

    if (stats) {
      statusStats.innerHTML = this.formatStats(stats);
    } else {
      statusStats.innerHTML = "";
    }

    statusBar.classList.remove("hidden");

    // Setup close button
    const closeBtn = document.getElementById("status-close");
    if (closable) {
      closeBtn.style.display = "block";
      closeBtn.onclick = () => this.hideStatusBar();
    } else {
      closeBtn.style.display = "none";
    }
  },

  hideStatusBar() {
    const statusBar = document.getElementById("status-bar");
    statusBar.classList.add("hidden");
  },

  showToast(message, stats = null, duration = 3000) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    const toastStats = document.getElementById("toast-stats");

    toastMessage.textContent = message;

    if (stats) {
      toastStats.innerHTML = this.formatStats(stats, "toast-stat");
    } else {
      toastStats.innerHTML = "";
    }

    toast.classList.remove("hidden");

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        this.hideToast();
      }, duration);
    }
  },

  // In ui/uiManager.js - update showToast and related methods
  showToast(message, stats = null, duration = 3000) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    const toastStats = document.getElementById("toast-stats");
    const toastClose = document.getElementById("toast-close");

    toastMessage.textContent = message;

    if (stats) {
      toastStats.innerHTML = this.formatStats(stats, "toast-stat");
    } else {
      toastStats.innerHTML = "";
    }

    toast.classList.remove("hidden");

    // Setup close button
    toastClose.onclick = () => {
      this.hideToast();
    };

    // Auto-hide after duration (only if duration > 0)
    if (duration > 0) {
      setTimeout(() => {
        this.hideToast();
      }, duration);
    }
  },

  hideToast() {
    const toast = document.getElementById("toast");
    toast.classList.add("hidden");
  },

  // Add method to automatically hide toast when new visualization starts
  clearCompletionToast() {
    // Only hide completion toasts (ones with stats), not temporary ones
    const toast = document.getElementById("toast");
    const toastStats = document.getElementById("toast-stats");

    if (!toast.classList.contains("hidden") && toastStats.innerHTML !== "") {
      this.hideToast();
    }
  },

  formatStats(stats, statClass = "stat-item") {
    let html = "";

    if (stats.visited !== undefined) {
      html += `<div class="${statClass}">👁️ Visited: ${stats.visited}</div>`;
    }
    if (stats.pathLength !== undefined) {
      html += `<div class="${statClass}">🛤️ Path: ${stats.pathLength}</div>`;
    }
    if (stats.steps !== undefined) {
      html += `<div class="${statClass}">⚡ Steps: ${stats.steps}</div>`;
    }
    if (stats.frontierSize !== undefined) {
      html += `<div class="${statClass}">🔍 Frontier: ${stats.frontierSize}</div>`;
    }
    if (stats.executionTime !== undefined) {
      html += `<div class="${statClass}">⏱️ Time: ${stats.executionTime.toFixed(
        2
      )}ms</div>`;
    }

    return html;
  },

  showPauseOverlay() {
    const canvasSection = document.querySelector(".canvas");
    let overlay = canvasSection.querySelector(".canvas-overlay");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "canvas-overlay";
      overlay.innerHTML = "⏸️ PAUSED";
      canvasSection.appendChild(overlay);
    }

    setTimeout(() => {
      overlay.classList.add("visible");
    }, 10);
  },

  hidePauseOverlay() {
    const overlay = document.querySelector(".canvas-overlay");
    if (overlay) {
      overlay.classList.remove("visible");
      // Remove after transition
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    }
  },

  // Enhanced visualization control methods
  pauseVisualization() {
    if (window.pauseVisualization) {
      window.pauseVisualization();
      // this.showStatusBar('⏸️ Visualization Paused', null, true);
      this.clearCompletionToast();
      this.showPauseOverlay();
      this.showToast("Paused", null, 1500);
    }
  },

  resumeVisualization() {
    if (window.resumeVisualization) {
      window.resumeVisualization();
      // this.hideStatusBar();
      this.clearCompletionToast();
      this.hidePauseOverlay();
      this.showToast("Resumed", null, 1500);
    }
  },

  // Update the existing startVisualization to clear old toasts
  startVisualization() {
    console.log("UIManager: startVisualization called");

    // Clear any existing completion toast
    this.clearCompletionToast();

    if (window.startVisualization) {
      // this.showStatusBar('🎯 Algorithm Running...', null, false);
      window.startVisualization();
    } else {
      console.error("❌ AlgorithmController not initialized");
    }
  },

  // Add to ui/uiManager.js - Random Maze Generation
generateRandomMaze(type = "walls") {
  const gridManager = StateManager.getGridManager();
  const mazeController = StateManager.getMazeController();
  if (!gridManager ) {
      console.error("GridManager not available");
      return;
  }

  if (!mazeController) {
    console.error("MazeController not available");
    return;
}

  // Clear any existing visualization
  if (window.resetVisualization) {
      window.resetVisualization();
  }

  // Clear completion toast
  this.clearCompletionToast();

  console.log(`Generating ${type} random maze...`);

  const { rows, columns } = gridManager.getDimensions();
  
  switch(type) {
      case "walls":
          this.generateRandomWalls(gridManager, rows, columns);
          break;
      case "traps":
          this.generateRandomTraps(gridManager, rows, columns);
          break;
      case "perfect":
          this.generatePerfectMaze(gridManager, rows, columns);
          break;
      case "obstacles":
          this.generateRandomObstacles(gridManager, rows, columns);
          break;
      default:
          this.generateRandomWalls(gridManager, rows, columns);
  }

  // Redraw the maze
  mazeController.redraw();
  this.showToast(`Generated ${type} maze`, null, 2000);
},

generateRandomWalls(gridManager, rows, columns) {
  // Clear the grid but keep start and end positions
  const start = gridManager.getStartPosition();
  const end = gridManager.getEndPosition();
  
  gridManager.clearGrid();
  
  // Restore start and end if they existed
  if (start) gridManager.setCell(start.row, start.col, CELL_STATES.START);
  if (end) gridManager.setCell(end.row, end.col, CELL_STATES.END);
  
  // Generate random walls (25% density)
  for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
          // Skip start and end positions
          if ((start && row === start.row && col === start.col) || 
              (end && row === end.row && col === end.col)) {
              continue;
          }
          
          // 25% chance to place a wall
          if (Math.random() < 0.25) {
              gridManager.setCell(row, col, CELL_STATES.WALL);
          }
      }
  }
},

generateRandomTraps(gridManager, rows, columns) {
  // Clear the grid but keep start and end positions
  const start = gridManager.getStartPosition();
  const end = gridManager.getEndPosition();
  
  gridManager.clearGrid();
  
  // Restore start and end if they existed
  if (start) gridManager.setCell(start.row, start.col, CELL_STATES.START);
  if (end) gridManager.setCell(end.row, end.col, CELL_STATES.END);
  
  // Generate random traps (20% density) with random weights
  for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
          // Skip start and end positions
          if ((start && row === start.row && col === start.col) || 
              (end && row === end.row && col === end.col)) {
              continue;
          }
          
          // 20% chance to place a trap
          if (Math.random() < 0.20) {
              gridManager.setCell(row, col, CELL_STATES.TRAP);
              // Set random weight between 3-15
              const randomWeight = Math.floor(Math.random() * 13) + 3;
              const cellKey = gridManager.cellToString(row, col);
              gridManager.cellWeights.set(cellKey, randomWeight);
          }
      }
  }
},

generateRandomObstacles(gridManager, rows, columns) {
  // Clear the grid but keep start and end positions
  const start = gridManager.getStartPosition();
  const end = gridManager.getEndPosition();
  
  gridManager.clearGrid();
  
  // Restore start and end if they existed
  if (start) gridManager.setCell(start.row, start.col, CELL_STATES.START);
  if (end) gridManager.setCell(end.row, end.col, CELL_STATES.END);
  
  // Generate mixed obstacles (30% density total)
  for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
          // Skip start and end positions
          if ((start && row === start.row && col === start.col) || 
              (end && row === end.row && col === end.col)) {
              continue;
          }
          
          const rand = Math.random();
          if (rand < 0.15) {
              // 15% walls
              gridManager.setCell(row, col, CELL_STATES.WALL);
          } else if (rand < 0.30) {
              // 15% traps with random weights
              gridManager.setCell(row, col, CELL_STATES.TRAP);
              const randomWeight = Math.floor(Math.random() * 18) + 3; // 3-20
              const cellKey = gridManager.cellToString(row, col);
              gridManager.cellWeights.set(cellKey, randomWeight);
          }
          // 70% remain empty
      }
  }
},

// Simple perfect maze generator using DFS
generatePerfectMaze(gridManager, rows, columns) {
  // Clear everything
  gridManager.clearGrid();
  
  // Initialize all cells as walls
  for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
          gridManager.setCell(row, col, CELL_STATES.WALL);
      }
  }
  
  // DFS maze generation
  const stack = [];
  const startRow = 1;
  const startCol = 1;
  
  // Start with a cell and mark it as empty
  gridManager.setCell(startRow, startCol, CELL_STATES.EMPTY);
  stack.push({row: startRow, col: startCol});
  
  while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = this.getUnvisitedNeighbors(current.row, current.col, gridManager, rows, columns);
      
      if (neighbors.length > 0) {
          const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
          // Remove wall between current and neighbor
          const wallRow = current.row + (randomNeighbor.row - current.row) / 2;
          const wallCol = current.col + (randomNeighbor.col - current.col) / 2;
          
          gridManager.setCell(wallRow, wallCol, CELL_STATES.EMPTY);
          gridManager.setCell(randomNeighbor.row, randomNeighbor.col, CELL_STATES.EMPTY);
          
          stack.push(randomNeighbor);
      } else {
          stack.pop();
      }
  }
  
  // Set start and end positions
  gridManager.setCell(1, 1, CELL_STATES.START);
  gridManager.setCell(rows - 2, columns - 2, CELL_STATES.END);
},

getUnvisitedNeighbors(row, col, gridManager, rows, columns) {
  const neighbors = [];
  const directions = [
      {row: -2, col: 0}, {row: 2, col: 0}, 
      {row: 0, col: -2}, {row: 0, col: 2}
  ];
  
  for (const dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;
      
      if (newRow > 0 && newRow < rows - 1 && 
          newCol > 0 && newCol < columns - 1 &&
          gridManager.getCell(newRow, newCol) === CELL_STATES.WALL) {
          neighbors.push({row: newRow, col: newCol});
      }
  }
  
  return neighbors;
},

// Show maze type selection
showMazeTypeSelector() {
  const mazeType = prompt(
      "Choose maze type:\n\n" +
      "1. walls - Random walls (25% density)\n" +
      "2. traps - Random traps with varying weights\n" + 
      "3. obstacles - Mixed walls and traps\n" +
      "4. perfect - Perfect maze (no cycles)\n\n" +
      "Enter 1-4 or the type name:",
      "1"
  );
  
  if (mazeType !== null) {
      let type;
      switch(mazeType.toLowerCase()) {
          case "1": case "walls": type = "walls"; break;
          case "2": case "traps": type = "traps"; break;
          case "3": case "obstacles": type = "obstacles"; break;
          case "4": case "perfect": type = "perfect"; break;
          default: type = "walls";
      }
      this.generateRandomMaze(type);
  }
},
};
