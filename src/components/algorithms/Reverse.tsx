// src/components/algorithms/Reverse.tsx

import { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Shuffle, ArrowLeftRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { StepController } from '../common/StepController';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { ValidationMessage } from '../common/ValidationMessage';
import { reverseVisualization, ReverseInput, ReverseState } from '../../lib/algorithms/reverse';
import { Step } from '../../lib/algorithms/types';
import { cn } from '../../lib/utils';

export function Reverse() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Input state
  const [arrayInput, setArrayInput] = useState<string>('1, 2, 3, 4, 5, 6, 7, 8');

  // Step state (managed locally for flexibility)
  const [steps, setSteps] = useState<Step<ReverseState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);

  // Parse input
  const parseInput = useCallback((): ReverseInput => {
    const array = arrayInput
      .split(/[,，]/)  // Support both half-width and full-width commas
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    return { array };
  }, [arrayInput]);

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const input = parseInput();
    const validation = reverseVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = reverseVisualization.generateSteps(input);
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
  const currentState: ReverseState = steps[currentStep]?.state ?? reverseVisualization.getInitialState();
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
    const arr = Array.from({ length }, (_, i) => i + 1);
    // Shuffle the array
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setArrayInput(arr.join(', '));

    // Directly regenerate steps with the new array (don't wait for state update)
    const input: ReverseInput = { array: arr };
    const validation = reverseVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = reverseVisualization.generateSteps(input);
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

    const { leftIndex, rightIndex, swapped } = currentState;

    // Check if element is in the "done" region (outside [left, right])
    const inProgress = index >= leftIndex && index <= rightIndex;

    // Check if this is a highlighted (swapping or about to swap) position
    const isLeftPointer = index === leftIndex;
    const isRightPointer = index === rightIndex;

    if (swapped && (isLeftPointer || isRightPointer)) {
      // Just swapped
      return 'bg-green-400 ring-2 ring-green-600';
    }

    if (!swapped && isLeftPointer) {
      // Left pointer
      return 'bg-blue-400 ring-2 ring-blue-600';
    }

    if (!swapped && isRightPointer) {
      // Right pointer
      return 'bg-purple-400 ring-2 ring-purple-600';
    }

    if (!inProgress) {
      // Already in final position
      return 'bg-green-200';
    }

    // Not yet processed
    return 'bg-gray-100';
  };

  // Get arrow indicator for pointers
  const getPointerIndicator = (index: number) => {
    if (currentState.array.length === 0) return null;
    const { leftIndex, rightIndex, swapped } = currentState;

    if (swapped) return null;

    if (index === leftIndex && index === rightIndex) {
      return (
        <div className="flex justify-center gap-1">
          <span className="text-xs text-blue-600 font-bold">L</span>
          <span className="text-xs text-purple-600 font-bold">R</span>
        </div>
      );
    }

    if (index === leftIndex) {
      return <span className="text-xs text-blue-600 font-bold">L</span>;
    }

    if (index === rightIndex) {
      return <span className="text-xs text-purple-600 font-bold">R</span>;
    }

    return null;
  };

  return (
    <AlgorithmLayout
      titleKey="reverseTitle"
      descriptionKey="reverseDescription"
      devNoteKey="devNoteReverse"
      algorithm={reverseVisualization}
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
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="1, 2, 3, 4, 5, 6, 7, 8"
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
            {t.startReverse || 'Start'}
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
              {getPointerIndicator(index)}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span className="text-gray-600">{t.leftPointer || 'Left Pointer'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-400 rounded"></div>
            <span className="text-gray-600">{t.rightPointer || 'Right Pointer'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-gray-600">{t.swap || 'Swapped'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 rounded"></div>
            <span className="text-gray-600">{t.reverseFinalPosition || 'Final Position'}</span>
          </div>
        </div>

        {/* Swap indicator */}
        {currentState.swapped && (
          <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
            <ArrowLeftRight className="w-5 h-5" />
            <span>
              {t.reverseSwapped || 'Swapped!'} ({currentState.swapCount} {t.reverseSwaps || 'swaps total'})
            </span>
          </div>
        )}

        {/* Pointer positions */}
        {!currentState.swapped && currentState.leftIndex <= currentState.rightIndex && (
          <div className="text-center text-gray-600">
            {t.leftPointer || 'Left'}: {currentState.leftIndex} | {t.rightPointer || 'Right'}: {currentState.rightIndex}
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
            ? reverseVisualization.describeStep(currentStepData, lang)
            : t.reverseReady || 'Ready to start reverse algorithm.'
        }
        invariant={reverseVisualization.getInvariant?.(lang)}
        complexity={reverseVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
