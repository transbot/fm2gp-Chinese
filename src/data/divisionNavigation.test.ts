import { expect, it } from 'vitest';
import { searchAlgorithms } from './algorithmCatalog';
import { algorithmBookLink, searchBook, sectionAlgorithms } from './bookCatalog';
it.each(['倍增求余','斐波那契求余','逐次减法','埃及除法','doubling remainder','Fibonacci remainder','Egyptian division','largest_doubling','remainder_fibonacci','quotient_remainder','4.6'])('finds %s once at both entry points', query => {
  for(const lang of ['zh','en'] as const) expect(searchAlgorithms({query,lang}).filter(a=>a.path==='/division')).toHaveLength(1);
  expect(searchBook(query).flatMap(c=>c.sections).some(s=>s.id==='4.6')).toBe(true);
});
it('associates both sections and keeps explicit section and exercise searches separate', () => {
  for(const id of ['4.5','4.6']) expect(sectionAlgorithms(id).filter(a=>a.path==='/division')).toHaveLength(1);
  expect(algorithmBookLink('division')).toBe('/book/4#section-4-5');
  for(const query of ['第4.6节','Section 4.6']) {
    expect(searchBook(query).flatMap(c=>c.sections).map(s=>s.id)).toEqual(['4.6']);
    expect(searchBook(query).flatMap(c=>c.exercises)).toEqual([]);
  }
  for(const query of ['习题4.6','Exercise 4.6']) {
    expect(searchBook(query).flatMap(c=>c.exercises).map(e=>e.id)).toEqual(['4.6']);
    expect(searchBook(query).flatMap(c=>c.sections)).toEqual([]);
  }
});
