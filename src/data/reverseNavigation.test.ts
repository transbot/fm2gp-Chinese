import { expect, it } from 'vitest';
import { searchAlgorithms } from './algorithmCatalog';
import { algorithmBookLink, searchBook, sectionAlgorithms } from './bookCatalog';
it.each(['前向反转','递归反转','自适应反转','缓冲区','forward reverse','recursive reverse','adaptive reverse','buffer','reverse_recursive','reverse_n_adaptive','reverse_n_with_buffer'])('finds %s once in both catalogs',query=>{
  for(const lang of ['zh','en'] as const)expect(searchAlgorithms({query,lang}).filter(a=>a.path==='/reverse')).toHaveLength(1);
  expect(searchBook(query).flatMap(c=>c.sections).some(s=>s.id==='11.7')).toBe(true);
});
it('connects three sections and separates explicit section and exercise identifiers',()=>{
  for(const id of ['11.5','11.6','11.7'])expect(sectionAlgorithms(id).filter(a=>a.path==='/reverse')).toHaveLength(1);
  expect(algorithmBookLink('reverse')).toBe('/book/11#section-11-5');
  for(const query of ['第11.7节','Section 11.7']){
    expect(searchBook(query).flatMap(c=>c.sections).map(s=>s.id)).toEqual(['11.7']);
    expect(searchBook(query).flatMap(c=>c.exercises)).toEqual([]);
  }
  for(const query of ['习题11.7','Exercise 11.7']){
    expect(searchBook(query).flatMap(c=>c.exercises).map(s=>s.id)).toEqual(['11.7']);
    expect(searchBook(query).flatMap(c=>c.sections)).toEqual([]);
  }
});
