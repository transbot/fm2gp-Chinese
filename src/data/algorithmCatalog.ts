import { translations } from '../i18n/translations';

export type Language = 'en' | 'zh';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type SourceType = 'book' | 'exercise' | 'extra';
export type TopicId =
  | 'search-sequence'
  | 'sorting-heap'
  | 'number-theory'
  | 'gcd-modular'
  | 'applications-graphs';

export interface LocalizedText {
  en: string;
  zh: string;
}

export interface AlgorithmSource {
  type: SourceType;
  section?: string;
}

export interface AlgorithmCatalogItem {
  id: string;
  path: string;
  titleKey: string;
  topicId: TopicId;
  order: number;
  difficulty: Difficulty;
  source: AlgorithmSource;
  summary: LocalizedText;
  coreConcept: LocalizedText;
  learningNote?: LocalizedText;
}

export interface TopicCatalogItem {
  id: TopicId;
  order: number;
  title: LocalizedText;
  description: LocalizedText;
  recommendedStartPath: string;
}

export interface AlgorithmNavigationInfo {
  current: AlgorithmCatalogItem;
  topic: TopicCatalogItem;
  previous?: AlgorithmCatalogItem;
  next?: AlgorithmCatalogItem;
}

export interface RecommendedLearningStage {
  title: LocalizedText;
  description: LocalizedText;
  algorithmIds: string[];
}

export interface AlgorithmSearchOptions {
  query?: string;
  lang: Language;
  sourceType?: SourceType | 'all';
  difficulty?: Difficulty | 'all';
  topicId?: TopicId | 'all';
}

function getSearchQueryVariants(query: string, lang: Language): string[] {
  if (!query) {
    return [''];
  }

  if (lang !== 'zh') {
    return [query];
  }

  return Array.from(new Set([
    query,
    query.replace(/质数/g, '素数'),
    query.replace(/素数/g, '质数'),
  ]));
}

export const topicCatalog: TopicCatalogItem[] = [
  {
    id: 'search-sequence',
    order: 1,
    title: {
      en: 'Search and Sequences',
      zh: '查找与序列',
    },
    description: {
      en: 'Move from linear scans and range boundaries to in-place sequence transformations.',
      zh: '从线性扫描、区间边界到原地序列变换，理解循环不变式。',
    },
    recommendedStartPath: '/linear-search',
  },
  {
    id: 'sorting-heap',
    order: 2,
    title: {
      en: 'Sorting and Heaps',
      zh: '排序与堆',
    },
    description: {
      en: 'Compare simple sorting, divide-and-conquer, partitioning, and tree-shaped array structures.',
      zh: '比较基础排序、分治、分区和树形数组结构中的不同组织方式。',
    },
    recommendedStartPath: '/insertion-sort',
  },
  {
    id: 'number-theory',
    order: 3,
    title: {
      en: 'Number Theory Basics',
      zh: '数论基础',
    },
    description: {
      en: 'Build from primes and sieves toward modular arithmetic theorems.',
      zh: '从素数、筛法到模运算定理，为密码学示例打基础。',
    },
    recommendedStartPath: '/sieve',
  },
  {
    id: 'gcd-modular',
    order: 4,
    title: {
      en: 'GCD and Modular Arithmetic',
      zh: 'GCD 与模运算',
    },
    description: {
      en: 'Connect division, remainders, greatest common divisors, and inverses.',
      zh: '把除法、余数、最大公约数和乘法逆元连成一条线。',
    },
    recommendedStartPath: '/gcm',
  },
  {
    id: 'applications-graphs',
    order: 5,
    title: {
      en: 'Applications and Graphs',
      zh: '综合应用与图',
    },
    description: {
      en: 'Combine number theory, power algorithms, and abstraction into larger examples.',
      zh: '把前面的数论、幂算法和抽象代数思想组合成更完整的应用。',
    },
    recommendedStartPath: '/multiply',
  },
];

