// src/components/Sieve.tsx

import { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { DeveloperNote } from './DeveloperNote';
import { StepController } from './common/StepController';
import { ExplanationPanel } from './common/ExplanationPanel';
import { ValidationMessage } from './common/ValidationMessage';
import { sieveVisualization, SieveInput, SieveState } from '../lib/algorithms/sieve';
import { Step } from '../lib/algorithms/types';

export function Sieve() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  // Input state
  const [maxNumber, setMaxNumber] = useState<number>(0);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);

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
      setValidationErrorKey(null);
    } else {
      const num = Number(value);
      setMaxNumber(num > 9999 ? 9999 : num);
      setValidationErrorKey(null);
    }
  };

  const generateNumbers = useCallback(() => {
    if (!maxNumber || maxNumber < 2) {
      setValidationErrorKey('sieveInputRequired');
      return;
    }

    const input: SieveInput = { maxNumber };
    const validation = sieveVisualization.validateInput(input);

    if (validation.valid) {
      const newSteps = sieveVisualization.generateSteps(input);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
      setValidationErrorKey(null);
    } else {
      setValidationErrorKey(validation.errorKey ?? 'sieveInputRequired');
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

  const fullReset = useCallback(() => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setValidationErrorKey(null);
    setMaxNumber(0);
  }, []);

  return (
    <div className="safe-app-x safe-app-bottom max-w-4xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            to="/"
            className="touch-target flex items-center justify-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="min-w-0 break-words bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
            {t.sieveTitle}
          </h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="touch-target flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md transition-colors hover:bg-blue-600"
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
              aria-label={t.maxNumber}
              min="2"
              max="9999"
              value={maxNumber || ''}
              onChange={handleNumberInput}
              onKeyPress={handleKeyPress}
              className={`touch-target w-full rounded-lg border px-4 py-2 ${
                validationErrorKey ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t.maxNumber}
            />
            <ValidationMessage errorKey={validationErrorKey} messages={t} />
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <button
              onClick={generateNumbers}
              className="touch-target flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-white transition-colors hover:bg-green-600"
            >
              <Play className="w-4 h-4" />
              {t.generate}
            </button>
            <button
              onClick={fullReset}
              className="touch-target flex items-center justify-center gap-2 rounded-lg bg-gray-500 px-6 py-3 text-white transition-colors hover:bg-gray-600"
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
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
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
