import { describe, expect, it } from 'vitest';
import {
  algorithmCatalog,
  getAlgorithmNavigation,
  getAlgorithmPath,
  getDifficultyLabel,
  searchAlgorithms,
  recommendedLearningPathIds,
  recommendedLearningStages,
  getSourceLabel,
  topicCatalog,
} from './algorithmCatalog';

describe('algorithmCatalog', () => {
  it('keeps route paths unique', () => {
    const paths = algorithmCatalog.map((item) => item.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('keeps extension algorithms free of book section numbers', () => {
    const extensionAlgorithms = algorithmCatalog.filter((item) => item.source.type === 'extra');

    expect(extensionAlgorithms.length).toBeGreaterThan(0);
    expect(extensionAlgorithms.every((item) => item.source.section === undefined)).toBe(true);
    expect(getSourceLabel(extensionAlgorithms[0], 'zh')).toBe('扩展');
    expect(getSourceLabel(extensionAlgorithms[0], 'en')).toBe('Extra');
  });

  it('classifies added beginner algorithms as extensions', () => {
    expect(algorithmCatalog.find((item) => item.id === 'insertion-sort')).toMatchObject({
      difficulty: 'beginner',
      source: { type: 'extra' },
    });
    expect(algorithmCatalog.find((item) => item.id === 'selection-sort')).toMatchObject({
      difficulty: 'beginner',
      source: { type: 'extra' },
    });
    expect(algorithmCatalog.find((item) => item.id === 'prefix-sum')).toMatchObject({
      difficulty: 'beginner',
      source: { type: 'extra' },
    });
    expect(algorithmCatalog.find((item) => item.id === 'bubble-sort')).toMatchObject({
      difficulty: 'beginner',
      source: { type: 'extra' },
    });
    expect(algorithmCatalog.find((item) => item.id === 'frequency-count')).toMatchObject({
      difficulty: 'beginner',
      source: { type: 'extra' },
    });
    expect(algorithmCatalog.find((item) => item.id === 'two-sum')).toMatchObject({
      difficulty: 'beginner',
      source: { type: 'extra' },
    });
  });

  it('has a valid topic and title key for every algorithm', () => {
    const topicIds = new Set(topicCatalog.map((topic) => topic.id));

    expect(algorithmCatalog.every((item) => topicIds.has(item.topicId))).toBe(true);
    expect(algorithmCatalog.every((item) => item.titleKey.length > 0)).toBe(true);
  });

  it('provides catalog paths by id for route definitions', () => {
    expect(getAlgorithmPath('prefix-sum')).toBe('/prefix-sum');
  });

  it('keeps recommended learning path ids in the catalog', () => {
    const ids = new Set(algorithmCatalog.map((item) => item.id));

    expect(recommendedLearningPathIds.length).toBeGreaterThan(0);
    expect(recommendedLearningPathIds.every((id) => ids.has(id))).toBe(true);
  });

  it('uses a beginner-first staged learning path', () => {
    expect(recommendedLearningPathIds).toEqual([
      'linear-search',
      'frequency-count',
      'two-sum',
      'prefix-sum',
      'bubble-sort',
      'insertion-sort',
      'selection-sort',
      'binary-search',
    ]);
    expect(recommendedLearningStages.map((stage) => stage.algorithmIds)).toEqual([
      ['linear-search', 'frequency-count', 'two-sum', 'prefix-sum'],
      ['bubble-sort', 'insertion-sort', 'selection-sort'],
      ['binary-search'],
    ]);
    expect(recommendedLearningStages.every((stage) => stage.title.en && stage.title.zh)).toBe(true);
  });

  it('finds previous and next algorithms within the same topic', () => {
    expect(getAlgorithmNavigation('selection-sort')).toMatchObject({
      current: { id: 'selection-sort' },
      previous: { id: 'insertion-sort' },
      next: { id: 'merge-sort' },
      topic: { id: 'sorting-heap' },
    });
  });

  it('omits previous or next at topic boundaries', () => {
    const first = getAlgorithmNavigation('linear-search');
    const last = getAlgorithmNavigation('reverse');

    expect(first?.previous).toBeUndefined();
    expect(first?.next?.id).toBe('prefix-sum');
    expect(last?.previous?.id).toBe('cycle');
    expect(last?.next).toBeUndefined();
  });

  it('returns undefined navigation for unknown algorithm ids', () => {
    expect(getAlgorithmNavigation('missing')).toBeUndefined();
  });

  it('localizes difficulty labels', () => {
    expect(getDifficultyLabel('beginner', 'zh')).toBe('入门');
    expect(getDifficultyLabel('advanced', 'en')).toBe('Advanced');
  });

  it('provides bilingual learning guidance for every algorithm', () => {
    expect(algorithmCatalog.every((item) => item.coreConcept.en.length > 0)).toBe(true);
    expect(algorithmCatalog.every((item) => item.coreConcept.zh.length > 0)).toBe(true);
  });

  it('marks extension algorithms as supplemental learning material', () => {
    const prefixSum = algorithmCatalog.find((item) => item.id === 'prefix-sum');

    expect(prefixSum?.source.type).toBe('extra');
    expect(prefixSum?.learningNote?.en).toContain('not covered in the book');
    expect(prefixSum?.learningNote?.zh).toContain('非书中内容');
  });

  it('searches algorithms by bilingual summary and core concept', () => {
    expect(searchAlgorithms({ query: 'sorted prefix', lang: 'en' }).map((item) => item.id))
      .toContain('insertion-sort');
    expect(searchAlgorithms({ query: '有序前缀', lang: 'zh' }).map((item) => item.id))
      .toContain('insertion-sort');
  });

  it('filters algorithms by source, difficulty, and topic', () => {
    const results = searchAlgorithms({
      sourceType: 'extra',
      difficulty: 'beginner',
      topicId: 'sorting-heap',
      lang: 'en',
    });

    expect(results.map((item) => item.id)).toEqual(['bubble-sort', 'insertion-sort', 'selection-sort']);
  });

  it('keeps catalog order in search results', () => {
    expect(searchAlgorithms({ query: 'sort', lang: 'en' }).map((item) => item.id))
      .toEqual(['bubble-sort', 'insertion-sort', 'selection-sort', 'merge-sort', 'quick-sort']);
  });
});
