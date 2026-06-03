import { describe, expect, it } from 'vitest';
import { prefixSumVisualization } from './prefix_sum';

describe('prefixSumVisualization', () => {
  it('builds prefix sums and answers an inclusive range query', () => {
    const steps = prefixSumVisualization.generateSteps({
      array: [3, -2, 5, 1, 6],
      left: 1,
      right: 3,
    });
    const finalStep = steps[steps.length - 1];
    const operations = steps.map((step) => step.operation);

    expect(finalStep.operation).toBe('complete');
    expect(finalStep.state.prefix).toEqual([0, 3, 1, 6, 7, 13]);
    expect(finalStep.state.queryResult).toBe(4);
    expect(operations).toContain('build_prefix');
    expect(operations).toContain('answer_query');
  });

  it('is an extension algorithm without a book section reference', () => {
    expect(prefixSumVisualization.section).toBeUndefined();
  });

  it('rejects invalid query ranges', () => {
    expect(prefixSumVisualization.validateInput({
      array: [1, 2, 3],
      left: 2,
      right: 1,
    })).toEqual({
      valid: false,
      error: 'Range must satisfy 0 <= left <= right < array length',
      errorKey: 'prefixSumInvalidRange',
    });
  });

  it('reports preprocessing and query complexity', () => {
    expect(prefixSumVisualization.getComplexity()).toMatchObject({
      time: 'Build O(n), query O(1)',
      space: 'O(n)',
    });
  });
});
