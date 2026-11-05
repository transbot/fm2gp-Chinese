import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import { Reverse } from './Reverse';
import bookSource from '../../../配套代码(fm2gpcode)/ch11.h?raw';
import { reverseMethods, reverseTrace } from '../../lib/algorithms/reverseTrace';
import { reverseCode, reverseMessages } from '../concepts/reversePresentation';
beforeEach(()=>localStorage.setItem('fm2gp-language','en'));
afterEach(()=>{cleanup();vi.useRealTimers();});
const mount=()=>render(<MemoryRouter><LanguageProvider><Reverse/></LanguageProvider></MemoryRouter>);
const root=(m='adaptive')=>screen.getByTestId('reverse-'+m);
const player=(m='adaptive')=>within(root(m));
const seek=(m:string,n:number|string)=>fireEvent.change(player(m).getByRole('slider'),{target:{value:String(n)}});
const change=(raw:string)=>fireEvent.change(screen.getByLabelText('Array sequence'),{target:{value:raw}});
it.each(['1.5','1x','1,,2','1e-400','9007199254740992'])('keeps invalid draft %s with associated error',raw=>{
  mount();change(raw);fireEvent.click(screen.getByRole('button',{name:'Apply input'}));
  const field=screen.getByLabelText('Array sequence');expect(field).toHaveValue(raw);expect(field).toHaveAttribute('aria-invalid','true');
  expect(screen.getByRole('alert').id).toBe(field.getAttribute('aria-describedby'));
});
it('supports explicit empty and singleton base cases without buffer use',()=>{
  mount();for(const name of ['Empty sequence','Single element']){
    fireEvent.click(screen.getByRole('button',{name}));
    for(const m of reverseMethods){seek(m,player(m).getByRole('slider').getAttribute('max')!);expect(player(m).getByTestId('counts')).toHaveTextContent('Transfers: 0');}
    expect(player().getByTestId('result')).toHaveTextContent(name==='Empty sequence'?'0 (end)':'1 (end)');
  }
});
it('applies during playback, resets all independent players, and replays only the new input',()=>{
  vi.useFakeTimers();mount();
  for(const m of reverseMethods)fireEvent.click(player(m).getByRole('button',{name:'Play'}));
  act(()=>vi.advanceTimersByTime(1100));change('2,1,2,1,2');
  expect(screen.getByTestId('pending-input')).toHaveTextContent('Pending');
  expect(player().getByTestId('applied-input')).toHaveTextContent('n = 9');
  fireEvent.click(screen.getByRole('button',{name:'Apply input'}));act(()=>vi.advanceTimersByTime(2000));
  for(const m of reverseMethods){
    expect(player(m).getByRole('slider')).toHaveValue('0');expect(player(m).getByTestId('applied-input')).toHaveTextContent('n = 5');
    seek(m,player(m).getByRole('slider').getAttribute('max')!);const state=player(m).getByTestId('sequence').textContent;
    fireEvent.click(player(m).getByRole('button',{name:'Step Backward'}));fireEvent.click(player(m).getByRole('button',{name:'Step Forward'}));expect(player(m).getByTestId('sequence').textContent).toBe(state);
    fireEvent.click(player(m).getByRole('button',{name:'Play'}));expect(player(m).getByRole('slider')).toHaveValue('0');fireEvent.click(player(m).getByRole('button',{name:'Reset'}));
  }
  fireEvent.click(player().getByRole('button',{name:'Play'}));act(()=>vi.advanceTimersByTime(1100));
  expect(player('recursive').getByRole('slider')).toHaveValue('0');expect(player().getByRole('slider')).toHaveValue('1');
  fireEvent.click(screen.getByRole('button',{name:'9'}));act(()=>vi.advanceTimersByTime(2000));
  for(const m of reverseMethods)expect(player(m).getByRole('slider')).toHaveValue('0');
  expect(player().getByTestId('buffer-state')).toHaveTextContent('Capacity = 9');
});
it('keeps snapshots and highlighter stable across language changes and subsequent playback',()=>{
  vi.useFakeTimers();mount();const values=Array.from({length:9},(_,i)=>i);
  const positions=reverseMethods.map(m=>reverseTrace(values,4,m).findIndex(s=>s.event==='swap'));
  reverseMethods.forEach((m,i)=>seek(m,positions[i]));
  const states=reverseMethods.map(m=>player(m).getByRole('slider').getAttribute('value'));
  fireEvent.click(screen.getByRole('button',{name:'中文'}));
  reverseMethods.forEach((m,i)=>{
    expect(player(m).getByRole('slider')).toHaveValue(states[i]);expect(player(m).getByTestId('explanation')).toHaveTextContent(reverseMessages.swap[0]);
    expect(root(m).querySelector('[aria-current="step"]')).toHaveAttribute('data-line','swap');
    fireEvent.click(player(m).getByRole('button',{name:'上一步'}));fireEvent.click(player(m).getByRole('button',{name:'播放'}));
  });
  act(()=>vi.advanceTimersByTime(1100));
  reverseMethods.forEach(m=>expect(player(m).getByTestId('explanation')).toHaveTextContent(reverseMessages.swap[0]));
  fireEvent.click(screen.getByRole('button',{name:'English'}));
  reverseMethods.forEach(m=>expect(player(m).getByTestId('explanation')).toHaveTextContent(reverseMessages.swap[1]));
});
it('every event has bilingual explanation and a matching source statement',()=>{
  for(const m of reverseMethods)for(const c of [0,2,4,9])for(const s of reverseTrace(Array.from({length:9},(_,i)=>i),c,m)){
    expect(reverseCode[s.fn].some(l=>l.id===s.line)).toBe(true);
    expect(reverseMessages[s.event].every(t=>t.length>0)).toBe(true);
  }
});

it('displays the actual ch11.h function bodies; copy_n is explicitly pseudocode',()=>{
  const compact=(text:string)=>text.replace(/\s+/g,'');
  for(const [fn,lines] of Object.entries(reverseCode))if(fn!=='copy_n')expect(compact(bookSource)).toContain(compact(lines.map(l=>l.text).join('\n')));
});
