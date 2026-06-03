import { describe, expect, it } from 'vitest';
import { twoSumVisualization } from './two_sum';

describe('twoSumVisualization', () => {
  it('finds two indices whose values add to the target', () => {
    const steps = twoSumVisualization.generateSteps({ array: [2, 7, 11, 15], target: 9 });
    const finalStep = steps[steps.length - 1];
    const operations = steps.map((step) => step.operation);

    expect(finalStep.operation).toBe('found');
    expect(finalStep.state.result).toEqual([0, 1]);
    expect(finalStep.state.currentIndex).toBe(1);
    expect(operations).toContain('check_complement');
    expect(operations).toContain('store_value');
  });

  it('records a not-found result when no pair exists', () => {
    const steps = twoSumVisualization.generateSteps({ array: [1, 2, 3], target: 10 });
    const finalStep = steps[steps.length - 1];

    expect(finalStep.operation).toBe('not_found');
    expect(finalStep.state.result).toBeNull();
  });

  it('is an extension algorithm without a book section reference', () => {
    expect(twoSumVisualization.section).toBeUndefined();
  });

  it('rejects arrays with fewer than two values', () => {
    expect(twoSumVisualization.validateInput({ array: [1], target: 2 })).toEqual({
      valid: false,
      error: 'Array must contain at least two values',
      errorKey: 'twoSumTooSmall',
    });
  });
});
