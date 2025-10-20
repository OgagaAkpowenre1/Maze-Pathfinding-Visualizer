// algorithms/algorithmInfo.js

const AlgorithmInfo = {
    BFS: {
        title: "Breadth First Search (BFS)",
        history: "BFS was first invented in the 1940s for solving problems in graph theory. It was formally presented by Edward F. Moore in 1959 for finding the shortest path out of a maze.",
        howItWorks: "BFS explores the graph level by level. It starts at the root node and visits all neighbors at the present depth prior to moving on to nodes at the next depth level. It uses a queue data structure to keep track of nodes to visit.",
        timeComplexity: "O(V + E) where V is vertices and E is edges",
        spaceComplexity: "O(V) in worst case",
        funFact: "BFS is guaranteed to find the shortest path in unweighted graphs. It's commonly used in peer-to-peer networks and web crawling.",
        bestFor: "Unweighted graphs, shortest path problems, connected components"
    },
    DFS: {
        title: "Depth First Search (DFS)",
        history: "DFS was first investigated in the 19th century by French mathematician Charles Pierre Trémaux as a strategy for solving mazes. It was later formalized for computer science applications.",
        howItWorks: "DFS goes deep into a path before backtracking. It starts at the root node and explores as far as possible along each branch before backtracking. It uses a stack data structure, either explicitly or via recursion.",
        timeComplexity: "O(V + E) where V is vertices and E is edges", 
        spaceComplexity: "O(V) in worst case",
        funFact: "DFS is not optimal for finding shortest paths but is great for topology sorting, solving puzzles, and path existence problems.",
        bestFor: "Cycle detection, topological sorting, path existence, puzzle solving"
    },
    DIJKSTRA: {
        title: "Dijkstra's Algorithm",
        history: "Conceived by computer scientist Edsger W. Dijkstra in 1956 and published in 1959. He designed it to show the power of the ARMAC computer without thinking about the problem in terms of graphs.",
        howItWorks: "Dijkstra's algorithm maintains a set of visited nodes and a priority queue of unvisited nodes. It repeatedly selects the unvisited node with the smallest known distance, updates its neighbors' distances, and marks it as visited.",
        timeComplexity: "O((V + E) log V) with binary heap",
        spaceComplexity: "O(V)",
        funFact: "Dijkstra originally designed the algorithm without a priority queue, giving it O(V²) time complexity. The use of a min-heap optimization came later.",
        bestFor: "Weighted graphs, GPS navigation, network routing protocols"
    },
    ASTAR: {
        title: "A* Search Algorithm",
        history: "A* was first described in 1968 by Peter Hart, Nils Nilsson, and Bertram Raphael. It combines features of uniform-cost search and pure heuristic search.",
        howItWorks: "A* uses a best-first search and finds the least-cost path using a heuristic function. It evaluates nodes by combining g(n) (cost to reach node) and h(n) (estimated cost to goal): f(n) = g(n) + h(n).",
        timeComplexity: "O(b^d) where b is branching factor and d is solution depth",
        spaceComplexity: "O(b^d)",
        funFact: "A* is widely used in video games for pathfinding. The quality of the heuristic greatly affects performance - the better the heuristic, the fewer nodes expanded.",
        bestFor: "Pathfinding in games, robotics, puzzle solving with good heuristics"
    }
};