// Import everything at the top
import GridManager from "./canvas/gridManager.js";
import { CELL_STATES } from "./canvas/cellStates.js";
import { AlgorithmData } from "./algorithms/algorithmData.js";
import { AlgorithmInfo } from "./algorithms/algorithmInfo.js";
import { StateManager } from "./ui/stateManager.js";
import { UIManager } from "./ui/uiManager.js";

// Custom debug function
// Enhanced debug function with file and line information
function debug(...args) {
  // Get stack trace to find caller information
  const stack = new Error().stack;
  let callerInfo = 'unknown';
  
  try {
    // Parse stack trace to get the calling file and line
    const stackLines = stack.split('\n');
    // The 4th line (index 3) is usually where debug() was called from
    if (stackLines.length >= 4) {
      const callerLine = stackLines[3].trim();
      // Extract file and line number
      const match = callerLine.match(/\((.*):(\d+):(\d+)\)$/);
      if (match) {
        const filePath = match[1];
        const lineNumber = match[2];
        // Extract just the filename from the path
        const fileName = filePath.split('/').pop() || filePath;
        callerInfo = `${fileName}:${lineNumber}`;
      }
    }
  } catch (e) {
    callerInfo = 'stack_parse_error';
  }
  
  // Process each argument to handle objects properly
  const processedArgs = args.map(arg => {
    if (typeof arg === 'object' && arg !== null) {
      try {
        return JSON.stringify(arg, null, 2);
      } catch (e) {
        return `[Object: ${Object.prototype.toString.call(arg)}]`;
      }
    }
    return String(arg);
  });
  
  const message = processedArgs.join(' ');
  
  // Create or get debug panel
  let debugPanel = document.getElementById('debug-panel');
  if (!debugPanel) {
    debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      width: 500px;
      height: 300px;
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 10px;
      overflow: auto;
      z-index: 10000;
      font-family: monospace;
      font-size: 11px;
      border: 1px solid #555;
      line-height: 1.3;
    `;
    
    // Add a clear button
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';
    clearBtn.style.cssText = 'position:absolute; top:5px; right:5px; font-size:10px; padding:2px 5px;';
    clearBtn.onclick = () => debugPanel.innerHTML = '';
    debugPanel.appendChild(clearBtn);
    
    document.body.appendChild(debugPanel);
  }
  
  // Add message with timestamp and caller info
  const timestamp = new Date().toLocaleTimeString();
  const messageElement = document.createElement('div');
  messageElement.innerHTML = `
    <span style="color: #888">[${timestamp}]</span>
    <span style="color: #4CAF50">${callerInfo}</span>
    <span style="color: white">${message}</span>
  `;
  messageElement.style.marginBottom = '3px';
  messageElement.style.borderLeft = '3px solid #4CAF50';
  messageElement.style.paddingLeft = '5px';
  
  debugPanel.appendChild(messageElement);
  debugPanel.scrollTop = debugPanel.scrollHeight;
  
  // Keep only last 100 messages
  if (debugPanel.children.length > 100) {
    debugPanel.removeChild(debugPanel.firstChild);
  }
  
  // Also try console.log with enhanced info
  try {
    console.log(`[${callerInfo}]`, ...args);
  } catch (e) {
    // Ignore console errors
  }
}

// Error-catching version that shows where errors occur
function debugError(context, error) {
  debug(`❌ ERROR in ${context}:`, error.message || error);
  debug('Stack trace:', error.stack);
}

// Global error handler to catch all unhandled errors
window.addEventListener('error', function(e) {
  debugError('UNCAUGHT_ERROR', e.error);
  return false;
});

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
  debugError('UNHANDLED_PROMISE', e.reason);
});

// Override console.error to also log to our debug panel
const originalConsoleError = console.error;
console.error = function(...args) {
  originalConsoleError.apply(console, args);
  debug('🚨 CONSOLE.ERROR:', ...args);
};

// Main application initialization
document.addEventListener("DOMContentLoaded", function () {
  debug("DOM Content Loaded - Starting application initialization...");

  try {
    // Initialize UI Manager
    debug("Initializing UI Manager...");
    UIManager.init();

    // Set up state change listeners
    StateManager.onAlgorithmChange = (algorithm) => {
      debug("Algorithm changed to:", algorithm);
    };

    StateManager.onToolChange = (tool) => {
      debug("Active tool changed to:", tool);
    };

    StateManager.onMazeConfigChange = (config) => {
      debug("Maze config changed:", config);
    };

    StateManager.onSpeedChange = (speed) => {
      debug("Speed changed to:", speed);
    };

    // Log initial state - now objects will show properly!
    debug("Application initialized");
    debug("Current algorithm:", StateManager.getCurrentAlgorithm());
    debug("Maze config object:", StateManager.getMazeConfig());
    debug("Full app state:", StateManager);

    // Test grid functionality
    debug("Testing grid functionality...");
    const gridManager = new GridManager(5, 5);

    // Set some walls
    gridManager.setCell(0, 1, CELL_STATES.WALL);
    gridManager.setCell(1, 1, CELL_STATES.WALL);

    // Set start and end
    gridManager.setCell(0, 0, CELL_STATES.START);
    gridManager.setCell(4, 4, CELL_STATES.END);

    // Get cell state
    debug("Start cell state:", gridManager.getCell(0, 0));
    debug("Ready for pathfinding:", gridManager.isReadyForPathfinding());
    debug("Full grid state:", gridManager.grid);

    debug("🎉 Application fully initialized and working!");

  } catch (error) {
    // This will now show exactly where the error occurred
    debugError("MAIN_INIT", error);
  }
});