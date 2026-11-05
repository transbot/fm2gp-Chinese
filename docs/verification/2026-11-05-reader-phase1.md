# Reader companion phase 1 — 2026-11-05

## Implementation and baseline

Implemented against clean `main` at `b8cc389bd84035a363607f0972b06cb6aed22b43`. Final verification targets the post-pagination-cleanup source snapshot included in the same local commit as this report. `phase1/source-manifest.json` records its SHA-256 hashes (UTF-8 text normalized to LF, binary files unchanged); the commit containing that manifest identifies the verified revision without a self-referential commit hash. This is not an online deployment check.

- `/book` and `/book/:chapterId`: fourteen chapters, three appendices, 107 sections, and 69 exercise entries. Section and exercise anchors have distinct prefixes. English and Chinese guides, section search, aliases, function search, source links, and reader-route navigation are included.
- `src/data/bookContent.ts` records the supplied Chinese PDF's **file page indices**, not unverified printed page numbers. Internal metadata links existing exercise resources by actual format, code functions by source lines, and course lectures by checked page ranges. The app displays no book/PDF page numbers, page ranges or page counts; chapter, section, exercise and code-line references remain. No book PDF is redistributed.
- `/concepts/algebra`: five set/operation models, associativity counterexample, order comparison, identities, inverses, and a property comparison table.
- `/power`: repeated addition, ordinary multiplication, and 2×2 matrix multiplication use the same operation-parameterized power trace. Positive powers initialize from an actual element; zero powers use the selected identity. Inputs and intermediate arithmetic must be exact safe integers; exponents are integers in 0–1024. Negative, fractional, empty, malformed, and overflowing inputs have local explanations.
- `/concepts/matrices`: cell-level multiplication, noncommutative examples, Boolean reachability, a chain plus an isolated vertex, and the book's friendship graph. Powers and actual multiplication counts are distinct. The friendship closure is checked against independent traversal.
- `/concepts/iterators`: forward, bidirectional, and random-access models, half-open and empty ranges, end-position protection, operation counts, and reversible history separate from iterator capabilities.
- Existing routes remain available. The home book route retains its four stops and the beginner route remains. Both README reader entrances now target `/book`.
- Shared light page styling, blue primary actions, title/card geometry and focus states. Removed the dark shortest-path introduction. Fixed the heap diagram's mobile page overflow.
- Filled missing locale keys and removed English fallback strings, localized legacy labels, computed phases, graph controls, accessibility labels, and Euler complexity explanations. Developer notes reveal implementation details on demand.
- Deleted the invalid `solutions/7_1.pdf` with explicit user approval. Its former text URL returned HTTP 404. Exercise 7.1 still links to its companion C++ program; the directory explains that no PDF is available.

## Verification

Environment: Windows, Node v22.17.1, npm 11.7.0, Vitest 4.1.8, Vite 8.0.16, headless Microsoft Edge 156.0.4314.58. The final browser checks use Vite production preview at `http://127.0.0.1:4174`, serving the freshly built `dist`. Earlier development-server evidence remains under `phase1/` as historical evidence only.

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

Browser sweep results: [browser-audit.json](phase1-final/browser-audit.json). Focused interaction results: [flow-audit.json](phase1-final/flow-audit.json). The sweep visits every existing demonstration plus the new entry points and exercises the first available start/step action. Deeper input/error/replay checks are covered by component tests and focused browser flows; this is not an exhaustive enumeration of every possible input.

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

All five views were recaptured from production preview after page-number cleanup in Chinese and English at both widths (20 images). Four additional friendship-graph captures verify the Lin Yu spelling note. The older images remain historical evidence. Examples:

| View | Desktop | Mobile |
| --- | --- | --- |
| Chapter 6 | [Chinese](phase1-final/book-6-zh-1440.png) · [English](phase1-final/book-6-en-1440.png) | [Chinese](phase1-final/book-6-zh-390.png) · [English](phase1-final/book-6-en-390.png) |
| Algebra properties | [Chinese](phase1-final/concepts-algebra-zh-1440.png) · [English](phase1-final/concepts-algebra-en-1440.png) | [Chinese](phase1-final/concepts-algebra-zh-390.png) · [English](phase1-final/concepts-algebra-en-390.png) |
| Matrix reachability | [Chinese](phase1-final/concepts-matrices-zh-1440.png) · [English](phase1-final/concepts-matrices-en-1440.png) | [Chinese](phase1-final/concepts-matrices-zh-390.png) · [English](phase1-final/concepts-matrices-en-390.png) |
| Iterator end position | [Chinese](phase1-final/concepts-iterators-zh-1440.png) · [English](phase1-final/concepts-iterators-en-1440.png) | [Chinese](phase1-final/concepts-iterators-zh-390.png) · [English](phase1-final/concepts-iterators-en-390.png) |
| Shortest-path styling | [Chinese](phase1-final/shortest-path-zh-1440.png) · [English](phase1-final/shortest-path-en-1440.png) | [Chinese](phase1-final/shortest-path-zh-390.png) · [English](phase1-final/shortest-path-en-390.png) |

