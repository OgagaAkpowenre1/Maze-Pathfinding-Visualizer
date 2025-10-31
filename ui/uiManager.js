// ui/uiManager

import { AlgorithmInfo } from "../algorithms/algorithmInfo.js";
import { AlgorithmData } from "../algorithms/algorithmData.js";
import { StateManager } from "./stateManager.js";

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
        StateManager.setActiveTool(tool);
        this.highlightActiveTool(tool);
      });
    });
  },

  setupMazeConfigInputs() {
    const rowsInput = document.getElementById("rows");
    const columnsInput = document.getElementById("columns");
    const applyButton = document.getElementById("apply-size");

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
    const controlButtons = document.querySelectorAll('.controls button[data-control]');
    
    controlButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const controlType = e.target.dataset.control;
        console.log(`Controls button clicked: ${controlType}`);
        
        switch(controlType) {
          case 'pause':
            this.pauseVisualization();
            break;
          case 'resume':
            this.resumeVisualization();
            break;
          case 'visualize':
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
      if (this.gridManager && this.mazeController) {
        this.gridManager.clearGrid();
        this.mazeController.redraw();
      } else {
        console.error("GridManager or MazeController not available");
      }
      break;
      case "randomMaze":
        console.log("Generating random maze...");
        // TODO: Implement random maze generation
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
    const statusBar = document.getElementById('status-bar');
    const statusMessage = document.getElementById('status-message');
    const statusStats = document.getElementById('status-stats');
    
    statusMessage.textContent = message;
    
    if (stats) {
        statusStats.innerHTML = this.formatStats(stats);
    } else {
        statusStats.innerHTML = '';
    }
    
    statusBar.classList.remove('hidden');
    
    // Setup close button
    const closeBtn = document.getElementById('status-close');
    if (closable) {
        closeBtn.style.display = 'block';
        closeBtn.onclick = () => this.hideStatusBar();
    } else {
        closeBtn.style.display = 'none';
    }
},

hideStatusBar() {
    const statusBar = document.getElementById('status-bar');
    statusBar.classList.add('hidden');
},

showToast(message, stats = null, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastStats = document.getElementById('toast-stats');
    
    toastMessage.textContent = message;
    
    if (stats) {
        toastStats.innerHTML = this.formatStats(stats, 'toast-stat');
    } else {
        toastStats.innerHTML = '';
    }
    
    toast.classList.remove('hidden');
    
    // Auto-hide after duration
    if (duration > 0) {
        setTimeout(() => {
            this.hideToast();
        }, duration);
    }
},

// In ui/uiManager.js - update showToast and related methods
showToast(message, stats = null, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastStats = document.getElementById('toast-stats');
  const toastClose = document.getElementById('toast-close');
  
  toastMessage.textContent = message;
  
  if (stats) {
      toastStats.innerHTML = this.formatStats(stats, 'toast-stat');
  } else {
      toastStats.innerHTML = '';
  }
  
  toast.classList.remove('hidden');
  
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
  const toast = document.getElementById('toast');
  toast.classList.add('hidden');
},

// Add method to automatically hide toast when new visualization starts
clearCompletionToast() {
  // Only hide completion toasts (ones with stats), not temporary ones
  const toast = document.getElementById('toast');
  const toastStats = document.getElementById('toast-stats');
  
  if (!toast.classList.contains('hidden') && toastStats.innerHTML !== '') {
      this.hideToast();
  }
},

formatStats(stats, statClass = 'stat-item') {
    let html = '';
    
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
        html += `<div class="${statClass}">⏱️ Time: ${stats.executionTime.toFixed(2)}ms</div>`;
    }
    
    return html;
},

showPauseOverlay() {
    const canvasSection = document.querySelector('.canvas');
    let overlay = canvasSection.querySelector('.canvas-overlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'canvas-overlay';
        overlay.innerHTML = '⏸️ PAUSED';
        canvasSection.appendChild(overlay);
    }
    
    setTimeout(() => {
        overlay.classList.add('visible');
    }, 10);
},

hidePauseOverlay() {
    const overlay = document.querySelector('.canvas-overlay');
    if (overlay) {
        overlay.classList.remove('visible');
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
        this.showToast('Paused', null, 1500);
    }
},

resumeVisualization() {
    if (window.resumeVisualization) {
        window.resumeVisualization();
        // this.hideStatusBar();
        this.clearCompletionToast();
        this.hidePauseOverlay();
        this.showToast('Resumed', null, 1500);
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
}
};
