// src/lib/algorithms/graph_traversal.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Node representation for graph traversal
 */
export interface GraphNode {
  id: string;
  label: string;
  position?: { x: number; y: number };
}

/**
 * Edge representation for graph traversal
 */
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

/**
 * Input for graph traversal algorithm
 */
export interface GraphTraversalInput {
  nodes: GraphNode[];
  edges: GraphEdge[];
  startNode: string;
  algorithm: 'bfs' | 'dfs';
}

/**
 * State of a node during traversal
 */
export interface NodeState {
  id: string;
  label: string;
  visited: boolean;
  current: boolean;
}

/**
 * State of an edge during traversal
 */
export interface EdgeState {
  id: string;
  source: string;
  target: string;
  traversed: boolean;
}

/**
 * State snapshot for each step of graph traversal
 */
export interface GraphTraversalState {
  nodes: NodeState[];
  edges: EdgeState[];
  queueOrStack: string[];
  visitedOrder: string[];
  currentNode: string | null;
}

/**
 * Build adjacency list for an undirected graph
 */
function buildAdjacencyList(
  nodes: GraphNode[],
  edges: GraphEdge[]
): Map<string, string[]> {
  const adjacencyList = new Map<string, string[]>();

  // Initialize with empty arrays for all nodes
  for (const node of nodes) {
    adjacencyList.set(node.id, []);
  }

  // Add edges (bidirectional for undirected graph)
  for (const edge of edges) {
    const sourceNeighbors = adjacencyList.get(edge.source) ?? [];
    if (!sourceNeighbors.includes(edge.target)) {
      sourceNeighbors.push(edge.target);
      adjacencyList.set(edge.source, sourceNeighbors);
    }

    const targetNeighbors = adjacencyList.get(edge.target) ?? [];
    if (!targetNeighbors.includes(edge.source)) {
      targetNeighbors.push(edge.source);
      adjacencyList.set(edge.target, targetNeighbors);
    }
  }

  return adjacencyList;
}

/**
 * Graph Traversal algorithm visualization implementation
 * BFS and DFS algorithms
 */
export const graphTraversalVisualization: AlgorithmVisualization<
  GraphTraversalInput,
  GraphTraversalState
