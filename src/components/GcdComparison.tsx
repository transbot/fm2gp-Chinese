import React, { useState } from 'react';
import { Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';

interface TestResult {
  range: string;
  steinTime: number;
  euclideanTime: number;
  progress?: number;
}

export function GcdComparison() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  // Binary GCD (Stein's algorithm)
  const steinGcd = (m: number, n: number): number => {
    if (m === 0) return n;
    if (n === 0) return m;

    let dm = 0;
    let dn = 0;
    
    while ((m & 1) === 0) {
      m >>= 1;
      dm++;
    }
    
    while ((n & 1) === 0) {
      n >>= 1;
      dn++;
    }

    while (m !== n) {
      if (n > m) {
        [m, n] = [n, m];
      }
      m -= n;
      while ((m & 1) === 0) {
        m >>= 1;
      }
    }

    return m << Math.min(dm, dn);
  };

  const euclideanGcd = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const generateRandomNumber = (max: number): number => {
    return Math.floor(Math.random() * max);
  };

  const CHUNK_SIZE = 1000; // Process 1000 pairs at a time
  const TOTAL_PAIRS = 90000; // Total number of pairs to test

  const runTestChunk = (
    maxValue: number,
    start: number,
    end: number,
    algorithm: (a: number, b: number) => number
  ): number => {
    const pairs = [];
    // Generate all pairs first to ensure fair comparison
    for (let i = start; i < end; i++) {
      pairs.push({
        a: generateRandomNumber(maxValue),
        b: generateRandomNumber(maxValue)
      });
    }

    const startTime = performance.now();
    for (const { a, b } of pairs) {
      algorithm(a, b);
    }
    return performance.now() - startTime;
  };

  const runTest = async (maxValue: number, onProgress: (progress: number) => void): Promise<{ steinTime: number; euclideanTime: number }> => {
    let steinTotalTime = 0;
    let euclideanTotalTime = 0;

    // Process in chunks
    for (let i = 0; i < TOTAL_PAIRS; i += CHUNK_SIZE) {
      const end = Math.min(i + CHUNK_SIZE, TOTAL_PAIRS);
      
      // Run Stein's algorithm chunk
      steinTotalTime += runTestChunk(maxValue, i, end, steinGcd);
      
      // Run Euclidean algorithm chunk
      euclideanTotalTime += runTestChunk(maxValue, i, end, euclideanGcd);

      // Update progress
      onProgress((i + CHUNK_SIZE) / TOTAL_PAIRS * 100);

      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    return {
      steinTime: steinTotalTime,
      euclideanTime: euclideanTotalTime
    };
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);

    const ranges = [
      { max: 2 ** 16, label: '[0, 2¹⁶)' },
      { max: 2 ** 24, label: '[0, 2²⁴)' }, // Using 2^24 instead of 2^32 to avoid overflow
      { max: 2 ** 30, label: '[0, 2³⁰)' }  // Using 2^30 instead of 2^64 to avoid overflow
    ];

    for (const { max, label } of ranges) {
      // Add initial result with 0% progress
      setResults(prev => [...prev, { range: label, steinTime: 0, euclideanTime: 0, progress: 0 }]);

      try {
        const result = await runTest(max, (progress) => {
          setResults(prev => prev.map(r => 
            r.range === label ? { ...r, progress } : r
          ));
        });

        // Update final result without progress indicator
        setResults(prev => prev.map(r => 
          r.range === label 
            ? { range: label, steinTime: result.steinTime, euclideanTime: result.euclideanTime }
            : r
        ));

        // Small delay between ranges
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error testing range ${label}:`, error);
      }
    }

    setIsRunning(false);
  };

  const reset = () => {
    setResults([]);
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
          <h1 className="text-3xl font-bold">{t.gcdComparisonTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.gcdComparisonDescription}</p>

      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.calculate}
          </button>
          <button
            onClick={reset}
            disabled={isRunning}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.reset}
          </button>
        </div>

        {isRunning && (
          <div className="p-4 bg-blue-100 rounded-lg">
            <p className="text-blue-800">{t.running}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">{t.results}</h2>
            <p className="text-sm text-gray-600">{t.testSize}</p>
            <div className="grid gap-4">
              {results.map((result, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">{t.range}: {result.range}</h3>
                  {result.progress !== undefined ? (
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${result.progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {Math.round(result.progress)}% {t.complete}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-800">{t.steinAlgorithm}</p>
                        <p className="text-lg">
                          {t.totalTime}: {result.steinTime.toFixed(0)} {t.milliseconds}
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-800">{t.euclideanAlgorithm}</p>
                        <p className="text-lg">
                          {t.totalTime}: {result.euclideanTime.toFixed(0)} {t.milliseconds}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Links lang={lang} />
    </div>
  );
}