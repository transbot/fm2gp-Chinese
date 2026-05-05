// src/components/algorithms/PowerAlgorithm.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { StepController } from '../common/StepController';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { powerVisualization, PowerInput, PowerState, PowerStepRecord } from '../../lib/algorithms/power';
import { Step } from '../../lib/algorithms/types';

export function PowerAlgorithm() {
  const { lang } = useLanguage();
  const t = translations[lang] as any;

  // Input state
  const [baseInput, setBaseInput] = useState<string>('2');
  const [exponentInput, setExponentInput] = useState<string>('13');

  // Step state (managed locally for flexibility)
  const [steps, setSteps] = useState<Step<PowerState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Parse input
  const parseInput = useCallback((): PowerInput => {
    const base = parseInt(baseInput) || 0;
    const exponent = parseInt(exponentInput) || 0;
    return { base, exponent };
  }, [baseInput, exponentInput]);

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const input = parseInput();
    const validation = powerVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = powerVisualization.generateSteps(input);
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
  const currentState: PowerState = steps[currentStep]?.state ?? powerVisualization.getInitialState();
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

  // Render step table
  const renderStepTable = () => {
    const { steps: stepRecords } = currentState;

    if (stepRecords.length === 0) {
      return null;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 text-left font-medium text-gray-700">{t.powerStepN || 'n'}</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">{t.powerCurrentPower || 'currentPower'}</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">{t.result || 'Result'}</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">{t.powerAction || 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            {stepRecords.map((record, idx) => (
              <tr
                key={idx}
                className={`border-t border-gray-200 ${
                  idx === stepRecords.length - 1 ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-3 py-2 font-mono">{record.n}</td>
                <td className="px-3 py-2 font-mono">{record.currentPower}</td>
                <td className="px-3 py-2 font-mono">{record.result}</td>
                <td className="px-3 py-2">
                  {record.action === 'check_odd' && (
                    <span className={record.isOdd ? 'text-green-600 font-medium' : 'text-gray-500'}>
                      {record.isOdd ? (t.powerOddMultiply || 'Odd -> Multiply') : (t.powerEvenSkip || 'Even -> Skip')}
                    </span>
                  )}
                  {record.action === 'square' && (
                    <span className="text-blue-600">{t.powerSquare || 'Square'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <AlgorithmLayout
      titleKey="powerTitle"
      descriptionKey="powerDescription"
      devNoteKey="devNotePower"
      algorithm={powerVisualization}
    >
      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Base input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.powerBase || 'Base'}
            </label>
            <input
              type="number"
              min="0"
              max="1000"
              value={baseInput}
              onChange={(e) => setBaseInput(e.target.value)}
              onBlur={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="2"
            />
          </div>

          {/* Exponent input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.powerExponent || 'Exponent'}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={exponentInput}
              onChange={(e) => setExponentInput(e.target.value)}
              onBlur={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="13"
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
            <div className="text-xs text-gray-500 mb-1">{t.powerBase || 'Base'}</div>
            <div className="text-2xl font-bold text-gray-800 font-mono">{currentState.base}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.powerExponent || 'Exponent'}</div>
            <div className="text-2xl font-bold text-gray-800 font-mono">{currentState.exponent}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.powerCurrentPower || 'currentPower'}</div>
            <div className="text-2xl font-bold text-purple-600 font-mono">{currentState.currentPower}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.result || 'Result'}</div>
            <div className="text-2xl font-bold text-green-600 font-mono">{currentState.result}</div>
          </div>
        </div>

        {/* Formula display */}
        <div className="text-center bg-white rounded-lg p-4 border border-gray-200">
          <div className="font-mono text-lg">
            <span className="text-gray-800">{currentState.base}</span>
            <sup className="text-gray-800">{currentState.exponent}</sup>
            <span className="text-gray-500 mx-2">=</span>
            <span className="text-green-600 font-bold">{currentState.result}</span>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {t.powerInvariant || 'Invariant'}: result * currentPower<sup>n</sup> = base<sup>exponent</sup>
          </div>
        </div>

        {/* Step table */}
        {currentState.steps.length > 0 && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-3">
              {t.powerStepHistory || 'Step History'}
            </div>
            {renderStepTable()}
          </div>
        )}

        {/* Binary representation hint */}
        {currentState.exponent > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-sm">
            <div className="text-blue-700">
              <span className="font-medium">{t.powerBinaryHint || 'Binary representation'}:</span>{' '}
              {currentState.exponent} = {currentState.exponent.toString(2)}<sub>2</sub>
            </div>
            <div className="text-blue-600 mt-1 text-xs">
              {t.powerBinaryExplain || 'Each bit determines whether to multiply at that step'}
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
            ? powerVisualization.describeStep(currentStepData, lang)
            : t.powerReady || 'Ready to start power calculation. Enter base and exponent.'
        }
        invariant={powerVisualization.getInvariant?.(lang)}
        complexity={powerVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
