import React, { useState } from 'react';
import { Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';

// Matrix multiplication for 2x2 matrices using BigInt
const multiplyMatrix = (a: bigint[][], b: bigint[][]): bigint[][] => {
  return [
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0],
      a[0][0] * b[0][1] + a[0][1] * b[1][1]
    ],
    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0],
      a[1][0] * b[0][1] + a[1][1] * b[1][1]
    ]
  ];
};

// Matrix power with BigInt
const matrixPower = (matrix: bigint[][], n: number): bigint[][] => {
  if (n === 0) {
    return [[1n, 0n], [0n, 1n]]; // Identity matrix
  }
  if (n === 1) {
    return matrix;
  }

  const half = Math.floor(n / 2);
  const halfPower = matrixPower(matrix, half);
  const result = multiplyMatrix(halfPower, halfPower);

  if (n % 2 === 1) {
    return multiplyMatrix(result, matrix);
  }
  return result;
};

// Calculate nth Fibonacci number using matrix exponentiation with BigInt
const calculateFibonacci = (n: number): bigint => {
  if (n === 0) return 0n;
  if (n === 1) return 1n;

  const baseMatrix: bigint[][] = [[1n, 1n], [1n, 0n]];
  const resultMatrix = matrixPower(baseMatrix, n - 1);
  return resultMatrix[0][0];
};

// Format large numbers with line breaks every 40 characters
const formatLargeNumber = (num: bigint): string => {
  const str = num.toString();
  if (str.length <= 40) return str;

  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += 40) {
    chunks.push(str.slice(i, i + 40));
  }
  return chunks.join('\n');
};

export function FastFibonacci() {
  const [number, setNumber] = useState<string>('');
  const [result, setResult] = useState<{ value: bigint; n: string } | null>(null);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value === '') {
      setNumber('');
    } else {
      const num = parseInt(value);
      if (num <= 1000) {
        setNumber(value);
      } else {
        setNumber('1000');
      }
    }
  };

  const calculate = () => {
    if (!number) return;
    
    const n = parseInt(number);
    if (n > 1000) {
      alert(t.fastFibonacciTooLarge);
      return;
    }

    const fibResult = calculateFibonacci(n);
    setResult({ value: fibResult, n: number });
  };

  const reset = () => {
    setNumber('');
    setResult(null);
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
          <h1 className="text-3xl font-bold">{t.fastFibonacciTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.fastFibonacciDescription}</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.fastFibonacciInput}
          </label>
          <input
            type="number"
            min="0"
            max="1000"
            value={number}
            onChange={handleNumberInput}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2 border rounded-lg"
          />
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

      {result !== null && (
        <div className="bg-blue-100 p-6 rounded-lg">
          <div className="text-lg">
            <span className="font-semibold">
              {lang === 'en' 
                ? t.fastFibonacciResult.replace('nth', `${result.n}th`)
                : t.fastFibonacciResult.replace('n', result.n)}
            </span>
            <pre className="mt-2 whitespace-pre-wrap font-mono text-base">
              {formatLargeNumber(result.value)}
            </pre>
          </div>
        </div>
      )}

      <Links lang={lang} />
    </div>
  );
}