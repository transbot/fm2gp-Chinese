export type MultiplyVersion = 'multiply0' | 'multiply1' | 'multiply4';
export type AlgorithmFunction = MultiplyVersion | 'mult_acc4';
export interface AlgorithmFrame {
  id: number;
  fn: AlgorithmFunction;
  n: number;
  a: number;
  r: number | null;
  result: number | null;
  argument: number | null;
}
export type MultiplyEvent = 'init' | 'normalize' | 'zero' | 'enter' | 'check' | 'call' | 'argument' | 'double' | 'half' | 'add' | 'returned' | 'return' | 'exit' | 'done';
export interface MultiplyStep {
  event: MultiplyEvent;
  fn: AlgorithmFunction | 'wrapper';
  line: string;
  frames: AlgorithmFrame[];
  additions: number;
  peak: number;
  returned: number | null;
  result: number | null;
  calculation: string;
  condition: boolean | null;
}
export function parseEgyptianInput(nRaw: string, aRaw: string) {
  if (!nRaw.trim() || !aRaw.trim()) throw Error('empty');
  if (![nRaw, aRaw].every(s => /^-?\d+$/.test(s.trim()))) throw Error('integer');
  const n = Number(nRaw), a = Number(aRaw);
  validate(n, a);
  return { n, a };
}
function validate(n: number, a: number) {
  if (!Number.isInteger(n) || Math.abs(n) > 256) throw Error('nRange');
  if (!Number.isInteger(a) || Math.abs(a) > 1000000) throw Error('aRange');
}

// Source-level calls, including the nonrecursive mult_acc4 helper. odd/half
// are operations within statements, not frames. Every snapshot owns its frames.
export function egyptianTrace(inputN: number, inputA: number, version: MultiplyVersion): MultiplyStep[] {
  validate(inputN, inputA);
  const steps: MultiplyStep[] = [], frames: AlgorithmFrame[] = [];
  let additions = 0, peak = 0, frameId = 0, returned: number | null = null, result: number | null = null;
  const emit = (event: MultiplyEvent, fn: MultiplyStep['fn'], line: string, calculation = '', condition: boolean | null = null) => {
    steps.push({ event, fn, line, frames: frames.map(f => ({ ...f })), additions, peak, returned, result, calculation, condition });
  };
  const plus = (a: number, b: number) => {
    const sum = BigInt(a) + BigInt(b);
    if (sum > BigInt(Number.MAX_SAFE_INTEGER) || sum < BigInt(Number.MIN_SAFE_INTEGER)) throw Error('unsafe');
    additions++; return Number(sum);
  };
  const enter = (fn: AlgorithmFunction, n: number, a: number, r: number | null = null) => {
    const f: AlgorithmFrame = { id: ++frameId, fn, n, a, r, result: null, argument: null };
    frames.push(f); peak = Math.max(peak, frames.length); returned = null;
    emit('enter', fn, 'entry'); return f;
  };
  const leave = (f: AlgorithmFrame, value: number, line: string) => {
    returned = value; emit('return', f.fn, line, `${value}`);
    frames.pop(); emit('exit', f.fn, line, `${value}`);
    return value;
  };
  const recursive = (fn: 'multiply0' | 'multiply1', n: number, a: number): number => {
    const f = enter(fn, n, a);
    emit('check', fn, 'base', 'n == 1', n === 1);
    if (n === 1) return leave(f, a, 'base');
    if (fn === 'multiply0') {
      emit('call', fn, 'recurse', `multiply0(${n - 1}, ${a})`);
      f.result = recursive(fn, n - 1, a);
      emit('returned', fn, 'recurse', `${f.result}`); returned = null;
      const previous = f.result; f.result = plus(previous, a);
      emit('add', fn, 'recurse', `${previous} + (${a}) = ${f.result}`);
      return leave(f, f.result, 'recurse');
    }
    f.argument = plus(a, a);
    emit('argument', fn, 'recurse', `${a} + (${a}) = ${f.argument}; half(${n}) = ${Math.floor(n / 2)}`);
    f.result = recursive(fn, Math.floor(n / 2), f.argument);
    f.argument = null;
    emit('returned', fn, 'recurse', `${f.result}`); returned = null;
    emit('check', fn, 'odd', `odd(${n})`, n % 2 === 1);
    if (n % 2 === 1) {
      const previous = f.result; f.result = plus(previous, a);
      emit('add', fn, 'odd', `${previous} + (${a}) = ${f.result}`);
    }
    return leave(f, f.result, 'return');
  };
  const accumulate = (r: number, n: number, a: number) => {
    const f = enter('mult_acc4', n, a, r);
    while (true) {
      emit('check', f.fn, 'odd', `odd(${f.n})`, f.n % 2 === 1);
      if (f.n % 2 === 1) {
        const previous = f.r!; f.r = plus(previous, f.a);
        emit('add', f.fn, 'add', `${previous} + (${f.a}) = ${f.r}`);
        emit('check', f.fn, 'base', 'n == 1', f.n === 1);
        if (f.n === 1) return leave(f, f.r, 'base');
      }
      const oldN = f.n; f.n = Math.floor(f.n / 2);
      emit('half', f.fn, 'half', `half(${oldN}) = ${f.n}`);
      const oldA = f.a; f.a = plus(f.a, f.a);
      emit('double', f.fn, 'double', `${oldA} + (${oldA}) = ${f.a}`);
    }
  };
  const iterative = (n: number, a: number) => {
    const f = enter('multiply4', n, a);
    while (true) {
      emit('check', f.fn, 'even', `!odd(${f.n})`, f.n % 2 === 0);
      if (f.n % 2 !== 0) break;
      const oldA = f.a; f.a = plus(f.a, f.a);
      emit('double', f.fn, 'double', `${oldA} + (${oldA}) = ${f.a}`);
      const oldN = f.n; f.n = Math.floor(f.n / 2);
      emit('half', f.fn, 'half', `half(${oldN}) = ${f.n}`);
    }
    emit('check', f.fn, 'base', 'n == 1', f.n === 1);
    if (f.n === 1) return leave(f, f.a, 'base');
    f.argument = plus(f.a, f.a);
    emit('argument', f.fn, 'accumulate', `${f.a} + (${f.a}) = ${f.argument}; half(${f.n} - 1) = ${Math.floor((f.n - 1) / 2)}`);
    f.result = accumulate(f.a, Math.floor((f.n - 1) / 2), f.argument);
    f.argument = null;
    emit('returned', f.fn, 'accumulate', `${f.result}`); returned = null;
    return leave(f, f.result, 'accumulate');
  };

  emit('init', 'wrapper', 'entry');
  if (inputN === 0) {
    result = 0; emit('zero', 'wrapper', 'zero'); emit('done', 'wrapper', 'done'); return steps;
  }
  const n = Math.abs(inputN), a = inputN < 0 ? -inputA : inputA;
  emit('normalize', 'wrapper', 'normalize', `n = ${n}, a = ${a}`);
  result = version === 'multiply4' ? iterative(n, a) : recursive(version, n, a);
  emit('done', 'wrapper', 'done');
  return steps;
}
