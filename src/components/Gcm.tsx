import React, { useState } from 'react';
import { Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';

interface Step {
  a: number;
  b: number;
  quotient?: number;
  remainder: number | null;
  isSwap: boolean;
  calculation?: {
    multiplication?: string;
    subtraction?: string;
  };
}

const MAX_NUMBER = Number.MAX_SAFE_INTEGER;

export function Gcm() {
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      startCalculation();
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: number) => void) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value === '') {
      setter(0);
      setShowError(false);
    } else {
      const num = Number(value);
      if (num > MAX_NUMBER) {
        setter(MAX_NUMBER);
      } else {
        setter(num);
      }
      setShowError(false);
    }
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('fullwide', { useGrouping: true });
  };

  const startCalculation = () => {
    if (!firstNumber || !secondNumber) {
      setShowError(true);
      return;
    }
    
    // If both numbers are equal, set result immediately
    if (firstNumber === secondNumber) {
      setSteps([{
        a: firstNumber,
        b: secondNumber,
        remainder: 0,
        isSwap: false
      }]);
      setCurrentStep(0);
      setIsComplete(true);
      setShowError(false);
      return;
    }

    setSteps([{
      a: firstNumber,
      b: secondNumber,
      remainder: null,
      isSwap: false
    }]);
    setCurrentStep(0);
    setIsComplete(false);
    setShowError(false);
  };

  const nextStep = () => {
    if (currentStep < 0 || isComplete) return;

    const currentA = steps[currentStep].a;
    const currentB = steps[currentStep].b;

    if (currentB === 0) {
      setIsComplete(true);
      return;
    }

    // Calculate quotient and remainder
    const quotient = Math.floor(currentA / currentB);
    const remainder = currentA % currentB;

    // Add step showing the division calculation
    const newSteps = [...steps, {
      a: currentA,
      b: currentB,
      quotient,
      remainder,
      isSwap: false,
      calculation: {
        multiplication: `${currentB} × ${quotient} = ${currentB * quotient}`,
        subtraction: `${currentA} - ${currentB * quotient} = ${remainder}`
      }
    }];

    if (remainder === 0) {
      setSteps(newSteps);
      setCurrentStep(prev => prev + 1);
      setIsComplete(true);
      return;
    }

    // Add the step showing the swap
    newSteps.push({
      a: currentB,
      b: remainder,
      remainder: null,
      isSwap: true
    });

    setSteps(newSteps);
    setCurrentStep(prev => prev + 2);
  };

  const reset = () => {
    setFirstNumber(0);
    setSecondNumber(0);
    setSteps([]);
    setCurrentStep(-1);
    setIsComplete(false);
    setShowError(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="text-3xl font-bold">{t.gcmTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.gcmDescription}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.firstNumber} <span className="text-red-500">{t.required}</span>
          </label>
          <input
            type="number"
            value={firstNumber || ''}
            onChange={(e) => handleNumberInput(e, setFirstNumber)}
            onKeyPress={handleKeyPress}
            className={`w-full px-4 py-2 border rounded-lg ${
              showError && !firstNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t.firstNumber}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.secondNumber} <span className="text-red-500">{t.required}</span>
          </label>
          <input
            type="number"
            value={secondNumber || ''}
            onChange={(e) => handleNumberInput(e, setSecondNumber)}
            onKeyPress={handleKeyPress}
            className={`w-full px-4 py-2 border rounded-lg ${
              showError && !secondNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t.secondNumber}
          />
        </div>
      </div>

      {showError && (
        <div className="text-red-500 text-sm">
          {t.inputRequired}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={startCalculation}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {t.calculate}
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep < 0 || isComplete}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.recursiveStep}
        </button>
        <button
          onClick={reset}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {t.reset}
        </button>
      </div>

      {steps.length > 0 && currentStep >= 0 && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-bold mb-4">{t.currentValues}</h2>
            <div className="space-y-2 font-mono">
              <p>{t.aValue}{formatNumber(steps[currentStep].a)}</p>
              <p>{t.bValue}{formatNumber(steps[currentStep].b)}</p>
              {steps[currentStep].quotient !== undefined && (
                <div className="pl-4 space-y-1 text-gray-600">
                  <p>{formatNumber(steps[currentStep].a)} ÷ {formatNumber(steps[currentStep].b)} = {steps[currentStep].quotient} {lang === 'en' ? 'remainder' : '余'} {steps[currentStep].remainder}</p>
                  {steps[currentStep].calculation?.multiplication && (
                    <p>{steps[currentStep].calculation.multiplication}</p>
                  )}
                  {steps[currentStep].calculation?.subtraction && (
                    <p>{steps[currentStep].calculation.subtraction}</p>
                  )}
                </div>
              )}
              {steps[currentStep].remainder !== null && (
                <p className={steps[currentStep].remainder === 0 ? "text-green-600 font-bold" : ""}>
                  {t.remainderValue}{formatNumber(steps[currentStep].remainder)}
                </p>
              )}
              {steps[currentStep].isSwap && (
                <p className="text-blue-600">↺ {lang === 'en' ? 'Swap a and b' : '交换 a 和 b'}</p>
              )}
            </div>
          </div>

          {isComplete && (
            <div className="bg-green-100 p-6 rounded-lg">
              <p className="text-lg font-semibold text-green-800">
                {t.gcmResult}{formatNumber(steps[currentStep].remainder === 0 ? steps[currentStep].b : steps[currentStep].a)}
              </p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Step
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    a
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    b
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {steps.map((step, index) => (
                  <tr 
                    key={index}
                    className={index === currentStep ? 'bg-blue-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">{formatNumber(step.a)}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">{formatNumber(step.b)}</td>
                    <td className="px-6 py-4">
                      {step.quotient !== undefined ? (
                        <div className="space-y-1">
                          <div>{formatNumber(step.a)} ÷ {formatNumber(step.b)} = {step.quotient} {lang === 'en' ? 'remainder' : '余'} {step.remainder}</div>
                          {step.calculation?.multiplication && (
                            <div className="text-gray-600">{step.calculation.multiplication}</div>
                          )}
                          {step.calculation?.subtraction && (
                            <div className="text-gray-600">{step.calculation.subtraction}</div>
                          )}
                        </div>
                      ) : step.isSwap ? (
                        lang === 'en' ? 'swap' : '交换'
                      ) : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Links lang={lang} />
    </div>
  );
}