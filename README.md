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

《数学与泛型编程：高效编程的奥秘》中文配套仓库与双语算法演示应用。Alexander A. Stepanov、Daniel E. Rose 著，周靖译；清华大学出版社，2026 年 10 月第 1 版、第 1 次印刷。ISBN：978-7-302-72595-4（据本版版权页核实）。

读者入口：[按章演示](https://fm2gp-chinese.bookzhou.com/book) · [C++ 配套代码](配套代码(fm2gpcode)/) · [习题参考解答](solutions/) · [教学课件](课件(Course%20Materials)/) · [参考文献](参考文档(References)/)

## 中文版封面/封底

![image](https://github.com/transbot/fm2gp-Chinese/blob/main/public/%E6%95%B0%E5%AD%A6%E4%B8%8E%E6%B3%9B%E5%9E%8B%E7%BC%96%E7%A8%8B%EF%BC%9A%E9%AB%98%E6%95%88%E7%BC%96%E7%A8%8B%E7%9A%84%E5%A5%A5%E7%A7%98-%E5%B9%B3%E5%B1%95%E5%B0%81.png)


## 访问地址

- 中文主页：[周靖的博客](https://bookzhou.com)
- 中英文算法可视化 Web app：[https://fm2gp-chinese.bookzhou.com/](https://fm2gp-chinese.bookzhou.com/)

**手机版** · 用手机扫码打开网页版

<img src="public/images/mobile-web-qr.png" alt="网页版应用二维码" width="185" height="185" />

## 当前产品状态

本版按章提供 14 章、3 个附录的目录，包含 107 个节入口和 69 个习题入口。按路径去重有 **40 个演示**、**24 节专门正文**，以及第14章三个全书回顾主题。目录覆盖不等于每节都有交互或完整解答；逐节状态、资源和待补项见[本版覆盖清单](docs/book-coverage.md)。

- **跟着本书学**：埃及乘法 → 泛型幂 → 矩阵与斐波那契 → 图上最短路。原有数组、排序与查找路线保留为“算法入门”。
- **章内阅读**：群与同构、环与域、归纳证明、类型与概念、排列，以及附录速查；逐行依据可独立展开。
- **一致的阅读导航**：双语搜索、节与习题精确定位、完整来源查询参数和历史阅读位置恢复。
- **输入与回放**：新增的轨迹演示提供草稿应用、独立步骤回看及语言切换；旧演示的交互能力以各页面和验收记录为准。

## 已实现的算法可视化

| 来源 | 演示 | 说明 |
|---|---|---|
| 10.7 | [10.7节 - 线性查找](https://fm2gp-chinese.bookzhou.com/linear-search) | 逐个比较元素，理解最基本的遍历。 |
| 扩展 | [前缀和](https://fm2gp-chinese.bookzhou.com/prefix-sum) | 预处理累计和，快速回答区间查询。 |
| 10.8 | [10.8节 - 二叉(二分)查找](https://fm2gp-chinese.bookzhou.com/binary-search) | 在有序区间中定位边界。 |
| 扩展 | [频率计数](https://fm2gp-chinese.bookzhou.com/frequency-count) | 一次扫描统计每个值出现的次数。 |
| 扩展 | [两数之和](https://fm2gp-chinese.bookzhou.com/two-sum) | 记录已见过的值，寻找满足目标和的一对元素。 |
| 11.2 | [11.2节 - 区间交换](https://fm2gp-chinese.bookzhou.com/swap) | 交换相邻区间，作为旋转等算法的基础。 |
| 11.3 | [11.3节 - 演示序列的"旋转"算法](https://fm2gp-chinese.bookzhou.com/rotate) | 用区间交换理解序列旋转。 |
| 11.4 | [排列的循环分解与搬移](https://fm2gp-chinese.bookzhou.com/cycle) | 从 11.1 的排列分解到 11.4 的循环搬移，沿来源表执行 rotate_cycle_from。 |
| 11.5、11.6、11.7 | [反转：递归与内存自适应](https://fm2gp-chinese.bookzhou.com/reverse) | 比较双向反转、前向递归反转和共享缓冲区的自适应反转。 |
| 扩展 | [冒泡排序](https://fm2gp-chinese.bookzhou.com/bubble-sort) | 通过比较和交换相邻元素完成排序。 |
| 扩展 | [插入排序](https://fm2gp-chinese.bookzhou.com/insertion-sort) | 维护有序前缀，把新元素插入正确位置。 |
| 扩展 | [选择排序](https://fm2gp-chinese.bookzhou.com/selection-sort) | 每轮选择未排序部分的最小元素。 |
| 扩展 | [归并排序](https://fm2gp-chinese.bookzhou.com/merge-sort) | 稳定的分治排序，适合理解递归合并。 |
| 扩展 | [快速排序](https://fm2gp-chinese.bookzhou.com/quick-sort) | 通过基准分区实现高效原地排序。 |
| 扩展 | [堆操作](https://fm2gp-chinese.bookzhou.com/heap) | 用数组表示近似完全二叉树。 |
| 3.2、3.3 | [3.2节-3.3节 - 埃拉托色尼筛法](https://fm2gp-chinese.bookzhou.com/sieve) | 批量筛出素数，理解空间换时间。 |
| 习题 3.3 | [习题3.3 - 素数计数函数 (计算较慢，请耐心等待)](https://fm2gp-chinese.bookzhou.com/prime-counting) | 观察 π(n) 与 n/ln(n) 的近似关系。 |
| 习题 3.4 | [习题3.4 - 回文素数](https://fm2gp-chinese.bookzhou.com/palindromic-primes) | 探索不同进制下的回文素数。 |
| 5.1 | [5.1节 - 判断一个数是否为素数](https://fm2gp-chinese.bookzhou.com/prime-checker) | 用试除法判断一个数是否为素数。 |
| 5.2 | [5.2节 - 费马小定理](https://fm2gp-chinese.bookzhou.com/fermat) | 理解概率素性测试的基础。 |
| 5.5 | [5.5节 - 欧拉定理](https://fm2gp-chinese.bookzhou.com/euler) | 把费马小定理推广到互素整数。 |
| 4.2 | [4.2节 - 欧几里得算法(GCM/GCD)](https://fm2gp-chinese.bookzhou.com/gcm) | 用余数反复缩小 GCD 问题。 |
| 4.5、4.6 | [求余与求商：倍增和斐波那契](https://fm2gp-chinese.bookzhou.com/division) | 从逐次减法到倍增与斐波那契求余；观察候选量、运算次数与商余共享。 |
| 12.1、12.2 | [12.1-12.2节 - 斯坦因GCD算法（二进制GCD）](https://fm2gp-chinese.bookzhou.com/stein-gcd) | 用移位和减法替代除法。 |
| 12.3、12.4 | [12.3节和12.4节 - 贝祖定理与扩展GCD算法(含习题12.7）](https://fm2gp-chinese.bookzhou.com/extended-gcd) | 求出贝祖系数和模逆元。 |
| 习题 12.1 | [习题12.1 - 对比用斯坦因算法和欧几里得算法计算GCD的性能](https://fm2gp-chinese.bookzhou.com/gcd-comparison) | 比较欧几里得算法和斯坦因算法性能。 |
| 2.1、2.2 | [2.1—2.2节 - 埃及乘法：递归与迭代](https://fm2gp-chinese.bookzhou.com/multiply) | 用倍增和选择替代重复加法。 |
| 7.1、7.2、7.3、7.4、7.5、7.6 | [同一个幂算法](https://fm2gp-chinese.bookzhou.com/power) | 保持折半与累积流程，更换对象和合并运算。 |
| 习题 7.1 | [习题7.1 - 最初级的斐波那契数列算法需要执行多少次加法（时间复杂度:O(φⁿ)）](https://fm2gp-chinese.bookzhou.com/fibonacci) | 观察朴素递归的指数增长。 |
| 7.7 | [7.7节 - 使用幂算法计算第n个斐波那契数（时间复杂度:O(log⁡n)）](https://fm2gp-chinese.bookzhou.com/fast-fibonacci) | 用矩阵幂在 O(log n) 时间计算斐波那契数。 |
| 8.6 | [8.6节 - 找出有向图中任意两个节点之间的最短距离](https://fm2gp-chinese.bookzhou.com/shortest-path) | 在热带半环上复用矩阵幂思想。 |
| 扩展 | [图遍历（BFS/DFS）](https://fm2gp-chinese.bookzhou.com/graph-traversal) | 比较 BFS 队列和 DFS 栈。 |
| 习题 9.2 | [习题9.2 - π 的下界与上界](https://fm2gp-chinese.bookzhou.com/pi-upper-bound) | 内接半周长给出 π 的下界，外切半周长给出上界。 六边形：3 < π < 2√3 ≈ 3.464102。 |
| 13.3 | [13.3节 - 米勒-拉宾(Miller-Rabin)素性测试](https://fm2gp-chinese.bookzhou.com/miller-rabin) | 用概率测试快速筛选大素数。 |
| 13.4 | [13.4节 - RSA公钥密码系统](https://fm2gp-chinese.bookzhou.com/rsa) | 组合素数、GCD、模逆元和快速幂。 |
| 8.1、8.7、8.8 | [多项式带余除法与最大公约数](https://fm2gp-chinese.bookzhou.com/polynomial-gcd) | 在有理数系数多项式中逐步消元、求余，复用泛型GCD循环，最后首一化。 |
| 8.1 | [霍纳法则：多项式求值](https://fm2gp-chinese.bookzhou.com/horner) | 比较逐项求值与嵌套累积，观察表达式、变量和运算次数。 |
| 6.1、6.2 | [运算与代数结构](https://fm2gp-chinese.bookzhou.com/concepts/algebra) | 从集合与运算的例子理解结合律、单位元素和逆元。 |
| 8.5、8.6 | [矩阵与可达性](https://fm2gp-chinese.bookzhou.com/concepts/matrices) | 从矩阵中的一个格子理解乘法，再用布尔运算研究图的可达性。 |
| 10.4、10.5、10.6、C.7 | [迭代器与区间](https://fm2gp-chinese.bookzhou.com/concepts/iterators) | 比较迭代器能力、移动代价和半开区间的尾后位置。 |

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
npx tsc -p tsconfig.node.json --noEmit
npm run test:run
npm run build
```

本次集中收尾的实际检查结果见[评审验收报告](docs/verification/edition-closeout/README.md)。这是待合并的评审版本；正式发布验收另行执行。

历史记录：[2026-11-05 读者入口调整](https://github.com/transbot/fm2gp-Chinese/blob/f19725917d9fa24c8f33b2e9c288e48da3338392/docs/verification/2026-11-05-reader-update.md)；[第一、二轮发布证据归档](https://github.com/transbot/fm2gp-Chinese/tree/archive/release-phase1-phase2-evidence/docs/verification/release-phase1-phase2)。这些记录保留原日期与测试基线，不作为本次通过数量。

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
Companion repository and bilingual algorithm demos for *From Mathematics to Generic Programming*, Chinese edition: 《数学与泛型编程：高效编程的奥秘》. Written by Alexander A. Stepanov and Daniel E. Rose, translated by Zhou Jing; published by Tsinghua University Press, first edition and first printing, October 2026. ISBN: 978-7-302-72595-4 (verified against this edition's copyright page).

Reader resources: [Demos by chapter](https://fm2gp-chinese.bookzhou.com/book) · [Companion C++ code](配套代码(fm2gpcode)/) · [Exercise solutions](solutions/) · [Teaching slides](课件(Course%20Materials)/) · [References](参考文档(References)/)

## Chinese Edition Cover / Back Cover

![image](https://github.com/transbot/fm2gp-Chinese/blob/main/public/%E6%95%B0%E5%AD%A6%E4%B8%8E%E6%B3%9B%E5%9E%8B%E7%BC%96%E7%A8%8B%EF%BC%9A%E9%AB%98%E6%95%88%E7%BC%96%E7%A8%8B%E7%9A%84%E5%A5%A5%E7%A7%98-%E5%B9%B3%E5%B1%95%E5%B0%81.png)

## Links

- Chinese homepage: [Zhou Jing's Blog](https://bookzhou.com)
- Bilingual algorithm visualization Web app: [https://fm2gp-chinese.bookzhou.com/](https://fm2gp-chinese.bookzhou.com/)

**Mobile version** · Scan with your phone to open the web app

<img src="public/images/mobile-web-qr.png" alt="QR code for the web app" width="185" height="185" />

## Current Product Status

The chapter directory covers 14 chapters, 3 appendices, 107 section entries and 69 exercise entries. There are **40 unique demos**, **24 authored section readers**, and three Chapter 14 recap themes. Directory coverage does not imply a demo or complete solution for every entry; see the [edition coverage inventory](docs/book-coverage.md).

- **Learn with the book**: Egyptian multiplication → generic power → matrices and Fibonacci → shortest paths. Array, sorting and search routes remain under Algorithm foundations.
- **Chapter reading**: groups and isomorphisms, rings and fields, induction, types and concepts, permutations and appendix reference cards, with independently expandable proof reasons.
- **Reading navigation**: bilingual search, exact section/exercise lookup, complete source query strings and history position restoration.
- **Input and replay**: newer trace demos support input application, independent snapshots and language switching; older demos retain their documented interaction capabilities.

## Implemented Algorithm Visualizations

| Source | Demo | Description |
|---|---|---|
| 10.7 | [Section 10.7 - Linear Search](https://fm2gp-chinese.bookzhou.com/linear-search) | Check elements one by one and learn basic iteration. |
| Extra | [Prefix Sum](https://fm2gp-chinese.bookzhou.com/prefix-sum) | Preprocess cumulative sums for fast range queries. |
| 10.8 | [Section 10.8 - Binary Search](https://fm2gp-chinese.bookzhou.com/binary-search) | Find boundaries inside an ordered range. |
| Extra | [Frequency Count](https://fm2gp-chinese.bookzhou.com/frequency-count) | Count how many times each value appears in one scan. |
| Extra | [Two Sum](https://fm2gp-chinese.bookzhou.com/two-sum) | Find a pair by storing values already seen. |
| 11.2 | [Section 11.2 - Range Swap](https://fm2gp-chinese.bookzhou.com/swap) | Exchange adjacent ranges as a building block. |
| 11.3 | [Section 11.3 - Demonstration of Sequence Rotation Algorithm](https://fm2gp-chinese.bookzhou.com/rotate) | Understand rotation through range exchange. |
| 11.4 | [Permutation cycles and data transfers](https://fm2gp-chinese.bookzhou.com/cycle) | From permutations in 11.1 to source-directed cycle transfers with rotate_cycle_from in 11.4. |
| 11.5、11.6、11.7 | [Reversal: recursion and memory adaptation](https://fm2gp-chinese.bookzhou.com/reverse) | Compare bidirectional, forward recursive, and shared-buffer adaptive reversal. |
| Extra | [Bubble Sort](https://fm2gp-chinese.bookzhou.com/bubble-sort) | Sort by comparing and swapping adjacent values. |
| Extra | [Insertion Sort](https://fm2gp-chinese.bookzhou.com/insertion-sort) | Maintain a sorted prefix and insert each new key. |
| Extra | [Selection Sort](https://fm2gp-chinese.bookzhou.com/selection-sort) | Repeatedly select the smallest remaining element. |
| Extra | [Merge Sort](https://fm2gp-chinese.bookzhou.com/merge-sort) | A stable divide-and-conquer sort built around merging. |
| Extra | [Quick Sort](https://fm2gp-chinese.bookzhou.com/quick-sort) | Sort in place by partitioning around a pivot. |
| Extra | [Heap Operations](https://fm2gp-chinese.bookzhou.com/heap) | Represent a nearly complete binary tree in an array. |
| 3.2、3.3 | [Section 3.2-3.3 - Sieve of Eratosthenes](https://fm2gp-chinese.bookzhou.com/sieve) | Find primes in batches and see space-for-time tradeoffs. |
| Exercise 3.3 | [Exercise 3.3 - Prime Counting Function](https://fm2gp-chinese.bookzhou.com/prime-counting) | Compare pi(n) with the approximation n/ln(n). |
| Exercise 3.4 | [Exercise 3.4 - Palindromic Primes](https://fm2gp-chinese.bookzhou.com/palindromic-primes) | Explore palindromic primes in different bases. |
| 5.1 | [Section 5.1 - Prime Number Checker](https://fm2gp-chinese.bookzhou.com/prime-checker) | Use trial division to test primality. |
| 5.2 | [Section 5.2 - Fermat's Little Theorem](https://fm2gp-chinese.bookzhou.com/fermat) | Understand the basis of probabilistic primality tests. |
| 5.5 | [Section 5.5 - Euler's Theorem](https://fm2gp-chinese.bookzhou.com/euler) | Generalize Fermat to coprime integers. |
| 4.2 | [Section 4.2 - Euclidean Algorithm (GCM/GCD)](https://fm2gp-chinese.bookzhou.com/gcm) | Repeatedly reduce a GCD problem using remainders. |
| 4.5、4.6 | [Remainders and quotients: doubling and Fibonacci](https://fm2gp-chinese.bookzhou.com/division) | From repeated subtraction to doubling and Fibonacci remainder; follow candidates, counts, and shared quotient/remainder work. |
| 12.1、12.2 | [Section 12.1-12.2 - Stein's GCD Algorithm (Binary GCD)](https://fm2gp-chinese.bookzhou.com/stein-gcd) | Replace division with shifts and subtraction. |
| 12.3、12.4 | [Section 12.3 & 12.4 - Bézout's Identity & Extended GCD (Including Exercise 12.7)](https://fm2gp-chinese.bookzhou.com/extended-gcd) | Compute Bezout coefficients and modular inverses. |
| Exercise 12.1 | [Exercise 12.1 - Performance Comparison of Stein and Euclidean GCD Algorithms](https://fm2gp-chinese.bookzhou.com/gcd-comparison) | Compare Euclidean and Stein GCD performance. |
| 2.1、2.2 | [Sections 2.1–2.2 - Egyptian Multiplication: Recursion and Iteration](https://fm2gp-chinese.bookzhou.com/multiply) | Replace repeated addition with doubling and selection. |
| 7.1、7.2、7.3、7.4、7.5、7.6 | [One power algorithm](https://fm2gp-chinese.bookzhou.com/power) | Keep halving and accumulation while changing objects and the combining operation. |
| Exercise 7.1 | [Exercise 7.1 - How Many Additions Does the Basic Fibonacci Algorithm Need? (Time Complexity: O(φⁿ))](https://fm2gp-chinese.bookzhou.com/fibonacci) | Observe exponential growth in naive recursion. |
| 7.7 | [Section 7.7 - Calculate nth Fibonacci Number Using Power Algorithm (Time Complexity: O(log n))](https://fm2gp-chinese.bookzhou.com/fast-fibonacci) | Use matrix powers to compute Fibonacci in O(log n). |
| 8.6 | [Section 8.6 - Finding Shortest Distance Between Any Two Nodes in a Directed Graph](https://fm2gp-chinese.bookzhou.com/shortest-path) | Reuse matrix power over the tropical semiring. |
| Extra | [Graph Traversal (BFS/DFS)](https://fm2gp-chinese.bookzhou.com/graph-traversal) | Compare BFS queues and DFS stacks. |
| Exercise 9.2 | [Exercise 9.2 - Lower and Upper Bounds for π](https://fm2gp-chinese.bookzhou.com/pi-upper-bound) | Inscribed half-perimeters bound π below; circumscribed half-perimeters bound it above. Hexagons: 3 < π < 2√3 ≈ 3.464102. |
| 13.3 | [Section 13.3 - Miller-Rabin Primality Test](https://fm2gp-chinese.bookzhou.com/miller-rabin) | Quickly screen large prime candidates probabilistically. |
| 13.4 | [Section 13.4 - RSA Algorithm](https://fm2gp-chinese.bookzhou.com/rsa) | Combine primes, GCD, inverses, and fast modular power. |
| 8.1、8.7、8.8 | [Polynomial division with remainder and GCD](https://fm2gp-chinese.bookzhou.com/polynomial-gcd) | Eliminate leading terms with exact rational coefficients, reuse the generic GCD loop, then make the result monic. |
| 8.1 | [Horner’s rule: polynomial evaluation](https://fm2gp-chinese.bookzhou.com/horner) | Compare direct evaluation with nested accumulation through expressions, variables, and operation counts. |
| 6.1、6.2 | [Operations and algebraic structures](https://fm2gp-chinese.bookzhou.com/concepts/algebra) | Explore associativity, identities, and inverses through sets and operations. |
| 8.5、8.6 | [Matrices and reachability](https://fm2gp-chinese.bookzhou.com/concepts/matrices) | Understand multiplication one matrix cell at a time, then explore graph reachability with Boolean operations. |
| 10.4、10.5、10.6、C.7 | [Iterators and ranges](https://fm2gp-chinese.bookzhou.com/concepts/iterators) | Compare iterator capabilities, movement costs, and the past-the-end position of half-open ranges. |

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
npx tsc -p tsconfig.node.json --noEmit
npm run test:run
npm run build
```

Current results are recorded in the [edition closeout review report](docs/verification/edition-closeout/README.md). This is a review version; production acceptance follows the later merge.

Historical records: [reader update, 2026-11-05](https://github.com/transbot/fm2gp-Chinese/blob/f19725917d9fa24c8f33b2e9c288e48da3338392/docs/verification/2026-11-05-reader-update.md); [Phase 1–2 release evidence archive](https://github.com/transbot/fm2gp-Chinese/tree/archive/release-phase1-phase2-evidence/docs/verification/release-phase1-phase2). Their original dates and test baselines are preserved and are not this run’s passing counts.

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
