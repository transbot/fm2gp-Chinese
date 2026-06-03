# Home Topic Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current long home-page algorithm lists with a bilingual topic dashboard that helps users browse algorithms by theme, difficulty, and learning purpose.

**Architecture:** Keep the first implementation local to `src/pages/Home.tsx`, matching the existing page structure and avoiding a broad metadata registry refactor. Add typed bilingual metadata arrays and render a recommended path strip plus five topic sections, all linking to existing routes.

**Tech Stack:** React 18, TypeScript, React Router, Tailwind CSS, existing `LanguageContext` and `translations`.

---

## File Structure

- Modify: `src/pages/Home.tsx`
  - Owns home-page-only algorithm metadata.
  - Renders the bilingual recommended learning path.
  - Renders five topic dashboard sections.
  - Keeps existing header, quote, book cover, blog link, GitHub link, and language toggle.

- No new production files.

- No new tests are required for this visual-only home-page restructuring. Verification uses lint, TypeScript, tests, build, and manual browser checks.

## Task 1: Add Bilingual Dashboard Metadata

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Define local types above `Home`**

Add these types after the existing imports:

```ts
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface AlgorithmItem {
  path: string;
  label: string;
  section: string;
  difficulty: Difficulty;
  summary: string;
}

interface TopicSection {
  id: string;
  title: string;
  description: string;
  recommendedStart: string;
  algorithms: AlgorithmItem[];
}
```

- [ ] **Step 2: Add bilingual metadata factory inside `Home` after `links`**

Insert this function inside `Home`, after the `links` object and before rendering:

