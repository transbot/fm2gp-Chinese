import React from 'react';
import { BookOpen, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

export function Home() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const links = {
    en: {
      blog: "Zhou Jing's Blog",
      github: "GitHub"
    },
    zh: {
      blog: "周靖的博客",
      github: "GitHub"
    }
  };

  // Book Algorithms - organized by section order
  const bookAlgorithms = [
    { path: '/multiply', label: t.egyptianMultiplication },
    { path: '/sieve', label: t.sieveOfEratosthenes },
    { path: '/prime-counting', label: t.primeCounting },
    { path: '/palindromic-primes', label: t.palindromicPrimes },
    { path: '/gcm', label: t.euclideanGcm },
    { path: '/division', label: t.divisionTitle },
    { path: '/prime-checker', label: t.primeChecker },
    { path: '/fermat', label: t.fermatTitle },
    { path: '/euler', label: t.eulerTitle },
    { path: '/power', label: t.powerTitle },
    { path: '/fibonacci', label: t.fibonacci },
    { path: '/fast-fibonacci', label: t.fastFibonacci },
    { path: '/shortest-path', label: t.shortestPath },
    { path: '/pi-upper-bound', label: t.piUpperBound },
    { path: '/linear-search', label: t.linearSearchTitle },
    { path: '/binary-search', label: t.binarySearchTitle },
    { path: '/swap', label: t.swapTitle },
    { path: '/rotate', label: t.rotateAlgorithm },
    { path: '/cycle', label: t.cycleTitle },
    { path: '/reverse', label: t.reverseTitle },
    { path: '/gcd-comparison', label: t.gcdComparison },
    { path: '/stein-gcd', label: t.steinGcdTitle },
    { path: '/extended-gcd', label: t.extendedGcdAlgorithm },
    { path: '/miller-rabin', label: t.millerRabinTest },
    { path: '/rsa', label: t.rsaAlgorithm },
  ];

  // Advanced Algorithms - not in the book
  const advancedAlgorithms = [
    { path: '/quick-sort', label: t.quickSortTitle },
    { path: '/merge-sort', label: t.mergeSortTitle },
    { path: '/heap', label: t.heapTitle },
    { path: '/graph-traversal', label: t.graphTraversalTitle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="bg-blue-600 p-3 rounded-xl shadow-lg shrink-0">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center sm:text-left">
                  {lang === 'en' ? (
                    <>
                      <em>From Mathematics to Generic Programming</em>
                      <span className="block text-base sm:text-lg text-blue-600 font-semibold mt-1">
                        Interactive Algorithm Visualizations
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="block">《数学与泛型编程：高效编程的奥秘》</span>
                      <span className="block text-base sm:text-lg text-blue-600 font-semibold mt-1">
                        交互式算法演示
                      </span>
                    </>
                  )}
                </h1>
                <div className="flex gap-4 justify-center sm:justify-start mt-2">
                  <a
                    href="https://bookzhou.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {links[lang].blog}
                  </a>
                  <a
                    href="https://github.com/transbot/fm2gp-Chinese"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {links[lang].github}
                  </a>
                </div>
              </div>
            </div>
            <button
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm sm:text-base"
            >
              <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
              {t.language}
            </button>
          </div>
        </div>

        {/* Book Algorithms Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            {t.bookAlgorithms}
          </h2>
          <ul className="space-y-2 sm:space-y-3">
            {bookAlgorithms.map((algo, index) => (
              <li key={index}>
                <Link
                  to={algo.path}
                  className="block p-3 sm:p-4 rounded-xl hover:bg-blue-50 transition-colors text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                >
                  {algo.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Advanced Algorithms Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            {t.advancedAlgorithms}
          </h2>
          <ul className="space-y-2 sm:space-y-3">
            {advancedAlgorithms.map((algo, index) => (
              <li key={index}>
                <Link
                  to={algo.path}
                  className="block p-3 sm:p-4 rounded-xl hover:bg-blue-50 transition-colors text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                >
                  {algo.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quote Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 sm:p-8 text-white">
          <div className="space-y-4">
            {lang === 'zh' ? (
              <>
                <h2 className="text-lg sm:text-xl font-semibold">《数学与泛型编程：高效编程的奥秘》主旨</h2>
                <p className="italic text-blue-100 text-sm sm:text-base">
                  盖欲成优秀之程序员，必先明泛型编程之理；欲明泛型编程之理，必先悟抽象之义；而欲悟抽象之义，则需究其数学之本。
                </p>
              </>
            ) : (
              <>
                <p className="italic text-blue-100 text-sm sm:text-base">
                  To be a good programmer, you need to understand the principles of generic programming. To understand the principles of generic programming, you need to understand abstraction. To understand abstraction, you need to understand the mathematics on which it's based.
                </p>
                <p className="text-blue-100 text-sm sm:text-base">
                  That is the story <span className="italic">From Mathematics to Generic Programming</span> hopes to tell.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Book Cover */}
        <div className="flex justify-center px-4">
          <div className="relative group w-full sm:w-auto">
            <img
              src="/images/EnglishEditionCover.png"
              alt="From Mathematics to Generic Programming Book Cover"
              className="w-full sm:max-w-sm rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
}