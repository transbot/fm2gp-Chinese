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

**File:** `src/hooks/useAnimation.ts`

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

### 1.4 Interactive Input Components

Allow users to manipulate data directly.

**Features:**
- Drag-and-drop array elements
- Click to select/highlight
- Direct value editing
- Graph node/edge manipulation

**Files:**
- `src/components/common/DraggableArray.tsx`
- `src/components/common/EditableGraph.tsx`

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

After building the interaction infrastructure, upgrade existing components to use:

1. Replace manual step buttons with `<StepController>`
2. Add `<ExplanationPanel>` to each visualization
3. Wrap animations with `useAnimation` hook
4. Add developer notes for book section references

### 6.2 Home Page Update

Update `src/pages/Home.tsx` to organize links:

- **Book Algorithms** (with section numbers)
- **Advanced Algorithms** (marked as 进阶/Advanced)
- Maintain bilingual labels

### 6.3 App Router Update

Update `src/App.tsx` with new routes for all 13 new algorithms.

---

## Part 7: Implementation Order

1. **Phase 1: Infrastructure**
   - StepController component
   - useAnimation hook
   - ExplanationPanel component
   - useStepControl hook

2. **Phase 2: Book Algorithms**
   - Division (4.5)
   - Power Algorithm (7.5)
   - Linear Search (10.7)
   - Swap (11.2)
   - Reverse (11.5)
   - Cycle (11.4)
   - Stein's GCD (12.1-12.2)
   - Fermat's Theorem (5.2)
   - Euler's Theorem (5.5)

3. **Phase 3: Advanced Algorithms**
   - Quick Sort
   - Merge Sort
   - Heap Operations
   - Graph Traversal

4. **Phase 4: Upgrade Existing**
   - Apply StepController to existing visualizations
   - Add ExplanationPanel to existing visualizations
   - Add developer notes with section references

5. **Phase 5: Final Polish**
   - Home page organization
   - Translation verification
   - Accessibility testing
   - Performance optimization

---

## Success Criteria

1. All 13 new algorithms work correctly with step-by-step visualization
2. All visualizations (new and existing) have consistent interaction controls
3. Full bilingual support (Chinese/English) for all content
4. Book algorithms display correct section references
5. Advanced algorithms clearly marked as "进阶"/"Advanced"
6. Accessibility: keyboard navigation, screen reader support, reduced motion option
7. Performance: smooth animations, responsive UI