```ts
const difficultyLabels: Record<Difficulty, string> = {
  beginner: lang === 'zh' ? '入门' : 'Beginner',
  intermediate: lang === 'zh' ? '进阶' : 'Intermediate',
  advanced: lang === 'zh' ? '高级' : 'Advanced',
};

const topicSections: TopicSection[] = lang === 'zh'
  ? [
      {
        id: 'search-sequence',
        title: '查找与序列',
        description: '从线性扫描、区间边界到原地序列变换，理解循环不变式。',
        recommendedStart: '线性查找',
        algorithms: [
          { path: '/linear-search', label: t.linearSearchTitle, section: '10.7', difficulty: 'beginner', summary: '逐个比较元素，理解最基本的遍历。' },
          { path: '/binary-search', label: t.binarySearchTitle, section: '10.8', difficulty: 'intermediate', summary: '在有序区间中定位边界。' },
          { path: '/swap', label: t.swapTitle, section: '11.2', difficulty: 'beginner', summary: '交换相邻区间，作为旋转等算法的基础。' },
          { path: '/rotate', label: t.rotateAlgorithm, section: '11.3', difficulty: 'intermediate', summary: '用区间交换理解序列旋转。' },
          { path: '/cycle', label: t.cycleTitle, section: '11.4', difficulty: 'intermediate', summary: '把置换分解成不相交循环。' },
          { path: '/reverse', label: t.reverseTitle, section: '11.5', difficulty: 'beginner', summary: '用双指针完成原地逆序。' },
        ],
      },
      {
        id: 'sorting-heap',
        title: '排序与堆',
        description: '比较分治、分区和树形数组结构中的不同组织方式。',
        recommendedStart: '归并排序',
        algorithms: [
          { path: '/merge-sort', label: t.mergeSortTitle, section: '扩展', difficulty: 'intermediate', summary: '稳定的分治排序，适合理解递归合并。' },
          { path: '/quick-sort', label: t.quickSortTitle, section: '扩展', difficulty: 'advanced', summary: '通过基准分区实现高效原地排序。' },
          { path: '/heap', label: t.heapTitle, section: '扩展', difficulty: 'intermediate', summary: '用数组表示近似完全二叉树。' },
        ],
      },
      {
        id: 'number-theory',
        title: '数论基础',
        description: '从素数、筛法到模运算定理，为密码学示例打基础。',
        recommendedStart: '埃拉托色尼筛法',
        algorithms: [
          { path: '/sieve', label: t.sieveOfEratosthenes, section: '3.2-3.3', difficulty: 'beginner', summary: '批量筛出素数，理解空间换时间。' },
          { path: '/prime-counting', label: t.primeCounting, section: '习题 3.3', difficulty: 'intermediate', summary: '观察 π(n) 与 n/ln(n) 的近似关系。' },
          { path: '/palindromic-primes', label: t.palindromicPrimes, section: '习题 3.4', difficulty: 'beginner', summary: '探索不同进制下的回文素数。' },
          { path: '/prime-checker', label: t.primeChecker, section: '5.1', difficulty: 'beginner', summary: '用试除法判断一个数是否为素数。' },
          { path: '/fermat', label: t.fermatTitle, section: '5.2', difficulty: 'intermediate', summary: '理解概率素性测试的基础。' },
          { path: '/euler', label: t.eulerTitle, section: '5.5', difficulty: 'intermediate', summary: '把费马小定理推广到互素整数。' },
        ],
      },
      {
        id: 'gcd-modular',
        title: 'GCD 与模运算',
        description: '把除法、余数、最大公约数和乘法逆元连成一条线。',
        recommendedStart: '欧几里得算法',
        algorithms: [
          { path: '/gcm', label: t.euclideanGcm, section: '4.2', difficulty: 'beginner', summary: '用余数反复缩小 GCD 问题。' },
          { path: '/division', label: t.divisionTitle, section: '4.5', difficulty: 'beginner', summary: '通过重复减法理解商和余数。' },
          { path: '/stein-gcd', label: t.steinGcdTitle, section: '12.1-12.2', difficulty: 'intermediate', summary: '用移位和减法替代除法。' },
          { path: '/extended-gcd', label: t.extendedGcdAlgorithm, section: '12.3-12.4', difficulty: 'advanced', summary: '求出贝祖系数和模逆元。' },
          { path: '/gcd-comparison', label: t.gcdComparison, section: '习题 12.1', difficulty: 'intermediate', summary: '比较欧几里得算法和斯坦因算法性能。' },
        ],
      },
      {
        id: 'applications-graphs',
        title: '综合应用与图',
        description: '把前面的数论、幂算法和抽象代数思想组合成更完整的应用。',
        recommendedStart: '埃及乘法',
        algorithms: [
          { path: '/multiply', label: t.egyptianMultiplication, section: '2.1', difficulty: 'beginner', summary: '用倍增和选择替代重复加法。' },
          { path: '/power', label: t.powerTitle, section: '7.5', difficulty: 'intermediate', summary: '把埃及乘法推广到快速幂。' },
          { path: '/fibonacci', label: t.fibonacci, section: '习题 7.1', difficulty: 'beginner', summary: '观察朴素递归的指数增长。' },
          { path: '/fast-fibonacci', label: t.fastFibonacci, section: '7.7', difficulty: 'advanced', summary: '用矩阵幂在 O(log n) 时间计算斐波那契数。' },
          { path: '/shortest-path', label: t.shortestPath, section: '8.6', difficulty: 'advanced', summary: '在热带半环上复用矩阵幂思想。' },
          { path: '/graph-traversal', label: t.graphTraversalTitle, section: '扩展', difficulty: 'beginner', summary: '比较 BFS 队列和 DFS 栈。' },
          { path: '/pi-upper-bound', label: t.piUpperBound, section: '习题 9.2', difficulty: 'beginner', summary: '用内接正多边形观察 π 的上界。' },
          { path: '/miller-rabin', label: t.millerRabinTest, section: '13.3', difficulty: 'advanced', summary: '用概率测试快速筛选大素数。' },
          { path: '/rsa', label: t.rsaAlgorithm, section: '13.4', difficulty: 'advanced', summary: '组合素数、GCD、模逆元和快速幂。' },
        ],
      },
    ]
  : [
      {
        id: 'search-sequence',
        title: 'Search and Sequences',
        description: 'Move from linear scans and range boundaries to in-place sequence transformations.',
        recommendedStart: 'Linear Search',
        algorithms: [
          { path: '/linear-search', label: t.linearSearchTitle, section: '10.7', difficulty: 'beginner', summary: 'Check elements one by one and learn basic iteration.' },
          { path: '/binary-search', label: t.binarySearchTitle, section: '10.8', difficulty: 'intermediate', summary: 'Find boundaries inside an ordered range.' },
          { path: '/swap', label: t.swapTitle, section: '11.2', difficulty: 'beginner', summary: 'Exchange adjacent ranges as a building block.' },
          { path: '/rotate', label: t.rotateAlgorithm, section: '11.3', difficulty: 'intermediate', summary: 'Understand rotation through range exchange.' },
          { path: '/cycle', label: t.cycleTitle, section: '11.4', difficulty: 'intermediate', summary: 'Decompose permutations into disjoint cycles.' },
          { path: '/reverse', label: t.reverseTitle, section: '11.5', difficulty: 'beginner', summary: 'Reverse a sequence in place with two pointers.' },
        ],
      },
      {
        id: 'sorting-heap',
        title: 'Sorting and Heaps',
        description: 'Compare divide-and-conquer, partitioning, and tree-shaped array structures.',
        recommendedStart: 'Merge Sort',
        algorithms: [
          { path: '/merge-sort', label: t.mergeSortTitle, section: 'Extra', difficulty: 'intermediate', summary: 'A stable divide-and-conquer sort built around merging.' },
          { path: '/quick-sort', label: t.quickSortTitle, section: 'Extra', difficulty: 'advanced', summary: 'Sort in place by partitioning around a pivot.' },
          { path: '/heap', label: t.heapTitle, section: 'Extra', difficulty: 'intermediate', summary: 'Represent a nearly complete binary tree in an array.' },
        ],
      },
      {
        id: 'number-theory',
        title: 'Number Theory Basics',
        description: 'Build from primes and sieves toward modular arithmetic theorems.',
        recommendedStart: 'Sieve of Eratosthenes',
        algorithms: [
          { path: '/sieve', label: t.sieveOfEratosthenes, section: '3.2-3.3', difficulty: 'beginner', summary: 'Find primes in batches and see space-for-time tradeoffs.' },
          { path: '/prime-counting', label: t.primeCounting, section: 'Exercise 3.3', difficulty: 'intermediate', summary: 'Compare π(n) with the approximation n/ln(n).' },
          { path: '/palindromic-primes', label: t.palindromicPrimes, section: 'Exercise 3.4', difficulty: 'beginner', summary: 'Explore palindromic primes in different bases.' },
          { path: '/prime-checker', label: t.primeChecker, section: '5.1', difficulty: 'beginner', summary: 'Use trial division to test primality.' },
          { path: '/fermat', label: t.fermatTitle, section: '5.2', difficulty: 'intermediate', summary: 'Understand the basis of probabilistic primality tests.' },
          { path: '/euler', label: t.eulerTitle, section: '5.5', difficulty: 'intermediate', summary: 'Generalize Fermat to coprime integers.' },
        ],
      },
      {
        id: 'gcd-modular',
        title: 'GCD and Modular Arithmetic',
        description: 'Connect division, remainders, greatest common divisors, and inverses.',
        recommendedStart: 'Euclidean Algorithm',
        algorithms: [
          { path: '/gcm', label: t.euclideanGcm, section: '4.2', difficulty: 'beginner', summary: 'Repeatedly reduce a GCD problem using remainders.' },
          { path: '/division', label: t.divisionTitle, section: '4.5', difficulty: 'beginner', summary: 'Understand quotient and remainder through subtraction.' },
          { path: '/stein-gcd', label: t.steinGcdTitle, section: '12.1-12.2', difficulty: 'intermediate', summary: 'Replace division with shifts and subtraction.' },
          { path: '/extended-gcd', label: t.extendedGcdAlgorithm, section: '12.3-12.4', difficulty: 'advanced', summary: 'Compute Bezout coefficients and modular inverses.' },
          { path: '/gcd-comparison', label: t.gcdComparison, section: 'Exercise 12.1', difficulty: 'intermediate', summary: 'Compare Euclidean and Stein GCD performance.' },
        ],
      },
      {
        id: 'applications-graphs',
        title: 'Applications and Graphs',
        description: 'Combine number theory, power algorithms, and abstraction into larger examples.',
        recommendedStart: 'Egyptian Multiplication',
        algorithms: [
          { path: '/multiply', label: t.egyptianMultiplication, section: '2.1', difficulty: 'beginner', summary: 'Replace repeated addition with doubling and selection.' },
          { path: '/power', label: t.powerTitle, section: '7.5', difficulty: 'intermediate', summary: 'Generalize Egyptian multiplication into fast power.' },
          { path: '/fibonacci', label: t.fibonacci, section: 'Exercise 7.1', difficulty: 'beginner', summary: 'Observe exponential growth in naive recursion.' },
          { path: '/fast-fibonacci', label: t.fastFibonacci, section: '7.7', difficulty: 'advanced', summary: 'Use matrix powers to compute Fibonacci in O(log n).' },
          { path: '/shortest-path', label: t.shortestPath, section: '8.6', difficulty: 'advanced', summary: 'Reuse matrix power over the tropical semiring.' },
          { path: '/graph-traversal', label: t.graphTraversalTitle, section: 'Extra', difficulty: 'beginner', summary: 'Compare BFS queues and DFS stacks.' },
          { path: '/pi-upper-bound', label: t.piUpperBound, section: 'Exercise 9.2', difficulty: 'beginner', summary: 'Use inscribed polygons to approach an upper bound for π.' },
          { path: '/miller-rabin', label: t.millerRabinTest, section: '13.3', difficulty: 'advanced', summary: 'Quickly screen large prime candidates probabilistically.' },
          { path: '/rsa', label: t.rsaAlgorithm, section: '13.4', difficulty: 'advanced', summary: 'Combine primes, GCD, inverses, and fast modular power.' },
        ],
      },
    ];
```

