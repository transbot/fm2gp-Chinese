# Algorithm Visualization Extension Design

## Overview

Extend the fm2gp-Chinese web application with new algorithm visualizations and improved user interactions. The project includes:

1. **Book algorithms** - 9 algorithms from the book not yet implemented
2. **Advanced algorithms** - 4 algorithms not in the book, marked as "Advanced"
3. **Interaction improvements** - Step control, animations, explanations, interactive input
4. **Bilingual support** - All content in Chinese and English

## Design Approach

**Progressive Enhancement (方案A)**: Build interaction infrastructure first, then add algorithm components. This ensures all components (new and existing) benefit from the same interaction framework.

---

## Part 1: Interaction Infrastructure

### 1.0 Algorithm Visualization Interface (核心接口规范)

所有算法可视化组件必须实现统一接口，确保基础设施可复用：

```typescript
// 统一的算法可视化接口
interface AlgorithmVisualization<TInput, TState> {
  // 预生成步骤序列（推荐，便于回退和跳转）
  generateSteps(input: TInput): Step<TState>[];

  // 输入验证
  validateInput(input: TInput): ValidationResult;

  // 初始状态
  getInitialState(): TState;

  // 步骤描述（用于ExplanationPanel）
  describeStep(step: Step<TState>, lang: 'en' | 'zh'): string;

  // 不变量（可选）
  getInvariant?(lang: 'en' | 'zh'): string;

  // 复杂度信息
  getComplexity(): ComplexityInfo;
}

interface Step<TState> {
  state: TState;
  operation: string;         // 操作类型标识
  descriptionKey: string;    // 翻译键
  highlights?: number[];     // 高亮元素索引
  animation?: AnimationSpec; // 动画规格（可选）
}

interface ComplexityInfo {
  time: string;
  space: string;
  worstCase?: string;
  bestCase?: string;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
  errorKey?: string;  // 翻译键
}
```

**设计决策：预生成步骤序列**
- 采用预生成而非按需计算，便于：
  - 支持回退（backward）
  - 支持跳转（seek）
  - 统一的步进控制逻辑

### 1.1 StepController Component

Universal step-by-step control for all algorithm visualizations.

**Features:**
- Play/Pause button
- Single step forward/backward
- Speed slider (0.5x - 3x)
- Progress bar (draggable to seek)
- Step counter (current/total)

**Interface:**
```typescript
interface StepControllerProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStep: (direction: 'forward' | 'backward') => void;
  onSpeedChange: (speed: number) => void;
  onSeek: (step: number) => void;
}
```

**File:** `src/components/common/StepController.tsx`

### 1.2 Animation Engine

**useAnimation Hook:**
- Element position transitions
- Highlight state changes
- Value change animations
- Support `prefers-reduced-motion` for accessibility

**动画队列处理策略：**
当用户快速点击步进时，采用 **"跳帧"策略**：
- 检测到新操作时，中断当前动画
- 直接跳转到目标状态（跳过中间帧）
- 提供 `skipAnimation` 选项，允许用户禁用动画直接切换状态

```typescript
interface AnimationOptions {
  skipAnimation?: boolean;      // 跳过动画直接切换
  duration?: number;            // 动画时长（毫秒）
  easing?: 'linear' | 'ease' | 'ease-in-out';
}
```

**File:** `src/hooks/useAnimation.ts`

### 1.3 useStepControl Hook

管理步进状态的通用hook，与算法核心接口配合：

```typescript
interface UseStepControlOptions<TInput, TState> {
  algorithm: AlgorithmVisualization<TInput, TState>;
  initialInput: TInput;
  autoPlay?: boolean;
  defaultSpeed?: number;
}

interface UseStepControlReturn<TState> {
  // 状态
  currentStep: number;
  totalSteps: number;
  currentState: TState;
  isPlaying: boolean;
  speed: number;

  // 操作
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  seek: (step: number) => void;
  setSpeed: (speed: number) => void;
  reset: () => void;

  // 步骤信息
  steps: Step<TState>[];
}
```

**File:** `src/hooks/useStepControl.ts`

### 1.3 ExplanationPanel Component

Display contextual information for each step.