export const recommendedLearningStages: RecommendedLearningStage[] = [
  {
    title: {
      en: 'Array Scans and Tables',
      zh: '数组扫描与表',
    },
    description: {
      en: 'Start with one-pass thinking, then add counting, complement lookup, and preprocessing.',
      zh: '先建立单次扫描思维，再加入计数、补数查找和预处理。',
    },
    algorithmIds: ['linear-search', 'frequency-count', 'two-sum', 'prefix-sum'],
  },
  {
    title: {
      en: 'Basic Sorting',
      zh: '基础排序',
    },
    description: {
      en: 'Compare adjacent swaps, sorted prefixes, and repeated minimum selection.',
      zh: '比较相邻交换、有序前缀和重复选择最小值。',
    },
    algorithmIds: ['bubble-sort', 'insertion-sort', 'selection-sort'],
  },
  {
    title: {
      en: 'Ordered Search',
      zh: '有序查找',
    },
    description: {
      en: 'Use sorted order to shrink the search interval.',
      zh: '利用有序性缩小查找区间。',
    },
    algorithmIds: ['binary-search'],
  },
];

export const recommendedLearningPathIds = recommendedLearningStages.flatMap(
  (stage) => stage.algorithmIds
);

type AlgorithmCatalogSeed = Omit<AlgorithmCatalogItem, 'coreConcept' | 'learningNote'>;

const extensionLearningNote: LocalizedText = {
  en: 'This is not covered in the book; it is included as supplemental beginner learning material.',
  zh: '这是非书中内容，作为入门基础补充材料加入。',
};

const coreConcepts: Record<string, LocalizedText> = {
  'linear-search': {
    en: 'Sequential scan and checked-prefix invariant',
    zh: '顺序扫描与已检查前缀不变式',
  },
  'prefix-sum': {
    en: 'Preprocessing trades extra space for O(1) range queries',
    zh: '用预处理和额外空间换取 O(1) 区间查询',
  },
  'binary-search': {
    en: 'Ordered ranges, boundaries, and interval shrinking',
    zh: '有序区间、边界定位与区间收缩',
  },
  'frequency-count': {
    en: 'One-pass counting with a table of occurrences',
    zh: '用出现次数表进行单次扫描计数',
  },
  'two-sum': {
    en: 'Complement lookup with previously seen values',
    zh: '用已见过的值查找补数',
  },
  swap: {
    en: 'Range exchange as a sequence transformation primitive',
    zh: '把区间交换作为序列变换的基础操作',
  },
  rotate: {
    en: 'Rotation through decomposition into adjacent ranges',
    zh: '通过相邻区间分解理解旋转',
  },
  cycle: {
    en: 'Permutation structure through disjoint cycles',
    zh: '用不相交循环理解置换结构',
  },
  reverse: {
    en: 'Two-pointer in-place sequence transformation',
    zh: '双指针原地序列变换',
  },
  'bubble-sort': {
    en: 'Adjacent comparisons move large values to the sorted suffix',
    zh: '相邻比较把较大值推向已排序后缀',
  },
  'insertion-sort': {
    en: 'Sorted prefix and inserting the current key',
    zh: '有序前缀与当前 key 的插入',
  },
  'selection-sort': {
    en: 'Repeated minimum selection and fixed sorted prefix',
    zh: '重复选择最小值与固定已排序前缀',
  },
  'merge-sort': {
    en: 'Divide, solve, and merge sorted subproblems',
    zh: '分解、求解并合并有序子问题',
  },
  'quick-sort': {
    en: 'Partitioning around a pivot',
    zh: '围绕基准值进行分区',
  },
  heap: {
    en: 'Array representation of a heap-ordered tree',
    zh: '用数组表示满足堆序的树',
  },
  sieve: {
    en: 'Eliminate composites by crossing out multiples',
    zh: '通过划去倍数排除合数',
  },
  'prime-counting': {
    en: 'Prime density and asymptotic approximation',
    zh: '素数密度与渐近近似',
  },
  'palindromic-primes': {
    en: 'Combining primality with representation constraints',
    zh: '把素性与表示形式约束结合起来',
  },
  'prime-checker': {
    en: 'Trial division up to the square root boundary',
    zh: '试除到平方根边界',
  },
  fermat: {
    en: 'Modular exponentiation as a primality signal',
    zh: '把模幂结果作为素性信号',
  },
  euler: {
    en: 'Coprimality and Euler totient in modular arithmetic',
    zh: '模运算中的互素关系与欧拉函数',
  },
  gcm: {
    en: 'Remainder-based reduction preserves the GCD',
    zh: '用余数归约并保持最大公约数不变',
  },
  division: {
    en: 'Quotient and remainder from repeated subtraction',
    zh: '从重复减法理解商与余数',
  },
  'stein-gcd': {
    en: 'Binary GCD using shifts and subtraction',
    zh: '用移位和减法计算二进制 GCD',
  },
  'extended-gcd': {
    en: 'Bezout coefficients and modular inverses',
    zh: '贝祖系数与模逆元',
  },
  'gcd-comparison': {
    en: 'Comparing algorithmic cost on the same problem',
    zh: '在同一问题上比较算法代价',
  },
  multiply: {
    en: 'Halving, doubling, and selective accumulation',
    zh: '折半、倍增与选择性累加',
  },
  power: {
    en: 'Exponentiation by repeated squaring',
    zh: '通过反复平方实现快速幂',
  },
  fibonacci: {
    en: 'Recursive overlap and exponential growth',
    zh: '递归重叠与指数级增长',
  },
  'fast-fibonacci': {
    en: 'Matrix power turns recurrence into logarithmic computation',
    zh: '用矩阵幂把递推转化为对数时间计算',
  },
  'shortest-path': {
    en: 'Matrix power over the tropical semiring',
    zh: '热带半环上的矩阵幂',
  },
  'graph-traversal': {
    en: 'Queue-based BFS versus stack-based DFS',
    zh: '基于队列的 BFS 与基于栈的 DFS',
  },
  'pi-upper-bound': {
    en: 'Geometric approximation through inscribed polygons',
    zh: '通过内接多边形进行几何近似',
  },
  'miller-rabin': {
    en: 'Witnesses and probabilistic primality testing',
    zh: '见证数与概率素性测试',
  },
  rsa: {
    en: 'Public-key encryption from primes, inverses, and modular powers',
    zh: '由素数、逆元和模幂组成的公钥加密',
  },
};