> = {
  id: 'graph-traversal',
  isAdvanced: true,

  generateSteps(input: GraphTraversalInput): Step<GraphTraversalState>[] {
    const { nodes, edges, startNode, algorithm } = input;
    const steps: Step<GraphTraversalState>[] = [];

    // Build adjacency list
    const adjacencyList = buildAdjacencyList(nodes, edges);

    // Track visited nodes
    const visited = new Set<string>();

    // Container: queue for BFS, stack for DFS
    const container: string[] = [startNode];

    // Track order of visited nodes
    const visitedOrder: string[] = [];

    // Initial state
    steps.push({
      state: {
        nodes: nodes.map((n) => ({
          id: n.id,
          label: n.label,
          visited: false,
          current: n.id === startNode,
        })),
        edges: edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          traversed: false,
        })),
        queueOrStack: [...container],
        visitedOrder: [],
        currentNode: startNode,
      },
      operation: 'init',
      descriptionKey: algorithm === 'bfs' ? 'bfsInit' : 'dfsInit',
      highlights: [],
    });

    // Main traversal loop
    while (container.length > 0) {
      // Get next node: shift for BFS (queue), pop for DFS (stack)
      const currentNode = algorithm === 'bfs' ? container.shift()! : container.pop()!;

      // Skip if already visited
      if (visited.has(currentNode)) {
        continue;
      }

      // Mark as visited
      visited.add(currentNode);
      visitedOrder.push(currentNode);

      // Find traversed edge (the edge that led to this node)
      let traversedEdgeId: string | null = null;
      if (visitedOrder.length > 1) {
        // Find the parent node (the node we came from)
        // For BFS: the node that added this node to queue
        // For DFS: the node we're exploring from
        const parentNode = visitedOrder[visitedOrder.length - 2] ?? null;
        if (parentNode) {
          const edge = edges.find(
            (e) =>
              (e.source === parentNode && e.target === currentNode) ||
              (e.target === parentNode && e.source === currentNode)
          );
          traversedEdgeId = edge?.id ?? null;
        }
      }

      // Add neighbors to container
      const neighbors = adjacencyList.get(currentNode) ?? [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && !container.includes(neighbor)) {
          container.push(neighbor);
        }
      }

      // Record step for visiting this node
      steps.push({
        state: {
          nodes: nodes.map((n) => ({
            id: n.id,
            label: n.label,
            visited: visited.has(n.id),
            current: n.id === currentNode,
          })),
          edges: edges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            traversed: e.id === traversedEdgeId,
          })),
          queueOrStack: [...container],
          visitedOrder: [...visitedOrder],
          currentNode,
        },
        operation: 'visit',
        descriptionKey: algorithm === 'bfs' ? 'bfsVisit' : 'dfsVisit',
        highlights: [visitedOrder.length - 1],
      });
    }

    // Final state
    steps.push({
      state: {
        nodes: nodes.map((n) => ({
          id: n.id,
          label: n.label,
          visited: visited.has(n.id),
          current: false,
        })),
        edges: edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          traversed: true,
        })),
        queueOrStack: [],
        visitedOrder: [...visitedOrder],
        currentNode: null,
      },
      operation: 'complete',
      descriptionKey: algorithm === 'bfs' ? 'bfsComplete' : 'dfsComplete',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: GraphTraversalInput): ValidationResult {
    if (!input.nodes || input.nodes.length === 0) {
      return {
        valid: false,
        error: 'Graph must have at least one node',
        errorKey: 'graphTraversalEmptyNodes',
      };
    }

    // Check if startNode exists
    const startNodeExists = input.nodes.some((n) => n.id === input.startNode);
    if (!startNodeExists) {
      return {
        valid: false,
        error: 'Start node must exist in the graph',
        errorKey: 'graphTraversalInvalidStartNode',
      };
    }

    // Check edge validity
    for (const edge of input.edges) {
      const sourceExists = input.nodes.some((n) => n.id === edge.source);
      const targetExists = input.nodes.some((n) => n.id === edge.target);
      if (!sourceExists || !targetExists) {
        return {
          valid: false,
          error: 'All edges must connect existing nodes',
          errorKey: 'graphTraversalInvalidEdge',
        };
      }
    }

    return { valid: true };
  },

  getInitialState(): GraphTraversalState {
    return {
      nodes: [],
      edges: [],
      queueOrStack: [],
      visitedOrder: [],
      currentNode: null,
    };
  },

  describeStep(step: Step<GraphTraversalState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { currentNode, queueOrStack, visitedOrder } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      bfsInit: {
        en: `Starting BFS from node ${currentNode}. Queue initialized with [${currentNode}].`,
        zh: `从节点 ${currentNode} 开始广度优先搜索（BFS）。队列初始化为 [${currentNode}]。`,
      },
      dfsInit: {
        en: `Starting DFS from node ${currentNode}. Stack initialized with [${currentNode}].`,
        zh: `从节点 ${currentNode} 开始深度优先搜索（DFS）。栈初始化为 [${currentNode}]。`,
      },
      bfsVisit: {
        en: `Visiting node ${currentNode}. Adding unvisited neighbors to queue. Queue: [${queueOrStack.join(', ')}]. Visited order: [${visitedOrder.join(', ')}].`,
        zh: `访问节点 ${currentNode}。将未访问的邻居加入队列。队列：[${queueOrStack.join(', ')}]。访问顺序：[${visitedOrder.join(', ')}]。`,
      },
      dfsVisit: {
        en: `Visiting node ${currentNode}. Adding unvisited neighbors to stack. Stack: [${queueOrStack.join(', ')}]. Visited order: [${visitedOrder.join(', ')}].`,
        zh: `访问节点 ${currentNode}。将未访问的邻居加入栈。栈：[${queueOrStack.join(', ')}]。访问顺序：[${visitedOrder.join(', ')}]。`,
      },
      bfsComplete: {
        en: `BFS complete. All reachable nodes visited in order: [${visitedOrder.join(', ')}].`,
        zh: `广度优先搜索完成。所有可达节点按顺序访问：[${visitedOrder.join(', ')}]。`,
      },
      dfsComplete: {
        en: `DFS complete. All reachable nodes visited in order: [${visitedOrder.join(', ')}].`,
        zh: `深度优先搜索完成。所有可达节点按顺序访问：[${visitedOrder.join(', ')}]。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'Visited nodes = visitedOrder, pending nodes in queue/stack.'
      : '已访问节点 = visitedOrder，待访问节点在队列/栈中。';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(V + E)',
      space: 'O(V)',
      worstCase: 'Visit all vertices and edges',
      worstCaseZh: '访问所有顶点和边',
      bestCase: 'Start node only (isolated node)',
      bestCaseZh: '仅访问起始节点（孤立节点）',
    };
  },
};

/**
 * Default sample graph for visualization
 */
export function createDefaultGraph(): GraphTraversalInput {
  const nodes: GraphNode[] = [
    { id: 'A', label: 'A', position: { x: 250, y: 50 } },
    { id: 'B', label: 'B', position: { x: 100, y: 150 } },
    { id: 'C', label: 'C', position: { x: 400, y: 150 } },
    { id: 'D', label: 'D', position: { x: 100, y: 250 } },
    { id: 'E', label: 'E', position: { x: 250, y: 250 } },
    { id: 'F', label: 'F', position: { x: 400, y: 250 } },
    { id: 'G', label: 'G', position: { x: 250, y: 350 } },
  ];

  const edges: GraphEdge[] = [
    { id: 'e1', source: 'A', target: 'B' },
    { id: 'e2', source: 'A', target: 'C' },
    { id: 'e3', source: 'B', target: 'D' },
    { id: 'e4', source: 'B', target: 'E' },
    { id: 'e5', source: 'C', target: 'F' },
    { id: 'e6', source: 'D', target: 'G' },
    { id: 'e7', source: 'E', target: 'G' },
    { id: 'e8', source: 'F', target: 'G' },
  ];

  return {
    nodes,
    edges,
    startNode: 'A',
    algorithm: 'bfs',
  };
}
