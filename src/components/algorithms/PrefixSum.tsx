import { useCallback, useEffect, useState } from 'react';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { StepController } from '../common/StepController';
import {
  PrefixSumInput,
  PrefixSumState,
  prefixSumVisualization,
} from '../../lib/algorithms/prefix_sum';
import { Step } from '../../lib/algorithms/types';
import { cn } from '../../lib/utils';
import { ValidationMessage } from '../common/ValidationMessage';

export function PrefixSum() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [arrayInput, setArrayInput] = useState('3, -2, 5, 1, 6');
  const [leftInput, setLeftInput] = useState('1');
  const [rightInput, setRightInput] = useState('3');
  const [steps, setSteps] = useState<Step<PrefixSumState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);

  const parseInput = useCallback((): PrefixSumInput => {
    const array = arrayInput
      .split(/[,，]/)
      .map((item) => parseInt(item.trim()))
      .filter((item) => !Number.isNaN(item));

    return {
      array,
      left: parseInt(leftInput) || 0,
      right: parseInt(rightInput) || 0,
    };
  }, [arrayInput, leftInput, rightInput]);

  const setStepsFromInput = useCallback((input: PrefixSumInput) => {
    const validation = prefixSumVisualization.validateInput(input);
    if (!validation.valid) {
      setSteps([]);
      setCurrentStep(0);
      setIsPlaying(false);
      setValidationErrorKey(validation.errorKey ?? null);
      return;
    }

    setValidationErrorKey(null);
    setSteps(prefixSumVisualization.generateSteps(input));
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

  const currentState = steps[currentStep]?.state ?? prefixSumVisualization.getInitialState();
  const currentStepData = steps[currentStep] ?? null;
  const totalSteps = steps.length;

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

  const generateRandomArray = useCallback(() => {
    const array = Array.from({ length: 8 }, () => Math.floor(Math.random() * 19) - 9);
    const left = Math.floor(Math.random() * Math.floor(array.length / 2));
    const right = left + Math.floor(Math.random() * (array.length - left));
    setArrayInput(array.join(', '));
    setLeftInput(String(left));
    setRightInput(String(right));
    setStepsFromInput({ array, left, right });
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

  const isInQueryRange = (index: number) => index >= currentState.left && index <= currentState.right;
  const isActivePrefixIndex = (index: number) => currentState.activePrefixIndices.includes(index);

  return (
    <AlgorithmLayout
      titleKey="prefixSumTitle"
      descriptionKey="prefixSumDescription"
      devNoteKey="devNotePrefixSum"
      algorithm={prefixSumVisualization}
    >
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.array} ({t.commaSeparated})
            </label>
            <input
              type="text"
              aria-label={t.array}
              value={arrayInput}
              onChange={(event) => setArrayInput(event.target.value)}
              onBlur={regenerateSteps}
              className="touch-target w-full rounded-lg border px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="3, -2, 5, 1, 6"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t.leftIndex}</label>
            <input
              type="number"
              aria-label={t.leftIndex}
              value={leftInput}
              onChange={(event) => setLeftInput(event.target.value)}
              onBlur={regenerateSteps}
              className="touch-target w-full rounded-lg border px-4 py-2 font-mono focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t.rightIndex}</label>
            <input
              type="number"
              aria-label={t.rightIndex}
              value={rightInput}
              onChange={(event) => setRightInput(event.target.value)}
              onBlur={regenerateSteps}
              className="touch-target w-full rounded-lg border px-4 py-2 font-mono focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t.queryRange}</label>
            <div className="px-4 py-2 rounded-lg bg-gray-50 border font-mono text-gray-700">
              [{currentState.left}, {currentState.right}]
            </div>
          </div>
        </div>

        <ValidationMessage errorKey={validationErrorKey} messages={t} />

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={generateRandomArray}
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
            {t.buildPrefixSum}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-5">
        <div>
          <div className="text-sm font-medium text-gray-600 mb-2">{t.array}</div>
          <div className="flex flex-wrap gap-2">
            {currentState.array.map((value, index) => (
              <div
                key={index}
                className={cn(
                  'w-14 h-16 rounded-lg border flex flex-col items-center justify-center font-mono transition-all duration-200',
                  isInQueryRange(index) ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-200' : 'bg-white border-gray-200',
                  currentState.currentIndex === index ? 'bg-yellow-200 border-yellow-400 ring-2 ring-yellow-300' : ''
                )}
              >
                <span className="text-lg font-bold text-gray-800">{value}</span>
                <span className="text-xs text-gray-500">[{index}]</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-600 mb-2">{t.prefixArray}</div>
          <div className="flex flex-wrap gap-2">
            {currentState.prefix.map((value, index) => (
              <div
                key={index}
                className={cn(
                  'w-14 h-16 rounded-lg border flex flex-col items-center justify-center font-mono transition-all duration-200',
                  isActivePrefixIndex(index) ? 'bg-teal-200 border-teal-400 ring-2 ring-teal-300' : 'bg-white border-gray-200'
                )}
              >
                <span className="text-lg font-bold text-gray-800">{value}</span>
                <span className="text-xs text-gray-500">p[{index}]</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          {t.result}: <span className="font-mono font-bold text-blue-700">{currentState.queryResult ?? '-'}</span>
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
        disabled={currentState.array.length === 0}
      />

      <ExplanationPanel
        stepDescription={
          currentStepData
            ? prefixSumVisualization.describeStep(currentStepData, lang)
            : t.prefixSumReady
        }
        invariant={prefixSumVisualization.getInvariant?.(lang)}
        complexity={prefixSumVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
