# Reader companion update verification — 2026-11-05

## Scope and result

Local repository content and web application updated. No errata page, deployment, remote push, dependency manifest change, or purchase destination activation was performed.

- Exercise 9.2: same unit circle with inscribed (red) and circumscribed (green) regular polygons. Default n=6 shows lower bound 3, upper bound 2√3 ≈ 3.464102, and the geometric half-perimeter explanation in both languages. Values derive from n sin(π/n) and n tan(π/n); decimals are explicitly marked as rounded.
- Exercise 4.2: greatest common measure d = a gcd(m,n), with the direction of measurement corrected.
- Exercise 4.4: Markdown and TeX use m=(x−1)/2 and y=m². The original exercise (English book p.53; repository source test/english.pdf p.67, and test/cn.md) does not explicitly exclude zero. Both solutions state the nonnegative-square convention and explain why a positive-square convention requires x>1.
- Binary search: real input handling preserves 0, rejects empty and nonfinite/invalid input separately, and searches a sorted three-element example. The size slider now allows three elements.
- README has five reader entrances before the large cover, 35 direct algorithm links in each language, and preserved chapter/exercise/extra labels.
- Home leads with sections 2.1 → 7.5 → 7.7 → 8.6. Existing beginner stages remain under Algorithm foundations / 算法入门.
- Device language: first supported entry in navigator.languages, with navigator.language fallback; Chinese variants map to zh. Explicit user choice is saved locally; document language follows it. Browser-exposed preferences are the web-accessible proxy for device language, not a separate OS setting API.
- User-supplied front cover is copied byte-for-byte to public/images/ChineseEditionCover.png. English cover retained. The Chinese edition appears first in Chinese; images retain their natural ratios.
- Store configuration: src/config/book.ts → CHINESE_BOOK_STORE_URL, currently empty. Empty state has no link, purchase prompt or pointer cursor. A configured URL wraps the complete Chinese cover in a native keyboard-accessible anchor. QR destination is independent.

## Automated gates

| Gate | Result |
| --- | --- |
| npx eslint . --max-warnings=0 | PASS, exit 0 |
| npx tsc -p tsconfig.app.json --noEmit | PASS, exit 0 |
| npx tsc -p tsconfig.node.json --noEmit | PASS, exit 0 |
| npm run test:run | PASS, 20 files / 193 tests |
| npm run build | PASS, exit 0 |
| git diff --check | PASS after removing trailing whitespace |

The additional Node config typecheck initially exposed the existing defineConfig import from vite not accepting the test field; importing it from vitest/config resolves the error. Current tests/build still emit the non-fatal outdated caniuse-lite/Browserslist data warning; no dependency upgrade was performed. README retains the June baseline as historical evidence and distinguishes the present result.

### Regression evidence

- RED: before the binary-search fix, the rendered page test for 0 failed its lower-bound partition assertion; invalid strings abc, 12oops and Infinity were incorrectly treated as empty. Four failures and one pass. The original slider minimum was temporarily lowered in the test DOM to reproduce exactly the three-element case; final production minimum is 3 and that test workaround was removed.
- RED: language preference tests failed five cases under the old single navigator.language detection, including first-supported language selection and document language/persistence.
- GREEN: the two regression files passed all 12 cases after implementation. These tests go through rendered inputs and buttons, including sorting and the complete asynchronous search handler; they do not merely call the algorithm generators.
- Pi coverage was added after implementation and is not claimed as RED-first TDD. It checks six-sided values and bilingual explanations, plus side-count endpoints 3 and 500.
- Final suite: 193 tests passed. Windows Vitest initially encountered EPERM in the sandbox Temp directory; rerunning with TEMP and TMP set to the checkout's ignored .local directory resolved the environment error.

## Browser acceptance

Used isolated headless Microsoft Edge via bundled Playwright against the production preview (127.0.0.1:4173), widths 1440 and 390 pixels. No application page errors or whole-page horizontal overflow observed.

- Both interface languages: learning-route links, cover order, complete images, natural image ratios, mobile wording, clickable web URL, unlinked Chinese cover and default cursor.
- Fresh zh-CN context opens in Chinese; fresh en-US opens in English; manual switching survives reload.
- All 35 distinct README demo routes loaded their own h1 without redirecting to Home, including all four book-route stations.
- At both widths and in both languages, tested the configured store state on the dev server (127.0.0.1:5173) by intercepting only the served config module and supplying https://bookstore.example.test/official-edition. The test endpoint was also intercepted locally. Focus and Enter navigated successfully. The source configuration stayed empty throughout; no real store was contacted. The QR URL stayed unchanged.
- English homepage headings now wrap at word boundaries instead of splitting words on mobile.
- Screenshots were inspected visually; both covers and titles are complete on mobile and desktop. Mobile screenshots capture the full footer vertically, not a single viewport.

Screenshots:

- [Chinese desktop, 1440px viewport](home-bottom-zh-1440.png)
- [Chinese mobile, 390px viewport](home-bottom-zh-390.png)
- [English desktop, 1440px viewport](home-bottom-en-1440.png)
- [English mobile, 390px viewport](home-bottom-en-390.png)
- [Hexagon geometry on mobile](pi-hexagon-mobile.png)

## QR and PDF artifacts

QR: public/images/mobile-web-qr.png, 370×370 pixels, black on white, four-module quiet zone, error correction M, 10 pixels per module. The 185px UI/README size keeps an integer 5 pixels per module. Generated locally with Python qrcode; no runtime dependency was added. OpenCV QRCodeDetector decoded the original PNG and all four final footer screenshots to exactly:

https://fm2gp-chinese.bookzhou.com/

PDF: solutions/4_4.pdf rebuilt from solutions/4_4.tex with Tectonic 0.17.0. Initial desktop-compiler run timed out downloading resources; retry compiled successfully. A portable Tectonic CLI then used a workspace copy of those cached resources to produce the repository PDF, without network access during compilation. Poppler rendered the one-page final PDF; visual review and extracted text confirmed the corrected equations and x=1 boundary, with no clipping or missing glyphs. A Fontconfig configuration warning occurred, but fonts rendered correctly in the inspected output.

SHA-256:

- PDF: 6EFDFE35B4D21334CE85F4E652B3C3BA18DD1F4120E2237CA8D4FBF2F30CE8C6
- QR: CA70011FB035BF2C95FA697D27CF39647C8608C59CA3F273FB4BA1A8DA29DAB9
- Chinese cover (matches attachment): 7C4D8D7DBD19E1E3C91A43B1D3BC1F25533E548F4619F27F8E476D974C416404

## Bibliographic verification history

Initial delivery: publication date/publisher followed the user's confirmed information (Tsinghua University Press, October 2026); title/authors/translator agreed with the supplied edition cover. The existing flat cover printed ISBN 978-7-302-72595-4, but no edition copyright page or matching publisher record had yet been supplied or found. ISBN was therefore not added to the README; the old edition's ISBN was not substituted. This was the remaining bibliographic verification gap, independent of the completed application checks.

Resolved on 2026-11-05: the user supplied a legible photograph of this edition's copyright page (attachment codex-clipboard-b32501ac-59bf-4828-aeb4-af1abc9290e6.jpg). It confirms ISBN 978-7-302-72595-4, Tsinghua University Press, first edition October 2026, and first printing October 2026. The CIP entry separately says 2026.9; the edition and printing lines explicitly say October, which is retained in the publication information. Both README language sections now include the verified ISBN and edition/printing details. The bibliographic gap is closed. This follow-up changes documentation only; the application, PDF and screenshot checks above remain unchanged.
