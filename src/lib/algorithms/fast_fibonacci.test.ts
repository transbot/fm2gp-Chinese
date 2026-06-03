import { describe, expect, it } from 'vitest';
import { fastFibonacciVisualization } from './fast_fibonacci';

const finalResultFor = (n: number) => {
  const steps = fastFibonacciVisualization.generateSteps({ n });
  return steps[steps.length - 1]?.state.result;
};

describe('fastFibonacciVisualization', () => {
  it.each([
    [0, 0n],
    [1, 1n],
    [2, 1n],
    [3, 2n],
    [4, 3n],
    [10, 55n],
  ])('computes F(%i)', (n, expected) => {
    expect(finalResultFor(n)).toBe(expected);
  });

  it('uses the book section for fast Fibonacci', () => {
    expect(fastFibonacciVisualization.section).toBe('7.7');
    expect(fastFibonacciVisualization.isAdvanced).toBeUndefined();
  });
});
