import { useCallback, useState, useEffect } from 'react';
import { Home, Languages, Play, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';
import { DeveloperNote } from './DeveloperNote';
import { lowerBoundGenerator, upperBoundGenerator, quickSortGenerator } from '../lib/algorithms/binary_search';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ValidationMessage } from './common/ValidationMessage';

export function BinarySearch() {
  const [arraySize, setArraySize] = useState<number>(40);
  const [array, setArray] = useState<number[]>([]);
  const [targetVal, setTargetVal] = useState<string>('50');
  const [isSorted, setIsSorted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);
  
  // Visual states corresponding to iterators
  const [activeRange, setActiveRange] = useState<[number, number] | null>(null);
  const [midIdx, setMidIdx] = useState<number | null>(null);
  const [lowerBound, setLowerBound] = useState<number | null>(null);
  const [upperBound, setUpperBound] = useState<number | null>(null);
  
  const [searchPhase, setSearchPhase] = useState<'idle' | 'finding_lower' | 'finding_upper' | 'done'>('idle');

  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const resetSearchState = useCallback(() => {
    setActiveRange(null);
    setMidIdx(null);
    setLowerBound(null);
    setUpperBound(null);
    setSearchPhase('idle');
    setIsPlaying(false);
  }, []);

  // Generate a new random array
  const generateArray = useCallback(() => {
    const newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 99) + 1);
    setArray(newArr);
    setIsSorted(false);
    setValidationErrorKey(null);
    resetSearchState();
  }, [arraySize, resetSearchState]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const handleSort = async () => {
    if (isSorted) return;
    setValidationErrorKey(null);
    setIsPlaying(true);
    const arrCopy = [...array];
    const gen = quickSortGenerator(arrCopy);
    
    // Animate sort quickly
    for (const step of gen) {
      setArray([...step.array]);
      await new Promise(r => setTimeout(r, 10)); // 10ms per frame for quicksort
    }
    
    // One final sort to ensure strictly sorted state matching JS sort in case of quicksort bugs
    // (quicksort generator was more for visual flair, we ensure native sorted state)
    const sorted = [...array].sort((a, b) => a - b);
    setArray(sorted);
    setIsSorted(true);
    setIsPlaying(false);
  };

  const handleSearch = async () => {
    if (isPlaying) return;
    if (!isSorted) {
      setValidationErrorKey('binarySearchSortFirst');
      return;
    }
    if (!targetVal.trim()) {
      setValidationErrorKey('binarySearchTargetRequired');
      return;
    }
    setValidationErrorKey(null);
    resetSearchState();
    setIsPlaying(true);
    
    const target = parseInt(targetVal) || 50;
    
    // 1. Find lower_bound (b_l)
    setSearchPhase('finding_lower');
    const lowerGen = lowerBoundGenerator(array, target);
    let l_result = 0;
    
    for (const step of lowerGen) {
      setActiveRange([step.left, step.right]);
      setMidIdx(step.mid ?? null);
      await new Promise(r => setTimeout(r, 600)); // 600ms per step to show half-reduction
    }
    
    // lower_bound found at step.left
    const finalLowerStep = lowerBoundGenerator(array, target);
    while (true) {
      const res = finalLowerStep.next();
      if (res.done) {
        l_result = res.value;
        break;
      }
    }
    setLowerBound(l_result);
    setMidIdx(null);
    await new Promise(r => setTimeout(r, 800));

    // 2. Find upper_bound (b_u)
    setSearchPhase('finding_upper');
    const upperGen = upperBoundGenerator(array, target);
    let u_result = 0;
    
    for (const step of upperGen) {
      setActiveRange([step.left, step.right]);
      setMidIdx(step.mid ?? null);
      await new Promise(r => setTimeout(r, 600));
    }
    
    const finalUpperStep = upperBoundGenerator(array, target);
    while (true) {
      const res = finalUpperStep.next();
      if (res.done) {
        u_result = res.value;
        break;
      }
    }
    
    setUpperBound(u_result);
    setMidIdx(null);
    setActiveRange(null);
    setSearchPhase('done');
    setIsPlaying(false);
  };

  // Helper to determine bar color based on phase and bounds
  const getBarColor = (index: number) => {
    if (!isSorted) return "bg-gray-300";
    
    if (searchPhase === 'done') {
      // Color-coding based on Lemma 10.1
      if (lowerBound !== null && upperBound !== null) {
        if (index < lowerBound) return "bg-red-400"; // < a
        if (index >= lowerBound && index < upperBound) return "bg-green-500"; // == a
        if (index >= upperBound) return "bg-blue-400"; // > a
      }
    }
    
    if (activeRange) {
      const [left, right] = activeRange;
      if (index === midIdx) return "bg-yellow-400 scale-110";
      if (index >= left && index < right) return "bg-indigo-400"; // Active window
      return "bg-gray-200 opacity-30"; // Out of bounds
    }
    
    return "bg-indigo-200";
  };

  return (
    <div className="safe-app-x safe-app-bottom max-w-6xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            to="/"
            className="touch-target flex items-center justify-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="min-w-0 max-w-[18rem] break-words bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent sm:max-w-none sm:text-3xl">
            {t.binarySearchTitle || 'Binary Search'}
          </h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="touch-target flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md transition-colors hover:bg-blue-600"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600 text-lg">
        {t.binarySearchDescription || 'Section 10.8 - Visualizing the Binary Search algorithm and proving the Binary Search Lemma (Lemma 10.1).'}
      </p>

      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t.arraySizeLabel} ({arraySize})</label>
          <input 
            type="range" min="10" max="100" 
            aria-label={`${t.arraySizeLabel} (${arraySize})`}
            value={arraySize} 
            onChange={(e) => setArraySize(Number(e.target.value))}
            className="touch-target w-48"
            disabled={isPlaying}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700" dangerouslySetInnerHTML={{ __html: t.targetValueLabel }}></label>
          <input 
            type="number" 
            aria-label={t.targetValueLabel.replace(/<[^>]*>/g, '')}
            value={targetVal} 
            onChange={(e) => {
              setTargetVal(e.target.value);
              setValidationErrorKey(null);
            }}
            className={cn(
              'touch-target w-32 rounded-lg border px-4 py-2 font-mono focus:ring-2 focus:ring-blue-500',
              validationErrorKey === 'binarySearchTargetRequired'
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300'
            )}
            disabled={isPlaying}
          />
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={handleSort}
             disabled={isSorted || isPlaying}
             className="touch-target flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
           >
             {isSorted ? t.sortedLabel || 'Sorted' : t.sortArray || 'Sort Array'}
           </button>

           <button 
             onClick={handleSearch}
             disabled={isPlaying}
             className="touch-target flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 font-medium text-white hover:bg-green-600 disabled:opacity-50"
           >
             <Play className="w-4 h-4 fill-current"/> {t.startSearch || 'Start Binary Search'}
           </button>

           <button 
             onClick={generateArray}
             disabled={isPlaying}
             className="touch-target rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50"
             title={t.regenerateArray || 'Regenerate Array'}
           >
             <RotateCcw className="w-5 h-5"/>
           </button>
        </div>
        <div className="basis-full">
          <ValidationMessage errorKey={validationErrorKey} messages={t} />
        </div>
      </div>

      {/* Visualizer */}
      <div className="bg-gray-50 rounded-2xl p-6 h-64 border border-gray-200 flex items-end justify-center gap-1 overflow-hidden relative shadow-inner">
        {/* Phase Overlay */}
        {searchPhase !== 'idle' && (
           <div className="absolute top-4 left-6 bg-white/80 backdrop-blur px-4 py-2 rounded-lg shadow-sm font-mono text-sm border font-bold text-gray-700">
             {searchPhase === 'finding_lower' && `${t.findingLowerBound || ''}${targetVal}...`}
             {searchPhase === 'finding_upper' && `${t.findingUpperBound || ''}${targetVal}...`}
             {searchPhase === 'done' && (t.searchComplete || 'Search Complete! Lemma Partition Applied.')}
           </div>
        )}

        <AnimatePresence>
          {array.map((val, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ height: 0 }}
              animate={{ height: `${val}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn(
                "w-full max-w-[24px] rounded-t-sm flex items-end justify-center pb-1 text-[10px] font-mono text-white select-none transition-colors duration-200",
                getBarColor(idx)
              )}
            >
              <span className="opacity-0 hover:opacity-100 sm:opacity-100 rotate-90 sm:rotate-0 truncate">{val}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Result Status & Lemma Map */}
      <AnimatePresence>
      {searchPhase === 'done' && lowerBound !== null && upperBound !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center"
        >
          <div className="flex-1 space-y-4 w-full">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">{t.lemmaVisualized}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">
                <div className="font-bold mb-1">{t.lowerRange}</div>
                <div className="text-xs mb-2">∀k ∈ [0, {lowerBound}) : vₖ &lt; {targetVal}</div>
                {t.elementsLabel} {lowerBound}
              </div>
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800">
                <div className="font-bold mb-1">{t.targetRange}</div>
                <div className="text-xs mb-2">∀k ∈ [{lowerBound}, {upperBound}) : vₖ = {targetVal}</div>
                {t.countLabel} {upperBound - lowerBound}
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800">
                <div className="font-bold mb-1">{t.upperRange}</div>
                <div className="text-xs mb-2">∀k ∈ [{upperBound}, {arraySize}) : vₖ &gt; {targetVal}</div>
                {t.elementsLabel} {arraySize - upperBound}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <DeveloperNote noteKey="devNoteBinarySearch" />

      <Links lang={lang} />
    </div>
  );
}
