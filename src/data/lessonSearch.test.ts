import { expect, it } from 'vitest';
import { algorithmCatalog, searchAlgorithms } from './algorithmCatalog';
import { conceptLessons, searchBook } from './bookCatalog';

it.each([
  ['霍纳', '/horner', '8.1'], ['Horner', '/horner', '8.1'], ['8.1', '/horner', '8.1'],
  ['矩阵与可达性', '/concepts/matrices', '8.5'], ['Matrices and reachability', '/concepts/matrices', '8.6'],
  ['运算与代数结构', '/concepts/algebra', '6.1'], ['Operations and algebraic structures', '/concepts/algebra', '6.2'],
  ['迭代器与区间', '/concepts/iterators', '10.4'], ['Iterators and ranges', '/concepts/iterators', 'C.7'],
  ['同一个幂算法', '/power', '7.1'], ['One power algorithm', '/power', '7.6'],
])('finds %s in both entry points', (query, path, section) => {
  for (const lang of ['zh', 'en'] as const) expect(searchAlgorithms({ query, lang }).filter(r => r.path === path)).toHaveLength(1);
  expect(searchBook(query).flatMap(c => c.sections).some(s => s.id === section)).toBe(true);
});

it('includes every concept name and section, merging shared paths instead of duplicating power', () => {
  const paths = searchAlgorithms({ lang: 'en' }).map(r => r.path);
  expect(new Set(paths).size).toBe(paths.length);
  expect(new Set(paths)).toEqual(new Set([...algorithmCatalog, ...conceptLessons].map(r => r.path)));
  for (const lesson of conceptLessons) for (const query of [lesson.title.zh, lesson.title.en, ...lesson.sections]) {
    expect(searchAlgorithms({ query, lang: 'en' }).filter(r => r.path === lesson.path)).toHaveLength(1);
  }
});

it.each([['矩阵可达性', '/concepts/matrices'], ["Horner's rule", '/horner'], ['generic power', '/power']])('supports the alias %s', (query, path) => {
  expect(searchAlgorithms({ query, lang: 'zh' }).some(r => r.path === path)).toBe(true);
  expect(searchBook(query).length).toBeGreaterThan(0);
});

it('keeps source filtering and section/exercise disambiguation', () => {
  expect(searchAlgorithms({ query: 'Horner', lang: 'en', sourceType: 'extra' })).toEqual([]);
  expect(searchBook('第9.2节').flatMap(c => c.exercises)).toEqual([]);
  expect(searchBook('习题9.2').flatMap(c => c.sections)).toEqual([]);
});

it.each(['第C.7节', 'Section C.7', 'section c.7'])('matches only appendix section C.7 for %s', query => {
  const chapters = searchBook(query);
  expect(chapters.map(c => c.id)).toEqual(['C']);
  expect(chapters.flatMap(c => c.sections).map(s => s.id)).toEqual(['C.7']);
  expect(chapters.flatMap(c => c.exercises)).toEqual([]);
});

it.each(['A.1', 'B.1', 'C.7', '9.2', '10.8'])('matches explicit section %s exactly in either letter case', id => {
  for (const query of [`第${id}节`, `Section ${id}`, `section ${id.toLowerCase()}`]) {
    expect(searchBook(query).flatMap(c => c.sections).map(s => s.id)).toEqual([id]);
    expect(searchBook(query).flatMap(c => c.exercises)).toEqual([]);
  }
});

it.each(['习题9.2', 'Exercise 9.2', 'exercise 9.2'])('keeps exercise %s separate from its same-number section', query => {
  const chapters = searchBook(query);
  expect(chapters.flatMap(c => c.sections)).toEqual([]);
  expect(chapters.flatMap(c => c.exercises).map(e => e.id)).toEqual(['9.2']);
});

it.each(['section C.70', 'Section C.7x', '第C.7.1节', 'Section Z.7'])('does not loosely match malformed or nonexistent explicit section %s', query => {
  expect(searchBook(query)).toEqual([]);
});
