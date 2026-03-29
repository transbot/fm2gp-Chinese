
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { translations } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';

interface DeveloperNoteProps {
  noteKey: string;
}

export function DeveloperNote({ noteKey }: DeveloperNoteProps) {
  const { lang } = useLanguage();
  const t = translations[lang] as any;
  const content = t[noteKey];

  if (!content) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm"
    >
      <div className="flex gap-3">
        <Info className="w-6 h-6 text-amber-600 shrink-0" />
        <div>
          <h4 className="font-semibold text-amber-900 mb-1">{lang === 'zh' ? '开发者笔记' : 'Developer Note'}</h4>
          <p className="text-amber-800 text-sm leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
