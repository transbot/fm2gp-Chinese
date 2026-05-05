// src/components/algorithms/SteinGcd.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { StepController } from '../common/StepController';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { steinGcdVisualization, SteinGcdInput, SteinGcdState } from '../../lib/algorithms/stein_gcd';
import { Step } from '../../lib/algorithms/types';
import { cn } from '../../lib/utils';

export function SteinGcd() {
  const { lang } = useLanguage();
  const t = translations[lang] as any;

  // Input state
  const [aInput, setAInput] = useState<string>('48');
  const [bInput, setBInput] = useState<string>('18');

  // Step state
  const [steps, setSteps] = useState<Step<SteinGcdState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Parse input
  const parseInput = useCallback((): SteinGcdInput => {
    const a = parseInt(aInput) || 0;
    const b = parseInt(bInput) || 0;
    return { a, b };
  }, [aInput, bInput]);

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const input = parseInput();
    const validation = steinGcdVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = steinGcdVisualization.generateSteps(input);
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
  const currentState: SteinGcdState = steps[currentStep]?.state ?? steinGcdVisualization.getInitialState();
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

  // Render bit visualization
  const renderBitVisualization = (num: number, label: string) => {
    const binary = num.toString(2);
    const isEven = (num & 1) === 0;

    return (
      <div className="bg-white rounded-lg p-3 border border-gray-200">
        <div className="text-xs text-gray-500 mb-1">{label}</div>
        <div className="text-2xl font-bold font-mono text-gray-800">{num}</div>
        <div className="flex gap-0.5 mt-2 justify-center flex-wrap">
          {binary.split('').map((bit, idx) => (
            <div
              key={idx}
              className={cn(
                'w-6 h-6 rounded flex items-center justify-center text-xs font-bold font-mono',
                bit === '1' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              )}
            >
              {bit}
            </div>
          ))}
        </div>
        <div className={cn(
          'text-xs mt-1 text-center font-medium',
          isEven ? 'text-green-600' : 'text-orange-600'
        )}>
          {isEven ? (t.even || 'Even') : (t.odd || 'Odd')}
        </div>
      </div>
    );
  };

  // Render operation indicator
  const renderOperationIndicator = () => {
    const op = currentState.operation;

    if (op === 'init') {
      return (
        <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
          <div className="text-blue-800 font-medium">{t.steinGcdInit || 'Initializing...'}</div>
        </div>
      );
    }

    if (op === 'common_shift' || op === 'make_a_odd' || op === 'make_b_odd' ||
        op === 'shift_after_subtract_a' || op === 'shift_after_subtract_b') {
      return (
        <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-lg text-purple-800">
              {op.includes('a') || op === 'common_shift' ? `a >> 1` : `b >> 1`}
            </span>
            <ArrowRight className="w-4 h-4 text-purple-600" />
            <span className="font-mono text-lg text-purple-800">
              {op.includes('a') || op === 'common_shift' ? currentState.a : currentState.b}
            </span>
          </div>
          <div className="text-xs text-purple-600 mt-1">{t.steinGcdShift || 'Right shift (divide by 2)'}</div>
        </div>
      );
    }

    if (op === 'subtract_a' || op === 'subtract_b') {
      const subtracted = op === 'subtract_a' ? currentState.a : currentState.b;
      return (
        <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
          <div className="text-orange-800 font-medium">
            {t.steinGcdSubtract || 'Subtraction'}: {op === 'subtract_a' ? '|a - b|' : '|b - a|'}
          </div>
        </div>
      );
    }

    if (op === 'final_shift') {
      return (
        <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-lg text-green-800">{currentState.gcd >> currentState.shift}</span>
            <span className="text-green-600">&lt;&lt;</span>
            <span className="font-mono text-lg text-green-800">{currentState.shift}</span>
            <ArrowRight className="w-4 h-4 text-green-600" />
            <span className="font-mono text-xl font-bold text-green-800">{currentState.gcd}</span>
          </div>
          <div className="text-xs text-green-600 mt-1">{t.steinGcdFinalShift || 'Final left shift (multiply by 2^shift)'}</div>
        </div>
      );
    }

    return null;
  };

  return (
    <AlgorithmLayout
      titleKey="steinGcdTitle"
      descriptionKey="steinGcdDescription"
      devNoteKey="devNoteSteinGcd"
      algorithm={steinGcdVisualization}
    >
      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* A input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.firstNumber || 'First Number (a)'}
            </label>
            <input
              type="number"
              min="0"
              max="1000000"
              value={aInput}
              onChange={(e) => setAInput(e.target.value)}
              onBlur={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="48"
            />
          </div>

          {/* B input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.secondNumber || 'Second Number (b)'}
            </label>
            <input
              type="number"
              min="0"
              max="1000000"
              value={bInput}
              onChange={(e) => setBInput(e.target.value)}
              onBlur={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="18"
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
          {renderBitVisualization(currentState.a, 'a')}
          {renderBitVisualization(currentState.b, 'b')}
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.steinGcdShift || 'Common Shift'}</div>
            <div className="text-2xl font-bold font-mono text-purple-600">{currentState.shift}</div>
            <div className="text-xs text-gray-400 mt-1">2^{currentState.shift} = {Math.pow(2, currentState.shift)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.result || 'GCD'}</div>
            <div className="text-2xl font-bold font-mono text-green-600">{currentState.gcd || '-'}</div>
          </div>
        </div>

        {/* Operation indicator */}
        {renderOperationIndicator()}

        {/* Step comparison */}
        {currentState.euclideanSteps !== undefined && currentState.euclideanSteps > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">{t.steinAlgorithm || "Stein's Algorithm"}</div>
              <div className="text-xl font-bold font-mono text-purple-600">
                {currentState.step} {t.steps || 'steps'}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">{t.euclideanAlgorithm || 'Euclidean Algorithm'}</div>
              <div className="text-xl font-bold font-mono text-blue-600">
                {currentState.euclideanSteps} {t.steps || 'steps'}
              </div>
            </div>
          </div>
        )}

        {/* Final result */}
        {currentState.gcd > 0 && currentState.operation === 'final_shift' && (
          <div className="bg-green-100 rounded-lg p-4 text-center border border-green-300">
            <div className="text-lg font-semibold text-green-800">
              {t.steinGcdResult || 'GCD'} = {currentState.gcd}
            </div>
            <div className="text-sm text-green-600 mt-1">
              ({t.steinGcdEfficiency || 'Stein\'s algorithm is especially efficient for large numbers and on hardware without division'})
            </div>
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
            ? steinGcdVisualization.describeStep(currentStepData, lang)
            : (t.steinGcdReady || 'Ready to start Stein\'s GCD. Enter two numbers.')
        }
        invariant={steinGcdVisualization.getInvariant?.(lang)}
        complexity={steinGcdVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
