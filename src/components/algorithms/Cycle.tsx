// src/components/algorithms/Cycle.tsx

import { Fragment, useState, useCallback, useEffect, useMemo } from 'react';
import { Play, RotateCcw, Shuffle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { StepController } from '../common/StepController';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { ValidationMessage } from '../common/ValidationMessage';
import {
  cycleVisualization,
  CycleInput,
  CycleState,
  Cycle as CycleType,
  generateRandomPermutation,
  createDefaultCycleInput,
  parsePermutation,
} from '../../lib/algorithms/cycle';
import { Step } from '../../lib/algorithms/types';
import { cn } from '../../lib/utils';

// Cycle colors for visualization
const CYCLE_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-red-500',
  'bg-indigo-500',
];

const CYCLE_BORDER_COLORS = [
  'border-blue-600',
  'border-green-600',
  'border-purple-600',
  'border-orange-600',
  'border-pink-600',
  'border-teal-600',
  'border-red-600',
  'border-indigo-600',
];

export function Cycle() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Default input
  const defaultInput = useMemo(() => createDefaultCycleInput(), []);

  // Input state
  const [arrayInput, setArrayInput] = useState<string>(defaultInput.array.join(', '));
  const [permutationInput, setPermutationInput] = useState<string>(defaultInput.permutation.join(', '));
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);

  // Step state
  const [steps, setSteps] = useState<Step<CycleState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Parse array from input
  const parseArray = (input: string): number[] => {
    return input.split(/[,，\s]+/)  // Support both half-width and full-width commas
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n));
  };

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const array = parseArray(arrayInput);
    const permutation = parsePermutation(permutationInput, array.length);

    if (!permutation) {
      setSteps([]);
      setCurrentStep(0);
      if (array.length > 0) {
        setValidationErrorKey('cycleInvalidPermutation');
      }
      return;
    }

    const input: CycleInput = { array, permutation };
    const validation = cycleVisualization.validateInput(input);

    if (validation.valid) {
      const newSteps = cycleVisualization.generateSteps(input);
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
  }, [arrayInput, permutationInput]);

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
  const currentState: CycleState =
    steps[currentStep]?.state ?? cycleVisualization.getInitialState();
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

  // Generate random input and regenerate steps
  const generateRandomAndRegenerate = useCallback(() => {
    const n = Math.floor(Math.random() * 6) + 5; // 5-10 elements
    const array = Array.from({ length: n }, (_, i) => (i + 1) * 10);
    const permutation = generateRandomPermutation(n);
    setArrayInput(array.join(', '));
    setPermutationInput(permutation.join(', '));
    setValidationErrorKey(null);

    // Directly regenerate steps with the new values (don't wait for state update)
    const input: CycleInput = { array, permutation };
    const validation = cycleVisualization.validateInput(input);

    if (validation.valid) {
      const newSteps = cycleVisualization.generateSteps(input);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, []);

  // Get cycle color for a position
  const getCycleColor = (position: number, cycles: CycleType[]): { bg: string; border: string; index: number } | null => {
    for (let i = 0; i < cycles.length; i++) {
      if (cycles[i].positions.includes(position)) {
        return {
          bg: CYCLE_COLORS[i % CYCLE_COLORS.length],
          border: CYCLE_BORDER_COLORS[i % CYCLE_BORDER_COLORS.length],
          index: i,
        };
      }
    }
    return null;
  };

  // Check if position is in current cycle being traced
  const isInCurrentCycle = (position: number): boolean => {
    return currentState.currentCycle.includes(position);
  };

  // Check if position is current
  const isCurrentPosition = (position: number): boolean => {
    return currentState.currentPosition === position;
  };

  // Render cycle notation
  const renderCycleNotation = (cycle: CycleType, colorIndex: number) => {
    const bgClass = CYCLE_COLORS[colorIndex % CYCLE_COLORS.length];
    return (
      <span className={cn('px-2 py-1 rounded text-white font-mono text-sm', bgClass)}>
        ({cycle.values.join(' ')})
      </span>
    );
  };

  return (
    <AlgorithmLayout
      titleKey="cycleTitle"
      descriptionKey="cycleDescription"
      devNoteKey="devNoteCycle"
      algorithm={cycleVisualization}
    >
      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        {/* Array input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.array || 'Array'}:
          </label>
          <input
            aria-label={t.array || 'Array'}
            type="text"
            value={arrayInput}
            onChange={(e) => {
              setArrayInput(e.target.value);
              setValidationErrorKey(null);
            }}
            className="touch-target w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            placeholder="10, 20, 30, 40, 50"
          />
        </div>

        {/* Permutation input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.permutation || 'Permutation'}:
          </label>
          <input
            aria-label={t.permutation || 'Permutation'}
            type="text"
            value={permutationInput}
            onChange={(e) => {
              setPermutationInput(e.target.value);
              setValidationErrorKey(null);
            }}
            className="touch-target w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            placeholder="2, 0, 1, 3, 4"
          />
          <p className="text-xs text-gray-500">
            {t.permutationHint || 'Permutation[i] = where element at position i goes (0-indexed)'}
          </p>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Array visualization */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            {t.arrayVisual || 'Array with Permutation Arrows'}
          </h3>

          {/* Array boxes */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {currentState.array.map((value, idx) => {
              const cycleColor = getCycleColor(idx, currentState.cycles);
              const inCurrentCycle = isInCurrentCycle(idx);
              const isCurrent = isCurrentPosition(idx);
              const isVisited = currentState.visited[idx];

              let bgClass = 'bg-gray-100';
              let borderClass = 'border-gray-300';
              let textClass = 'text-gray-800';

              if (cycleColor) {
                bgClass = cycleColor.bg;
                borderClass = cycleColor.border;
                textClass = 'text-white';
              } else if (inCurrentCycle) {
                bgClass = 'bg-yellow-400';
                borderClass = 'border-yellow-600';
                textClass = 'text-gray-900';
              } else if (isVisited) {
                bgClass = 'bg-gray-400';
                borderClass = 'border-gray-500';
                textClass = 'text-white';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      'w-14 h-14 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-all duration-300',
                      bgClass,
                      borderClass,
                      textClass,
                      isCurrent && 'ring-4 ring-yellow-300 animate-pulse'
                    )}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-gray-500">[{idx}]</div>
                  <div className="flex items-center text-xs text-blue-600">
                    <ArrowRight className="w-3 h-3" />
                    <span>{currentState.permutation[idx]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current position indicator */}
          {currentState.currentPosition !== null && (
            <div className="text-center text-sm text-yellow-600 font-medium">
              {t.currentPosition || 'Current position'}: {currentState.currentPosition}
              {currentState.tracingFrom !== null && (
                <span className="text-gray-500">
                  {' '}({t.tracingFrom || 'tracing from'} {currentState.tracingFrom})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Cycles found */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            {t.cyclesFound || 'Cycles Found'}
          </h3>

          {currentState.cycles.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              {t.noCyclesYet || 'No cycles found yet'}
            </div>
          ) : (
            <div className="space-y-3">
              {currentState.cycles.map((cycle, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm w-16">
                    {t.cycle || 'Cycle'} {idx + 1}:
                  </span>
                  {renderCycleNotation(cycle, idx)}
                  <span className="text-xs text-gray-400">
                    ({t.positions || 'positions'}: {cycle.positions.join(', ')})
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Current cycle being traced */}
          {currentState.currentCycle.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-yellow-600 font-medium mb-2">
                {t.tracingCycle || 'Currently tracing'}:
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-yellow-400 text-gray-900 rounded font-mono text-sm">
                  ({currentState.currentCycle.map(p => currentState.array[p]).join(' ')})
                </span>
              </div>
            </div>
          )}

          {/* Total cycles count */}
          {currentState.cycles.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
              {t.totalCycles || 'Total cycles'}: {currentState.cycles.length}
            </div>
          )}
        </div>
      </div>

      {/* Cycle diagram visualization */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          {t.cycleDiagram || 'Cycle Orbit Diagram'}
        </h3>
        <div className="space-y-6">
          {/* Show each cycle as a circular diagram */}
          {currentState.cycles.map((cycle, cycleIdx) => (
            <div key={cycleIdx} className="flex items-center gap-4">
              <span className={cn(
                'w-20 text-center text-sm font-medium py-1 rounded text-white',
                CYCLE_COLORS[cycleIdx % CYCLE_COLORS.length]
              )}>
                {t.cycle || 'Cycle'} {cycleIdx + 1}
              </span>
              <div className="flex items-center gap-1">
                {cycle.positions.map((pos, idx) => (
                  <Fragment key={pos}>
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold text-white',
                      CYCLE_COLORS[cycleIdx % CYCLE_COLORS.length]
                    )}>
                      {currentState.array[pos]}
                    </div>
                    {idx < cycle.positions.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </Fragment>
                ))}
                {/* Arrow back to start */}
                <ArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
              </div>
            </div>
          ))}

          {/* Show current cycle being traced */}
          {currentState.currentCycle.length > 0 && (
            <div className="flex items-center gap-4">
              <span className="w-20 text-center text-sm font-medium py-1 rounded bg-yellow-400 text-gray-900">
                {t.tracing || 'Tracing'}
              </span>
              <div className="flex items-center gap-1">
                {currentState.currentCycle.map((pos) => (
                  <Fragment key={pos}>
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                      isCurrentPosition(pos) ? 'bg-yellow-500 text-white ring-2 ring-yellow-300' : 'bg-yellow-300 text-gray-800'
                    )}>
                      {currentState.array[pos]}
                    </div>
                    <ArrowRight className="w-4 h-4 text-yellow-500" />
                  </Fragment>
                ))}
                <span className="text-yellow-500 font-bold">...</span>
              </div>
            </div>
          )}
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
        disabled={currentState.array.length === 0}
      />

      {/* Explanation Panel */}
      <ExplanationPanel
        stepDescription={
          currentStepData
            ? cycleVisualization.describeStep(currentStepData, lang)
            : t.cycleReady || 'Ready to start cycle decomposition.'
        }
        invariant={cycleVisualization.getInvariant?.(lang)}
        complexity={cycleVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
