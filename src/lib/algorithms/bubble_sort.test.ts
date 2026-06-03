import { describe, expect, it } from 'vitest';
import { bubbleSortVisualization } from './bubble_sort';

describe('bubbleSortVisualization', () => {
  it('sorts values through adjacent comparisons and swaps', () => {
    const steps = bubbleSortVisualization.generateSteps({ array: [5, 1, 4, 2, 8] });
    const finalStep = steps[steps.length - 1];
    const operations = steps.map((step) => step.operation);

    expect(finalStep.operation).toBe('complete');
    expect(finalStep.state.array).toEqual([1, 2, 4, 5, 8]);
    expect(finalStep.state.sortedFrom).toBe(0);
    expect(operations).toContain('compare');
    expect(operations).toContain('swap');
    expect(operations).toContain('pass_complete');
  });

  it('is an extension algorithm without a book section reference', () => {
    expect(bubbleSortVisualization.section).toBeUndefined();
  });

  it('rejects empty input arrays', () => {
    expect(bubbleSortVisualization.validateInput({ array: [] })).toEqual({
      valid: false,
      error: 'Array must not be empty',
      errorKey: 'bubbleSortEmptyArray',
    });
  });

  it('reports beginner-appropriate complexity', () => {
    expect(bubbleSortVisualization.getComplexity()).toMatchObject({
      time: 'O(n^2)',
      space: 'O(1)',
    });
  });
});
