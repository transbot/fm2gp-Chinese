import { describe, expect, it } from 'vitest';
import { selectionSortVisualization } from './selection_sort';

describe('selectionSortVisualization', () => {
  it('sorts mixed values and records minimum-selection passes', () => {
    const steps = selectionSortVisualization.generateSteps({ array: [64, 25, 12, 22, 11] });
    const finalStep = steps[steps.length - 1];
    const operations = steps.map((step) => step.operation);

    expect(finalStep.operation).toBe('complete');
    expect(finalStep.state.array).toEqual([11, 12, 22, 25, 64]);
    expect(finalStep.state.sortedUntil).toBe(4);
    expect(operations).toContain('select_minimum');
    expect(operations).toContain('compare');
    expect(operations).toContain('swap');
  });

  it('is an extension algorithm without a book section reference', () => {
    expect(selectionSortVisualization.section).toBeUndefined();
  });

  it('rejects empty input arrays', () => {
    expect(selectionSortVisualization.validateInput({ array: [] })).toEqual({
      valid: false,
      error: 'Array must not be empty',
      errorKey: 'selectionSortEmptyArray',
    });
  });

  it('reports beginner-appropriate complexity', () => {
    expect(selectionSortVisualization.getComplexity()).toMatchObject({
      time: 'O(n^2)',
      space: 'O(1)',
    });
  });
});
