import React, { useState } from 'react';
import { Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';

interface OperationCounts {
  additions: number;
  subtractions: number;
  multiplications: number;
}

// Matrix multiplication for 2x2 matrices using BigInt
const multiplyMatrix = (a: bigint[][], b: bigint[][], counts: OperationCounts): bigint[][] => {
  return [
    [
      (() => {
        counts.multiplications += 2;
        counts.additions += 1;
        return a[0][0] * b[0][0] + a[0][1] * b[1][0];
      })(),
      (() => {
        counts.multiplications += 2;
        counts.additions += 1;
        return a[0][0] * b[0][1] + a[0][1] * b[1][1];
      })()
    ],
    [
      (() => {
        counts.multiplications += 2;
        counts.additions += 1;
        return a[1][0] * b[0][0] + a[1][1] * b[1][0];
      })(),
      (() => {
        counts.multiplications += 2;
        counts.additions += 1;
        return a[1][0] * b[0][1] + a[1][1] * b[1][1];
      })()
    ]
  ];
};

// Matrix power with BigInt
const matrixPower = (matrix: bigint[][], n: number, counts: OperationCounts): bigint[][] => {
  if (n === 0) {
    return [[1n, 0n], [0n, 1n]]; // Identity matrix
  }
  if (n === 1) {
    return matrix;
  }

  const half = Math.floor(n / 2);
  const halfPower = matrixPower(matrix, half, counts);
  const result = multiplyMatrix(halfPower, halfPower, counts);

  if (n % 2 === 1) {
    counts.subtractions += 1; // For the modulo operation
    return multiplyMatrix(result, matrix, counts);
  }
  counts.subtractions += 1; // For the modulo operation
  return result;
};

// Calculate nth Fibonacci number using matrix exponentiation with BigInt
const calculateFibonacci = (n: number, counts: OperationCounts): bigint => {
  if (n === 0) return 0n;
  if (n === 1) return 1n;

  const baseMatrix: bigint[][] = [[1n, 1n], [1n, 0n]];
  counts.subtractions += 1; // For n - 1
  const resultMatrix = matrixPower(baseMatrix, n - 1, counts);
  return resultMatrix[0][0];
};

// Format large numbers with line breaks every 80 characters
const formatLargeNumber = (num: bigint): string => {
  const str = num.toString();
  if (str.length <= 80) return str;

  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += 80) {
    chunks.push(str.slice(i, i + 80));
  }
  return chunks.join('\n');
};

export function FastFibonacci() {
  const [number, setNumber] = useState<string>('');
  const [result, setResult] = useState<{
    value: bigint;
    n: string;
    operations: OperationCounts;
  } | null>(null);
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
      if (num <= 5000) {
        setNumber(value);
      } else {
        setNumber('5000');
      }
    }
  };

  const calculate = () => {
    if (!number) return;
    
    const n = parseInt(number);
    if (n > 5000) {
      alert(t.fastFibonacciTooLarge);
      return;
    }

    const counts: OperationCounts = {
      additions: 0,
      subtractions: 0,
      multiplications: 0
    };

    const fibResult = calculateFibonacci(n, counts);
    setResult({ 
      value: fibResult, 
      n: number,
      operations: counts
    });
  };

  const reset = () => {
    setNumber('');
    setResult(null);
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
            max="5000"
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
        <div className="space-y-6">
          <div className="bg-blue-100 p-6 rounded-lg">
            <div className="text-lg">
              <span className="font-semibold">
                {lang === 'en' 
                  ? t.fastFibonacciResult.replace('nth', `${result.n}th`)
                  : t.fastFibonacciResult.replace('n', result.n)}
              </span>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-base overflow-x-auto">
                {formatLargeNumber(result.value)}
              </pre>
            </div>
          </div>

          <div className="bg-green-100 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">{t.fastFibonacciOperations}</h3>
            <div className="space-y-1">
              <p>{t.additions} {result.operations.additions}</p>
              <p>{t.subtractions} {result.operations.subtractions}</p>
              <p>{t.multiplications} {result.operations.multiplications}</p>
            </div>
          </div>
        </div>
      )}

      <Links lang={lang} />
    </div>
  );
}