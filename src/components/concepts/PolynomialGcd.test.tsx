import companion from '../../../配套代码(fm2gpcode)/ch12.h?raw';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import { PolynomialGcd } from './PolynomialGcd';
import { divisionTrace, fromIntegers, polynomialGcdTrace } from '../../lib/algorithms/polynomialGcd';
import { gcdMessages, polynomialGcdCode } from './polynomialGcdPresentation';
import { searchBook, conceptLessons } from '../../data/bookCatalog';
import { searchAlgorithms } from '../../data/algorithmCatalog';
beforeEach(()=>localStorage.setItem('fm2gp-language','en'));
afterEach(()=>{cleanup();vi.useRealTimers();});
const mount=()=>render(<MemoryRouter><LanguageProvider><PolynomialGcd/></LanguageProvider></MemoryRouter>);
const panel=(mode='gcd')=>within(screen.getByTestId(`polynomial-${mode}`));
const seek=(value:string,mode='gcd')=>fireEvent.change(panel(mode).getByRole('slider'),{target:{value}});
const end=(mode='gcd')=>seek(panel(mode).getByRole('slider').getAttribute('max')!,mode);
it('restores code, scope and counters for every book trace event in both languages',()=>{
 mount();const trace=polynomialGcdTrace(fromIntegers([3,-4,-6,10]),fromIntegers([1,-2]));
 for(const lang of ['en','zh'] as const){if(lang==='zh')fireEvent.click(screen.getByRole('button',{name:'中文'}));
 trace.forEach((s,i)=>{seek(String(i));const root=screen.getByTestId('polynomial-gcd');expect(root).toHaveAttribute('data-function',s.fn);expect(panel().getByTestId('explanation')).toHaveTextContent(gcdMessages[s.event][lang==='zh'?0:1]);expect(!!panel().queryByTestId('inner')).toBe(!!s.inner);expect(root.querySelector('[aria-current="step"]')?.getAttribute('data-line')??'').toBe(i?s.line:'');expect(panel().getByTestId('counts').textContent?.match(/\d+/g)).toEqual([String(s.counts.gcdRounds),String(s.counts.eliminations)]);expect(polynomialGcdCode[s.fn].some(l=>l.id===s.line)).toBe(true);});}
});
it('applies new input while playing, keeps independent progress and resets both players',()=>{
 vi.useFakeTimers();mount();fireEvent.click(panel().getByRole('button',{name:'Play'}));act(()=>vi.advanceTimersByTime(1100));expect(panel('division').getByRole('slider')).toHaveValue('0');
 fireEvent.change(screen.getByLabelText('A：coefficients in descending order'),{target:{value:'[1,0,1]'}});fireEvent.change(screen.getByLabelText('B：coefficients in descending order'),{target:{value:'[2,1]'}});expect(screen.getByTestId('pending-input')).toBeVisible();fireEvent.click(screen.getByRole('button',{name:'Apply input'}));
 act(()=>vi.advanceTimersByTime(2200));expect(panel().getByRole('slider')).toHaveValue('0');expect(panel('division').getByRole('slider')).toHaveValue('0');
 end('division');expect(panel('division').getByTestId('formula-Q')).toHaveTextContent('(1/2)x − 1/4');expect(panel('division').getByTestId('formula-R')).toHaveTextContent('5/4');
 fireEvent.click(panel('division').getByRole('button',{name:'Step Backward'}));fireEvent.click(panel('division').getByRole('button',{name:'Step Forward'}));expect(panel('division').getByTestId('formula-R')).toHaveTextContent('5/4');
 fireEvent.click(panel('division').getByRole('button',{name:'Play'}));expect(panel('division').getByRole('slider')).toHaveValue('0');act(()=>vi.advanceTimersByTime(1100));fireEvent.click(panel('division').getByRole('button',{name:'Reset'}));expect(panel('division').getByRole('slider')).toHaveValue('0');
});
it('changes explanations immediately while keeping coefficients, code and position on replay',()=>{
 vi.useFakeTimers();mount();const trace=divisionTrace(fromIntegers([3,-4,-6,10]),fromIntegers([1,-2]));const index=trace.findIndex(s=>s.event==='eliminate');seek(String(index),'division');const formula=panel('division').getByTestId('formula-R').textContent;
 fireEvent.click(screen.getByRole('button',{name:'中文'}));expect(panel('division').getByRole('slider')).toHaveValue(String(index));expect(panel('division').getByTestId('formula-R').textContent).toBe(formula);expect(panel('division').getByTestId('explanation')).toHaveTextContent(gcdMessages.eliminate[0]);
 fireEvent.click(panel('division').getByRole('button',{name:'上一步'}));expect(panel('division').getByTestId('explanation')).toHaveTextContent(gcdMessages.term[0]);fireEvent.click(panel('division').getByRole('button',{name:'播放'}));act(()=>vi.advanceTimersByTime(1100));fireEvent.click(panel('division').getByRole('button',{name:'暂停'}));expect(panel('division').getByTestId('formula-R').textContent).toBe(formula);
});
it('separates zero-divisor validation from GCD and handles original text and leading zeros',()=>{
 mount();fireEvent.click(screen.getByTestId('example-zero'));expect(screen.getByTestId('zero-divisor')).toBeVisible();end();expect(panel().getByTestId('formula-Monic GCD')).toHaveTextContent('= 0');
 for(const bad of ['','[]','[1,,2]','[1.00000000000000001]','[1e-400]','[1001]','[0,0,0,0,0,0,0,0,0,0]']){fireEvent.change(screen.getByLabelText('A：coefficients in descending order'),{target:{value:bad}});fireEvent.click(screen.getByRole('button',{name:'Apply input'}));expect(screen.getByRole('alert')).toBeVisible();expect(screen.queryByTestId('polynomial-gcd')).toBeNull();}
 fireEvent.change(screen.getByLabelText('A：coefficients in descending order'),{target:{value:'[0,0,2,0,-3,0]'}});fireEvent.click(screen.getByRole('button',{name:'Apply input'}));expect(screen.getByTestId('canonical-A')).toHaveTextContent('[0, 0, 2, 0, -3, 0]');expect(screen.getByTestId('canonical-A')).toHaveTextContent('2x³ − 3x');end();expect(panel().getByTestId('formula-Monic GCD')).toHaveTextContent('x³ − (3/2)x');
});
it('includes bilingual names and aliases once in search and distinguishes 8.3 section/exercise',()=>{
 for(const q of ['多项式求余','多项式GCD','Polynomial GCD','long division','首一化']){expect(searchAlgorithms({query:q,lang:'en'}).filter(r=>r.path==='/polynomial-gcd')).toHaveLength(1);expect(searchBook(q).some(c=>c.sections.some(s=>s.id==='8.7'))).toBe(true);}
 for(const q of ['第8.3节','Section 8.3']){expect(searchBook(q).flatMap(c=>c.sections).map(s=>s.id)).toEqual(['8.3']);expect(searchBook(q).flatMap(c=>c.exercises)).toEqual([]);}
 for(const q of ['习题8.3','Exercise 8.3']){expect(searchBook(q).flatMap(c=>c.exercises).map(s=>s.id)).toEqual(['8.3']);expect(searchBook(q).flatMap(c=>c.sections)).toEqual([]);}
 expect(conceptLessons.find(l=>l.path==='/polynomial-gcd')?.codePaths).toEqual(['配套代码(fm2gpcode)/ch12.h']);
});

