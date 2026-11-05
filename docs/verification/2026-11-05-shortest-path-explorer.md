# Shortest-path visual explanation — 2026-11-05

## Change

Replaced the static graph image and isolated matrix output with a bilingual, linked route explorer for section 8.6. The book's seven vertices and twelve directed edges are unchanged.

- Select a start/destination, inspect matrix powers D¹ through D⁶, and move backward or forward.
- Inspect candidate routes on the graph, including their actual edge weights and sums. Default teaching example A → F compares A → B → F (6 + 10 = 16) with A → D → F (3 + 4 = 7).
- A second preset shows why A → G requires three edges, yielding A → B → E → G with distance 11.
- Each candidate explains the previous-power distance to k plus the final edge from k; zero-cost diagonal stays are explicitly explained. Unreachable candidates remain available in a disclosure.
- The distance matrix highlights the selected pair and cells improved over the previous power. Selecting any cell updates the route being inspected.
- Developer notes explain matrices/matrix powers, tropical semirings, 0/∞/at-most semantics, the n−1 edge bound and its no-negative-cycle assumption, and generic programming in plain language.
- Each displayed power is still computed by repeated squaring with min-plus matrix multiplication. Stored witnesses identify actual routes without fictional diagonal loops; ties prefer fewer edges.

## Verification

| Check | Result |
| --- | --- |
| ESLint, zero warnings | PASS |
| TypeScript app and Node configs | PASS |
| Vitest full suite | PASS — 22 files, 199 tests |
| Production build | PASS |
| Browser, 1440px and 390px, Chinese and English | PASS |
| Whitespace diff check | PASS |

The pre-existing non-fatal outdated Browserslist/caniuse-lite warning remains. No runtime dependency was added.

RED → GREEN: new rendered-page tests initially failed because route/step explanations were missing; the new algorithm suite initially could not import the not-yet-created module. After implementation all six new tests passed. Algorithm tests compare every final pair against exhaustive simple-path enumeration, validate each path's endpoints/edge budget/weight sum, check monotone distances, and cover disconnected vertices and zero-cost stays. UI tests cover candidate selection/highlighting, matrix-cell selection, backward stepping, reset, and switching language during an active calculation.

Real browser checks exercised both presets, longer and shortest candidate highlighting, the ∞ → 11 change at three edges, previous/next stepping, diagonal distance zero, the six-edge completion state, and language switching. No page errors or page-level horizontal overflow occurred. At 390px the full seven-vertex matrix is visible without horizontal scrolling; narrower screens retain the local overflow container.

Visual review identified and corrected curved-edge labels near vertices. A geometry check sampled each of the twelve rendered edge curves at 1001 positions: all remain inside the SVG and stay clear of unrelated vertex circles. Final screenshots were reviewed after those corrections; all edge weights remain readable while unused edge strokes are de-emphasized.

- [Desktop route and comparison](shortest-explorer-zh-1440.png)
- [Mobile route and comparison](shortest-explorer-zh-390.png)

This record covers local implementation and verification; it does not claim a GitHub push or live-site deployment.
