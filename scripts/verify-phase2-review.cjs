const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const baseUrl = process.env.READER_BASE_URL || 'http://127.0.0.1:4176';
const out = process.env.READER_OUTPUT_DIR || 'docs/verification/phase2-review-fixes';
let browser;
(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const audit = [];
  const queries = [
    ['霍纳', '/horner', '8-1'], ['Horner', '/horner', '8-1'], ['8.1', '/horner', '8-1'],
    ['矩阵与可达性', '/concepts/matrices', '8-5'], ['Matrices and reachability', '/concepts/matrices', '8-6'],
    ['运算与代数结构', '/concepts/algebra', '6-1'], ['Operations and algebraic structures', '/concepts/algebra', '6-2'],
    ['迭代器与区间', '/concepts/iterators', '10-4'], ['Iterators and ranges', '/concepts/iterators', 'C-7'],
    ['同一个幂算法', '/power', '7-1'], ['One power algorithm', '/power', '7-6'],
    ["Horner's rule", '/horner', '8-1'], ['矩阵可达性', '/concepts/matrices', '8-5'], ['generic power', '/power', '7-1'],
  ];
  for (const width of [1440, 390]) for (const lang of ['zh', 'en']) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: lang === 'zh' ? 'zh-CN' : 'en-US' });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const go = async route => { assert.equal((await page.goto(baseUrl + route)).status(), 200); await page.locator('h1').first().waitFor(); };
    const noOverflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    const screenshotQuery = lang === 'zh' ? '霍纳' : 'Horner';
    await go('/');
    const results = page.getByTestId('lesson-results');
    const paths = await results.locator('a[href]').evaluateAll(es => es.map(e => e.getAttribute('href')));
    assert.equal(new Set(paths).size, paths.length);
    assert.equal(paths.filter(p => p === '/power').length, 1);
    for (const [query, path] of queries) {
      await page.getByRole('searchbox').fill(query);
      assert.equal(await results.locator(`a[href="${path}"]`).count(), 1, query);
    }
    await page.getByRole('searchbox').fill(screenshotQuery);
    const homeScreenshotQuery = await page.getByRole('searchbox').inputValue();
    assert.equal(homeScreenshotQuery, screenshotQuery);
    await noOverflow(); await page.screenshot({ path: `${out}/home-search-${lang}-${width}.png`, fullPage: true });
    await results.locator('a[href="/horner"]').click(); await page.locator('h1').waitFor();
    await page.reload(); await page.locator('h1').waitFor(); assert.equal(new URL(page.url()).pathname, '/horner');
    await go('/book');
    for (const [query, , section] of queries) {
      await page.getByRole('searchbox').fill(query);
      assert.equal(await page.locator(`a[href*="#section-${section}"]`).count(), 1, query);
    }
    const explicitSections = [['第C.7节', 'C-7'], ['Section C.7', 'C-7'], ['section c.7', 'C-7'], ['第a.1节', 'A-1'], ['section b.1', 'B-1'], ['第9.2节', '9-2'], ['Section 10.8', '10-8']];
    for (const [query, anchor] of explicitSections) {
      await page.getByRole('searchbox').fill(query);
      const sections = page.locator('a[href*="#section-"]');
      assert.equal(await sections.count(), 1, query);
      assert.ok((await sections.getAttribute('href')).endsWith('#section-' + anchor), query);
      assert.equal(await page.locator('a[href*="#exercise-"]').count(), 0, query);
    }
    for (const query of ['习题9.2', 'Exercise 9.2', 'exercise 9.2']) {
      await page.getByRole('searchbox').fill(query);
      assert.equal(await page.locator('a[href*="#section-"]').count(), 0, query);
      const exercises = page.locator('a[href*="#exercise-"]');
      assert.equal(await exercises.count(), 1, query);
      assert.ok((await exercises.getAttribute('href')).endsWith('#exercise-9-2'), query);
    }
    await page.getByRole('searchbox').fill(screenshotQuery);
    const chapterScreenshotQuery = await page.getByRole('searchbox').inputValue();
    assert.equal(chapterScreenshotQuery, screenshotQuery);
    await noOverflow(); await page.screenshot({ path: `${out}/chapter-search-${lang}-${width}.png`, fullPage: true });
    await page.locator('a[href*="#section-8-1"]').click(); await page.locator('#section-8-1').waitFor();
    await page.locator('#section-8-1 a[href*="/horner"]').click(); await page.locator('h1').waitFor();
    await page.getByRole('link', { name: lang === 'zh' ? '返回来源章节／习题' : 'Return to source section / exercise', exact: true }).click();
    await page.locator('#section-8-1').waitFor();
    await page.goBack(); await page.locator('h1').waitFor(); assert.equal(new URL(page.url()).pathname, '/horner');
    const coefficients = page.getByLabel(lang === 'zh' ? '系数（降幂顺序）' : 'Coefficients (descending powers)', { exact: true });
    const apply = page.getByRole('button', { name: lang === 'zh' ? '应用输入' : 'Apply input', exact: true });
    for (const invalid of ['[1.00000000000000001,2]', '[1e-400,2]']) {
      await coefficients.fill(invalid); await apply.click();
      assert.match(await page.getByRole('alert').innerText(), lang === 'zh' ? /十进制整数/ : /decimal integer/);
      assert.equal(await page.getByTestId('polynomial-horner').count(), 0);
      assert.equal(await coefficients.inputValue(), invalid);
    }
    await coefficients.fill('[1,0,0,0]'); await page.getByLabel('x', { exact: true }).fill('1000000'); await apply.click();
    const direct = page.getByTestId('polynomial-direct'), progress = direct.getByRole('slider');
    await progress.fill(await progress.getAttribute('max'));
    const check = async () => {
      assert.match(await direct.getByTestId('variables').innerText(), /term = 1000000000000 · k = 2/);
      assert.equal(await direct.getByTestId('current-expression').innerText(), '(1) · x^2');
      assert.deepEqual((await direct.getByTestId('counts').innerText()).match(/\d+/g), ['2','0']);
      assert.equal(await direct.locator('[aria-current="step"]').getAttribute('data-line'), 'multiply');
    };
    await check(); assert.match(await direct.getByRole('alert').innerText(), lang === 'zh' ? /安全整数/ : /safe-integer/);
    assert.equal(await direct.getByText('1000000000000 × (1000000) = 1000000000000000000', { exact: true }).count(), 1);
    await direct.getByRole('button', { name: lang === 'zh' ? '上一步' : 'Step Backward', exact: true }).click(); await check();
    assert.equal(await direct.getByRole('alert').count(), 0);
    await direct.getByRole('button', { name: lang === 'zh' ? '下一步' : 'Step Forward', exact: true }).click(); await check();
    await direct.getByRole('combobox').selectOption('3');
    await direct.getByRole('button', { name: lang === 'zh' ? '播放' : 'Play', exact: true }).click();
    await direct.getByRole('alert').waitFor(); await check();
    await page.getByRole('button', { name: lang === 'zh' ? 'English' : '中文', exact: true }).click(); await check();
    assert.match(await direct.getByRole('alert').innerText(), lang === 'zh' ? /safe-integer/ : /安全整数/);
    await page.getByRole('button', { name: lang === 'zh' ? '中文' : 'English', exact: true }).click();
    await noOverflow(); assert.deepEqual(errors, []);
    await page.screenshot({ path: `${out}/overflow-state-${lang}-${width}.png`, fullPage: true });
    audit.push({ baseUrl, browser: browser.version(), width, lang, screenshotQueries: { home: homeScreenshotQuery, chapter: chapterScreenshotQuery }, explicitSections, exerciseQueries: ['习题9.2', 'Exercise 9.2', 'exercise 9.2'], queries: queries.map(([q]) => q), homePathsUnique: true, rejectedOriginalTokens: ['[1.00000000000000001,2]', '[1e-400,2]'], overflow: { term: 1000000000000, power: 2, multiplications: 2, review: 'pass', autoplayReplay: 'pass', languageSwitch: 'pass' }, navigation: 'home entry, refresh, chapter source return and back passed', errors });
    await context.close();
  }
  fs.writeFileSync(`${out}/browser-audit.json`, JSON.stringify(audit, null, 2));
  console.log('PASS: both search entry points (14 queries), localized screenshot queries, exact appendix sections, section/exercise separation, exact input rejection, overflow review/replay, in both languages at 1440/390.');
  await browser.close();
})().catch(async e => { console.error(e); await browser?.close(); process.exitCode = 1; });
