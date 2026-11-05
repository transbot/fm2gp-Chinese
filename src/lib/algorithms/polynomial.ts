export type PolynomialMode = 'horner' | 'direct';
export type PolynomialEvent = 'init' | 'seed' | 'select' | 'term' | 'multiply' | 'add' | 'collect' | 'done' | 'empty' | 'overflow';
export interface PolynomialStep {
  event: PolynomialEvent;
  line: string;
  index: number;
  sum: number | null;
  term: number | null;
  power: number;
  additions: number;
  multiplications: number;
  completed: number[];
  calculation?: string;
  failure?: string;
}

export function parsePolynomialInput(raw: string, xRaw: string) {
  if (!raw.trim() || !xRaw.trim()) throw Error('empty');
  if (!/^-?\d+$/.test(xRaw.trim())) throw Error('integer');
  let coefficients: unknown;
  try { coefficients = JSON.parse(raw); } catch { throw Error('format'); }
  if (!Array.isArray(coefficients) || coefficients.some(c => typeof c !== 'number' || !Number.isInteger(c))) throw Error('format');
  const x = Number(xRaw);
  validate(coefficients, x);
  return { coefficients: coefficients as number[], x };
}

function validate(a: number[], x: number) {
  if (a.length > 33) throw Error('capacity');
  if (![x, ...a].every(v => Number.isInteger(v) && Math.abs(v) <= 1000000)) throw Error('range');
}

// Language-independent immutable snapshots. Arithmetic is checked before conversion
// back to Number, so no rounded intermediate value can enter a displayed state.
export function polynomialTrace(a: number[], x: number, mode: PolynomialMode): PolynomialStep[] {
  validate(a, x);
  const steps: PolynomialStep[] = [];
  const state: PolynomialStep = { event: 'init', line: 'entry', index: -1, sum: null, term: null, power: 0, additions: 0, multiplications: 0, completed: [] };
  const emit = (event: PolynomialEvent, line: string, calculation?: string) => {
    state.event = event; state.line = line; state.calculation = calculation;
    steps.push({ ...state, completed: [...state.completed] });
  };
  const operation = (left: number, right: number, op: '+' | '*', target: 'sum' | 'term') => {
    const value = op === '+' ? BigInt(left) + BigInt(right) : BigInt(left) * BigInt(right);
    const line = op === '*' ? 'multiply' : mode === 'direct' ? 'collect' : 'add';
    const calculation = `${left} ${op === '*' ? '×' : '+'} (${right})`;
    if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < BigInt(Number.MIN_SAFE_INTEGER)) {
      state.failure = `${calculation} = ${value}`;
      emit('overflow', line, calculation);
      return false;
    }
    state[target] = Number(value);
    if (op === '*') state.multiplications++; else state.additions++;
    if (mode === 'horner' && op === '+') state.completed.push(state.sum!);
    emit(op === '*' ? 'multiply' : mode === 'direct' ? 'collect' : 'add', line, `${calculation} = ${value}`);
    return true;
  };
  emit('init', 'entry');
  if (!a.length) { state.sum = 0; emit('empty', 'empty'); return steps; }
  if (mode === 'horner') {
    state.index = 0; state.sum = a[0]; state.completed.push(a[0]); emit('seed', 'seed');
    for (let i = 1; i < a.length; i++) {
      state.index = i; emit('select', 'next');
      if (!operation(state.sum!, x, '*', 'sum')) return steps;
      if (!operation(state.sum!, a[i], '+', 'sum')) return steps;
    }
  } else {
    for (let i = 0; i < a.length; i++) {
      state.index = i; state.power = 0; state.term = a[i]; emit('term', 'term');
      for (let k = 0; k < a.length - 1 - i; k++) {
        state.power = k + 1;
        if (!operation(state.term!, x, '*', 'term')) return steps;
      }
      if (i === 0) { state.sum = state.term; emit('seed', 'seed'); }
      else if (!operation(state.sum!, state.term!, '+', 'sum')) return steps;
    }
  }
  emit('done', 'return');
  return steps;
}

export function polynomialExpressions(a: number[]) {
  if (!a.length) return { expanded: '0', nested: '0' };
  const expanded = a.map((c, i) => `(${c})${a.length - i > 1 ? `·x${a.length - i > 2 ? `^${a.length - i - 1}` : ''}` : ''}`).join(' + ');
  const nested = a.slice(1).reduce((s, c) => `(${s}·x + (${c}))`, `${a[0]}`);
  return { expanded, nested };
}
