import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {MemoryRouter,Routes,Route} from 'react-router-dom';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {LanguageProvider} from '../context/LanguageContext';
import {Book} from './Book';
import {searchBook} from '../data/bookCatalog';
const mount=()=>render(<MemoryRouter initialEntries={['/book/8?source=ring-reader&tag=two+words&q=zero#section-8-8']}><LanguageProvider><Routes><Route path="/book/:chapterId" element={<Book/>}/></Routes></LanguageProvider></MemoryRouter>);
const d=(id:string)=>document.getElementById(id) as HTMLDetailsElement;
const toggle=(id:string)=>fireEvent.click(d(id).querySelector('summary')!);
const choose=(name:string,value:string)=>fireEvent.change(screen.getByRole('combobox',{name}),{target:{value}});
beforeEach(()=>{sessionStorage.clear();localStorage.setItem('fm2gp-language','en');});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
it('derives rows from independent model choices including zero, and restores synchronously',async()=>{
 const view=mount();expect(screen.getByTestId('ring-row')).toHaveTextContent('[0, 2, 4, 0, 2, 4]');
 choose('Element a','5');choose('Model','z5');expect(screen.getByRole('combobox',{name:'Element a'})).toHaveValue('2');expect(screen.getByTestId('ring-inverse')).toHaveTextContent('3');
 choose('Element a','0');expect(screen.getByTestId('ring-negative')).toHaveTextContent('(0+0) mod 5=0');expect(screen.getByTestId('ring-classification')).toHaveTextContent('Unit · no · Zero divisor · no');
 toggle('zero-divisor-not-unit');toggle('zero-unit-inverse');toggle('zero-unit-contradiction');
 await waitFor(()=>expect(sessionStorage.getItem('fm2gp-reading:zero-unit-contradiction')).toBe('open'));
 fireEvent.click(screen.getByRole('button',{name:'中文'}));
 expect(d('zero-unit-contradiction').querySelector('summary')).toHaveAccessibleName('查看本步依据: b = 0 ∧ b ≠ 0');
 expect(d('zero-unit-contradiction')).toHaveTextContent('矛盾');
 expect(d('zero-unit-associate').open).toBe(false);
 view.unmount();mount();expect(screen.getByRole('combobox',{name:'模型'})).toHaveValue('z5');expect(screen.getByRole('combobox',{name:'元素 a'})).toHaveValue('0');
 expect(d('zero-unit-inverse').open).toBe(true);expect(d('zero-unit-contradiction').open).toBe(true);expect(d('zero-unit-associate').open).toBe(false);
 choose('模型','z6');expect(screen.getByRole('combobox',{name:'元素 a'})).toHaveValue('5');expect(screen.getByTestId('ring-inverse')).toHaveTextContent('(5×5) mod 6=1');
});
const rows=[
 ['zero-unit-identity','b = 1b','单位元素','identity'],
 ['zero-unit-inverse','1b = (a⁻¹a)b','可逆','invertible'],
 ['zero-unit-associate','(a⁻¹a)b = a⁻¹(ab)','结合律','associativity'],
 ['zero-unit-product','a⁻¹(ab) = a⁻¹0','ab=0','ab=0'],
 ['zero-unit-absorb','a⁻¹0 = 0','吸收','absorption'],
 ['zero-unit-contradiction','b = 0 ∧ b ≠ 0','矛盾','contradicting'],
];
it.each(['en','zh'])('pairs all six formulas and bilingual accessible reasons in %s',lang=>{
 localStorage.setItem('fm2gp-language',lang);mount();
 expect(new Set([...document.querySelectorAll('[id]')].map(n=>n.id)).size).toBe(document.querySelectorAll('[id]').length);
 expect(document.querySelectorAll('#zero-divisor-not-unit ol > li')).toHaveLength(6);
 rows.forEach(([id,formula,zh,en])=>{
  expect(d(id).parentElement?.querySelector('code')).toHaveTextContent(formula);
  expect(d(id).querySelector('summary')).toHaveAccessibleName((lang==='zh'?'查看本步依据':'Why this step is valid')+': '+formula);
  expect(d(id).querySelector('p')?.textContent?.toLowerCase()).toContain(lang==='zh'?zh:en);
 });
});
it.each(['invalid','unavailable'])('uses defaults and remains interactive with %s storage',async mode=>{
 if(mode==='invalid'){sessionStorage.setItem('fm2gp:book:8.4:model','z7');sessionStorage.setItem('fm2gp:book:8.4:z6:element','6');sessionStorage.setItem('fm2gp:book:8.4:z5:element','-1');}
 else for(const method of ['getItem','setItem'] as const){const original=Storage.prototype[method];vi.spyOn(Storage.prototype,method).mockImplementation(function(this:Storage,...args:string[]){if(this===sessionStorage)throw Error('denied');return Reflect.apply(original,this,args);});}
 mount();expect(screen.getByRole('combobox',{name:'Model'})).toHaveValue('z6');expect(screen.getByRole('combobox',{name:'Element a'})).toHaveValue('2');
 choose('Model','z5');expect(screen.getByRole('combobox',{name:'Element a'})).toHaveValue('2');choose('Element a','0');
 toggle('zero-divisor-not-unit');toggle('zero-unit-contradiction');await waitFor(()=>expect(d('zero-unit-contradiction').open).toBe(true));
 expect(screen.getByRole('combobox',{name:'Element a'})).toHaveValue('0');
});
it('preserves query in exercise links and uses the application card despite an old hash',()=>{
 mount();expect(screen.getByRole('link',{name:'In-chapter reference derivation'})).toHaveAttribute('href','/book/8?source=ring-reader&tag=two+words&q=zero#zero-divisor-not-unit');
 expect(screen.getByRole('link',{name:'Return to Exercise 8.6'})).toHaveAttribute('href','/book/8?source=ring-reader&tag=two+words&q=zero#exercise-8-6');
 const url=new URL(d('polynomial-leading-division').querySelector('a')!.href);
 expect(url.searchParams.get('from')).toBe('/book/8?source=ring-reader&tag=two+words&q=zero#polynomial-leading-division');
 expect(document.getElementById('exercise-8-6')).not.toHaveTextContent('No');
});
it('indexes ring/field terms while keeping section and exercise queries exact',()=>{
 for(const q of ['零因子','zero divisor','单位','multiplicative identity','整环','integral domain'])expect(searchBook(q).flatMap(c=>c.sections).map(s=>s.id)).toContain('8.4');
 for(const q of ['域','field','首项系数','coefficient'])expect(searchBook(q).flatMap(c=>c.sections).map(s=>s.id)).toContain('8.8');
 for(const q of ['第8.4节','Section 8.8']){const expected=q.includes('8.4')?'8.4':'8.8';expect(searchBook(q).flatMap(c=>c.sections).map(s=>s.id)).toEqual([expected]);expect(searchBook(q).flatMap(c=>c.exercises)).toEqual([]);}
 expect(searchBook('习题8.4').flatMap(c=>c.exercises).map(e=>e.id)).toEqual(['8.4']);expect(searchBook('习题8.4').flatMap(c=>c.sections)).toEqual([]);
});
