import { describe, expect, it } from 'vitest';
import { buildPrimeCountingSeries } from './prime_counting';

describe('buildPrimeCountingSeries', () => {
  it('builds exact small counts and PNT approximation points', () => {
    const result = buildPrimeCountingSeries({ maxN: 20, samples: 10 });

    expect(result.points.at(-1)).toEqual([20, 8]);
    expect(result.approxPoints.at(-1)?.[0]).toBe(20);
    expect(result.maxX).toBe(20);
    expect(result.maxY).toBeGreaterThanOrEqual(8);
  });

  it('rejects invalid maximum values', () => {
    expect(() => buildPrimeCountingSeries({ maxN: 1, samples: 10 })).toThrow(
      'maxN must be at least 2'
    );
  });
});
