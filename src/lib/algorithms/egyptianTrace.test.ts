import { expect, it } from 'vitest';
import { egyptianTrace, parseEgyptianInput } from './egyptianTrace';
const end = <T,>(s: T[]) => s[s.length - 1];
const versions = ['multiply0', 'multiply1', 'multiply4'] as const;

it.each([[15, 7, 14, 6, 6], [16, 7, 15, 4, 4], [41, 59, 40, 7, 7], [1, 19, 0, 0, 0]])('counts original data additions for %i × %i', (n, a, ...counts) => {
  versions.forEach((v, i) => {
    const steps = egyptianTrace(n, a, v);
    expect(end(steps)).toMatchObject({ result: n * a, additions: counts[i], frames: [] });
    expect(end(steps).peak).toBe(v === 'multiply0' ? n : v === 'multiply1' ? Math.floor(Math.log2(n)) + 1 : (n & (n - 1)) === 0 ? 1 : 2);
  });
});
it('updates helper entry/exit frames synchronously and never counts odd/half or the wrapper', () => {
  const steps = egyptianTrace(15, 7, 'multiply4');
  const enter = steps.find(s => s.event === 'enter' && s.fn === 'mult_acc4')!;
  expect(enter.frames.map(f => f.fn)).toEqual(['multiply4', 'mult_acc4']);
  expect(enter.peak).toBe(2);
  const exit = steps.find(s => s.event === 'exit' && s.fn === 'mult_acc4')!;
  expect(exit.frames.map(f => f.fn)).toEqual(['multiply4']);
  expect(exit.returned).toBe(105);
  expect(egyptianTrace(16, 7, 'multiply4').some(s => s.fn === 'mult_acc4')).toBe(false);
});
it('doubles on descent but adds odd values after restoring the caller on return', () => {
  const steps = egyptianTrace(15, 7, 'multiply1');
  const arguments_ = steps.filter(s => s.event === 'argument');
  expect(arguments_.map(s => end(s.frames).n)).toEqual([15, 7, 3]);
  const additions = steps.filter(s => s.event === 'add');
  expect(additions.map(s => [end(s.frames).n, end(s.frames).a])).toEqual([[3, 28], [7, 14], [15, 7]]);
  expect(additions.map(s => end(s.frames).result)).toEqual([84, 98, 105]);
  expect(steps[1].frames).toEqual([]);
});
it('normalizes only in the wrapper and accepts zero data values', () => {
  for (const v of versions) {
    expect(end(egyptianTrace(0, 7, v))).toMatchObject({ result: 0, additions: 0, peak: 0 });
    expect(end(egyptianTrace(-15, 7, v)).result).toBe(-105);
    expect(end(egyptianTrace(-15, -7, v)).result).toBe(105);
    expect(end(egyptianTrace(15, 0, v)).result).toBe(0);
  }
  expect(parseEgyptianInput('0', '0')).toEqual({ n: 0, a: 0 });
  for (const [n, a] of [['', '2'], ['1.5', '2'], ['257', '2'], ['-257', '2'], ['2', '1000001'], ['x', '2']]) expect(() => parseEgyptianInput(n, a)).toThrow();
});
it('matches exact arithmetic, count formula and capacity boundary across independent inputs', () => {
  for (const n of [2, 3, 4, 5, 31, 63, 128, 255, 256]) for (const a of [-1000000, 0, 1000000]) for (const v of versions) {
    const steps = egyptianTrace(n, a, v), final = end(steps);
    const bits = n.toString(2);
    expect(final.result).toBe(Number(BigInt(n) * BigInt(a)));
    expect(final.additions).toBe(v === 'multiply0' ? n - 1 : bits.length - 1 + [...bits].filter(b => b === '1').length - 1);
    expect(steps.every(s => s.frames.length <= s.peak && s.frames.every(f => Number.isSafeInteger(f.a)))).toBe(true);
  }
});
