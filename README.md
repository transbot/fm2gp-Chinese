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

这个项目包含《数学与泛型编程：高效编程的奥秘》的配套资源:

1. 本书预计于2026年由清华大学出版社出版。

2. 本项目为这本书描述的各种算法提供了可视化、可操作的Web app。方便您体验每种算法的运算过程。另外，当然还包含了原书的配套代码和习题答案。

3. 在整个翻译→出版→勘误→重印过程期间，会不断完善。

## 中文版主页请访问[周靖的博客](https://bookzhou.com)

## 中英文版算法可视化[Web app](https://fm2gp-chinese.bookzhou.com/)

### 已实现的算法可视化

| 章节 | 算法 | 说明 |
|------|------|------|
| 2.1 | 埃及乘法 | 俄式乘法，O(n) → O(log n) |
| 4.5 | 除法算法 | 重复减法实现除法 |
| 5.3 | 费马小定理 | 概率素性测试基础 |
| 7.5 | 幂算法 | 快速幂运算，O(log n) |
| 10.7 | 线性查找 | 顺序查找算法 |
| 10.8 | 二分查找 | 折半查找算法 |
| 11.2 | 交换 | 迭代器交换算法 |
| 11.4 | 循环分解 | 置换的循环分解 |
| 11.5 | 逆序 | 原地反转算法 |
| 12.1-12.2 | 斯坦因GCD | 二进制GCD算法 |
| 12.3-12.4 | 扩展GCD | 贝祖定理与扩展欧几里得 |
| 13.3 | 米勒-拉宾测试 | 概率素性测试 |
| - | 归并排序 | 分治排序算法 |
| - | 快速排序 | 原地排序算法 |
| - | 堆操作 | 堆化、插入、删除 |
| - | 图遍历 | BFS/DFS 可视化 |
| - | 斐波那契 | 递归与矩阵快速幂对比 |
| - | 欧拉函数 | φ(n) 计算 |
| - | 埃拉托色尼筛 | 素数筛法 |
| - | RSA演示 | 加密解密流程 |

### 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图可视化**: React Flow

![image](https://github.com/user-attachments/assets/e038b9b9-685d-4ef9-babe-5949f4193c8e)
![image](https://github.com/user-attachments/assets/b13d930e-e65f-40c1-815a-3d931a0170b1)
![image](https://github.com/user-attachments/assets/2bfed8d4-627d-489f-aaaf-7f28063f3473)
![image](https://github.com/user-attachments/assets/df5db73a-ddac-435f-9a40-4258345ca1c6)

---

**若不通晓数学，便难以真正理解世间万物。** ——罗杰·培根，《大著作》

这是一本关于编程的书，但它有别于常见的编程书籍。书中不仅包含算法和代码，还融入了诸多数学证明，以及从古代到20世纪的许多数学发现的历史背景，力求为读者呈现更完整的知识图景。

更具体地说，本书聚焦于泛型编程。这是一种编程范式，它起源于上世纪80年代，并在90年代随着C++标准模板库（Standard Template Library，STL）的诞生而逐渐普及。我们可以将其定义如下：

**定义 1.1**：泛型编程是一种编程范式，它关注如何设计算法和数据结构，使其在尽可能广泛的应用场景中保持高性能。

<div align="center" style="margin: 2em 0;">
  <a href="#fm2gp-chinese--数学与泛型编程高效编程的奥秘">返回顶部 / Back to top</a> | <a href="#english-version">切换至英文版 / Switch to English</a>
</div>

<hr>

<div id="english-version"></div>

## English Version

This project contains the source code for the Chinese edition of book _From Mathematics to Generic Programming_ by Alexander A. Stepanov & Daniel E. Rose

1. This book is expected to be published by Tsinghua University Press in 2025.

2. Explore the algorithms from the book through our interactive Web app, where you can visualize and experiment with each algorithm's operation. The project also comes with the original book's code and exercise answers.

3. It will be continuously improved throughout the entire process of translation → publication → errata → reprinting.

## Chinese homepage: [Zhou Jing's Blog](https://bookzhou.com)

## A [Web app](https://fm2gp-chinese.bookzhou.com/) for algorithm visualization, available in both Chinese and English.

### Implemented Algorithm Visualizations

| Section | Algorithm | Description |
|---------|-----------|-------------|
| 2.1 | Egyptian Multiplication | Russian peasant multiplication, O(n) → O(log n) |
| 4.5 | Division Algorithm | Division via repeated subtraction |
| 5.3 | Fermat's Little Theorem | Foundation for probabilistic primality testing |
| 7.5 | Power Algorithm | Fast exponentiation, O(log n) |
| 10.7 | Linear Search | Sequential search algorithm |
| 10.8 | Binary Search | Halving search algorithm |
| 11.2 | Swap | Iterator swap algorithm |
| 11.4 | Cycle Decomposition | Permutation cycle decomposition |
| 11.5 | Reverse | In-place reversal algorithm |
| 12.1-12.2 | Stein's GCD | Binary GCD algorithm |
| 12.3-12.4 | Extended GCD | Bézout's identity and extended Euclidean |
| 13.3 | Miller-Rabin Test | Probabilistic primality testing |
| - | Merge Sort | Divide-and-conquer sorting |
| - | Quick Sort | In-place sorting |
| - | Heap Operations | Heapify, insert, delete |
| - | Graph Traversal | BFS/DFS visualization |
| - | Fibonacci | Recursive vs matrix exponentiation |
| - | Euler's Totient | φ(n) calculation |
| - | Sieve of Eratosthenes | Prime number sieve |
| - | RSA Demo | Encryption/decryption flow |

### Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Graph Visualization**: React Flow

![image](https://github.com/user-attachments/assets/e038b9b9-685d-4ef9-babe-5949f4193c8e)
![image](https://github.com/user-attachments/assets/b13d930e-e65f-40c1-815a-3d931a0170b1)
![image](https://github.com/user-attachments/assets/2bfed8d4-627d-489f-aaaf-7f28063f3473)
![image](https://github.com/user-attachments/assets/df5db73a-ddac-435f-9a40-4258345ca1c6)

---

It is impossible to know things of this world unless you know mathematics. ——Roger Bacon, *Opus Majus*

This is a programming book, but it is different from common programming books. The book not only contains algorithms and code but also incorporates many mathematical proofs, as well as the historical backgrounds of many mathematical discoveries from ancient times to the 20th century, striving to present a more complete knowledge picture for readers.

More specifically, this book focuses on generic programming. This is a programming paradigm that originated in the 1980s and gradually became popular in the 1990s with the birth of the C++ Standard Template Library (STL). We can define it as follows:

**Definition 1.1**: Generic programming is a programming paradigm that focuses on how to design algorithms and data structures so that they maintain high performance in the widest possible range of application scenarios.

<div align="center" style="margin: 2em 0;">
  <a href="#fm2gp-chinese--数学与泛型编程高效编程的奥秘">返回顶部 / Back to top</a> | <a href="#中文版">切换至中文版 / Switch to Chinese</a>
</div>
