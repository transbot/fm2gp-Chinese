import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import { Horner } from './Horner';

beforeEach(() => { localStorage.setItem('fm2gp-language', 'en'); });
afterEach(() => { cleanup(); vi.useRealTimers(); });
const mount = () => render(<MemoryRouter><LanguageProvider><Horner /></LanguageProvider></MemoryRouter>);
const panel = () => within(screen.getByTestId('polynomial-horner'));
const seek = (value: string) => fireEvent.change(panel().getByRole('slider'), { target: { value } });

it.each(['[1.00000000000000001,2]', '[1e-400,2]'])('rejects the original fractional coefficient through real inputs: %s', raw => {
  mount();
  fireEvent.change(screen.getByLabelText('Coefficients (descending powers)'), { target: { value: raw } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply input' }));
  expect(screen.getByRole('alert')).toHaveTextContent('integer');
  expect(screen.queryByTestId('polynomial-horner')).toBeNull();
});

it('restores the exact term, exponent, count and highlight on overflow review and autoplay replay', () => {
  vi.useFakeTimers(); mount();
  fireEvent.change(screen.getByLabelText('Coefficients (descending powers)'), { target: { value: '[1,0,0,0]' } });
  fireEvent.change(screen.getByLabelText('x'), { target: { value: '1000000' } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply input' }));
  const root = screen.getByTestId('polynomial-direct'), p = within(root);
  const progress = p.getByRole('slider');
  fireEvent.change(progress, { target: { value: progress.getAttribute('max') } });
  const check = () => {
    expect(p.getByTestId('variables')).toHaveTextContent('term = 1000000000000 · k = 2');
    expect(p.getByTestId('current-expression')).toHaveTextContent('(1) · x^2');
    expect(p.getByTestId('counts')).toHaveTextContent('Multiplications: 2 · Additions: 0');
    expect(root.querySelector('[aria-current="step"]')).toHaveAttribute('data-line', 'multiply');
  };
  check(); expect(p.getByRole('alert')).toHaveTextContent('safe-integer');
  fireEvent.click(p.getByRole('button', { name: 'Step Backward' })); check(); expect(p.queryByRole('alert')).toBeNull();
  fireEvent.click(p.getByRole('button', { name: 'Step Forward' })); check();
  fireEvent.click(p.getByRole('button', { name: 'Play' }));
  for (let i = 0; i < 4; i++) act(() => vi.advanceTimersByTime(1100));
  check(); expect(p.getByRole('alert')).toHaveTextContent('safe-integer');
});

it('applies new input during playback and replays only the new immutable trace', () => {
  vi.useFakeTimers(); mount();
  fireEvent.click(panel().getByRole('button', { name: 'Play' }));
  act(() => vi.advanceTimersByTime(1100));
  fireEvent.change(screen.getByLabelText('Coefficients (descending powers)'), { target: { value: '[2,0,4,5]' } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply input' }));
  expect(panel().getByRole('slider')).toHaveValue('0');
  act(() => vi.advanceTimersByTime(2500));
  expect(panel().getByRole('slider')).toHaveValue('0');
  seek(panel().getByRole('slider').getAttribute('max')!);
  expect(panel().getByTestId('sum')).toHaveTextContent('29');
  expect(panel().getByTestId('accumulations')).toHaveTextContent('2 → 4 → 12 → 29');
  const state = panel().getByTestId('variables').textContent;
  fireEvent.click(panel().getByRole('button', { name: 'Step Backward' }));
  fireEvent.click(panel().getByRole('button', { name: 'Step Forward' }));
  expect(panel().getByTestId('variables').textContent).toBe(state);
  fireEvent.click(panel().getByRole('button', { name: 'Play' }));
  expect(panel().getByRole('slider')).toHaveValue('0');
  act(() => vi.advanceTimersByTime(1100));
  expect(panel().getByTestId('sum')).toHaveTextContent('2');
});

it('switches language at a multiplication checkpoint without changing variables, count or highlighted code', () => {
  vi.useFakeTimers(); mount(); seek('3');
  const root = screen.getByTestId('polynomial-horner');
  const variables = panel().getByTestId('variables').textContent;
  const activeLine = root.querySelector('[aria-current="step"]')?.getAttribute('data-line');
  expect(activeLine).toBe('multiply');
  expect(panel().getByTestId('counts')).toHaveTextContent('Multiplications: 1 · Additions: 0');
  fireEvent.click(screen.getByRole('button', { name: '中文' }));
  expect(panel().getByTestId('variables').textContent).toBe(variables);
  expect(root.querySelector('[aria-current="step"]')?.getAttribute('data-line')).toBe(activeLine);
  expect(panel().getByTestId('explanation')).toHaveTextContent('执行乘法');
  expect(panel().getByTestId('counts')).toHaveTextContent('乘法: 1 · 加法: 0');
  seek('2'); expect(panel().getByTestId('explanation')).toHaveTextContent('移到下一个系数');
  seek('4'); expect(panel().getByTestId('explanation')).toHaveTextContent('加上当前系数');
  fireEvent.click(panel().getByRole('button', { name: '播放' }));
  act(() => vi.advanceTimersByTime(1100));
  fireEvent.click(panel().getByRole('button', { name: '暂停' }));
  expect(panel().getByTestId('explanation')).toHaveTextContent('移到下一个系数');
  fireEvent.click(screen.getByRole('button', { name: 'English' }));
  expect(panel().getByTestId('explanation')).toHaveTextContent('Move to the next coefficient');
  seek('4');
  expect(panel().getByTestId('explanation')).toHaveTextContent('Add the current coefficient');
});

it('preserves leading zero operations and distinguishes blank input from an explicit empty sequence', () => {
  mount(); fireEvent.click(screen.getByRole('button', { name: '[0,2,3]' }));
  seek(panel().getByRole('slider').getAttribute('max')!);
  expect(panel().getByTestId('counts')).toHaveTextContent('Multiplications: 2 · Additions: 2');
  expect(panel().getByTestId('accumulations')).toHaveTextContent('0 → 2 → 7');
  fireEvent.change(screen.getByLabelText('Coefficients (descending powers)'), { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply input' }));
  expect(screen.getByRole('alert')).toHaveTextContent('blank is not zero');
  expect(screen.queryByTestId('polynomial-horner')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Empty sequence []' }));
  seek('1'); expect(panel().getByTestId('sum')).toHaveTextContent('0');
});
