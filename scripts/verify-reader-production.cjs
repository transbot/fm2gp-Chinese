// Production-preview route, resource, search and page-number regression checks.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const baseUrl = process.env.READER_BASE_URL || 'http://127.0.0.1:4174';
const out = process.env.READER_OUTPUT_DIR || 'docs/verification/phase1-final';
const noPages = /页码|页序|第\s*\d+\s*页|\d+\s*页|\b(?:PDF\s+)?pages?\s*\d+|\d+\s+pages?\b|#page=/i;
let browser;
(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const results = [];
  for (const width of [1440, 390]) for (const lang of ['zh', 'en']) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: lang === 'zh' ? 'zh-CN' : 'en-US' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const checkCopy = async () => {
      const copy = await page.evaluate(() => [...document.querySelectorAll('body *')].flatMap(e=>[...e.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent)).join('\n') + '\n' + [...document.querySelectorAll('[aria-label],[title],[placeholder],[alt]')].map(e => ['aria-label', 'title', 'placeholder', 'alt'].map(a => e.getAttribute(a) || '').join(' ')).join('\n'));
      assert.doesNotMatch(copy, noPages, page.url());
    };
    const go = async route => {
      const response = await page.goto(baseUrl + route);
      assert.equal(response.status(), 200);
      await page.locator('h1').first().waitFor();
      await checkCopy();
    };
    const routes = ['/book', ...Array.from({ length: 14 }, (_, i) => '/book/' + (i + 1)), ...['A', 'B', 'C'].map(id => '/book/' + id), '/concepts/algebra', '/power', '/concepts/matrices', '/concepts/iterators'];
    let resourceLinks = 0, anchors = 0;
    for (const route of routes) {
      await go('/');
      await go(route);
      const title = await page.locator('h1').innerText();
      await page.reload(); await page.locator('h1').first().waitFor();
      assert.equal(await page.locator('h1').innerText(), title);
      await page.goBack(); await page.locator('h1').first().waitFor();
      assert.equal(new URL(page.url()).pathname, '/');
      await page.goForward(); await page.locator('h1').first().waitFor();
      assert.equal(new URL(page.url()).pathname, route);
      await checkCopy();
      const links = await page.locator('a[href]').evaluateAll(es => es.map(e => e.getAttribute('href')));
      for (const href of links) {
        if (href.startsWith('#')) {
          assert.equal(await page.locator('[id="' + href.slice(1) + '"]').count(), 1); anchors++;
        }
        const prefix = 'https://github.com/transbot/fm2gp-Chinese/blob/main/';
        if (href.startsWith(prefix)) {
          const local = decodeURIComponent(href.slice(prefix.length).split('#')[0]);
          assert.ok(fs.existsSync(local), local);
          assert.ok(fs.statSync(local).size > 0, local);
          if (local.endsWith('.pdf')) assert.equal(fs.readFileSync(local).subarray(0, 5).toString(), '%PDF-');
          resourceLinks++;
        }
      }
    }
    for (const query of ['10.8', '二叉查找', '二分查找', 'binary search', '第9.2节', '习题9.2']) {
      await go('/book?q=' + encodeURIComponent(query));
      const anchor = query === '第9.2节' ? 'section-9-2' : query === '习题9.2' ? 'exercise-9-2' : 'section-10-8';
      const link = page.locator('a[href*="#' + anchor + '"]').first();
      await link.click(); await page.locator('#' + anchor).waitFor();
      await page.reload(); await page.locator('#' + anchor).waitFor();
      await checkCopy();
      await page.goBack(); await page.getByRole('searchbox').waitFor();
      assert.equal(await page.getByRole('searchbox').inputValue(), query);
    }
    await go('/book/7#exercise-7-1');
    assert.equal(await page.locator('#exercise-7-1 a[href$=".pdf"]').count(), 0);
    assert.ok(await page.locator('#exercise-7-1 a[href$=".cpp"]').count());
    await go('/concepts/matrices');
    await page.getByLabel(lang === 'zh' ? '示例' : 'Example', { exact: true }).selectOption('friends');
    await checkCopy();
    assert.match(await page.locator('body').innerText(), lang === 'zh' ? /林宇.*林字/ : /Lin Yu/);
    await page.screenshot({ path: path.join(out, `matrix-friends-${lang}-${width}.png`), fullPage: true });
    assert.deepEqual(errors, []);
    results.push({ baseUrl, lang, width, directRefreshBackForward: routes, searchQueries: ['10.8', '二叉查找', '二分查找', 'binary search', '第9.2节', '习题9.2'], resourceLinks, anchors, pageNumbers: 'absent including friendship note, collapsed notes and accessible attributes', invalidExercisePdf: 'absent; CPP retained', errors });
    await context.close();
  }
  fs.writeFileSync(path.join(out, 'production-audit.json'), JSON.stringify(results, null, 2));
  console.log('PASS: 22 routes × 2 languages × 2 widths: direct open, reload, back/forward; searches, anchors, local resource targets and page-number absence.');
  await browser.close();
})().catch(async e => { console.error(e); await browser?.close(); process.exitCode = 1; });