const algorithmCatalogSeed: AlgorithmCatalogSeed[] = [
  {
    id: 'linear-search',
    path: '/linear-search',
    titleKey: 'linearSearchTitle',
    topicId: 'search-sequence',
    order: 10,
    difficulty: 'beginner',
    source: { type: 'book', section: '10.7' },
    summary: {
      en: 'Check elements one by one and learn basic iteration.',
      zh: '逐个比较元素，理解最基本的遍历。',
    },
  },
  {
    id: 'prefix-sum',
    path: '/prefix-sum',
    titleKey: 'prefixSumTitle',
    topicId: 'search-sequence',
    order: 20,
    difficulty: 'beginner',
    source: { type: 'extra' },
    summary: {
      en: 'Preprocess cumulative sums for fast range queries.',
      zh: '预处理累计和，快速回答区间查询。',
    },
  },
  {
    id: 'binary-search',
    path: '/binary-search',
    titleKey: 'binarySearchTitle',
    topicId: 'search-sequence',
    order: 30,
    difficulty: 'intermediate',
    source: { type: 'book', section: '10.8' },
    summary: {
      en: 'Find boundaries inside an ordered range.',
      zh: '在有序区间中定位边界。',
    },
  },
  {
    id: 'frequency-count',
    path: '/frequency-count',
    titleKey: 'frequencyCountTitle',
    topicId: 'search-sequence',
    order: 35,
    difficulty: 'beginner',
    source: { type: 'extra' },
    summary: {
      en: 'Count how many times each value appears in one scan.',
      zh: '一次扫描统计每个值出现的次数。',
    },
  },
  {
    id: 'two-sum',
    path: '/two-sum',
    titleKey: 'twoSumTitle',
    topicId: 'search-sequence',
    order: 37,
    difficulty: 'beginner',
    source: { type: 'extra' },
    summary: {
      en: 'Find a pair by storing values already seen.',
      zh: '记录已见过的值，寻找满足目标和的一对元素。',
    },
  },
  {
    id: 'swap',
    path: '/swap',
    titleKey: 'swapTitle',
    topicId: 'search-sequence',
    order: 40,
    difficulty: 'beginner',
    source: { type: 'book', section: '11.2' },
    summary: {
      en: 'Exchange adjacent ranges as a building block.',
      zh: '交换相邻区间，作为旋转等算法的基础。',
    },
  },
  {
    id: 'rotate',
    path: '/rotate',
    titleKey: 'rotateAlgorithm',
    topicId: 'search-sequence',
    order: 50,
    difficulty: 'intermediate',
    source: { type: 'book', section: '11.3' },
    summary: {
      en: 'Understand rotation through range exchange.',
      zh: '用区间交换理解序列旋转。',
    },
  },
  {
    id: 'cycle',
    path: '/cycle',
    titleKey: 'cycleTitle',
    topicId: 'search-sequence',
    order: 60,
    difficulty: 'intermediate',
    source: { type: 'book', section: '11.4' },
    summary: {
      en: 'Decompose permutations into disjoint cycles.',
      zh: '把置换分解成不相交循环。',
    },
  },
  {
    id: 'reverse',
    path: '/reverse',
    titleKey: 'reverseTitle',
    topicId: 'search-sequence',
    order: 70,
    difficulty: 'beginner',
    source: { type: 'book', section: '11.5' },
    summary: {
      en: 'Reverse a sequence in place with two pointers.',
      zh: '用双指针完成原地逆序。',
    },
  },
  {
    id: 'bubble-sort',
    path: '/bubble-sort',
    titleKey: 'bubbleSortTitle',
    topicId: 'sorting-heap',
    order: 5,
    difficulty: 'beginner',
    source: { type: 'extra' },
    summary: {
      en: 'Sort by comparing and swapping adjacent values.',
      zh: '通过比较和交换相邻元素完成排序。',
    },
  },
  {
    id: 'insertion-sort',
    path: '/insertion-sort',
    titleKey: 'insertionSortTitle',
    topicId: 'sorting-heap',
    order: 10,
    difficulty: 'beginner',
    source: { type: 'extra' },
    summary: {
      en: 'Maintain a sorted prefix and insert each new key.',
      zh: '维护有序前缀，把新元素插入正确位置。',
    },
  },
  {
    id: 'selection-sort',
    path: '/selection-sort',
    titleKey: 'selectionSortTitle',
    topicId: 'sorting-heap',
    order: 20,
    difficulty: 'beginner',
    source: { type: 'extra' },
    summary: {
      en: 'Repeatedly select the smallest remaining element.',
      zh: '每轮选择未排序部分的最小元素。',
    },
  },
  {
    id: 'merge-sort',
    path: '/merge-sort',
    titleKey: 'mergeSortTitle',
    topicId: 'sorting-heap',
    order: 30,
    difficulty: 'intermediate',
    source: { type: 'extra' },
    summary: {
      en: 'A stable divide-and-conquer sort built around merging.',
      zh: '稳定的分治排序，适合理解递归合并。',
    },
  },
  {
    id: 'quick-sort',
    path: '/quick-sort',
    titleKey: 'quickSortTitle',
    topicId: 'sorting-heap',
    order: 40,
    difficulty: 'advanced',
    source: { type: 'extra' },
    summary: {
      en: 'Sort in place by partitioning around a pivot.',
      zh: '通过基准分区实现高效原地排序。',
    },
  },
  {
    id: 'heap',
    path: '/heap',
    titleKey: 'heapTitle',
    topicId: 'sorting-heap',
    order: 50,
    difficulty: 'intermediate',
    source: { type: 'extra' },
    summary: {
      en: 'Represent a nearly complete binary tree in an array.',
      zh: '用数组表示近似完全二叉树。',
    },
  },
  {
    id: 'sieve',
    path: '/sieve',
    titleKey: 'sieveOfEratosthenes',
    topicId: 'number-theory',
    order: 10,
    difficulty: 'beginner',
    source: { type: 'book', section: '3.2-3.3' },
    summary: {
      en: 'Find primes in batches and see space-for-time tradeoffs.',
      zh: '批量筛出素数，理解空间换时间。',
    },
  },
  {
    id: 'prime-counting',
    path: '/prime-counting',
    titleKey: 'primeCounting',
    topicId: 'number-theory',
    order: 20,
    difficulty: 'intermediate',
    source: { type: 'exercise', section: '3.3' },
    summary: {
      en: 'Compare pi(n) with the approximation n/ln(n).',
      zh: '观察 π(n) 与 n/ln(n) 的近似关系。',
    },
  },
  {
    id: 'palindromic-primes',
    path: '/palindromic-primes',
    titleKey: 'palindromicPrimes',
    topicId: 'number-theory',
    order: 30,
    difficulty: 'beginner',
    source: { type: 'exercise', section: '3.4' },
    summary: {
      en: 'Explore palindromic primes in different bases.',
      zh: '探索不同进制下的回文素数。',
    },
  },
  {
    id: 'prime-checker',
    path: '/prime-checker',
    titleKey: 'primeChecker',
    topicId: 'number-theory',
    order: 40,
    difficulty: 'beginner',
    source: { type: 'book', section: '5.1' },
    summary: {
      en: 'Use trial division to test primality.',
      zh: '用试除法判断一个数是否为素数。',
    },
  },
  {
    id: 'fermat',
    path: '/fermat',
    titleKey: 'fermatTitle',
    topicId: 'number-theory',
    order: 50,
    difficulty: 'intermediate',
    source: { type: 'book', section: '5.2' },
    summary: {
      en: 'Understand the basis of probabilistic primality tests.',
      zh: '理解概率素性测试的基础。',
    },
  },
  {
    id: 'euler',
    path: '/euler',
    titleKey: 'eulerTitle',
    topicId: 'number-theory',
    order: 60,
    difficulty: 'intermediate',
    source: { type: 'book', section: '5.5' },
    summary: {
      en: 'Generalize Fermat to coprime integers.',
      zh: '把费马小定理推广到互素整数。',
    },
  },
  {
    id: 'gcm',
    path: '/gcm',
    titleKey: 'euclideanGcm',
    topicId: 'gcd-modular',
    order: 10,
    difficulty: 'beginner',
    source: { type: 'book', section: '4.2' },
    summary: {
      en: 'Repeatedly reduce a GCD problem using remainders.',
      zh: '用余数反复缩小 GCD 问题。',
    },
  },
  {
    id: 'division',
    path: '/division',
    titleKey: 'divisionTitle',
    topicId: 'gcd-modular',
    order: 20,
    difficulty: 'beginner',
    source: { type: 'book', section: '4.5' },
    summary: {
      en: 'Understand quotient and remainder through subtraction.',
      zh: '通过重复减法理解商和余数。',
    },
  },
  {
    id: 'stein-gcd',
    path: '/stein-gcd',
    titleKey: 'steinGcdTitle',
    topicId: 'gcd-modular',
    order: 30,
    difficulty: 'intermediate',
    source: { type: 'book', section: '12.1-12.2' },
    summary: {
      en: 'Replace division with shifts and subtraction.',
      zh: '用移位和减法替代除法。',
    },
  },
  {
    id: 'extended-gcd',
    path: '/extended-gcd',
    titleKey: 'extendedGcdAlgorithm',
    topicId: 'gcd-modular',
    order: 40,
    difficulty: 'advanced',
    source: { type: 'book', section: '12.3-12.4' },
    summary: {
      en: 'Compute Bezout coefficients and modular inverses.',
      zh: '求出贝祖系数和模逆元。',
    },
  },
  {
    id: 'gcd-comparison',
    path: '/gcd-comparison',
    titleKey: 'gcdComparison',
    topicId: 'gcd-modular',
    order: 50,
    difficulty: 'intermediate',
    source: { type: 'exercise', section: '12.1' },
    summary: {
      en: 'Compare Euclidean and Stein GCD performance.',
      zh: '比较欧几里得算法和斯坦因算法性能。',
    },
  },
  {
    id: 'multiply',
    path: '/multiply',
    titleKey: 'egyptianMultiplication',
    topicId: 'applications-graphs',
    order: 10,
    difficulty: 'beginner',
    source: { type: 'book', section: '2.1' },
    summary: {
      en: 'Replace repeated addition with doubling and selection.',
      zh: '用倍增和选择替代重复加法。',
    },
  },
  {
    id: 'power',
    path: '/power',
    titleKey: 'powerTitle',
    topicId: 'applications-graphs',
    order: 20,
    difficulty: 'intermediate',
    source: { type: 'book', section: '7.5' },
    summary: {
      en: 'Generalize Egyptian multiplication into fast power.',
      zh: '把埃及乘法推广到快速幂。',
    },
  },
  {
    id: 'fibonacci',
    path: '/fibonacci',
    titleKey: 'fibonacci',
    topicId: 'applications-graphs',
    order: 30,
    difficulty: 'beginner',
    source: { type: 'exercise', section: '7.1' },
    summary: {
      en: 'Observe exponential growth in naive recursion.',
      zh: '观察朴素递归的指数增长。',
    },
  },
  {
    id: 'fast-fibonacci',
    path: '/fast-fibonacci',
    titleKey: 'fastFibonacci',
    topicId: 'applications-graphs',
    order: 40,
    difficulty: 'advanced',
    source: { type: 'book', section: '7.7' },
    summary: {
      en: 'Use matrix powers to compute Fibonacci in O(log n).',
      zh: '用矩阵幂在 O(log n) 时间计算斐波那契数。',
    },
  },
  {
    id: 'shortest-path',
    path: '/shortest-path',
    titleKey: 'shortestPath',
    topicId: 'applications-graphs',
    order: 50,
    difficulty: 'advanced',
    source: { type: 'book', section: '8.6' },
    summary: {
      en: 'Reuse matrix power over the tropical semiring.',
      zh: '在热带半环上复用矩阵幂思想。',
    },
  },
  {
    id: 'graph-traversal',
    path: '/graph-traversal',
    titleKey: 'graphTraversalTitle',
    topicId: 'applications-graphs',
    order: 60,
    difficulty: 'beginner',
    source: { type: 'extra' },
    summary: {
      en: 'Compare BFS queues and DFS stacks.',
      zh: '比较 BFS 队列和 DFS 栈。',
    },
  },
  {
    id: 'pi-upper-bound',
    path: '/pi-upper-bound',
    titleKey: 'piUpperBound',
    topicId: 'applications-graphs',
    order: 70,
    difficulty: 'beginner',
    source: { type: 'exercise', section: '9.2' },
    summary: {
      en: 'Use inscribed polygons to approach an upper bound for pi.',
      zh: '用内接正多边形观察 π 的上界。',
    },
  },
  {
    id: 'miller-rabin',
    path: '/miller-rabin',
    titleKey: 'millerRabinTest',
    topicId: 'applications-graphs',
    order: 80,
    difficulty: 'advanced',
    source: { type: 'book', section: '13.3' },
    summary: {
      en: 'Quickly screen large prime candidates probabilistically.',
      zh: '用概率测试快速筛选大素数。',
    },
  },
  {
    id: 'rsa',
    path: '/rsa',
    titleKey: 'rsaAlgorithm',
    topicId: 'applications-graphs',
    order: 90,
    difficulty: 'advanced',
    source: { type: 'book', section: '13.4' },
    summary: {
      en: 'Combine primes, GCD, inverses, and fast modular power.',
      zh: '组合素数、GCD、模逆元和快速幂。',
    },
  },
];

