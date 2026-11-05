import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderAlgorithm } from '../test/renderAlgorithm';
import { BinarySearch } from './BinarySearch';

describe('binary search input through the rendered page', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    let index = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => [0, 2 / 99, 4 / 99][index++ % 3]);
  });
  afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });

  async function sortedThree() {
    renderAlgorithm(<BinarySearch />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Auto-Sort array' }));
    await act(async () => { await vi.runAllTimersAsync(); });
  }

  it('searches for numeric zero in [1,3,5] and displays both boundaries as zero', async () => {
    await sortedThree();
    const input = screen.getByLabelText(/Target Value/);
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Start Search' }));
    await act(async () => { await vi.runAllTimersAsync(); });
    expect(input).toHaveDisplayValue('0');
    expect(screen.getByText('∀k ∈ [0, 0) : vₖ < 0')).toBeInTheDocument();
    expect(screen.getByText('∀k ∈ [0, 0) : vₖ = 0')).toBeInTheDocument();
    expect(screen.getByText('∀k ∈ [0, 3) : vₖ > 0')).toBeInTheDocument();
  });

  it.each(['', 'abc', '12oops', 'Infinity'])('rejects input %j without starting a search', async (value) => {
    await sortedThree();
    fireEvent.change(screen.getByLabelText(/Target Value/), { target: { value } });
    fireEvent.click(screen.getByRole('button', { name: 'Start Search' }));
    expect(screen.getByRole('alert')).toHaveTextContent(value ? 'Enter a finite number' : 'Enter a target value');
  });
});
