# Reader companion phase 1 — 2026-11-05

## Implementation and baseline

Implemented against clean `main` at `b8cc389bd84035a363607f0972b06cb6aed22b43`. Verification below targets the modified working tree, not a new Git commit or a deployed site. `phase1/source-manifest.json` records the final source hashes.

- `/book` and `/book/:chapterId`: fourteen chapters, three appendices, 107 sections, and 69 exercise entries. Section and exercise anchors have distinct prefixes. English and Chinese guides, section search, aliases, function search, source links, and reader-route navigation are included.
- `src/data/bookContent.ts` records the supplied Chinese PDF's **file page indices**, not unverified printed page numbers. It links existing exercise resources by actual format, code functions by source lines, and course lectures by checked page ranges. No book PDF is redistributed.
- `/concepts/algebra`: five set/operation models, associativity counterexample, order comparison, identities, inverses, and a property comparison table.
- `/power`: repeated addition, ordinary multiplication, and 2×2 matrix multiplication use the same operation-parameterized power trace. Positive powers initialize from an actual element; zero powers use the selected identity. Inputs and intermediate arithmetic must be exact safe integers; exponents are integers in 0–1024. Negative, fractional, empty, malformed, and overflowing inputs have local explanations.
- `/concepts/matrices`: cell-level multiplication, noncommutative examples, Boolean reachability, a chain plus an isolated vertex, and the book's friendship graph. Powers and actual multiplication counts are distinct. The friendship closure is checked against independent traversal.
- `/concepts/iterators`: forward, bidirectional, and random-access models, half-open and empty ranges, end-position protection, operation counts, and reversible history separate from iterator capabilities.
- Existing routes remain available. The home book route retains its four stops and the beginner route remains. Both README reader entrances now target `/book`.
- Shared light page styling, blue primary actions, title/card geometry and focus states. Removed the dark shortest-path introduction. Fixed the heap diagram's mobile page overflow.
- Filled missing locale keys and removed English fallback strings, localized legacy labels, computed phases, graph controls, accessibility labels, and Euler complexity explanations. Developer notes reveal implementation details on demand.
- Deleted the invalid `solutions/7_1.pdf` with explicit user approval. Its former text URL returned HTTP 404. Exercise 7.1 still links to its companion C++ program; the directory explains that no PDF is available.

## Verification

Environment: Windows, Node v22.17.1, npm 11.7.0, Vitest 4.1.8, Vite 8.0.16, headless Microsoft Edge 156.0.4314.58. Browser checks use the local development server at `http://127.0.0.1:5174`; production compilation is checked separately.

| Check | Result |
| --- | --- |
| `npm run lint` | PASS, no warnings or errors |
| `npx tsc -b --pretty false` | PASS |
| `npm run test:run` | PASS, 26 files / 214 tests |
| `npm run build` | PASS |
| Physical resource paths and PDF signatures | PASS |
| Code function line references | PASS |
| Matching nonempty locale dictionaries and static component references | PASS |
| 41 routes × 2 languages × 2 widths (1440 and 390) | 164 checks; no page errors, whole-page overflow, or unexpected Chinese in checked English states |
| 17 chapter/appendix deep links | PASS at both widths |
| Search, section vs exercise, anchor refresh, source return, chapter scroll restoration, route back/forward | PASS |
| Changing language retains matrix inputs, step and result | PASS |
| Device language and saved manual language | PASS |
| Iterator end protection, movement cost, keyboard disclosure focus | PASS |
| Homepage images and empty bookstore URL | PASS |
| QR decoding with OpenCV | Exact result: `https://fm2gp-chinese.bookzhou.com/` |
| Existing binary-search and shortest-path regression tests | PASS in full Vitest run |

Browser sweep results: [browser-audit.json](phase1/browser-audit.json). Focused interaction results: [flow-audit.json](phase1/flow-audit.json). The sweep visits every existing demonstration plus the new entry points and exercises the first available start/step action. Deeper input/error/replay checks are covered by component tests and focused browser flows; this is not an exhaustive enumeration of every possible input.

The mathematical tests verify 3 repeated 5 times = 15, 3⁵ = 243, the Fibonacci matrix's fifth power, each complete power invariant checkpoint, zero identities, AB vs BA, independent graph closure, and iterator range/capability boundaries. Component tests exercise real input controls, model changes, language switching and history replay.

## Findings resolved during verification

- Initial Vitest startup failed with a Windows sandbox temporary-file `EPERM`. Using checkout `.local` for `TEMP`/`TMP` resolved it. The new math test then failed because its module did not yet exist (RED), passed after implementation (GREEN), and passed again after shared-component refactoring. Other new tests were added during integration, not presented as pre-implementation TDD.
- Removing English fallbacks exposed a missing `viewCode` key; added both translations and a static reference test.
- First browser sweep found mobile heap overflow and English ReactFlow control labels. Local overflow containment and localized controls fixed these; reruns passed.
- PDF exercise headings with parenthetical difficulty annotations were missed by the initial extraction. Rechecked them, supplied missing source pages, and sorted all exercises numerically.
- Visual review found the mobile iterator end card partly outside its local viewport. Reduced cell widths so the three elements and container end fit together.
- The course PDFs identify lecture coverage in their opening slides. These now map to actual chapter page ranges, rather than listing the entire course at every chapter.

The build emits the repository's existing Browserslist database-age notice. Dependencies were not changed for this notice.

## Screenshots

All five views are captured in Chinese and English at both widths (20 images). Examples:

| View | Desktop | Mobile |
| --- | --- | --- |
| Chapter 6 | [Chinese](phase1/book-6-zh-1440.png) · [English](phase1/book-6-en-1440.png) | [Chinese](phase1/book-6-zh-390.png) · [English](phase1/book-6-en-390.png) |
| Algebra properties | [Chinese](phase1/concepts-algebra-zh-1440.png) · [English](phase1/concepts-algebra-en-1440.png) | [Chinese](phase1/concepts-algebra-zh-390.png) · [English](phase1/concepts-algebra-en-390.png) |
| Matrix reachability | [Chinese](phase1/concepts-matrices-zh-1440.png) · [English](phase1/concepts-matrices-en-1440.png) | [Chinese](phase1/concepts-matrices-zh-390.png) · [English](phase1/concepts-matrices-en-390.png) |
| Iterator end position | [Chinese](phase1/concepts-iterators-zh-1440.png) · [English](phase1/concepts-iterators-en-1440.png) | [Chinese](phase1/concepts-iterators-zh-390.png) · [English](phase1/concepts-iterators-en-390.png) |
| Shortest-path styling | [Chinese](phase1/shortest-path-zh-1440.png) · [English](phase1/shortest-path-en-1440.png) | [Chinese](phase1/shortest-path-zh-390.png) · [English](phase1/shortest-path-en-390.png) |

## Reproduction and publication boundary

On this Windows checkout, set `TEMP` and `TMP` to `.local` for Vitest. The two browser scripts in `scripts/` use Playwright supplied by the desktop runtime (set `NODE_PATH` to that runtime's node_modules), a separate headless Edge profile, and port 5174. They neither use a signed-in browser nor publish changes. The PDF was used for private content verification only.

No missing user asset blocks this implementation. Printed-edition pagination remains unfilled because the supplied PDF establishes file-page positions only. The spelling 林宇 follows PDF page 167; the companion program spells the same vertex 林字, and this difference is disclosed beside the example. Online deployment has not been performed or verified in this task.
