// src/components/algorithms/Swap.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { StepController } from '../common/StepController';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { swapVisualization, SwapInput, SwapState } from '../../lib/algorithms/swap';
import { Step } from '../../lib/algorithms/types';
import { cn } from '../../lib/utils';

export function Swap() {
  const { lang } = useLanguage();
  const t = translations[lang] as any;

  // Input state
  const [arrayInput, setArrayInput] = useState<string>('1,2,3,4,5,6,7');
  const [firstStart, setFirstStart] = useState<string>('0');
  const [firstEnd, setFirstEnd] = useState<string>('3');
  const [secondStart, setSecondStart] = useState<string>('3');
  const [secondEnd, setSecondEnd] = useState<string>('7');

  // Step state
  const [steps, setSteps] = useState<Step<SwapState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Parse input
  const parseInput = useCallback((): SwapInput => {
    const array = arrayInput
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));

    return {
      array,
      firstStart: parseInt(firstStart) || 0,
      firstEnd: parseInt(firstEnd) || 0,
      secondStart: parseInt(secondStart) || 0,
      secondEnd: parseInt(secondEnd) || 0,
    };
  }, [arrayInput, firstStart, firstEnd, secondStart, secondEnd]);

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const input = parseInput();
    const validation = swapVisualization.validateInput(input);

    if (validation.valid) {
      const newSteps = swapVisualization.generateSteps(input);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
      setError(null);
    } else {
      setSteps([]);
      setCurrentStep(0);
      setError(validation.errorKey ? t[validation.errorKey] : validation.error || 'Invalid input');
    }
  }, [parseInput, t]);

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
  const currentState: SwapState = steps[currentStep]?.state ?? swapVisualization.getInitialState();
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

  // Handle input change
  const handleInputChange = useCallback(() => {
    regenerateSteps();
  }, [regenerateSteps]);

  // Update second range start when first range end changes
  useEffect(() => {
    const newSecondStart = parseInt(firstEnd) || 0;
    if (newSecondStart !== parseInt(secondStart)) {
      setSecondStart(String(newSecondStart));
    }
  }, [firstEnd, secondStart]);

  // Random array generation
  const generateRandomArray = useCallback(() => {
    const size = Math.floor(Math.random() * 8) + 5; // 5-12 elements
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
    const mid = Math.floor(size / 2);

    setArrayInput(arr.join(','));
    setFirstStart('0');
    setFirstEnd(String(mid));
    setSecondStart(String(mid));
    setSecondEnd(String(size));
  }, []);

  // Render array visualization
  const renderArrayVisualization = () => {
    const { array, firstRange, secondRange } = currentState;
    const highlights = currentStepData?.highlights || [];

    return (
      <div className="flex flex-wrap justify-center gap-2">
        {array.map((value, idx) => {
          const inFirstRange = idx >= firstRange[0] && idx < firstRange[1];
          const inSecondRange = idx >= secondRange[0] && idx < secondRange[1];
          const isHighlighted = highlights.includes(idx);

          let bgColor = 'bg-gray-200';
          if (inFirstRange) bgColor = 'bg-blue-400';
          if (inSecondRange) bgColor = 'bg-green-400';
          if (isHighlighted) bgColor = 'bg-yellow-400';

          return (
            <div
              key={idx}
              className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center',
                'font-mono font-bold text-white text-lg',
                'transition-all duration-300',
                bgColor,
                isHighlighted && 'ring-4 ring-yellow-600 scale-110'
              )}
            >
              {value}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AlgorithmLayout
      titleKey="swapTitle"
      descriptionKey="swapDescription"
      devNoteKey="devNoteSwap"
      algorithm={swapVisualization}
    >
      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        {/* Array input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.array || 'Array'} ({t.commaSeparated || 'comma-separated'})
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={arrayInput}
              onChange={(e) => setArrayInput(e.target.value)}
              onBlur={handleInputChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="1,2,3,4,5,6,7"
            />
            <button
              onClick={generateRandomArray}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              {t.random || 'Random'}
            </button>
          </div>
        </div>

        {/* Range inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First range */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <div className="text-sm font-medium text-blue-700">
              {t.firstRange || 'First Range'} (blue)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start</label>
                <input
                  type="number"
                  min="0"
                  value={firstStart}
                  onChange={(e) => setFirstStart(e.target.value)}
                  onBlur={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End</label>
                <input
                  type="number"
                  min="0"
                  value={firstEnd}
                  onChange={(e) => setFirstEnd(e.target.value)}
                  onBlur={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Second range */}
          <div className="bg-green-50 p-4 rounded-lg space-y-3">
            <div className="text-sm font-medium text-green-700">
              {t.secondRange || 'Second Range'} (green)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start</label>
                <input
                  type="number"
                  min="0"
                  value={secondStart}
                  onChange={(e) => setSecondStart(e.target.value)}
                  onBlur={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End</label>
                <input
                  type="number"
                  min="0"
                  value={secondEnd}
                  onChange={(e) => setSecondEnd(e.target.value)}
                  onBlur={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
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
            {t.startCalculation || 'Start Calculation'}
          </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-6">
        {/* Array visualization */}
        {renderArrayVisualization()}

        {/* Legend */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span className="text-gray-600">{t.firstRange || 'First Range'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-gray-600">{t.secondRange || 'Second Range'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded ring-2 ring-yellow-600"></div>
            <span className="text-gray-600">{t.swapping || 'Swapping'}</span>
          </div>
        </div>

        {/* Range info */}
        {currentState.array.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            [{currentState.firstRange[0]}, {currentState.firstRange[1]}) ↔ [{currentState.secondRange[0]}, {currentState.secondRange[1]})
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
        disabled={steps.length === 0}
      />

      {/* Explanation Panel */}
      <ExplanationPanel
        stepDescription={
          currentStepData
            ? swapVisualization.describeStep(currentStepData, lang)
            : t.swapReady || 'Ready to swap. Enter an array and two adjacent ranges.'
        }
        invariant={swapVisualization.getInvariant?.(lang)}
        complexity={swapVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
