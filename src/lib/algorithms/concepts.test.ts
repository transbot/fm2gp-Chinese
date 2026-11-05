import { describe, it, expect } from 'vitest';
import { matrixProduct, powerTrace, identity, closure, FRIENDS, moveIterator, rangeValues } from './concepts';
describe('book concepts', () => {
    it('uses the same power trace with different associative operations', () => {
        expect(powerTrace(3, 5, (a, b) => a + b, 0).slice(-1)[0]?.result).toBe(15);
        expect(powerTrace(3, 0, (a, b) => a + b, 0).slice(-1)[0]?.result).toBe(0);
        expect(powerTrace(3, 5, (a, b) => a * b, 1).slice(-1)[0]?.result).toBe(243);
        expect(powerTrace(0, 0, (a, b) => a * b, 1).slice(-1)[0]?.result).toBe(1);
        const q = [[1, 1], [1, 0]];
        const trace = powerTrace(q, 5, matrixProduct, identity(2));
        expect(trace.slice(-1)[0]?.result).toEqual([[8, 5], [5, 3]]);
        expect(powerTrace(q, 0, matrixProduct, identity(2)).slice(-1)[0]?.result).toEqual(identity(2));
        const saved = structuredClone(trace);
        trace.slice(-1)[0]!.result![0][0] = 99;
        expect(trace[0]).toEqual(saved[0]);
        expect(() => powerTrace(2, -1, (a, b) => a * b, 1)).toThrow();
        expect(() => powerTrace(2, 1.2, (a, b) => a * b, 1)).toThrow();
    });
    it('preserves multiplication order and rejects invalid dimensions and unsafe arithmetic', () => {
        const a = [[1, 2], [3, 4]], b = [[5, 6], [7, 8]];
        expect(matrixProduct(a, b)).toEqual([[19, 22], [43, 50]]);
        expect(matrixProduct(b, a)).toEqual([[23, 34], [31, 46]]);
        expect(() => matrixProduct([[1, 2]], [[1, 2]])).toThrow();
        expect(() => matrixProduct([[Number.MAX_SAFE_INTEGER]], [[2]])).toThrow();
    });
    it('keeps the invariant at every complete checkpoint and counts actual operations', () => {
        const numberSteps = powerTrace(3, 5, (a, b) => a * b, 1);
        numberSteps.forEach(s => expect((s.result ?? 1) * s.base ** s.remaining).toBe(243));
        const addSteps = powerTrace(3, 5, (a, b) => a + b, 0);
        addSteps.forEach(s => expect((s.result ?? 0) + s.base * s.remaining).toBe(15));
        const q = [[1, 1], [1, 0]], matrixSteps = powerTrace(q, 5, matrixProduct, identity(2));
        matrixSteps.forEach(s => {
            let tail = identity(2);
            for (let i = 0; i < s.remaining; i++)
                tail = matrixProduct(tail, s.base);
            expect(matrixProduct(s.result ?? identity(2), tail)).toEqual([[8, 5], [5, 3]]);
        });
        expect(numberSteps.slice(-1)[0].multiplications).toBe(3);
        expect(powerTrace(3, 1, (a, b) => a * b, 1).slice(-1)[0].multiplications).toBe(0);
    });
    it('computes reflexive reachability, checked independently by traversal', () => {
        const chain = [[0, 1, 0], [0, 0, 1], [0, 0, 0]];
        expect(closure(chain, 1)[0]).toEqual([1, 1, 0]);
        expect(closure(chain, 2)).toEqual([[1, 1, 1], [0, 1, 1], [0, 0, 1]]);
        expect(closure([[0, 0], [0, 0]], 1)).toEqual(identity(2));
        const result = closure(FRIENDS, FRIENDS.length - 1);
        FRIENDS.forEach((_, from) => {
            const visited = new Set([from]), pending = [from];
            while (pending.length) {
                const i = pending.pop()!;
                FRIENDS[i].forEach((edge, j) => { if (edge && !visited.has(j)) {
                    visited.add(j);
                    pending.push(j);
                } });
            }
            expect(result[from]).toEqual(FRIENDS.map((_, i) => Number(visited.has(i))));
        });
    });
    it('distinguishes range bounds, end and iterator capabilities', () => {
        expect(rangeValues([10, 20, 30], 0, 3)).toEqual([10, 20, 30]);
        expect(rangeValues([10, 20, 30], 1, 1)).toEqual([]);
        expect(rangeValues([10, 20, 30], 1, 2)).toEqual([20]);
        expect(moveIterator('forward', 0, 3, 3)).toEqual({ position: 3, cost: 3 });
        expect(moveIterator('random', 0, 3, 3)).toEqual({ position: 3, cost: 1 });
        expect(moveIterator('bidirectional', 3, -1, 3).position).toBe(2);
        expect(() => moveIterator('forward', 2, -1, 3)).toThrow();
        expect(() => moveIterator('random', 3, 1, 3)).toThrow();
    });
});