## Reproduction and publication boundary

On this Windows checkout, set `TEMP` and `TMP` to `.local` for Vitest. The three browser scripts in `scripts/` use Playwright supplied by the desktop runtime (set `NODE_PATH` to that runtime's node_modules) and a separate headless Edge profile. Set `READER_BASE_URL=http://127.0.0.1:4174` and `READER_OUTPUT_DIR=docs/verification/phase1-final` to reproduce the final production-preview checks. They neither use a signed-in browser nor publish changes. The PDF was used for private content verification only.

No missing user asset blocks this implementation. Page-number metadata is retained solely for internal source verification and is not rendered in the app. The spelling 林宇 follows the supplied Chinese edition; the companion program spells the same vertex 林字. Both language versions disclose the spelling difference without a PDF page reference. Online deployment has not been performed or verified in this task.


## Final acceptance after page-number cleanup

Completed 2026-11-05 against the source snapshot in `phase1/source-manifest.json`. **PASS within the tested scope below.** This section supersedes earlier development-server evidence for final acceptance.

| Final check | Evidence and result |
| --- | --- |
| ESLint / TypeScript | PASS; [lint](phase1-final/lint.txt), [TypeScript](phase1-final/typescript.txt) (empty output, exit 0) |
| Vitest | PASS, 26 files / 214 tests; [output](phase1-final/vitest.txt) |
| Fresh production build | PASS; [output](phase1-final/build.txt) |
| Full production-preview sweep | PASS, 164 route/language/width combinations; [audit](phase1-final/browser-audit.json) |
| Direct open, reload, browser back and forward | PASS, 22 routes × 2 languages × 2 widths = 88 route combinations, including directory, all 17 chapters/appendices and all four concept routes; [audit](phase1-final/production-audit.json) |
| Search and anchors | PASS, six queries in each language/width combination; distinct section/exercise 9.2, refresh, return with preserved search; 107 section anchors resolved per combination |
| Resources | PASS, 227 resource/code link instances per combination resolve to nonempty local files, PDF signatures verified; Vitest also checks function line references. External GitHub availability is not claimed by this local check. |
| Page-number removal | PASS in chapter pages, resource cards, demonstration explanations, collapsed developer notes, search results, tooltip/title text, placeholders, alt text and aria-labels. Static source inspection also found no page-number copy. Internal provenance fields are not rendered. |
| Friendship spelling note | PASS in both languages, no PDF page number; [desktop Chinese](phase1-final/matrix-friends-zh-1440.png), [mobile Chinese](phase1-final/matrix-friends-zh-390.png), [desktop English](phase1-final/matrix-friends-en-1440.png), [mobile English](phase1-final/matrix-friends-en-390.png) |
| Focused production interactions | PASS at 1440/390: source return, saved chapter scroll, route back/forward, language/input preservation, keyboard disclosure focus, iterator boundaries, home covers and empty shop URL; [audit](phase1-final/flow-audit.json) |

Fresh screenshots are linked above. Chapter desktop/mobile and friendship mobile screenshots were visually inspected: section/exercise labels remain, the spelling note is readable, resource links remain accessible, and the wide friendship matrix scrolls locally.

Verification history: the first attempt to launch preview through npm lost CLI flags in this PowerShell environment; launching the Vite CLI directly fixed it. The first page-number scan incorrectly concatenated “返回主页” and “序列” into “页序”; text-node separators fixed the checker, and the complete sweep was rerun successfully. These were verification-tool issues, not application failures.

Reproduction: build, run `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4174 --strictPort`, then run `verify-reader-ui.cjs`, `verify-reader-production.cjs`, and `verify-reader-flows.cjs` with the environment variables documented above. The original report is preserved at `phase1/initial-report.md`; original manifest at `phase1/source-manifest-before-page-cleanup.json`. Current screenshots and browser evidence live under `phase1-final/`.

Limits: Edge checks cover the recorded states, not every possible input, every browser, or assistive-technology behavior. No online deployment or push is included. The retained private PDF provenance is intentionally not a public page-number feature. No unresolved failure remains in the checks listed above.
