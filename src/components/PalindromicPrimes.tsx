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
      setMaxNumber(0);
    } else {
      const num = Number(value);
      setMaxNumber(num > 9999 ? 9999 : num);
    }
  };

  const handleBaseInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value === '') {
      setInputBase('');
    } else {
      const num = Number(value);
      if (num < 2) setInputBase('2');
      else if (num > 36) setInputBase('36');
      else setInputBase(value);
    }
  };

  const generateNumbers = () => {
    if (!maxNumber || maxNumber < 2) return;

    // Parse and validate base before generating numbers
    const base = Number(inputBase) || 10;
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
      // Remove leading zeros and group binary digits in sets of 4 for readability
      const digits = num.display.replace(/^0+/, ''); // Remove leading zeros
      const remainder = digits.length % 4;
      const padding = remainder ? '0'.repeat(4 - remainder) : '';
      const paddedForGrouping = padding + digits;
      return (paddedForGrouping.match(/.{1,4}/g)?.join(' ') || digits).replace(/^0+(?=\d)/, '');
    }
    return num.display.toUpperCase();
  };

  const reset = () => {
    setNumbers([]);
    setMaxNumber(0);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.maxNumber}
            </label>
            <input
              type="number"
              min="2"
              max="9999"
              value={maxNumber || ''}
              onChange={handleNumberInput}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t.base}
            </label>
            <input
              type="number"
              min="2"
              max="36" 
              placeholder="2-36"
              value={inputBase}
              onChange={handleBaseInput}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              {lang === 'en' ? '(2-36)' : '(2-36进制)'}
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