export const algorithmCatalog: AlgorithmCatalogItem[] = algorithmCatalogSeed.map((item) => ({
  ...item,
  coreConcept: coreConcepts[item.id] ?? item.summary,
  learningNote: item.source.type === 'extra' ? extensionLearningNote : undefined,
}));

export function getSourceLabel(item: AlgorithmCatalogItem, lang: Language): string {
  if (item.source.type === 'extra') {
    return lang === 'zh' ? '扩展' : 'Extra';
  }

  if (!item.source.section) {
    return '';
  }

  if (item.source.type === 'exercise') {
    return lang === 'zh' ? `习题 ${item.source.section}` : `Exercise ${item.source.section}`;
  }

  return item.source.section;
}

export function getDifficultyLabel(difficulty: Difficulty, lang: Language): string {
  const labels: Record<Difficulty, LocalizedText> = {
    beginner: {
      en: 'Beginner',
      zh: '入门',
    },
    intermediate: {
      en: 'Intermediate',
      zh: '进阶',
    },
    advanced: {
      en: 'Advanced',
      zh: '高级',
    },
  };

  return labels[difficulty][lang];
}

export function getAlgorithmPath(id: string): string {
  const item = getAlgorithmById(id);
  if (!item) {
    throw new Error(`Unknown algorithm id: ${id}`);
  }
  return item.path;
}

