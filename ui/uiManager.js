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

  handleHeaderAction(action) {
    console.log(`Header action: ${action}`);
    switch (action) {
      case "clearMaze":
        // Clear maze logic
        break;
      case "randomMaze":
        // Generate random maze
        break;
      case "startVisualization":
        // Start algorithm visualization
        break;
    }
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
};