**Content:**
- Current operation description
- Invariants (不变量)
- Time/space complexity
- Related code snippet (optional)

**Interface:**
```typescript
interface ExplanationPanelProps {
  stepDescription: string;
  invariant?: string;
  complexity?: {
    time: string;
    space: string;
  };
  codeSnippet?: string;
  lang: 'en' | 'zh';
}
```

**File:** `src/components/common/ExplanationPanel.tsx`

### 1.5 Interactive Input Components

Allow users to manipulate data directly.

**Features:**
- Drag-and-drop array elements
- Click to select/highlight
- Direct value editing
- Graph node/edge manipulation

**Files:**
- `src/components/common/DraggableArray.tsx`
- `src/components/common/EditableGraph.tsx`

**EditableGraph 复杂度说明：**
此组件是最复杂的交互组件，需要实现：
- 节点/边的增删改
- 节点拖拽重定位
- 自动布局算法（力导向或网格布局）
- 缩放和平移支持

**验证策略：** 先用图遍历算法验证此组件的完整性，再批量开发其他算法。

---

## Part 2: Book Algorithms (9 components)

All book algorithms display section reference in title:
- Chinese: `X.X节 - 算法名称`
- English: `Section X.X - Algorithm Name`

### 2.1 Division Algorithm (Section 4.5)

**Title:**
- 中文: `4.5节 - 求余求商算法`
- English: `Section 4.5 - Quotient and Remainder Algorithm`

**Visualization:**
- Show dividend, divisor, quotient, remainder relationship
- Step-by-step execution of `quotient_remainder` function
- Support any positive integer input

**Algorithm File:** `src/lib/algorithms/division.ts`
**Component File:** `src/components/algorithms/Division.tsx`
**Route:** `/division`

### 2.2 Generic Power Algorithm (Section 7.5)

**Title:**
- 中文: `7.5节 - 泛型幂算法`
- English: `Section 7.5 - Generic Power Algorithm`

**Visualization:**
- Show generalization from Egyptian multiplication to power operation
- Support different operation types (multiplication→power, addition→multiplication)
- Compare recursive vs iterative implementations

**Algorithm File:** `src/lib/algorithms/power.ts`
**Component File:** `src/components/algorithms/PowerAlgorithm.tsx`
**Route:** `/power`

### 2.3 Linear Search (Section 10.7)

**Title:**
- 中文: `10.7节 - 线性查找`
- English: `Section 10.7 - Linear Search`

**Visualization:**
- Highlight each element as it's scanned
- Show comparison count statistics
- Support successful/failed search scenarios

**Algorithm File:** `src/lib/algorithms/linear_search.ts`
**Component File:** `src/components/algorithms/LinearSearch.tsx`
**Route:** `/linear-search`

### 2.4 Swap/Exchange (Section 11.2)

**Title:**
- 中文: `11.2节 - 区间交换`
- English: `Section 11.2 - Range Swap`

**Visualization:**
- Show exchange of two adjacent subranges
- Support custom range lengths
- Display memory layout before/after swap

**Algorithm File:** `src/lib/algorithms/swap.ts`
**Component File:** `src/components/algorithms/Swap.tsx`
**Route:** `/swap`

### 2.5 Reverse Algorithm (Section 11.5)

**Title:**
- 中文: `11.5节 - 反转算法`
- English: `Section 11.5 - Reverse Algorithm`

**Visualization:**
- Bidirectional reverse process animation
- Support partial reverse (specified range)
- Element swap animation

**Algorithm File:** `src/lib/algorithms/reverse.ts`
**Component File:** `src/components/algorithms/Reverse.tsx`
**Route:** `/reverse`

### 2.6 Cycle Algorithm (Section 11.4)

**Title:**
- 中文: `11.4节 - 循环算法`
- English: `Section 11.4 - Cycle Algorithm`

**Visualization:**
- Permutation cycle decomposition
- Cycle orbit tracking animation
- Support custom permutation input

**Algorithm File:** `src/lib/algorithms/cycle.ts`
**Component File:** `src/components/algorithms/Cycle.tsx`
**Route:** `/cycle`

