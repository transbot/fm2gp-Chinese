import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import { Division } from './Division';
import { divisionMethods, divisionTrace } from '../../lib/algorithms/divisionTrace';
import { divisionCode, divisionMessages } from '../concepts/divisionPresentation';
beforeEach(() => localStorage.setItem('fm2gp-language','en'));
afterEach(() => { cleanup(); vi.useRealTimers(); });
const mount = () => render(<MemoryRouter><LanguageProvider><Division /></LanguageProvider></MemoryRouter>);
const root = (m = 'doubling') => screen.getByTestId('division-'+m);
const player = (m = 'doubling') => within(root(m));
const seek = (m: string, n: number | string) => fireEvent.change(player(m).getByRole('slider',{hidden:true}),{target:{value:String(n)}});
const input = (A: string, B: string) => {
  fireEvent.change(screen.getByLabelText('A: original dividend'),{target:{value:A}});
  fireEvent.change(screen.getByLabelText('B: original divisor'),{target:{value:B}});
};
it.each(['1.00000000000000001','1e-400','257'])('rejects invalid original A=%s next to its input', A => {
  mount();input(A,'1');fireEvent.click(screen.getByRole('button',{name:'Apply input'}));
  const field=screen.getByLabelText('A: original dividend');expect(field).toHaveValue(A);expect(field).toHaveAttribute('aria-invalid','true');
  expect(screen.getByRole('alert').id).toBe(field.getAttribute('aria-describedby'));expect(screen.queryByTestId('division-doubling')).toBeNull();
});
it('distinguishes valid zero dividend, zero divisor and full replay capacity', () => {
  mount();input('45','0');fireEvent.click(screen.getByRole('button',{name:'Apply input'}));
  expect(screen.getByLabelText('B: original divisor')).toHaveAttribute('aria-invalid','true');
  input('0','6');fireEvent.click(screen.getByRole('button',{name:'Apply input'}));
  for(const m of divisionMethods) {seek(m,player(m).getByRole('slider',{hidden:true}).getAttribute('max')!);expect(player(m).getByTestId('result')).toHaveTextContent('0');}
  input('770','3');fireEvent.click(screen.getByRole('button',{name:'Apply input'}));
  expect(screen.queryByRole('alert')).toBeNull();seek('quotient',player('quotient').getByRole('slider',{hidden:true}).getAttribute('max')!);
  expect(player('quotient').getByTestId('final-identity')).toHaveTextContent('770 = 256 × 3 + 2');
});
it('keeps draft edits separate, applies during playback and resets all four independent players', () => {
  vi.useFakeTimers();mount();
  for(const m of divisionMethods) fireEvent.click(player(m).getByRole('button',{name:'Play',hidden:true}));
  act(()=>vi.advanceTimersByTime(1100));input('47','7');
  expect(screen.getByTestId('pending-input')).toHaveTextContent('not applied');
  expect(player().getByTestId('original-input')).toHaveTextContent('A = 45 · B = 6');
  fireEvent.click(screen.getByRole('button',{name:'Apply input'}));act(()=>vi.advanceTimersByTime(2100));
  for(const m of divisionMethods) {
    expect(player(m).getByRole('slider',{hidden:true})).toHaveValue('0');expect(player(m).getByTestId('original-input')).toHaveTextContent('A = 47 · B = 7');
    seek(m,player(m).getByRole('slider',{hidden:true}).getAttribute('max')!);expect(player(m).getByTestId('result')).toHaveTextContent('5');
    const vars=player(m).getByTestId('variables').textContent;
    fireEvent.click(player(m).getByRole('button',{name:'Step Backward',hidden:true}));fireEvent.click(player(m).getByRole('button',{name:'Step Forward',hidden:true}));
    expect(player(m).getByTestId('variables').textContent).toBe(vars);
    fireEvent.click(player(m).getByRole('button',{name:'Play',hidden:true}));expect(player(m).getByRole('slider',{hidden:true})).toHaveValue('0');
    fireEvent.click(player(m).getByRole('button',{name:'Reset',hidden:true}));
  }
  fireEvent.click(player('fibonacci').getByRole('button',{name:'Play'}));act(()=>vi.advanceTimersByTime(1100));
  expect(player('doubling').getByRole('slider',{hidden:true})).toHaveValue('0');expect(player('fibonacci').getByRole('slider',{hidden:true})).toHaveValue('1');
});
it('links post-statement variables, counters, highlight and translations while reviewing and playing', () => {
  vi.useFakeTimers();mount();
  fireEvent.click(screen.getByText('Quotient and remainder together', {selector:'summary'}));
  for(const m of divisionMethods) {
    const trace=divisionTrace(45,6,m),index=trace.findIndex(s=>s.event==='deduct');seek(m,index);
    const s=trace[index];expect(root(m).querySelector('[aria-current="step"]')).toHaveAttribute('data-line',s.line);
    expect(player(m).getByTestId('variables')).toHaveTextContent('a = '+s.a);
    expect(player(m).getByTestId('counts')).toHaveTextContent(`Subtractions: ${s.counts.subtract}`);
    expect(player(m).getByTestId('explanation')).toHaveTextContent(divisionMessages[s.event][1]);
  }
  const states=divisionMethods.map(m=>player(m).getByTestId('variables').textContent);
  fireEvent.click(screen.getByRole('button',{name:'中文'}));
  divisionMethods.forEach((m,i)=>{expect(player(m).getByTestId('variables').textContent).toBe(states[i]);expect(player(m).getByTestId('explanation')).toHaveTextContent('从当前剩余量');});
  fireEvent.click(player('fibonacci').getByRole('button',{name:'上一步'}));expect(player('fibonacci').getByTestId('explanation')).toHaveTextContent('刚检查条件');
  fireEvent.click(player('fibonacci').getByRole('button',{name:'播放'}));act(()=>vi.advanceTimersByTime(1100));expect(player('fibonacci').getByTestId('explanation')).toHaveTextContent('从当前剩余量');
  fireEvent.click(player('fibonacci').getByRole('button',{name:'暂停'}));
  expect(screen.getByTestId('current-fibonacci')).toHaveTextContent('a = 15');
});
it('shows the quotient invariant only at stable updates and final bounds only at completion', () => {
  mount();fireEvent.click(screen.getByText('Quotient and remainder together',{selector:'summary'}));
  const t=divisionTrace(45,6,'quotient');
  seek('quotient',t.findIndex(s=>s.event==='half'));
  expect(player('quotient').getByTestId('invariant')).toHaveTextContent('updating');
  expect(player('quotient').queryByTestId('final-identity')).toBeNull();
  for(const [i,s] of t.entries()) if(s.checkpoint) {
    seek('quotient',i);expect(player('quotient').getByTestId('invariant')).toHaveTextContent(`45 = ${s.n} × ${s.c} + ${s.a}`);
    expect(root('quotient').querySelector('[aria-current="step"]')).toHaveAttribute('data-line',s.line);
  }
});
it('has a translated explanation and actual code line for every snapshot', () => {
  for(const m of divisionMethods) for(const s of divisionTrace(45,6,m)) {
    expect(divisionCode[s.fn].some(l=>l.id===s.line)).toBe(true);
    expect(divisionMessages[s.event].every(text=>text.length>0)).toBe(true);
  }
});

it('marks accepted original tokens as applied without changing their spelling', () => {
  mount();input('045','06');fireEvent.click(screen.getByRole('button',{name:'Apply input'}));
  expect(screen.getByLabelText('A: original dividend')).toHaveValue('045');
  expect(screen.queryByTestId('pending-input')).toBeNull();
  expect(player().getByTestId('original-input')).toHaveTextContent('A = 45 · B = 6');
});
