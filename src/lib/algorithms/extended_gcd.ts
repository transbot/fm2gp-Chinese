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
  // Simplification for positive integers only for the generator demo
  let u = a;
  let v = b;

  if (u === 0n) return { gcd: v, x: 0n, y: 1n };
  if (v === 0n) return { gcd: u, x: 1n, y: 0n };

  let shift = 0n;
  while ((u & 1n) === 0n && (v & 1n) === 0n) {
    u >>= 1n;
    v >>= 1n;
    shift++;
    yield { u, v, x1: 0n, x2: 0n, y1: 0n, y2: 0n, action: `Shift by 1 (both even)` };
  }

  let u1 = 1n, u2 = 0n;
  let v1 = 0n, v2 = 1n;
  let uTemp = u, vTemp = v;

  while ((u & 1n) === 0n) {
    u >>= 1n;
    if ((u1 & 1n) === 0n && (u2 & 1n) === 0n) {
      u1 >>= 1n;
      u2 >>= 1n;
    } else {
      u1 = (u1 + vTemp) >> 1n;
      u2 = (u2 - uTemp) >> 1n;
    }
  }

  while (v !== 0n) {
    while ((v & 1n) === 0n) {
      v >>= 1n;
      if ((v1 & 1n) === 0n && (v2 & 1n) === 0n) {
        v1 >>= 1n;
        v2 >>= 1n;
      } else {
        v1 = (v1 + vTemp) >> 1n;
        v2 = (v2 - uTemp) >> 1n;
      }
    }

    if (u >= v) {
      u = u - v;
      u1 = u1 - v1;
      u2 = u2 - v2;
    } else {
      v = v - u;
      v1 = v1 - u1;
      v2 = v2 - u2;
    }
    
    yield { u, v, x1: u1, x2: u2, y1: v1, y2: v2, action: `Subtract` };
  }

  return { gcd: u << shift, x: u1, y: u2 };
}