- [ ] **Step 3: Add bilingual recommended path metadata**

Add this below `topicSections`:

```ts
const recommendedPath = lang === 'zh'
  ? [
      { path: '/linear-search', label: '线性查找' },
      { path: '/binary-search', label: '二分查找' },
      { path: '/gcm', label: 'GCD' },
      { path: '/power', label: '快速幂' },
      { path: '/rsa', label: 'RSA' },
    ]
  : [
      { path: '/linear-search', label: 'Linear Search' },
      { path: '/binary-search', label: 'Binary Search' },
      { path: '/gcm', label: 'GCD' },
      { path: '/power', label: 'Power Algorithm' },
      { path: '/rsa', label: 'RSA' },
    ];
```

- [ ] **Step 4: Run type check**

Run:

```bash
npx tsc -p tsconfig.app.json --noEmit
```

Expected: PASS.

## Task 2: Render Recommended Learning Path

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Replace the old `bookAlgorithms` and `advancedAlgorithms` arrays**

Remove the old `bookAlgorithms` and `advancedAlgorithms` arrays. The new `topicSections` metadata from Task 1 replaces both.

- [ ] **Step 2: Add recommended path UI after the header card**

Insert this JSX after the header card and before the topic dashboard:

```tsx
<div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-800">
        {lang === 'zh' ? '推荐学习顺序' : 'Recommended Learning Path'}
      </h2>
      <p className="text-sm text-gray-600 mt-1">
        {lang === 'zh'
          ? '如果你不确定从哪里开始，可以按这条路线逐步进入核心概念。'
          : 'If you are not sure where to start, follow this path into the core ideas.'}
      </p>
    </div>
    <span className="text-xs px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 self-start sm:self-auto">
      {lang === 'zh' ? '入门路线' : 'Beginner path'}
    </span>
  </div>
  <div className="flex flex-wrap items-center gap-2">
    {recommendedPath.map((item, index) => (
      <React.Fragment key={item.path}>
        <Link
          to={item.path}
          className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
        >
          {item.label}
        </Link>
        {index < recommendedPath.length - 1 && (
          <span className="text-gray-300" aria-hidden="true">→</span>
        )}
      </React.Fragment>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Import `Fragment`**

Update the React import:

```ts
import { Fragment } from 'react';
```

Then replace `React.Fragment` in the JSX above with `Fragment`.

- [ ] **Step 4: Run type check**

Run:

```bash
npx tsc -p tsconfig.app.json --noEmit
```

Expected: PASS.

## Task 3: Render Topic Dashboard Sections

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Replace old list sections**

Remove the old "Book Algorithms Section" and "Advanced Algorithms Section" JSX blocks.

- [ ] **Step 2: Add topic dashboard JSX in their place**

Insert this JSX where the old sections were:

```tsx
<div className="space-y-4">
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
        {lang === 'zh' ? '按主题浏览算法' : 'Browse Algorithms by Topic'}
      </h2>
      <p className="text-sm text-gray-600 mt-1">
        {lang === 'zh'
          ? '每个主题都保留章节信息，并标出适合开始的位置。'
          : 'Each topic keeps section references and marks a good starting point.'}
      </p>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {topicSections.map((topic) => (
      <section
        key={topic.id}
        className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{topic.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
          </div>
          <div className="flex sm:flex-col gap-2 sm:items-end text-xs">
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {topic.algorithms.length} {lang === 'zh' ? '个算法' : 'algorithms'}
            </span>
            <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700">
              {lang === 'zh' ? '从 ' : 'Start: '}{topic.recommendedStart}
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {topic.algorithms.map((algorithm) => (
            <Link
              key={algorithm.path}
              to={algorithm.path}
              className="block py-3 first:pt-0 last:pb-0 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <div className="font-medium text-blue-700 group-hover:text-blue-900">
                    {algorithm.label}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{algorithm.summary}</p>
                </div>
                <div className="flex gap-2 shrink-0 text-xs">
                  <span className="px-2 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200">
                    {algorithm.section}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                    {difficultyLabels[algorithm.difficulty]}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Run lint with zero warnings**

Run:

```bash
npx eslint . --max-warnings=0
```

Expected: PASS.

## Task 4: Verify Bilingual Behavior and Final Quality Gates

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Check Chinese metadata**

Open `src/pages/Home.tsx` and verify these Chinese strings exist:

```text
按主题浏览算法
推荐学习顺序
查找与序列
排序与堆
数论基础
GCD 与模运算
综合应用与图
```

- [ ] **Step 2: Check English metadata**

Open `src/pages/Home.tsx` and verify these English strings exist:

```text
Browse Algorithms by Topic
Recommended Learning Path
Search and Sequences
Sorting and Heaps
Number Theory Basics
GCD and Modular Arithmetic
Applications and Graphs
```

- [ ] **Step 3: Run final verification**

Run:

```bash
npx eslint . --max-warnings=0
npx tsc -p tsconfig.app.json --noEmit
npm run test:run
npm run build
```

Expected:

- ESLint exits 0 with no warnings.
- TypeScript exits 0.
- Vitest reports all tests passing.
- Vite build exits 0.

- [ ] **Step 4: Manual browser check**

Start the app:

```bash
npm run dev
```

Expected manual checks:

- Home page shows the recommended path.
- Home page shows five topic sections.
- Switching language updates topic names, descriptions, summaries, difficulty labels, and route labels.
- Existing links still navigate to the same algorithm pages.
- Mobile width stacks sections into one column and does not clip text.

## Self-Review

Spec coverage:

- Topic dashboard: covered by Tasks 1 and 3.
- Bilingual product requirement: covered by Tasks 1 and 4.
- Recommended learning path: covered by Task 2.
- Existing routes retained: covered by metadata paths and Task 4.
- Verification: covered by Task 4.

Placeholder scan:

- No TBD, TODO, placeholder, or unspecified implementation steps are present.

Type consistency:

- `Difficulty`, `AlgorithmItem`, and `TopicSection` are defined before use.
- `difficultyLabels` keys match the `Difficulty` union.
- `topicSections` and `recommendedPath` are local to `Home`.
