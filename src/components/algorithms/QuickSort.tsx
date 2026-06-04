// src/components/algorithms/QuickSort.tsx

import { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Shuffle, ArrowLeftRight, Target } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { StepController } from '../common/StepController';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { ValidationMessage } from '../common/ValidationMessage';
import { quickSortVisualization, QuickSortInput, QuickSortState } from '../../lib/algorithms/quick_sort';
import { Step } from '../../lib/algorithms/types';
import { cn } from '../../lib/utils';

export function QuickSort() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Input state
  const [arrayInput, setArrayInput] = useState<string>('3, 7, 2, 9, 1, 5, 8, 4, 6');

  // Step state (managed locally for flexibility)
  const [steps, setSteps] = useState<Step<QuickSortState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);

  // Parse input
  const parseInput = useCallback((): QuickSortInput => {
    const array = arrayInput
      .split(/[,，]/)  // Support both half-width and full-width commas
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    return { array };
  }, [arrayInput]);

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const input = parseInput();
    const validation = quickSortVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = quickSortVisualization.generateSteps(input);
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
  }, [parseInput]);

  // Initialize on mount
  useEffect(() => {
    regenerateSteps();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Play/pause interval
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const interval = 800 / speed;
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
  const currentState: QuickSortState = steps[currentStep]?.state ?? quickSortVisualization.getInitialState();
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
    const length = Math.floor(Math.random() * 8) + 6; // 6-13 elements
    const arr = Array.from({ length }, (_, i) => i + 1);
    // Shuffle the array
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setArrayInput(arr.join(', '));

    // Directly regenerate steps with the new array (don't wait for state update)
    const input: QuickSortInput = { array: arr };
    const validation = quickSortVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = quickSortVisualization.generateSteps(input);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
      setValidationErrorKey(null);
    }
  }, []);

  // Handle input change - regenerate steps
  const handleInputChange = useCallback(() => {
    regenerateSteps();
  }, [regenerateSteps]);

  // Get cell color based on state
  const getCellColor = (index: number) => {
    if (currentState.array.length === 0) return 'bg-gray-100';

    const {
      pivotIndex,
      low,
      high,
      i,
      sorted,
      comparing,
      swapping,
    } = currentState;

    // Check if sorted
    if (sorted.includes(index)) {
      return 'bg-green-300';
    }

    // Check if being swapped
    if (swapping && (index === swapping[0] || index === swapping[1])) {
      return 'bg-yellow-400 ring-2 ring-yellow-600';
    }

    // Check if being compared
    if (comparing && index === comparing[0]) {
      return 'bg-blue-400 ring-2 ring-blue-600';
    }

    // Check if this is the pivot
    if (pivotIndex !== null && index === pivotIndex) {
      return 'bg-orange-400 ring-2 ring-orange-600';
    }

    // Check if in current partition range
    if (index >= low && index <= high) {
      // Left partition (elements <= pivot)
      if (index <= i) {
        return 'bg-blue-200';
      }
      // Right partition (elements > pivot)
      return 'bg-purple-200';
    }

    // Outside current partition
    return 'bg-gray-100';
  };

  // Get indicator for cell
  const getIndicator = (index: number) => {
    if (currentState.array.length === 0) return null;

    const {
      pivotIndex,
      i,
      j,
      sorted,
      swapping,
    } = currentState;

    // Don't show indicators for sorted elements
    if (sorted.includes(index)) return null;

    // Don't show during swap animation
    if (swapping) return null;

    const indicators: React.ReactNode[] = [];

    // Pivot indicator
    if (pivotIndex === index && !sorted.includes(index)) {
      indicators.push(
        <span key="pivot" className="text-xs text-orange-700 font-bold flex items-center gap-0.5">
          <Target className="w-3 h-3" />
          P
        </span>
      );
    }

    // Boundary indicator (i)
    if (index === i && i >= 0) {
      indicators.push(
        <span key="i" className="text-xs text-blue-700 font-bold">i</span>
      );
    }

    // Current element indicator (j)
    if (index === j && j >= 0) {
      indicators.push(
        <span key="j" className="text-xs text-purple-700 font-bold">j</span>
      );
    }

    if (indicators.length === 0) return null;

    return (
      <div className="flex justify-center gap-1">
        {indicators}
      </div>
    );
  };

  return (
    <AlgorithmLayout
      titleKey="quickSortTitle"
      descriptionKey="quickSortDescription"
      devNoteKey="devNoteQuickSort"
      algorithm={quickSortVisualization}
    >
      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        {/* Array input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.array || 'Array'} ({t.commaSeparated || 'comma-separated'})
          </label>
          <input
            type="text"
            value={arrayInput}
            onChange={(e) => {
              setArrayInput(e.target.value);
            }}
            onBlur={handleInputChange}
            aria-label={t.array || 'Array'}
            className={cn(
              'touch-target w-full rounded-lg border px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500',
              validationErrorKey ? 'border-red-300 bg-red-50' : 'border-gray-300'
            )}
            placeholder="3, 7, 2, 9, 1, 5, 8, 4, 6"
          />
        </div>

        <ValidationMessage errorKey={validationErrorKey} messages={t} />

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              reset();
              generateRandomAndRegenerate();
            }}
            className="touch-target flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-2 text-indigo-700 transition-colors hover:bg-indigo-200"
          >
            <Shuffle className="w-4 h-4" />
            {t.random || 'Random'}
          </button>
          <button
            onClick={() => {
              reset();
              regenerateSteps();
            }}
            className="touch-target flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
          >
            <RotateCcw className="w-4 h-4" />
            {t.reset || 'Reset'}
          </button>
          <button
            onClick={play}
            disabled={isPlaying || totalSteps <= 1}
            className="touch-target flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 font-medium text-white hover:bg-green-600 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            {t.startSearch || 'Start'}
          </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
        {/* Array display */}
        <div className="flex flex-wrap justify-center gap-2">
          {currentState.array.map((value, index) => (
            <div
              key={index}
              className={cn(
                'w-14 h-16 rounded-lg flex flex-col items-center justify-center font-mono transition-all duration-300',
                getCellColor(index)
              )}
            >
              <span className="text-lg font-bold text-gray-800">{value}</span>
              <span className="text-xs text-gray-500">[{index}]</span>
              {getIndicator(index)}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 rounded flex items-center justify-center">
              <Target className="w-3 h-3 text-orange-800" />
            </div>
            <span className="text-gray-600">{t.pivot || 'Pivot'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span className="text-gray-600">{t.quickSortComparing || 'Comparing'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-gray-600">{t.quickSortSwapping || 'Swapping'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 rounded"></div>
            <span className="text-gray-600">{t.leftPartition || 'Left Partition'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-200 rounded"></div>
            <span className="text-gray-600">{t.rightPartition || 'Right Partition'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-300 rounded"></div>
            <span className="text-gray-600">{t.sortedLabel || 'Sorted'}</span>
          </div>
        </div>

        {/* Partition info */}
        {currentState.pivot !== null && (
          <div className="text-center space-y-2">
            <div className="text-lg font-medium text-gray-700">
              {t.pivot || 'Pivot'}: {currentState.pivot}
              {currentState.pivotIndex !== null && (
                <span className="text-sm text-gray-500 ml-2">
                  (index {currentState.pivotIndex})
                </span>
              )}
            </div>
            {currentState.partitionComplete && (
              <div className="text-green-600 font-medium">
                <ArrowLeftRight className="w-4 h-4 inline-block mr-1" />
                {t.partitionComplete || 'Partition complete!'} {currentState.sorted.length} {t.elementsSorted || 'elements sorted'}
              </div>
            )}
          </div>
        )}

        {/* Current range info */}
        {currentState.array.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            {t.currentRange || 'Current Range'}: [{currentState.low}, {currentState.high}]
            {currentState.i >= 0 && ` | i = ${currentState.i}`}
            {currentState.j >= 0 && ` | j = ${currentState.j}`}
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
        disabled={currentState.array.length === 0}
      />

      {/* Explanation Panel */}
      <ExplanationPanel
        stepDescription={
          currentStepData
            ? quickSortVisualization.describeStep(currentStepData, lang)
            : t.quickSortReady || 'Ready to start Quick Sort. Enter an array and click Start.'
        }
        invariant={quickSortVisualization.getInvariant?.(lang)}
        complexity={quickSortVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
