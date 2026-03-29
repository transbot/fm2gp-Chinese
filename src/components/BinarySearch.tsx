import { useState, useEffect } from 'react';
import { Home, Languages, Play, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';
import { DeveloperNote } from './DeveloperNote';
import { lowerBoundGenerator, upperBoundGenerator, quickSortGenerator } from '../lib/algorithms/binary_search';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function BinarySearch() {
  const [arraySize, setArraySize] = useState<number>(40);
  const [array, setArray] = useState<number[]>([]);
  const [targetVal, setTargetVal] = useState<string>('50');
  const [isSorted, setIsSorted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Visual states corresponding to iterators
  const [activeRange, setActiveRange] = useState<[number, number] | null>(null);
  const [midIdx, setMidIdx] = useState<number | null>(null);
  const [lowerBound, setLowerBound] = useState<number | null>(null);
  const [upperBound, setUpperBound] = useState<number | null>(null);
  
  const [searchPhase, setSearchPhase] = useState<'idle' | 'finding_lower' | 'finding_upper' | 'done'>('idle');

  const { lang, setLang } = useLanguage();
  const t = translations[lang] as any;

  // Generate a new random array
  const generateArray = () => {
    const newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 99) + 1);
    setArray(newArr);
    setIsSorted(false);
    resetSearchState();
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const resetSearchState = () => {
    setActiveRange(null);
    setMidIdx(null);
    setLowerBound(null);
    setUpperBound(null);
    setSearchPhase('idle');
    setIsPlaying(false);
  };

  const handleSort = async () => {
    if (isSorted) return;
    setIsPlaying(true);
    let arrCopy = [...array];
    const gen = quickSortGenerator(arrCopy);
    
    // Animate sort quickly
    for (let step of gen) {
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
    if (!isSorted || isPlaying) return;
    setIsPlaying(true);
    resetSearchState();
    
    const target = parseInt(targetVal) || 50;
    
    // 1. Find lower_bound (b_l)
    setSearchPhase('finding_lower');
    const lowerGen = lowerBoundGenerator(array, target);
    let l_result = 0;
    
    for (let step of lowerGen) {
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
    
    for (let step of upperGen) {
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {t.binarySearchTitle || 'Binary Search'}
          </h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
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
            value={arraySize} 
            onChange={(e) => setArraySize(Number(e.target.value))}
            className="w-48"
            disabled={isPlaying}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700" dangerouslySetInnerHTML={{ __html: t.targetValueLabel }}></label>
          <input 
            type="number" 
            value={targetVal} 
            onChange={(e) => setTargetVal(e.target.value)}
            className="w-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
            disabled={isPlaying}
          />
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={handleSort}
             disabled={isSorted || isPlaying}
             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 flex items-center gap-2"
           >
             {isSorted ? t.sortedLabel || 'Sorted' : t.sortArray || 'Sort Array'}
           </button>

           <button 
             onClick={handleSearch}
             disabled={!isSorted || isPlaying || !targetVal}
             className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium disabled:opacity-50 flex items-center gap-2"
           >
             <Play className="w-4 h-4 fill-current"/> {t.startSearch || 'Start Binary Search'}
           </button>

           <button 
             onClick={generateArray}
             disabled={isPlaying}
             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
             title={t.regenerateArray || 'Regenerate Array'}
           >
             <RotateCcw className="w-5 h-5"/>
           </button>
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
