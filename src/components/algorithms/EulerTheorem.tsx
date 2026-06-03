// src/components/algorithms/EulerTheorem.tsx

import { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { StepController } from '../common/StepController';
import { ExplanationPanel } from '../common/ExplanationPanel';
import { AlgorithmLayout } from '../common/AlgorithmLayout';
import { ValidationMessage } from '../common/ValidationMessage';
import { eulerVisualization, EulerInput, EulerState } from '../../lib/algorithms/euler';
import { Step } from '../../lib/algorithms/types';
import { cn } from '../../lib/utils';

export function EulerTheorem() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Input state
  const [baseInput, setBaseInput] = useState<string>('3');
  const [modulusInput, setModulusInput] = useState<string>('8');

  // Step state (managed locally for flexibility)
  const [steps, setSteps] = useState<Step<EulerState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);

  // Parse input
  const parseInput = useCallback((): EulerInput => {
    const a = Number.parseInt(baseInput, 10);
    const n = Number.parseInt(modulusInput, 10);
    return { a, n };
  }, [baseInput, modulusInput]);

  // Generate steps from current input
  const regenerateSteps = useCallback(() => {
    const input = parseInput();
    if (!Number.isFinite(input.a) || !Number.isFinite(input.n)) {
      setSteps([]);
      setCurrentStep(0);
      setIsPlaying(false);
      setValidationErrorKey('invalidInput');
      return;
    }

    const validation = eulerVisualization.validateInput(input);
    if (validation.valid) {
      const newSteps = eulerVisualization.generateSteps(input);
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
  const currentState: EulerState = steps[currentStep]?.state ?? eulerVisualization.getInitialState();
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

  // Render factorization display
  const renderFactorization = () => {
    const { phiFactors, n } = currentState;
    if (phiFactors.length === 0) return null;

    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="text-sm text-gray-500 mb-2">
          {lang === 'en' ? 'Prime Factorization' : '素因子分解'}
        </div>
        <div className="flex flex-wrap items-center gap-2 justify-center">
          <span className="text-xl font-bold text-gray-800">{n}</span>
          <span className="text-gray-500">=</span>
          {phiFactors.map((f, i) => (
            <span key={i} className="flex items-center">
              <span className="text-xl font-mono text-blue-600">{f.prime}</span>
              {f.exponent > 1 && (
                <sup className="text-xs font-mono text-blue-600">{f.exponent}</sup>
              )}
              {i < phiFactors.length - 1 && (
                <span className="text-gray-500 mx-1">*</span>
              )}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Render totient calculation
  const renderTotientCalculation = () => {
    const { phi, phiFactors, n, phase } = currentState;
    if (phase === 'factorize' || phiFactors.length === 0) return null;

    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="text-sm text-gray-500 mb-2">
          {lang === 'en' ? 'Totient Function Calculation' : '欧拉函数计算'}
        </div>
        <div className="text-center space-y-2">
          <div className="font-mono">
            <span className="text-gray-800">phi({n})</span>
            <span className="text-gray-500 mx-1">=</span>
            <span className="text-gray-800">{n}</span>
            <span className="text-gray-500 mx-1">*</span>
            {phiFactors.map((f, i) => (
              <span key={i} className="inline-flex items-center">
                <span className="text-green-600">(1 - 1/{f.prime})</span>
                {i < phiFactors.length - 1 && (
                  <span className="text-gray-500 mx-1">*</span>
                )}
              </span>
            ))}
          </div>
          <div className="font-mono text-lg">
            <span className="text-gray-800">phi({n})</span>
            <span className="text-gray-500 mx-1">=</span>
            <span className="text-indigo-600 font-bold">{phi}</span>
          </div>
        </div>
      </div>
    );
  };

  // Render theorem statement and verification
  const renderTheoremVerification = () => {
    const { a, n, phi, result, gcdValue, isCoprime, phase } = currentState;
    if (phase !== 'result' && phase !== 'exponentiation') return null;

    const theoremApplies = isCoprime;
    const verified = result === 1;

    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="text-sm text-gray-500 mb-2 text-center">
          {lang === 'en' ? 'Euler\'s Theorem Verification' : '欧拉定理验证'}
        </div>

        {/* Theorem statement */}
        <div className="text-center mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-600">
            {lang === 'en' ? 'Theorem:' : '定理：'}
          </div>
          <div className="font-mono text-lg mt-1">
            <span className="text-gray-800">a<sup>phi(n)</sup></span>
            <span className="text-gray-500 mx-1">=</span>
            <span className="text-indigo-600">1</span>
            <span className="text-gray-500 mx-1">(mod n)</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {lang === 'en' ? 'when gcd(a, n) = 1' : '当 gcd(a, n) = 1'}
          </div>
        </div>

        {/* Verification result */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">
              {lang === 'en' ? 'GCD Check' : 'GCD 检查'}
            </div>
            <div className="font-mono">
              <span className="text-gray-800">gcd({a}, {n})</span>
              <span className="text-gray-500 mx-1">=</span>
              <span className={cn(
                'font-bold',
                gcdValue === 1 ? 'text-green-600' : 'text-orange-600'
              )}>
                {gcdValue}
              </span>
            </div>
            <div className={cn(
              'text-sm mt-1',
              gcdValue === 1 ? 'text-green-600' : 'text-orange-600'
            )}>
              {gcdValue === 1
                ? (lang === 'en' ? 'Coprime' : '互素')
                : (lang === 'en' ? 'Not Coprime' : '不互素')
              }
            </div>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">
              {lang === 'en' ? 'Computation' : '计算'}
            </div>
            <div className="font-mono">
              <span className="text-gray-800">{a}<sup>{phi}</sup></span>
              <span className="text-gray-500 mx-1">mod</span>
              <span className="text-gray-800">{n}</span>
              <span className="text-gray-500 mx-1">=</span>
              <span className="text-indigo-600 font-bold">{result}</span>
            </div>
          </div>
        </div>

        {/* Final verdict */}
        {phase === 'result' && (
          <div className={cn(
            'mt-4 p-4 rounded-lg text-center',
            theoremApplies
              ? (verified ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200')
              : 'bg-gray-100 border border-gray-200'
          )}>
            <div className={cn(
              'font-medium',
              theoremApplies
                ? (verified ? 'text-green-600' : 'text-orange-600')
                : 'text-gray-600'
            )}>
              {theoremApplies
                ? (verified
                  ? (lang === 'en' ? 'Theorem Verified!' : '定理验证成功！')
                  : (lang === 'en' ? 'Unexpected result - check calculation' : '结果异常 - 请检查计算')
                )
                : (lang === 'en'
                  ? 'Theorem does not apply (a and n are not coprime)'
                  : '定理不适用（a 和 n 不互素）'
                )
              }
            </div>
            {!theoremApplies && (
              <div className="text-sm text-gray-500 mt-2">
                {lang === 'en'
                  ? `gcd(${a}, ${n}) = ${gcdValue} > 1, so Euler's theorem precondition is not satisfied`
                  : `gcd(${a}, ${n}) = ${gcdValue} > 1，欧拉定理前提条件不满足`
                }
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <AlgorithmLayout
      titleKey="eulerTitle"
      descriptionKey="eulerDescription"
      devNoteKey="devNoteEuler"
      algorithm={eulerVisualization}
    >
      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Base a input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {lang === 'en' ? 'Base (a)' : '底数 (a)'}
            </label>
            <input
              type="number"
              min="0"
              value={baseInput}
              onChange={(e) => setBaseInput(e.target.value)}
              onBlur={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="3"
            />
          </div>

          {/* Modulus n input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {lang === 'en' ? 'Modulus (n)' : '模数 (n)'}
            </label>
            <input
              type="number"
              min="1"
              max="100000"
              value={modulusInput}
              onChange={(e) => setModulusInput(e.target.value)}
              onBlur={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="8"
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
            <div className="text-xs text-gray-500 mb-1">
              {lang === 'en' ? 'Base (a)' : '底数 (a)'}
            </div>
            <div className="text-2xl font-bold text-gray-800 font-mono">{currentState.a}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">
              {lang === 'en' ? 'Modulus (n)' : '模数 (n)'}
            </div>
            <div className="text-2xl font-bold text-gray-800 font-mono">{currentState.n}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">
              {lang === 'en' ? 'Totient phi(n)' : '欧拉函数 phi(n)'}
            </div>
            <div className="text-2xl font-bold text-indigo-600 font-mono">{currentState.phi}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">
              {lang === 'en' ? 'Result' : '结果'}
            </div>
            <div className={cn(
              'text-2xl font-bold font-mono',
              currentState.phase === 'result' && currentState.result === 1 && currentState.isCoprime
                ? 'text-green-600'
                : 'text-blue-600'
            )}>
              {currentState.currentPower}
            </div>
          </div>
        </div>

        {/* Phase-specific visualization */}
        {currentState.phase === 'factorize' && renderFactorization()}
        {(currentState.phase === 'totient' || currentState.phase === 'exponentiation') && (
          <>
            {renderFactorization()}
            {renderTotientCalculation()}
          </>
        )}
        {(currentState.phase === 'result' || currentState.phase === 'exponentiation') && (
          <>
            {renderFactorization()}
            {renderTotientCalculation()}
            {renderTheoremVerification()}
          </>
        )}

        {/* Step indicator */}
        <div className="text-center text-sm text-gray-600">
          {lang === 'en' ? 'Phase' : '阶段'}: {
            lang === 'en'
              ? currentState.phase.charAt(0).toUpperCase() + currentState.phase.slice(1)
              : currentState.phase === 'factorize' ? '因子分解'
              : currentState.phase === 'totient' ? '计算欧拉函数'
              : currentState.phase === 'exponentiation' ? '模幂运算'
              : '结果'
          }
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
            ? eulerVisualization.describeStep(currentStepData, lang)
            : t.eulerReady || 'Ready to verify Euler\'s theorem. Enter base and modulus.'
        }
        invariant={eulerVisualization.getInvariant?.(lang)}
        complexity={eulerVisualization.getComplexity()}
        operationType={currentStepData?.operation}
      />
    </AlgorithmLayout>
  );
}
