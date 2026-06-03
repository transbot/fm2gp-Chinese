// src/components/FastFibonacci.tsx

import { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { StepController } from './common/StepController';
import { ExplanationPanel } from './common/ExplanationPanel';
import { AlgorithmLayout } from './common/AlgorithmLayout';
import { ValidationMessage } from './common/ValidationMessage';
import { fastFibonacciVisualization, FastFibonacciInput, FastFibonacciState } from '../lib/algorithms/fast_fibonacci';
import { Step } from '../lib/algorithms/types';

// Format large numbers with line breaks every 80 characters
const formatLargeNumber = (num: bigint): string => {
  const str = num.toString();
  if (str.length <= 80) return str;

  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += 80) {
    chunks.push(str.slice(i, i + 80));
  }
  return chunks.join('\n');
};

export function FastFibonacci() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Input state
  const [number, setNumber] = useState<string>('100');

  // Step state (managed locally for flexibility)
  const [steps, setSteps] = useState<Step<FastFibonacciState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);

  // Parse input
  const parseInput = useCallback((): FastFibonacciInput => {
    const n = parseInt(number) || 0;
    return { n };
  }, [number]);

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const input = parseInput();
    const validation = fastFibonacciVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = fastFibonacciVisualization.generateSteps(input);
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
  const currentState: FastFibonacciState = steps[currentStep]?.state ?? fastFibonacciVisualization.getInitialState();
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
      titleKey="fastFibonacciTitle"
      descriptionKey="fastFibonacciDescription"
      devNoteKey="devNoteFastFibonacci"
      algorithm={fastFibonacciVisualization}
    >
      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.fastFibonacciInput || 'Enter n to compute F(n)'}
          </label>
          <input
            type="number"
            min="0"
            max="1000"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            onBlur={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono ${
              validationErrorKey ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="100"
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
            <div className="text-xs text-gray-500 mb-1">{t.fastFibonacciStep || 'Step'}</div>
            <div className="text-2xl font-bold text-purple-600 font-mono">{currentState.stepNum}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.fastFibonacciPhase || 'Phase'}</div>
            <div className="text-lg font-bold text-blue-600 font-mono">{currentState.phase}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.result || 'Result'}</div>
            <div className="text-xl font-bold text-green-600 font-mono truncate">
              {currentState.result.toString().length > 10
                ? currentState.result.toString().slice(0, 10) + '...'
                : currentState.result.toString()}
            </div>
          </div>
        </div>

        {/* Matrix display */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-xs text-gray-500 mb-2">{t.fastFibonacciMatrix || 'Current Matrix'}</div>
          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
            <div className="bg-gray-100 rounded p-2 text-center font-mono text-sm border border-gray-200 truncate" title={currentState.matrix.a.toString()}>
              {currentState.matrix.a.toString().length > 15
                ? currentState.matrix.a.toString().slice(0, 15) + '...'
                : currentState.matrix.a.toString()}
            </div>
            <div className="bg-gray-100 rounded p-2 text-center font-mono text-sm border border-gray-200 truncate" title={currentState.matrix.b.toString()}>
              {currentState.matrix.b.toString().length > 15
                ? currentState.matrix.b.toString().slice(0, 15) + '...'
                : currentState.matrix.b.toString()}
            </div>
            <div className="bg-gray-100 rounded p-2 text-center font-mono text-sm border border-gray-200 truncate" title={currentState.matrix.c.toString()}>
              {currentState.matrix.c.toString().length > 15
                ? currentState.matrix.c.toString().slice(0, 15) + '...'
                : currentState.matrix.c.toString()}
            </div>
            <div className="bg-gray-100 rounded p-2 text-center font-mono text-sm border border-gray-200 truncate" title={currentState.matrix.d.toString()}>
              {currentState.matrix.d.toString().length > 15
                ? currentState.matrix.d.toString().slice(0, 15) + '...'
                : currentState.matrix.d.toString()}
            </div>
          </div>
        </div>

        {/* Binary representation */}
        {currentState.binaryDigits.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-xs text-gray-500 mb-2">{t.fastFibonacciBinary || 'Binary Representation of (n-1)'}</div>
            <div className="flex justify-center gap-1 flex-wrap">
              {currentState.binaryDigits.map((bit, idx) => (
                <span
                  key={idx}
                  className={`w-6 h-6 flex items-center justify-center rounded font-mono text-sm ${
                    idx === currentState.currentBitIndex
                      ? 'bg-blue-500 text-white'
                      : bit === 1
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {bit}
                </span>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600 mt-2">
              {currentState.n - 1} = {currentState.binaryDigits.join('')}<sub>2</sub>
            </div>
          </div>
        )}

        {/* Operation counts */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
            <div className="text-xs text-gray-500 mb-1">{t.additions || 'Additions'}</div>
            <div className="text-lg font-bold text-amber-600 font-mono">{currentState.operationCount.additions}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
            <div className="text-xs text-gray-500 mb-1">{t.multiplications || 'Multiplications'}</div>
            <div className="text-lg font-bold text-purple-600 font-mono">{currentState.operationCount.multiplications}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
            <div className="text-xs text-gray-500 mb-1">{t.totalSteps || 'Total Steps'}</div>
            <div className="text-lg font-bold text-gray-700 font-mono">{currentState.binaryDigits.length}</div>
          </div>
        </div>

        {/* Invariant reminder */}
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 text-sm">
          <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
            <span>Matrix Invariant</span>
          </div>
          <div className="text-amber-800 font-mono text-center">
            [[1,1],[1,0]]<sup>n</sup> = [[F(n+1), F(n)], [F(n), F(n-1)]]
          </div>
        </div>
      </div>

      {/* Final result display (when done) */}
      {currentState.phase === 'done' && currentState.n > 0 && (
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">
            {t.fastFibonacciResult
              ? (lang === 'en'
                  ? t.fastFibonacciResult.replace('nth', `${currentState.n}th`)
                  : t.fastFibonacciResult.replace('n', currentState.n.toString()))
              : `F(${currentState.n})`}
          </h3>
          <pre className="whitespace-pre-wrap font-mono text-base text-green-900 overflow-x-auto">
            {formatLargeNumber(currentState.result)}
          </pre>
        </div>
      )}

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
            ? fastFibonacciVisualization.describeStep(currentStepData, lang)
            : t.fastFibonacciReady || 'Ready to calculate Fibonacci using matrix exponentiation. Enter n and press Start.'
        }
        invariant={fastFibonacciVisualization.getInvariant?.(lang)}
        complexity={fastFibonacciVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
