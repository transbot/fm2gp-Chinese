// src/lib/algorithms/sieve.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Input for sieve of Eratosthenes algorithm
 */
export interface SieveInput {
  maxNumber: number;
}

/**
 * State snapshot for each step of sieve algorithm
 */
export interface SieveState {
  /** Odd numbers from 3 to maxNumber (index i maps to value 2*i + 3) */
  numbers: Array<{
    value: number;
    isPrime: boolean;
    isMarked: boolean;
  }>;
  /** Current index being processed */
  currentIndex: number;
  /** The current prime being used for marking */
  currentPrime: number;
  /** Index where marking starts (square of current prime) */
  indexSquare: number;
  /** Current factor for stepping */
  factor: number;
  /** Whether the algorithm is complete */
  isComplete: boolean;
  /** Number of primes found */
  primeCount: number;
}

/**
 * Sieve of Eratosthenes algorithm visualization implementation
 * Section 10.7 in the book
 */
export const sieveVisualization: AlgorithmVisualization<
  SieveInput,
  SieveState
> = {
  id: 'sieve',
  section: '10.7',

  generateSteps(input: SieveInput): Step<SieveState>[] {
    const { maxNumber } = input;
    const steps: Step<SieveState>[] = [];

    // Generate odd numbers from 3 to maxNumber
    const numbers: SieveState['numbers'] = Array.from(
      { length: Math.floor((maxNumber - 1) / 2) },
      (_, i) => ({
        value: 2 * i + 3,
        isPrime: true,
        isMarked: false,
      })
    );

    // Initial state
    steps.push({
      state: {
        numbers: numbers.map(n => ({ ...n })),
        currentIndex: 0,
        currentPrime: 3,
        indexSquare: 3,
        factor: 3,
        isComplete: false,
        primeCount: 1, // 2 is prime
      },
      operation: 'init',
      descriptionKey: 'sieveInit',
      highlights: [],
    });

    // Track algorithm state
    let i = 0;
    let indexSquare = 3;
    let factor = 3;
    let primeCount = 1; // Count 2 as the first prime

    // Run the sieve algorithm
    while (indexSquare < numbers.length) {
      const newNumbers = steps[steps.length - 1].state.numbers.map(n => ({ ...n }));

      if (newNumbers[i].isPrime) {
        const prime = newNumbers[i].value;
        primeCount++;

        // Mark multiples starting from indexSquare
        for (let j = indexSquare; j < newNumbers.length; j += factor) {
          newNumbers[j].isPrime = false;
        }
        newNumbers[i].isMarked = true;

        steps.push({
          state: {
            numbers: newNumbers,
            currentIndex: i,
            currentPrime: prime,
            indexSquare,
            factor,
            isComplete: false,
            primeCount,
          },
          operation: 'mark_multiples',
          descriptionKey: 'sieveMarkMultiples',
          highlights: [i],
        });
      }

      // Advance to next number
      i++;
      const oldFactor = factor;
      indexSquare = indexSquare + factor;
      factor = factor + 2;
      indexSquare = indexSquare + oldFactor + 2;
    }

    // Final state
    const finalNumbers = steps[steps.length - 1].state.numbers.map(n => ({ ...n }));
    steps.push({
      state: {
        numbers: finalNumbers,
        currentIndex: i,
        currentPrime: newNumbers[i]?.value ?? 0,
        indexSquare,
        factor,
        isComplete: true,
        primeCount,
      },
      operation: 'complete',
      descriptionKey: 'sieveComplete',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: SieveInput): ValidationResult {
    if (!input.maxNumber || input.maxNumber < 2) {
      return {
        valid: false,
        error: 'Max number must be at least 2',
        errorKey: 'sieveInputRequired',
      };
    }

    if (input.maxNumber > 9999) {
      return {
        valid: false,
        error: 'Max number must be at most 9999',
        errorKey: 'sieveTooLarge',
      };
    }

    return { valid: true };
  },

  getInitialState(): SieveState {
    return {
      numbers: [],
      currentIndex: 0,
      currentPrime: 3,
      indexSquare: 3,
      factor: 3,
      isComplete: false,
      primeCount: 0,
    };
  },

  describeStep(step: Step<SieveState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { numbers, currentIndex, currentPrime, primeCount, isComplete } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Starting Sieve of Eratosthenes. Numbers 2 to ${numbers.length > 0 ? numbers[numbers.length - 1].value : 0} will be checked for primality. 2 is prime.`,
        zh: `开始埃拉托斯特尼筛法。将检查 2 到 ${numbers.length > 0 ? numbers[numbers.length - 1].value : 0} 的素数。2 是素数。`,
      },
      mark_multiples: {
        en: `Processing prime ${currentPrime}. All multiples of ${currentPrime} have been marked as composite. Found ${primeCount} primes so far.`,
        zh: `处理素数 ${currentPrime}。${currentPrime} 的所有倍数已标记为合数。已找到 ${primeCount} 个素数。`,
      },
      complete: {
        en: `Sieve complete! Found ${primeCount} prime numbers.`,
        zh: `筛法完成！共找到 ${primeCount} 个素数。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'All numbers marked as composite have at least one prime factor <= current prime.'
      : '所有被标记为合数的数至少有一个素因子 <= 当前素数。';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(n log log n)',
      space: 'O(n)',
      worstCase: 'The algorithm has the same complexity for all inputs',
      worstCaseZh: '对所有输入复杂度相同',
      bestCase: 'The algorithm has the same complexity for all inputs',
      bestCaseZh: '对所有输入复杂度相同',
    };
  },
};
