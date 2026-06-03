# Home Topic Dashboard Design

## Goal

Improve the home page so users can understand the algorithm collection by topic, difficulty, and learning purpose instead of scanning a long chapter-ordered list.

The project already contains many algorithms from *From Mathematics to Generic Programming* plus several advanced additions. The new home page should make the collection easier to browse as the number of algorithms grows, while still preserving book section references.

## Selected Approach

Use a topic dashboard as the primary home page structure.

The dashboard groups algorithms into topic sections:

1. Search and Sequences
2. Sorting and Heaps
3. Number Theory Basics
4. GCD and Modular Arithmetic
5. Applications and Graphs

Each topic section shows:

- Topic name
- Short topic description
- Algorithm count
- Recommended starting algorithm
- Algorithm cards or compact rows

Each algorithm entry shows:

- Algorithm title
- Section or source label
- Difficulty label
- Short purpose statement
- Link to the existing route

## Learning Path

The page keeps a small recommended learning path above the topic dashboard:

`Linear Search -> Binary Search -> GCD -> Power Algorithm -> RSA`

This path is not the main navigation structure. It is a beginner entry point for users who do not know where to start.

## Topic Grouping

### Search and Sequences

Algorithms:

- Linear Search
- Binary Search
- Range Swap
- Rotation Algorithm
- Cycle Decomposition
- Reverse

Recommended start: Linear Search

Purpose: introduce iteration, ordered ranges, invariants, and sequence transformations.

### Sorting and Heaps

Algorithms:

- Merge Sort
- Quick Sort
- Heap Operations

Recommended start: Merge Sort

Purpose: introduce divide-and-conquer, partitioning, tree-backed array structures, and complexity comparison.

### Number Theory Basics

Algorithms:

- Sieve of Eratosthenes
- Prime Counting Function
- Palindromic Primes
- Prime Number Checker
- Fermat's Little Theorem
- Euler's Theorem

Recommended start: Sieve of Eratosthenes

Purpose: build the foundation for primality, modular arithmetic, and later cryptographic examples.

### GCD and Modular Arithmetic

Algorithms:

- Euclidean Algorithm
- Division Algorithm
- Stein's GCD
- Extended GCD
- GCD Performance Comparison

Recommended start: Euclidean Algorithm

Purpose: connect division, remainder, greatest common divisor, binary optimization, and Bezout coefficients.

### Applications and Graphs

Algorithms:

- Egyptian Multiplication
- Power Algorithm
- Basic Fibonacci
- Fast Fibonacci
- Shortest Path
- Graph Traversal
- Upper Bound for Pi
- Miller-Rabin Test
- RSA

Recommended start: Egyptian Multiplication

Purpose: show how earlier algorithmic ideas compose into higher-level applications and generic programming examples.

## UI Structure

The home page should use a work-focused dashboard layout:

- Header with title, language toggle, blog link, and GitHub link
- Recommended path strip
- Topic dashboard grid
- Compact algorithm entries inside each topic
- Existing quote and book cover can remain below the dashboard

The design should avoid a marketing landing page. The first screen should immediately expose useful navigation.

## Data Model

Define a local data structure in `Home.tsx` or a nearby helper if the file becomes crowded:

- `path`
- `label`
- `section`
- `difficulty`
- `summary`
- `topic`
- `recommendedStart`

The first implementation can keep this local to `Home.tsx` to avoid broad refactoring. If the algorithm metadata starts being reused elsewhere, extract it later.

## Difficulty Labels

Use three labels:

- Beginner
- Intermediate
- Advanced

Chinese equivalents:

- 入门
- 进阶
- 高级

Difficulty is a teaching hint, not a correctness or chapter ordering mechanism.

## Internationalization

The initial implementation can use inline localized metadata objects for English and Chinese in `Home.tsx`, matching the current home page pattern.

Avoid adding many individual translation keys unless the metadata is reused outside the home page.

## Testing and Verification

Required verification after implementation:

- `npx eslint . --max-warnings=0`
- `npx tsc -p tsconfig.app.json --noEmit`
- `npm run test:run`
- `npm run build`

Manual browser verification should check:

- Each topic section appears in both languages
- Existing algorithm links still route correctly
- Mobile layout remains readable
- Recommended path links work

## Out of Scope

This change does not add new algorithm implementations.

This change does not redesign individual algorithm pages.

This change does not migrate algorithm metadata into a global registry unless implementation pressure makes that clearly simpler.
