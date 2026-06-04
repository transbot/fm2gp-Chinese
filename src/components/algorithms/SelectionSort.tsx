import { useCallback, useEffect, useState } from 'react';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { StepController } from '../common/StepController';
import {
  SelectionSortInput,
  SelectionSortState,
  selectionSortVisualization,
} from '../../lib/algorithms/selection_sort';
import { Step } from '../../lib/algorithms/types';
import { cn } from '../../lib/utils';
import { ValidationMessage } from '../common/ValidationMessage';

export function SelectionSort() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [arrayInput, setArrayInput] = useState('64, 25, 12, 22, 11');
  const [steps, setSteps] = useState<Step<SelectionSortState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);

  const parseInput = useCallback((): SelectionSortInput => {
    const array = arrayInput
      .split(/[,，]/)
      .map((item) => parseInt(item.trim()))
      .filter((item) => !Number.isNaN(item));

    return { array };
  }, [arrayInput]);

  const setStepsFromInput = useCallback((input: SelectionSortInput) => {
    const validation = selectionSortVisualization.validateInput(input);
    if (!validation.valid) {
      setSteps([]);
      setCurrentStep(0);
      setIsPlaying(false);
      setValidationErrorKey(validation.errorKey ?? null);
      return;
    }

    setValidationErrorKey(null);
    setSteps(selectionSortVisualization.generateSteps(input));
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

  const currentState = steps[currentStep]?.state ?? selectionSortVisualization.getInitialState();
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
    const array = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
    setArrayInput(array.join(', '));
    setStepsFromInput({ array });
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

  const getCellColor = (index: number) => {
    const operation = currentStepData?.operation;

    if (operation === 'complete') return 'bg-green-300 ring-2 ring-green-500';
    if (index <= currentState.sortedUntil) return 'bg-teal-100 border-teal-300';
    if (index === currentState.minIndex) return 'bg-purple-300 ring-2 ring-purple-500';
    if (index === currentState.scanIndex && operation === 'compare') return 'bg-yellow-300 ring-2 ring-yellow-500';
    if (index === currentState.currentPass) return 'bg-blue-200 ring-2 ring-blue-400';
    return 'bg-gray-100 border-gray-200';
  };

  return (
    <AlgorithmLayout
      titleKey="selectionSortTitle"
      descriptionKey="selectionSortDescription"
      devNoteKey="devNoteSelectionSort"
      algorithm={selectionSortVisualization}
    >
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.array} ({t.commaSeparated})
          </label>
          <input
            type="text"
            value={arrayInput}
            onChange={(event) => setArrayInput(event.target.value)}
            onBlur={regenerateSteps}
            aria-label={t.array}
            className="touch-target w-full rounded-lg border px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="64, 25, 12, 22, 11"
          />
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
            {t.startSort}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
        <div className="flex flex-wrap justify-center gap-2">
          {currentState.array.map((value, index) => (
            <div
              key={index}
              className={cn(
                'w-14 h-16 rounded-lg border flex flex-col items-center justify-center font-mono transition-all duration-200',
                getCellColor(index)
              )}
            >
              <span className="text-lg font-bold text-gray-800">{value}</span>
              <span className="text-xs text-gray-500">[{index}]</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-sm text-gray-600">
          <div>{t.currentMinimum}: <span className="font-mono font-semibold">{currentState.minIndex >= 0 ? currentState.minIndex : '-'}</span></div>
          <div>{t.comparisons}: <span className="font-mono font-semibold">{currentState.comparisons}</span></div>
          <div>{t.swaps}: <span className="font-mono font-semibold">{currentState.swaps}</span></div>
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
            ? selectionSortVisualization.describeStep(currentStepData, lang)
            : t.selectionSortReady
        }
        invariant={selectionSortVisualization.getInvariant?.(lang)}
        complexity={selectionSortVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
