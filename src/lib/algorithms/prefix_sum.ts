import {
  AlgorithmVisualization,
  ComplexityInfo,
  Step,
  ValidationResult,
} from './types';

export interface PrefixSumInput {
  array: number[];
  left: number;
  right: number;
}

export interface PrefixSumState {
  array: number[];
  prefix: number[];
  currentIndex: number;
  left: number;
  right: number;
  queryResult: number | null;
  buildComplete: boolean;
  activePrefixIndices: number[];
}

export const prefixSumVisualization: AlgorithmVisualization<
  PrefixSumInput,
  PrefixSumState
> = {
  id: 'prefix-sum',

  generateSteps(input: PrefixSumInput): Step<PrefixSumState>[] {
    const { array, left, right } = input;
    const prefix = new Array(array.length + 1).fill(0);
    const steps: Step<PrefixSumState>[] = [];

    const makeState = (
      currentIndex: number,
      queryResult: number | null,
      buildComplete: boolean,
      activePrefixIndices: number[]
    ): PrefixSumState => ({
      array: [...array],
      prefix: [...prefix],
      currentIndex,
      left,
      right,
      queryResult,
      buildComplete,
      activePrefixIndices,
    });

    steps.push({
      state: makeState(-1, null, false, [0]),
      operation: 'init',
      descriptionKey: 'prefixSumInit',
      highlights: [],
    });

    for (let i = 0; i < array.length; i++) {
      prefix[i + 1] = prefix[i] + array[i];
      steps.push({
        state: makeState(i, null, false, [i, i + 1]),
        operation: 'build_prefix',
        descriptionKey: 'prefixSumBuild',
        highlights: [i],
      });
    }

    steps.push({
      state: makeState(-1, null, true, [left, right + 1]),
      operation: 'query_setup',
      descriptionKey: 'prefixSumQuerySetup',
      highlights: Array.from({ length: right - left + 1 }, (_, index) => left + index),
    });

    const queryResult = prefix[right + 1] - prefix[left];
    steps.push({
      state: makeState(-1, queryResult, true, [left, right + 1]),
      operation: 'answer_query',
      descriptionKey: 'prefixSumAnswerQuery',
      highlights: Array.from({ length: right - left + 1 }, (_, index) => left + index),
    });

    steps.push({
      state: makeState(-1, queryResult, true, [left, right + 1]),
      operation: 'complete',
      descriptionKey: 'prefixSumComplete',
      highlights: Array.from({ length: right - left + 1 }, (_, index) => left + index),
    });

    return steps;
  },

  validateInput(input: PrefixSumInput): ValidationResult {
    if (!input.array || input.array.length === 0) {
      return {
        valid: false,
        error: 'Array must not be empty',
        errorKey: 'prefixSumEmptyArray',
      };
    }

    if (input.array.length > 50) {
      return {
        valid: false,
        error: 'Array must have at most 50 elements',
        errorKey: 'prefixSumTooLarge',
      };
    }

    if (input.left < 0 || input.right < input.left || input.right >= input.array.length) {
      return {
        valid: false,
        error: 'Range must satisfy 0 <= left <= right < array length',
        errorKey: 'prefixSumInvalidRange',
      };
    }

    return { valid: true };
  },

  getInitialState(): PrefixSumState {
    return {
      array: [],
      prefix: [],
      currentIndex: -1,
      left: 0,
      right: 0,
      queryResult: null,
      buildComplete: false,
      activePrefixIndices: [],
    };
  },

  describeStep(step: Step<PrefixSumState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { array, prefix, currentIndex, left, right, queryResult } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: 'Start with prefix[0] = 0 so every range can be represented by subtraction.',
        zh: '从 prefix[0] = 0 开始，这样任意区间都可以用减法表示。',
      },
      build_prefix: {
        en: `Build prefix[${currentIndex + 1}] = prefix[${currentIndex}] + array[${currentIndex}] = ${prefix[currentIndex]} + ${array[currentIndex]} = ${prefix[currentIndex + 1]}.`,
        zh: `构建 prefix[${currentIndex + 1}] = prefix[${currentIndex}] + array[${currentIndex}] = ${prefix[currentIndex]} + ${array[currentIndex]} = ${prefix[currentIndex + 1]}。`,
      },
      query_setup: {
        en: `To answer sum(${left}, ${right}), subtract prefix[${left}] from prefix[${right + 1}].`,
        zh: `要回答区间和 (${left}, ${right})，用 prefix[${right + 1}] 减去 prefix[${left}]。`,
      },
      answer_query: {
        en: `Range sum = prefix[${right + 1}] - prefix[${left}] = ${prefix[right + 1]} - ${prefix[left]} = ${queryResult}.`,
        zh: `区间和 = prefix[${right + 1}] - prefix[${left}] = ${prefix[right + 1]} - ${prefix[left]} = ${queryResult}。`,
      },
      complete: {
        en: `Prefix sum preprocessing is complete, and the query result is ${queryResult}.`,
        zh: `前缀和预处理完成，查询结果为 ${queryResult}。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'After processing index i, prefix[i + 1] stores the sum of array[0..i].'
      : '处理索引 i 后，prefix[i + 1] 保存 array[0..i] 的元素和。';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'Build O(n), query O(1)',
      space: 'O(n)',
      worstCase: 'O(n) preprocessing plus O(1) per query',
      worstCaseZh: '预处理 O(n)，每次查询 O(1)',
      bestCase: 'O(1) per query after the prefix array is built',
      bestCaseZh: '前缀数组建好后，每次查询 O(1)',
    };
  },
};
