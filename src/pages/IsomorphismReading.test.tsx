import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {MemoryRouter,Route,Routes} from 'react-router-dom';
import {afterEach,beforeEach,it,expect,vi} from 'vitest';
import {Book} from './Book';
import {LanguageProvider} from '../context/LanguageContext';
import {searchBook} from '../data/bookCatalog';

function mount(hash='isomorphism-map'){
  return render(<MemoryRouter initialEntries={['/book/6?source=model-reader&tag=two+words&q=isomorphism#'+hash]}><LanguageProvider><Routes><Route path="/book/:chapterId" element={<Book/>}/></Routes></LanguageProvider></MemoryRouter>);
}
function values(){
  return within(document.getElementById('isomorphism-map')!).getAllByRole('combobox').map(e=>(e as HTMLSelectElement).value);
}
beforeEach(()=>{sessionStorage.clear();localStorage.setItem('fm2gp-language','en');});
afterEach(()=>{cleanup();vi.restoreAllMocks();});

it('restores a legitimate zero and does not change choices on visiting or opening the example',()=>{
  for(const [key,value] of [['map','f3'],['x','0'],['y','3']])sessionStorage.setItem('fm2gp:book:6.7:'+key,value);
  mount('isomorphism-counterexample');expect(values()).toEqual(['f3','0','3']);
  fireEvent.click(document.querySelector('#isomorphism-counterexample summary')!);
  expect(values()).toEqual(['f3','0','3']);
  fireEvent.click(screen.getByRole('button',{name:'Use this example in the comparison'}));
  expect(values()).toEqual(['b','1','1']);expect(screen.getByText(/3 ≠ 4/)).toBeVisible();
});

it('validates each field independently at mount',()=>{
  sessionStorage.setItem('fm2gp:book:6.7:map','unknown');
  sessionStorage.setItem('fm2gp:book:6.7:x','00');sessionStorage.setItem('fm2gp:book:6.7:y','0');
  mount();expect(values()).toEqual(['f2','1','0']);
});
it('works when session reads and writes throw',()=>{
  for(const method of ['getItem','setItem'] as const){
    const original=Storage.prototype[method];
    vi.spyOn(Storage.prototype,method).mockImplementation(function(this:Storage,...args:string[]){
      if(this===sessionStorage)throw new Error('unavailable');
      return Reflect.apply(original,this,args);
    });
  }
  mount();expect(values()).toEqual(['f2','1','1']);
  fireEvent.change(screen.getByRole('combobox',{name:'x'}),{target:{value:'0'}});
  expect(values()).toEqual(['f2','0','1']);
});
it('keeps the sections distinct from exercise 6.6 and resolves the new aliases',()=>{
  for(const [q,id] of [['第6.6节','6.6'],['Section 6.7','6.7']]){
    const hits=searchBook(q);expect(hits.flatMap(c=>c.sections.map(s=>s.id))).toEqual([id]);
    expect(hits.flatMap(c=>c.exercises)).toEqual([]);
  }
  const exercise=searchBook('习题6.6');expect(exercise.flatMap(c=>c.exercises.map(e=>e.id))).toEqual(['6.6']);
  expect(exercise.flatMap(c=>c.sections)).toEqual([]);
  for(const q of ['同构','isomorphism','克莱因群','Klein group','范畴性','categorical']){
    expect(searchBook(q).flatMap(c=>c.sections.map(s=>s.id)),q).toContain('6.7');
  }
});
it('names both additive monoids and connects the two nonisomorphic models to power in each language',()=>{
  mount('klein-identity');
  expect(document.getElementById('even-natural-monoids')).toHaveTextContent('two additive monoids');
  expect(document.getElementById('generic-model-range')).toHaveTextContent('nonisomorphic both satisfy associativity and the identity law');
  const link=document.querySelector('#generic-model-range a[href^="/power?"]')!;
  expect(new URL(link.getAttribute('href')!,location.origin).searchParams.get('from')).toBe('/book/6?source=model-reader&tag=two+words&q=isomorphism#generic-model-range');
  fireEvent.click(screen.getByRole('button',{name:'中文'}));
  expect(document.getElementById('even-natural-monoids')).toHaveTextContent('两个加法幺半群之间的同构');
  expect(document.getElementById('generic-model-range')).toHaveTextContent('不同构的 ℤ₄ 与 U(8) 都满足结合律和单位元素公理');
});