### 2.7 Stein's GCD Visualization (Section 12.1-12.2)

**Title:**
- 中文: `12.1节-12.2节 - 斯坦因GCD算法`
- English: `Section 12.1-12.2 - Stein's GCD Algorithm`

**Visualization:**
- Compare with Euclidean GCD side-by-side
- Highlight bitwise operations (shift, AND)
- Operation count comparison statistics

**Algorithm File:** `src/lib/algorithms/stein_gcd.ts`
**Component File:** `src/components/algorithms/SteinGcd.tsx`
**Route:** `/stein-gcd`

### 2.8 Fermat's Little Theorem (Section 5.2)

**Title:**
- 中文: `5.2节 - 费马小定理`
- English: `Section 5.2 - Fermat's Little Theorem`

**Visualization:**
- Input prime p and arbitrary a, verify a^(p-1) ≡ 1 (mod p)
- Modular arithmetic process visualization
- Show theorem conditions and conclusion

**Algorithm File:** `src/lib/algorithms/fermat.ts`
**Component File:** `src/components/algorithms/FermatTheorem.tsx`
**Route:** `/fermat`

### 2.9 Euler's Theorem (Section 5.5)

**Title:**
- 中文: `5.5节 - 欧拉定理`
- English: `Section 5.5 - Euler's Theorem`

**Visualization:**
- Input n and a (gcd(a,n)=1), verify a^φ(n) ≡ 1 (mod n)
- Show Euler's totient function φ(n) calculation
- Compare with Fermat's Little Theorem

**Algorithm File:** `src/lib/algorithms/euler.ts`
**Component File:** `src/components/algorithms/EulerTheorem.tsx`
**Route:** `/euler`

---

## Part 3: Advanced Algorithms (4 components)

Advanced algorithms are marked with `(进阶)` / `(Advanced)` in title.

### 3.1 Quick Sort

**Title:**
- 中文: `快速排序 (进阶)`
- English: `Quick Sort (Advanced)`

**Visualization:**
- Partition process (Lomuto/Hoare schemes)
- Recursion tree display
- Pivot selection animation

**Algorithm File:** `src/lib/algorithms/quick_sort.ts`
**Component File:** `src/components/algorithms/QuickSort.tsx`
**Route:** `/quick-sort`

### 3.2 Merge Sort

**Title:**
- 中文: `归并排序 (进阶)`
- English: `Merge Sort (Advanced)`

**Visualization:**
- Divide-and-conquer process
- Merge operation animation
- Performance comparison with Quick Sort

**Algorithm File:** `src/lib/algorithms/merge_sort.ts`
**Component File:** `src/components/algorithms/MergeSort.tsx`
**Route:** `/merge-sort`

### 3.3 Heap Operations

**Title:**
- 中文: `堆操作 (进阶)`
- English: `Heap Operations (Advanced)`

**Visualization:**
- Dual view: tree and array representation
- Insert, delete, heapify operations
- Complete heap sort process

**Algorithm File:** `src/lib/algorithms/heap.ts`
**Component File:** `src/components/algorithms/HeapOperations.tsx`
**Route:** `/heap`

### 3.4 BFS/DFS Graph Traversal

**Title:**
- 中文: `图遍历 (进阶)`
- English: `Graph Traversal (Advanced)`

**Visualization:**
- Visual graph editing (add nodes/edges)
- Traversal order animation
- Queue/Stack state display

**Algorithm File:** `src/lib/algorithms/graph_traversal.ts`
**Component File:** `src/components/algorithms/GraphTraversal.tsx`
**Route:** `/graph-traversal`

---

## Part 4: Translation Extension

### 4.1 Translation Structure

Extend existing `src/i18n/translations.ts` with:

```typescript
// New algorithm titles and descriptions
divisionAlgorithm: '4.5节 - 求余求商算法',
powerAlgorithm: '7.5节 - 泛型幂算法',
linearSearch: '10.7节 - 线性查找',
// ... etc

// Step descriptions for each algorithm
divisionStep1: '计算初始商...',
divisionStep2: '调整余数...',
// ... etc

// Common UI elements
play: '播放',
pause: '暂停',
stepForward: '前进',
stepBackward: '后退',
speed: '速度',
currentStep: '当前步骤',
totalSteps: '总步数',
invariant: '不变量',
timeComplexity: '时间复杂度',
spaceComplexity: '空间复杂度',
advanced: '进阶',
// ... etc
```

