import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderAlgorithm } from '../test/renderAlgorithm';
import { PiUpperBound } from './PiUpperBound';

describe('unit circle bounds', () => {
  it('shows both hexagon bounds and explains the geometry in both languages', () => {
    renderAlgorithm(<PiUpperBound />);
    expect(screen.getByRole('slider')).toHaveValue('6');
    expect(screen.getByText('n sin(π/n) = 3.000000')).toBeInTheDocument();
    expect(screen.getByText('n tan(π/n) = 3.464102')).toBeInTheDocument();
    expect(screen.getByText('3 < π < 2√3 ≈ 3.464102')).toBeInTheDocument();
    expect(screen.getByText(/Inscribed polygon: lower bound/)).toBeInTheDocument();
    expect(screen.getByText(/Circumscribed polygon: upper bound/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '中文' }));
    expect(screen.getByText(/内接正多边形的周长小于单位圆周长/)).toBeInTheDocument();
    expect(screen.getByText(/外切正多边形：上界/)).toBeInTheDocument();
  });

  it.each([3, 500])('keeps correct numeric bounds at n=%i', (n) => {
    renderAlgorithm(<PiUpperBound />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: String(n) } });
    expect(screen.getByText(`n sin(π/n) = ${(n * Math.sin(Math.PI / n)).toFixed(6)}`)).toBeInTheDocument();
    expect(screen.getByText(`n tan(π/n) = ${(n * Math.tan(Math.PI / n)).toFixed(6)}`)).toBeInTheDocument();
  });
});
