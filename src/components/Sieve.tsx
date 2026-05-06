// src/components/Sieve.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { DeveloperNote } from './DeveloperNote';
import { StepController } from './common/StepController';
import { ExplanationPanel } from './common/ExplanationPanel';
import { sieveVisualization, SieveInput, SieveState } from '../lib/algorithms/sieve';
import { Step } from '../lib/algorithms/types';

export function Sieve() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang] as any;

  // Input state
  const [maxNumber, setMaxNumber] = useState<number>(0);
  const [showError, setShowError] = useState<boolean>(false);

  // Step state (managed locally for flexibility)
  const [steps, setSteps] = useState<Step<SieveState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Derived state
  const currentState: SieveState = steps[currentStep]?.state ?? sieveVisualization.getInitialState();
  const currentStepData = steps[currentStep] ?? null;
  const totalSteps = steps.length;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      generateNumbers();
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value === '') {
      setMaxNumber(0);
      setShowError(false);
    } else {
      const num = Number(value);
      setMaxNumber(num > 9999 ? 9999 : num);
      setShowError(false);
    }
  };

  const generateNumbers = useCallback(() => {
    if (!maxNumber || maxNumber < 2) {
      setShowError(true);
      return;
    }

    const input: SieveInput = { maxNumber };
    const validation = sieveVisualization.validateInput(input);

    if (validation.valid) {
      const newSteps = sieveVisualization.generateSteps(input);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
      setShowError(false);
    } else {
      setShowError(true);
    }
  }, [maxNumber]);

  // Play/pause interval
  useEffect(() => {
    if (isPlaying && currentStep < totalSteps - 1) {
      const interval = 1000 / speed;
      const timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, interval);
      return () => clearInterval(timer);
    }
  }, [isPlaying, speed, totalSteps, currentStep]);

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

  const fullReset = useCallback(() => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setShowError(false);
    setMaxNumber(0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors shrink-0"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {t.sieveTitle}
          </h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.sieveDescription}</p>

      <div className="space-y-4">
        {/* Input Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.maxNumber} <span className="text-red-500">{t.required}</span>
            </label>
            <p className="text-sm text-gray-600">{t.sieveInputDescription}</p>
            <input
              type="number"
              min="2"
              max="9999"
              value={maxNumber || ''}
              onChange={handleNumberInput}
              onKeyPress={handleKeyPress}
              className={`w-full px-4 py-2 border rounded-lg ${
                showError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t.maxNumber}
            />
            {showError && (
              <p className="text-red-500 text-sm mt-1">
                {t.sieveInputRequired}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={generateNumbers}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {t.generate}
            </button>
            <button
              onClick={fullReset}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {t.reset}
            </button>
          </div>
        </div>

        {/* Visualization */}
        {currentState.numbers.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
            {/* Show 2 as prime */}
            <div className="flex justify-center mb-2">
              <div className="p-2 text-center rounded bg-green-500 text-white font-bold">
                2
              </div>
            </div>

            {/* Grid of odd numbers */}
            <div className="grid grid-cols-10 gap-2">
              {currentState.numbers.map((num, index) => (
                <div
                  key={index}
                  className={`p-2 text-center rounded ${
                    num.isPrime
                      ? num.isMarked
                        ? 'bg-green-500 text-white'
                        : 'bg-green-100'
                      : 'bg-red-100'
                  }`}
                >
                  {num.value}
                </div>
              ))}
            </div>

            {/* Current prime info */}
            {currentState.currentPrime > 0 && !currentState.isComplete && (
              <div className="text-center text-sm text-gray-600">
                {lang === 'en'
                  ? `Processing prime: ${currentState.currentPrime}`
                  : `处理素数: ${currentState.currentPrime}`}
              </div>
            )}

            {/* Completion message */}
            {currentState.isComplete && (
              <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center font-medium">
                {t.allPrimesFound} ({currentState.primeCount} {lang === 'en' ? 'primes' : '个素数'})
              </div>
            )}
          </div>
        )}

        {/* Step Controller */}
        {steps.length > 0 && (
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
        )}

        {/* Explanation Panel */}
        {steps.length > 0 && (
          <ExplanationPanel
            stepDescription={
              currentStepData
                ? sieveVisualization.describeStep(currentStepData, lang)
                : (t.sieveReady || 'Ready to start Sieve of Eratosthenes.')
            }
            invariant={sieveVisualization.getInvariant?.(lang)}
            complexity={sieveVisualization.getComplexity()}
            operationType={currentStepData?.operation}
          />
        )}
      </div>

      <DeveloperNote noteKey="devNoteSieve" />
      <Links lang={lang} />
    </div>
  );
}
