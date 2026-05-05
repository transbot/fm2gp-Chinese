// src/lib/algorithms/euler.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Prime factor with exponent for totient calculation
 */
export interface PrimeFactor {
  prime: number;
  exponent: number;
}

/**
 * Input for Euler's theorem algorithm
 */
export interface EulerInput {
  a: number;  // base
  n: number;  // modulus
}

/**
 * State snapshot for each step of Euler's theorem verification
 */
export interface EulerState {
  a: number;
  n: number;
  // Totient calculation
  phi: number;
  phiFactors: PrimeFactor[];
  // Current power computation
  currentPower: number;
  currentExponent: number;
  // Final result
  result: number;
  expected: number;
  // GCD check
  gcdValue: number;
  isCoprime: boolean;
  // Phase tracking
  phase: 'factorize' | 'totient' | 'exponentiation' | 'result';
  step: number;
}

/**
 * Compute GCD using Euclidean algorithm
 */
function gcd(a: number, b: number): number {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/**
 * Get prime factorization of n
 */
function primeFactors(n: number): PrimeFactor[] {
  const factors: PrimeFactor[] = [];
  let d = 2;
  let num = n;

  while (d * d <= num) {
    if (num % d === 0) {
      let exp = 0;
      while (num % d === 0) {
        num /= d;
        exp++;
      }
      factors.push({ prime: d, exponent: exp });
    }
    d++;
  }

  if (num > 1) {
    factors.push({ prime: num, exponent: 1 });
  }

  return factors;
}

/**
 * Compute Euler's totient function phi(n)
 * phi(n) = n * product(1 - 1/p) for prime factors p
 */
function computeTotient(n: number, factors: PrimeFactor[]): number {
  let phi = n;
  for (const { prime } of factors) {
    phi = Math.floor(phi * (prime - 1) / prime);
  }
  return phi;
}

/**
 * Modular exponentiation: base^exp mod m
 * Returns intermediate steps
 */
function* modExpSteps(base: number, exp: number, mod: number): Generator<{ result: number; power: number; exponent: number; bit: number }> {
  let result = 1;
  let power = base % mod;
  let e = exp;
  let bit = 0;

  while (e > 0) {
    if (e & 1) {
      result = (result * power) % mod;
      yield { result, power, exponent: 1 << bit, bit };
    } else {
      yield { result, power, exponent: 1 << bit, bit };
    }
    power = (power * power) % mod;
    e >>= 1;
    bit++;
  }
}

/**
 * Euler's Theorem visualization implementation
 * Section 5.5 in the book - verifies a^phi(n) = 1 (mod n) when gcd(a, n) = 1
 */
export const eulerVisualization: AlgorithmVisualization<
  EulerInput,
  EulerState
> = {
  id: 'euler',
  section: '5.5',

  generateSteps(input: EulerInput): Step<EulerState>[] {
    const { a, n } = input;
    const steps: Step<EulerState>[] = [];

    // Validate n > 1
    if (n <= 1) {
      steps.push({
        state: {
          a,
          n,
          phi: 0,
          phiFactors: [],
          currentPower: 1,
          currentExponent: 0,
          result: 0,
          expected: 1,
          gcdValue: gcd(Math.abs(a), n),
          isCoprime: false,
          phase: 'result',
          step: 0,
        },
        operation: 'invalid',
        descriptionKey: 'eulerInvalidModulus',
        highlights: [],
      });
      return steps;
    }

    // Step 1: Compute GCD
    const gcdValue = gcd(Math.abs(a), n);
    const isCoprime = gcdValue === 1;

    // Step 2: Factorize n
    const phiFactors = primeFactors(n);

    // Step 3: Compute totient
    const phi = computeTotient(n, phiFactors);

    // Initial state
    steps.push({
      state: {
        a,
        n,
        phi: 0,
        phiFactors: [],
        currentPower: 1,
        currentExponent: 0,
        result: 0,
        expected: 1,
        gcdValue,
        isCoprime,
        phase: 'factorize',
        step: 0,
      },
      operation: 'init',
      descriptionKey: 'eulerInit',
      highlights: [],
    });

    // Factorization step
    steps.push({
      state: {
        a,
        n,
        phi: 0,
        phiFactors,
        currentPower: 1,
        currentExponent: 0,
        result: 0,
        expected: 1,
        gcdValue,
        isCoprime,
        phase: 'factorize',
        step: 1,
      },
      operation: 'factorize',
      descriptionKey: 'eulerFactorize',
      highlights: [],
    });

    // Totient calculation step
    steps.push({
      state: {
        a,
        n,
        phi,
        phiFactors,
        currentPower: 1,
        currentExponent: 0,
        result: 0,
        expected: 1,
        gcdValue,
        isCoprime,
        phase: 'totient',
        step: 2,
      },
      operation: 'totient',
      descriptionKey: 'eulerTotient',
      highlights: [],
    });

    // Modular exponentiation steps
    let currentPower = 1;
    let stepNum = 3;

    for (const step of modExpSteps(a, phi, n)) {
      currentPower = step.result;
      steps.push({
        state: {
          a,
          n,
          phi,
          phiFactors,
          currentPower: step.result,
          currentExponent: step.exponent,
          result: 0,
          expected: 1,
          gcdValue,
          isCoprime,
          phase: 'exponentiation',
          step: stepNum,
        },
        operation: 'power',
        descriptionKey: 'eulerPower',
        highlights: [],
      });
      stepNum++;
    }

    // Final result step
    steps.push({
      state: {
        a,
        n,
        phi,
        phiFactors,
        currentPower,
        currentExponent: phi,
        result: currentPower,
        expected: 1,
        gcdValue,
        isCoprime,
        phase: 'result',
        step: stepNum,
      },
      operation: 'result',
      descriptionKey: 'eulerResult',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: EulerInput): ValidationResult {
    if (input.n < 1) {
      return {
        valid: false,
        error: 'Modulus n must be at least 1',
        errorKey: 'eulerModulusPositive',
      };
    }

    if (input.n > 100000) {
      return {
        valid: false,
        error: 'Modulus is too large for visualization (max 100000)',
        errorKey: 'eulerTooLarge',
      };
    }

    if (input.a < 0 || input.a >= input.n) {
      // We'll handle this by taking a mod n
      return { valid: true };
    }

    return { valid: true };
  },

  getInitialState(): EulerState {
    return {
      a: 0,
      n: 1,
      phi: 0,
      phiFactors: [],
      currentPower: 1,
      currentExponent: 0,
      result: 0,
      expected: 1,
      gcdValue: 1,
      isCoprime: true,
      phase: 'factorize',
      step: 0,
    };
  },

  describeStep(step: Step<EulerState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { a, n, phi, phiFactors, currentPower, gcdValue, isCoprime, result } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Starting Euler's theorem verification for a = ${a}, n = ${n}. First, we check if gcd(${a}, ${n}) = 1.`,
        zh: `开始验证欧拉定理：a = ${a}，n = ${n}。首先检查 gcd(${a}, ${n}) = 1。`,
      },
      factorize: {
        en: `Prime factorization of ${n}: ${phiFactors.map(f => f.exponent > 1 ? `${f.prime}^${f.exponent}` : `${f.prime}`).join(' * ')}.`,
        zh: `${n} 的素因子分解：${phiFactors.map(f => f.exponent > 1 ? `${f.prime}^${f.exponent}` : `${f.prime}`).join(' * ')}。`,
      },
      totient: {
        en: `Euler's totient phi(${n}) = ${phi}. Calculated as: ${n} * ${phiFactors.map(f => `(${f.prime}-1)/${f.prime}`).join(' * ')} = ${phi}.`,
        zh: `欧拉函数值 phi(${n}) = ${phi}。计算公式：${n} * ${phiFactors.map(f => `(${f.prime}-1)/${f.prime}`).join(' * ')} = ${phi}。`,
      },
      power: {
        en: `Computing ${a}^${phi} mod ${n} using fast modular exponentiation. Current intermediate result: ${currentPower}.`,
        zh: `使用快速模幂运算计算 ${a}^${phi} mod ${n}。当前中间结果：${currentPower}。`,
      },
      result: {
        en: isCoprime
          ? `Result: ${a}^${phi} mod ${n} = ${result}. Since gcd(${a}, ${n}) = ${gcdValue} = 1, Euler's theorem predicts 1. ${result === 1 ? 'Verified!' : 'Different from expected (check calculation).'}`
          : `Result: ${a}^${phi} mod ${n} = ${result}. Since gcd(${a}, ${n}) = ${gcdValue} != 1, Euler's theorem does not apply (a and n are not coprime).`,
        zh: isCoprime
          ? `结果：${a}^${phi} mod ${n} = ${result}。因为 gcd(${a}, ${n}) = ${gcdValue} = 1，欧拉定理预测结果为 1。${result === 1 ? '验证成功！' : '与预期不同（请检查计算）。'}`
          : `结果：${a}^${phi} mod ${n} = ${result}。因为 gcd(${a}, ${n}) = ${gcdValue} != 1，欧拉定理不适用（a 和 n 不互素）。`,
      },
      invalid: {
        en: `Invalid modulus: n must be greater than 1 for Euler's theorem.`,
        zh: `无效模数：欧拉定理要求 n > 1。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'If gcd(a, n) = 1, then a^phi(n) = 1 (mod n), where phi(n) is Euler\'s totient function'
      : '若 gcd(a, n) = 1，则 a^phi(n) = 1 (mod n)，其中 phi(n) 是欧拉函数';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(sqrt(n)) for factorization + O(log phi(n)) for exponentiation',
      space: 'O(log n) for storing prime factors',
      worstCase: 'Factorization dominates for large n with many prime factors',
      bestCase: 'n is prime: O(sqrt(n)) factorization + O(log(n-1)) exponentiation',
    };
  },
};