### 4.2 Section Reference Format

- Book algorithms: Include section number in title
- Advanced algorithms: Append `(进阶)` / `(Advanced)`
- Developer notes: Reference relevant book sections

---

## Part 5: File Structure

```
src/
├── components/
│   ├── common/
│   │   ├── StepController.tsx      # Step control UI
│   │   ├── ExplanationPanel.tsx    # Step explanation display
│   │   ├── AnimationWrapper.tsx    # Animation wrapper component
│   │   ├── DraggableArray.tsx      # Interactive array manipulation
│   │   └── EditableGraph.tsx       # Interactive graph editing
│   ├── algorithms/
│   │   ├── Division.tsx            # 4.5 Quotient/Remainder
│   │   ├── PowerAlgorithm.tsx      # 7.5 Generic Power
│   │   ├── LinearSearch.tsx        # 10.7 Linear Search
│   │   ├── Swap.tsx                # 11.2 Range Swap
│   │   ├── Reverse.tsx             # 11.5 Reverse
│   │   ├── Cycle.tsx               # 11.4 Cycle
│   │   ├── SteinGcd.tsx            # 12.1-12.2 Stein's GCD
│   │   ├── FermatTheorem.tsx       # 5.2 Fermat's Little Theorem
│   │   ├── EulerTheorem.tsx        # 5.5 Euler's Theorem
│   │   ├── QuickSort.tsx           # Advanced: Quick Sort
│   │   ├── MergeSort.tsx           # Advanced: Merge Sort
│   │   ├── HeapOperations.tsx      # Advanced: Heap
│   │   └── GraphTraversal.tsx      # Advanced: Graph Traversal
│   └── ...existing components
├── hooks/
│   ├── useAnimation.ts             # Animation management hook
│   └── useStepControl.ts           # Step control state hook
├── lib/algorithms/
│   ├── division.ts
│   ├── power.ts
│   ├── linear_search.ts
│   ├── swap.ts
│   ├── reverse.ts
│   ├── cycle.ts
│   ├── stein_gcd.ts
│   ├── fermat.ts
│   ├── euler.ts
│   ├── quick_sort.ts
│   ├── merge_sort.ts
│   ├── heap.ts
│   └── graph_traversal.ts
└── i18n/
    └── translations.ts             # Extended translations
```

---

## Part 6: Integration with Existing Components

### 6.1 Upgrading Existing Visualizations

**必须改造的组件（步进逻辑可复用）：**
| 组件 | 改造内容 | 预估工时 |
|------|----------|----------|
| Sieve | 替换手动步进按钮为StepController | 2h |
| Gcm | 添加ExplanationPanel，统一交互 | 2h |
| Fibonacci | 添加步进控制，优化动画 | 2h |
| FastFibonacci | 添加步进控制，优化动画 | 2h |

**可选改造的组件（主要是静态展示）：**
| 组件 | 改造内容 | 预估工时 |
|------|----------|----------|
| Calculator | 添加ExplanationPanel | 1h |
| PrimeChecker | 添加ExplanationPanel | 1h |
| Rsa | 添加步进控制和ExplanationPanel | 3h |

**暂不改造的组件（已有较好的可视化）：**
- Rotate - 已有较好的动画展示
- ShortestPath - 已有矩阵可视化
- BinarySearch - 已有完整的步进展示
- MillerRabin - 已有完整流程
- ExtendedGcd - 已有对比展示
- GcdComparison - 性能对比，无需步进
- PrimeCounting - 图表展示，无需步进
- PalindromicPrimes - 列表展示，无需步进
- PiUpperBound - 几何可视化，无需步进

**改造原则：**
1. 保持现有功能不变
2. 统一交互体验（StepController）
3. 添加上下文说明（ExplanationPanel）
4. 添加开发者笔记（引用书中章节）

### 6.2 Home Page Update

Update `src/pages/Home.tsx` to organize links:

