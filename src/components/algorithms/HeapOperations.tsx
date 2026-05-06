// src/components/algorithms/HeapOperations.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Shuffle, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { StepController } from '../common/StepController';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { heapVisualization, HeapInput, HeapState } from '../../lib/algorithms/heap';
import { Step } from '../../lib/algorithms/types';
import { cn } from '../../lib/utils';

/**
 * Get parent index in heap
 */
function getParentIndex(index: number): number {
  return Math.floor((index - 1) / 2);
}

/**
 * Get left child index in heap
 */
function getLeftChildIndex(index: number): number {
  return 2 * index + 1;
}

/**
 * Get right child index in heap
 */
function getRightChildIndex(index: number): number {
  return 2 * index + 2;
}

/**
 * Calculate positions for tree visualization
 */
function calculateTreePositions(size: number): Map<number, { x: number; y: number }> {
  const positions = new Map<number, { x: number; y: number }>();
  if (size === 0) return positions;

  const levels = Math.ceil(Math.log2(size + 1));
  const width = 500;
  const height = 200;
  const nodeSpacingY = height / (levels + 1);

  for (let i = 0; i < size; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const nodesInLevel = Math.pow(2, level);
    const indexInLevel = i - (nodesInLevel - 1);
    const levelWidth = width;
    const nodeSpacingX = levelWidth / (nodesInLevel + 1);

    positions.set(i, {
      x: nodeSpacingX * (indexInLevel + 1),
      y: nodeSpacingY * (level + 1),
    });
  }

  return positions;
}

