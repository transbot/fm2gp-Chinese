export const bookLearningPath = [
  {
    id: 'multiply', section: '2.1',
    title: { zh: '埃及乘法', en: 'Egyptian multiplication' },
    description: {
      zh: '先用折半、倍增和选择性累加完成乘法，为后面的幂算法建立计算骨架。',
      en: 'Use halving, doubling, and selective addition to multiply, establishing the structure of the power algorithm.',
    },
  },
  {
    id: 'power', section: '7.5',
    title: { zh: '幂算法', en: 'Power algorithm' },
    description: {
      zh: '沿用上一站的折半与累积结构，把加法换成满足结合律的运算，倍增就变成平方，得到可复用的幂算法。',
      en: 'Keep the halving and accumulation structure, replacing addition with an associative operation: doubling becomes squaring in a reusable power algorithm.',
    },
  },
  {
    id: 'fast-fibonacci', section: '7.7',
    title: { zh: '斐波那契数', en: 'Fibonacci numbers' },
    description: {
      zh: '把上一站的操作数换成矩阵、运算换成矩阵乘法，同一个幂算法就能求 [[1,1],[1,0]] 的幂，从中读出斐波那契数。',
      en: 'Use matrices as operands and matrix multiplication as the operation: the same power algorithm raises [[1,1],[1,0]] to a power to obtain Fibonacci numbers.',
    },
  },
  {
    id: 'shortest-path', section: '8.6',
    title: { zh: '图上最短路', en: 'Shortest paths in graphs' },
    description: {
      zh: '继续使用矩阵幂，把矩阵乘法里的标量乘法换成加法、加法换成取最小值；以边权为元素、对角线为 0、无边为 ∞，在无负环时累积至多 n−1 条边即可求 n 个顶点间的最短路。',
      en: 'Keep matrix powers but replace scalar multiplication with addition and scalar addition with minimum; use edge weights, zero on the diagonal, and ∞ for missing edges to find shortest paths using at most n−1 edges among n vertices, assuming no negative cycles.',
    },
  },
];
