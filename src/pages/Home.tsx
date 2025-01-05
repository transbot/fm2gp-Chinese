import React from 'react';
import { BookOpen, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Links } from '../components/Links';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

export function Home() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">{t.visualizations}</h1>
          </div>
          <button
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Languages className="w-4 h-4" />
            {t.language}
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{t.contents}</h2>
          <ul className="space-y-3">
            <li>
              <Link
                to="/multiply" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {t.egyptianMultiplication}
              </Link>
            </li>
            {/* More algorithms will be added here */}
          </ul>
        </div>

        <Links lang={lang} />
      </div>
    </div>
  );
}