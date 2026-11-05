import { describe, expect, it } from 'vitest';
import { polynomialTrace, parsePolynomialInput } from './polynomial';

const last = <T,>(items: T[]) => items[items.length - 1];

describe('source-order polynomial traces', () => {
  it.each(['[1.00000000000000001,2]', '[1e-400,2]', '[1e2,2]', '[1.0,2]'])('rejects non-integer source tokens before Number conversion: %s', raw => {
    expect(() => parsePolynomialInput(raw, '2')).toThrow('format');
  });
  it('keeps the successful term exponent when the next direct multiplication overflows', () => {
    const steps = polynomialTrace([1, 0, 0, 0], 1000000, 'direct');
    expect(last(steps)).toMatchObject({ event: 'overflow', term: 1000000000000, power: 2, multiplications: 2, additions: 0 });
    expect(last(steps).failure).toBe('1000000000000 × (1000000) = 1000000000000000000');
    for (const s of steps.filter(s => s.index === 0)) if (s.term !== null) expect(BigInt(s.term)).toBe(1000000n ** BigInt(s.power));
  });
  it.each([
    [[2, 3, 4, 5], [2, 7, 18, 41]],
    [[2, 0, 4, 5], [2, 4, 12, 29]],
    [[0, 2, 3], [0, 2, 7]],
    [[4, 7, -1, 27, -3], [4, 15, 29, 85, 167]],
  ])('preserves every coefficient position: %j', (coefficients, sums) => {
    const steps = polynomialTrace(coefficients, 2, 'horner');
    expect(steps.filter(s => s.event === 'seed' || s.event === 'add').map(s => s.sum)).toEqual(sums);
    expect(last(steps)).toMatchObject({ sum: last(sums), multiplications: coefficients.length - 1, additions: coefficients.length - 1 });
    steps.forEach((s, i) => {
      if (s.event === 'multiply') {
        expect(s.sum).toBe(steps[i - 1].sum! * 2);
        expect(s.multiplications).toBe(steps[i - 1].multiplications + 1);
        expect(s.additions).toBe(steps[i - 1].additions);
        expect(s.line).toBe('multiply');
      }
    });
  });
  it('counts the specified direct baseline, including zero terms', () => {
    for (const a of [[2, 3, 4, 5], [0, 0, 4, 5]]) {
      const steps = polynomialTrace(a, 2, 'direct');
      expect(last(steps)).toMatchObject({ multiplications: 6, additions: 3 });
      expect(last(steps)?.sum).toBe(a.reduce((r, c) => r * 2 + c, 0));
    }
  });
  it('handles empty, constant, zero input and negative coefficients', () => {
    for (const mode of ['horner', 'direct'] as const) {
      expect(last(polynomialTrace([], 2, mode))).toMatchObject({ sum: 0, additions: 0, multiplications: 0 });
      expect(last(polynomialTrace([7], 2, mode))).toMatchObject({ sum: 7, additions: 0, multiplications: 0 });
      expect(last(polynomialTrace([4, -2, 5], 0, mode))?.sum).toBe(5);
      expect(last(polynomialTrace(Array(33).fill(0), 2, mode))?.sum).toBe(0);
    }
  });
  it('stops at the actual overflowing operation even if later cancellation makes the exact result small', () => {
    // At x=1,000,000 this polynomial is -1; multiplication overflows before cancellation.
    const steps = polynomialTrace([1, -1000000, 0, 0, -1], 1000000, 'direct');
    const end = last(steps)!;
    expect(end.event).toBe('overflow');
    expect(end.line).toBe('multiply');
    expect(end.failure).toBeTruthy();
    expect(steps.every(s => s.sum === null || Number.isSafeInteger(s.sum))).toBe(true);
    expect(last(polynomialTrace([1000000, 0, 0], 1000000, 'horner'))?.event).toBe('overflow');
  });
  it('validates capacity, integer tokens, missing input and explicit empty sequences', () => {
    expect(parsePolynomialInput('[2,0,4,5]', '2')).toEqual({ coefficients: [2, 0, 4, 5], x: 2 });
    expect(parsePolynomialInput('[]', '0').coefficients).toEqual([]);
    for (const [a, x] of [['', '2'], ['[1,]', '2'], ['[1.5]', '2'], ['[1]', ''], ['[1]', '1.2'], ['[1000001]', '2'], [JSON.stringify(Array(34).fill(1)), '2']]) {
      expect(() => parsePolynomialInput(a, x)).toThrow();
    }
  });
  it('matches an independent exact polynomial oracle across signs and zero coefficients', () => {
    for (let x = -3; x <= 3; x++) for (let c = -2; c <= 2; c++) {
      const a = [c, 0, -2, 5];
      const expected = a.reduce((sum, v, i) => sum + BigInt(v) * BigInt(x) ** BigInt(a.length - 1 - i), 0n);
      for (const mode of ['horner', 'direct'] as const) expect(last(polynomialTrace(a, x, mode))?.sum).toBe(Number(expected));
    }
  });
});
