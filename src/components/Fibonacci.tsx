// src/components/Fibonacci.tsx

import { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { StepController } from './common/StepController';
import { ExplanationPanel } from './common/ExplanationPanel';
import { AlgorithmLayout } from './common/AlgorithmLayout';
import { ValidationMessage } from './common/ValidationMessage';
import { fibonacciVisualization, FibonacciInput, FibonacciState } from '../lib/algorithms/fibonacci';
import { Step } from '../lib/algorithms/types';

export function Fibonacci() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Input state
  const [number, setNumber] = useState<string>('10');

  // Step state (managed locally for flexibility)
  const [steps, setSteps] = useState<Step<FibonacciState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);

  // Parse input
  const parseInput = useCallback((): FibonacciInput => {
    const n = parseInt(number) || 0;
    return { n };
  }, [number]);

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const input = parseInput();
    const validation = fibonacciVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = fibonacciVisualization.generateSteps(input);
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
  const currentState: FibonacciState = steps[currentStep]?.state ?? fibonacciVisualization.getInitialState();
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

  return (
    <AlgorithmLayout
      titleKey="fibonacciTitle"
      descriptionKey="fibonacciDescription"
      devNoteKey="devNoteFibonacci"
      algorithm={fibonacciVisualization}
    >
      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.fibonacciInput || 'Enter n to compute F(n)'}
          </label>
          <input
            type="number"
            min="0"
            max="40"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            onBlur={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono ${
              validationErrorKey ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="10"
          />
          <ValidationMessage errorKey={validationErrorKey} messages={t} />
        </div>

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
            <div className="text-xs text-gray-500 mb-1">{t.fibonacciN || 'n'}</div>
            <div className="text-2xl font-bold text-gray-800 font-mono">{currentState.n}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.fibonacciCurrentN || 'Current i'}</div>
            <div className="text-2xl font-bold text-purple-600 font-mono">{currentState.currentN}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.fibonacciDepth || 'Depth'}</div>
            <div className="text-2xl font-bold text-blue-600 font-mono">{currentState.depth}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.result || 'Result'}</div>
            <div className="text-2xl font-bold text-green-600 font-mono">{currentState.result}</div>
          </div>
        </div>

        {/* Recursion relation display */}
        {currentState.phase === 'computing' && currentState.callStack.length === 2 && (
          <div className="text-center bg-white rounded-lg p-4 border border-gray-200">
            <div className="font-mono text-lg">
              <span className="text-gray-800">F({currentState.currentN})</span>
              <span className="text-gray-500 mx-2">=</span>
              <span className="text-blue-600">F({currentState.callStack[0]})</span>
              <span className="text-gray-500 mx-1">+</span>
              <span className="text-blue-600">F({currentState.callStack[1]})</span>
              <span className="text-gray-500 mx-2">=</span>
              <span className="text-green-600 font-bold">{currentState.currentResult}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.additionCount || 'Addition Count'}</div>
            <div className="text-xl font-bold text-amber-600 font-mono">{currentState.additions}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.fibonacciPhase || 'Phase'}</div>
            <div className="text-xl font-bold text-gray-700 font-mono">
              {currentState.phase === 'done' ? (t.done || 'Done') : (t.computing || 'Computing')}
            </div>
          </div>
        </div>

        {/* Invariant reminder */}
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 text-sm">
          <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
            <span>Invariant</span>
          </div>
          <div className="text-amber-800 font-mono">
            F(n) = F(n-1) + F(n-2), with F(0) = 0, F(1) = 1
          </div>
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
        onStep={(direction) => direction === 'forward' ? stepForward() : stepBackward()}
        onSpeedChange={setSpeed}
        onSeek={seek}
        disabled={steps.length === 0}
      />

      {/* Explanation Panel */}
      <ExplanationPanel
        stepDescription={
          currentStepData
            ? fibonacciVisualization.describeStep(currentStepData, lang)
            : t.fibonacciReady || 'Ready to calculate Fibonacci. Enter n and press Start.'
        }
        invariant={fibonacciVisualization.getInvariant?.(lang)}
        complexity={fibonacciVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
