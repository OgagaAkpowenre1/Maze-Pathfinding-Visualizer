// algorithms/AStar.js
import PathfinderBase from './PathfinderBase.js';

export default class AStar extends PathfinderBase {
    initialize() {
        console.log("🔄 AStar.initialize() called");
        
        // Reset data structures
        this.visited.clear();
        this.cameFrom.clear();
        this.path = [];
        
        // A*-specific data structures
        this.gScore = new Map(); // Actual cost from start to node
        this.fScore = new Map(); // Estimated total cost (g + h)
        this.openSet = [];       // Priority queue of nodes to evaluate
        
        // Initialize all nodes with infinite cost
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const cellKey = this.cellToString({row, col});
                this.gScore.set(cellKey, Infinity);
                this.fScore.set(cellKey, Infinity);
            }
        }
        
        // Start node has gScore = 0, fScore = heuristic to end
        const startKey = this.cellToString(this.start);
        const endKey = this.cellToString(this.end);
        
        this.gScore.set(startKey, 0);
        this.fScore.set(startKey, this.heuristic(this.start, this.end));
        
        // Start with just the start node
        this.openSet.push({
            cell: this.start,
            fScore: this.fScore.get(startKey)
        });
        
        this.currentNode = null;
        
        console.log("✅ AStar initialized");
    }

    executeStep() {
        console.log("🔄 AStar.executeStep() called");
        
        // If open set is empty, no path exists
        if (this.openSet.length === 0) {
            console.log("❌ Open set empty - no path exists");
            return { complete: true, success: false };
        }
        
        // Get node with lowest fScore (most promising)
        this.openSet.sort((a, b) => a.fScore - b.fScore);
        const { cell: current } = this.openSet.shift();
        this.currentNode = current;
        
        const currentKey = this.cellToString(current);
        
        // Check if we reached the end
        if (this.isEndNode(current)) {
            console.log("🎉 Found end node!");
            return { complete: true, success: true };
        }
        
        // Mark as visited
        this.visited.add(currentKey);
        
        // Explore neighbors
        const neighbors = this.getNeighbors(current.row, current.col);
        
        for (const neighbor of neighbors) {
            const neighborKey = this.cellToString(neighbor);
            
            // Skip if already visited (in closed set)
            if (this.visited.has(neighborKey)) {
                continue;
            }
            
            // Calculate tentative gScore
            const cellWeight = this.gridManager.getCellWeight(neighbor.row, neighbor.col);
            const tentativeGScore = this.gScore.get(currentKey) + cellWeight;
            
            // If this path to neighbor is better than any previous one
            if (tentativeGScore < this.gScore.get(neighborKey)) {
                // This path is better, record it!
                this.cameFrom.set(neighborKey, current);
                this.gScore.set(neighborKey, tentativeGScore);
                this.fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor, this.end));
                
                // Add to open set if not already there
                if (!this.openSet.some(item => this.isEqual(item.cell, neighbor))) {
                    this.openSet.push({
                        cell: neighbor,
                        fScore: this.fScore.get(neighborKey)
                    });
                }
            }
        }
        
        // Update frontier for visualization
        this.frontier = this.openSet.map(item => item.cell);
        
        return { complete: false };
    }

    // Manhattan distance heuristic
    heuristic(a, b) {
        return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
    }

    getCurrentNode() {
        return this.currentNode;
    }

    reset() {
        this.initialize();
    }
}