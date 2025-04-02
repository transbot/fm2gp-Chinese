import React, { useState } from 'react';
import { Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';

export function PalindromicPrimes() {
  const [maxNumber, setMaxNumber] = useState<number>(0);
  const [inputBase, setInputBase] = useState<string>('10');
  const [currentBase, setCurrentBase] = useState<number>(10);
  const [baseError, setBaseError] = useState<string>('');
  const [maxNumberError, setMaxNumberError] = useState<string>('');
  const [numbers, setNumbers] = useState<{value: number, display: string, isPalindromicPrime: boolean}[]>([]);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const isPalindrome = (str: string): boolean => {
    for (let i = 0; i < str.length / 2; i++) {
      if (str[i] !== str[str.length - 1 - i]) return false;
    }
    return true;
  };

  const isPrime = (n: number): boolean => {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    for (let i = 3; i * i <= n; i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && maxNumber > 0) {
      generateNumbers();
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value === '') {
      setMaxNumberError('');
      setMaxNumber(0);
    } else {
      const num = Number(value);
      setMaxNumberError('');
      setMaxNumber(num > 9999 ? 9999 : num);
    }
  };

  const handleBaseInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value === '') {
      setBaseError('');
      setInputBase('');
      return;
    }
    
    const num = Number(value);
    if (num >= 2 && num <= 36) {
      setBaseError('');
      setInputBase(value);
    } else if (num > 36) {
      setBaseError('');
      setInputBase('36');
    } else if (value === '1') {
      // Allow typing "1" without immediately changing to "2"
      setInputBase('1');
    } else if (num < 2) {
      setBaseError('');
      setInputBase('2');
    }
  };

  const validateBaseBeforeGenerate = () => {
    if (!inputBase) {
      setInputBase('10');
      return 10;
    }
    
    const num = Number(inputBase);
    if (num === 1) {
      setBaseError(t.baseError);
      return 0;
    } else if (num < 2) {
      setInputBase('2');
      return 2;
    } else if (num > 36) {
      setInputBase('36');
      return 36;
    }
    return num;
  };

  const validateMaxNumberBeforeGenerate = () => {
    if (!maxNumber || maxNumber < 2) {
      setMaxNumberError(t.maxNumberError);
      return false;
    }
    return true;
  };

  const generateNumbers = () => {
    setBaseError('');
    setMaxNumberError('');

    if (!validateMaxNumberBeforeGenerate()) return;

    const base = validateBaseBeforeGenerate();
    if (base === 0) return; // Invalid base, error is already set
    
    setCurrentBase(base);

    const primes = [];
    for (let i = 2; i <= maxNumber; i++) {
      if (isPrime(i)) {
        const display = i.toString(base);
        primes.push({
          value: i,
          display,
          isPalindromicPrime: isPalindrome(display)
        });
      }
    }
    setNumbers(primes);
  };

  const getGridCols = (): string => {
    if (currentBase === 2) return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5';
    if (currentBase <= 8) return 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8';
    return 'grid-cols-5 sm:grid-cols-8 md:grid-cols-10';
  };

  const getDisplayValue = (num: {display: string, value: number}): string => {
    if (currentBase === 2) {
      return num.display.replace(/^0+/, '');
    }
    return num.display.toUpperCase();
  };

  const reset = () => {
    setNumbers([]);
    setMaxNumber(0);
    setBaseError('');
    setMaxNumberError('');
    setInputBase('10');
    setCurrentBase(10);
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
          <h1 className="text-3xl font-bold">{t.palindromicPrimesTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.palindromicPrimesDescription}</p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.maxNumber} <span className="text-red-500">{t.required}</span>
            </label>
            <input
              type="number"
              min="2"
              max="9999"
              value={maxNumber || ''}
              onChange={handleNumberInput}
              onKeyPress={handleKeyPress}
              className={`w-full px-4 py-2 border rounded-lg ${
                maxNumberError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t.maxNumber}
            />
            <p className="mt-1 text-sm text-gray-500">
              {maxNumberError ? (
                <span className="text-red-500">{maxNumberError}</span>
              ) : (
                lang === 'en' ? '(2-9999)' : '(2-9999)'
              )}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.base} <span className="text-red-500">{t.required}</span>
            </label>
            <input
              type="number"
              min="2"
              max="36" 
              placeholder="2-36"
              value={inputBase}
              onChange={handleBaseInput}
              className={`w-full px-4 py-2 border rounded-lg ${
                baseError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="mt-1 text-sm text-gray-500">
              {baseError ? (
                <span className="text-red-500">{baseError}</span>
              ) : (
                lang === 'en' ? '(2-36)' : '(2-36进制)'
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={generateNumbers}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            {t.generate}
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
        <div className={`grid ${getGridCols()} gap-2`}>
          {numbers.map((num, index) => (
            <div
              key={index}
              className={`p-2 text-center rounded font-mono text-sm break-all ${
                num.isPalindromicPrime ? 'bg-green-100' : ''
              }`}
            >
              {getDisplayValue(num)}
            </div>
          ))}
        </div>
      )}

      <Links lang={lang} />
    </div>
  );
}