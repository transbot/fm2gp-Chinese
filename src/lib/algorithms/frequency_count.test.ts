import { describe, expect, it } from 'vitest';
import { frequencyCountVisualization } from './frequency_count';

describe('frequencyCountVisualization', () => {
  it('counts occurrences and reports the target frequency', () => {
    const steps = frequencyCountVisualization.generateSteps({
      values: ['apple', 'banana', 'apple', 'pear', 'banana', 'apple'],
      target: 'apple',
    });
    const finalStep = steps[steps.length - 1];
    const operations = steps.map((step) => step.operation);

    expect(finalStep.operation).toBe('complete');
    expect(finalStep.state.counts).toEqual({
      apple: 3,
      banana: 2,
      pear: 1,
    });
    expect(finalStep.state.targetCount).toBe(3);
    expect(operations).toContain('read_value');
    expect(operations).toContain('increment_count');
  });

  it('is an extension algorithm without a book section reference', () => {
    expect(frequencyCountVisualization.section).toBeUndefined();
  });

  it('rejects empty value lists', () => {
    expect(frequencyCountVisualization.validateInput({ values: [], target: 'x' })).toEqual({
      valid: false,
      error: 'Values must not be empty',
      errorKey: 'frequencyCountEmptyValues',
    });
  });

  it('reports linear counting complexity', () => {
    expect(frequencyCountVisualization.getComplexity()).toMatchObject({
      time: 'O(n)',
      space: 'O(k)',
    });
  });
});
