import { useState } from 'react';
import { Calculator as CalculatorIcon, Languages, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { calculateEgyptianMultiplication } from '../utils/egyptianMultiplication';
import { CalculationDisplay } from './CalculationDisplay';
import { Links } from './Links';
import { DeveloperNote } from './DeveloperNote';
import { useLanguage } from '../context/LanguageContext';
import { ExplanationPanel } from './common/ExplanationPanel';
import { ValidationMessage } from './common/ValidationMessage';

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
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);
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
    setValidationErrorKey(null);
  };

  const calculate = () => {
    if (!firstNumber || !secondNumber) {
      setValidationErrorKey('inputRequired');
      return;
    }

    const { steps: newSteps, result: finalResult } = calculateEgyptianMultiplication(firstNumber, secondNumber);
    setSteps(newSteps);
    setResult(finalResult);
    setShowResults(true);
    setValidationErrorKey(null);
  };

  const reset = () => {
    setFirstNumber(0);
    setSecondNumber(0);
    setSteps([]);
    setResult(null);
    setShowResults(false);
    setValidationErrorKey(null);
  };

  return (
    <div className="safe-app-x safe-app-bottom max-w-2xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            to="/"
            className="touch-target flex items-center justify-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="flex min-w-0 items-center gap-3 break-words text-2xl font-bold sm:text-3xl">
            <CalculatorIcon className="w-8 h-8" />
            {t.title}
          </h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="touch-target flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
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
            aria-label={t.firstNumber}
            value={firstNumber || ''}
            onChange={(e) => handleNumberInput(e, setFirstNumber)}
            onKeyPress={handleKeyPress}
            className={`touch-target w-full rounded-lg border px-4 py-2 ${validationErrorKey && !firstNumber ? 'border-red-500' : 'border-gray-300'}`}
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
            aria-label={t.secondNumber}
            value={secondNumber || ''}
            onChange={(e) => handleNumberInput(e, setSecondNumber)}
            onKeyPress={handleKeyPress}
            className={`touch-target w-full rounded-lg border px-4 py-2 ${validationErrorKey && !secondNumber ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={t.secondNumber}
            max={MAX_NUMBER}
            min={-MAX_NUMBER}
          />
        </div>
      </div>

      <ValidationMessage errorKey={validationErrorKey} messages={t} />

      <div className="flex flex-wrap gap-3 sm:gap-4">
        <button
          onClick={calculate}
          className="touch-target px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {t.calculate}
        </button>
        <button
          onClick={reset}
          className="touch-target px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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

      {/* Explanation Panel with Egyptian Multiplication Invariants */}
      <ExplanationPanel
        stepDescription={
          showResults && steps.length > 0
            ? lang === 'en'
              ? `Halving ${Math.abs(secondNumber)} and doubling ${Math.abs(firstNumber)} through ${steps.length} steps`
              : `将 ${Math.abs(secondNumber)} 减半，将 ${Math.abs(firstNumber)} 加倍，共 ${steps.length} 步`
            : lang === 'en'
              ? 'Enter two numbers and click Calculate to perform Egyptian Multiplication.'
              : '输入两个数字，点击计算开始埃及乘法。'
        }
        invariant={
          lang === 'en'
            ? 'a × b = sum of selected powers of 2 × a  —  Each halving step preserves the product.'
            : 'a × b = 选中的 2 的幂次 × a 的和  —  每次减半步骤都保持乘积不变。'
        }
        complexity={{
          time: 'O(log b)',
          space: 'O(log b)',
          worstCase: lang === 'en' ? 'When b is a power of 2' : '当 b 是 2 的幂次时',
        }}
        operationType={
          showResults
            ? lang === 'en'
              ? 'halving/doubling'
              : '减半/加倍'
            : undefined
        }
      />

      <DeveloperNote noteKey="devNoteEqMult" />
      <Links lang={lang} />
    </div>
  );
}
