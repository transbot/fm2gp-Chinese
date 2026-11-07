# 本版覆盖清单 / Edition coverage

基线：`f19725917d9fa24c8f33b2e9c288e48da3338392`。此清单由实际路由、algorithmCatalog、conceptLessons、sectionReaders、bookContent 和存在的资源文件生成；生成命令：`node scripts/build-edition-inventory.cjs`。本版收尾是评审版本，尚不等于正式域名已发布。

目录可访问 **14 章、3 个附录、107 个节锚点、69 个习题锚点**；按路径去重有 **40 个演示**。**24 节有专门章内正文**，另有第14章三个回顾主题。目录完整不代表每节都有专门正文、演示或完整习题解答。

The directory contains 14 chapters, 3 appendices, 107 section anchors and 69 exercise anchors. There are 40 unique demo routes, 24 authored section readers, and three Chapter 14 recap themes. Directory coverage is not a claim of complete interactive or exercise-solution coverage.

## 标记 / Legend

- **正文 / Reader**：专门编写的章内导读、固定例子或交互。
- **逐行依据 / Step reasons**：第6.3—6.5、6.7、8.4、9.7节的证明依据可分别展开；附录B是按方法卡展开。
- **演示 / Demo**：独立交互路由；同一路径只统计一次，跨节关联不重复计数。
- **资源 / Resource**：仓库配套代码、参考解答、课件或参考文献，点击离开应用。资源存在不代表已对全部内容重新校勘。
- **待补 / Not authored**：当前只有节标题及通用导读；章级资源仍可访问。习题无文件且无章内推导／演示时，明确标为待补。

## 按章与节 / Chapters and sections

### 1 绪论 / Introduction

