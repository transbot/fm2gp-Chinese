// Directory and source PDF page indices checked against the supplied Chinese PDF.
export const bookContent = {
  "chapters": [
    {
      "id": "1",
      "title": {
        "zh": "绪论",
        "en": "Introduction"
      },
      "guide": {
        "zh": "从数学与程序的共同问题开始，了解全书路线。预备知识是基本代数与命令式编程；下一章从一个乘法例子出发。",
        "en": "Start with the questions shared by mathematics and programming. Basic algebra and imperative programming prepare you for the multiplication example in Chapter 2."
      },
      "sourcePdfPage": 17,
      "sections": [
        {
          "id": "1.1",
          "title": {
            "zh": "编程与数学",
            "en": "Programming and mathematics"
          },
          "sourcePdfPage": 18
        },
        {
          "id": "1.2",
          "title": {
            "zh": "历史视角",
            "en": "A historical perspective"
          },
          "sourcePdfPage": 18
        },
        {
          "id": "1.3",
          "title": {
            "zh": "预备知识",
            "en": "Prerequisites"
          },
          "sourcePdfPage": 19
        },
        {
          "id": "1.4",
          "title": {
            "zh": "全书导览",
            "en": "Overview of the book"
          },
          "sourcePdfPage": 20
        }
      ]
    },
    {
      "id": "2",
      "title": {
        "zh": "初探算法",
        "en": "The first algorithm"
      },
      "guide": {
        "zh": "用折半与倍增完成乘法。先观察每次变换保持什么，再阅读改进版本；这套结构将在第7章成为幂算法。",
        "en": "Multiply by halving and doubling. Observe what each transformation preserves, then compare the improved versions. Chapter 7 reuses this structure for powers."
      },
      "sourcePdfPage": 21,
      "sections": [
        {
          "id": "2.1",
          "title": {
            "zh": "埃及乘法",
            "en": "Egyptian multiplication"
          },
          "sourcePdfPage": 22
        },
        {
          "id": "2.2",
          "title": {
            "zh": "改进算法",
            "en": "Improving the algorithm"
          },
          "sourcePdfPage": 26
        },
        {
          "id": "2.3",
          "title": {
            "zh": "小结",
            "en": "Summary"
          },
          "sourcePdfPage": 31
        }
      ]
    },
    {
      "id": "3",
      "title": {
        "zh": "古希腊数论",
        "en": "Ancient Greek number theory"
      },
      "guide": {
        "zh": "从整数的几何表示理解素数、筛法与完全数。沿用第2章的算法思维，准备理解第4章的公度问题。",
        "en": "Use geometric representations to study primes, sieving, and perfect numbers. Extend Chapter 2’s algorithmic thinking toward common measures in Chapter 4."
      },
      "sourcePdfPage": 32,
      "sections": [
        {
          "id": "3.1",
          "title": {
            "zh": "整数的几何性质",
            "en": "Geometric properties of integers"
          },
          "sourcePdfPage": 32
        },
        {
          "id": "3.2",
          "title": {
            "zh": "筛选素数",
            "en": "Sieving primes"
          },
          "sourcePdfPage": 35
        },
        {
          "id": "3.3",
          "title": {
            "zh": "实现埃拉托色尼筛法并优化代码",
            "en": "Implementing and optimizing the sieve of Eratosthenes"
          },
          "sourcePdfPage": 38
        },
        {
          "id": "3.4",
          "title": {
            "zh": "完全数",
            "en": "Perfect numbers"
          },
          "sourcePdfPage": 44
        },
        {
          "id": "3.5",
          "title": {
            "zh": "毕达哥拉斯学派的构想",
            "en": "The Pythagorean program"
          },
          "sourcePdfPage": 49
        },
        {
          "id": "3.6",
          "title": {
            "zh": "毕氏构想的严重缺陷",
            "en": "A fatal flaw in the Pythagorean program"
          },
          "sourcePdfPage": 51
        },
        {
          "id": "3.7",
          "title": {
            "zh": "小结",
            "en": "Summary"
          },
          "sourcePdfPage": 55
        }
      ]
    },
    {
      "id": "4",
      "title": {
        "zh": "欧几里得算法",
        "en": "Euclid’s algorithm"
      },
      "guide": {
        "zh": "从线段的最大公度走到整数的余数算法，观察不变式与终止性。它为模运算和第12章的推广作准备。",
        "en": "Move from the greatest common measure of segments to integer remainders. Study invariants and termination before modular arithmetic and Chapter 12."
      },
      "sourcePdfPage": 57,
      "sections": [
        {
          "id": "4.1",
          "title": {
            "zh": "雅典与亚历山大",
            "en": "Athens and Alexandria"
          },
          "sourcePdfPage": 57
        },
        {
          "id": "4.2",
          "title": {
            "zh": "欧几里得最大公度算法",
            "en": "Euclid’s greatest common measure algorithm"
          },
          "sourcePdfPage": 61
        },
        {
          "id": "4.3",
          "title": {
            "zh": "数学的千年停滞",
            "en": "A millennium of mathematical stagnation"
          },
          "sourcePdfPage": 67
        },
        {
          "id": "4.4",
          "title": {
            "zh": "零的奇特历史",
            "en": "The strange history of zero"
          },
          "sourcePdfPage": 68
        },
        {
          "id": "4.5",
          "title": {
            "zh": "求余求商算法",
            "en": "Remainder and quotient algorithms"
          },
          "sourcePdfPage": 72
        },
        {
          "id": "4.6",
          "title": {
            "zh": "共享代码",
            "en": "Sharing code"
          },
          "sourcePdfPage": 75
        },
        {
          "id": "4.7",
          "title": {
            "zh": "验证算法有效性",
            "en": "Establishing algorithm correctness"
          },
          "sourcePdfPage": 78
        },
        {
          "id": "4.8",
          "title": {
            "zh": "小结",
            "en": "Summary"
          },
          "sourcePdfPage": 79
        }
      ]
    },
    {
      "id": "5",
      "title": {
        "zh": "现代数论的兴起",
        "en": "The emergence of modern number theory"
      },
      "guide": {
        "zh": "利用整除与余数理解费马、欧拉定理，特别留意互素条件。下一章把这些实例中的共同性质抽象出来。",
        "en": "Use divisibility and remainders to understand Fermat’s and Euler’s theorems, including coprimality conditions. Chapter 6 abstracts their common properties."
      },
      "sourcePdfPage": 80,
      "sections": [
        {
          "id": "5.1",
          "title": {
            "zh": "梅森素数与费马素数",
            "en": "Mersenne and Fermat primes"
          },
          "sourcePdfPage": 80
        },
        {
          "id": "5.2",
          "title": {
            "zh": "费马小定理",
            "en": "Fermat’s little theorem"
          },
          "sourcePdfPage": 86
        },
        {
          "id": "5.3",
          "title": {
            "zh": "消去",
            "en": "Cancellation"
          },
          "sourcePdfPage": 89
        },
        {
          "id": "5.4",
          "title": {
            "zh": "证明费马小定理",
            "en": "Proving Fermat’s little theorem"
          },
          "sourcePdfPage": 93
        },
        {
          "id": "5.5",
          "title": {
            "zh": "欧拉定理",
            "en": "Euler’s theorem"
          },
          "sourcePdfPage": 96
        },
        {
          "id": "5.6",
          "title": {
            "zh": "模运算的应用",
            "en": "Applications of modular arithmetic"
          },
          "sourcePdfPage": 100
        },
        {
          "id": "5.7",
          "title": {
            "zh": "小结",
            "en": "Summary"
          },
          "sourcePdfPage": 101
        }
      ]
    },
    {
      "id": "6",
      "title": {
        "zh": "数学中的抽象",
        "en": "Abstraction in mathematics"
      },
      "guide": {
        "zh": "从半群、幺半群与群出发，在 6.3–6.5 用模 7 的幂理解元素阶和循环子群，再由陪集划分证明拉格朗日定理。6.6–6.7 比较四元素群，检验同构并理解范畴性。",
        "en": "From semigroups, monoids and groups, use powers modulo 7 in 6.3–6.5 to study element orders and cyclic subgroups, then prove Lagrange’s theorem by partitioning into cosets. In 6.6–6.7 compare four-element models to test isomorphism and understand categoricity."
      },
      "sourcePdfPage": 102,
      "sections": [
        {
          "id": "6.1",
          "title": {
            "zh": "群",
            "en": "Groups"
          },
          "sourcePdfPage": 102
        },
        {
          "id": "6.2",
          "title": {
            "zh": "幺半群和半群",
            "en": "Monoids and semigroups"
          },
          "sourcePdfPage": 106
        },
        {
          "id": "6.3",
          "title": {
            "zh": "关于群的一些定理",
            "en": "Some theorems about groups"
          },
          "sourcePdfPage": 110
        },
        {
          "id": "6.4",
          "title": {
            "zh": "子群和循环群",
            "en": "Subgroups and cyclic groups"
          },
          "sourcePdfPage": 113
        },
        {
          "id": "6.5",
          "title": {
            "zh": "拉格朗日定理",
            "en": "Lagrange’s theorem"
          },
          "sourcePdfPage": 116
        },
        {
          "id": "6.6",
          "title": {
            "zh": "理论与模型",
            "en": "Theories and models"
          },
          "sourcePdfPage": 121
        },
        {
          "id": "6.7",
          "title": {
            "zh": "范畴与非范畴理论的例子",
            "en": "Examples of categorical and noncategorical theories"
          },
          "sourcePdfPage": 124
        },
        {
          "id": "6.8",
          "title": {
            "zh": "小结",
            "en": "Summary"
          },
          "sourcePdfPage": 127
        }
      ]
    },
    {
      "id": "7",
      "title": {
        "zh": "推导泛型算法",
        "en": "Deriving a generic algorithm"
      },
      "guide": {
        "zh": "从埃及乘法中提取真正需要的条件，把固定运算变成参数。先理解第6章的结合律，再将同一流程用于数和矩阵。",
        "en": "Extract the actual requirements of Egyptian multiplication and make the operation a parameter. Use Chapter 6’s associativity to apply one procedure to numbers and matrices."
      },
      "sourcePdfPage": 130,
      "sections": [
        {
          "id": "7.1",
          "title": {
            "zh": "梳理算法的要求",
            "en": "Identifying algorithm requirements"
          },
          "sourcePdfPage": 130
        },
        {
          "id": "7.2",
          "title": {
            "zh": "对A 的要求",
            "en": "Requirements on A"
          },
          "sourcePdfPage": 131
        },
        {
          "id": "7.3",
          "title": {
            "zh": "对N 的要求",
            "en": "Requirements on N"
          },
          "sourcePdfPage": 135
        },
        {
          "id": "7.4",
          "title": {
            "zh": "新的要求",
            "en": "New requirements"
          },
          "sourcePdfPage": 137
        },
        {
          "id": "7.5",
          "title": {
            "zh": "将乘法转换为幂运算",
            "en": "From multiplication to exponentiation"
          },
          "sourcePdfPage": 138
        },
        {
          "id": "7.6",
          "title": {
            "zh": "运算的泛化",
            "en": "Generalizing the operation"
          },
          "sourcePdfPage": 139
        },
        {
          "id": "7.7",
          "title": {
            "zh": "计算斐波那契数",
            "en": "Computing Fibonacci numbers"
          },
          "sourcePdfPage": 143
        },
        {
          "id": "7.8",
          "title": {
            "zh": "小结",
            "en": "Summary"
          },
          "sourcePdfPage": 147
        }
      ]
    },
    {
      "id": "8",
      "title": {
        "zh": "更多代数结构",
        "en": "More algebraic structures"
      },
      "guide": {
        "zh": "从霍纳求值到多项式带余除法，再把求余接入泛型GCD循环；第8.8节解释系数域。另一路先看一个矩阵结果格怎样计算，再更换连接与汇总规则。从第7章的幂算法走向可达性与最短路径。",
        "en": "Follow Horner evaluation with polynomial division and the generic GCD loop; Section 8.8 explains coefficient fields. A second route inspects how one matrix cell is computed, then changes the composition and aggregation rules. Apply Chapter 7’s power algorithm to reachability and shortest paths."
      },
      "sourcePdfPage": 148,
      "sections": [
        {
          "id": "8.1",
          "title": {
            "zh": "斯蒂文、多项式与最大公约数",
            "en": "Stevin, polynomials, and GCD"
          },
          "sourcePdfPage": 148
        },
        {
          "id": "8.2",
          "title": {
            "zh": "哥廷根与德国数学",
            "en": "Göttingen and German mathematics"
          },
          "sourcePdfPage": 155
        },
        {
          "id": "8.3",
          "title": {
            "zh": "诺特与抽象代数的诞生",
            "en": "Noether and the birth of abstract algebra"
          },
          "sourcePdfPage": 159
        },
        {
          "id": "8.4",
          "title": {
            "zh": "环",
            "en": "Rings"
          },
          "sourcePdfPage": 161
        },
        {
          "id": "8.5",
          "title": {
            "zh": "矩阵乘法与半环",
            "en": "Matrix multiplication and semirings"
          },
          "sourcePdfPage": 164
        },
        {
          "id": "8.6",
          "title": {
            "zh": "应用：社交网络与最短路径",
            "en": "Application: social networks and shortest paths"
          },
          "sourcePdfPage": 167
        },
        {
          "id": "8.7",
          "title": {
            "zh": "欧几里得整环",
            "en": "Euclidean domains"
          },
          "sourcePdfPage": 169
        },
        {
          "id": "8.8",
          "title": {
            "zh": "域和其他代数结构",
            "en": "Fields and other algebraic structures"
          },
          "sourcePdfPage": 170
        },
        {
          "id": "8.9",
          "title": {
            "zh": "小结",
            "en": "Summary"
          },
          "sourcePdfPage": 172
        }
      ]
    },
    {
      "id": "9",
      "title": {
        "zh": "组织数学知识",
        "en": "Organizing mathematical knowledge"
      },
      "guide": {
        "zh": "从定义到归纳证明：9.1辨认实例与反例，9.6读懂五条皮亚诺公理，9.7用加法定义计算并证明左单位元与结合律。",
        "en": "From definitions to induction: distinguish examples from counterexamples in 9.1, read the five Peano axioms in 9.6, then evaluate a sum and prove left identity and associativity in 9.7."
      },
      "sourcePdfPage": 175,
      "sections": [
        {
          "id": "9.1",
          "title": {
            "zh": "证明",
            "en": "Proofs"
          },
          "sourcePdfPage": 175
        },
        {
          "id": "9.2",
          "title": {
            "zh": "第一个定理",
            "en": "The first theorem"
          },
          "sourcePdfPage": 178
        },
        {
          "id": "9.3",
          "title": {
            "zh": "欧几里得与公理化方法",
            "en": "Euclid and the axiomatic method"
          },
          "sourcePdfPage": 181
        },
        {
          "id": "9.4",
          "title": {
            "zh": "非欧几何",
            "en": "Non-Euclidean geometry"
          },
          "sourcePdfPage": 183
        },
        {
          "id": "9.5",
          "title": {
            "zh": "希尔伯特的形式主义方法",
            "en": "Hilbert’s formalist approach"
          },
          "sourcePdfPage": 185
        },
        {
          "id": "9.6",
          "title": {
            "zh": "皮亚诺和他的公理",
            "en": "Peano and his axioms"
          },
          "sourcePdfPage": 188
        },
        {
          "id": "9.7",
          "title": {
            "zh": "构建算术体系",
            "en": "Constructing arithmetic"
          },
          "sourcePdfPage": 192
        },
        {
          "id": "9.8",
          "title": {
            "zh": "小结",
            "en": "Summary"
          },
          "sourcePdfPage": 196
        }
      ]
    },
    {
      "id": "10",
      "title": {
        "zh": "基本编程概念",
        "en": "Fundamental programming concepts"
      },
      "guide": {
        "zh": "10.2 用同一串位区分数据和值；10.3 从操作、规律和代价理解概念，再到迭代器演示比较移动次数。",
        "en": "Interpret one bit string in 10.2. In 10.3 compare operations, laws and costs, then count movements in the iterator lab."
      },
      "sourcePdfPage": 197,
      "sections": [
        {
          "id": "10.1",
          "title": {
            "zh": "亚里士多德与抽象",
            "en": "Aristotle and abstraction"
          },
          "sourcePdfPage": 197
        },
        {
          "id": "10.2",
          "title": {
            "zh": "值和类型",
            "en": "Values and types"
          },
          "sourcePdfPage": 199
        },
        {
          "id": "10.3",
          "title": {
            "zh": "概念",
            "en": "Concepts"
          },
          "sourcePdfPage": 201
        },
        {
          "id": "10.4",
          "title": {
            "zh": "迭代器",
            "en": "Iterators"
          },
          "sourcePdfPage": 203
        },
        {
          "id": "10.5",
          "title": {
            "zh": "迭代器类别、操作和trait",
            "en": "Iterator categories, operations, and traits"
          },
          "sourcePdfPage": 204
        },
        {
          "id": "10.6",
          "title": {
            "zh": "区间",
            "en": "Ranges"
          },
          "sourcePdfPage": 209
        },
        {
          "id": "10.7",
          "title": {
            "zh": "线性查找",
            "en": "Linear search"
          },
          "sourcePdfPage": 211
        },
        {
          "id": "10.8",
          "title": {
            "zh": "二叉查找",
            "en": "Binary search"
          },
          "sourcePdfPage": 212
        },
        {
          "id": "10.9",
          "title": {
            "zh": "小结",
            "en": "Summary"
          },
          "sourcePdfPage": 218
        }
      ]
    },
    {
      "id": "11",
      "title": {
        "zh": "排列算法",
        "en": "Permutation algorithms"
      },
      "guide": {
        "zh": "用交换、循环、旋转和反转重排序列。依赖第10章的区间模型，同时比较移动次数与额外存储。",
        "en": "Rearrange sequences with swaps, cycles, rotations, and reversals. Use Chapter 10’s ranges and compare element movement with extra storage."
      },
      "sourcePdfPage": 219,
      "sections": [
        {
          "id": "11.1",
          "title": {
            "zh": "排列与对换",
            "en": "Permutations and transpositions"
          },
          "sourcePdfPage": 219
        },
        {
          "id": "11.2",
          "title": {
            "zh": "区间交换",
            "en": "Swapping ranges"
          },
          "sourcePdfPage": 224
        },
        {
          "id": "11.3",
          "title": {
            "zh": "旋转",
            "en": "Rotation"
          },
          "sourcePdfPage": 227
        },
        {
          "id": "11.4",
          "title": {
            "zh": "使用循环",
            "en": "Using cycles"
          },
          "sourcePdfPage": 231
        },
        {
          "id": "11.5",
          "title": {
            "zh": "反转",
            "en": "Reversal"
          },
          "sourcePdfPage": 236
        },
        {
          "id": "11.6",
          "title": {
            "zh": "空间复杂度",
            "en": "Space complexity"
          },
          "sourcePdfPage": 240
        },
        {
          "id": "11.7",
          "title": {
            "zh": "内存自适应算法",
            "en": "Memory-adaptive algorithms"
          },
          "sourcePdfPage": 240
        },
        {
          "id": "11.8",
          "title": {
            "zh": "小结",
            "en": "Summary"
          },
          "sourcePdfPage": 242
        }
      ]
    },
    {
      "id": "12",
      "title": {
        "zh": "再论最大公约数算法",
        "en": "Revisiting GCD"
      },
      "guide": {
        "zh": "重新审视第4章的GCD，比较硬件操作并跟踪贝祖系数。模逆元把这一章连接到RSA。",
        "en": "Revisit Chapter 4’s GCD, compare primitive operations, and track Bézout coefficients. Modular inverses connect this chapter to RSA."
      },
      "sourcePdfPage": 243,
      "sections": [
        {
          "id": "12.1",
          "title": {
            "zh": "硬件限制与一种更高效的算法",
            "en": "Hardware constraints and a more efficient algorithm"
          },
          "sourcePdfPage": 243
        },
        {
          "id": "12.2",
          "title": {
            "zh": "推广斯坦因算法",
            "en": "Generalizing Stein’s algorithm"
          },
          "sourcePdfPage": 246
        },
        {
          "id": "12.3",
          "title": {
            "zh": "贝祖定理",
            "en": "Bézout’s theorem"
          },
          "sourcePdfPage": 249
        },
        {
          "id": "12.4",
          "title": {
            "zh": "扩展最大公约数算法",
            "en": "The extended GCD algorithm"
          },
          "sourcePdfPage": 254
        },
        {
          "id": "12.5",
          "title": {
            "zh": "GCD 的应用",
            "en": "Applications of GCD"
          },
          "sourcePdfPage": 258
        },
        {
          "id": "12.6",
          "title": {
            "zh": "小结",
            "en": "Summary"
          },
          "sourcePdfPage": 259
        }
      ]
    },
    {
      "id": "13",
      "title": {
        "zh": "实际应用",
        "en": "Real-world applications"
      },
      "guide": {
        "zh": "组合模运算、素性测试、快速幂和扩展GCD，理解RSA的工作链条。教学小数值展示原理，不作为实际密钥生成工具。",
        "en": "Combine modular arithmetic, primality testing, fast powers, and extended GCD to understand RSA. Small teaching examples illustrate the mechanism rather than generate production keys."
      },
      "sourcePdfPage": 261,
      "sections": [
        {
          "id": "13.1",
          "title": {
            "zh": "密码学",
            "en": "Cryptography"
          },
          "sourcePdfPage": 261
        },
        {
          "id": "13.2",
          "title": {
            "zh": "素性测试",
            "en": "Primality testing"
          },
          "sourcePdfPage": 264
        },
        {
          "id": "13.3",
          "title": {
            "zh": "米勒-拉宾测试",
            "en": "The Miller–Rabin test"
          },
          "sourcePdfPage": 267
        },
        {
          "id": "13.4",
          "title": {
            "zh": "RSA 算法：工作方式和原理",
            "en": "RSA: how it works and why"
          },
          "sourcePdfPage": 269
        },
        {
          "id": "13.5",
          "title": {
            "zh": "小结",
            "en": "Summary"
          },
          "sourcePdfPage": 272
        }
      ]
    },
    {
      "id": "14",
      "title": {
        "zh": "全书总结",
        "en": "Conclusions"
      },
      "guide": {
        "zh": "围绕泛化、效率、接口与概念，回顾从乘法到通用幂算法、从整数求余到多项式GCD，以及迭代器能力与内存权衡。通过问题、解释和已有演示检验理解。",
        "en": "Review generalization, efficiency, interfaces, and concepts through multiplication and generic power, integer remainders and polynomial GCD, and iterator capabilities and memory trade-offs. Check your understanding with questions, explanations, and existing demonstrations."
      },
      "sourcePdfPage": 273,
      "sections": []
    },
    {
      "id": "A",
      "title": {
        "zh": "记法",
        "en": "Notation"
      },
      "guide": {
        "zh": "A.1查符号与数集，A.2把公式读成一句话，A.3用真值表和整数例区分蕴含、逆否命题与逆命题。",
        "en": "Look up notation in A.1, read formulas as sentences in A.2, and compare implications, contrapositives and converses in A.3."
      },
      "sourcePdfPage": 280,
      "sections": [
        {
          "id": "A.1",
          "title": {
            "zh": "记法",
            "en": "Notation"
          },
          "sourcePdfPage": 280
        },
        {
          "id": "A.2",
          "title": {
            "zh": "示例",
            "en": "Examples"
          },
          "sourcePdfPage": 283
        },
        {
          "id": "A.3",
          "title": {
            "zh": "蕴含与逆否命题",
            "en": "Implication and contraposition"
          },
          "sourcePdfPage": 283
        }
      ]
    },
    {
      "id": "B",
      "title": {
        "zh": "常用的证明方法",
        "en": "Common proof techniques"
      },
      "guide": {
        "zh": "B.1用平方的奇偶性练习反证法，B.2用正整数求和练习归纳，B.3用子集和理解鸽巢原理。",
        "en": "Practice contradiction with parity in B.1, induction with a sum in B.2, and the pigeonhole principle with subset sums in B.3."
      },
      "sourcePdfPage": 285,
      "sections": [
        {
          "id": "B.1",
          "title": {
            "zh": "反证法",
            "en": "Proof by contradiction"
          },
          "sourcePdfPage": 285
        },
        {
          "id": "B.2",
          "title": {
            "zh": "数学归纳法",
            "en": "Mathematical induction"
          },
          "sourcePdfPage": 285
        },
        {
          "id": "B.3",
          "title": {
            "zh": "鸽巢原理",
            "en": "The pigeonhole principle"
          },
          "sourcePdfPage": 287
        }
      ]
    },
    {
      "id": "C",
      "title": {
        "zh": "C++特有的语法或构造",
        "en": "C++ syntax and constructs"
      },
      "guide": {
        "zh": "C.1、C.2、C.4、C.5 用第7.6节的一次调用读懂模板、概念、函数对象与调用约定。C.7 可对照迭代器演示。",
        "en": "Follow a Section 7.6 call through templates, concepts, function objects and contracts in C.1, C.2, C.4 and C.5. Visit C.7 for the iterator lab."
      },
      "sourcePdfPage": 288,
      "sections": [
        {
          "id": "C.1",
          "title": {
            "zh": "模板函数",
            "en": "Function templates"
          },
          "sourcePdfPage": 288
        },
        {
          "id": "C.2",
          "title": {
            "zh": "概念",
            "en": "Concepts"
          },
          "sourcePdfPage": 289
        },
        {
          "id": "C.3",
          "title": {
            "zh": "声明语法和类型常量",
            "en": "Declaration syntax and type constants"
          },
          "sourcePdfPage": 290
        },
        {
          "id": "C.4",
          "title": {
            "zh": "函数对象",
            "en": "Function objects"
          },
          "sourcePdfPage": 290
        },
        {
          "id": "C.5",
          "title": {
            "zh": "前置条件、后置条件和断言",
            "en": "Preconditions, postconditions, and assertions"
          },
          "sourcePdfPage": 291
        },
        {
          "id": "C.6",
          "title": {
            "zh": "STL 算法和数据结构",
            "en": "STL algorithms and data structures"
          },
          "sourcePdfPage": 292
        },
        {
          "id": "C.7",
          "title": {
            "zh": "迭代器与区间",
            "en": "Iterators and ranges"
          },
          "sourcePdfPage": 293
        },
        {
          "id": "C.8",
          "title": {
            "zh": "使用using 实现类型别名和类型函数",
            "en": "Type aliases and type functions with using"
          },
          "sourcePdfPage": 294
        },
        {
          "id": "C.9",
          "title": {
            "zh": "C++11 中的初始化列表",
            "en": "Initializer lists in C++11"
          },
          "sourcePdfPage": 294
        },
        {
          "id": "C.10",
          "title": {
            "zh": "lambda 函数",
            "en": "Lambda functions"
          },
          "sourcePdfPage": 295
        },
        {
          "id": "C.11",
          "title": {
            "zh": "关于inline 的说明",
            "en": "About inline"
          },
          "sourcePdfPage": 296
        }
      ]
    }
  ],
  "exercises": [
    {
      "id": "2.1",
      "resources": [
        {
          "path": "solutions/2_1.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/2_1.tex",
          "kind": "solution",
          "format": "tex"
        }
      ],
      "sourcePdfPage": 26
    },
    {
      "id": "3.1",
      "resources": [
        {
          "path": "solutions/3_1.md",
          "kind": "solution",
          "format": "md"
        }
      ],
      "sourcePdfPage": 35
    },
    {
      "id": "3.2",
      "sourcePdfPage": 42,
      "resources": [
        {
          "path": "solutions/3_2.cpp",
          "kind": "program",
          "format": "cpp"
        }
      ]
    },
    {
      "id": "3.3",
      "sourcePdfPage": 43,
      "resources": [
        {
          "path": "solutions/3_3.md",
          "kind": "solution",
          "format": "md"
        }
      ]
    },
    {
      "id": "3.4",
      "sourcePdfPage": 44,
      "resources": [
        {
          "path": "solutions/3_4.md",
          "kind": "solution",
          "format": "md"
        }
      ]
    },
    {
      "id": "3.5",
      "sourcePdfPage": 47,
      "resources": [
        {
          "path": "solutions/3_5.md",
          "kind": "solution",
          "format": "md"
        }
      ]
    },
    {
      "id": "3.6",
      "sourcePdfPage": 47,
      "resources": []
    },
    {
      "id": "3.7",
      "sourcePdfPage": 49,
      "resources": []
    },
    {
      "id": "3.8",
      "sourcePdfPage": 49,
      "resources": []
    },
    {
      "id": "4.1",
      "sourcePdfPage": 64,
      "resources": [
        {
          "path": "solutions/4_1.md",
          "kind": "solution",
          "format": "md"
        }
      ]
    },
    {
      "id": "4.2",
      "sourcePdfPage": 64,
      "resources": [
        {
          "path": "solutions/4_2.md",
          "kind": "solution",
          "format": "md"
        }
      ]
    },
    {
      "id": "4.3",
      "resources": [
        {
          "path": "solutions/4_3.md",
          "kind": "solution",
          "format": "md"
        },
        {
          "path": "solutions/4_3.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/4_3.tex",
          "kind": "solution",
          "format": "tex"
        }
      ],
      "sourcePdfPage": 71
    },
    {
      "id": "4.4",
      "sourcePdfPage": 71,
      "resources": [
        {
          "path": "solutions/4_4.md",
          "kind": "solution",
          "format": "md"
        },
        {
          "path": "solutions/4_4.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/4_4.tex",
          "kind": "solution",
          "format": "tex"
        }
      ]
    },
    {
      "id": "4.5",
      "resources": [
        {
          "path": "solutions/4_5.md",
          "kind": "solution",
          "format": "md"
        }
      ],
      "sourcePdfPage": 71
    },
    {
      "id": "4.6",
      "sourcePdfPage": 77,
      "resources": [
        {
          "path": "solutions/4_6.md",
          "kind": "solution",
          "format": "md"
        }
      ]
    },
    {
      "id": "4.7",
      "sourcePdfPage": 77,
      "resources": [
        {
          "path": "solutions/4_7.cpp",
          "kind": "program",
          "format": "cpp"
        }
      ]
    },
    {
      "id": "5.1",
      "sourcePdfPage": 93,
      "resources": [
        {
          "path": "solutions/5_1.md",
          "kind": "solution",
          "format": "md"
        },
        {
          "path": "solutions/5_1.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/5_1.tex",
          "kind": "solution",
          "format": "tex"
        }
      ]
    },
    {
      "id": "5.2",
      "sourcePdfPage": 98,
      "resources": []
    },
    {
      "id": "6.1",
      "sourcePdfPage": 104,
      "resources": []
    },
    {
      "id": "6.2",
      "sourcePdfPage": 108,
      "resources": []
    },
    {
      "id": "6.3",
      "resources": [],
      "sourcePdfPage": 112
    },
    {
      "id": "6.4",
      "resources": [
        {
          "path": "solutions/6_4.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/6_4.tex",
          "kind": "solution",
          "format": "tex"
        }
      ],
      "sourcePdfPage": 113
    },
    {
      "id": "6.5",
      "sourcePdfPage": 113,
      "resources": [
        {
          "path": "solutions/6_5.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/6_5.tex",
          "kind": "solution",
          "format": "tex"
        }
      ]
    },
    {
      "id": "6.6",
      "sourcePdfPage": 114,
      "resources": [
        {
          "path": "solutions/6_6.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/6_6.tex",
          "kind": "solution",
          "format": "tex"
        }
      ]
    },
    {
      "id": "6.7",
      "sourcePdfPage": 115,
      "resources": [
        {
          "path": "solutions/6_7.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/6_7.tex",
          "kind": "solution",
          "format": "tex"
        }
      ]
    },
    {
      "id": "6.8",
      "sourcePdfPage": 115,
      "resources": [
        {
          "path": "solutions/6_8.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/6_8.tex",
          "kind": "solution",
          "format": "tex"
        }
      ]
    },
    {
      "id": "6.9",
      "resources": [
        {
          "path": "solutions/6_9.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/6_9.tex",
          "kind": "solution",
          "format": "tex"
        }
      ],
      "sourcePdfPage": 121
    },
    {
      "id": "6.10",
      "sourcePdfPage": 121,
      "resources": [
        {
          "path": "solutions/6.10.tex",
          "kind": "solution",
          "format": "tex"
        },
        {
          "path": "solutions/6_10.pdf",
          "kind": "solution",
          "format": "pdf"
        }
      ]
    },
    {
      "id": "7.1",
      "sourcePdfPage": 145,
      "resources": [
        {
          "path": "solutions/7_1.cpp",
          "kind": "program",
          "format": "cpp"
        }
      ]
    },
    {
      "id": "7.2",
      "sourcePdfPage": 146,
      "resources": [
        {
          "path": "solutions/7_2.cpp",
          "kind": "program",
          "format": "cpp"
        }
      ]
    },
    {
      "id": "8.1",
      "sourcePdfPage": 152,
      "resources": [
        {
          "path": "solutions/8_1.pdf",
          "kind": "solution",
          "format": "pdf"
        }
      ]
    },
    {
      "id": "8.2",
      "sourcePdfPage": 153,
      "resources": []
    },
    {
      "id": "8.3",
      "resources": [],
      "sourcePdfPage": 154
    },
    {
      "id": "8.4",
      "resources": [],
      "sourcePdfPage": 163
    },
    {
      "id": "8.5",
      "sourcePdfPage": 163,
      "resources": []
    },
    {
      "id": "8.6",
      "resources": [],
      "sourcePdfPage": 164
    },
    {
      "id": "8.7",
      "sourcePdfPage": 168,
      "resources": [
        {
          "path": "solutions/8_7.cpp",
          "kind": "program",
          "format": "cpp"
        }
      ]
    },
    {
      "id": "8.8",
      "sourcePdfPage": 169,
      "resources": []
    },
    {
      "id": "8.9",
      "sourcePdfPage": 169,
      "resources": []
    },
    {
      "id": "9.1",
      "sourcePdfPage": 177,
      "resources": []
    },
    {
      "id": "9.2",
      "sourcePdfPage": 178,
      "resources": []
    },
    {
      "id": "9.3",
      "sourcePdfPage": 195,
      "resources": [
        {
          "path": "solutions/9_3.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/9_3.tex",
          "kind": "solution",
          "format": "tex"
        }
      ]
    },
    {
      "id": "9.4",
      "sourcePdfPage": 195,
      "resources": []
    },
    {
      "id": "9.5",
      "sourcePdfPage": 195,
      "resources": []
    },
    {
      "id": "10.1",
      "sourcePdfPage": 216,
      "resources": []
    },
    {
      "id": "11.1",
      "sourcePdfPage": 220,
      "resources": [
        {
          "path": "solutions/11_1.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/11_1.tex",
          "kind": "solution",
          "format": "tex"
        }
      ]
    },
    {
      "id": "11.2",
      "sourcePdfPage": 220,
      "resources": [
        {
          "path": "solutions/11_2.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/11_2.tex",
          "kind": "solution",
          "format": "tex"
        }
      ]
    },
    {
      "id": "11.3",
      "sourcePdfPage": 222,
      "resources": [
        {
          "path": "solutions/11_3.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/11_3.tex",
          "kind": "solution",
          "format": "tex"
        }
      ]
    },
    {
      "id": "11.4",
      "sourcePdfPage": 223,
      "resources": []
    },
    {
      "id": "11.5",
      "sourcePdfPage": 224,
      "resources": []
    },
    {
      "id": "11.6",
      "sourcePdfPage": 227,
      "resources": []
    },
    {
      "id": "11.7",
      "sourcePdfPage": 228,
      "resources": [
        {
          "path": "solutions/11_7.cpp",
          "kind": "program",
          "format": "cpp"
        },
        {
          "path": "solutions/11_7.pdf",
          "kind": "solution",
          "format": "pdf"
        }
      ]
    },
    {
      "id": "11.8",
      "sourcePdfPage": 230,
      "resources": []
    },
    {
      "id": "11.9",
      "sourcePdfPage": 231,
      "resources": []
    },
    {
      "id": "11.10",
      "sourcePdfPage": 235,
      "resources": []
    },
    {
      "id": "11.11",
      "sourcePdfPage": 236,
      "resources": []
    },
    {
      "id": "11.12",
      "sourcePdfPage": 238,
      "resources": [
        {
          "path": "solutions/11_12.pdf",
          "kind": "solution",
          "format": "pdf"
        },
        {
          "path": "solutions/11_12.tex",
          "kind": "solution",
          "format": "tex"
        }
      ]
    },
    {
      "id": "11.13",
      "sourcePdfPage": 239,
      "resources": []
    },
    {
      "id": "12.1",
      "sourcePdfPage": 249,
      "resources": [
        {
          "path": "solutions/12_1.cpp",
          "kind": "program",
          "format": "cpp"
        }
      ]
    },
    {
      "id": "12.2",
      "sourcePdfPage": 251,
      "resources": []
    },
    {
      "id": "12.3",
      "sourcePdfPage": 252,
      "resources": []
    },
    {
      "id": "12.4",
      "sourcePdfPage": 253,
      "resources": []
    },
    {
      "id": "12.5",
      "sourcePdfPage": 254,
      "resources": []
    },
    {
      "id": "12.6",
      "sourcePdfPage": 257,
      "resources": []
    },
    {
      "id": "12.7",
      "sourcePdfPage": 258,
      "resources": []
    },
    {
      "id": "13.1",
      "sourcePdfPage": 266,
      "resources": [
        {
          "path": "solutions/13_1-13_2.cpp",
          "kind": "program",
          "format": "cpp"
        }
      ]
    },
    {
      "id": "13.2",
      "sourcePdfPage": 267,
      "resources": [
        {
          "path": "solutions/13_1-13_2.cpp",
          "kind": "program",
          "format": "cpp"
        }
      ]
    },
    {
      "id": "13.3",
      "sourcePdfPage": 271,
      "resources": []
    },
    {
      "id": "13.4",
      "sourcePdfPage": 271,
      "resources": []
    }
  ],
  "resources": [
    {
      "chapter": "2",
      "path": "配套代码(fm2gpcode)/ch02.cpp",
      "kind": "code",
      "functions": [
        {
          "name": "main",
          "line": 27
        }
      ]
    },
    {
      "chapter": "2",
      "path": "配套代码(fm2gpcode)/ch02.h",
      "kind": "code",
      "functions": [
        {
          "name": "odd",
          "line": 24
        },
        {
          "name": "half",
          "line": 25
        },
        {
          "name": "multiply0",
          "line": 27
        },
        {
          "name": "multiply1",
          "line": 32
        },
        {
          "name": "multiply_by_15",
          "line": 39
        },
        {
          "name": "mult_acc0",
          "line": 47
        },
        {
          "name": "mult_acc1",
          "line": 56
        },
        {
          "name": "mult_acc2",
          "line": 62
        },
        {
          "name": "mult_acc3",
          "line": 70
        },
        {
          "name": "mult_acc4",
          "line": 80
        },
        {
          "name": "multiply2",
          "line": 91
        },
        {
          "name": "multiply3",
          "line": 96
        },
        {
          "name": "multiply4",
          "line": 105
        }
      ]
    },
    {
      "chapter": "3",
      "path": "配套代码(fm2gpcode)/ch03.cpp",
      "kind": "code",
      "functions": [
        {
          "name": "print_sieve",
          "line": 27
        },
        {
          "name": "main",
          "line": 40
        }
      ]
    },
    {
      "chapter": "3",
      "path": "配套代码(fm2gpcode)/ch03.h",
      "kind": "code",
      "functions": [
        {
          "name": "mark_sieve",
          "line": 30
        },
        {
          "name": "sift0",
          "line": 40
        },
        {
          "name": "sift1",
          "line": 57
        },
        {
          "name": "sift",
          "line": 73
        },
        {
          "name": "gcm",
          "line": 93
        }
      ]
    },
    {
      "chapter": "4",
      "path": "配套代码(fm2gpcode)/ch04.cpp",
      "kind": "code",
      "functions": [
        {
          "name": "main",
          "line": 25
        }
      ]
    },
    {
      "chapter": "4",
      "path": "配套代码(fm2gpcode)/ch04.h",
      "kind": "code",
      "functions": [
        {
          "name": "odd",
          "line": 29
        },
        {
          "name": "half",
          "line": 30
        },
        {
          "name": "gcm0",
          "line": 32
        },
        {
          "name": "gcm1",
          "line": 40
        },
        {
          "name": "segment_remainder",
          "line": 48
        },
        {
          "name": "gcm",
          "line": 53
        },
        {
          "name": "fast_segment_remainder",
          "line": 61
        },
        {
          "name": "fast_segment_gcm",
          "line": 69
        },
        {
          "name": "fast_segment_remainder1",
          "line": 79
        },
        {
          "name": "largest_doubling",
          "line": 88
        },
        {
          "name": "remainder",
          "line": 94
        },
        {
          "name": "quotient",
          "line": 106
        },
        {
          "name": "remainder_fibonacci",
          "line": 133
        },
        {
          "name": "gcm_remainder",
          "line": 147
        },
        {
          "name": "gcd",
          "line": 155
        }
      ]
    },
    {
      "chapter": "7",
      "path": "配套代码(fm2gpcode)/ch07.cpp",
      "kind": "code",
      "functions": [
        {
          "name": "main",
          "line": 25
        }
      ]
    },
    {
      "chapter": "7",
      "path": "配套代码(fm2gpcode)/ch07.h",
      "kind": "code",
      "functions": [
        {
          "name": "odd",
          "line": 39
        },
        {
          "name": "half",
          "line": 42
        },
        {
          "name": "mult_acc4",
          "line": 44
        },
        {
          "name": "multiply_accumulate0",
          "line": 56
        },
        {
          "name": "multiply_accumulate",
          "line": 73
        },
        {
          "name": "multiply_accumulate_semigroup",
          "line": 86
        },
        {
          "name": "multiply_semigroup",
          "line": 100
        },
        {
          "name": "multiply_monoid",
          "line": 114
        },
        {
          "name": "multiply_group",
          "line": 121
        },
        {
          "name": "power_accumulate_semigroup",
          "line": 132
        },
        {
          "name": "power_semigroup",
          "line": 146
        },
        {
          "name": "power_monoid",
          "line": 157
        },
        {
          "name": "multiplicative_inverse",
          "line": 164
        },
        {
          "name": "power_group",
          "line": 169
        },
        {
          "name": "power_accumulate_semigroup",
          "line": 181
        },
        {
          "name": "power_semigroup",
          "line": 196
        },
        {
          "name": "identity_element",
          "line": 207
        },
        {
          "name": "identity_element",
          "line": 212
        },
        {
          "name": "power_monoid",
          "line": 218
        },
        {
          "name": "inverse_operation",
          "line": 225
        },
        {
          "name": "inverse_operation",
          "line": 237
        },
        {
          "name": "power_group",
          "line": 243
        },
        {
          "name": "fib0",
          "line": 254
        },
        {
          "name": "fibonacci_iterative",
          "line": 260
        }
      ]
    },
    {
      "chapter": "7",
      "path": "配套代码(fm2gpcode)/ch07_6.cpp",
      "kind": "code",
      "functions": [
        {
          "name": "power_accumulate_semigroup",
          "line": 32
        },
        {
          "name": "main",
          "line": 45
        }
      ]
    },
    {
      "chapter": "8",
      "path": "配套代码(fm2gpcode)/ch08.cpp",
      "kind": "code",
      "functions": [
        {
          "name": "main",
          "line": 25
        }
      ]
    },
    {
      "chapter": "8",
      "path": "配套代码(fm2gpcode)/ch08.h",
      "kind": "code",
      "functions": [
        {
          "name": "polynomial_value",
          "line": 28
        }
      ]
    },
    {
      "chapter": "10",
      "path": "配套代码(fm2gpcode)/ch10.cpp",
      "kind": "code",
      "functions": [
        {
          "name": "main",
          "line": 36
        }
      ]
    },
    {
      "chapter": "10",
      "path": "配套代码(fm2gpcode)/ch10.h",
      "kind": "code",
      "functions": [
        {
          "name": "distance",
          "line": 46
        },
        {
          "name": "distance",
          "line": 57
        },
        {
          "name": "distance",
          "line": 63
        },
        {
          "name": "advance",
          "line": 70
        },
        {
          "name": "advance",
          "line": 78
        },
        {
          "name": "advance",
          "line": 83
        },
        {
          "name": "find_if",
          "line": 90
        },
        {
          "name": "partition_point_n",
          "line": 105
        },
        {
          "name": "partition_point",
          "line": 121
        },
        {
          "name": "lower_bound",
          "line": 126
        },
        {
          "name": "upper_bound",
          "line": 132
        }
      ]
    },
    {
      "chapter": "11",
      "path": "配套代码(fm2gpcode)/ch11.cpp",
      "kind": "code",
      "functions": [
        {
          "name": "print_range",
          "line": 27
        },
        {
          "name": "main",
          "line": 32
        }
      ]
    },
    {
      "chapter": "11",
      "path": "配套代码(fm2gpcode)/ch11.h",
      "kind": "code",
      "functions": [
        {
          "name": "odd",
          "line": 38
        },
        {
          "name": "half",
          "line": 41
        },
        {
          "name": "swap",
          "line": 61
        },
        {
          "name": "swap_ranges",
          "line": 71
        },
        {
          "name": "swap_ranges",
          "line": 77
        },
        {
          "name": "swap_ranges_n",
          "line": 85
        },
        {
          "name": "gries_mills_rotate",
          "line": 96
        },
        {
          "name": "rotate_unguarded",
          "line": 112
        },
        {
          "name": "rotate",
          "line": 123
        },
        {
          "name": "rotate_cycle_from",
          "line": 142
        },
        {
          "name": "gcd",
          "line": 169
        },
        {
          "name": "rotate",
          "line": 178
        },
        {
          "name": "reverse",
          "line": 190
        },
        {
          "name": "reverse_n",
          "line": 195
        },
        {
          "name": "reverse",
          "line": 203
        },
        {
          "name": "three_reverse_rotate",
          "line": 208
        },
        {
          "name": "reverse_until",
          "line": 215
        },
        {
          "name": "rotate",
          "line": 221
        },
        {
          "name": "rotate",
          "line": 231
        },
        {
          "name": "reverse_recursive",
          "line": 236
        },
        {
          "name": "reverse",
          "line": 248
        },
        {
          "name": "reverse",
          "line": 253
        },
        {
          "name": "reverse_copy",
          "line": 260
        },
        {
          "name": "reverse_n_with_buffer",
          "line": 266
        },
        {
          "name": "reverse_n_adaptive",
          "line": 274
        }
      ]
    },
    {
      "chapter": "12",
      "path": "配套代码(fm2gpcode)/ch12.cpp",
      "kind": "code",
      "functions": [
        {
          "name": "main",
          "line": 26
        }
      ]
    },
    {
      "chapter": "12",
      "path": "配套代码(fm2gpcode)/ch12.h",
      "kind": "code",
      "functions": [
        {
          "name": "even",
          "line": 31
        },
        {
          "name": "stein_gcd",
          "line": 34
        },
        {
          "name": "gcd",
          "line": 64
        },
        {
          "name": "extended_gcd",
          "line": 83
        }
      ]
    },
    {
      "chapter": "13",
      "path": "配套代码(fm2gpcode)/ch13.cpp",
      "kind": "code",
      "functions": [
        {
          "name": "main",
          "line": 27
        }
      ]
    },
    {
      "chapter": "13",
      "path": "配套代码(fm2gpcode)/ch13.h",
      "kind": "code",
      "functions": [
        {
          "name": "divides",
          "line": 40
        },
        {
          "name": "smallest_divisor",
          "line": 45
        },
        {
          "name": "is_prime",
          "line": 55
        },
        {
          "name": "identity_element",
          "line": 70
        },
        {
          "name": "multiplicative_inverse_fermat",
          "line": 75
        },
        {
          "name": "fermat_test",
          "line": 81
        },
        {
          "name": "miller_rabin_test",
          "line": 92
        },
        {
          "name": "multiplicative_inverse",
          "line": 113
        }
      ]
    },
    {
      "chapter": "2",
      "path": "参考文档(References)/Addition Machines by Floyd & Knuth.pdf",
      "kind": "reference",
      "pages": 17
    },
    {
      "chapter": "7",
      "path": "参考文档(References)/Addition Machines by Floyd & Knuth.pdf",
      "kind": "reference",
      "pages": 17
    },
    {
      "chapter": "7",
      "path": "参考文档(References)/Generic Programming by Musser & Stepanov.pdf",
      "kind": "reference",
      "pages": 19
    },
    {
      "chapter": "10",
      "path": "参考文档(References)/Generic Programming by Musser & Stepanov.pdf",
      "kind": "reference",
      "pages": 19
    },
    {
      "chapter": "3",
      "path": "参考文档(References)/It is easy to determine whether a given integer is prime.pdf",
      "kind": "reference",
      "pages": 36
    },
    {
      "chapter": "13",
      "path": "参考文档(References)/It is easy to determine whether a given integer is prime.pdf",
      "kind": "reference",
      "pages": 36
    },
    {
      "chapter": "7",
      "path": "参考文档(References)/MapReduce：Simplied Data Processing on Large Clusters.pdf",
      "kind": "reference",
      "pages": 13
    },
    {
      "chapter": "6",
      "path": "参考文档(References)/p59-kapur.pdf",
      "kind": "reference",
      "pages": 6
    },
    {
      "chapter": "8",
      "path": "参考文档(References)/p59-kapur.pdf",
      "kind": "reference",
      "pages": 6
    },
    {
      "chapter": "8",
      "path": "参考文档(References)/Simon Stevin of Bruges (1548-1620).pdf",
      "kind": "reference",
      "pages": 68
    },
    {
      "chapter": "9",
      "path": "参考文档(References)/Social Processes and Proofs of Theorems and Programs.pdf",
      "kind": "reference",
      "pages": 10
    },
    {
      "chapter": "6",
      "path": "参考文档(References)/Tecton：A Language for Manipulating Generic Objects.pdf",
      "kind": "reference",
      "pages": 14
    },
    {
      "chapter": "7",
      "path": "参考文档(References)/Tecton：A Language for Manipulating Generic Objects.pdf",
      "kind": "reference",
      "pages": 14
    },
    {
      "chapter": "10",
      "path": "参考文档(References)/The Standard Template Library by Stepanov & Lee.pdf",
      "kind": "reference",
      "pages": 66
    },
    {
      "chapter": "11",
      "path": "参考文档(References)/The Standard Template Library by Stepanov & Lee.pdf",
      "kind": "reference",
      "pages": 66
    },
    {
      "chapter": "C",
      "path": "参考文档(References)/The Standard Template Library by Stepanov & Lee.pdf",
      "kind": "reference",
      "pages": 66
    },
    {
      "chapter": "9",
      "path": "参考文档(References)/Twelve Articles on Giuseppe Peano.pdf",
      "kind": "reference",
      "pages": 107
    },
    {
      "chapter": "5",
      "path": "参考文档(References)/致德国公主的书信.pdf",
      "kind": "reference",
      "pages": 507
    },
    {
      "chapter": "1",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt1.pdf",
      "kind": "slides",
      "pages": 231,
      "startPage": 2,
      "endPage": 13
    },
    {
      "chapter": "2",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt1.pdf",
      "kind": "slides",
      "pages": 231,
      "startPage": 14,
      "endPage": 40
    },
    {
      "chapter": "3",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt1.pdf",
      "kind": "slides",
      "pages": 231,
      "startPage": 41,
      "endPage": 75
    },
    {
      "chapter": "3",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt1.pdf",
      "kind": "slides",
      "pages": 231,
      "startPage": 76,
      "endPage": 107
    },
    {
      "chapter": "4",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt1.pdf",
      "kind": "slides",
      "pages": 231,
      "startPage": 108,
      "endPage": 141
    },
    {
      "chapter": "4",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt1.pdf",
      "kind": "slides",
      "pages": 231,
      "startPage": 142,
      "endPage": 166
    },
    {
      "chapter": "5",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt1.pdf",
      "kind": "slides",
      "pages": 231,
      "startPage": 167,
      "endPage": 199
    },
    {
      "chapter": "5",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt1.pdf",
      "kind": "slides",
      "pages": 231,
      "startPage": 200,
      "endPage": 231
    },
    {
      "chapter": "6",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt2.pdf",
      "kind": "slides",
      "pages": 267,
      "startPage": 2,
      "endPage": 37
    },
    {
      "chapter": "6",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt2.pdf",
      "kind": "slides",
      "pages": 267,
      "startPage": 38,
      "endPage": 72
    },
    {
      "chapter": "7",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt2.pdf",
      "kind": "slides",
      "pages": 267,
      "startPage": 73,
      "endPage": 111
    },
    {
      "chapter": "7",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt2.pdf",
      "kind": "slides",
      "pages": 267,
      "startPage": 112,
      "endPage": 137
    },
    {
      "chapter": "8",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt2.pdf",
      "kind": "slides",
      "pages": 267,
      "startPage": 138,
      "endPage": 170
    },
    {
      "chapter": "8",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt2.pdf",
      "kind": "slides",
      "pages": 267,
      "startPage": 171,
      "endPage": 207
    },
    {
      "chapter": "9",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt2.pdf",
      "kind": "slides",
      "pages": 267,
      "startPage": 208,
      "endPage": 241
    },
    {
      "chapter": "9",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt2.pdf",
      "kind": "slides",
      "pages": 267,
      "startPage": 242,
      "endPage": 267
    },
    {
      "chapter": "10",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt3.pdf",
      "kind": "slides",
      "pages": 239,
      "startPage": 2,
      "endPage": 40
    },
    {
      "chapter": "10",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt3.pdf",
      "kind": "slides",
      "pages": 239,
      "startPage": 41,
      "endPage": 70
    },
    {
      "chapter": "11",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt3.pdf",
      "kind": "slides",
      "pages": 239,
      "startPage": 71,
      "endPage": 103
    },
    {
      "chapter": "11",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt3.pdf",
      "kind": "slides",
      "pages": 239,
      "startPage": 104,
      "endPage": 135
    },
    {
      "chapter": "12",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt3.pdf",
      "kind": "slides",
      "pages": 239,
      "startPage": 136,
      "endPage": 167
    },
    {
      "chapter": "12",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt3.pdf",
      "kind": "slides",
      "pages": 239,
      "startPage": 168,
      "endPage": 193
    },
    {
      "chapter": "13",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt3.pdf",
      "kind": "slides",
      "pages": 239,
      "startPage": 194,
      "endPage": 229
    },
    {
      "chapter": "14",
      "path": "课件(Course Materials)/FM2GP_Course_Slides_Pt3.pdf",
      "kind": "slides",
      "pages": 239,
      "startPage": 230,
      "endPage": 239
    }
  ]
};
