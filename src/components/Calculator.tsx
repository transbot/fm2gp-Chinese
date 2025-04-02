import React, { useState } from 'react';
import { Calculator as CalculatorIcon, Languages, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { calculateEgyptianMultiplication } from '../utils/egyptianMultiplication';
import { CalculationDisplay } from './CalculationDisplay';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';

interface Step {
  powerOfTwo: number;
  value: number;
  isSelected: boolean;
}

const MAX_NUMBER = 999999; // Limit to prevent scientific notation

export function Calculator() {
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showError, setShowError] = useState(false);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: number) => void) => {
    const value = e.target.value.replace(/[^\d-]/g, '');
    if (value === '' || value === '-') {
      setter(0);
    } else {
      const num = Number(value);
      if (Math.abs(num) > MAX_NUMBER) {
        setter(num < 0 ? -MAX_NUMBER : MAX_NUMBER);
      } else {
        setter(num);
      }
    }
    setShowError(false);
  };

  const calculate = () => {
    if (!firstNumber || !secondNumber) {
      setShowError(true);
      return;
    }

    const { steps: newSteps, result: finalResult } = calculateEgyptianMultiplication(firstNumber, secondNumber);
    setSteps(newSteps);
    setResult(finalResult);
    setShowResults(true);
    setShowError(false);
  };

  const reset = () => {
    setFirstNumber(0);
    setSecondNumber(0);
    setSteps([]);
    setResult(null);
    setShowResults(false);
    setShowError(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CalculatorIcon className="w-8 h-8" />
            {t.title}
          </h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.description}</p>

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
            className={`w-full px-4 py-2 border rounded-lg ${showError && !firstNumber ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={t.firstNumber}
            max={MAX_NUMBER}
            min={-MAX_NUMBER}
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
            className={`w-full px-4 py-2 border rounded-lg ${showError && !secondNumber ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={t.secondNumber}
            max={MAX_NUMBER}
            min={-MAX_NUMBER}
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
          onClick={calculate}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {t.calculate}
        </button>
        <button
          onClick={reset}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {t.reset}
        </button>
      </div>

      {showResults && (
        <CalculationDisplay
          steps={steps}
          result={result}
          firstNumber={firstNumber}
          secondNumber={secondNumber}
          lang={lang}
        />
      )}
      <Links lang={lang} />
    </div>
  );
}