入口：[/book/1](https://fm2gp-chinese.bookzhou.com/book/1)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [1.1 编程与数学 / Programming and mathematics](https://fm2gp-chinese.bookzhou.com/book/1#section-1-1) | 待补专门正文 / Not authored | — |
| [1.2 历史视角 / A historical perspective](https://fm2gp-chinese.bookzhou.com/book/1#section-1-2) | 待补专门正文 / Not authored | — |
| [1.3 预备知识 / Prerequisites](https://fm2gp-chinese.bookzhou.com/book/1#section-1-3) | 待补专门正文 / Not authored | — |
| [1.4 全书导览 / Overview of the book](https://fm2gp-chinese.bookzhou.com/book/1#section-1-4) | 待补专门正文 / Not authored | — |

仓库资源 / Repository resources：[课件(Course Materials)/FM2GP_Course_Slides_Pt1.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt1.pdf)

### 2 初探算法 / The first algorithm

入口：[/book/2](https://fm2gp-chinese.bookzhou.com/book/2)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [2.1 埃及乘法 / Egyptian multiplication](https://fm2gp-chinese.bookzhou.com/book/2#section-2-1) | 待补专门正文 / Not authored | [/multiply](https://fm2gp-chinese.bookzhou.com/multiply) |
| [2.2 改进算法 / Improving the algorithm](https://fm2gp-chinese.bookzhou.com/book/2#section-2-2) | 待补专门正文 / Not authored | [/multiply](https://fm2gp-chinese.bookzhou.com/multiply) |
| [2.3 小结 / Summary](https://fm2gp-chinese.bookzhou.com/book/2#section-2-3) | 待补专门正文 / Not authored | — |

仓库资源 / Repository resources：[配套代码(fm2gpcode)/ch02.cpp](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch02.cpp) · [配套代码(fm2gpcode)/ch02.h](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch02.h) · [参考文档(References)/Addition Machines by Floyd & Knuth.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/Addition%20Machines%20by%20Floyd%20&%20Knuth.pdf) · [课件(Course Materials)/FM2GP_Course_Slides_Pt1.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt1.pdf)

| 习题 / Exercise | 已有入口 / Available entries |
|---|---|
| [2.1](https://fm2gp-chinese.bookzhou.com/book/2#exercise-2-1) | [solutions/2_1.pdf](../solutions/2_1.pdf) · [solutions/2_1.tex](../solutions/2_1.tex) |

### 3 古希腊数论 / Ancient Greek number theory

入口：[/book/3](https://fm2gp-chinese.bookzhou.com/book/3)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [3.1 整数的几何性质 / Geometric properties of integers](https://fm2gp-chinese.bookzhou.com/book/3#section-3-1) | 待补专门正文 / Not authored | — |
| [3.2 筛选素数 / Sieving primes](https://fm2gp-chinese.bookzhou.com/book/3#section-3-2) | 待补专门正文 / Not authored | [/sieve](https://fm2gp-chinese.bookzhou.com/sieve) |
| [3.3 实现埃拉托色尼筛法并优化代码 / Implementing and optimizing the sieve of Eratosthenes](https://fm2gp-chinese.bookzhou.com/book/3#section-3-3) | 待补专门正文 / Not authored | [/sieve](https://fm2gp-chinese.bookzhou.com/sieve) |
| [3.4 完全数 / Perfect numbers](https://fm2gp-chinese.bookzhou.com/book/3#section-3-4) | 待补专门正文 / Not authored | — |
| [3.5 毕达哥拉斯学派的构想 / The Pythagorean program](https://fm2gp-chinese.bookzhou.com/book/3#section-3-5) | 待补专门正文 / Not authored | — |
| [3.6 毕氏构想的严重缺陷 / A fatal flaw in the Pythagorean program](https://fm2gp-chinese.bookzhou.com/book/3#section-3-6) | 待补专门正文 / Not authored | — |
| [3.7 小结 / Summary](https://fm2gp-chinese.bookzhou.com/book/3#section-3-7) | 待补专门正文 / Not authored | — |

仓库资源 / Repository resources：[配套代码(fm2gpcode)/ch03.cpp](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch03.cpp) · [配套代码(fm2gpcode)/ch03.h](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch03.h) · [参考文档(References)/It is easy to determine whether a given integer is prime.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/It%20is%20easy%20to%20determine%20whether%20a%20given%20integer%20is%20prime.pdf) · [课件(Course Materials)/FM2GP_Course_Slides_Pt1.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt1.pdf)

| 习题 / Exercise | 已有入口 / Available entries |
|---|---|
| [3.1](https://fm2gp-chinese.bookzhou.com/book/3#exercise-3-1) | [solutions/3_1.md](../solutions/3_1.md) |
| [3.2](https://fm2gp-chinese.bookzhou.com/book/3#exercise-3-2) | [solutions/3_2.cpp](../solutions/3_2.cpp) |
| [3.3](https://fm2gp-chinese.bookzhou.com/book/3#exercise-3-3) | [solutions/3_3.md](../solutions/3_3.md) · [/prime-counting](https://fm2gp-chinese.bookzhou.com/prime-counting) |
| [3.4](https://fm2gp-chinese.bookzhou.com/book/3#exercise-3-4) | [solutions/3_4.md](../solutions/3_4.md) · [/palindromic-primes](https://fm2gp-chinese.bookzhou.com/palindromic-primes) |
| [3.5](https://fm2gp-chinese.bookzhou.com/book/3#exercise-3-5) | [solutions/3_5.md](../solutions/3_5.md) |
| [3.6](https://fm2gp-chinese.bookzhou.com/book/3#exercise-3-6) | 待补 / No indexed solution or demo |
| [3.7](https://fm2gp-chinese.bookzhou.com/book/3#exercise-3-7) | 待补 / No indexed solution or demo |
| [3.8](https://fm2gp-chinese.bookzhou.com/book/3#exercise-3-8) | 待补 / No indexed solution or demo |

### 4 欧几里得算法 / Euclid’s algorithm

入口：[/book/4](https://fm2gp-chinese.bookzhou.com/book/4)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [4.1 雅典与亚历山大 / Athens and Alexandria](https://fm2gp-chinese.bookzhou.com/book/4#section-4-1) | 待补专门正文 / Not authored | — |
| [4.2 欧几里得最大公度算法 / Euclid’s greatest common measure algorithm](https://fm2gp-chinese.bookzhou.com/book/4#section-4-2) | 待补专门正文 / Not authored | [/gcm](https://fm2gp-chinese.bookzhou.com/gcm) |
| [4.3 数学的千年停滞 / A millennium of mathematical stagnation](https://fm2gp-chinese.bookzhou.com/book/4#section-4-3) | 待补专门正文 / Not authored | — |
| [4.4 零的奇特历史 / The strange history of zero](https://fm2gp-chinese.bookzhou.com/book/4#section-4-4) | 待补专门正文 / Not authored | — |
| [4.5 求余求商算法 / Remainder and quotient algorithms](https://fm2gp-chinese.bookzhou.com/book/4#section-4-5) | 待补专门正文 / Not authored | [/division](https://fm2gp-chinese.bookzhou.com/division) |
| [4.6 共享代码 / Sharing code](https://fm2gp-chinese.bookzhou.com/book/4#section-4-6) | 待补专门正文 / Not authored | [/division](https://fm2gp-chinese.bookzhou.com/division) |
| [4.7 验证算法有效性 / Establishing algorithm correctness](https://fm2gp-chinese.bookzhou.com/book/4#section-4-7) | 待补专门正文 / Not authored | — |
| [4.8 小结 / Summary](https://fm2gp-chinese.bookzhou.com/book/4#section-4-8) | 待补专门正文 / Not authored | — |

仓库资源 / Repository resources：[配套代码(fm2gpcode)/ch04.cpp](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch04.cpp) · [配套代码(fm2gpcode)/ch04.h](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch04.h) · [课件(Course Materials)/FM2GP_Course_Slides_Pt1.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt1.pdf)

| 习题 / Exercise | 已有入口 / Available entries |
|---|---|
| [4.1](https://fm2gp-chinese.bookzhou.com/book/4#exercise-4-1) | [solutions/4_1.md](../solutions/4_1.md) |
| [4.2](https://fm2gp-chinese.bookzhou.com/book/4#exercise-4-2) | [solutions/4_2.md](../solutions/4_2.md) |
| [4.3](https://fm2gp-chinese.bookzhou.com/book/4#exercise-4-3) | [solutions/4_3.md](../solutions/4_3.md) · [solutions/4_3.pdf](../solutions/4_3.pdf) · [solutions/4_3.tex](../solutions/4_3.tex) |
| [4.4](https://fm2gp-chinese.bookzhou.com/book/4#exercise-4-4) | [solutions/4_4.md](../solutions/4_4.md) · [solutions/4_4.pdf](../solutions/4_4.pdf) · [solutions/4_4.tex](../solutions/4_4.tex) |
| [4.5](https://fm2gp-chinese.bookzhou.com/book/4#exercise-4-5) | [solutions/4_5.md](../solutions/4_5.md) |
| [4.6](https://fm2gp-chinese.bookzhou.com/book/4#exercise-4-6) | [solutions/4_6.md](../solutions/4_6.md) · [/division](https://fm2gp-chinese.bookzhou.com/division) |
| [4.7](https://fm2gp-chinese.bookzhou.com/book/4#exercise-4-7) | [solutions/4_7.cpp](../solutions/4_7.cpp) |

### 5 现代数论的兴起 / The emergence of modern number theory

入口：[/book/5](https://fm2gp-chinese.bookzhou.com/book/5)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [5.1 梅森素数与费马素数 / Mersenne and Fermat primes](https://fm2gp-chinese.bookzhou.com/book/5#section-5-1) | 待补专门正文 / Not authored | [/prime-checker](https://fm2gp-chinese.bookzhou.com/prime-checker) |
| [5.2 费马小定理 / Fermat’s little theorem](https://fm2gp-chinese.bookzhou.com/book/5#section-5-2) | 待补专门正文 / Not authored | [/fermat](https://fm2gp-chinese.bookzhou.com/fermat) |
| [5.3 消去 / Cancellation](https://fm2gp-chinese.bookzhou.com/book/5#section-5-3) | 待补专门正文 / Not authored | — |
| [5.4 证明费马小定理 / Proving Fermat’s little theorem](https://fm2gp-chinese.bookzhou.com/book/5#section-5-4) | 待补专门正文 / Not authored | — |
| [5.5 欧拉定理 / Euler’s theorem](https://fm2gp-chinese.bookzhou.com/book/5#section-5-5) | 待补专门正文 / Not authored | [/euler](https://fm2gp-chinese.bookzhou.com/euler) |
| [5.6 模运算的应用 / Applications of modular arithmetic](https://fm2gp-chinese.bookzhou.com/book/5#section-5-6) | 待补专门正文 / Not authored | — |
| [5.7 小结 / Summary](https://fm2gp-chinese.bookzhou.com/book/5#section-5-7) | 待补专门正文 / Not authored | — |

仓库资源 / Repository resources：[参考文档(References)/致德国公主的书信.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/%E8%87%B4%E5%BE%B7%E5%9B%BD%E5%85%AC%E4%B8%BB%E7%9A%84%E4%B9%A6%E4%BF%A1.pdf) · [课件(Course Materials)/FM2GP_Course_Slides_Pt1.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt1.pdf)

| 习题 / Exercise | 已有入口 / Available entries |
|---|---|
| [5.1](https://fm2gp-chinese.bookzhou.com/book/5#exercise-5-1) | [solutions/5_1.md](../solutions/5_1.md) · [solutions/5_1.pdf](../solutions/5_1.pdf) · [solutions/5_1.tex](../solutions/5_1.tex) |
| [5.2](https://fm2gp-chinese.bookzhou.com/book/5#exercise-5-2) | 待补 / No indexed solution or demo |

### 6 数学中的抽象 / Abstraction in mathematics

入口：[/book/6](https://fm2gp-chinese.bookzhou.com/book/6)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [6.1 群 / Groups](https://fm2gp-chinese.bookzhou.com/book/6#section-6-1) | 待补专门正文 / Not authored | [/concepts/algebra](https://fm2gp-chinese.bookzhou.com/concepts/algebra) |
| [6.2 幺半群和半群 / Monoids and semigroups](https://fm2gp-chinese.bookzhou.com/book/6#section-6-2) | 待补专门正文 / Not authored | [/concepts/algebra](https://fm2gp-chinese.bookzhou.com/concepts/algebra) |
| [6.3 关于群的一些定理 / Some theorems about groups](https://fm2gp-chinese.bookzhou.com/book/6#section-6-3) | 正文 / Chapter6 | — |
| [6.4 子群和循环群 / Subgroups and cyclic groups](https://fm2gp-chinese.bookzhou.com/book/6#section-6-4) | 正文 / Chapter6 | — |
| [6.5 拉格朗日定理 / Lagrange’s theorem](https://fm2gp-chinese.bookzhou.com/book/6#section-6-5) | 正文 / Chapter6 | — |
| [6.6 理论与模型 / Theories and models](https://fm2gp-chinese.bookzhou.com/book/6#section-6-6) | 正文 / Chapter6Models | — |
| [6.7 范畴与非范畴理论的例子 / Examples of categorical and noncategorical theories](https://fm2gp-chinese.bookzhou.com/book/6#section-6-7) | 正文 / Chapter6Models | — |
| [6.8 小结 / Summary](https://fm2gp-chinese.bookzhou.com/book/6#section-6-8) | 待补专门正文 / Not authored | — |

仓库资源 / Repository resources：[参考文档(References)/p59-kapur.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/p59-kapur.pdf) · [参考文档(References)/Tecton：A Language for Manipulating Generic Objects.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/Tecton%EF%BC%9AA%20Language%20for%20Manipulating%20Generic%20Objects.pdf) · [课件(Course Materials)/FM2GP_Course_Slides_Pt2.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt2.pdf)

| 习题 / Exercise | 已有入口 / Available entries |
|---|---|
| [6.1](https://fm2gp-chinese.bookzhou.com/book/6#exercise-6-1) | 待补 / No indexed solution or demo |
| [6.2](https://fm2gp-chinese.bookzhou.com/book/6#exercise-6-2) | 待补 / No indexed solution or demo |
| [6.3](https://fm2gp-chinese.bookzhou.com/book/6#exercise-6-3) | 待补 / No indexed solution or demo |
| [6.4](https://fm2gp-chinese.bookzhou.com/book/6#exercise-6-4) | [solutions/6_4.pdf](../solutions/6_4.pdf) · [solutions/6_4.tex](../solutions/6_4.tex) |
| [6.5](https://fm2gp-chinese.bookzhou.com/book/6#exercise-6-5) | [solutions/6_5.pdf](../solutions/6_5.pdf) · [solutions/6_5.tex](../solutions/6_5.tex) |
| [6.6](https://fm2gp-chinese.bookzhou.com/book/6#exercise-6-6) | [solutions/6_6.pdf](../solutions/6_6.pdf) · [solutions/6_6.tex](../solutions/6_6.tex) |
| [6.7](https://fm2gp-chinese.bookzhou.com/book/6#exercise-6-7) | [solutions/6_7.pdf](../solutions/6_7.pdf) · [solutions/6_7.tex](../solutions/6_7.tex) |
| [6.8](https://fm2gp-chinese.bookzhou.com/book/6#exercise-6-8) | [solutions/6_8.pdf](../solutions/6_8.pdf) · [solutions/6_8.tex](../solutions/6_8.tex) |
| [6.9](https://fm2gp-chinese.bookzhou.com/book/6#exercise-6-9) | [solutions/6_9.pdf](../solutions/6_9.pdf) · [solutions/6_9.tex](../solutions/6_9.tex) |
| [6.10](https://fm2gp-chinese.bookzhou.com/book/6#exercise-6-10) | [solutions/6.10.tex](../solutions/6.10.tex) · [solutions/6_10.pdf](../solutions/6_10.pdf) |

### 7 推导泛型算法 / Deriving a generic algorithm

入口：[/book/7](https://fm2gp-chinese.bookzhou.com/book/7)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [7.1 梳理算法的要求 / Identifying algorithm requirements](https://fm2gp-chinese.bookzhou.com/book/7#section-7-1) | 待补专门正文 / Not authored | [/power](https://fm2gp-chinese.bookzhou.com/power) |
| [7.2 对A 的要求 / Requirements on A](https://fm2gp-chinese.bookzhou.com/book/7#section-7-2) | 待补专门正文 / Not authored | [/power](https://fm2gp-chinese.bookzhou.com/power) |
| [7.3 对N 的要求 / Requirements on N](https://fm2gp-chinese.bookzhou.com/book/7#section-7-3) | 待补专门正文 / Not authored | [/power](https://fm2gp-chinese.bookzhou.com/power) |
| [7.4 新的要求 / New requirements](https://fm2gp-chinese.bookzhou.com/book/7#section-7-4) | 待补专门正文 / Not authored | [/power](https://fm2gp-chinese.bookzhou.com/power) |
| [7.5 将乘法转换为幂运算 / From multiplication to exponentiation](https://fm2gp-chinese.bookzhou.com/book/7#section-7-5) | 待补专门正文 / Not authored | [/power](https://fm2gp-chinese.bookzhou.com/power) |
| [7.6 运算的泛化 / Generalizing the operation](https://fm2gp-chinese.bookzhou.com/book/7#section-7-6) | 待补专门正文 / Not authored | [/power](https://fm2gp-chinese.bookzhou.com/power) |
| [7.7 计算斐波那契数 / Computing Fibonacci numbers](https://fm2gp-chinese.bookzhou.com/book/7#section-7-7) | 待补专门正文 / Not authored | [/fast-fibonacci](https://fm2gp-chinese.bookzhou.com/fast-fibonacci) |
| [7.8 小结 / Summary](https://fm2gp-chinese.bookzhou.com/book/7#section-7-8) | 待补专门正文 / Not authored | — |

仓库资源 / Repository resources：[配套代码(fm2gpcode)/ch07.cpp](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch07.cpp) · [配套代码(fm2gpcode)/ch07.h](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch07.h) · [配套代码(fm2gpcode)/ch07_6.cpp](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch07_6.cpp) · [参考文档(References)/Addition Machines by Floyd & Knuth.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/Addition%20Machines%20by%20Floyd%20&%20Knuth.pdf) · [参考文档(References)/Generic Programming by Musser & Stepanov.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/Generic%20Programming%20by%20Musser%20&%20Stepanov.pdf) · [参考文档(References)/MapReduce：Simplied Data Processing on Large Clusters.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/MapReduce%EF%BC%9ASimplied%20Data%20Processing%20on%20Large%20Clusters.pdf) · [参考文档(References)/Tecton：A Language for Manipulating Generic Objects.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/Tecton%EF%BC%9AA%20Language%20for%20Manipulating%20Generic%20Objects.pdf) · [课件(Course Materials)/FM2GP_Course_Slides_Pt2.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt2.pdf)

| 习题 / Exercise | 已有入口 / Available entries |
|---|---|
| [7.1](https://fm2gp-chinese.bookzhou.com/book/7#exercise-7-1) | [solutions/7_1.cpp](../solutions/7_1.cpp) · [/fibonacci](https://fm2gp-chinese.bookzhou.com/fibonacci) |
| [7.2](https://fm2gp-chinese.bookzhou.com/book/7#exercise-7-2) | [solutions/7_2.cpp](../solutions/7_2.cpp) |

### 8 更多代数结构 / More algebraic structures

入口：[/book/8](https://fm2gp-chinese.bookzhou.com/book/8)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [8.1 斯蒂文、多项式与最大公约数 / Stevin, polynomials, and GCD](https://fm2gp-chinese.bookzhou.com/book/8#section-8-1) | 待补专门正文 / Not authored | [/polynomial-gcd](https://fm2gp-chinese.bookzhou.com/polynomial-gcd) · [/horner](https://fm2gp-chinese.bookzhou.com/horner) |
| [8.2 哥廷根与德国数学 / Göttingen and German mathematics](https://fm2gp-chinese.bookzhou.com/book/8#section-8-2) | 待补专门正文 / Not authored | — |
| [8.3 诺特与抽象代数的诞生 / Noether and the birth of abstract algebra](https://fm2gp-chinese.bookzhou.com/book/8#section-8-3) | 待补专门正文 / Not authored | — |
| [8.4 环 / Rings](https://fm2gp-chinese.bookzhou.com/book/8#section-8-4) | 正文 / Chapter8 | — |
| [8.5 矩阵乘法与半环 / Matrix multiplication and semirings](https://fm2gp-chinese.bookzhou.com/book/8#section-8-5) | 待补专门正文 / Not authored | [/concepts/matrices](https://fm2gp-chinese.bookzhou.com/concepts/matrices) |
| [8.6 应用：社交网络与最短路径 / Application: social networks and shortest paths](https://fm2gp-chinese.bookzhou.com/book/8#section-8-6) | 待补专门正文 / Not authored | [/shortest-path](https://fm2gp-chinese.bookzhou.com/shortest-path) · [/concepts/matrices](https://fm2gp-chinese.bookzhou.com/concepts/matrices) |
| [8.7 欧几里得整环 / Euclidean domains](https://fm2gp-chinese.bookzhou.com/book/8#section-8-7) | 待补专门正文 / Not authored | [/polynomial-gcd](https://fm2gp-chinese.bookzhou.com/polynomial-gcd) |
| [8.8 域和其他代数结构 / Fields and other algebraic structures](https://fm2gp-chinese.bookzhou.com/book/8#section-8-8) | 正文 / Chapter8 | [/polynomial-gcd](https://fm2gp-chinese.bookzhou.com/polynomial-gcd) |
| [8.9 小结 / Summary](https://fm2gp-chinese.bookzhou.com/book/8#section-8-9) | 待补专门正文 / Not authored | — |

仓库资源 / Repository resources：[配套代码(fm2gpcode)/ch08.cpp](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch08.cpp) · [配套代码(fm2gpcode)/ch08.h](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch08.h) · [参考文档(References)/p59-kapur.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/p59-kapur.pdf) · [参考文档(References)/Simon Stevin of Bruges (1548-1620).pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/Simon%20Stevin%20of%20Bruges%20\(1548-1620\).pdf) · [课件(Course Materials)/FM2GP_Course_Slides_Pt2.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt2.pdf)

| 习题 / Exercise | 已有入口 / Available entries |
|---|---|
| [8.1](https://fm2gp-chinese.bookzhou.com/book/8#exercise-8-1) | [solutions/8_1.pdf](../solutions/8_1.pdf) |
| [8.2](https://fm2gp-chinese.bookzhou.com/book/8#exercise-8-2) | 待补 / No indexed solution or demo |
| [8.3](https://fm2gp-chinese.bookzhou.com/book/8#exercise-8-3) | [/polynomial-gcd](https://fm2gp-chinese.bookzhou.com/polynomial-gcd) |
| [8.4](https://fm2gp-chinese.bookzhou.com/book/8#exercise-8-4) | 待补 / No indexed solution or demo |
| [8.5](https://fm2gp-chinese.bookzhou.com/book/8#exercise-8-5) | 待补 / No indexed solution or demo |
| [8.6](https://fm2gp-chinese.bookzhou.com/book/8#exercise-8-6) | [/book/8#zero-divisor-not-unit](https://fm2gp-chinese.bookzhou.com/book/8#zero-divisor-not-unit) |
| [8.7](https://fm2gp-chinese.bookzhou.com/book/8#exercise-8-7) | [solutions/8_7.cpp](../solutions/8_7.cpp) · [/concepts/matrices](https://fm2gp-chinese.bookzhou.com/concepts/matrices) |
| [8.8](https://fm2gp-chinese.bookzhou.com/book/8#exercise-8-8) | 待补 / No indexed solution or demo |
| [8.9](https://fm2gp-chinese.bookzhou.com/book/8#exercise-8-9) | 待补 / No indexed solution or demo |

### 9 组织数学知识 / Organizing mathematical knowledge

入口：[/book/9](https://fm2gp-chinese.bookzhou.com/book/9)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [9.1 证明 / Proofs](https://fm2gp-chinese.bookzhou.com/book/9#section-9-1) | 正文 / Chapter9 | — |
| [9.2 第一个定理 / The first theorem](https://fm2gp-chinese.bookzhou.com/book/9#section-9-2) | 待补专门正文 / Not authored | — |
| [9.3 欧几里得与公理化方法 / Euclid and the axiomatic method](https://fm2gp-chinese.bookzhou.com/book/9#section-9-3) | 待补专门正文 / Not authored | — |
| [9.4 非欧几何 / Non-Euclidean geometry](https://fm2gp-chinese.bookzhou.com/book/9#section-9-4) | 待补专门正文 / Not authored | — |
| [9.5 希尔伯特的形式主义方法 / Hilbert’s formalist approach](https://fm2gp-chinese.bookzhou.com/book/9#section-9-5) | 待补专门正文 / Not authored | — |
| [9.6 皮亚诺和他的公理 / Peano and his axioms](https://fm2gp-chinese.bookzhou.com/book/9#section-9-6) | 正文 / Chapter9 | — |
| [9.7 构建算术体系 / Constructing arithmetic](https://fm2gp-chinese.bookzhou.com/book/9#section-9-7) | 正文 / Chapter9 | — |
| [9.8 小结 / Summary](https://fm2gp-chinese.bookzhou.com/book/9#section-9-8) | 待补专门正文 / Not authored | — |

仓库资源 / Repository resources：[参考文档(References)/Social Processes and Proofs of Theorems and Programs.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/Social%20Processes%20and%20Proofs%20of%20Theorems%20and%20Programs.pdf) · [参考文档(References)/Twelve Articles on Giuseppe Peano.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/Twelve%20Articles%20on%20Giuseppe%20Peano.pdf) · [课件(Course Materials)/FM2GP_Course_Slides_Pt2.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt2.pdf)

| 习题 / Exercise | 已有入口 / Available entries |
|---|---|
| [9.1](https://fm2gp-chinese.bookzhou.com/book/9#exercise-9-1) | 待补 / No indexed solution or demo |
| [9.2](https://fm2gp-chinese.bookzhou.com/book/9#exercise-9-2) | [/pi-upper-bound](https://fm2gp-chinese.bookzhou.com/pi-upper-bound) |
| [9.3](https://fm2gp-chinese.bookzhou.com/book/9#exercise-9-3) | [solutions/9_3.pdf](../solutions/9_3.pdf) · [solutions/9_3.tex](../solutions/9_3.tex) |
| [9.4](https://fm2gp-chinese.bookzhou.com/book/9#exercise-9-4) | 待补 / No indexed solution or demo |
| [9.5](https://fm2gp-chinese.bookzhou.com/book/9#exercise-9-5) | 待补 / No indexed solution or demo |

### 10 基本编程概念 / Fundamental programming concepts

入口：[/book/10](https://fm2gp-chinese.bookzhou.com/book/10)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [10.1 亚里士多德与抽象 / Aristotle and abstraction](https://fm2gp-chinese.bookzhou.com/book/10#section-10-1) | 待补专门正文 / Not authored | — |
| [10.2 值和类型 / Values and types](https://fm2gp-chinese.bookzhou.com/book/10#section-10-2) | 正文 / Chapter10 | — |
| [10.3 概念 / Concepts](https://fm2gp-chinese.bookzhou.com/book/10#section-10-3) | 正文 / Chapter10 | — |
| [10.4 迭代器 / Iterators](https://fm2gp-chinese.bookzhou.com/book/10#section-10-4) | 待补专门正文 / Not authored | [/concepts/iterators](https://fm2gp-chinese.bookzhou.com/concepts/iterators) |
| [10.5 迭代器类别、操作和trait / Iterator categories, operations, and traits](https://fm2gp-chinese.bookzhou.com/book/10#section-10-5) | 待补专门正文 / Not authored | [/concepts/iterators](https://fm2gp-chinese.bookzhou.com/concepts/iterators) |
| [10.6 区间 / Ranges](https://fm2gp-chinese.bookzhou.com/book/10#section-10-6) | 待补专门正文 / Not authored | [/concepts/iterators](https://fm2gp-chinese.bookzhou.com/concepts/iterators) |
| [10.7 线性查找 / Linear search](https://fm2gp-chinese.bookzhou.com/book/10#section-10-7) | 待补专门正文 / Not authored | [/linear-search](https://fm2gp-chinese.bookzhou.com/linear-search) |
| [10.8 二叉查找 / Binary search](https://fm2gp-chinese.bookzhou.com/book/10#section-10-8) | 待补专门正文 / Not authored | [/binary-search](https://fm2gp-chinese.bookzhou.com/binary-search) |
| [10.9 小结 / Summary](https://fm2gp-chinese.bookzhou.com/book/10#section-10-9) | 待补专门正文 / Not authored | — |

仓库资源 / Repository resources：[配套代码(fm2gpcode)/ch10.cpp](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch10.cpp) · [配套代码(fm2gpcode)/ch10.h](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch10.h) · [参考文档(References)/Generic Programming by Musser & Stepanov.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/Generic%20Programming%20by%20Musser%20&%20Stepanov.pdf) · [参考文档(References)/The Standard Template Library by Stepanov & Lee.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/The%20Standard%20Template%20Library%20by%20Stepanov%20&%20Lee.pdf) · [课件(Course Materials)/FM2GP_Course_Slides_Pt3.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt3.pdf)

| 习题 / Exercise | 已有入口 / Available entries |
|---|---|
| [10.1](https://fm2gp-chinese.bookzhou.com/book/10#exercise-10-1) | 待补 / No indexed solution or demo |

### 11 排列算法 / Permutation algorithms

入口：[/book/11](https://fm2gp-chinese.bookzhou.com/book/11)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [11.1 排列与对换 / Permutations and transpositions](https://fm2gp-chinese.bookzhou.com/book/11#section-11-1) | 正文 / Chapter11 | — |
| [11.2 区间交换 / Swapping ranges](https://fm2gp-chinese.bookzhou.com/book/11#section-11-2) | 待补专门正文 / Not authored | [/swap](https://fm2gp-chinese.bookzhou.com/swap) |
| [11.3 旋转 / Rotation](https://fm2gp-chinese.bookzhou.com/book/11#section-11-3) | 待补专门正文 / Not authored | [/rotate](https://fm2gp-chinese.bookzhou.com/rotate) |
| [11.4 使用循环 / Using cycles](https://fm2gp-chinese.bookzhou.com/book/11#section-11-4) | 正文 / Chapter11 | [/cycle](https://fm2gp-chinese.bookzhou.com/cycle) |
| [11.5 反转 / Reversal](https://fm2gp-chinese.bookzhou.com/book/11#section-11-5) | 待补专门正文 / Not authored | [/reverse](https://fm2gp-chinese.bookzhou.com/reverse) |
| [11.6 空间复杂度 / Space complexity](https://fm2gp-chinese.bookzhou.com/book/11#section-11-6) | 待补专门正文 / Not authored | [/reverse](https://fm2gp-chinese.bookzhou.com/reverse) |
| [11.7 内存自适应算法 / Memory-adaptive algorithms](https://fm2gp-chinese.bookzhou.com/book/11#section-11-7) | 待补专门正文 / Not authored | [/reverse](https://fm2gp-chinese.bookzhou.com/reverse) |
| [11.8 小结 / Summary](https://fm2gp-chinese.bookzhou.com/book/11#section-11-8) | 待补专门正文 / Not authored | — |

仓库资源 / Repository resources：[配套代码(fm2gpcode)/ch11.cpp](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch11.cpp) · [配套代码(fm2gpcode)/ch11.h](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch11.h) · [参考文档(References)/The Standard Template Library by Stepanov & Lee.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/The%20Standard%20Template%20Library%20by%20Stepanov%20&%20Lee.pdf) · [课件(Course Materials)/FM2GP_Course_Slides_Pt3.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt3.pdf)

| 习题 / Exercise | 已有入口 / Available entries |
|---|---|
| [11.1](https://fm2gp-chinese.bookzhou.com/book/11#exercise-11-1) | [solutions/11_1.pdf](../solutions/11_1.pdf) · [solutions/11_1.tex](../solutions/11_1.tex) |
| [11.2](https://fm2gp-chinese.bookzhou.com/book/11#exercise-11-2) | [solutions/11_2.pdf](../solutions/11_2.pdf) · [solutions/11_2.tex](../solutions/11_2.tex) |
| [11.3](https://fm2gp-chinese.bookzhou.com/book/11#exercise-11-3) | [solutions/11_3.pdf](../solutions/11_3.pdf) · [solutions/11_3.tex](../solutions/11_3.tex) |
| [11.4](https://fm2gp-chinese.bookzhou.com/book/11#exercise-11-4) | 待补 / No indexed solution or demo |
| [11.5](https://fm2gp-chinese.bookzhou.com/book/11#exercise-11-5) | 待补 / No indexed solution or demo |
| [11.6](https://fm2gp-chinese.bookzhou.com/book/11#exercise-11-6) | 待补 / No indexed solution or demo |
| [11.7](https://fm2gp-chinese.bookzhou.com/book/11#exercise-11-7) | [solutions/11_7.cpp](../solutions/11_7.cpp) · [solutions/11_7.pdf](../solutions/11_7.pdf) |
| [11.8](https://fm2gp-chinese.bookzhou.com/book/11#exercise-11-8) | 待补 / No indexed solution or demo |
| [11.9](https://fm2gp-chinese.bookzhou.com/book/11#exercise-11-9) | 待补 / No indexed solution or demo |
| [11.10](https://fm2gp-chinese.bookzhou.com/book/11#exercise-11-10) | 待补 / No indexed solution or demo |
| [11.11](https://fm2gp-chinese.bookzhou.com/book/11#exercise-11-11) | 待补 / No indexed solution or demo |
| [11.12](https://fm2gp-chinese.bookzhou.com/book/11#exercise-11-12) | [solutions/11_12.pdf](../solutions/11_12.pdf) · [solutions/11_12.tex](../solutions/11_12.tex) |
| [11.13](https://fm2gp-chinese.bookzhou.com/book/11#exercise-11-13) | [/reverse](https://fm2gp-chinese.bookzhou.com/reverse) |

### 12 再论最大公约数算法 / Revisiting GCD

入口：[/book/12](https://fm2gp-chinese.bookzhou.com/book/12)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [12.1 硬件限制与一种更高效的算法 / Hardware constraints and a more efficient algorithm](https://fm2gp-chinese.bookzhou.com/book/12#section-12-1) | 待补专门正文 / Not authored | [/stein-gcd](https://fm2gp-chinese.bookzhou.com/stein-gcd) |
| [12.2 推广斯坦因算法 / Generalizing Stein’s algorithm](https://fm2gp-chinese.bookzhou.com/book/12#section-12-2) | 待补专门正文 / Not authored | [/stein-gcd](https://fm2gp-chinese.bookzhou.com/stein-gcd) |
| [12.3 贝祖定理 / Bézout’s theorem](https://fm2gp-chinese.bookzhou.com/book/12#section-12-3) | 待补专门正文 / Not authored | [/extended-gcd](https://fm2gp-chinese.bookzhou.com/extended-gcd) |
| [12.4 扩展最大公约数算法 / The extended GCD algorithm](https://fm2gp-chinese.bookzhou.com/book/12#section-12-4) | 待补专门正文 / Not authored | [/extended-gcd](https://fm2gp-chinese.bookzhou.com/extended-gcd) |
| [12.5 GCD 的应用 / Applications of GCD](https://fm2gp-chinese.bookzhou.com/book/12#section-12-5) | 待补专门正文 / Not authored | — |
| [12.6 小结 / Summary](https://fm2gp-chinese.bookzhou.com/book/12#section-12-6) | 待补专门正文 / Not authored | — |

仓库资源 / Repository resources：[配套代码(fm2gpcode)/ch12.cpp](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch12.cpp) · [配套代码(fm2gpcode)/ch12.h](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch12.h) · [课件(Course Materials)/FM2GP_Course_Slides_Pt3.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt3.pdf)

| 习题 / Exercise | 已有入口 / Available entries |
|---|---|
| [12.1](https://fm2gp-chinese.bookzhou.com/book/12#exercise-12-1) | [solutions/12_1.cpp](../solutions/12_1.cpp) · [/gcd-comparison](https://fm2gp-chinese.bookzhou.com/gcd-comparison) |
| [12.2](https://fm2gp-chinese.bookzhou.com/book/12#exercise-12-2) | 待补 / No indexed solution or demo |
| [12.3](https://fm2gp-chinese.bookzhou.com/book/12#exercise-12-3) | 待补 / No indexed solution or demo |
| [12.4](https://fm2gp-chinese.bookzhou.com/book/12#exercise-12-4) | 待补 / No indexed solution or demo |
| [12.5](https://fm2gp-chinese.bookzhou.com/book/12#exercise-12-5) | 待补 / No indexed solution or demo |
| [12.6](https://fm2gp-chinese.bookzhou.com/book/12#exercise-12-6) | 待补 / No indexed solution or demo |
| [12.7](https://fm2gp-chinese.bookzhou.com/book/12#exercise-12-7) | 待补 / No indexed solution or demo |

### 13 实际应用 / Real-world applications

入口：[/book/13](https://fm2gp-chinese.bookzhou.com/book/13)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [13.1 密码学 / Cryptography](https://fm2gp-chinese.bookzhou.com/book/13#section-13-1) | 待补专门正文 / Not authored | — |
| [13.2 素性测试 / Primality testing](https://fm2gp-chinese.bookzhou.com/book/13#section-13-2) | 待补专门正文 / Not authored | — |
| [13.3 米勒-拉宾测试 / The Miller–Rabin test](https://fm2gp-chinese.bookzhou.com/book/13#section-13-3) | 待补专门正文 / Not authored | [/miller-rabin](https://fm2gp-chinese.bookzhou.com/miller-rabin) |
| [13.4 RSA 算法：工作方式和原理 / RSA: how it works and why](https://fm2gp-chinese.bookzhou.com/book/13#section-13-4) | 待补专门正文 / Not authored | [/rsa](https://fm2gp-chinese.bookzhou.com/rsa) |
| [13.5 小结 / Summary](https://fm2gp-chinese.bookzhou.com/book/13#section-13-5) | 待补专门正文 / Not authored | — |

仓库资源 / Repository resources：[配套代码(fm2gpcode)/ch13.cpp](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch13.cpp) · [配套代码(fm2gpcode)/ch13.h](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/ch13.h) · [参考文档(References)/It is easy to determine whether a given integer is prime.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/It%20is%20easy%20to%20determine%20whether%20a%20given%20integer%20is%20prime.pdf) · [课件(Course Materials)/FM2GP_Course_Slides_Pt3.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt3.pdf)

| 习题 / Exercise | 已有入口 / Available entries |
|---|---|
| [13.1](https://fm2gp-chinese.bookzhou.com/book/13#exercise-13-1) | [solutions/13_1-13_2.cpp](../solutions/13_1-13_2.cpp) |
| [13.2](https://fm2gp-chinese.bookzhou.com/book/13#exercise-13-2) | [solutions/13_1-13_2.cpp](../solutions/13_1-13_2.cpp) |
| [13.3](https://fm2gp-chinese.bookzhou.com/book/13#exercise-13-3) | 待补 / No indexed solution or demo |
| [13.4](https://fm2gp-chinese.bookzhou.com/book/13#exercise-13-4) | 待补 / No indexed solution or demo |

### 14 全书总结 / Conclusions

入口：[/book/14](https://fm2gp-chinese.bookzhou.com/book/14)。三个主题：从乘法到通用幂、从整数求余到多项式GCD、迭代器能力与内存权衡。

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|

仓库资源 / Repository resources：[课件(Course Materials)/FM2GP_Course_Slides_Pt3.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt3.pdf)

### A 记法 / Notation

入口：[/book/A](https://fm2gp-chinese.bookzhou.com/book/A)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [A.1 记法 / Notation](https://fm2gp-chinese.bookzhou.com/book/A#section-A-1) | 正文 / AppendixReference | — |
| [A.2 示例 / Examples](https://fm2gp-chinese.bookzhou.com/book/A#section-A-2) | 正文 / AppendixReference | — |
| [A.3 蕴含与逆否命题 / Implication and contraposition](https://fm2gp-chinese.bookzhou.com/book/A#section-A-3) | 正文 / AppendixReference | — |

仓库资源 / Repository resources：暂无独立章级文件 / None indexed

### B 常用的证明方法 / Common proof techniques

入口：[/book/B](https://fm2gp-chinese.bookzhou.com/book/B)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [B.1 反证法 / Proof by contradiction](https://fm2gp-chinese.bookzhou.com/book/B#section-B-1) | 正文 / AppendixReference | — |
| [B.2 数学归纳法 / Mathematical induction](https://fm2gp-chinese.bookzhou.com/book/B#section-B-2) | 正文 / AppendixReference | — |
| [B.3 鸽巢原理 / The pigeonhole principle](https://fm2gp-chinese.bookzhou.com/book/B#section-B-3) | 正文 / AppendixReference | — |

仓库资源 / Repository resources：暂无独立章级文件 / None indexed

### C C++特有的语法或构造 / C++ syntax and constructs

入口：[/book/C](https://fm2gp-chinese.bookzhou.com/book/C)

| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |
|---|---|---|
| [C.1 模板函数 / Function templates](https://fm2gp-chinese.bookzhou.com/book/C#section-C-1) | 正文 / AppendixC | — |
| [C.2 概念 / Concepts](https://fm2gp-chinese.bookzhou.com/book/C#section-C-2) | 正文 / AppendixC | — |
| [C.3 声明语法和类型常量 / Declaration syntax and type constants](https://fm2gp-chinese.bookzhou.com/book/C#section-C-3) | 待补专门正文 / Not authored | — |
| [C.4 函数对象 / Function objects](https://fm2gp-chinese.bookzhou.com/book/C#section-C-4) | 正文 / AppendixC | — |
| [C.5 前置条件、后置条件和断言 / Preconditions, postconditions, and assertions](https://fm2gp-chinese.bookzhou.com/book/C#section-C-5) | 正文 / AppendixC | — |
| [C.6 STL 算法和数据结构 / STL algorithms and data structures](https://fm2gp-chinese.bookzhou.com/book/C#section-C-6) | 待补专门正文 / Not authored | — |
| [C.7 迭代器与区间 / Iterators and ranges](https://fm2gp-chinese.bookzhou.com/book/C#section-C-7) | 待补专门正文 / Not authored | [/concepts/iterators](https://fm2gp-chinese.bookzhou.com/concepts/iterators) |
| [C.8 使用using 实现类型别名和类型函数 / Type aliases and type functions with using](https://fm2gp-chinese.bookzhou.com/book/C#section-C-8) | 待补专门正文 / Not authored | — |
| [C.9 C++11 中的初始化列表 / Initializer lists in C++11](https://fm2gp-chinese.bookzhou.com/book/C#section-C-9) | 待补专门正文 / Not authored | — |
| [C.10 lambda 函数 / Lambda functions](https://fm2gp-chinese.bookzhou.com/book/C#section-C-10) | 待补专门正文 / Not authored | — |
| [C.11 关于inline 的说明 / About inline](https://fm2gp-chinese.bookzhou.com/book/C#section-C-11) | 待补专门正文 / Not authored | — |

仓库资源 / Repository resources：[参考文档(References)/The Standard Template Library by Stepanov & Lee.pdf](../%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3\(References\)/The%20Standard%20Template%20Library%20by%20Stepanov%20&%20Lee.pdf)

## 去重演示 / Unique demos

| 演示 / Demo | 节或习题来源 / Source |
|---|---|
| [10.7节 - 线性查找 / Section 10.7 - Linear Search](https://fm2gp-chinese.bookzhou.com/linear-search) | 10.7 |
| [前缀和 / Prefix Sum](https://fm2gp-chinese.bookzhou.com/prefix-sum) | 扩展 / Extra |
| [10.8节 - 二叉(二分)查找 / Section 10.8 - Binary Search](https://fm2gp-chinese.bookzhou.com/binary-search) | 10.8 |
| [频率计数 / Frequency Count](https://fm2gp-chinese.bookzhou.com/frequency-count) | 扩展 / Extra |
| [两数之和 / Two Sum](https://fm2gp-chinese.bookzhou.com/two-sum) | 扩展 / Extra |
| [11.2节 - 区间交换 / Section 11.2 - Range Swap](https://fm2gp-chinese.bookzhou.com/swap) | 11.2 |
| [11.3节 - 演示序列的"旋转"算法 / Section 11.3 - Demonstration of Sequence Rotation Algorithm](https://fm2gp-chinese.bookzhou.com/rotate) | 11.3 |
| [排列的循环分解与搬移 / Permutation cycles and data transfers](https://fm2gp-chinese.bookzhou.com/cycle) | 11.4 |
| [反转：递归与内存自适应 / Reversal: recursion and memory adaptation](https://fm2gp-chinese.bookzhou.com/reverse) | 11.5, 11.6, 11.7 |
| [冒泡排序 / Bubble Sort](https://fm2gp-chinese.bookzhou.com/bubble-sort) | 扩展 / Extra |
| [插入排序 / Insertion Sort](https://fm2gp-chinese.bookzhou.com/insertion-sort) | 扩展 / Extra |
| [选择排序 / Selection Sort](https://fm2gp-chinese.bookzhou.com/selection-sort) | 扩展 / Extra |
| [归并排序 / Merge Sort](https://fm2gp-chinese.bookzhou.com/merge-sort) | 扩展 / Extra |
| [快速排序 / Quick Sort](https://fm2gp-chinese.bookzhou.com/quick-sort) | 扩展 / Extra |
| [堆操作 / Heap Operations](https://fm2gp-chinese.bookzhou.com/heap) | 扩展 / Extra |
| [3.2节-3.3节 - 埃拉托色尼筛法 / Section 3.2-3.3 - Sieve of Eratosthenes](https://fm2gp-chinese.bookzhou.com/sieve) | 3.2, 3.3 |
| [习题3.3 - 素数计数函数 (计算较慢，请耐心等待) / Exercise 3.3 - Prime Counting Function](https://fm2gp-chinese.bookzhou.com/prime-counting) | 习题 / Exercise 3.3 |
| [习题3.4 - 回文素数 / Exercise 3.4 - Palindromic Primes](https://fm2gp-chinese.bookzhou.com/palindromic-primes) | 习题 / Exercise 3.4 |
| [5.1节 - 判断一个数是否为素数 / Section 5.1 - Prime Number Checker](https://fm2gp-chinese.bookzhou.com/prime-checker) | 5.1 |
| [5.2节 - 费马小定理 / Section 5.2 - Fermat's Little Theorem](https://fm2gp-chinese.bookzhou.com/fermat) | 5.2 |
| [5.5节 - 欧拉定理 / Section 5.5 - Euler's Theorem](https://fm2gp-chinese.bookzhou.com/euler) | 5.5 |
| [4.2节 - 欧几里得算法(GCM/GCD) / Section 4.2 - Euclidean Algorithm (GCM/GCD)](https://fm2gp-chinese.bookzhou.com/gcm) | 4.2 |
| [求余与求商：倍增和斐波那契 / Remainders and quotients: doubling and Fibonacci](https://fm2gp-chinese.bookzhou.com/division) | 4.5, 4.6 |
| [12.1-12.2节 - 斯坦因GCD算法（二进制GCD） / Section 12.1-12.2 - Stein's GCD Algorithm (Binary GCD)](https://fm2gp-chinese.bookzhou.com/stein-gcd) | 12.1, 12.2 |
| [12.3节和12.4节 - 贝祖定理与扩展GCD算法(含习题12.7） / Section 12.3 & 12.4 - Bézout's Identity & Extended GCD (Including Exercise 12.7)](https://fm2gp-chinese.bookzhou.com/extended-gcd) | 12.3, 12.4 |
| [习题12.1 - 对比用斯坦因算法和欧几里得算法计算GCD的性能 / Exercise 12.1 - Performance Comparison of Stein and Euclidean GCD Algorithms](https://fm2gp-chinese.bookzhou.com/gcd-comparison) | 习题 / Exercise 12.1 |
| [2.1—2.2节 - 埃及乘法：递归与迭代 / Sections 2.1–2.2 - Egyptian Multiplication: Recursion and Iteration](https://fm2gp-chinese.bookzhou.com/multiply) | 2.1, 2.2 |
| [同一个幂算法 / One power algorithm](https://fm2gp-chinese.bookzhou.com/power) | 7.1, 7.2, 7.3, 7.4, 7.5, 7.6 |
| [习题7.1 - 最初级的斐波那契数列算法需要执行多少次加法（时间复杂度:O(φⁿ)） / Exercise 7.1 - How Many Additions Does the Basic Fibonacci Algorithm Need? (Time Complexity: O(φⁿ))](https://fm2gp-chinese.bookzhou.com/fibonacci) | 习题 / Exercise 7.1 |
| [7.7节 - 使用幂算法计算第n个斐波那契数（时间复杂度:O(log⁡n)） / Section 7.7 - Calculate nth Fibonacci Number Using Power Algorithm (Time Complexity: O(log n))](https://fm2gp-chinese.bookzhou.com/fast-fibonacci) | 7.7 |
| [8.6节 - 找出有向图中任意两个节点之间的最短距离 / Section 8.6 - Finding Shortest Distance Between Any Two Nodes in a Directed Graph](https://fm2gp-chinese.bookzhou.com/shortest-path) | 8.6 |
| [图遍历（BFS/DFS） / Graph Traversal (BFS/DFS)](https://fm2gp-chinese.bookzhou.com/graph-traversal) | 扩展 / Extra |
| [习题9.2 - π 的下界与上界 / Exercise 9.2 - Lower and Upper Bounds for π](https://fm2gp-chinese.bookzhou.com/pi-upper-bound) | 习题 / Exercise 9.2 |
| [13.3节 - 米勒-拉宾(Miller-Rabin)素性测试 / Section 13.3 - Miller-Rabin Primality Test](https://fm2gp-chinese.bookzhou.com/miller-rabin) | 13.3 |
| [13.4节 - RSA公钥密码系统 / Section 13.4 - RSA Algorithm](https://fm2gp-chinese.bookzhou.com/rsa) | 13.4 |
| [多项式带余除法与最大公约数 / Polynomial division with remainder and GCD](https://fm2gp-chinese.bookzhou.com/polynomial-gcd) | 8.1, 8.7, 8.8 |
| [霍纳法则：多项式求值 / Horner’s rule: polynomial evaluation](https://fm2gp-chinese.bookzhou.com/horner) | 8.1 |
| [运算与代数结构 / Operations and algebraic structures](https://fm2gp-chinese.bookzhou.com/concepts/algebra) | 6.1, 6.2 |
| [矩阵与可达性 / Matrices and reachability](https://fm2gp-chinese.bookzhou.com/concepts/matrices) | 8.5, 8.6 |
| [迭代器与区间 / Iterators and ranges](https://fm2gp-chinese.bookzhou.com/concepts/iterators) | 10.4, 10.5, 10.6, C.7 |

## 边界、历史与后续候选 / Limits, history and candidates

习题8.3演示覆盖前两题；8.6是章内参考推导。习题7.1错误PDF已移除，保留配套代码。配套资源是参考资料，不代替纸书，也不等同于逐题审定的答案。

第1—12轮是历史建设记录，保持原日期与版本身份；[首轮发布证据归档标签](https://github.com/transbot/fm2gp-Chinese/tree/archive/release-phase1-phase2-evidence/docs/verification/release-phase1-phase2)、[第十二轮固定版本](https://github.com/transbot/fm2gp-Chinese/tree/f19725917d9fa24c8f33b2e9c288e48da3338392/docs/verification/phase12-rings-fields)。本次实际验收见[集中收尾报告](verification/edition-closeout/README.md)。

新的章节专题、其余节的专门正文、未覆盖习题和新演示统一作为后续候选；不计入本版完成结果。本轮不新增后端、账号、勘误页或正式购书地址。评审合并及正式域名验收后，形成最终发布报告并转入维护。

Further chapter topics, authored readers for remaining sections, missing exercise solutions and new demos are future candidates, not completed work in this edition. Review merge and production acceptance remain the publication gate.

## 未按章索引的资源 / Resources outside the chapter index

上述目录核验了 86 个去重资源文件。资源目录共有 92 个受版本控制的文件；以下 6 个通过仓库文件夹访问，不计为章内直达资源。

- [课件(Course Materials)/FM2GP_Course_Slides_Pt1.pptx](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt1.pptx)
- [课件(Course Materials)/FM2GP_Course_Slides_Pt2.pptx](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt2.pptx)
- [课件(Course Materials)/FM2GP_Course_Slides_Pt3.pptx](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/FM2GP_Course_Slides_Pt3.pptx)
- [课件(Course Materials)/NoteToInstructors.pdf](../%E8%AF%BE%E4%BB%B6\(Course%20Materials\)/NoteToInstructors.pdf)
- [配套代码(fm2gpcode)/swap_ranges_CPP20.h](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/swap_ranges_CPP20.h)
- [配套代码(fm2gpcode)/编译开关.txt](../%E9%85%8D%E5%A5%97%E4%BB%A3%E7%A0%81\(fm2gpcode\)/%E7%BC%96%E8%AF%91%E5%BC%80%E5%85%B3.txt)
