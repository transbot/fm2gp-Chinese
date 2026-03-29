import { useState } from 'react';
import { Home, Languages, Play, Square, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';
import { DeveloperNote } from './DeveloperNote';
import { millerRabinGenerator, MillerRabinStep } from '../lib/algorithms/miller_rabin';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function MillerRabin() {
  const [nInput, setNInput] = useState<string>('561');
  const [kInput, setKInput] = useState<string>('3');
  const [steps, setSteps] = useState<MillerRabinStep[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generator, setGenerator] = useState<Generator<MillerRabinStep, boolean, void> | null>(null);
  const [resultMsg, setResultMsg] = useState('');

  const { lang, setLang } = useLanguage();
  const t = translations[lang] as any;

  const initAlgorithm = () => {
    try {
      const n = BigInt(nInput);
      const k = parseInt(kInput, 10) || 5;
      
      if (n <= 3n) {
        setResultMsg(n <= 1n ? "n must be > 1" : "n <= 3 is prime trivially.");
        setIsDone(true);
        setSteps([]);
        return;
      }
      if (n % 2n === 0n) {
        setResultMsg("n is even, trivially composite.");
        setIsDone(true);
        setSteps([]);
        return;
      }

      const gen = millerRabinGenerator(n, k);
      setGenerator(gen);
      setSteps([]);
      setIsDone(false);
      setResultMsg('');
      setIsPlaying(false);
    } catch (e) {
      setResultMsg("Invalid input size");
    }
  };

  const handleNextStep = () => {
    if (!generator) return;
    const result = generator.next();
    if (result.done) {
      setIsDone(true);
      setIsPlaying(false);
      setGenerator(null);
      setResultMsg(result.value ? "PROBABLY PRIME" : "COMPOSITE");
    } else {
      setSteps(prev => [...prev, result.value]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors shrink-0"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {t.millerRabinTitle}
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

      <p className="text-gray-600 text-lg">{t.millerRabinDescription}</p>

      {/* Inputs */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">n (Number to test)</label>
          <input 
            type="text" 
            value={nInput} 
            onChange={(e) => setNInput(e.target.value.replace(/\D/g, ''))} 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder="e.g. 561"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">k (Number of iterations)</label>
          <input 
            type="number" 
            min="1" max="20"
            value={kInput} 
            onChange={(e) => setKInput(e.target.value)} 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>
        <div className="flex items-end gap-2">
           <button 
             onClick={initAlgorithm}
             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
           >
             Initialize
           </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button 
          onClick={handleNextStep}
          disabled={!generator || isDone}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 font-bold shadow-md"
        >
          <Play className="w-5 h-5 fill-current" />
          Next Step
        </button>
      </div>

      {resultMsg && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "p-6 rounded-xl border-2 text-center text-xl font-black shadow-inner",
            resultMsg === "PROBABLY PRIME" ? "bg-green-100 text-green-800 border-green-300" :
            resultMsg === "COMPOSITE" ? "bg-red-100 text-red-800 border-red-300" :
            "bg-orange-100 text-orange-800 border-orange-300"
          )}
        >
          {resultMsg}
        </motion.div>
      )}

      {/* Steps visualization */}
      {steps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold border-b pb-2">Execution Steps</h3>
          <div className="grid gap-3">
            <AnimatePresence>
              {steps.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "p-4 rounded-lg border",
                    step.phase === 'decomposition' ? "bg-purple-50 border-purple-200" :
                    step.phase === 'result' ? (step.isProbablyPrime ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200") : 
                    "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700 capitalize tracking-wide">{step.phase} Phase</span>
                    {step.witness !== 0n && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-mono font-bold">
                        Witness a = {step.witness.toString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 font-mono text-sm mt-3">
                    {Object.entries(step.details || {}).map(([key, val]) => (
                      <div key={key} className={cn("bg-white p-2 border rounded select-all", key === 'explanation' || key === 'step' || key === 'reason' ? "col-span-2 text-lg font-bold text-indigo-700" : "")}>
                        <span className="text-gray-500 mr-2">{key}:</span>
                        <span className="font-bold">{val.toString()}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <DeveloperNote noteKey="devNoteMillerRabin" />
      <Links lang={lang} />
    </div>
  );
}
