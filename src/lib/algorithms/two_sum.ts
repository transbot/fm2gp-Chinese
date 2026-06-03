import {
  AlgorithmVisualization,
  ComplexityInfo,
  Step,
  ValidationResult,
} from './types';

export interface TwoSumInput {
  array: number[];
  target: number;
}

export interface TwoSumState {
  array: number[];
  target: number;
  currentIndex: number;
  currentValue: number | null;
  complement: number | null;
  seen: Record<string, number>;
  result: [number, number] | null;
}

export const twoSumVisualization: AlgorithmVisualization<TwoSumInput, TwoSumState> = {
  id: 'two-sum',

  generateSteps(input: TwoSumInput): Step<TwoSumState>[] {
    const array = [...input.array];
    const seen: Record<string, number> = {};
    const steps: Step<TwoSumState>[] = [];
    let result: [number, number] | null = null;

    const makeState = (
      currentIndex: number,
      currentValue: number | null,
      complement: number | null
    ): TwoSumState => ({
      array,
      target: input.target,
      currentIndex,
      currentValue,
      complement,
      seen: { ...seen },
      result,
    });

    steps.push({
      state: makeState(-1, null, null),
      operation: 'init',
      descriptionKey: 'twoSumInit',
      highlights: [],
    });

    for (let index = 0; index < array.length; index++) {
      const value = array[index];
      const complement = input.target - value;

      steps.push({
        state: makeState(index, value, complement),
        operation: 'check_complement',
        descriptionKey: 'twoSumCheckComplement',
        highlights: [index],
      });

      if (Object.prototype.hasOwnProperty.call(seen, String(complement))) {
        result = [seen[String(complement)], index];
        steps.push({
          state: makeState(index, value, complement),
          operation: 'found',
          descriptionKey: 'twoSumFound',
          highlights: result,
        });
        return steps;
      }

      seen[String(value)] = index;
      steps.push({
        state: makeState(index, value, complement),
        operation: 'store_value',
        descriptionKey: 'twoSumStoreValue',
        highlights: [index],
      });
    }

    steps.push({
      state: makeState(-1, null, null),
      operation: 'not_found',
      descriptionKey: 'twoSumNotFound',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: TwoSumInput): ValidationResult {
    if (!input.array || input.array.length < 2) {
      return {
        valid: false,
        error: 'Array must contain at least two values',
        errorKey: 'twoSumTooSmall',
      };
    }

    if (input.array.length > 80) {
      return {
        valid: false,
        error: 'Array must have at most 80 values',
        errorKey: 'twoSumTooLarge',
      };
    }

    return { valid: true };
  },

  getInitialState(): TwoSumState {
    return {
      array: [],
      target: 0,
      currentIndex: -1,
      currentValue: null,
      complement: null,
      seen: {},
      result: null,
    };
  },

  describeStep(step: Step<TwoSumState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { currentIndex, currentValue, complement, target, result } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: 'Start with an empty table of previously seen values.',
        zh: '从一张空的“已见过的值”表开始。',
      },
      check_complement: {
        en: `At index ${currentIndex}, ${currentValue} needs complement ${complement} to reach ${target}.`,
        zh: `索引 ${currentIndex} 处的 ${currentValue} 需要补数 ${complement} 才能得到 ${target}。`,
      },
      store_value: {
        en: `Complement not found yet, so store ${currentValue} with index ${currentIndex}.`,
        zh: `暂未找到补数，因此记录 ${currentValue} 的索引 ${currentIndex}。`,
      },
      found: {
        en: `Found indices ${result?.[0]} and ${result?.[1]}. Their values add to ${target}.`,
        zh: `找到索引 ${result?.[0]} 和 ${result?.[1]}，对应值相加等于 ${target}。`,
      },
      not_found: {
        en: `No pair adds to ${target}.`,
        zh: `没有两个数相加等于 ${target}。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'Before checking index i, the table contains values from indices 0..i-1 only.'
      : '检查索引 i 前，表中只保存了索引 0..i-1 中出现过的值。';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(n)',
      space: 'O(n)',
      worstCase: 'O(n) scans when the answer is near the end or absent',
      worstCaseZh: '答案靠后或不存在时，需要 O(n) 次扫描',
      bestCase: 'O(1) when the first checked pair is found immediately',
      bestCaseZh: '如果很早找到配对，最好情况可接近 O(1)',
    };
  },
};
