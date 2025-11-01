// algorithms/Dijkstra.js
import PathfinderBase from './PathfinderBase.js';

export default class Dijkstra extends PathfinderBase {
    initialize() {
        console.log("🔄 Dijkstra.initialize() called");
        
        // Reset data structures
        this.visited.clear();
        this.cameFrom.clear();
        this.path = [];
        
        // Dijkstra-specific data structures
        this.distances = new Map(); // Track shortest distance to each node
        this.priorityQueue = [];    // Min-heap (we'll use array and sort for simplicity)
        
        // Initialize distances: start node = 0, all others = Infinity
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const cellKey = this.cellToString({row, col});
                this.distances.set(cellKey, Infinity);
            }
        }
        
        const startKey = this.cellToString(this.start);
        this.distances.set(startKey, 0);
        
        // Start with the start node (distance = 0)
        this.priorityQueue.push({
            cell: this.start,
            distance: 0
        });
        
        this.currentNode = null;
        
        console.log("✅ Dijkstra initialized:", {
            start: this.start,
            end: this.end,
            queueSize: this.priorityQueue.length
        });
    }

    executeStep() {
        console.log("🔄 Dijkstra.executeStep() called");
        
        // If priority queue is empty, no path exists
        if (this.priorityQueue.length === 0) {
            console.log("❌ Priority queue empty - no path exists");
            return { complete: true, success: false };
        }
        
        // Sort by distance (min-heap simulation)
        this.priorityQueue.sort((a, b) => a.distance - b.distance);
        
        // Get node with smallest distance
        const { cell: current } = this.priorityQueue.shift();
        this.currentNode = current;
        
        const currentKey = this.cellToString(current);
        
        // Skip if already visited
        if (this.visited.has(currentKey)) {
            return { complete: false };
        }
        
        // Mark as visited
        this.visited.add(currentKey);
        console.log("Processing node:", current, "with distance:", this.distances.get(currentKey));
        
        // Check if we reached the end
        if (this.isEndNode(current)) {
            console.log("🎉 Found end node!");
            return { complete: true, success: true };
        }
        
        // Explore neighbors
        const neighbors = this.getNeighbors(current.row, current.col);
        console.log("Neighbors found:", neighbors);
        
        for (const neighbor of neighbors) {
            const neighborKey = this.cellToString(neighbor);
            
            if (!this.visited.has(neighborKey)) {
                // Calculate new distance (current distance + edge weight)
                // For now, all edges have weight 1 (unweighted graph)
                const newDistance = this.distances.get(currentKey) + 1;
                const currentDistance = this.distances.get(neighborKey);
                
                // If we found a shorter path to this neighbor
                if (newDistance < currentDistance) {
                    console.log("Updating distance for neighbor:", neighbor, "from", currentDistance, "to", newDistance);
                    
                    this.distances.set(neighborKey, newDistance);
                    this.cameFrom.set(neighborKey, current);
                    
                    // Add to priority queue
                    this.priorityQueue.push({
                        cell: neighbor,
                        distance: newDistance
                    });
                }
            }
        }
        
        // Update frontier for visualization (convert priority queue to cell array)
        this.frontier = this.priorityQueue.map(item => item.cell);
        
        console.log("Priority queue after step:", this.priorityQueue);
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