- **Book Algorithms** (with section numbers)
- **Advanced Algorithms** (marked as 进阶/Advanced)
- Maintain bilingual labels

### 6.3 App Router Update

Update `src/App.tsx` with new routes for all 13 new algorithms.

---

## Part 7: Implementation Order (Vertical Slices)

### 里程碑1：架构验证（约25人时）

**目标：** 验证基础设施的通用性，确保能支持最简单和最复杂的场景

**交付物：**
1. 基础设施组件
   - StepController (6h)
   - ExplanationPanel (3h)
   - useStepControl (5h)
   - useAnimation (7h)

2. 线性查找 - 最简单场景验证 (3h)
   - 验证基础流程
   - 验证步进控制
   - 验证双语支持

3. 图遍历 - 最复杂场景验证 (14h)
   - EditableGraph组件开发
   - BFS/DFS算法实现
   - 验证交互极限

**验收标准：**
- 两个算法可演示，交互流畅
- 双语完整
- 步进控制（播放/暂停/前进/后退/跳转）正常工作
- 动画队列处理正确（快速点击不卡顿）

---

### 里程碑2：原书算法批量开发（约45人时）

**简单组（约16人时）：**
| 算法 | 开发 | 调试 | 总计 |
|------|------|------|------|
| Division (4.5) | 3h | 2h | 5h |
| Fermat (5.2) | 3h | 1h | 4h |
| Euler (5.5) | 3h | 1h | 4h |
| 翻译扩展 | 3h | - | 3h |

**中等组（约23人时）：**
| 算法 | 开发 | 调试 | 总计 |
|------|------|------|------|
| Power (7.5) | 4h | 2h | 6h |
| Swap (11.2) | 3h | 2h | 5h |
| Reverse (11.5) | 3h | 2h | 5h |
| Cycle (11.4) | 4h | 3h | 7h |

**复杂组（约7人时）：**
| 算法 | 开发 | 调试 | 总计 |
|------|------|------|------|
| Stein's GCD (12.1-12.2) | 4h | 3h | 7h |

**每组完成后验收，发现问题及时修正基础设施。**

---

### 里程碑3：进阶算法批量开发（约28人时）

**简单组（约17人时）：**
| 算法 | 开发 | 调试 | 总计 |
|------|------|------|------|
| QuickSort | 5h | 4h | 9h |
| MergeSort | 5h | 3h | 8h |

**复杂组（约11人时）：**
| 算法 | 开发 | 调试 | 总计 |
|------|------|------|------|
| Heap Operations | 6h | 5h | 11h |

**注：图遍历已在里程碑1完成**

---

### 里程碑4：现有组件升级（约12人时）

| 组件 | 改造内容 | 工时 |
|------|----------|------|
| Sieve | StepController + ExplanationPanel | 2h |
| Gcm | ExplanationPanel | 2h |
| Fibonacci | StepController + ExplanationPanel | 2h |
| FastFibonacci | StepController + ExplanationPanel | 2h |
| Calculator | ExplanationPanel | 1h |
| PrimeChecker | ExplanationPanel | 1h |
| Rsa | StepController + ExplanationPanel | 2h |

---

### 里程碑5：最终打磨（约8人时）

- Home页面重组（区分原书算法/进阶算法）
- 翻译验证（中英文完整性检查）
- 无障碍测试（键盘导航、屏幕阅读器、减少动画选项）
- 性能优化（动画流畅度、响应速度）

---

## Part 8: Resource Estimation

### 总工时估算

| 阶段 | 工时 | 工作日（8h/天） |
|------|------|-----------------|
| 里程碑1：架构验证 | 25h | 3.1天 |
| 里程碑2：原书算法 | 45h | 5.6天 |
| 里程碑3：进阶算法 | 28h | 3.5天 |
| 里程碑4：现有升级 | 12h | 1.5天 |
| 里程碑5：最终打磨 | 8h | 1天 |
| **总计** | **118h** | **约15工作日** |

### 风险缓冲

建议预留20%缓冲时间，总计约 **18工作日**。

