export const divisionMethods = ['repeated', 'doubling', 'fibonacci', 'quotient'] as const;
export type DivisionMethod = typeof divisionMethods[number];
export type DivisionError = 'empty' | 'integer' | 'aRange' | 'bRange' | 'capacity';
export type DivisionErrors = Partial<Record<'A' | 'B', DivisionError>>;
export type DivisionInputResult = { ok: true; A: number; B: number } | { ok: false; errors: DivisionErrors };

// Same original-token decimal grammar as the reviewed Horner/Egyptian parsers.
// Never let Number round a fractional or exponent token before validating it.
export function parseDivisionInput(aRaw: string, bRaw: string): DivisionInputResult {
  const errors: DivisionErrors = {};
  const parse = (raw: string, field: 'A' | 'B') => {
    const token = raw.trim();
    if (!token) { errors[field] = 'empty'; return 0; }
    if (!/^-?\d+$/.test(token)) { errors[field] = 'integer'; return 0; }
    const n = Number(token);
    if (!Number.isSafeInteger(n) || n < (field === 'A' ? 0 : 1) || n > 1000000) errors[field] = field === 'A' ? 'aRange' : 'bRange';
    return n;
  };
  const A = parse(aRaw, 'A'), B = parse(bRaw, 'B');
  if (!Object.keys(errors).length && A >= 257 * B) errors.A = 'capacity';
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, A, B };
}
export type DivisionEvent = 'init' | 'check' | 'call' | 'enter' | 'probe' | 'double' | 'helperReturn' | 'candidate' | 'seed' | 'deduct' | 'half' | 'doubleN' | 'incrementN' | 'save' | 'grow' | 'growPair' | 'recover' | 'shift' | 'backPair' | 'done';
export interface DivisionStep {
  A: number; B: number; method: DivisionMethod;
  fn: DivisionMethod | 'largest_doubling'; line: string; event: DivisionEvent;
  a: number; b: number; c: number | null; n: number | null; tmp: number | null;
  helper: { a: number; b: number } | null;
  counts: { add: number; subtract: number; half: number; deductions: number };
  calculation: string; condition: boolean | null; result: number | null;
  remainders: number[]; pairs: [number, number][];
  invariant: 'notStarted' | 'updating' | 'holds'; checkpoint: boolean;
}
// All arithmetic checks exact BigInt results before conversion. Input limits do
// not apply to internal values (e.g. Fibonacci c = 2,000,000 is legitimate).
export function divisionTrace(A: number, B: number, method: DivisionMethod): DivisionStep[] {
  if (!Number.isSafeInteger(A) || !Number.isSafeInteger(B) || A < 0 || B < 1 || A > 1000000 || B > 1000000 || A >= 257 * B) throw Error('input');
  const steps: DivisionStep[] = [];
  const s: DivisionStep = { A, B, method, fn: method, line: 'entry', event: 'init', a: A, b: B, c: null, n: null, tmp: null, helper: null, counts: { add: 0, subtract: 0, half: 0, deductions: 0 }, calculation: '', condition: null, result: null, remainders: [A], pairs: [], invariant: 'notStarted', checkpoint: false };
  const emit = (event: DivisionEvent, line: string, calculation = '', condition: boolean | null = null, checkpoint = false) => {
    Object.assign(s, { event, line, calculation, condition, checkpoint });
    steps.push({ ...s, helper: s.helper && { ...s.helper }, counts: { ...s.counts }, remainders: [...s.remainders], pairs: s.pairs.map(p => [...p] as [number, number]) });
  };
  const arithmetic = (x: number, y: number, op: 'add' | 'subtract' | 'half') => {
    const exact = op === 'add' ? BigInt(x) + BigInt(y) : op === 'subtract' ? BigInt(x) - BigInt(y) : BigInt(x) / 2n;
    if (exact > BigInt(Number.MAX_SAFE_INTEGER) || exact < BigInt(Number.MIN_SAFE_INTEGER) || op === 'half' && x % 2 !== 0) throw Error('unsafe');
    s.counts[op]++; return Number(exact);
  };
  const deduct = (candidate: number, line: string, checkpoint = false) => {
    const old = s.a; s.a = arithmetic(s.a, candidate, 'subtract'); s.counts.deductions++; s.remainders.push(s.a);
    emit('deduct', line, `${old} − ${candidate} = ${s.a}`, null, checkpoint);
  };
  const finish = (line = 'return') => { s.result = s.a; emit('done', line); return steps; };
  emit('init', 'entry');
  if (method === 'repeated') {
    while (true) {
      emit('check', 'loop', `${s.a} >= ${s.b}`, s.a >= s.b);
      if (s.a < s.b) break;
      deduct(s.b, 'deduct');
    }
    return finish();
  }
  emit('check', 'early', `${s.a} < ${s.b}`, s.a < s.b);
  if (s.a < s.b) { if (method === 'quotient') s.n = 0; return finish('early'); }
  if (method === 'fibonacci') {
    s.c = s.b; s.pairs.push([s.b, s.c]); emit('seed', 'seed');
    do {
      s.tmp = s.c; emit('save', 'save');
      const old = s.c; s.c = arithmetic(s.b, s.c, 'add'); emit('grow', 'grow', `${s.b} + ${old} = ${s.c}`);
      s.b = s.tmp; s.pairs.push([s.b, s.c]); emit('growPair', 'growPair');
      emit('check', 'growTest', `${s.a} >= ${s.c}`, s.a >= s.c);
    } while (s.a >= s.c);
    do {
      emit('check', 'deductTest', `${s.a} >= ${s.b}`, s.a >= s.b);
      if (s.a >= s.b) deduct(s.b, 'deduct');
      s.tmp = arithmetic(s.c, s.b, 'subtract'); emit('recover', 'recover', `${s.c} − ${s.b} = ${s.tmp}`);
      s.c = s.b; emit('shift', 'shift');
      s.b = s.tmp; emit('backPair', 'backPair');
      emit('check', 'backTest', `${s.b} < ${s.c}`, s.b < s.c);
    } while (s.b < s.c);
    return finish();
  }
  emit('call', 'candidate');
  s.fn = 'largest_doubling'; s.helper = { a: s.a, b: s.b }; emit('enter', 'entry');
  while (true) {
    const gap = arithmetic(s.helper.a, s.helper.b, 'subtract');
    emit('probe', 'test', `${s.helper.a} − ${s.helper.b} = ${gap}; ${gap} >= ${s.helper.b}`, gap >= s.helper.b);
    if (gap < s.helper.b) break;
    const old = s.helper.b; s.helper.b = arithmetic(old, old, 'add'); emit('double', 'double', `${old} + ${old} = ${s.helper.b}`);
  }
  emit('helperReturn', 'return', String(s.helper.b));
  s.c = s.helper.b; s.helper = null; s.fn = method; emit('candidate', 'candidate');
  if (method === 'quotient') { s.n = 1; s.invariant = 'updating'; emit('seed', 'seed'); s.invariant = 'holds'; }
  deduct(s.c, 'first', method === 'quotient');
  while (true) {
    emit('check', 'loop', `${s.c} != ${s.b}`, s.c !== s.b);
    if (s.c === s.b) break;
    const old = s.c; s.c = arithmetic(s.c, 2, 'half');
    if (method === 'quotient') s.invariant = 'updating';
    emit('half', 'half', `half(${old}) = ${s.c}`);
    if (method === 'quotient') {
      const oldN = s.n!; s.n = arithmetic(oldN, oldN, 'add'); s.invariant = 'holds'; emit('doubleN', 'doubleN', `${oldN} + ${oldN} = ${s.n}`, null, true);
    }
    emit('check', 'deductTest', `${s.c} <= ${s.a}`, s.c <= s.a);
    if (s.c <= s.a) {
      if (method === 'quotient') s.invariant = 'updating';
      deduct(s.c, 'deduct');
      if (method === 'quotient') {
        const oldN = s.n!; s.n = arithmetic(oldN, 1, 'add'); s.invariant = 'holds'; emit('incrementN', 'incrementN', `${oldN} + 1 = ${s.n}`, null, true);
      }
    }
  }
  return finish();
}
