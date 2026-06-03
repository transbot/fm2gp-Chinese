// src/lib/algorithms/fermat.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Input for Fermat's Little Theorem verification
 */
export interface FermatInput {
  a: number; // base
  p: number; // prime candidate
}

/**
 * Single step in the modular exponentiation process
 */
export interface ExponentiationStep {
  exponent: bigint;
  value: bigint;
  operation: 'square' | 'multiply';
  description: string;
}

/**
 * State snapshot for each step of Fermat's Little Theorem verification
 */
export interface FermatState {
  a: number;
  p: number;
  exponent: bigint; // current exponent being computed
  currentPower: bigint; // a^k mod p
  modResult: bigint; // current result
  binaryDigits: number[]; // binary representation of p-1
  stepIndex: number;
  steps: ExponentiationStep[];
  isComplete: boolean;
  isPrime: boolean | null; // null means unknown
}

/**
 * Helper: Fast modular exponentiation with step tracking
 * Computes base^exp mod m using binary exponentiation
 */
function modularExponentiationSteps(
  base: bigint,
  exp: bigint,
  mod: bigint
): ExponentiationStep[] {
  const steps: ExponentiationStep[] = [];
  let result = 1n;
  let currentBase = base % mod;
  let currentExp = exp;

  // Process each bit of the exponent from right to left
  while (currentExp > 0n) {
    if (currentExp % 2n === 1n) {
      // Multiply result by current base
      result = (result * currentBase) % mod;
      steps.push({
        exponent: currentExp,
        value: result,
        operation: 'multiply',
        description: `Multiply: result = ${result}`,
      });
    }

    // Square the base
    if (currentExp > 1n) {
      currentBase = (currentBase * currentBase) % mod;
      steps.push({
        exponent: currentExp,
        value: currentBase,
        operation: 'square',
        description: `Square: base = ${currentBase}`,
      });
    }

    currentExp /= 2n;
  }

  return steps;
}

/**
 * Helper: Convert number to binary digits array
 */
function toBinaryDigits(n: bigint): number[] {
  if (n === 0n) return [0];
  const digits: number[] = [];
  let temp = n;
  while (temp > 0n) {
    digits.unshift(Number(temp % 2n));
    temp /= 2n;
  }
  return digits;
}

/**
 * Helper: Simple primality test for small numbers
 */
