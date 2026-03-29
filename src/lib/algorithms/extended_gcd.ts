export interface ExtendedGcdStep {
  x: bigint;
  y: bigint;
  xPrev: bigint;
  yPrev: bigint;
  a: bigint;
  b: bigint;
  quotient: bigint;
  remainder: bigint;
}

export function* extendedGcdGenerator(a: bigint, b: bigint): Generator<ExtendedGcdStep, { gcd: bigint, x: bigint, y: bigint }, void> {
  let oldR = a < 0n ? -a : a;
  let r = b < 0n ? -b : b;
  let oldS = 1n, s = 0n;
  let oldT = 0n, t = 1n;

  while (r !== 0n) {
    const quotient = oldR / r;
    const remainder = oldR % r;

    const nextS = oldS - quotient * s;
    const nextT = oldT - quotient * t;

    yield {
      a: oldR,
      b: r,
      quotient,
      remainder,
      x: s,
      y: t,
      xPrev: oldS,
      yPrev: oldT
    };

    oldR = r;
    r = remainder;
    oldS = s;
    s = nextS;
    oldT = t;
    t = nextT;
  }

  return { gcd: oldR, x: oldS, y: oldT };
}

export interface BinaryExtendedGcdStep {
  u: bigint;
  v: bigint;
  x1: bigint;
  x2: bigint;
  y1: bigint;
  y2: bigint;
  action: string;
}

// Stein's Algorithm (Binary extended GCD)
export function* binaryExtendedGcdGenerator(a: bigint, b: bigint): Generator<BinaryExtendedGcdStep, { gcd: bigint, x: bigint, y: bigint }, void> {
  if (a === 0n) return { gcd: b, x: 0n, y: 1n };
  if (b === 0n) return { gcd: a, x: 1n, y: 0n };

  let shift = 0n;
  let aTemp = a, bTemp = b;
  while ((aTemp & 1n) === 0n && (bTemp & 1n) === 0n) {
    aTemp >>= 1n; bTemp >>= 1n; shift++;
    yield { u: aTemp, v: bTemp, x1: 0n, x2: 0n, y1: 0n, y2: 0n, action: `Shift by 1 (both even)` };
  }

  // Now at least one of aTemp or bTemp is odd.
  let u = aTemp, v = bTemp;
  let A = 1n, B = 0n, C = 0n, D = 1n;

  while (u !== 0n) {
    while ((u & 1n) === 0n) {
      u >>= 1n;
      if ((A & 1n) === 0n && (B & 1n) === 0n) {
        A >>= 1n; B >>= 1n;
      } else {
        A = (A + bTemp) >> 1n; B = (B - aTemp) >> 1n;
      }
      yield { u, v, x1: A, x2: B, y1: C, y2: D, action: `Halve u (u is even)` };
    }

    while ((v & 1n) === 0n) {
      v >>= 1n;
      if ((C & 1n) === 0n && (D & 1n) === 0n) {
        C >>= 1n; D >>= 1n;
      } else {
        C = (C + bTemp) >> 1n; D = (D - aTemp) >> 1n;
      }
      yield { u, v, x1: A, x2: B, y1: C, y2: D, action: `Halve v (v is even)` };
    }

    if (u >= v) {
      u = u - v;
      A = A - C;
      B = B - D;
      yield { u, v, x1: A, x2: B, y1: C, y2: D, action: `Subtract (u = u - v)` };
    } else {
      v = v - u;
      C = C - A;
      D = D - B;
      yield { u, v, x1: A, x2: B, y1: C, y2: D, action: `Subtract (v = v - u)` };
    }
  }

  return { gcd: v << shift, x: C, y: D };
}
