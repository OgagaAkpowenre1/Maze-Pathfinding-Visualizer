// algorithms/algorithmData.js

const AlgorithmData = {
    BFS: {
        id: 'bfs',
        name: 'Breadth First Search',
        description: 'Explores all neighbors at current depth before moving deeper',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        guaranteesShortestPath: true,
        weighted: false,
        directed: false
    },
    DFS: {
        id: 'dfs', 
        name: 'Depth First Search',
        description: 'Explores as far as possible along each branch before backtracking',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        guaranteesShortestPath: false,
        weighted: false,
        directed: false
    },
    DIJKSTRA: {
        id: 'dijkstra',
        name: 'Dijkstra\'s Algorithm',
        description: 'Finds shortest path in weighted graphs using greedy approach',
        timeComplexity: 'O((V + E) log V)',
        spaceComplexity: 'O(V)',
        guaranteesShortestPath: true,
        weighted: true,
        directed: false
    },
    ASTAR: {
        id: 'astar',
        name: 'A* Search',
        description: 'Uses heuristics to find optimal path more efficiently',
        timeComplexity: 'O(b^d)',
        spaceComplexity: 'O(b^d)',
        guaranteesShortestPath: true,
        weighted: true,
        directed: false
    }
};