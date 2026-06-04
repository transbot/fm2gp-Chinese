// src/components/algorithms/FermatTheorem.tsx

import { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { StepController } from '../common/StepController';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { ValidationMessage } from '../common/ValidationMessage';
import { fermatVisualization, FermatInput, FermatState } from '../../lib/algorithms/fermat';
import { Step } from '../../lib/algorithms/types';

export function FermatTheorem() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Input state
  const [aInput, setAInput] = useState<string>('2');
  const [pInput, setPInput] = useState<string>('7');

  // Step state
  const [steps, setSteps] = useState<Step<FermatState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);

  // Parse input
  const parseInput = useCallback((): FermatInput => {
    const a = Number.parseInt(aInput, 10);
    const p = Number.parseInt(pInput, 10);
    return { a, p };
  }, [aInput, pInput]);

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const input = parseInput();
    if (!Number.isFinite(input.a) || !Number.isFinite(input.p)) {
      setSteps([]);
      setCurrentStep(0);
      setIsPlaying(false);
      setValidationErrorKey('invalidInput');
      return;
    }

    const validation = fermatVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = fermatVisualization.generateSteps(input);
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
  const currentState: FermatState = steps[currentStep]?.state ?? fermatVisualization.getInitialState();
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

  // Render result status
  const renderResultStatus = () => {
    if (!currentState.isComplete) return null;

    const { a, p, modResult, isPrime } = currentState;

    if (isPrime) {
      return (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <span>
            {lang === 'en'
              ? `Theorem verified! ${p} is prime, and ${a}^(${p}-1) mod ${p} = 1`
              : `定理验证成功！${p} 是素数，且 ${a}^(${p}-1) mod ${p} = 1`}
          </span>
        </div>
      );
    } else if (modResult === 1n) {
      return (
        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-3 rounded-lg">
          <AlertTriangle className="w-5 h-5" />
          <span>
            {lang === 'en'
              ? `${p} is composite, but ${a} is a Fermat pseudoprime base (result = 1)`
              : `${p} 是合数，但 ${a} 是费马伪素数的基数（结果 = 1）`}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
          <XCircle className="w-5 h-5" />
          <span>
            {lang === 'en'
              ? `${p} is composite. Theorem doesn't apply: ${a}^(${p}-1) mod ${p} = ${modResult} ≠ 1`
              : `${p} 是合数。定理不适用：${a}^(${p}-1) mod ${p} = ${modResult} ≠ 1`}
          </span>
        </div>
      );
    }
  };

  return (
    <AlgorithmLayout
      titleKey="fermatTitle"
      descriptionKey="fermatDescription"
      devNoteKey="devNoteFermat"
      algorithm={fermatVisualization}
    >
      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        {/* Theorem statement */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-center font-mono text-lg text-blue-800">
            {lang === 'en' ? (
              <>
                Fermat's Little Theorem: If <strong>p</strong> is prime and gcd(<strong>a</strong>, <strong>p</strong>) = 1,
                then <strong>a</strong><sup>p-1</sup> ≡ 1 (mod <strong>p</strong>)
              </>
            ) : (
              <>
                费马小定理：如果 <strong>p</strong> 是素数且 gcd(<strong>a</strong>, <strong>p</strong>) = 1，
                则 <strong>a</strong><sup>p-1</sup> ≡ 1 (mod <strong>p</strong>)
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Base a input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.base || 'Base'} <i>a</i>
            </label>
            <input
              aria-label={`${t.base || 'Base'} a`}
              type="number"
              min="1"
              max="1000"
              value={aInput}
              onChange={(e) => setAInput(e.target.value)}
              onBlur={handleInputChange}
              className="touch-target w-full rounded-lg border px-4 py-2 font-mono focus:ring-2 focus:ring-blue-500"
              placeholder="2"
            />
          </div>

          {/* Prime candidate p input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.primeCandidate || 'Prime Candidate'} <i>p</i>
            </label>
            <input
              aria-label={`${t.primeCandidate || 'Prime Candidate'} p`}
              type="number"
              min="2"
              max="1000"
              value={pInput}
              onChange={(e) => setPInput(e.target.value)}
              onBlur={handleInputChange}
              className="touch-target w-full rounded-lg border px-4 py-2 font-mono focus:ring-2 focus:ring-blue-500"
              placeholder="7"
            />
          </div>
        </div>

        <ValidationMessage errorKey={validationErrorKey} messages={t} />

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              reset();
              regenerateSteps();
            }}
            className="touch-target flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
          >
            <RotateCcw className="w-4 h-4" />
            {t.reset || 'Reset'}
          </button>
          <button
            onClick={play}
            disabled={isPlaying || totalSteps <= 1}
            className="touch-target flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 font-medium text-white hover:bg-green-600 disabled:opacity-50"
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
            <div className="text-xs text-gray-500 mb-1">{t.base || 'Base'} a</div>
            <div className="text-2xl font-bold text-gray-800 font-mono">{currentState.a}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.modulus || 'Modulus'} p</div>
            <div className="text-2xl font-bold text-gray-800 font-mono">{currentState.p}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.exponent || 'Exponent'} (p-1)</div>
            <div className="text-2xl font-bold text-purple-600 font-mono">{currentState.exponent.toString()}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">{t.result || 'Result'}</div>
            <div className="text-2xl font-bold text-green-600 font-mono">{currentState.modResult.toString()}</div>
          </div>
        </div>

        {/* Computation display */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-center font-mono text-lg mb-4">
            <span className="text-gray-500">{currentState.a}</span>
            <sup className="text-purple-600">{currentState.exponent.toString()}</sup>
            <span className="text-gray-500 mx-2">mod</span>
            <span className="text-gray-800">{currentState.p}</span>
            <span className="text-gray-500 mx-2">=</span>
            <span className="text-green-600 font-bold">{currentState.modResult.toString()}</span>
          </div>

          {/* Binary representation of exponent */}
          <div className="text-center text-sm text-gray-600 mb-4">
            {lang === 'en' ? 'Binary of exponent:' : '指数的二进制表示：'} (
            {currentState.exponent.toString()}<sub>10</sub>
            ) = (
            {currentState.binaryDigits.join('')}<sub>2</sub>
            )
          </div>

          {/* Step visualization */}
          {currentState.steps.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-xs text-gray-500 text-center mb-2">
                {lang === 'en' ? 'Fast Modular Exponentiation Steps' : '快速模幂运算步骤'}
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {currentState.steps.slice(0, currentState.stepIndex).map((expStep, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1 rounded text-xs font-mono ${
                      expStep.operation === 'multiply'
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-blue-100 text-blue-700 border border-blue-300'
                    }`}
                  >
                    {expStep.operation === 'multiply' ? '×' : '²'} → {expStep.value.toString()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Result status */}
        {renderResultStatus()}

        {/* Prime status indicator */}
        <div className="text-center">
          <span className="text-sm text-gray-600">
            {lang === 'en' ? 'Prime status: ' : '素数状态：'}
          </span>
          {currentState.isPrime !== null && (
            <span className={`font-medium ${currentState.isPrime ? 'text-green-600' : 'text-red-600'}`}>
              {currentState.isPrime
                ? (lang === 'en' ? 'Prime' : '素数')
                : (lang === 'en' ? 'Composite' : '合数')}
            </span>
          )}
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
            ? fermatVisualization.describeStep(currentStepData, lang)
            : t.fermatReady || 'Ready to verify Fermat\'s Little Theorem. Enter base a and prime candidate p.'
        }
        invariant={fermatVisualization.getInvariant?.(lang)}
        complexity={fermatVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
