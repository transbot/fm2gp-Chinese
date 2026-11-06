import { expect, it } from 'vitest';
import { axioms, derivations } from './chapter9Proofs';
import { methods, notation, readings } from './appendixReference';
import { searchBook } from './bookCatalog';

it('fixes the right-zero computation and its scope separately from the left-zero theorem',()=>{
  expect(derivations[0].steps.map(s=>s.expression)).toEqual(['2 + 3 = s(2 + 2)','= s(s(2 + 1))','= s(s(s(2 + 0)))','= s(s(s(2)))','= s(s(3))','= s(4)','= 5']);
  expect(derivations[1].steps.map(s=>s.expression)).toEqual(['0 + 0 = 0','0 + k = k','0 + s(k) = s(0 + k)','= s(k)']);
  expect(derivations[1].conclusion.en).toMatch(/third axiom.*every a/);
});
it('keeps the induction variable and complete associativity chain fixed',()=>{
  const d=derivations[2];
  expect(d.introduction.en).toContain('Fix arbitrary a, b');
  expect(d.steps.map(s=>s.expression)).toEqual(['(a + b) + 0 = a + b','= a + (b + 0)','(a + b) + k = a + (b + k)','(a + b) + s(k) = s((a + b) + k)','= s(a + (b + k))','= a + s(b + k)','= a + (b + s(k))']);
});
it('orders the Peano axioms as in the book',()=>{
  expect(axioms.map(a=>a.en)).toEqual([
    'Zero is a natural number.', 'Every natural number n has a successor s(n), also a natural number.',
    'A subset of the natural numbers that contains zero and is closed under successors is the entire set of natural numbers.',
    'If s(n) = s(m), then n = m.', 'Zero is not the successor of any natural number.'
  ]);
});
it('has all notation, domain restrictions, and bounded proof examples',()=>{
  expect(notation).toHaveLength(18);expect(readings).toHaveLength(4);
  expect(notation.find(t=>t.symbol==='ℚ')?.use.en).toContain('integers p and q and q ≠ 0');
  expect(methods['B.1'].premise.en).toContain('n² is odd');expect(methods['B.1'].steps[1].en).toContain('2(2m²)');
  expect(methods['B.2'].steps[0].en).toContain('1 = 1(1 + 1)/2');expect(methods['B.2'].conclusion.en).toContain('5 = 15');
  const text=methods['B.3'].steps.map(s=>s.en).join(' ');
  for(const n of [2**10,Array.from({length:10},(_,i)=>90+i).reduce((a,b)=>a+b),946])expect(text).toContain(String(n));
  expect(methods['B.3'].premise.en).toContain('ten distinct positive integers less than 100');
});
it.each([
  ['后继','9.6,9.7'],['successor','9.6,9.7'],['归纳','9.6,9.7,B.2'],['induction','9.6,9.7,B.2'],
  ['全称量词','A.1,A.2'],['universal quantifier','A.1,A.2'],['逆否命题','A.3'],['contrapositive','A.3'],
  ['反证法','B.1'],['proof by contradiction','B.1'],['鸽巢原理','B.3'],['pigeonhole principle','B.3']
])('indexes actual reading sections for %s',(q,expected)=>{
  const ids=searchBook(q).flatMap(c=>c.sections.map(s=>s.id));
  for(const id of expected.split(',')) expect(ids).toContain(id);
  expect(new Set(ids).size).toBe(ids.length);
});
it.each(['A.3','B.2'])('restricts explicit appendix queries to %s',id=>{
  for(const q of ['第'+id+'节','Section '+id,'section '+id.toLowerCase()]){
    const hits=searchBook(q);
    expect(hits.flatMap(c=>c.sections.map(s=>s.id))).toEqual([id]);
    expect(hits.flatMap(c=>c.exercises)).toEqual([]);
  }
});
