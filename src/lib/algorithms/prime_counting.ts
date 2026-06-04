interface PrimeCountingOptions {
  maxN: number;
  samples: number;
}

interface PrimeCountingSeries {
  points: Array<[number, number]>;
  approxPoints: Array<[number, number]>;
  maxX: number;
  maxY: number;
}

function sieveOfEratosthenes(n: number): boolean[] {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  for (let i = 2; i * i <= n; i += 1) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  return isPrime;
}

export function buildPrimeCountingSeries({
  maxN,
  samples,
}: PrimeCountingOptions): PrimeCountingSeries {
  if (maxN < 2) {
    throw new Error('maxN must be at least 2');
  }

  const step = Math.max(1, Math.floor(maxN / samples));
  const isPrime = sieveOfEratosthenes(maxN);
  const prefixCounts = new Array(maxN + 1).fill(0);

  for (let n = 2; n <= maxN; n += 1) {
    prefixCounts[n] = prefixCounts[n - 1] + (isPrime[n] ? 1 : 0);
  }

  const points: Array<[number, number]> = [];
  const approxPoints: Array<[number, number]> = [];

  for (let n = 2; n <= maxN; n += step) {
    points.push([n, prefixCounts[n]]);
    approxPoints.push([n, n / Math.log(n)]);
  }

  if (points.at(-1)?.[0] !== maxN) {
    points.push([maxN, prefixCounts[maxN]]);
    approxPoints.push([maxN, maxN / Math.log(maxN)]);
  }

  const maxY = Math.max(
    ...points.map((point) => point[1]),
    ...approxPoints.map((point) => point[1])
  );

  return {
    points,
    approxPoints,
    maxX: maxN,
    maxY,
  };
}
