export interface MillerRabinStep {
  witness: bigint;
  phase: 'decomposition' | 'sequence' | 'result';
  details?: Record<string, string | bigint>;
  isProbablyPrime?: boolean | null;
}

// power(base, exp, mod) => base^exp % mod
export function power(base: bigint, exp: bigint, mod: bigint): bigint {
  let res = 1n;
  let b = base % mod;
  let e = exp;
  while (e > 0n) {
    if (e % 2n === 1n) res = (res * b) % mod;
    b = (b * b) % mod;
    e /= 2n;
  }
  return res;
}

export function* millerRabinGenerator(n: bigint, k: number = 5): Generator<MillerRabinStep, boolean, void> {
  if (n <= 1n) return false;
  if (n <= 3n) return true;
  if (n % 2n === 0n) return false;

  // Decompose n-1 = d * 2^s
  let d = n - 1n;
  let s = 0n;
  while (d % 2n === 0n) {
    d /= 2n;
    s++;
  }

  yield {
    witness: 0n,
    phase: 'decomposition',
    details: { s, d, explanation: `${n - 1n} = ${d} * 2^${s}` }
  };

  // Perform k tests
  for (let i = 0; i < k; i++) {
    // Generate a random witness 'a' between 2 and n-2
    // Simplified for demo: try specific small primes or pseudo-random
    const primes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
    let a = primes[i % primes.length];
    if (a >= n - 1n) a = 2n + BigInt(Math.floor(Math.random() * (Number(n) - 3)));

    let x = power(a, d, n);
    yield {
      witness: a,
      phase: 'sequence',
      details: { x, base: a, exp: d, mod: n, step: `a^d mod n = ${x}` }
    };

    if (x === 1n || x === n - 1n) {
      continue; // Pass for this witness
    }

    let isComposite = true;
    for (let r = 1n; r < s; r++) {
      x = power(x, 2n, n);
      yield {
        witness: a,
        phase: 'sequence',
        details: { r, x, step: `x^2 mod n = ${x}` }
      };

      if (x === n - 1n) {
        isComposite = false;
        break; // Pass for this witness
      }
    }

    if (isComposite) {
      yield {
        witness: a,
        phase: 'result',
        isProbablyPrime: false,
        details: { reason: `Fails Miller-Rabin test for witness ${a}` }
      };
      return false; // Definitely composite
    }
  }

  yield {
    witness: 0n,
    phase: 'result',
    isProbablyPrime: true,
    details: { passCount: BigInt(k) }
  };
  return true; // Probably prime
}
