// src/components/algorithms/GraphTraversal.tsx

import { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  Handle,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { Play, RotateCcw, Shuffle, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { StepController } from '../common/StepController';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { ValidationMessage } from '../common/ValidationMessage';
import {
  graphTraversalVisualization,
  GraphTraversalInput,
  GraphTraversalState,
  GraphNode,
  GraphEdge,
  createDefaultGraph,
} from '../../lib/algorithms/graph_traversal';
import { Step } from '../../lib/algorithms/types';
import { cn } from '../../lib/utils';

// Dagre layout configuration
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 60;
const nodeHeight = 60;

function layoutNodes(nodes: GraphNode[], edges: GraphEdge[]): GraphNode[] {
  dagreGraph.setGraph({ rankdir: 'TB', ranksep: 80, nodesep: 50 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });
}

// Custom node component
function GraphNodeComponent({ data }: { data: { label: string; visited: boolean; current: boolean } }) {
  const { visited, current } = data;

  let bgColor = 'bg-white';
  let borderColor = 'border-gray-300';
  let textColor = 'text-gray-800';

  if (current) {
    bgColor = 'bg-yellow-400';
    borderColor = 'border-yellow-600';
    textColor = 'text-gray-900';
  } else if (visited) {
    bgColor = 'bg-green-500';
    borderColor = 'border-green-700';
    textColor = 'text-white';
  }

  return (
    <>
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div
        className={cn(
          'w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all duration-300',
          bgColor,
          borderColor,
          textColor,
          current && 'ring-4 ring-yellow-300 animate-pulse'
        )}
      >
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </>
  );
}

const nodeTypes = {
  graphNode: GraphNodeComponent,
};

export function GraphTraversal() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Default graph
  const defaultGraph = useMemo(() => createDefaultGraph(), []);

  // Graph input state
  const [nodesInput, setNodesInput] = useState<GraphNode[]>(defaultGraph.nodes);
  const [edgesInput, setEdgesInput] = useState<GraphEdge[]>(defaultGraph.edges);
  const [startNode, setStartNode] = useState<string>(defaultGraph.startNode);
  const [algorithm, setAlgorithm] = useState<'bfs' | 'dfs'>('bfs');

  // Node editing state
  const [newNodeId, setNewNodeId] = useState('');
  const [newEdgeSource, setNewEdgeSource] = useState('');
  const [newEdgeTarget, setNewEdgeTarget] = useState('');

  // Step state
  const [steps, setSteps] = useState<Step<GraphTraversalState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);
  const [validationValue, setValidationValue] = useState('');

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const input: GraphTraversalInput = {
      nodes: nodesInput,
      edges: edgesInput,
      startNode,
      algorithm,
    };
    const validation = graphTraversalVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = graphTraversalVisualization.generateSteps(input);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
      setValidationErrorKey(null);
    } else {
      setSteps([]);
      setCurrentStep(0);
      setIsPlaying(false);
      setValidationErrorKey(validation.errorKey ?? 'invalidInput');
    }
  }, [nodesInput, edgesInput, startNode, algorithm]);

  // Initialize on mount
  useEffect(() => {
    regenerateSteps();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-generate when algorithm changes
  useEffect(() => {
    regenerateSteps();
  }, [algorithm, startNode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Play/pause interval
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const interval = 1000 / speed;
      const timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, interval);
      return () => clearInterval(timer);
    }
  }, [isPlaying, speed, steps.length, currentStep]);

  // Derived state
  const currentState: GraphTraversalState =
    steps[currentStep]?.state ?? graphTraversalVisualization.getInitialState();
  const currentStepData = steps[currentStep] ?? null;
  const totalSteps = steps.length;
  const validationMessages = useMemo(
    () => ({
      ...t,
      graphTraversalNodeDuplicate: (
        t.graphTraversalNodeDuplicate || 'Node {0} already exists'
      ).replace('{0}', validationValue),
    }),
    [t, validationValue]
  );

  // Update ReactFlow nodes based on current state
  useEffect(() => {
    const layoutedNodes = layoutNodes(nodesInput, edgesInput);
    const flowNodes: Node[] = layoutedNodes.map((node) => {
      const nodeState = currentState.nodes.find((n) => n.id === node.id);
      return {
        id: node.id,
        type: 'graphNode',
        position: node.position ?? { x: 0, y: 0 },
        data: {
          label: node.label,
          visited: nodeState?.visited ?? false,
          current: nodeState?.current ?? false,
        },
      };
    });
    setNodes(flowNodes);
  }, [nodesInput, edgesInput, currentState.nodes, setNodes]);

  // Update ReactFlow edges based on current state
  useEffect(() => {
    const flowEdges: Edge[] = edgesInput.map((edge) => {
      const edgeState = currentState.edges.find((e) => e.id === edge.id);
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        animated: edgeState?.traversed ?? false,
        style: {
          stroke: edgeState?.traversed ? '#22c55e' : '#94a3b8',
          strokeWidth: edgeState?.traversed ? 3 : 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeState?.traversed ? '#22c55e' : '#94a3b8',
        },
      };
    });
    setEdges(flowEdges);
  }, [edgesInput, currentState.edges, setEdges]);

  // Actions
  const play = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep, totalSteps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const stepBackward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const seek = useCallback(
    (step: number) => {
      setIsPlaying(false);
      setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
    },
    [totalSteps]
  );

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  // Add node
  const handleAddNode = useCallback(() => {
    const normalizedNodeId = newNodeId.trim().toUpperCase();
    if (!normalizedNodeId) {
      setValidationValue('');
      setValidationErrorKey('graphTraversalNodeRequired');
      return;
    }
    if (nodesInput.some((n) => n.id === normalizedNodeId)) {
      setValidationValue(normalizedNodeId);
      setValidationErrorKey('graphTraversalNodeDuplicate');
      return;
    }

    const newNode: GraphNode = {
      id: normalizedNodeId,
      label: normalizedNodeId,
    };
    setNodesInput((prev) => [...prev, newNode]);
    setNewNodeId('');
    setValidationValue('');
    setValidationErrorKey(null);
  }, [newNodeId, nodesInput]);

  // Remove node
  const handleRemoveNode = useCallback(
    (nodeId: string) => {
      setNodesInput((prev) => prev.filter((n) => n.id !== nodeId));
      setEdgesInput((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId));
      if (startNode === nodeId && nodesInput.length > 1) {
        const remainingNodes = nodesInput.filter((n) => n.id !== nodeId);
        setStartNode(remainingNodes[0].id);
      }
    },
    [startNode, nodesInput]
  );

  // Add edge
  const handleAddEdge = useCallback(() => {
    if (!newEdgeSource || !newEdgeTarget) return;
    if (newEdgeSource === newEdgeTarget) return;

    const edgeId = `e${newEdgeSource}-${newEdgeTarget}`;
    if (edgesInput.some((e) => e.id === edgeId)) return;

    const newEdge: GraphEdge = {
      id: edgeId,
      source: newEdgeSource,
      target: newEdgeTarget,
    };
    setEdgesInput((prev) => [...prev, newEdge]);
    setNewEdgeSource('');
    setNewEdgeTarget('');
  }, [newEdgeSource, newEdgeTarget, edgesInput]);

  // Remove edge
  const handleRemoveEdge = useCallback((edgeId: string) => {
    setEdgesInput((prev) => prev.filter((e) => e.id !== edgeId));
  }, []);

  // Generate random graph and regenerate steps
  const generateRandomGraphAndRegenerate = useCallback(() => {
    const nodeCount = Math.floor(Math.random() * 4) + 5; // 5-8 nodes
    const nodeIds = 'ABCDEFGH'.slice(0, nodeCount).split('');
    const newNodes: GraphNode[] = nodeIds.map((id) => ({ id, label: id }));
    const newEdges: GraphEdge[] = [];

    // Ensure connected graph (create a spanning tree first)
    for (let i = 1; i < nodeIds.length; i++) {
      const source = nodeIds[Math.floor(Math.random() * i)];
      const target = nodeIds[i];
      newEdges.push({
        id: `e${source}-${target}`,
        source,
        target,
      });
    }

    // Add some random additional edges
    const additionalEdges = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < additionalEdges; i++) {
      const source = nodeIds[Math.floor(Math.random() * nodeIds.length)];
      const target = nodeIds[Math.floor(Math.random() * nodeIds.length)];
      if (source !== target && !newEdges.some((e) =>
        (e.source === source && e.target === target) ||
        (e.source === target && e.target === source)
      )) {
        newEdges.push({
          id: `e${source}-${target}`,
          source,
          target,
        });
      }
    }

    setNodesInput(newNodes);
    setEdgesInput(newEdges);
    setStartNode(nodeIds[0]);

    // Directly regenerate steps with the new graph (don't wait for state update)
    const input: GraphTraversalInput = {
      nodes: newNodes,
      edges: newEdges,
      startNode: nodeIds[0],
      algorithm,
    };
    const validation = graphTraversalVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = graphTraversalVisualization.generateSteps(input);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
      setValidationErrorKey(null);
    }
  }, [algorithm]);

  return (
    <AlgorithmLayout
      titleKey="graphTraversalTitle"
      descriptionKey="graphTraversalDescription"
      devNoteKey="devNoteGraphTraversal"
      algorithm={graphTraversalVisualization}
    >
      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        {/* Algorithm selector */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">{t.algorithmLabel || 'Algorithm'}:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setAlgorithm('bfs')}
              className={cn(
                'px-4 py-2 rounded-lg transition-colors',
                algorithm === 'bfs'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {t.bfs || 'BFS'}
            </button>
            <button
              onClick={() => setAlgorithm('dfs')}
              className={cn(
                'px-4 py-2 rounded-lg transition-colors',
                algorithm === 'dfs'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {t.dfs || 'DFS'}
            </button>
          </div>
        </div>

        {/* Start node selector */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            {t.selectStartNode || 'Start Node'}:
          </label>
          <select
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            {nodesInput.map((node) => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>
        </div>

        {/* Node/Edge editing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Add node */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.addNode || 'Add Node'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNodeId}
                onChange={(e) => {
                  setNewNodeId(e.target.value.toUpperCase());
                  setValidationValue('');
                  setValidationErrorKey(null);
                }}
                placeholder="A"
                maxLength={1}
                className="touch-target w-20 rounded border px-2 py-1 text-center uppercase"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNode()}
              />
              <button
                onClick={handleAddNode}
                aria-label={t.addNode || 'Add Node'}
                title={t.addNode || 'Add Node'}
                className="touch-target flex items-center justify-center rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add edge */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.addEdge || 'Add Edge'}
            </label>
            <div className="flex gap-2 items-center">
              <select
                value={newEdgeSource}
                onChange={(e) => setNewEdgeSource(e.target.value)}
                className="px-2 py-1 border rounded"
              >
                <option value="">-</option>
                {nodesInput.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
              <span>→</span>
              <select
                value={newEdgeTarget}
                onChange={(e) => setNewEdgeTarget(e.target.value)}
                className="px-2 py-1 border rounded"
              >
                <option value="">-</option>
                {nodesInput.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddEdge}
                aria-label={t.addEdge || 'Add Edge'}
                title={t.addEdge || 'Add Edge'}
                className="touch-target flex items-center justify-center rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <ValidationMessage errorKey={validationErrorKey} messages={validationMessages} />

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              reset();
              generateRandomGraphAndRegenerate();
            }}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            {t.random || 'Random'}
          </button>
          <button
            onClick={() => {
              reset();
              regenerateSteps();
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {t.reset || 'Reset'}
          </button>
          <button
            onClick={play}
            disabled={isPlaying || totalSteps <= 1}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium disabled:opacity-50 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            {t.startSearch || 'Start'}
          </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph canvas */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 h-[400px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.5}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Queue/Stack panel */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {algorithm === 'bfs' ? (t.queue || 'Queue') : (t.stack || 'Stack')}
            </h3>
            <div className="flex flex-wrap gap-1 min-h-[40px]">
              {currentState.queueOrStack.length === 0 ? (
                <span className="text-gray-400 text-sm">
                  {t.empty || '(empty)'}
                </span>
              ) : (
                currentState.queueOrStack.map((nodeId, index) => (
                  <span
                    key={`${nodeId}-${index}`}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-mono"
                  >
                    {nodeId}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Visited order panel */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {t.visited || 'Visited Order'}
            </h3>
            <div className="flex flex-wrap gap-1 min-h-[40px]">
              {currentState.visitedOrder.length === 0 ? (
                <span className="text-gray-400 text-sm">
                  {t.none || '(none)'}
                </span>
              ) : (
                currentState.visitedOrder.map((nodeId, index) => (
                  <span
                    key={nodeId}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-mono"
                  >
                    {index + 1}. {nodeId}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Current node */}
          {currentState.currentNode && (
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <h3 className="text-sm font-medium text-yellow-800 mb-1">
                {t.currentNode || 'Current Node'}
              </h3>
              <span className="text-2xl font-bold text-yellow-600">
                {currentState.currentNode}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Node/Edge list for removal */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          {t.editGraph || 'Edit Graph'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {nodesInput.map((node) => (
            <button
              key={node.id}
              onClick={() => handleRemoveNode(node.id)}
              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1 text-sm"
            >
              {node.label}
              <Trash2 className="w-3 h-3" />
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {edgesInput.map((edge) => (
            <button
              key={edge.id}
              onClick={() => handleRemoveEdge(edge.id)}
              className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center gap-1 text-xs"
            >
              {edge.source}→{edge.target}
              <Trash2 className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>

      {/* Step Controller */}
      <StepController
        currentStep={currentStep}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        speed={speed}
        onPlay={play}
        onPause={pause}
        onStep={(direction) => (direction === 'forward' ? stepForward() : stepBackward())}
        onSpeedChange={setSpeed}
        onSeek={seek}
        disabled={nodesInput.length === 0}
      />

      {/* Explanation Panel */}
      <ExplanationPanel
        stepDescription={
          currentStepData
            ? graphTraversalVisualization.describeStep(currentStepData, lang)
            : t.graphTraversalReady || 'Ready to start graph traversal.'
        }
        invariant={graphTraversalVisualization.getInvariant?.(lang)}
        complexity={graphTraversalVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
