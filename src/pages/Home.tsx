import { useMemo, useState } from 'react';
import { BookOpen, Languages, RotateCcw, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import {
  algorithmCatalog,
  Difficulty,
  getAlgorithmById,
  getSourceLabel,
  recommendedLearningStages,
  searchAlgorithms,
  SourceType,
  topicCatalog,
  TopicId,
} from '../data/algorithmCatalog';

interface AlgorithmItem {
  id: string;
  path: string;
  label: string;
  section: string;
  difficulty: Difficulty;
  summary: string;
}

interface TopicSection {
  id: string;
  title: string;
  description: string;
  recommendedStart: string;
  algorithms: AlgorithmItem[];
}

const links = {
  en: {
    blog: "Zhou Jing's Blog",
    github: 'GitHub',
  },
  zh: {
    blog: '周靖的博客',
    github: 'GitHub',
  },
};

export function Home() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const [query, setQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<SourceType | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [topicFilter, setTopicFilter] = useState<TopicId | 'all'>('all');

  const difficultyLabels: Record<Difficulty, string> = {
    beginner: lang === 'zh' ? '入门' : 'Beginner',
    intermediate: lang === 'zh' ? '进阶' : 'Intermediate',
    advanced: lang === 'zh' ? '高级' : 'Advanced',
  };

  const sourceLabels: Record<SourceType | 'all', string> = {
    all: lang === 'zh' ? '全部来源' : 'All sources',
    book: lang === 'zh' ? '书中' : 'Book',
    exercise: lang === 'zh' ? '习题' : 'Exercise',
    extra: lang === 'zh' ? '扩展' : 'Extra',
  };

  const difficultyFilterLabels: Record<Difficulty | 'all', string> = {
    all: lang === 'zh' ? '全部难度' : 'All levels',
    ...difficultyLabels,
  };

  const filteredAlgorithms = useMemo(
    () =>
      searchAlgorithms({
        query,
        lang,
        sourceType: sourceFilter,
        difficulty: difficultyFilter,
        topicId: topicFilter,
      }),
    [difficultyFilter, lang, query, sourceFilter, topicFilter]
  );

  const topicSections: TopicSection[] = useMemo(
    () =>
      [...topicCatalog]
        .sort((a, b) => a.order - b.order)
        .filter((topic) => topicFilter === 'all' || topic.id === topicFilter)
        .map((topic) => {
          const algorithms = filteredAlgorithms
            .filter((algorithm) => algorithm.topicId === topic.id)
            .map((algorithm) => ({
              id: algorithm.id,
              path: algorithm.path,
              label: t[algorithm.titleKey] ?? algorithm.titleKey,
              section: getSourceLabel(algorithm, lang),
              difficulty: algorithm.difficulty,
              summary: algorithm.summary[lang],
            }));

          const recommendedStart =
            algorithms.find((algorithm) => algorithm.path === topic.recommendedStartPath)?.label ??
            algorithms[0]?.label ??
            topic.recommendedStartPath;

          return {
            id: topic.id,
            title: topic.title[lang],
            description: topic.description[lang],
            recommendedStart,
            algorithms,
          };
        })
        .filter((topic) => topic.algorithms.length > 0),
    [filteredAlgorithms, lang, t, topicFilter]
  );

  const recommendedStages = recommendedLearningStages.map((stage) => ({
    title: stage.title[lang],
    description: stage.description[lang],
    items: stage.algorithmIds.map((id) => {
      const algorithm = getAlgorithmById(id);

      return {
        id,
        path: algorithm?.path ?? '/',
        label: algorithm ? t[algorithm.titleKey] ?? algorithm.titleKey : id,
      };
    }),
  }));

  const resetFilters = () => {
    setQuery('');
    setSourceFilter('all');
    setDifficultyFilter('all');
    setTopicFilter('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="bg-blue-600 p-3 rounded-lg shadow-sm shrink-0">
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
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm sm:text-base"
            >
              <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
              {t.language}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {lang === 'zh' ? '推荐学习顺序' : 'Recommended Learning Path'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {lang === 'zh'
                  ? '如果你不确定从哪里开始，可以按这条路线逐步进入核心概念。'
                  : 'If you are not sure where to start, follow this path into the core ideas.'}
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 self-start sm:self-auto">
              {lang === 'zh' ? '入门路线' : 'Beginner path'}
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {recommendedStages.map((stage, stageIndex) => (
              <div key={stage.title} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col lg:flex-row lg:items-start gap-3">
                  <div className="lg:w-64 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 border border-blue-100 inline-flex items-center justify-center text-xs font-bold">
                        {stageIndex + 1}
                      </span>
                      <h3 className="text-sm font-bold text-gray-800">{stage.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stage.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {stage.items.map((item) => (
                      <Link
                        key={item.id}
                        to={item.path}
                        className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_1fr_1fr_1fr_auto] gap-3 items-end">
            <label className="block">
              <span className="block text-xs font-semibold text-gray-600 mb-1">
                {lang === 'zh' ? '搜索算法' : 'Search'}
              </span>
              <span className="relative block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={
                    lang === 'zh' ? '算法、概念或摘要' : 'Algorithm, concept, or summary'
                  }
                  className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-800 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </span>
            </label>

            <label className="block">
              <span className="block text-xs font-semibold text-gray-600 mb-1">
                {lang === 'zh' ? '主题' : 'Topic'}
              </span>
              <select
                value={topicFilter}
                onChange={(event) => setTopicFilter(event.target.value as TopicId | 'all')}
                className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">{lang === 'zh' ? '全部主题' : 'All topics'}</option>
                {topicCatalog.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.title[lang]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="block text-xs font-semibold text-gray-600 mb-1">
                {lang === 'zh' ? '来源' : 'Source'}
              </span>
              <select
                value={sourceFilter}
                onChange={(event) => setSourceFilter(event.target.value as SourceType | 'all')}
                className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                {(Object.keys(sourceLabels) as Array<SourceType | 'all'>).map((source) => (
                  <option key={source} value={source}>
                    {sourceLabels[source]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="block text-xs font-semibold text-gray-600 mb-1">
                {lang === 'zh' ? '难度' : 'Level'}
              </span>
              <select
                value={difficultyFilter}
                onChange={(event) => setDifficultyFilter(event.target.value as Difficulty | 'all')}
                className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                {(Object.keys(difficultyFilterLabels) as Array<Difficulty | 'all'>).map((level) => (
                  <option key={level} value={level}>
                    {difficultyFilterLabels[level]}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={resetFilters}
              className="h-10 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <RotateCcw className="w-4 h-4" />
              {lang === 'zh' ? '重置' : 'Reset'}
            </button>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            {lang === 'zh'
              ? `找到 ${filteredAlgorithms.length} / ${algorithmCatalog.length} 个算法`
              : `${filteredAlgorithms.length} of ${algorithmCatalog.length} algorithms`}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {lang === 'zh' ? '按主题浏览算法' : 'Browse Algorithms by Topic'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {lang === 'zh'
                  ? '每个主题都保留来源信息，并标出适合开始的位置。'
                  : 'Each topic keeps source labels and marks a good starting point.'}
              </p>
            </div>
          </div>

          {topicSections.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-sm text-gray-600">
              {lang === 'zh' ? '没有匹配的算法。' : 'No matching algorithms.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {topicSections.map((topic) => (
                <section
                  key={topic.id}
                  className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{topic.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                    </div>
                    <div className="flex sm:flex-col gap-2 sm:items-end text-xs">
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {topic.algorithms.length} {lang === 'zh' ? '个算法' : 'algorithms'}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                        {lang === 'zh' ? '从 ' : 'Start: '}{topic.recommendedStart}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {topic.algorithms.map((algorithm) => (
                      <Link
                        key={algorithm.id}
                        to={algorithm.path}
                        className="block py-3 first:pt-0 last:pb-0 group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <div className="font-medium text-blue-700 group-hover:text-blue-900">
                              {algorithm.label}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{algorithm.summary}</p>
                          </div>
                          <div className="flex gap-2 shrink-0 text-xs">
                            <span className="px-2 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200">
                              {algorithm.section}
                            </span>
                            <span className="px-2 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                              {difficultyLabels[algorithm.difficulty]}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 sm:p-8 text-white">
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

        <div className="flex justify-center px-4">
          <div className="relative group w-full sm:w-auto">
            <img
              src="/images/EnglishEditionCover.png"
              alt="From Mathematics to Generic Programming Book Cover"
              className="w-full sm:max-w-sm rounded-xl shadow-xl transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
