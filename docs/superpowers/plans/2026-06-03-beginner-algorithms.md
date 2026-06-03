# Beginner Algorithms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Insertion Sort, Selection Sort, and Prefix Sum as bilingual beginner algorithm visualizations.

**Architecture:** Follow the existing split between pure step generators in `src/lib/algorithms` and React pages in `src/components/algorithms`. Add routes in `src/App.tsx`, add translation keys in `src/i18n/translations.ts`, and add home dashboard entries in `src/pages/Home.tsx`.

**Tech Stack:** React 18, TypeScript, React Router, Tailwind CSS, Vitest, existing `AlgorithmVisualization`, `StepController`, `ExplanationPanel`, `AlgorithmLayout`, `LanguageContext`, and `translations`.

---

## File Structure

- Create: `src/lib/algorithms/insertion_sort.ts`
- Create: `src/lib/algorithms/insertion_sort.test.ts`
- Create: `src/lib/algorithms/selection_sort.ts`
- Create: `src/lib/algorithms/selection_sort.test.ts`
- Create: `src/lib/algorithms/prefix_sum.ts`
- Create: `src/lib/algorithms/prefix_sum.test.ts`
- Create: `src/components/algorithms/InsertionSort.tsx`
- Create: `src/components/algorithms/SelectionSort.tsx`
- Create: `src/components/algorithms/PrefixSum.tsx`
- Modify: `src/App.tsx`
- Modify: `src/i18n/translations.ts`
- Modify: `src/pages/Home.tsx`

## Task 1: Insertion Sort Step Generator

**Files:**
- Create: `src/lib/algorithms/insertion_sort.test.ts`
- Create: `src/lib/algorithms/insertion_sort.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/algorithms/insertion_sort.test.ts` with tests that import `insertionSortVisualization`, sort `[5, 2, 4, 6, 1, 3]`, assert the final array is `[1, 2, 3, 4, 5, 6]`, assert at least one `shift` operation exists, assert there is no book section reference, validate empty arrays fail, and assert complexity is `O(n^2)`.

- [ ] **Step 2: Run the tests to verify RED**

Run:

```powershell
npm run test:run -- src/lib/algorithms/insertion_sort.test.ts
```

Expected: fail because `./insertion_sort` does not exist.

- [ ] **Step 3: Implement the minimal generator**

Create `src/lib/algorithms/insertion_sort.ts` exporting:

- `InsertionSortInput`
- `InsertionSortState`
- `insertionSortVisualization`

State fields:

- `array`
- `originalArray`
- `currentIndex`
- `compareIndex`
- `key`
- `sortedEnd`
- `comparisons`
- `shifts`
- `insertions`

Operations:

- `init`
- `select_key`
- `compare`
- `shift`
- `insert`
- `complete`

- [ ] **Step 4: Run the insertion sort tests to verify GREEN**

Run:

```powershell
npm run test:run -- src/lib/algorithms/insertion_sort.test.ts
```

Expected: pass.

## Task 2: Selection Sort Step Generator

**Files:**
- Create: `src/lib/algorithms/selection_sort.test.ts`
- Create: `src/lib/algorithms/selection_sort.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/algorithms/selection_sort.test.ts` with tests that import `selectionSortVisualization`, sort `[64, 25, 12, 22, 11]`, assert the final array is `[11, 12, 22, 25, 64]`, assert `select_minimum`, `compare`, and `swap` operations exist, assert there is no book section reference, validate empty arrays fail, and assert complexity is `O(n^2)`.

- [ ] **Step 2: Run the tests to verify RED**

Run:

```powershell
npm run test:run -- src/lib/algorithms/selection_sort.test.ts
```

Expected: fail because `./selection_sort` does not exist.

- [ ] **Step 3: Implement the minimal generator**

Create `src/lib/algorithms/selection_sort.ts` exporting:

- `SelectionSortInput`
- `SelectionSortState`
- `selectionSortVisualization`

State fields:

- `array`
- `originalArray`
- `currentPass`
- `scanIndex`
- `minIndex`
- `sortedUntil`
- `comparisons`
- `swaps`

Operations:

- `init`
- `select_minimum`
- `compare`
- `new_minimum`
- `swap`
- `lock`
- `complete`

- [ ] **Step 4: Run the selection sort tests to verify GREEN**

Run:

```powershell
npm run test:run -- src/lib/algorithms/selection_sort.test.ts
```

Expected: pass.

## Task 3: Prefix Sum Step Generator

