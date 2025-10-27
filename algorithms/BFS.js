// algorithms/BFS.js
import PathfinderBase from './PathfinderBase.js';

export default class BFS extends PathfinderBase {
    initialize() {
        // Reset data structures
        this.visited.clear();
        this.cameFrom.clear();
        this.path = [];
        
        // BFS uses a queue (FIFO) - use frontier array as the queue
        this.frontier = [];
        
        // Start with the start node
        const startKey = this.cellToString(this.start);
        this.visited.add(startKey);
        this.frontier.push(this.start);  // Use frontier instead of separate queue
        
        this.currentNode = null;
    }

    executeStep() {
        // If queue is empty, no path exists
        if (this.frontier.length === 0) {
            return { complete: true, success: false };
        }
        
        // Dequeue the next node (FIFO)
        this.currentNode = this.frontier.shift();
        
        // Check if we reached the end
        if (this.isEndNode(this.currentNode)) {
            return { complete: true, success: true };
        }
        
        // Explore neighbors
        const neighbors = this.getNeighbors(this.currentNode.row, this.currentNode.col);
        
        for (const neighbor of neighbors) {
            const neighborKey = this.cellToString(neighbor);
            
            if (!this.visited.has(neighborKey)) {
                // Mark as visited and record where we came from
                this.visited.add(neighborKey);
                this.cameFrom.set(neighborKey, this.currentNode);
                this.frontier.push(neighbor);
            }
        }
        
        return { complete: false };
    }

    getCurrentNode() {
        return this.currentNode;
    }

    reset() {
        this.initialize();
    }
}