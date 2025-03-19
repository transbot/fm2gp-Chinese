import React, { useState } from 'react';
import { Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';

interface NumberCell {
  value: number;
  isPrime: boolean;
  isMarked: boolean;
}

export function Sieve() {
  const [maxNumber, setMaxNumber] = useState<number>(0);
  const [numbers, setNumbers] = useState<NumberCell[]>([]);
  const [i, setI] = useState<number>(0);
  const [indexSquare, setIndexSquare] = useState<number>(3);
  const [factor, setFactor] = useState<number>(3);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      generateNumbers();
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value === '') {
      setMaxNumber(0);
      setShowError(false);
    } else {
      const num = Number(value);
      setMaxNumber(num > 9999 ? 9999 : num);
      setShowError(false);
    }
  };

  const generateNumbers = () => {
    if (!maxNumber || maxNumber < 2) {
      setShowError(true);
      return;
    }

    // Start with odd numbers only
    const nums: NumberCell[] = Array.from({ length: Math.floor((maxNumber - 1) / 2) }, (_, i) => ({
      value: 2 * i + 3,
      isPrime: true,
      isMarked: false
    }));
    
    setNumbers(nums);
    setI(0);
    setIndexSquare(3);
    setFactor(3);
    setIsComplete(false);
    setShowError(false);
  };

  const nextIteration = () => {
    if (!numbers.length) return;

    // Check if we're done
    if (indexSquare >= numbers.length) {
      setIsComplete(true);
      return;
    }

    const newNumbers = [...numbers];

    // If current number is prime, mark its multiples
    if (newNumbers[i].isPrime) {
      // Mark multiples starting from index_square
      for (let j = indexSquare; j < newNumbers.length; j += factor) {
        newNumbers[j].isPrime = false;
      }
      newNumbers[i].isMarked = true;
    }

    // Update state variables according to the algorithm
    setI(i + 1);
    setIndexSquare(indexSquare + factor);
    setFactor(factor + 2);
    setIndexSquare(prev => prev + factor + 2);

    setNumbers(newNumbers);
  };

  const reset = () => {
    setNumbers([]);
    setI(0);
    setIndexSquare(3);
    setFactor(3);
    setIsComplete(false);
    setShowError(false);
    setMaxNumber(0);
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
          <h1 className="text-3xl font-bold">{t.sieveTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.sieveDescription}</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.maxNumber} <span className="text-red-500">{t.required}</span>
          </label>
          <p className="text-sm text-gray-600">{t.sieveInputDescription}</p>
          <input
            type="number"
            min="2"
            max="9999"
            value={maxNumber || ''}
            onChange={handleNumberInput}
            onKeyPress={handleKeyPress}
            className={`w-full px-4 py-2 border rounded-lg ${
              showError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t.maxNumber}
          />
          {showError && (
            <p className="text-red-500 text-sm mt-1">
              {t.sieveInputRequired}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={generateNumbers}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            {t.generate}
          </button>
          <button
            onClick={nextIteration}
            disabled={!numbers.length || isComplete}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.iteration}
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            {t.reset}
          </button>
        </div>
      </div>

      {numbers.length > 0 && (
        <>
          <div className="grid grid-cols-10 gap-2">
            {numbers.map((num, index) => (
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
          {isComplete && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center font-medium">
              {t.allPrimesFound}
            </div>
          )}
        </>
      )}

      <Links lang={lang} />
    </div>
  );
}