**Files:**
- Create: `src/lib/algorithms/prefix_sum.test.ts`
- Create: `src/lib/algorithms/prefix_sum.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/algorithms/prefix_sum.test.ts` with tests that import `prefixSumVisualization`, use `{ array: [3, -2, 5, 1, 6], left: 1, right: 3 }`, assert final prefix is `[0, 3, 1, 6, 7, 13]`, assert result is `4`, assert operations include `build_prefix` and `answer_query`, assert there is no book section reference, validate invalid ranges fail, and assert build/query complexity metadata.

- [ ] **Step 2: Run the tests to verify RED**

Run:

```powershell
npm run test:run -- src/lib/algorithms/prefix_sum.test.ts
```

Expected: fail because `./prefix_sum` does not exist.

- [ ] **Step 3: Implement the minimal generator**

Create `src/lib/algorithms/prefix_sum.ts` exporting:

- `PrefixSumInput`
- `PrefixSumState`
- `prefixSumVisualization`

State fields:

- `array`
- `prefix`
- `currentIndex`
- `left`
- `right`
- `queryResult`
- `buildComplete`
- `activePrefixIndices`

Operations:

- `init`
- `build_prefix`
- `query_setup`
- `answer_query`
- `complete`

- [ ] **Step 4: Run the prefix sum tests to verify GREEN**

Run:

```powershell
npm run test:run -- src/lib/algorithms/prefix_sum.test.ts
```

Expected: pass.

## Task 4: Bilingual UI Pages

**Files:**
- Create: `src/components/algorithms/InsertionSort.tsx`
- Create: `src/components/algorithms/SelectionSort.tsx`
- Create: `src/components/algorithms/PrefixSum.tsx`
- Modify: `src/i18n/translations.ts`

- [ ] **Step 1: Add translation keys**

Add English and Chinese keys for titles, descriptions, developer notes, input labels, and start button labels:

- `insertionSortTitle`
- `insertionSortDescription`
- `devNoteInsertionSort`
- `selectionSortTitle`
- `selectionSortDescription`
- `devNoteSelectionSort`
- `prefixSumTitle`
- `prefixSumDescription`
- `devNotePrefixSum`
- `startSort`
- `buildPrefixSum`
- `queryRange`
- `leftIndex`
- `rightIndex`

- [ ] **Step 2: Create the three components**

Each component should:

- Use `useLanguage` and `translations`.
- Parse comma-separated arrays.
- Validate and regenerate steps on blur/reset/random.
- Use `StepController` for playback.
- Use `ExplanationPanel` for step description, invariant, complexity, and operation type.
- Use `AlgorithmLayout` with the new title/description/dev note keys.

- [ ] **Step 3: Run typecheck**

Run:

```powershell
npx tsc -p tsconfig.app.json --noEmit
```

Expected: pass.

## Task 5: Routes And Home Dashboard

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Add routes**

Add imports and routes:

- `InsertionSort` at `/insertion-sort`
- `SelectionSort` at `/selection-sort`
- `PrefixSum` at `/prefix-sum`

- [ ] **Step 2: Add home entries**

Add `Prefix Sum` to the search/sequence topic, and add `Insertion Sort` plus `Selection Sort` to the sorting/heaps topic in both languages. Use `Extra` / `扩展` for their section badge and keep their difficulty as `beginner` / `入门`.

- [ ] **Step 3: Run strict eslint and typecheck**

Run:

```powershell
npx eslint . --max-warnings=0
npx tsc -p tsconfig.app.json --noEmit
```

Expected: both pass.

## Task 6: Full Verification

**Files:**
- No new source files.

- [ ] **Step 1: Run all tests**

Run:

```powershell
npm run test:run
```

Expected: all test files pass.

- [ ] **Step 2: Run production build**

Run:

```powershell
npm run build
```

Expected: build succeeds. Existing chunk-size and Browserslist warnings may remain.

- [ ] **Step 3: Start or reuse local dev server**

Run:

```powershell
npm run dev -- --host 127.0.0.1
```

Expected: Vite serves the app on a local URL, usually `http://127.0.0.1:5173/`.

- [ ] **Step 4: Check the new routes**

Request or open:

- `http://127.0.0.1:5173/insertion-sort`
- `http://127.0.0.1:5173/selection-sort`
- `http://127.0.0.1:5173/prefix-sum`

Expected: each route returns HTTP 200 and renders through the React app.

## Self-Review

- The plan covers all requirements in the spec.
- No placeholders or deferred implementation steps remain.
- Each new algorithm has a failing-test-first task.
- UI, routing, homepage, translations, and verification are included.
