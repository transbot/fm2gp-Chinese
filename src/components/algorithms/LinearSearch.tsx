// src/components/algorithms/LinearSearch.tsx

import { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { StepController } from '../common/StepController';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { ValidationMessage } from '../common/ValidationMessage';
import { linearSearchVisualization, LinearSearchInput, LinearSearchState } from '../../lib/algorithms/linear_search';
import { Step } from '../../lib/algorithms/types';
import { cn } from '../../lib/utils';

export function LinearSearch() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Input state
  const [arrayInput, setArrayInput] = useState<string>('5, 3, 8, 4, 2, 7, 1, 6, 9, 0');
  const [targetInput, setTargetInput] = useState<string>('7');

  // Step state (managed locally for flexibility)
  const [steps, setSteps] = useState<Step<LinearSearchState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);

  // Parse input
  const parseInput = useCallback((): LinearSearchInput => {
    const array = arrayInput
      .split(',')
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    const target = parseInt(targetInput) || 0;
    return { array, target };
  }, [arrayInput, targetInput]);

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const input = parseInput();
    const validation = linearSearchVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = linearSearchVisualization.generateSteps(input);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
      setValidationErrorKey(null);
    } else {
      setSteps([]);
      setCurrentStep(0);
      setIsPlaying(false);
      setValidationErrorKey(validation.errorKey ?? null);
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
  const currentState: LinearSearchState = steps[currentStep]?.state ?? linearSearchVisualization.getInitialState();
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

  // Generate random array
  const generateRandomArray = useCallback(() => {
    const length = Math.floor(Math.random() * 15) + 10; // 10-25 elements
    const arr = Array.from({ length }, () => Math.floor(Math.random() * 100));
    setArrayInput(arr.join(', '));

    // Pick a random element from the array as target (or random value)
    const useExisting = Math.random() > 0.3; // 70% chance to pick existing value
    if (useExisting && arr.length > 0) {
      setTargetInput(String(arr[Math.floor(Math.random() * arr.length)]));
    } else {
      setTargetInput(String(Math.floor(Math.random() * 100)));
    }
  }, []);

  // Handle input change - regenerate steps
  const handleInputChange = useCallback(() => {
    regenerateSteps();
  }, [regenerateSteps]);

  // Get cell color based on state
  const getCellColor = (index: number) => {
    if (currentState.array.length === 0) return 'bg-gray-100';

    const { currentIndex, found, foundIndex } = currentState;

    // Already found
    if (found && foundIndex !== null) {
      if (index === foundIndex) return 'bg-green-500 ring-2 ring-green-700';
      if (index < foundIndex) return 'bg-gray-200 opacity-50'; // Checked before found
      return 'bg-gray-100'; // Not checked
    }

    // Currently checking
    if (index === currentIndex) {
      return 'bg-yellow-400 ring-2 ring-yellow-600 animate-pulse';
    }

    // Already checked
    if (index < currentIndex) {
      return 'bg-gray-200 opacity-50';
    }

    // Not yet checked
    return 'bg-indigo-100';
  };

  return (
    <AlgorithmLayout
      titleKey="linearSearchTitle"
      descriptionKey="linearSearchDescription"
      devNoteKey="devNoteLinearSearch"
      algorithm={linearSearchVisualization}
    >
      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="5, 3, 8, 4, 2, 7, 1, 6, 9, 0"
            />
          </div>

          {/* Target input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.target || 'Target'}
            </label>
            <input
              type="number"
              value={targetInput}
              onChange={(e) => {
                setTargetInput(e.target.value);
              }}
              onBlur={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>

        <ValidationMessage errorKey={validationErrorKey} messages={t} />

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              generateRandomArray();
              // Steps will be regenerated on next effect run
              setTimeout(() => regenerateSteps(), 0);
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
            {t.startSearch || 'Start Search'}
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
                'w-12 h-12 rounded-lg flex flex-col items-center justify-center font-mono transition-all duration-200',
                getCellColor(index)
              )}
            >
              <span className="text-lg font-bold text-gray-800">{value}</span>
              <span className="text-xs text-gray-500">[{index}]</span>
            </div>
          ))}
        </div>

        {/* Target display */}
        <div className="text-center">
          <span className="text-sm text-gray-500">{t.searchingFor || 'Searching for'}: </span>
          <span className="font-mono font-bold text-blue-600">{currentState.target}</span>
        </div>

        {/* Progress indicator */}
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
            ? linearSearchVisualization.describeStep(currentStepData, lang)
            : t.linearSearchReady || 'Ready to start linear search.'
        }
        invariant={linearSearchVisualization.getInvariant?.(lang)}
        complexity={linearSearchVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
