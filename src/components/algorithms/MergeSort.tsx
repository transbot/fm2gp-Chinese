// src/components/algorithms/MergeSort.tsx

import { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { StepController } from '../common/StepController';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { ValidationMessage } from '../common/ValidationMessage';
import { mergeSortVisualization, MergeSortInput, MergeSortState } from '../../lib/algorithms/merge_sort';
import { Step } from '../../lib/algorithms/types';
import { cn } from '../../lib/utils';

export function MergeSort() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Input state
  const [arrayInput, setArrayInput] = useState<string>('38, 27, 43, 3, 9, 82, 10');

  // Step state (managed locally for flexibility)
  const [steps, setSteps] = useState<Step<MergeSortState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);

  // Parse input
  const parseInput = useCallback((): MergeSortInput => {
    const array = arrayInput
      .split(/[,，]/)  // Support both half-width and full-width commas
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    return { array };
  }, [arrayInput]);

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const input = parseInput();
    const validation = mergeSortVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = mergeSortVisualization.generateSteps(input);
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
  const currentState: MergeSortState = steps[currentStep]?.state ?? mergeSortVisualization.getInitialState();
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
    const length = Math.floor(Math.random() * 8) + 6; // 6-13 elements (keep small for visualization)
    const arr = Array.from({ length }, () => Math.floor(Math.random() * 100));
    const newArrayInput = arr.join(', ');
    setArrayInput(newArrayInput);

    // Directly regenerate steps with the new array (don't wait for state update)
    const input: MergeSortInput = { array: arr };
    const validation = mergeSortVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = mergeSortVisualization.generateSteps(input);
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

  // Get cell color based on phase and state
  const getCellColor = (index: number) => {
    if (currentState.array.length === 0) return 'bg-gray-100';

    const { phase, comparing, rangeStart, rangeEnd } = currentState;

    // Highlight range being processed
    if (rangeStart !== undefined && rangeEnd !== undefined) {
      if (index >= rangeStart && index < rangeEnd) {
        if (phase === 'divide') {
          return 'bg-blue-100 ring-2 ring-blue-400';
        }
        if (phase === 'merge') {
          return 'bg-purple-100 ring-2 ring-purple-400';
        }
      }
    }

    // Highlight comparing elements
    if (comparing && phase === 'merge') {
      const leftVal = comparing[0];
      const rightVal = comparing[1];
      const currentVal = currentState.array[index];
      if (currentVal === leftVal || currentVal === rightVal) {
        return 'bg-yellow-400 ring-2 ring-yellow-600 animate-pulse';
      }
    }

    // Complete state
    if (phase === 'complete') {
      return 'bg-green-500 ring-2 ring-green-700';
    }

    return 'bg-gray-100';
  };

  // Render subarray visualization
  const renderSubarrays = () => {
    if (currentState.phase === 'init' || currentState.phase === 'complete') {
      return null;
    }

    const { leftArray, rightArray, mergedArray, level, comparing } = currentState;

    return (
      <div className="space-y-4">
        {/* Level indicator */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm font-medium">
            {t.recursionLevel || 'Recursion Level'}: {level}
          </span>
        </div>

        {/* Left and right arrays */}
        {(leftArray.length > 0 || rightArray.length > 0) && (
          <div className="grid grid-cols-2 gap-4">
            {/* Left array */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-600 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded"></span>
                {t.leftHalf || 'Left Half'}
              </div>
              <div className="flex flex-wrap gap-1">
                {leftArray.map((val, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'w-10 h-10 rounded flex items-center justify-center font-mono text-sm',
                      comparing && comparing[0] === val
                        ? 'bg-yellow-400 ring-2 ring-yellow-600 animate-pulse'
                        : 'bg-blue-100'
                    )}
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>

            {/* Right array */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-purple-600 flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-500 rounded"></span>
                {t.rightHalf || 'Right Half'}
              </div>
              <div className="flex flex-wrap gap-1">
                {rightArray.map((val, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'w-10 h-10 rounded flex items-center justify-center font-mono text-sm',
                      comparing && comparing[1] === val
                        ? 'bg-yellow-400 ring-2 ring-yellow-600 animate-pulse'
                        : 'bg-purple-100'
                    )}
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Merged result */}
        {mergedArray.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-green-600 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded"></span>
              {t.merge || 'Merge'} {t.result || 'Result'}
            </div>
            <div className="flex flex-wrap gap-1">
              {mergedArray.map((val, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded flex items-center justify-center font-mono text-sm bg-green-100"
                >
                  {val}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <AlgorithmLayout
      titleKey="mergeSortTitle"
      descriptionKey="mergeSortDescription"
      devNoteKey="devNoteMergeSort"
      algorithm={mergeSortVisualization}
    >
      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
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
            className={cn(
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm',
              validationErrorKey ? 'border-red-300 bg-red-50' : 'border-gray-300'
            )}
            placeholder="38, 27, 43, 3, 9, 82, 10"
          />
          <p className="text-xs text-gray-500">
            {t.mergeSortMaxElements || 'Maximum 32 elements for visualization'}
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
            {t.startSort || 'Start Sort'}
          </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-6">
        {/* Original array display */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600">
            {t.originalArray || 'Original Array'}:
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {currentState.originalArray.map((value, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-lg flex flex-col items-center justify-center font-mono bg-gray-200 text-gray-500"
              >
                <span className="text-lg font-bold">{value}</span>
                <span className="text-xs">[{index}]</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current array state */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600">
            {t.currentArray || 'Current Array'}:
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {currentState.array.map((value, index) => (
              <div
                key={index}
                className={cn(
                  'w-12 h-12 rounded-lg flex flex-col items-center justify-center font-mono transition-all duration-200',
                  getCellColor(index)
                )}
              >
                <span className="text-lg font-bold text-gray-800">{value}</span>
                <span className="text-xs text-gray-500">[{index}]</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subarrays visualization */}
        {renderSubarrays()}

        {/* Phase indicator */}
        <div className="text-center">
          <span className={cn(
            'inline-block px-4 py-2 rounded-full text-sm font-medium',
            currentState.phase === 'divide' ? 'bg-blue-200 text-blue-800' :
            currentState.phase === 'merge' ? 'bg-purple-200 text-purple-800' :
            currentState.phase === 'complete' ? 'bg-green-200 text-green-800' :
            'bg-gray-200 text-gray-800'
          )}>
            {currentState.phase === 'divide' ? (t.divide || 'Divide') :
             currentState.phase === 'merge' ? (t.merge || 'Merge') :
             currentState.phase === 'complete' ? (t.complete || 'Complete') :
             (t.ready || 'Ready')}
          </span>
        </div>

        {/* Comparisons counter */}
        {currentState.comparisons > 0 && (
          <div className="text-center text-sm text-gray-600">
            {t.comparisons || 'Comparisons'}: {currentState.comparisons}
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
            ? mergeSortVisualization.describeStep(currentStepData, lang)
            : t.mergeSortReady || 'Ready to start merge sort. Enter an array and click Start Sort.'
        }
        invariant={mergeSortVisualization.getInvariant?.(lang)}
        complexity={mergeSortVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