### 关键风险项

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| EditableGraph复杂度超预期 | 延迟里程碑1 | 可先使用预设图，后续迭代添加编辑功能 |
| 动画队列处理复杂 | 影响用户体验 | 采用跳帧策略，优先保证响应性 |
| 算法状态模型差异大 | useStepControl难以复用 | 在里程碑1验证时及时调整接口 |
| 翻译遗漏 | 影响双语体验 | 每个里程碑验收时检查翻译完整性 |

---

## Success Criteria

1. All 13 new algorithms work correctly with step-by-step visualization
2. All visualizations (new and existing) have consistent interaction controls
3. Full bilingual support (Chinese/English) for all content
4. Book algorithms display correct section references
5. Advanced algorithms clearly marked as "进阶"/"Advanced"
6. Accessibility: keyboard navigation, screen reader support, reduced motion option
7. Performance: smooth animations, responsive UI
8. **里程碑验收：每个里程碑完成后可演示，问题及时发现和修正**

---

## Appendix: Algorithm Core Interface Example

以线性查找为例，展示算法核心模块的完整实现：

```typescript
// src/lib/algorithms/linear_search.ts

interface LinearSearchInput {
  array: number[];
  target: number;
}

interface LinearSearchState {
  array: number[];
  target: number;
  currentIndex: number;
  found: boolean;
  foundIndex: number | null;
  comparisons: number;
}

const linearSearchVisualization: AlgorithmVisualization<LinearSearchInput, LinearSearchState> = {
  generateSteps(input: LinearSearchInput): Step<LinearSearchState>[] {
    const steps: Step<LinearSearchState>[] = [];
    const { array, target } = input;

    for (let i = 0; i < array.length; i++) {
      steps.push({
        state: {
          array,
          target,
          currentIndex: i,
          found: array[i] === target,
          foundIndex: array[i] === target ? i : null,
          comparisons: i + 1,
        },
        operation: 'compare',
        descriptionKey: array[i] === target ? 'linearSearch.found' : 'linearSearch.compare',
        highlights: [i],
      });

      if (array[i] === target) break;
    }

    // 如果没找到，添加最终状态
    if (steps.length === array.length && array[array.length - 1] !== target) {
      steps.push({
        state: {
          array,
          target,
          currentIndex: -1,
          found: false,
          foundIndex: null,
          comparisons: array.length,
        },
        operation: 'notFound',
        descriptionKey: 'linearSearch.notFound',
      });
    }

    return steps;
  },

  validateInput(input: LinearSearchInput): ValidationResult {
    if (!input.array || input.array.length === 0) {
      return { valid: false, errorKey: 'linearSearch.emptyArray' };
    }
    return { valid: true };
  },

  getInitialState(): LinearSearchState {
    return {
      array: [],
      target: 0,
      currentIndex: -1,
      found: false,
      foundIndex: null,
      comparisons: 0,
    };
  },

  describeStep(step: Step<LinearSearchState>, lang: 'en' | 'zh'): string {
    const { state } = step;
    if (lang === 'zh') {
      if (step.operation === 'notFound') {
        return `遍历完成，未找到目标值 ${state.target}`;
      }
      if (state.found) {
        return `在索引 ${state.currentIndex} 处找到目标值 ${state.target}，共比较 ${state.comparisons} 次`;
      }
      return `比较 array[${state.currentIndex}]=${state.array[state.currentIndex]} 与目标值 ${state.target}，不匹配`;
    } else {
      if (step.operation === 'notFound') {
        return `Traversal complete, target ${state.target} not found`;
      }
      if (state.found) {
        return `Found target ${state.target} at index ${state.currentIndex} after ${state.comparisons} comparisons`;
      }
      return `Comparing array[${state.currentIndex}]=${state.array[state.currentIndex]} with target ${state.target}, no match`;
    }
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'zh'
      ? '已检查区间 [0, currentIndex) 内所有元素均不等于 target'
      : 'All elements in range [0, currentIndex) have been checked and are not equal to target';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(n)',
      space: 'O(1)',
      worstCase: 'O(n) - target not in array or at last position',
      bestCase: 'O(1) - target at first position',
    };
  },
};

export { linearSearchVisualization, LinearSearchInput, LinearSearchState };
```