import React, { useState } from 'react';
import { Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';

export function Fibonacci() {
  const [number, setNumber] = useState<string>('');
  const [result, setResult] = useState<{ fib: number; additions: number } | null>(null);
  const [showError, setShowError] = useState(false);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  let additionCount = 0;

  const fib0 = (n: number): number => {
    if (n === 0) return 0;
    if (n === 1) return 1;
    additionCount++;
    return fib0(n - 1) + fib0(n - 2);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value === '') {
      setNumber('');
      setResult(null);
      setShowError(false);
    } else {
      const num = parseInt(value);
      if (num <= 40) {
        setNumber(value);
        setShowError(false);
      } else {
        setNumber('40');
        setShowError(true);
      }
    }
  };

  const calculate = () => {
    if (!number) return;
    
    const n = parseInt(number);
    if (n > 40) {
      setShowError(true);
      return;
    }

    additionCount = 0;
    const fibResult = fib0(n);
    setResult({ fib: fibResult, additions: additionCount });
    setShowError(false);
  };

  const reset = () => {
    setNumber('');
    setResult(null);
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
          <h1 className="text-3xl font-bold">{t.fibonacciTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.fibonacciDescription}</p>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">{t.fibonacciCode}</h2>
        <pre className="bg-white p-4 rounded-lg overflow-x-auto">
{`int fib0(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fib0(n - 1) + fib0(n - 2);
}`}
        </pre>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold mb-2">{t.timeComplexityTitle}</h3>
        <p className="text-gray-700">{t.fibonacciTimeComplexity}</p>
        <p className="text-gray-700 mt-2">{t.fibonacciExplanation}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.fibonacciInput}
          </label>
          <input
            type="number"
            min="0"
            max="40"
            value={number}
            onChange={handleNumberInput}
            onKeyPress={handleKeyPress}
            className={`w-full px-4 py-2 border rounded-lg ${
              showError ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {showError && (
            <p className="text-red-500 text-sm">
              {t.inputTooLarge}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={calculate}
            disabled={!number}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-blue-100 p-6 rounded-lg">
            <div className="space-y-2">
              <p className="text-lg">
                <span className="font-semibold">
                  {t.fibonacciResult.replace('{n}', number)}
                </span>
                <br />
                <span className="font-mono">{result.fib}</span>
              </p>
              <p className="text-lg">
                <span className="font-semibold">{t.additionCount}</span>
                <br />
                <span className="font-mono">{result.additions}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <Links lang={lang} />
    </div>
  );
}