it('shows the exact companion gcd body and complete bilingual event/error dictionaries',()=>{
 expect(companion.replace(/\s/g,'')).toContain(polynomialGcdCode.gcd.map(l=>l.text).join('').replace(/\s/g,''));
 for(const pair of Object.values(gcdMessages)){expect(pair).toHaveLength(2);expect(pair[0].trim()).not.toBe('');expect(pair[1].trim()).not.toBe('');expect(pair[1]).not.toMatch(/[\u3400-\u9fff]/);}
});
it.each([
 ['book','6','1'],['exercise1','−4x² + 24x − 35','x² − 6x + 35/4'],
 ['exercise2','(605/1521)x² + (1210/1521)x + 605/1521','x² + 2x + 1'],['constants','6','1'],['zero','0','0'],
])('restores fixed adjacent return displays for %s',(id,raw,result)=>{
 mount();fireEvent.click(screen.getByTestId(`example-${id}`));end();
 const check=(monic:boolean)=>{
  expect(panel().getByTestId('formula-Latest returned value')).toHaveTextContent(`Latest returned value = ${monic?result:raw}`);
  expect(panel().getByTestId('formula-Raw GCD return')).toHaveTextContent(`Raw GCD return = ${raw}`);
  expect(screen.getByTestId('polynomial-gcd')).toHaveAttribute('data-function',monic?'monic':'gcd');
  expect(screen.getByTestId('polynomial-gcd').querySelector('[aria-current="step"]')).toHaveAttribute('data-line',monic?(id==='zero'?'zero':'normalize'):'return');
  if(monic)expect(panel().getByTestId('formula-Monic GCD')).toHaveTextContent(`Monic GCD = ${result}`);else expect(panel().queryByTestId('formula-Monic GCD')).toBeNull();
 };
 check(true);const counts=panel().getByTestId('counts').textContent;fireEvent.click(panel().getByRole('button',{name:'Step Backward'}));check(false);expect(panel().getByTestId('counts').textContent).toBe(counts);fireEvent.click(panel().getByRole('button',{name:'Step Forward'}));check(true);
});
