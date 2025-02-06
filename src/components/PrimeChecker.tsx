import React, { useState } from 'react';
import { Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';

interface Factor {
  prime: number;
  power: number;
}

const MAX_BIGINT = 9223372036854775807n;

export function PrimeChecker() {
  const [number, setNumber] = useState<string>('');
  const [result, setResult] = useState<{
    isPrime: boolean;
    isMersenne?: boolean;
    mersenneExponent?: number;
    factors?: Factor[];
    number: string;
  } | null>(null);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && number) {
      checkNumber();
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value === '') {
      setNumber('');
    } else {
      try {
        let num = BigInt(value);
        if (num > MAX_BIGINT) {
          num = MAX_BIGINT;
          setNumber(num.toString());
        } else {
          setNumber(value);
        }
      } catch (error) {
        // If BigInt conversion fails, set to max value
        setNumber(MAX_BIGINT.toString());
      }
    }
  };

  const findSmallestDivisor = (n: bigint): bigint => {
    if (n % 2n === 0n) return 2n;
    
    let i = 3n;
    while (i * i <= n) {
      if (n % i === 0n) return i;
      i += 2n;
    }
    return n;
  };

  const factorize = (n: bigint): Factor[] => {
    const factors: Factor[] = [];
    let currentNumber = n;

    while (currentNumber > 1n) {
      const divisor = findSmallestDivisor(currentNumber);
      let power = 0;
      
      while (currentNumber % divisor === 0n) {
        power++;
        currentNumber = currentNumber / divisor;
      }
      
      factors.push({
        prime: Number(divisor),
        power
      });
    }

    return factors;
  };

  const isPowerOfTwo = (n: bigint): boolean => {
    return n > 0n && (n & (n - 1n)) === 0n;
  };

  const isMersennePrime = (n: bigint): { isMersenne: boolean; exponent?: number } => {
    // Check if n is of form 2^p - 1
    const nPlusOne = n + 1n;
    if (!isPowerOfTwo(nPlusOne)) return { isMersenne: false };
    
    // Calculate p (the exponent)
    let p = 0;
    let temp = nPlusOne;
    while (temp > 1n) {
      temp = temp >> 1n;
      p++;
    }
    
    // Check if p is prime using our existing function
    const pBigInt = BigInt(p);
    const smallestDivisor = findSmallestDivisor(pBigInt);
    if (smallestDivisor !== pBigInt) return { isMersenne: false };
    
    return { isMersenne: true, exponent: p };
  };

  const checkNumber = () => {
    if (!number) return;
    
    const num = BigInt(number);
    if (num < 2n) {
      setResult({ isPrime: false, number });
      return;
    }

    const smallestDivisor = findSmallestDivisor(num);
    const isPrime = smallestDivisor === num;
    
    let mersenneCheck = undefined;
    if (isPrime) {
      mersenneCheck = isMersennePrime(num);
    }
    
    setResult({
      isPrime,
      isMersenne: mersenneCheck?.isMersenne,
      mersenneExponent: mersenneCheck?.exponent,
      factors: isPrime || num === 1n ? undefined : factorize(num),
      number
    });
  };

  const formatFactorization = (factors: Factor[]): string => {
    return factors.map(({ prime, power }) => 
      power === 1 ? prime.toString() : `${prime}^${power}`
    ).join(' × ');
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
          <h1 className="text-3xl font-bold">{t.primeCheckerTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.primeCheckerDescription}</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t.enterNumber}
          </label>
          <input
            type="text"
            value={number}
            onChange={handleNumberInput}
            onKeyPress={handleKeyPress}
            placeholder={t.numberPlaceholder}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={checkNumber}
            disabled={!number}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.check}
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            {t.reset}
          </button>
        </div>

        <div className="text-center">
          <a 
            href="https://www.mersenne.org/primes/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            {t.mersenneLink}
          </a>
        </div>
      </div>

      {result && result.number === number && (
        <div className={`p-6 rounded-lg ${result.isPrime ? 'bg-green-100' : 'bg-blue-100'}`}>
          <p className="text-lg font-semibold mb-2">
            {number} {result.isMersenne 
              ? t.isMersennePrime.replace('{0}', result.mersenneExponent?.toString() || '')
              : result.isPrime 
                ? t.isPrime 
                : t.isNotPrime}
          </p>
          {!result.isPrime && result.factors && (
            <p className="font-mono">
              {number} = {formatFactorization(result.factors)}
            </p>
          )}
        </div>
      )}

      <Links lang={lang} />
    </div>
  );
}