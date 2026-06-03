export interface GcmStep {
  a: bigint;
  b: bigint;
  remainder: bigint;
}

export function* gcmGenerator(a: bigint, b: bigint): Generator<GcmStep, bigint, void> {
  const absA = a < 0n ? -a : a;
  const absB = b < 0n ? -b : b;

  let currentA = absA > absB ? absA : absB;
  let currentB = absA > absB ? absB : absA;

  if (currentB === 0n) return currentA;

  while (currentB !== 0n) {
    const remainder = currentA % currentB;
    yield { a: currentA, b: currentB, remainder };
    currentA = currentB;
    currentB = remainder;
  }

  return currentA;
}
