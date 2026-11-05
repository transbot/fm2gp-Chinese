import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import { EgyptianComparison } from './EgyptianComparison';
import { egyptianTrace, MultiplyVersion } from '../../lib/algorithms/egyptianTrace';
const versions: MultiplyVersion[] = ['multiply0', 'multiply1', 'multiply4'];
beforeEach(() => localStorage.setItem('fm2gp-language', 'en'));
afterEach(() => { cleanup(); vi.useRealTimers(); });
const mount = () => render(<MemoryRouter><LanguageProvider><EgyptianComparison /></LanguageProvider></MemoryRouter>);
const panel = (v: MultiplyVersion) => within(screen.getByTestId(v));
const seek = (v: MultiplyVersion, value: string) => fireEvent.change(panel(v).getByRole('slider'), { target: { value } });

it('resets all playing versions on applied input and supports independent replay of the new problem', () => {
  vi.useFakeTimers(); mount();
  versions.forEach(v => fireEvent.click(panel(v).getByRole('button', { name: 'Play' })));
  act(() => vi.advanceTimersByTime(1100));
  fireEvent.change(screen.getByLabelText('n: repetition count'), { target: { value: '41' } });
  fireEvent.change(screen.getByLabelText('a: value to add'), { target: { value: '59' } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply input' }));
  act(() => vi.advanceTimersByTime(2500));
  versions.forEach(v => expect(panel(v).getByRole('slider')).toHaveValue('0'));
  seek('multiply1', '3');
  expect(panel('multiply0').getByRole('slider')).toHaveValue('0');
  expect(panel('multiply4').getByRole('slider')).toHaveValue('0');
  versions.forEach(v => {
    seek(v, panel(v).getByRole('slider').getAttribute('max')!);
    expect(panel(v).getByTestId('result')).toHaveTextContent('2419');
    const counters = panel(v).getByTestId('counts').textContent;
    fireEvent.click(panel(v).getByRole('button', { name: 'Step Backward' }));
    fireEvent.click(panel(v).getByRole('button', { name: 'Step Forward' }));
    expect(panel(v).getByTestId('result')).toHaveTextContent('2419');
    expect(panel(v).getByTestId('counts').textContent).toBe(counters);
    fireEvent.click(panel(v).getByRole('button', { name: 'Play' }));
    expect(panel(v).getByRole('slider')).toHaveValue('0');
  });
  act(() => vi.advanceTimersByTime(1100));
  versions.forEach(v => expect(panel(v).getByText('n = 41, a = 59')).toBeInTheDocument());
});

it('keeps stack, variables, counters and source line through language changes and subsequent replay', () => {
  mount();
  const index = egyptianTrace(15, 7, 'multiply4').findIndex(s => s.event === 'enter' && s.fn === 'mult_acc4');
  seek('multiply4', String(index));
  const root = screen.getByTestId('multiply4');
  expect(root.querySelectorAll('[data-frame]')).toHaveLength(2);
  const frames = [...root.querySelectorAll('[data-frame]')].map(f => f.textContent);
  const numbers = panel('multiply4').getByTestId('counts').textContent?.match(/\d+/g);
  const active = root.querySelector('[aria-current="step"]')?.getAttribute('data-line');
  fireEvent.click(screen.getByRole('button', { name: '中文' }));
  expect(panel('multiply4').getByTestId('explanation')).toHaveTextContent('进入算法函数');
  expect(root.querySelectorAll('[data-frame]')).toHaveLength(2);
  expect(panel('multiply4').getByTestId('counts').textContent?.match(/\d+/g)).toEqual(numbers);
  expect(root.querySelector('[aria-current="step"]')?.getAttribute('data-line')).toBe(active);
  expect(panel('multiply4').getByTestId('variables')).toHaveTextContent('n = 7 · a = 14 · r = 7');
  seek('multiply4', String(index - 1));
  expect(panel('multiply4').getByTestId('explanation')).toHaveTextContent('计算调用参数');
  expect(root.querySelectorAll('[data-frame]')).toHaveLength(1);
  seek('multiply4', String(index + 1));
  expect(panel('multiply4').getByTestId('explanation')).toHaveTextContent('检查当前条件');
  fireEvent.click(screen.getByRole('button', { name: 'English' }));
  seek('multiply4', String(index));
  expect([...root.querySelectorAll('[data-frame]')].map(f => f.textContent)).toEqual(frames);
});

it('handles wrapper zero, signed counts, maximum replay capacity and distinct invalid input', () => {
  mount();
  fireEvent.click(screen.getByRole('button', { name: '0 × 7' }));
  versions.forEach(v => {
    seek(v, panel(v).getByRole('slider').getAttribute('max')!);
    expect(panel(v).getByTestId('result')).toHaveTextContent('0');
    expect(panel(v).getByTestId('counts')).toHaveTextContent('Data additions: 0');
    expect(panel(v).getByTestId('counts')).toHaveTextContent('Peak: 0');
  });
  fireEvent.click(screen.getByRole('button', { name: '-15 × 7' }));
  expect(screen.getByTestId('summary-multiply4')).toHaveTextContent('-105');
  fireEvent.change(screen.getByLabelText('n: repetition count'), { target: { value: '256' } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply input' }));
  seek('multiply0', panel('multiply0').getByRole('slider').getAttribute('max')!);
  expect(panel('multiply0').getByTestId('result')).toHaveTextContent('1792');
  fireEvent.change(screen.getByLabelText('n: repetition count'), { target: { value: '257' } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply input' }));
  expect(screen.getByRole('alert')).toHaveTextContent('−256 to 256');
  expect(screen.queryByTestId('multiply0')).toBeNull();
  fireEvent.change(screen.getByLabelText('n: repetition count'), { target: { value: '1.5' } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply input' }));
  expect(screen.getByRole('alert')).toHaveTextContent('must be integers');
});
