# Beginner Algorithms Design

## Goal

Add three genuinely beginner-friendly algorithms to the bilingual algorithm visualization app:

- Insertion Sort
- Selection Sort
- Prefix Sum

These additions should make the first learning path more complete for users who need basic array and sorting concepts before moving into binary search, merge sort, quick sort, heaps, and number theory.

## Scope

This implementation adds three production algorithm visualizations, each with:

- A pure step generator in `src/lib/algorithms`.
- Unit tests written before implementation.
- A React visualization page in `src/components/algorithms`.
- English and Chinese UI labels, descriptions, developer notes, and algorithm explanations.
- A route in `src/App.tsx`.
- Entries on the home topic dashboard.

The implementation does not add persistence, user accounts, analytics, or a global algorithm metadata registry. The current home page already owns its dashboard metadata, and this feature should keep using that pattern. These algorithms are extension algorithms, not algorithms introduced in the book, so they must not display book section numbers.

## Algorithms

### Insertion Sort

Insertion Sort teaches the invariant that the prefix `[0, sortedEnd]` is sorted. Each step should show the current key, the comparison index, shifts to the right, and insertion into the correct position.

The visualization should emphasize that the algorithm is useful for small or nearly sorted arrays, even though its worst-case time is `O(n^2)`.

### Selection Sort

Selection Sort teaches repeated minimum selection. Each pass scans the unsorted suffix, tracks the current minimum, and swaps it into the next fixed position.

The visualization should emphasize that Selection Sort does fewer swaps than Bubble Sort but still performs `O(n^2)` comparisons.

### Prefix Sum

Prefix Sum teaches cumulative preprocessing for fast range-sum queries. The step generator should build a `prefix` array where `prefix[i + 1] = prefix[i] + array[i]`, then answer one range query `[left, right]` using `prefix[right + 1] - prefix[left]`.

This gives beginners a practical bridge from simple array traversal to more advanced range-query and dynamic-programming ideas.

## UI Design

Each page follows existing beginner algorithm pages:

- Input controls in a white panel.
- Random/reset/start buttons.
- Step playback via `StepController`.
- A compact visualization surface.
- `ExplanationPanel` with current step description, invariant, and complexity.

Insertion Sort and Selection Sort should render array cells with state colors for sorted, active, comparing, minimum, shifting, and swapped elements.

Prefix Sum should render two rows:

- Input array values with indices.
- Prefix array values with indices.

The query range should be highlighted on the input row, and the two prefix cells used in the subtraction should be highlighted on the prefix row.

## Routing And Home Placement

Add routes:

- `/insertion-sort`
- `/selection-sort`
- `/prefix-sum`

Home page placement:

- Add Insertion Sort and Selection Sort to the sorting topic before Merge Sort.
- Add Prefix Sum to the search/sequence topic, near Linear Search and Binary Search.

All home entries must be bilingual, marked `beginner`, and categorized as `Extra` / `扩展` instead of showing a section number.

## Testing

Use TDD for all new step generators.

Required unit tests:

- Insertion Sort sorts arrays with mixed values and exposes the sorted-prefix invariant.
- Selection Sort sorts arrays with mixed values and records each pass/minimum selection.
- Prefix Sum builds the correct prefix array and answers an inclusive range query.
- Each algorithm validates invalid input cleanly.
- Each algorithm reports beginner-appropriate complexity metadata.

Existing app checks must still pass:

- `npx eslint . --max-warnings=0`
- `npx tsc -p tsconfig.app.json --noEmit`
- `npm run test:run`
- `npm run build`

## Non-Goals

- Do not add Bubble Sort in this batch.
- Do not refactor all algorithm metadata into a shared registry.
- Do not redesign the navigation beyond adding the new entries.
- Do not add advanced data structures or graph algorithms in this batch.

## Self-Review

- No placeholders remain.
- The scope is limited to three beginner algorithms.
- The routing, homepage, testing, bilingual, and no-section requirements are explicit.
- The feature can be implemented in one focused plan without requiring unrelated refactors.
