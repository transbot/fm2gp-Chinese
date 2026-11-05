export type Matrix = number[][];
export function exact(n: number): number {
    if (!Number.isSafeInteger(n))
        throw new RangeError('range');
    return n;
}
export const identity = (n: number): Matrix => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => Number(i === j)));
export function matrixProduct(a: Matrix, b: Matrix, boolean = false): Matrix {
    if (!a.length || !b.length || !a[0].length || !b[0].length || a.some(r => r.length !== a[0].length) || b.some(r => r.length !== b[0].length) || a[0].length !== b.length)
        throw new RangeError('dimensions');
    a.flat().forEach(exact);
    b.flat().forEach(exact);
    return a.map(row => b[0].map((_, j) => row.reduce((sum, v, k) => boolean ? Number(Boolean(sum || (v && b[k][j]))) : exact(sum + exact(v * b[k][j])), 0)));
}
export interface PowerSnapshot<T> {
    base: T;
    remaining: number;
    result: T | null;
    action: 'init' | 'square' | 'accumulate' | 'done' | 'identity';
    multiplications: number;
}
/** Positive powers start with an actual element, not an assumed identity. Each
 * checkpoint satisfies result op base^remaining = original^exponent, omitting
 * the result factor until an actual element has been accumulated. */
export function powerTrace<T>(a: T, n: number, op: (a: T, b: T) => T, unit: T): PowerSnapshot<T>[] {
    if (!Number.isInteger(n) || n < 0 || n > 1024)
        throw new RangeError('exponent');
    let base = structuredClone(a), remaining = n, result: T | null = null, multiplications = 0;
    const steps: PowerSnapshot<T>[] = [];
    const save = (action: PowerSnapshot<T>['action']) => steps.push(structuredClone({ base, remaining, result, action, multiplications }));
    if (!n) {
        result = structuredClone(unit);
        save('identity');
        return steps;
    }
    save('init');
    while (remaining > 0) {
        if (remaining % 2) {
            result = result === null ? structuredClone(base) : op(result, base);
            if (steps.some(s => s.result !== null))
                multiplications++;
            remaining--;
            save('accumulate');
        }
        if (!remaining)
            break;
        base = op(base, base);
        multiplications++;
        remaining /= 2;
        save('square');
    }
    save('done');
    return steps;
}
export const FRIEND_NAMES = { zh: ['林宇', '柳雅', '陈轩', '何琳', '周悦', '叶萱', '苏逸'], en: ['Lin Yu', 'Liu Ya', 'Chen Xuan', 'He Lin', 'Zhou Yue', 'Ye Xuan', 'Su Yi'] };
// PDF p.167; adjacency agrees with solutions/8_7.cpp (which spells 林宇 as 林字).
export const FRIENDS: Matrix = [[1, 1, 0, 1, 0, 0, 0], [1, 1, 0, 0, 0, 1, 0], [0, 0, 1, 1, 0, 0, 0], [1, 0, 1, 1, 0, 1, 0], [0, 0, 0, 0, 1, 0, 1], [0, 1, 0, 1, 0, 1, 0], [0, 0, 0, 0, 1, 0, 1]];
export function closure(a: Matrix, k: number): Matrix {
    const m = a.map((row, i) => row.map((v, j) => Number(Boolean(v) || i === j)));
    const steps = powerTrace(m, k, (a, b) => matrixProduct(a, b, true), identity(a.length));
    return steps[steps.length - 1].result!;
}
export type IteratorKind = 'forward' | 'bidirectional' | 'random';
export function moveIterator(kind: IteratorKind, position: number, delta: number, length: number) {
    if (!Number.isInteger(position) || !Number.isInteger(delta) || position < 0 || position > length || position + delta < 0 || position + delta > length)
        throw new RangeError('boundary');
    if (kind === 'forward' && delta < 0)
        throw new RangeError('capability');
    return { position: position + delta, cost: delta === 0 ? 0 : kind === 'random' ? 1 : Math.abs(delta) };
}
export function rangeValues<T>(a: T[], first: number, last: number): T[] {
    if (!Number.isInteger(first) || !Number.isInteger(last) || first < 0 || last < first || last > a.length)
        throw new RangeError('boundary');
    return a.slice(first, last);
}
