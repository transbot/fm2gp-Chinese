import { useCallback, useEffect, useState } from 'react';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import {
  frequencyCountVisualization,
  FrequencyCountInput,
  FrequencyCountState,
} from '../../lib/algorithms/frequency_count';
import { Step } from '../../lib/algorithms/types';
import { cn } from '../../lib/utils';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { StepController } from '../common/StepController';
import { ValidationMessage } from '../common/ValidationMessage';

export function FrequencyCount() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [valuesInput, setValuesInput] = useState('apple, banana, apple, pear, banana, apple');
  const [targetInput, setTargetInput] = useState('apple');
  const [steps, setSteps] = useState<Step<FrequencyCountState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);

  const parseInput = useCallback((): FrequencyCountInput => ({
    values: valuesInput.split(/[,，]/).map((item) => item.trim()).filter(Boolean),
    target: targetInput.trim(),
  }), [targetInput, valuesInput]);

  const setStepsFromInput = useCallback((input: FrequencyCountInput) => {
    const validation = frequencyCountVisualization.validateInput(input);
    if (!validation.valid) {
      setSteps([]);
      setCurrentStep(0);
      setIsPlaying(false);
      setValidationErrorKey(validation.errorKey ?? null);
      return;
    }

    setValidationErrorKey(null);
    setSteps(frequencyCountVisualization.generateSteps(input));
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const regenerateSteps = useCallback(() => {
    setStepsFromInput(parseInput());
  }, [parseInput, setStepsFromInput]);

  useEffect(() => {
    regenerateSteps();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);

      return () => clearInterval(timer);
    }
  }, [currentStep, isPlaying, speed, steps.length]);

  const currentState = steps[currentStep]?.state ?? frequencyCountVisualization.getInitialState();
  const currentStepData = steps[currentStep] ?? null;
  const totalSteps = steps.length;
  const countEntries = Object.entries(currentState.counts).sort(([a], [b]) => a.localeCompare(b));

  const play = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep, totalSteps]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const generateSampleValues = useCallback(() => {
    const sample = ['red', 'blue', 'red', 'green', 'blue', 'red', 'yellow'];
    setValuesInput(sample.join(', '));
    setTargetInput('red');
    setStepsFromInput({ values: sample, target: 'red' });
  }, [setStepsFromInput]);

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

  return (
    <AlgorithmLayout
      titleKey="frequencyCountTitle"
      descriptionKey="frequencyCountDescription"
      devNoteKey="devNoteFrequencyCount"
      algorithm={frequencyCountVisualization}
    >
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.values} ({t.commaSeparated})
            </label>
            <input
              type="text"
              aria-label={t.values}
              value={valuesInput}
              onChange={(event) => setValuesInput(event.target.value)}
              onBlur={regenerateSteps}
              className="touch-target w-full rounded-lg border px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="apple, banana, apple"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t.target}</label>
            <input
              type="text"
              aria-label={t.target}
              value={targetInput}
              onChange={(event) => setTargetInput(event.target.value)}
              onBlur={regenerateSteps}
              className="touch-target w-full rounded-lg border px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="apple"
            />
          </div>
        </div>

        <ValidationMessage errorKey={validationErrorKey} messages={t} />

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={generateSampleValues}
            className="touch-target flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-2 text-indigo-700 transition-colors hover:bg-indigo-200"
          >
            <Shuffle className="w-4 h-4" />
            {t.random}
          </button>
          <button
            onClick={() => {
              reset();
              regenerateSteps();
            }}
            className="touch-target flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
          >
            <RotateCcw className="w-4 h-4" />
            {t.reset}
          </button>
          <button
            onClick={play}
            disabled={isPlaying || totalSteps <= 1}
            className="touch-target flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 font-medium text-white hover:bg-green-600 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            {t.startCounting}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-5">
        <div>
          <div className="text-sm font-medium text-gray-600 mb-2">{t.values}</div>
          <div className="flex flex-wrap gap-2">
            {currentState.values.map((value, index) => (
              <div
                key={`${value}-${index}`}
                className={cn(
                  'min-w-20 h-16 px-3 rounded-lg border flex flex-col items-center justify-center font-mono transition-all duration-200',
                  currentState.currentIndex === index ? 'bg-yellow-200 border-yellow-400 ring-2 ring-yellow-300' : 'bg-white border-gray-200'
                )}
              >
                <span className="text-sm font-bold text-gray-800">{value}</span>
                <span className="text-xs text-gray-500">[{index}]</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">{t.countsTable}</div>
            <div className="space-y-2">
              {countEntries.length === 0 ? (
                <div className="text-sm text-gray-500">{t.empty}</div>
              ) : (
                countEntries.map(([value, count]) => (
                  <div key={value} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-gray-700">{value}</span>
                    <span className="font-mono font-bold text-blue-700">{count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 grid grid-cols-1 gap-3 text-sm text-gray-600">
            <div>{t.currentValue}: <span className="font-mono font-semibold">{currentState.currentValue ?? '-'}</span></div>
            <div>{t.distinctValues}: <span className="font-mono font-semibold">{currentState.distinctCount}</span></div>
            <div>{t.targetCount}: <span className="font-mono font-semibold text-blue-700">{currentState.targetCount}</span></div>
          </div>
        </div>
      </div>

      <StepController
        currentStep={currentStep}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        speed={speed}
        onPlay={play}
        onPause={() => setIsPlaying(false)}
        onStep={(direction) => direction === 'forward' ? stepForward() : stepBackward()}
        onSpeedChange={setSpeed}
        onSeek={seek}
        disabled={currentState.values.length === 0}
      />

      <ExplanationPanel
        stepDescription={
          currentStepData
            ? frequencyCountVisualization.describeStep(currentStepData, lang)
            : t.frequencyCountReady
        }
        invariant={frequencyCountVisualization.getInvariant?.(lang)}
        complexity={frequencyCountVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
