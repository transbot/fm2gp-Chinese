import { useState } from 'react';
import { Home, Languages, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';
import { DeveloperNote } from './DeveloperNote';
import { ValidationMessage } from './common/ValidationMessage';
import { ResponsiveVisualFrame } from './common/ResponsiveVisualFrame';
import { extendedGcdGenerator, binaryExtendedGcdGenerator, ExtendedGcdStep, BinaryExtendedGcdStep } from '../lib/algorithms/extended_gcd';

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
  const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);

  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const initAlgorithm = () => {
    if (!aInput || !bInput) {
      setValidationErrorKey('inputRequired');
      setTradGenerator(null);
      setBinGenerator(null);
      setTradSteps([]);
      setBinSteps([]);
      setIsDone(false);
      setResultMsg(null);
      return;
    }

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
      setValidationErrorKey(null);
    } catch {
      setValidationErrorKey('invalidInput');
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
    <div className="safe-app-x safe-app-bottom max-w-5xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8">
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
          <h1 className="min-w-0 break-words bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
            {t.extendedGcdTitle}
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

      <p className="text-gray-600 text-lg">{t.extendedGcdDescription}</p>

      {/* Inputs */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">a</label>
          <input 
            type="text" 
            aria-label="a"
            value={aInput} 
            onChange={(e) => {
              setAInput(e.target.value.replace(/\D/g, ''));
              setValidationErrorKey(null);
            }} 
            className="touch-target w-full rounded-lg border px-4 py-2 font-mono focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">b</label>
          <input 
            type="text" 
            aria-label="b"
            value={bInput} 
            onChange={(e) => {
              setBInput(e.target.value.replace(/\D/g, ''));
              setValidationErrorKey(null);
            }} 
            className="touch-target w-full rounded-lg border px-4 py-2 font-mono focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t.algorithmLabel}</label>
          <select 
            aria-label={t.algorithmLabel}
            value={mode} 
            onChange={(e) => setMode(e.target.value as 'traditional' | 'binary')}
            className="touch-target w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="traditional">{t.traditionalExtendedGcd}</option>
            <option value="binary">{t.binaryExtendedGcd}</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
           <button 
             onClick={initAlgorithm}
             className="touch-target px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
           >
             Initialize
           </button>
        </div>
      </div>

      <ValidationMessage errorKey={validationErrorKey} messages={t} />

      <div className="flex flex-wrap gap-3 sm:gap-4">
        <button 
          onClick={handleNextStep}
          disabled={(!tradGenerator && !binGenerator) || isDone}
          className="touch-target flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-bold text-white shadow-md transition-colors hover:bg-blue-600 disabled:opacity-50 sm:flex-none"
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
        <ResponsiveVisualFrame
          label={lang === 'zh' ? '扩展 GCD 步骤' : 'Extended GCD steps'}
          minWidth={720}
          className="rounded-xl border"
        >
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
        </ResponsiveVisualFrame>
      )}

      {/* Binary Steps */}
      {mode === 'binary' && binSteps.length > 0 && (
        <ResponsiveVisualFrame
          label={lang === 'zh' ? '二进制扩展 GCD 步骤' : 'Binary extended GCD steps'}
          minWidth={840}
          className="rounded-xl border"
        >
          <table className="w-full text-left font-mono text-sm leading-relaxed">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Action</th>
                <th className="p-2">u</th><th className="p-2">v</th>
                <th className="p-2">A (x1)</th><th className="p-2">B (x2)</th>
                <th className="p-2">C (y1)</th><th className="p-2">D (y2)</th>
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
        </ResponsiveVisualFrame>
      )}

      <DeveloperNote noteKey="devNoteExtendedGcd" />
      <Links lang={lang} />
    </div>
  );
}