export function HeapOperations() {
  const { lang } = useLanguage();
  const t = translations[lang] as any;

  // Input state
  const [arrayInput, setArrayInput] = useState<string>('4, 10, 3, 5, 1, 2, 8');
  const [operation, setOperation] = useState<'heapify' | 'insert' | 'delete'>('heapify');
  const [insertValue, setInsertValue] = useState<string>('15');

  // Step state
  const [steps, setSteps] = useState<Step<HeapState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Parse input
  const parseInput = useCallback((): HeapInput => {
    const array = arrayInput
      .split(/[,，]/)  // Support both half-width and full-width commas
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    return {
      array,
      operation,
      value: operation === 'insert' ? parseInt(insertValue) : undefined,
    };
  }, [arrayInput, operation, insertValue]);

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const input = parseInput();
    const validation = heapVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = heapVisualization.generateSteps(input);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    } else {
      setSteps([]);
      setCurrentStep(0);
    }
  }, [parseInput]);

  // Initialize on mount
  useEffect(() => {
    regenerateSteps();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
  const currentState: HeapState = steps[currentStep]?.state ?? heapVisualization.getInitialState();
  const currentStepData = steps[currentStep] ?? null;
  const totalSteps = steps.length;

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

  const seek = useCallback((step: number) => {
    setIsPlaying(false);
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [totalSteps]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  // Generate random array and regenerate steps
  const generateRandomAndRegenerate = useCallback(() => {
    const length = Math.floor(Math.random() * 10) + 5; // 5-15 elements
    const arr = Array.from({ length }, () => Math.floor(Math.random() * 50) + 1);
    const newArrayInput = arr.join(', ');
    setArrayInput(newArrayInput);

    // Directly regenerate steps with the new array (don't wait for state update)
    const input: HeapInput = {
      array: arr,
      operation,
      value: operation === 'insert' ? parseInt(insertValue) : undefined,
    };
    const validation = heapVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = heapVisualization.generateSteps(input);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [operation, insertValue]);

  // Handle operation change
  const handleOperationChange = useCallback((newOp: 'heapify' | 'insert' | 'delete') => {
    setOperation(newOp);
  }, []);

  // Handle input change
  const handleInputChange = useCallback(() => {
    regenerateSteps();
  }, [regenerateSteps]);

  // Calculate tree positions
  const positions = calculateTreePositions(currentState.array.length);

  // Get node color for tree visualization
  const getNodeColor = (index: number) => {
    if (currentState.array.length === 0) return 'bg-gray-200';

    const { currentIndex, parentIndex, leftChildIndex, rightChildIndex, swapped, isHeap } = currentState;

    // Highlight current node being processed
    if (index === currentIndex) {
      return swapped ? 'bg-yellow-400 ring-2 ring-yellow-600' : 'bg-blue-400 ring-2 ring-blue-600';
    }

    // Highlight parent
    if (index === parentIndex && currentIndex >= 0) {
      return swapped ? 'bg-yellow-400 ring-2 ring-yellow-600' : 'bg-purple-400 ring-2 ring-purple-600';
    }

    // Highlight children
    if (index === leftChildIndex || index === rightChildIndex) {
      return 'bg-green-300 ring-2 ring-green-500';
    }

    // Heap is complete - all green
    if (isHeap) {
      return 'bg-green-400';
    }

    // Default
    return 'bg-gray-200';
  };

  // Get cell color for array visualization
  const getCellColor = (index: number) => {
    return getNodeColor(index);
  };

  // Render tree visualization
  const renderTree = () => {
    if (currentState.array.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          {t.heapEmpty || 'Heap is empty'}
        </div>
      );
    }

    const width = 500;
    const height = 220;

    return (
      <svg width={width} height={height} className="mx-auto">
        {/* Draw edges first */}
        {currentState.array.map((_, index) => {
          const leftChild = getLeftChildIndex(index);
          const rightChild = getRightChildIndex(index);

          if (leftChild < currentState.array.length) {
            const parentPos = positions.get(index);
            const childPos = positions.get(leftChild);
            if (parentPos && childPos) {
              return (
                <line
                  key={`edge-${index}-${leftChild}`}
                  x1={parentPos.x}
                  y1={parentPos.y + 15}
                  x2={childPos.x}
                  y2={childPos.y - 15}
                  stroke="#999"
                  strokeWidth="2"
                />
              );
            }
          }

          if (rightChild < currentState.array.length) {
            const parentPos = positions.get(index);
            const childPos = positions.get(rightChild);
            if (parentPos && childPos) {
              return (
                <line
                  key={`edge-${index}-${rightChild}`}
                  x1={parentPos.x}
                  y1={parentPos.y + 15}
                  x2={childPos.x}
                  y2={childPos.y - 15}
                  stroke="#999"
                  strokeWidth="2"
                />
              );
            }
          }

          return null;
        })}

        {/* Draw nodes */}
        {currentState.array.map((value, index) => {
          const pos = positions.get(index);
          if (!pos) return null;

          const color = getNodeColor(index);
          const isHighlighted = index === currentState.currentIndex ||
            index === currentState.parentIndex ||
            index === currentState.leftChildIndex ||
            index === currentState.rightChildIndex;

          return (
            <g key={`node-${index}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={20}
                className={cn(
                  color,
                  'transition-all duration-300',
                  isHighlighted && 'stroke-2 stroke-gray-700'
                )}
                fill={color.includes('blue') ? '#60a5fa' :
                      color.includes('purple') ? '#a78bfa' :
                      color.includes('green') ? '#4ade80' :
                      color.includes('yellow') ? '#facc15' :
                      '#e5e7eb'}
                stroke={isHighlighted ? '#374151' : '#9ca3af'}
                strokeWidth={isHighlighted ? 2 : 1}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-bold text-sm fill-gray-800"
              >
                {value}
              </text>
              <text
                x={pos.x}
                y={pos.y + 30}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                [{index}]
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <AlgorithmLayout
      titleKey="heapTitle"
      descriptionKey="heapDescription"
      devNoteKey="devNoteHeap"
      algorithm={heapVisualization}
    >
      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        {/* Operation selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.operation || 'Operation'}
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleOperationChange('heapify')}
              className={cn(
                'px-4 py-2 rounded-lg transition-colors flex items-center gap-2',
                operation === 'heapify'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <ArrowDown className="w-4 h-4" />
              {t.heapify || 'Heapify'}
            </button>
            <button
              onClick={() => handleOperationChange('insert')}
              className={cn(
                'px-4 py-2 rounded-lg transition-colors flex items-center gap-2',
                operation === 'insert'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <Plus className="w-4 h-4" />
              {t.heapInsert || 'Insert'}
            </button>
            <button
              onClick={() => handleOperationChange('delete')}
              className={cn(
                'px-4 py-2 rounded-lg transition-colors flex items-center gap-2',
                operation === 'delete'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <Trash2 className="w-4 h-4" />
              {t.deleteMax || 'Delete Max'}
            </button>
          </div>
        </div>

        {/* Array input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.array || 'Array'} ({t.commaSeparated || 'comma-separated'})
          </label>
          <input
            type="text"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            onBlur={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="4, 10, 3, 5, 1, 2, 8"
          />
        </div>

        {/* Insert value input (only for insert operation) */}
        {operation === 'insert' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.valueToInsert || 'Value to Insert'}
            </label>
            <input
              type="number"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="15"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              reset();
              generateRandomAndRegenerate();
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
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-6">
        {/* Tree visualization */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">
            {t.heapTreeView || 'Binary Tree View'}
          </h3>
          {renderTree()}
        </div>

        {/* Array visualization */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">
            {t.heapArrayView || 'Array View'}
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {currentState.array.map((value, index) => (
              <div
                key={index}
                className={cn(
                  'w-12 h-14 rounded-lg flex flex-col items-center justify-center font-mono transition-all duration-300',
                  getCellColor(index)
                )}
              >
                <span className="text-lg font-bold text-gray-800">{value}</span>
                <span className="text-xs text-gray-500">[{index}]</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span className="text-gray-600">{t.currentNode || 'Current'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-400 rounded"></div>
            <span className="text-gray-600">{t.parent || 'Parent'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-300 rounded"></div>
            <span className="text-gray-600">{t.children || 'Children'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-gray-600">{t.swapped || 'Swapped'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">{t.heapComplete || 'Heap!'}</span>
          </div>
        </div>

        {/* Heap property indicator */}
        {currentState.isHeap && (
          <div className="text-center text-green-600 font-medium flex items-center justify-center gap-2">
            <ArrowUp className="w-5 h-5" />
            {t.heapPropertySatisfied || 'Max-heap property satisfied!'}
          </div>
        )}
      </div>

      {/* Step Controller */}
      <StepController
        currentStep={currentStep}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        speed={speed}
        onPlay={play}
        onPause={pause}
        onStep={(direction) => direction === 'forward' ? stepForward() : stepBackward()}
        onSpeedChange={setSpeed}
        onSeek={seek}
        disabled={currentState.array.length === 0 && operation !== 'insert'}
      />

      {/* Explanation Panel */}
      <ExplanationPanel
        stepDescription={
          currentStepData
            ? heapVisualization.describeStep(currentStepData, lang)
            : t.heapReady || 'Ready to start heap operations.'
        }
        invariant={heapVisualization.getInvariant?.(lang)}
        complexity={heapVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}