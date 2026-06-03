import { describe, expect, it } from 'vitest';
import { sieveVisualization } from './sieve';

describe('sieveVisualization', () => {
  it('generates complete steps and counts primes up to 30', () => {
    const steps = sieveVisualization.generateSteps({ maxNumber: 30 });
    const finalStep = steps[steps.length - 1];

    expect(finalStep?.operation).toBe('complete');
    expect(finalStep?.state.isComplete).toBe(true);
    expect(finalStep?.state.primeCount).toBe(10);
  });

  it('uses the book section for the Sieve of Eratosthenes', () => {
    expect(sieveVisualization.section).toBe('3.2-3.3');
  });
});
