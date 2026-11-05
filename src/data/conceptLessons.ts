import type { Difficulty, LocalizedText, TopicId } from './algorithmCatalog';

export interface ConceptLesson {
  id: string;
  path: string;
  sections: string[];
  title: LocalizedText;
  summary: LocalizedText;
  aliases: string[];
  prerequisite: string;
  topicId: TopicId;
  difficulty: Difficulty;
}

// Shared by both search entry points and the chapter/reader navigation.
export const conceptLessons: ConceptLesson[] = [
  {
    id: 'reverse-methods', path: '/reverse', sections: ['11.5', '11.6', '11.7'], prerequisite: '/concepts/iterators', topicId: 'search-sequence', difficulty: 'intermediate',
    title: { zh: '反转：递归与内存自适应', en: 'Reversal: recursion and memory adaptation' },
    summary: { zh: '比较双向反转、前向递归反转和共享缓冲区的自适应反转。', en: 'Compare bidirectional, forward recursive, and shared-buffer adaptive reversal.' },
    aliases: ['前向反转', '递归反转', '自适应反转', '缓冲区', '双向反转', 'forward reverse', 'recursive reverse', 'adaptive reverse', 'buffer', 'reverse_recursive', 'reverse_n_adaptive', 'reverse_n_with_buffer', 'swap_ranges_n', 'reverse_copy'],
  },
  {
    id: 'division-methods', path: '/division', sections: ['4.5', '4.6'], prerequisite: '/multiply', topicId: 'gcd-modular', difficulty: 'beginner',
    title: { zh: '求余与求商：倍增和斐波那契', en: 'Remainders and quotients: doubling and Fibonacci' },
    summary: { zh: '从逐次减法到倍增与斐波那契求余；观察候选量、运算次数与商余共享。', en: 'From repeated subtraction to doubling and Fibonacci remainder; follow candidates, counts, and shared quotient/remainder work.' },
    aliases: ['倍增求余', '斐波那契求余', '逐次减法', '求商求余', '埃及除法', 'Fibonacci remainder', 'doubling remainder', 'repeated subtraction', 'Egyptian division', 'largest_doubling', 'remainder', 'remainder_fibonacci', 'quotient_remainder'],
  },
  {
    id: 'horner', path: '/horner', sections: ['8.1'], prerequisite: '/power', topicId: 'applications-graphs', difficulty: 'beginner',
    title: { zh: '霍纳法则：多项式求值', en: 'Horner’s rule: polynomial evaluation' },
    summary: { zh: '比较逐项求值与嵌套累积，观察表达式、变量和运算次数。', en: 'Compare direct evaluation with nested accumulation through expressions, variables, and operation counts.' },
    aliases: ['霍纳', 'Horner', "Horner's rule", 'polynomial_value'],
  },
  {
    id: 'algebra', path: '/concepts/algebra', sections: ['6.1', '6.2'], prerequisite: '/book/5', topicId: 'number-theory', difficulty: 'intermediate',
    title: { zh: '运算与代数结构', en: 'Operations and algebraic structures' },
    summary: { zh: '从集合与运算的例子理解结合律、单位元素和逆元。', en: 'Explore associativity, identities, and inverses through sets and operations.' },
    aliases: ['半群', '幺半群', 'semigroup', 'monoid'],
  },
  {
    id: 'generic-power', path: '/power', sections: ['7.1', '7.2', '7.3', '7.4', '7.5', '7.6'], prerequisite: '/concepts/algebra', topicId: 'applications-graphs', difficulty: 'intermediate',
    title: { zh: '同一个幂算法', en: 'One power algorithm' },
    summary: { zh: '保持折半与累积流程，更换对象和合并运算。', en: 'Keep halving and accumulation while changing objects and the combining operation.' },
    aliases: ['泛型幂', 'generic power'],
  },
  {
    id: 'matrices', path: '/concepts/matrices', sections: ['8.5', '8.6'], prerequisite: '/power', topicId: 'applications-graphs', difficulty: 'intermediate',
    title: { zh: '矩阵与可达性', en: 'Matrices and reachability' },
    summary: { zh: '从矩阵中的一个格子理解乘法，再用布尔运算研究图的可达性。', en: 'Understand multiplication one matrix cell at a time, then explore graph reachability with Boolean operations.' },
    aliases: ['矩阵可达性', '布尔可达性', 'Boolean reachability'],
  },
  {
    id: 'iterators', path: '/concepts/iterators', sections: ['10.4', '10.5', '10.6', 'C.7'], prerequisite: '/book/10#section-10-3', topicId: 'search-sequence', difficulty: 'beginner',
    title: { zh: '迭代器与区间', en: 'Iterators and ranges' },
    summary: { zh: '比较迭代器能力、移动代价和半开区间的尾后位置。', en: 'Compare iterator capabilities, movement costs, and the past-the-end position of half-open ranges.' },
    aliases: ['半开区间', '尾后位置', 'half-open interval', 'past-the-end'],
  },
];

export function normalizeLessonSearch(text: string) {
  return text.toLowerCase().replace(/\s/g, '').replace(/[’']/g, '').replace(/二叉/g, '二分').replace(/质数/g, '素数');
}
