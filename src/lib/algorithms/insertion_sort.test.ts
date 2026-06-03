import { describe, expect, it } from 'vitest';
import { insertionSortVisualization } from './insertion_sort';

describe('insertionSortVisualization', () => {
  it('sorts mixed values and records shifting work', () => {
    const steps = insertionSortVisualization.generateSteps({ array: [5, 2, 4, 6, 1, 3] });
    const finalStep = steps[steps.length - 1];

    expect(finalStep.operation).toBe('complete');
    expect(finalStep.state.array).toEqual([1, 2, 3, 4, 5, 6]);
    expect(finalStep.state.sortedEnd).toBe(5);
    expect(steps.some((step) => step.operation === 'shift')).toBe(true);
    expect(steps.some((step) => step.operation === 'insert')).toBe(true);
  });

  it('is an extension algorithm without a book section reference', () => {
    expect(insertionSortVisualization.section).toBeUndefined();
  });

  it('rejects empty input arrays', () => {
    expect(insertionSortVisualization.validateInput({ array: [] })).toEqual({
      valid: false,
      error: 'Array must not be empty',
      errorKey: 'insertionSortEmptyArray',
    });
  });

  it('reports beginner-appropriate complexity', () => {
    expect(insertionSortVisualization.getComplexity()).toMatchObject({
      time: 'O(n^2)',
      space: 'O(1)',
    });
  });
});