function isPrimeSimple(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/**
 * Fermat's Little Theorem visualization implementation
 * Section 5.2 in the book - verifies a^(p-1) ≡ 1 (mod p) for prime p
 */
export const fermatVisualization: AlgorithmVisualization<
  FermatInput,
  FermatState
> = {
  id: 'fermat',
  section: '5.2',

  generateSteps(input: FermatInput): Step<FermatState>[] {
    const { a, p } = input;
    const steps: Step<FermatState>[] = [];
    const aBig = BigInt(a);
    const pBig = BigInt(p);
    const exponent = pBig - 1n;

    // Get binary representation of exponent
    const binaryDigits = toBinaryDigits(exponent);

    // Get all exponentiation steps
    const expSteps = modularExponentiationSteps(aBig, exponent, pBig);

    // Check if p is actually prime
    const actuallyPrime = isPrimeSimple(p);
    const finalResult = expSteps.length > 0
      ? expSteps.filter(s => s.operation === 'multiply').pop()?.value ?? 1n
      : 1n;

    // Initial state
    steps.push({
      state: {
        a,
        p,
        exponent,
        currentPower: 1n,
        modResult: 1n,
        binaryDigits,
        stepIndex: 0,
        steps: expSteps,
        isComplete: false,
        isPrime: null,
      },
      operation: 'init',
      descriptionKey: 'fermatInit',
      highlights: [],
    });

    // Steps for each exponentiation operation
    let currentResult = 1n;
    for (let i = 0; i < expSteps.length; i++) {
      const expStep = expSteps[i];
      if (expStep.operation === 'multiply') {
        currentResult = expStep.value;
      }

      steps.push({
        state: {
          a,
          p,
          exponent,
          currentPower: expStep.value,
          modResult: currentResult,
          binaryDigits,
          stepIndex: i + 1,
          steps: expSteps,
          isComplete: false,
          isPrime: null,
        },
        operation: expStep.operation,
        descriptionKey: expStep.operation === 'square' ? 'fermatSquare' : 'fermatMultiply',
        highlights: [],
      });
    }

    // Final result step
    steps.push({
      state: {
        a,
        p,
        exponent,
        currentPower: finalResult,
        modResult: finalResult,
        binaryDigits,
        stepIndex: expSteps.length,
        steps: expSteps,
        isComplete: true,
        isPrime: actuallyPrime,
      },
      operation: 'result',
      descriptionKey: 'fermatResult',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: FermatInput): ValidationResult {
    if (input.a < 1 || input.a > 1000) {
      return {
        valid: false,
        error: 'Base a must be between 1 and 1000',
        errorKey: 'fermatInvalidBase',
      };
    }

    if (input.p < 2 || input.p > 1000) {
      return {
        valid: false,
        error: 'Prime candidate p must be between 2 and 1000',
        errorKey: 'fermatInvalidP',
      };
    }

    if (input.a >= input.p) {
      return {
        valid: false,
        error: 'Base a must be less than p',
        errorKey: 'fermatBaseTooLarge',
      };
    }

    return { valid: true };
  },

  getInitialState(): FermatState {
    return {
      a: 2,
      p: 7,
      exponent: 6n,
      currentPower: 1n,
      modResult: 1n,
      binaryDigits: [1, 1, 0],
      stepIndex: 0,
      steps: [],
      isComplete: false,
      isPrime: null,
    };
  },

  describeStep(step: Step<FermatState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { a, p, exponent, currentPower, modResult, isComplete, isPrime } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Starting verification of Fermat's Little Theorem: ${a}^(${p}-1) mod ${p} = ${a}^${exponent} mod ${p}`,
        zh: `开始验证费马小定理：${a}^(${p}-1) mod ${p} = ${a}^${exponent} mod ${p}`,
      },
      square: {
        en: `Squaring step: Current value squared mod ${p} = ${currentPower}`,
        zh: `平方步骤：当前值平方后 mod ${p} = ${currentPower}`,
      },
      multiply: {
        en: `Multiplication step: Result = ${modResult} mod ${p}`,
        zh: `乘法步骤：结果 = ${modResult} mod ${p}`,
      },
      result: {
        en: isComplete
          ? isPrime
            ? `Verification complete: ${a}^${exponent} mod ${p} = ${modResult}. Since ${p} is prime, the theorem holds (result = 1).`
            : modResult === 1n
              ? `Verification complete: ${a}^${exponent} mod ${p} = ${modResult}. Note: ${p} is composite, but this base passes the test (Fermat pseudoprime).`
              : `Verification complete: ${a}^${exponent} mod ${p} = ${modResult}. ${p} is composite, so the theorem does not apply (result ≠ 1).`
          : 'Computing...',
        zh: isComplete
          ? isPrime
            ? `验证完成：${a}^${exponent} mod ${p} = ${modResult}。由于 ${p} 是素数，定理成立（结果 = 1）。`
            : modResult === 1n
              ? `验证完成：${a}^${exponent} mod ${p} = ${modResult}。注意：${p} 是合数，但此基数通过了测试（费马伪素数）。`
              : `验证完成：${a}^${exponent} mod ${p} = ${modResult}。${p} 是合数，定理不适用（结果 ≠ 1）。`
          : '计算中...',
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'For prime p: a^(p-1) ≡ 1 (mod p) when gcd(a, p) = 1'
      : '对于素数 p：当 gcd(a, p) = 1 时，a^(p-1) ≡ 1 (mod p)';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(log p)',
      space: 'O(1)',
      worstCase: 'O(log p) multiplications using fast exponentiation',
      worstCaseZh: 'O(log p) 次乘法（使用快速幂运算）',
      bestCase: 'O(log p) - always the same complexity',
      bestCaseZh: 'O(log p) - 复杂度始终相同',
    };
  },
};