export function getAlgorithmById(id: string): AlgorithmCatalogItem | undefined {
  return algorithmCatalog.find((algorithm) => algorithm.id === id);
}

export function getAlgorithmsForTopic(topicId: TopicId): AlgorithmCatalogItem[] {
  return algorithmCatalog
    .filter((item) => item.topicId === topicId)
    .sort((a, b) => a.order - b.order);
}

export function getAlgorithmNavigation(id: string): AlgorithmNavigationInfo | undefined {
  const current = getAlgorithmById(id);
  if (!current) {
    return undefined;
  }

  const topic = topicCatalog.find((item) => item.id === current.topicId);
  if (!topic) {
    return undefined;
  }

  const topicAlgorithms = getAlgorithmsForTopic(current.topicId);
  const currentIndex = topicAlgorithms.findIndex((item) => item.id === id);

  return {
    current,
    topic,
    previous: currentIndex > 0 ? topicAlgorithms[currentIndex - 1] : undefined,
    next: currentIndex < topicAlgorithms.length - 1 ? topicAlgorithms[currentIndex + 1] : undefined,
  };
}

export function searchAlgorithms(options: AlgorithmSearchOptions): AlgorithmCatalogItem[] {
  const {
    query = '',
    lang,
    sourceType = 'all',
    difficulty = 'all',
    topicId = 'all',
  } = options;
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedQueryVariants = getSearchQueryVariants(normalizedQuery, lang);
  const topicOrder = new Map(topicCatalog.map((topic) => [topic.id, topic.order]));

  return algorithmCatalog
    .filter((item) => sourceType === 'all' || item.source.type === sourceType)
    .filter((item) => difficulty === 'all' || item.difficulty === difficulty)
    .filter((item) => topicId === 'all' || item.topicId === topicId)
    .filter((item) => {
      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        item.id,
        item.path,
        item.titleKey,
        translations.en[item.titleKey] ?? '',
        translations.zh[item.titleKey] ?? '',
        item.summary.en,
        item.summary.zh,
        item.coreConcept.en,
        item.coreConcept.zh,
        item.learningNote?.en ?? '',
        item.learningNote?.zh ?? '',
        item.summary[lang],
        item.coreConcept[lang],
      ]
        .join(' ')
        .toLowerCase();

      return normalizedQueryVariants.some((queryVariant) => searchableText.includes(queryVariant));
    })
    .sort((a, b) => {
      const topicDiff = (topicOrder.get(a.topicId) ?? 0) - (topicOrder.get(b.topicId) ?? 0);
      return topicDiff || a.order - b.order;
    });
}
