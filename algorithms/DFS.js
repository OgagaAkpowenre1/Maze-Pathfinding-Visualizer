// algorithms/DFS.js
import PathfinderBase from './PathfinderBase.js';

export default class DFS extends PathfinderBase {
    initialize() {
        console.log("🔄 DFS.initialize() called");
        
        // Reset data structures
        this.visited.clear();
        this.cameFrom.clear();
        this.frontier = []; // Use as stack
        this.path = [];
        
        // Start with the start node
        const startKey = this.cellToString(this.start);
        this.visited.add(startKey);
        this.frontier.push(this.start); // Push to stack
        
        this.currentNode = null;
        
        console.log("✅ DFS initialized:", {
            start: this.start,
            end: this.end,
            stackSize: this.frontier.length,
            visited: Array.from(this.visited)
        });
    }

    executeStep() {
        console.log("🔄 DFS.executeStep() called");
        console.log("Current state:", {
            stackLength: this.frontier.length,
            visitedCount: this.visited.size,
            currentNode: this.currentNode
        });

        // If stack is empty, no path exists
        if (this.frontier.length === 0) {
            console.log("❌ Stack empty - no path exists");
            return { complete: true, success: false };
        }
        
        // Pop from stack (LIFO - Last In First Out)
        this.currentNode = this.frontier.pop(); // Different from BFS: pop() instead of shift()
        console.log("Processing node:", this.currentNode);
        
        // Check if we reached the end
        if (this.isEndNode(this.currentNode)) {
            console.log("🎉 Found end node!");
            return { complete: true, success: true };
        }
        
        // Explore neighbors
        const neighbors = this.getNeighbors(this.currentNode.row, this.currentNode.col);
        console.log("Neighbors found:", neighbors);
        
        for (const neighbor of neighbors) {
            const neighborKey = this.cellToString(neighbor);
            
            if (!this.visited.has(neighborKey)) {
                console.log("Adding new neighbor to stack:", neighbor);
                // Mark as visited and record where we came from
                this.visited.add(neighborKey);
                this.cameFrom.set(neighborKey, this.currentNode);
                this.frontier.push(neighbor); // Push to stack
            }
        }
        
        console.log("Stack after step:", this.frontier);
        console.log("Visited after step:", Array.from(this.visited));
        
        return { complete: false };
    }

    getCurrentNode() {
        return this.currentNode;
    }

    reset() {
        this.initialize();
    }
}