# Canonical repair and Fermat indexing investigation

## Scope and baseline

- Requested repair: companion-site canonical signals and diagnosis of Fermat indexing.
- Maintenance baseline: `d7ed056d234bf19c0ee9f978837aaf29bd396955`; isolated branch `codex/canonical-indexing`; initially clean worktree and index.
- No book content, reader source parameters, purchase configuration, analytics, or WordPress draft changes.
- Baseline: `npm run test:run -- src/data/algorithmCatalog.test.ts src/data/bookCatalog.test.ts` discovered one test file, 18 tests passed. There is no separate bookCatalog test file.

## Acceptance and TDD

1. Production HTML for each public route contains exactly one absolute, query-free self canonical, a distinct page title and a useful description.
2. A real XML sitemap lists clean public routes; robots.txt advertises it.
3. SPA navigation updates the canonical without changing reader query parameters or hash, including existing head markup and trailing-slash input.

RED, before implementation: `npm run test:run -- src/seo` at 2026-11-12 15:00:20 local time: two files / four tests failed for the expected missing homepage canonical, missing route HTML, missing sitemap, and missing SPA canonical. An earlier attempt additionally hit a Node test-environment localStorage cleanup issue; that harness issue was fixed and the clean RED rerun was retained in `.local/canonical-red.log`.

GREEN, same four tests after implementation at 15:01:47: two files / four tests passed (`.local/canonical-green.log`). Tests exercise emitted production assets and the real App router, not source-string checks.

Refinement: strengthened navigation regression for reuse of a pre-existing link, trailing slash, title change and preservation of source query/hash. Missing jsdom declarations initially caused app typecheck TS7016; an attempted node:module import also lacked Node declarations (TS2307). Both failed attempts were replaced with a small typed declaration for the existing jsdom dependency. No dependencies were installed and no checks were disabled.

## Implementation

- `src/seo/pages.ts`: route metadata derived from the existing chapter and lesson catalogs.
- `src/seo/buildPlugin.ts`: generate per-route HTML, sitemap.xml and robots.txt at build time. Netlify file matching serves route.html before the existing SPA fallback.
- `src/seo/RouteSeo.tsx`: keep the same canonical and metadata after client-side navigation; reader parameters remain functional.
- Existing tracked dist/index.html is restored after verification; Netlify builds fresh artifacts from committed sources.

## Final local verification

- `npx eslint . --max-warnings=0`: exit 0.
- `npx tsc -p tsconfig.app.json --noEmit`: exit 0.
- `npx tsc -p tsconfig.node.json --noEmit`: exit 0.
- `npm run test:run`: exit 0, 62 files / 574 tests passed, final run started 15:05:28.
- `npm run build`: exit 0; emitted route HTML and discovery files verified by production-build tests.
- Existing Browserslist outdated-data notice retained; dependency refresh is outside this repair.

## Search Console findings (read live 2026-11-12)

Opened the actual Fermat row in the duplicate-page report and used its Inspect action, rather than manually reconstructing the display-decoded URL.

- Affected variant: `/fermat?from=/book/6#lagrange-fermat` as displayed by Search Console (source query encodes slash/hash).
- Last crawl: 2026-11-09 11:45:13; Googlebot smartphone; allowed to crawl: Yes; fetch: Successful; indexing allowed: Yes.
- Referring page: `/book/6`; no referring sitemap; user-declared canonical: None.
- Google-selected canonical: `https://fm2gp-chinese.bookzhou.com/fermat?from=%2Fbook%2F5%23section-5-2`.
- Clicking Inspect for that selected canonical shows **URL is on Google**. Thus the Fermat content is already indexed under a source-parameter variant; the chapter-6 variant is excluded as a duplicate. The clean `/fermat` previously showed unknown to Google. Neither proves the content itself was blocked by noindex.
- Shortest-path source variant likewise has no declared canonical, with Google choosing the clean `/shortest-path`.

The repair requests consolidation on clean URLs. Actual canonical selection and search-index updates remain Google's decision and require recrawling; a successful live test is not proof of completed indexing.

References: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls ; https://docs.netlify.com/resources/troubleshooting/request-chain/

## Deployment

Pending at creation of this record. Record the committed release, published deployment and production checks after deployment; rollback baseline is the maintenance commit above.
