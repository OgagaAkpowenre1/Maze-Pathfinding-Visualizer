// ui/uiManager.js
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
        
        // Set initial state
        this.updateAlgorithmInfo('BFS');
        this.highlightActiveAlgorithm('BFS');
    },

    setupAlgorithmButtons() {
        const algorithmButtons = document.querySelectorAll('.algorithm-option');
        
        algorithmButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const algorithmText = e.target.textContent;
                const algorithmKey = this.getAlgorithmKeyFromText(algorithmText);
                
                if (algorithmKey) {
                    StateManager.setCurrentAlgorithm(algorithmKey);
                    this.updateAlgorithmInfo(algorithmKey);
                    this.highlightActiveAlgorithm(algorithmKey);
                }
            });
        });
    },

    setupToolButtons() {
        const toolButtons = document.querySelectorAll('.design-tools');
        
        toolButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tool = e.target.textContent.toLowerCase();
                StateManager.setActiveTool(tool);
                this.highlightActiveTool(tool);
            });
        });
    },

    setupMazeConfigInputs() {
        const rowsInput = document.getElementById('rows');
        const columnsInput = document.getElementById('columns');

        [rowsInput, columnsInput].forEach(input => {
            input.addEventListener('change', (e) => {
                const config = {
                    rows: parseInt(rowsInput.value) || 4,
                    columns: parseInt(columnsInput.value) || 4
                };
                StateManager.setMazeConfig(config);
            });
        });
    },

    setupSpeedControl() {
        const speedInput = document.getElementById('speed');
        
        speedInput.addEventListener('input', (e) => {
            const speed = parseInt(e.target.value);
            StateManager.setVisualizationSpeed(speed);
        });
    },

    setupHeaderButtons() {
        // Quick action buttons in header
        const headerButtons = document.querySelectorAll('.header-quick-options button');
        
        headerButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const actions = ['clearMaze', 'randomMaze', 'startVisualization'];
                this.handleHeaderAction(actions[index]);
            });
        });
    },

    getAlgorithmKeyFromText(text) {
        const algorithmMap = {
            'Breadth First Search': 'BFS',
            'Depth First Search': 'DFS',
            'Dijkstra': 'DIJKSTRA',
            'A*': 'ASTAR'
        };
        return algorithmMap[text];
    },

    updateAlgorithmInfo(algorithmKey) {
        const info = AlgorithmInfo[algorithmKey];
        if (!info) return;

        // Update info panel sections
        this.updateInfoSection(0, info.title);
        this.updateInfoSection(1, info.history);
        this.updateInfoSection(2, info.howItWorks);
        this.updateInfoSection(3, info.timeComplexity);
        this.updateInfoSection(4, info.spaceComplexity);
        this.updateInfoSection(5, info.funFact);
    },

    updateInfoSection(sectionIndex, content) {
        const infoSections = document.querySelectorAll('.info-panel .info-section');
        if (infoSections[sectionIndex]) {
            const paragraph = infoSections[sectionIndex].querySelector('p');
            if (paragraph) {
                paragraph.textContent = content;
            }
        }
    },

    highlightActiveAlgorithm(algorithmKey) {
        const algorithmButtons = document.querySelectorAll('.algorithm-option');
        const targetText = AlgorithmData[algorithmKey]?.name;
        
        algorithmButtons.forEach(button => {
            if (button.textContent === targetText) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    },

    highlightActiveTool(tool) {
        const toolButtons = document.querySelectorAll('.design-tools');
        
        toolButtons.forEach(button => {
            if (button.textContent.toLowerCase() === tool) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    },

    handleHeaderAction(action) {
        console.log(`Header action: ${action}`);
        // These will be connected to canvas functionality later
        switch(action) {
            case 'clearMaze':
                // Clear maze logic
                break;
            case 'randomMaze':
                // Generate random maze
                break;
            case 'startVisualization':
                // Start algorithm visualization
                break;
        }
    }
};