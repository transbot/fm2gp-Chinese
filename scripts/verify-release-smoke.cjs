// Supplemental production checks; existing phase scripts cover the full replay suites.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const baseUrl = process.env.READER_BASE_URL || 'http://127.0.0.1:4176';
const out = process.env.READER_OUTPUT_DIR || 'docs/verification/release-phase1-phase2/smoke';
fs.mkdirSync(out, { recursive: true });
let browser;
(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const audit = [];
  for (const width of [1440, 390]) for (const lang of ['zh', 'en']) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: lang === 'zh' ? 'zh-CN' : 'en-US' });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const t = (zh, en) => lang === 'zh' ? zh : en;
    const button = (zh, en) => page.getByRole('button', { name: t(zh, en), exact: true });
    const go = async route => { assert.equal((await page.goto(baseUrl + route)).status(), 200, route); await page.locator('h1').first().waitFor(); };
    const snapshot = async name => {
      const copy = await page.evaluate(() => document.body.textContent + '\n' + [...document.querySelectorAll('[aria-label],[title],[alt],[placeholder]')].map(e => ['aria-label','title','alt','placeholder'].map(a => e.getAttribute(a) || '').join(' ')).join('\n'));
      assert.doesNotMatch(copy, /页码|页序|第\s*\d+\s*页|\b(?:PDF\s+)?pages?\s*\d+|#page=/i);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await page.screenshot({ path: `${out}/${name}-${lang}-${width}.png`, fullPage: true });
    };
    await go('/concepts/algebra');
    await page.getByLabel(t('集合与运算', 'Set and operation'), { exact: true }).selectOption('4');
    assert.match(await page.locator('body').innerText(), /1 ≠ 3/);
    await page.getByLabel(t('集合与运算', 'Set and operation'), { exact: true }).selectOption('3');
    await button('交换 ab 与 c 的顺序', 'Swap ab and c').click();
    assert.ok(await page.getByText('c ∘ (a ∘ b) = cab', { exact: true }).count());
    await snapshot('algebra');

    await go('/power');
    await page.getByLabel(t('运算模型', 'Operation model'), { exact: true }).selectOption('matrix');
    const progress = page.getByRole('slider').first();
    await progress.fill('2');
    const before = await page.getByRole('region', { name: t('幂算法步骤', 'Power algorithm steps'), exact: true }).locator('tbody').innerText();
    const code = await page.locator('pre').innerText();
    await button('English', '中文').click();
    assert.equal(await progress.inputValue(), '2');
    assert.equal(await page.getByRole('region', { name: t('Power algorithm steps', '幂算法步骤'), exact: true }).locator('tbody').innerText(), before);
    assert.equal(await page.locator('pre').innerText(), code);
    await progress.fill('1'); await progress.fill('2');
    await button('中文', 'English').click();
    await button('播放', 'Play').click();
    await page.getByLabel(t('指数', 'Exponent'), { exact: true }).fill('3');
    await page.waitForTimeout(1200); assert.equal(await progress.inputValue(), '0');
    await progress.fill(await progress.getAttribute('max'));
    assert.equal(await page.getByTestId('power-result').innerText(), '[[3,2],[2,1]]');
    assert.equal(await page.locator('pre').innerText(), 'return r;');
    await snapshot('power');

    await go('/concepts/matrices');
    await page.getByLabel(t('示例', 'Example'), { exact: true }).selectOption('chain');
    await page.getByRole('slider').first().fill('2');
    assert.match(await page.locator('[aria-live="polite"]').first().innerText(), t(/A → C: 可达/, /A → C: reachable/));
    await page.getByRole('slider').first().fill('1');
    assert.match(await page.locator('[aria-live="polite"]').first().innerText(), t(/尚不可达/, /not yet reachable/));
    await page.getByRole('slider').first().fill('2'); await snapshot('matrix');

    await go('/concepts/iterators');
    await button('advance(3)', 'advance(3)').click();
    await button('读取当前位置', 'Read current position').click();
    assert.match(await page.getByRole('alert').innerText(), t(/不能解引用/, /cannot be dereferenced/));
    await button('English', '中文').click();
    assert.match(await page.getByRole('alert').innerText(), t(/cannot be dereferenced/, /不能解引用/));
    await button('中文', 'English').click();
    await button('回看上一步', 'Review previous step').click();
    assert.match(await page.locator('[aria-live="polite"]').innerText(), /: 0|：0/);
    await button('重播下一步', 'Replay next step').click();
    assert.match(await page.locator('[aria-live="polite"]').innerText(), /: 3|：3/);
    await button('读取当前位置', 'Read current position').click(); await snapshot('iterator');

    // The existing page generates its array; seed this isolated context to test [1,3,5].
    await page.addInitScript(() => { let i = 0; Math.random = () => [0, 2 / 99, 4 / 99][i++ % 3]; });
    await go('/binary-search');
    await page.getByRole('slider').fill('3');
    await button('快速排序', 'Auto-Sort array').click();
    await page.getByRole('button', { name: t('开始查找', 'Start Search'), exact: true }).waitFor();
    const target = page.getByLabel(t(/目标值/, /Target Value/));
    await target.fill('0'); await button('开始查找', 'Start Search').click();
    await page.getByText('∀k ∈ [0, 3) : vₖ > 0', { exact: true }).waitFor();
    assert.equal(await target.inputValue(), '0');
    assert.ok(await page.getByText('∀k ∈ [0, 0) : vₖ < 0', { exact: true }).count());
    assert.ok(await page.getByText('∀k ∈ [0, 0) : vₖ = 0', { exact: true }).count());
    await snapshot('binary-zero');

    await go('/shortest-path');
    await button('开始计算', 'Start Calculation').click(); await button('下一次幂', 'Next Power').click();
    assert.equal(await page.getByTestId('selected-distance').innerText(), '7');
    await page.getByRole('button', { name: /A → D → F.*7/ }).click();
    assert.equal(await page.getByTestId('route-graph').getAttribute('data-path'), 'A → D → F');
    await button('English', '中文').click();
    assert.equal(await page.getByTestId('selected-distance').innerText(), '7');
    await button('中文', 'English').click(); await snapshot('shortest-path');

    await go('/book?q=' + encodeURIComponent(t('第C.7节', 'section c.7')));
    const link = page.locator('a[href*="#section-"]'); assert.equal(await link.count(), 1);
    await link.click(); await page.locator('#section-C-7').waitFor();
    await page.reload(); await page.locator('#section-C-7').waitFor();
    await page.locator('#section-C-7 a[href*="/concepts/iterators"]').click(); await page.locator('h1').waitFor();
    await page.getByRole('link', { name: t('返回来源章节／习题', 'Return to source section / exercise'), exact: true }).click();
    await page.locator('#section-C-7').waitFor();
    await snapshot('appendix-c7');
    assert.deepEqual(errors, []);
    audit.push({ baseUrl, lang, width, checkedAt: new Date().toISOString(), passed: ['algebra counterexample and noncommutativity', 'power input resets playback; translated replay preserves state and code', 'matrix at-most reachability', 'iterator end and review movement count', 'binary [1,3,5] key 0 and both bounds 0', 'shortest distance 7 and selected path', 'C.7 exact search, refresh, source return', 'no page numbers and no whole-page overflow'], errors });
    await context.close();
  }
  fs.writeFileSync(`${out}/audit.json`, JSON.stringify(audit, null, 2));
  await browser.close(); console.log('PASS: supplemental production interactions, both languages at 1440/390.');
})().catch(async e => { console.error(e); await browser?.close(); process.exitCode = 1; });
