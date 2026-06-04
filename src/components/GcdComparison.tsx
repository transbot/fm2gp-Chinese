import { useState } from 'react';
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

  const CHUNK_SIZE = 1000;
  const TOTAL_PAIRS = 90000;

  const runTestChunk = (
    maxValue: number,
    start: number,
    end: number,
    algorithm: (a: number, b: number) => number
  ): number => {
    const pairs = [];
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

    for (let i = 0; i < TOTAL_PAIRS; i += CHUNK_SIZE) {
      const end = Math.min(i + CHUNK_SIZE, TOTAL_PAIRS);
      
      steinTotalTime += runTestChunk(maxValue, i, end, steinGcd);
      euclideanTotalTime += runTestChunk(maxValue, i, end, euclideanGcd);

      onProgress((i + CHUNK_SIZE) / TOTAL_PAIRS * 100);

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
      { max: 2 ** 24, label: '[0, 2²⁴)' },
      { max: 2 ** 30, label: '[0, 2³⁰)' }
    ];

    for (const { max, label } of ranges) {
      setResults(prev => [...prev, { range: label, steinTime: 0, euclideanTime: 0, progress: 0 }]);

      try {
        const result = await runTest(max, (progress) => {
          setResults(prev => prev.map(r => 
            r.range === label ? { ...r, progress } : r
          ));
        });

        setResults(prev => prev.map(r => 
          r.range === label 
            ? { range: label, steinTime: result.steinTime, euclideanTime: result.euclideanTime }
            : r
        ));

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
    <div className="safe-app-x safe-app-bottom max-w-4xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            to="/"
            className="touch-target flex items-center justify-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="min-w-0 break-words text-2xl font-bold sm:text-3xl">
            {t.gcdComparisonTitle}
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

      <div className="bg-gray-100 p-6 rounded-lg">
        <p className="text-lg font-mono">{t.gcdExerciseText}</p>
      </div>

      <p className="text-gray-600">{t.gcdComparisonDescription}</p>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="touch-target px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.calculate}
          </button>
          <button
            onClick={reset}
            disabled={isRunning}
            className="touch-target px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
