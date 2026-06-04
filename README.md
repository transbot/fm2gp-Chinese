# fm2gp-Chinese / 《数学与泛型编程：高效编程的奥秘》

<div align="center">
  <h3>
    <a href="#中文版">中文版</a> | <a href="#english-version">English Version</a>
  </h3>
  <p>请选择语言 / Please select language</p>
</div>

<hr>

<div id="中文版"></div>

## 中文版

本项目是《数学与泛型编程：高效编程的奥秘》的中文配套项目，包含面向读者的交互式算法可视化 Web app。

1. 本书预计由清华大学出版社出版。
2. Web app 提供中英文双语界面，帮助读者逐步观察算法状态、循环不变式、复杂度和关键操作。
3. 项目会在翻译、出版、勘误和后续重印过程中持续完善。

## 访问地址

- 中文主页：[周靖的博客](https://bookzhou.com)
- 中英文算法可视化 Web app：[https://fm2gp-chinese.bookzhou.com/](https://fm2gp-chinese.bookzhou.com/)

## 当前产品状态

当前 Web app 已从单纯的算法列表升级为双语学习工具：

- **主题化首页**：按“查找与序列、排序与堆、数论基础、GCD 与模运算、综合应用与图”组织算法，并支持搜索、主题、来源和难度筛选。
- **统一算法元数据**：`src/data/algorithmCatalog.ts` 维护路径、主题、难度、来源、排序、双语标题、双语摘要和核心概念。
- **双语搜索体验**：搜索会索引中英文标题、摘要、核心概念和补充说明，例如中文“线性”和英文 `linear` 都能找到线性查找。
- **分阶段入门路径**：推荐路线按“数组扫描与表、基础排序、有序查找”组织，帮助初学者逐步进入二分查找。
- **页内学习导航**：每个算法页自动显示当前主题、来源、难度、上一篇和下一篇。
- **入门扩展算法**：新增冒泡排序、插入排序、选择排序、前缀和、频率计数和两数之和，作为非书中内容的基础补充。
- **路由级懒加载**：算法页按需加载，主入口 chunk 已从约 900 kB 降到约 255 kB。
- **验证输出更干净**：已升级到 Vite 8 工具链，清除了 Browserslist 过期、chunk-size 和 Vite React 插件废弃警告。

## 已实现的算法可视化

| 来源 | 难度 | 算法 | 说明 |
|------|------|------|------|
| 2.1 | 入门 | 埃及乘法 | 俄式乘法，用倍增和选择替代重复加法 |
| 3.2-3.3 | 入门 | 埃拉托色尼筛法 | 批量筛出素数，理解空间换时间 |
| 习题 3.3 | 进阶 | 素数计数函数 | 观察 π(n) 与 n/ln(n) 的近似关系 |
| 习题 3.4 | 入门 | 回文素数 | 探索不同进制下的回文素数 |
| 4.2 | 入门 | 欧几里得算法 | 用余数反复缩小 GCD 问题 |
| 4.5 | 入门 | 除法算法 | 通过重复减法理解商和余数 |
| 5.1 | 入门 | 素数判定 | 用试除法判断一个数是否为素数 |
| 5.2 | 进阶 | 费马小定理 | 理解概率素性测试的基础 |
| 5.5 | 进阶 | 欧拉定理 | 把费马小定理推广到互素整数 |
| 7.5 | 进阶 | 幂算法 | 把埃及乘法推广到快速幂 |
| 习题 7.1 | 入门 | 基础斐波那契 | 观察朴素递归的指数增长 |
| 7.7 | 高级 | 快速斐波那契 | 用矩阵幂在 O(log n) 时间计算斐波那契数 |
| 8.6 | 高级 | 有向图最短距离 | 在热带半环上复用矩阵幂思想 |
| 习题 9.2 | 入门 | π 的上限 | 用内接正多边形观察 π 的上界 |
| 10.7 | 入门 | 线性查找 | 逐个比较元素，理解最基本的遍历 |
| 10.8 | 进阶 | 二分查找 | 在有序区间中定位边界 |
| 11.2 | 入门 | 区间交换 | 交换相邻区间，作为旋转等算法的基础 |
| 11.3 | 进阶 | 旋转算法 | 用区间交换理解序列旋转 |
| 11.4 | 进阶 | 循环分解 | 把置换分解成不相交循环 |
| 11.5 | 入门 | 逆序 | 用双指针完成原地逆序 |
| 习题 12.1 | 进阶 | GCD 性能对比 | 比较欧几里得算法和斯坦因算法性能 |
| 12.1-12.2 | 进阶 | 斯坦因 GCD | 用移位和减法替代除法 |
| 12.3-12.4 | 高级 | 扩展 GCD | 求出贝祖系数和模逆元 |
| 13.3 | 高级 | 米勒-拉宾测试 | 用概率测试快速筛选大素数 |
| 13.4 | 高级 | RSA 演示 | 组合素数、GCD、模逆元和快速幂 |
| 扩展 | 入门 | 前缀和 | 预处理累计和，快速回答区间查询 |
| 扩展 | 入门 | 频率计数 | 一次扫描统计每个值出现的次数 |
| 扩展 | 入门 | 两数之和 | 记录已见过的值，寻找满足目标和的一对元素 |
| 扩展 | 入门 | 冒泡排序 | 通过比较和交换相邻元素完成排序 |
| 扩展 | 入门 | 插入排序 | 维护有序前缀，把新元素插入正确位置 |
| 扩展 | 入门 | 选择排序 | 每轮选择未排序部分的最小元素 |
| 扩展 | 进阶 | 归并排序 | 稳定的分治排序，适合理解递归合并 |
| 扩展 | 高级 | 快速排序 | 通过基准分区实现高效原地排序 |
| 扩展 | 进阶 | 堆操作 | 用数组表示近似完全二叉树 |
| 扩展 | 入门 | 图遍历 | 比较 BFS 队列和 DFS 栈 |

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite 8
- **测试工具**：Vitest 4
- **路由**：React Router 6
- **样式**：Tailwind CSS
- **动画**：Framer Motion
- **图可视化**：React Flow
- **图布局**：Dagre
- **图标**：Lucide React

## 本地开发

```bash
npm install
npm run dev -- --host 127.0.0.1
```

默认开发地址：

```text
http://127.0.0.1:5173/
```

## 验证命令

```bash
npx eslint . --max-warnings=0
npx tsc -p tsconfig.app.json --noEmit
npm run test:run
npm run build
```

当前验证状态：

- ESLint 通过
- TypeScript 类型检查通过
- Vitest：17 个测试文件，171 个测试通过
- 生产构建通过
- 构建输出无 Browserslist 过期提示、无 chunk-size 警告、无 Vite React 插件废弃警告

### 移动端基线检查

- 390 x 844：主页、二分查找、RSA、素数计数、最短路径
- 430 x 932：图遍历
- 768 x 1024：堆操作
- 已修复旧页面移动端 header 裁切，并降低素数计数默认计算规模
- 宽图表、图片和矩阵使用局部横向滚动容器，避免整页横向溢出
- 素数计数和最短路径已为宽视觉内容接入局部滚动 frame；上架前仍建议在真机中复核手势滚动体验

## 项目结构

```text
src/
  components/              React 可视化页面和通用 UI
  components/algorithms/   扩展算法页面
  components/common/       AlgorithmLayout、StepController、页内导航等通用组件
  context/                 双语上下文
  data/                    algorithmCatalog 元数据
  hooks/                   步骤控制 Hook
  i18n/                    中英文翻译
  lib/algorithms/          纯算法步骤生成器和测试
  pages/                   首页
```

## 截图

![image](https://github.com/user-attachments/assets/e038b9b9-685d-4ef9-babe-5949f4193c8e)
![image](https://github.com/user-attachments/assets/b13d930e-e65f-40c1-815a-3d931a0170b1)
![image](https://github.com/user-attachments/assets/2bfed8d4-627d-489f-aaaf-7f28063f3473)
![image](https://github.com/user-attachments/assets/df5db73a-ddac-435f-9a40-4258345ca1c6)

---

**若不通晓数学，便难以真正理解世间万物。** ——罗杰·培根，《大著作》

这是一本关于编程的书，但它有别于常见的编程书籍。书中不仅包含算法和代码，还融入了诸多数学证明，以及从古代到 20 世纪的许多数学发现的历史背景，力求为读者呈现更完整的知识图景。

更具体地说，本书聚焦于泛型编程。这是一种编程范式，它起源于上世纪 80 年代，并在 90 年代随着 C++ 标准模板库（Standard Template Library，STL）的诞生而逐渐普及。我们可以将其定义如下：

**定义 1.1**：泛型编程是一种编程范式，它关注如何设计算法和数据结构，使其在尽可能广泛的应用场景中保持高性能。

<div align="center" style="margin: 2em 0;">
  <a href="#fm2gp-chinese--数学与泛型编程高效编程的奥秘">返回顶部 / Back to top</a> | <a href="#english-version">切换至英文版 / Switch to English</a>
</div>

<hr>

<div id="english-version"></div>

## English Version

This project supports the Chinese edition of _From Mathematics to Generic Programming_ by Alexander A. Stepanov and Daniel E. Rose. It provides an interactive bilingual algorithm visualization app for readers.

1. The Chinese edition is expected to be published by Tsinghua University Press.
2. The Web app is available in Chinese and English, helping readers inspect algorithm states, invariants, complexity, and key operations step by step.
3. The project will continue to improve throughout translation, publication, errata, and reprint cycles.

## Links

- Chinese homepage: [Zhou Jing's Blog](https://bookzhou.com)
- Bilingual algorithm visualization Web app: [https://fm2gp-chinese.bookzhou.com/](https://fm2gp-chinese.bookzhou.com/)

## Current Product Status

The Web app has evolved from a flat algorithm list into a bilingual learning tool:

- **Topic dashboard**: algorithms are grouped into Search and Sequences, Sorting and Heaps, Number Theory Basics, GCD and Modular Arithmetic, and Applications and Graphs, with search plus topic, source, and difficulty filters.
- **Central algorithm metadata**: `src/data/algorithmCatalog.ts` stores path, topic, difficulty, source, order, bilingual titles, bilingual summaries, and core concepts.
- **Bilingual search experience**: search indexes English and Chinese titles, summaries, core concepts, and supplemental notes, so Chinese `线性` and English `linear` both find Linear Search.
- **Staged beginner path**: the recommended route now moves through Array Scans and Tables, Basic Sorting, and Ordered Search before Binary Search.
- **In-page learning navigation**: each algorithm page shows the current topic, source, difficulty, previous algorithm, and next algorithm.
- **Beginner extension algorithms**: Bubble Sort, Insertion Sort, Selection Sort, Prefix Sum, Frequency Count, and Two Sum are included as non-book foundational supplements.
- **Route-level lazy loading**: algorithm pages are loaded on demand; the main entry chunk was reduced from about 900 kB to about 255 kB.
- **Cleaner verification output**: the project now uses the Vite 8 toolchain and no longer emits Browserslist, chunk-size, or Vite React plugin deprecation warnings during verification.

## Implemented Algorithm Visualizations

| Source | Difficulty | Algorithm | Description |
|--------|------------|-----------|-------------|
| 2.1 | Beginner | Egyptian Multiplication | Replace repeated addition with doubling and selection |
| 3.2-3.3 | Beginner | Sieve of Eratosthenes | Find primes in batches and see space-for-time tradeoffs |
| Exercise 3.3 | Intermediate | Prime Counting Function | Compare pi(n) with the approximation n/ln(n) |
| Exercise 3.4 | Beginner | Palindromic Primes | Explore palindromic primes in different bases |
| 4.2 | Beginner | Euclidean Algorithm | Repeatedly reduce a GCD problem using remainders |
| 4.5 | Beginner | Division Algorithm | Understand quotient and remainder through subtraction |
| 5.1 | Beginner | Prime Checker | Use trial division to test primality |
| 5.2 | Intermediate | Fermat's Little Theorem | Understand the basis of probabilistic primality tests |
| 5.5 | Intermediate | Euler's Theorem | Generalize Fermat to coprime integers |
| 7.5 | Intermediate | Power Algorithm | Generalize Egyptian multiplication into fast power |
| Exercise 7.1 | Beginner | Basic Fibonacci | Observe exponential growth in naive recursion |
| 7.7 | Advanced | Fast Fibonacci | Use matrix powers to compute Fibonacci in O(log n) |
| 8.6 | Advanced | Shortest Path in Directed Graph | Reuse matrix power over the tropical semiring |
| Exercise 9.2 | Beginner | Upper Bound for pi | Use inscribed polygons to approach an upper bound for pi |
| 10.7 | Beginner | Linear Search | Check elements one by one and learn basic iteration |
| 10.8 | Intermediate | Binary Search | Find boundaries inside an ordered range |
| 11.2 | Beginner | Range Swap | Exchange adjacent ranges as a building block |
| 11.3 | Intermediate | Rotation Algorithm | Understand rotation through range exchange |
| 11.4 | Intermediate | Cycle Decomposition | Decompose permutations into disjoint cycles |
| 11.5 | Beginner | Reverse | Reverse a sequence in place with two pointers |
| Exercise 12.1 | Intermediate | GCD Performance Comparison | Compare Euclidean and Stein GCD performance |
| 12.1-12.2 | Intermediate | Stein's GCD | Replace division with shifts and subtraction |
| 12.3-12.4 | Advanced | Extended GCD | Compute Bezout coefficients and modular inverses |
| 13.3 | Advanced | Miller-Rabin Test | Quickly screen large prime candidates probabilistically |
| 13.4 | Advanced | RSA Demo | Combine primes, GCD, inverses, and fast modular power |
| Extra | Beginner | Prefix Sum | Preprocess cumulative sums for fast range queries |
| Extra | Beginner | Frequency Count | Count how many times each value appears in one scan |
| Extra | Beginner | Two Sum | Find a pair by storing values already seen |
| Extra | Beginner | Bubble Sort | Sort by comparing and swapping adjacent values |
| Extra | Beginner | Insertion Sort | Maintain a sorted prefix and insert each new key |
| Extra | Beginner | Selection Sort | Repeatedly select the smallest remaining element |
| Extra | Intermediate | Merge Sort | A stable divide-and-conquer sort built around merging |
| Extra | Advanced | Quick Sort | Sort in place by partitioning around a pivot |
| Extra | Intermediate | Heap Operations | Represent a nearly complete binary tree in an array |
| Extra | Beginner | Graph Traversal | Compare BFS queues and DFS stacks |

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 8
- **Testing**: Vitest 4
- **Routing**: React Router 6
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Graph Visualization**: React Flow
- **Graph Layout**: Dagre
- **Icons**: Lucide React

## Local Development

```bash
npm install
npm run dev -- --host 127.0.0.1
```

Default development URL:

```text
http://127.0.0.1:5173/
```

## Verification Commands

```bash
npx eslint . --max-warnings=0
npx tsc -p tsconfig.app.json --noEmit
npm run test:run
npm run build
```

Current verification status:

- ESLint passes
- TypeScript typecheck passes
- Vitest: 17 test files, 171 tests pass
- Production build passes
- Build output has no Browserslist outdated warning, no chunk-size warning, and no Vite React plugin deprecation warning

### Mobile Baseline Checks

- 390 x 844: home, binary search, RSA, prime counting, shortest path
- 430 x 932: graph traversal
- 768 x 1024: heap operations
- Legacy mobile header clipping has been fixed, and the default prime-counting workload has been reduced
- Wide charts, images, and matrices use localized horizontal frames to avoid whole-page horizontal overflow
- Prime counting and shortest path now use localized frames for wide visuals; before app-store release, verify the touch scrolling experience on real devices

## Project Structure

```text
src/
  components/              React visualization pages and shared UI
  components/algorithms/   Extension algorithm pages
  components/common/       AlgorithmLayout, StepController, in-page navigation
  context/                 Bilingual language context
  data/                    algorithmCatalog metadata
  hooks/                   Step control hooks
  i18n/                    English and Chinese translations
  lib/algorithms/          Pure algorithm step generators and tests
  pages/                   Home page
```

## Screenshots

![image](https://github.com/user-attachments/assets/e038b9b9-685d-4ef9-babe-5949f4193c8e)
![image](https://github.com/user-attachments/assets/b13d930e-e65f-40c1-815a-3d931a0170b1)
![image](https://github.com/user-attachments/assets/2bfed8d4-627d-489f-aaaf-7f28063f3473)
![image](https://github.com/user-attachments/assets/df5db73a-ddac-435f-9a40-4258345ca1c6)

---

It is impossible to know things of this world unless you know mathematics. — Roger Bacon, *Opus Majus*

This is a programming book, but it is different from common programming books. The book not only contains algorithms and code but also incorporates many mathematical proofs, as well as the historical backgrounds of many mathematical discoveries from ancient times to the 20th century, striving to present a more complete knowledge picture for readers.

More specifically, this book focuses on generic programming. This is a programming paradigm that originated in the 1980s and gradually became popular in the 1990s with the birth of the C++ Standard Template Library (STL). We can define it as follows:

**Definition 1.1**: Generic programming is a programming paradigm that focuses on how to design algorithms and data structures so that they maintain high performance in the widest possible range of application scenarios.

<div align="center" style="margin: 2em 0;">
  <a href="#fm2gp-chinese--数学与泛型编程高效编程的奥秘">Back to top / 返回顶部</a> | <a href="#中文版">Switch to Chinese / 切换至中文版</a>
</div>
