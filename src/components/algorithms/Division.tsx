// src/components/algorithms/Division.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { StepController } from '../common/StepController';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { divisionVisualization, DivisionInput, DivisionState } from '../../lib/algorithms/division';
import { Step } from '../../lib/algorithms/types';
import { cn } from '../../lib/utils';

export function Division() {
  const { lang } = useLanguage();
  const t = translations[lang] as any;

  // Input state
  const [dividendInput, setDividendInput] = useState<string>('17');
  const [divisorInput, setDivisorInput] = useState<string>('5');

  // Step state (managed locally for flexibility)
  const [steps, setSteps] = useState<Step<DivisionState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Parse input
  const parseInput = useCallback((): DivisionInput => {
    const dividend = parseInt(dividendInput) || 0;
    const divisor = parseInt(divisorInput) || 1;
    return { dividend, divisor };
  }, [dividendInput, divisorInput]);

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const input = parseInput();
    const validation = divisionVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = divisionVisualization.generateSteps(input);
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
  const currentState: DivisionState = steps[currentStep]?.state ?? divisionVisualization.getInitialState();
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

  // Handle input change - regenerate steps
  const handleInputChange = useCallback(() => {
    regenerateSteps();
  }, [regenerateSteps]);

  // Render visual blocks for subtraction process
  const renderVisualBlocks = () => {
    const { dividend, divisor, quotient, remainder, totalSubtractions } = currentState;

    // If quotient is large, show simplified visualization
    if (quotient > 20 || totalSubtractions > 50) {
      return (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${(quotient / totalSubtractions) * 100}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-600">
            {t.progress || 'Progress'}: {quotient} / {totalSubtractions} ({Math.round((quotient / totalSubtractions) * 100)}%)
          </div>
          {/* Summary */}
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">{quotient}</div>
              <div className="text-xs text-gray-500">{t.timesSubtracted || 'times subtracted'}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{remainder}</div>
              <div className="text-xs text-gray-500">{t.remaining || 'remaining'}</div>
            </div>
          </div>
        </div>
      );
    }

    // Create visual representation of the subtraction process
    const blocks: JSX.Element[] = [];

    // Render subtracted groups (each group = divisor)
    for (let i = 0; i < quotient; i++) {
      blocks.push(
        <div key={`subtracted-${i}`} className="flex flex-col items-center gap-1">
          <div className="flex gap-0.5">
            {Array.from({ length: Math.min(divisor, 10) }).map((_, j) => (
              <div
                key={j}
                className="w-6 h-6 bg-green-400 rounded-sm flex items-center justify-center text-white text-xs font-bold"
              >
                {divisor > 10 ? '•' : j + 1}
              </div>
            ))}
            {divisor > 10 && (
              <div className="w-6 h-6 bg-green-300 rounded-sm flex items-center justify-center text-green-700 text-xs font-bold">
                +{divisor - 10}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500">-{divisor}</span>
        </div>
      );
    }

    // Render remaining blocks (remainder)
    if (remainder > 0) {
      blocks.push(
        <div key="remainder" className="flex flex-col items-center gap-1">
          <div className="flex gap-0.5">
            {Array.from({ length: Math.min(remainder, 10) }).map((_, j) => (
              <div
                key={j}
                className="w-6 h-6 bg-blue-400 rounded-sm flex items-center justify-center text-white text-xs font-bold"
              >
                {remainder > 10 ? '•' : j + 1}
              </div>
            ))}
            {remainder > 10 && (
              <div className="w-6 h-6 bg-blue-300 rounded-sm flex items-center justify-center text-blue-700 text-xs font-bold">
                +{remainder - 10}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500">{t.remainder || 'Remainder'}</span>
        </div>
      );
    }

    return blocks;
  };

  return (
    <AlgorithmLayout
      titleKey="divisionTitle"
      descriptionKey="divisionDescription"
      devNoteKey="devNoteDivision"
      algorithm={divisionVisualization}
    >
      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dividend input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.dividend || 'Dividend'}
            </label>
            <input
              type="number"
              min="0"
              max="1000000"
              value={dividendInput}
              onChange={(e) => setDividendInput(e.target.value)}
              onBlur={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="17"
            />
          </div>

          {/* Divisor input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.divisor || 'Divisor'}
            </label>
            <input
              type="number"
              min="1"
              value={divisorInput}
              onChange={(e) => setDivisorInput(e.target.value)}
              onBlur={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="5"
            />
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
        {/* Current values display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.dividend || 'Dividend'}</div>
            <div className="text-2xl font-bold text-gray-800 font-mono">{currentState.dividend}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.divisor || 'Divisor'}</div>
            <div className="text-2xl font-bold text-gray-800 font-mono">{currentState.divisor}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.quotient || 'Quotient'}</div>
            <div className="text-2xl font-bold text-green-600 font-mono">{currentState.quotient}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.remainder || 'Remainder'}</div>
            <div className="text-2xl font-bold text-blue-600 font-mono">{currentState.remainder}</div>
          </div>
        </div>

        {/* Formula display */}
        <div className="text-center bg-white rounded-lg p-4 border border-gray-200">
          <div className="font-mono text-lg">
            <span className="text-gray-800">{currentState.dividend}</span>
            <span className="text-gray-500 mx-2">=</span>
            <span className="text-green-600 font-bold">{currentState.quotient}</span>
            <span className="text-gray-500 mx-1">*</span>
            <span className="text-gray-800">{currentState.divisor}</span>
            <span className="text-gray-500 mx-1">+</span>
            <span className="text-blue-600 font-bold">{currentState.remainder}</span>
          </div>
        </div>

        {/* Visual subtraction representation */}
        {currentState.step > 0 && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-3 text-center">
              {t.subtractionProcess || 'Subtraction Process'}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {renderVisualBlocks()}
            </div>
            <div className="text-center mt-4 text-sm text-gray-600">
              {t.subtract || 'Subtracted'} {currentState.quotient} {t.times || 'times'}
            </div>
          </div>
        )}

        {/* Step indicator */}
        {currentState.step > 0 && (
          <div className="text-center text-sm text-gray-600">
            {t.step || 'Step'}: {currentState.step}
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
            ? divisionVisualization.describeStep(currentStepData, lang)
            : t.divisionReady || 'Ready to start division. Enter dividend and divisor.'
        }
        invariant={divisionVisualization.getInvariant?.(lang)}
        complexity={divisionVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
