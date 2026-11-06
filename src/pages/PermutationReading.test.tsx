import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, beforeEach, expect, it, vi} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import {LanguageProvider} from '../context/LanguageContext';
import {Chapter11} from '../components/book/Chapter11';
import {Cycle} from '../components/algorithms/Cycle';
import {searchAlgorithms} from '../data/algorithmCatalog';
import {searchBook} from '../data/bookCatalog';

beforeEach(()=>{sessionStorage.clear();localStorage.setItem('fm2gp-language','en');});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
function mountCycle(){
  render(<MemoryRouter initialEntries={['/cycle']}><LanguageProvider><Cycle/></LanguageProvider></MemoryRouter>);
}
it('defines a trivial cycle and distinguishes composition from a single transposition',()=>{
  render(<MemoryRouter><LanguageProvider><Chapter11 section="11.1"/></LanguageProvider></MemoryRouter>);
  expect(document.getElementById('permutation-six-cycles')).toHaveTextContent('Definition 11.4: a trivial cycle contains just one element');
  const card=document.getElementById('permutation-composition');
  const p=[2,1,3], q=[1,3,2];
  function apply(data:string[],dest:number[]) {
    const result:string[]=[];
    data.forEach((v,i)=>{result[dest[i]-1]=v;});return result;
  }
  for(const [first,second] of [[q,p],[p,q],[p,p],[q,q]]) {
    const start=['a','b','c'], mid=apply(start,first);
    expect(card).toHaveTextContent([start,mid,apply(mid,second)].map(a=>'['+a.join(',')+']').join(' → '));
  }
  expect(card?.querySelector('a')).toHaveAttribute('href','/book/11#exercise-11-3');
});
it('searches the two readings and distinguishes a section from the same exercise number',()=>{
  for(const query of ['排列','permutation']) {
    const results=searchBook(query).find(c=>c.id==='11');
    expect(results?.sections.map(s=>s.id)).toEqual(expect.arrayContaining(['11.1','11.4']));
  }
  expect(searchAlgorithms({query:'rotate_cycle_from',lang:'en'}).filter(x=>x.path==='/cycle')).toHaveLength(1);
  const explicit=searchBook('第11.4节');expect(explicit.flatMap(c=>c.sections.map(s=>s.id))).toEqual(['11.4']);
  expect(explicit.flatMap(c=>c.exercises)).toEqual([]);
  const exercise=searchBook('Exercise 11.4');expect(exercise.flatMap(c=>c.exercises.map(e=>e.id))).toEqual(['11.4']);
  expect(exercise.flatMap(c=>c.sections)).toEqual([]);
});
it('validates a saved run before the first write and starts paused',()=>{
  const key='fm2gp:cycle:v1:run';
  sessionStorage.setItem(key,JSON.stringify({array:[0,1],to:[1,0],step:7}));mountCycle();
  expect(screen.getByRole('slider')).toHaveValue('7');
  expect(JSON.parse(sessionStorage.getItem(key)!).step).toBe(7);
  expect(screen.getByRole('button',{name:'Play'})).toBeInTheDocument();
});
it('falls back on malformed storage and handles failures to save',()=>{
  sessionStorage.setItem('fm2gp:cycle:v1:run',JSON.stringify({array:[null],to:[0],step:5}));
  vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('unavailable');});
  mountCycle();
  expect(screen.getByRole('slider')).toHaveValue('0');
  expect(screen.getByRole('textbox',{name:'Array'})).toHaveValue('0, 1, 2, 3, 4, 5');
  fireEvent.click(screen.getByRole('button',{name:'Step Forward'}));
  expect(screen.getByRole('slider')).toHaveValue('1');
});
