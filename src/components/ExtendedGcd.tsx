import { useState } from 'react';
import { Home, Languages, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';
import { DeveloperNote } from './DeveloperNote';
import { extendedGcdGenerator, binaryExtendedGcdGenerator, ExtendedGcdStep, BinaryExtendedGcdStep } from '../lib/algorithms/extended_gcd';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ExtendedGcd() {
  const [aInput, setAInput] = useState<string>('240');
  const [bInput, setBInput] = useState<string>('46');
  const [mode, setMode] = useState<'traditional' | 'binary'>('traditional');
  
  const [tradSteps, setTradSteps] = useState<ExtendedGcdStep[]>([]);
  const [binSteps, setBinSteps] = useState<BinaryExtendedGcdStep[]>([]);
  
  const [isDone, setIsDone] = useState(false);
  const [tradGenerator, setTradGenerator] = useState<Generator<ExtendedGcdStep, { gcd: bigint, x: bigint, y: bigint }, void> | null>(null);
  const [binGenerator, setBinGenerator] = useState<Generator<BinaryExtendedGcdStep, { gcd: bigint, x: bigint, y: bigint }, void> | null>(null);
  
  const [resultMsg, setResultMsg] = useState<{gcd: bigint, x: bigint, y: bigint} | null>(null);

  const { lang, setLang } = useLanguage();
  const t = translations[lang] as any;

  const initAlgorithm = () => {
    try {
      const a = BigInt(aInput);
      const b = BigInt(bInput);
      
      if (mode === 'traditional') {
        setTradGenerator(extendedGcdGenerator(a, b));
        setTradSteps([]);
      } else {
        setBinGenerator(binaryExtendedGcdGenerator(a, b));
        setBinSteps([]);
      }
      setIsDone(false);
      setResultMsg(null);
    } catch (e) {
      // ignore
    }
  };

  const handleNextStep = () => {
    if (mode === 'traditional' && tradGenerator) {
      const result = tradGenerator.next();
      if (result.done) {
        setIsDone(true);
        setTradGenerator(null);
        setResultMsg(result.value);
      } else {
        setTradSteps(prev => [...prev, result.value]);
      }
    } else if (mode === 'binary' && binGenerator) {
      const result = binGenerator.next();
      if (result.done) {
        setIsDone(true);
        setBinGenerator(null);
        setResultMsg(result.value);
      } else {
        setBinSteps(prev => [...prev, result.value]);
      }
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
            {t.extendedGcdTitle}
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

      <p className="text-gray-600 text-lg">{t.extendedGcdDescription}</p>

      {/* Inputs */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">a</label>
          <input 
            type="text" 
            value={aInput} 
            onChange={(e) => setAInput(e.target.value.replace(/\D/g, ''))} 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">b</label>
          <input 
            type="text" 
            value={bInput} 
            onChange={(e) => setBInput(e.target.value.replace(/\D/g, ''))} 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Algorithm</label>
          <select 
            value={mode} 
            onChange={(e) => setMode(e.target.value as 'traditional' | 'binary')}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="traditional">Traditional Extended GCD</option>
            <option value="binary">Binary (Stein's) Extended GCD</option>
          </select>
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

      <div className="flex gap-4">
        <button 
          onClick={handleNextStep}
          disabled={(!tradGenerator && !binGenerator) || isDone}
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
          className="p-6 rounded-xl border-2 text-center text-xl font-black shadow-inner bg-green-100 text-green-800 border-green-300"
        >
          GCD = {resultMsg.gcd.toString()}<br/>
          Bézout's Identity: ({aInput})×({resultMsg.x.toString()}) + ({bInput})×({resultMsg.y.toString()}) = {resultMsg.gcd.toString()}
        </motion.div>
      )}

      {/* Traditional Steps */}
      {mode === 'traditional' && tradSteps.length > 0 && (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left font-mono">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">a</th><th className="p-3">b</th><th className="p-3">q</th><th className="p-3">r</th>
                <th className="p-3">s (x)</th><th className="p-3">t (y)</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {tradSteps.map((s, i) => (
                  <motion.tr key={i} initial={{opacity: 0}} animate={{opacity: 1}} className="border-t">
                    <td className="p-3">{s.a.toString()}</td>
                    <td className="p-3">{s.b.toString()}</td>
                    <td className="p-3">{s.quotient.toString()}</td>
                    <td className="p-3">{s.remainder.toString()}</td>
                    <td className="p-3">{s.x.toString()}</td>
                    <td className="p-3">{s.y.toString()}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Binary Steps */}
      {mode === 'binary' && binSteps.length > 0 && (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left font-mono text-sm leading-relaxed">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Action</th>
                <th className="p-2">u</th><th className="p-2">v</th>
                <th className="p-2">u1 (x1)</th><th className="p-2">u2 (x2)</th>
                <th className="p-2">v1 (y1)</th><th className="p-2">v2 (y2)</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {binSteps.map((s, i) => (
                  <motion.tr key={i} initial={{opacity: 0}} animate={{opacity: 1}} className="border-t">
                    <td className="p-2 text-indigo-600 font-bold">{s.action}</td>
                    <td className="p-2">{s.u.toString()}</td>
                    <td className="p-2">{s.v.toString()}</td>
                    <td className="p-2">{s.x1.toString()}</td>
                    <td className="p-2">{s.x2.toString()}</td>
                    <td className="p-2">{s.y1.toString()}</td>
                    <td className="p-2">{s.y2.toString()}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      <DeveloperNote noteKey="devNoteExtendedGcd" />
      <Links lang={lang} />
    </div>
  );
}
