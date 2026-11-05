const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const baseUrl = process.env.READER_BASE_URL || 'http://127.0.0.1:4174';
const out = process.env.READER_OUTPUT_DIR || 'docs/verification/phase2-egyptian';
let browser;
(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const checks = [];
  for (const width of [1440, 390]) for (const lang of ['zh', 'en']) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: lang === 'zh' ? 'zh-CN' : 'en-US' });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const go = async route => { assert.equal((await page.goto(baseUrl + route)).status(), 200); await page.locator('h1').waitFor(); };
    await go('/book/2#section-2-2');
    await page.locator('#section-2-2 a[href*="/multiply"]').click(); await page.locator('h1').waitFor();
    await page.reload(); await page.locator('h1').waitFor(); assert.equal(new URL(page.url()).pathname, '/multiply');
    await page.goBack(); await page.locator('#section-2-2').waitFor();
    await page.goForward(); await page.locator('h1').waitFor();
    const players = ['multiply0', 'multiply1', 'multiply4'].map(v => page.getByTestId(v));
    const seek = async (p, index) => p.getByRole('slider').fill(String(index));
    const finish = async p => seek(p, await p.getByRole('slider').getAttribute('max'));
    for (const p of players) await p.getByRole('button', { name: lang === 'zh' ? '播放' : 'Play', exact: true }).click();
    await page.getByLabel(lang === 'zh' ? 'n：重复次数' : 'n: repetition count', { exact: true }).fill('41');
    await page.getByLabel(lang === 'zh' ? 'a：被累加的对象' : 'a: value to add', { exact: true }).fill('59');
    await page.getByRole('button', { name: lang === 'zh' ? '应用输入' : 'Apply input', exact: true }).click();
    await page.waitForTimeout(1200);
    for (const p of players) {
      assert.equal(await p.getByRole('slider').inputValue(), '0'); await finish(p);
      assert.equal(await p.getByTestId('result').innerText(), '2419');
      await p.getByRole('button', { name: lang === 'zh' ? '上一步' : 'Step Backward', exact: true }).click();
      await p.getByRole('button', { name: lang === 'zh' ? '下一步' : 'Step Forward', exact: true }).click();
      assert.equal(await p.getByTestId('result').innerText(), '2419');
      await p.getByRole('button', { name: lang === 'zh' ? '播放' : 'Play', exact: true }).click();
      assert.equal(await p.getByRole('slider').inputValue(), '0');
      await p.getByRole('button', { name: lang === 'zh' ? '暂停' : 'Pause', exact: true }).click();
    }
    for (const [n, a, counts, peaks] of [[15,7,[14,6,6],[15,4,2]],[16,7,[15,4,4],[16,5,1]],[41,59,[40,7,7],[41,6,2]],[1,7,[0,0,0],[1,1,1]]]) {
      await page.getByRole('button', { name: `${n} × ${a}`, exact: true }).click();
      for (let i = 0; i < players.length; i++) {
        const cells = await page.getByTestId(`summary-${['multiply0','multiply1','multiply4'][i]}`).locator('td').allTextContents();
        assert.deepEqual(cells, [String(n*a), String(counts[i]), String(peaks[i])]);
      }
    }
    await page.getByRole('button', { name: '15 × 7', exact: true }).click();
    const p4 = players[2];
    // Find the helper-entry checkpoint by visible state, not implementation imports.
    let helperIndex = -1;
    for (let i = 0; i < 15; i++) {
      await seek(p4, i);
      if (await p4.locator('[data-frame="mult_acc4"]').count()) { helperIndex = i; break; }
    }
    assert.ok(helperIndex >= 0); assert.equal(await p4.locator('[data-frame]').count(), 2);
    const counters = (await p4.getByTestId('counts').innerText()).match(/\d+/g);
    const line = await p4.locator('[aria-current="step"]').getAttribute('data-line');
    await page.getByRole('button', { name: lang === 'zh' ? 'English' : '中文', exact: true }).click();
    assert.deepEqual((await p4.getByTestId('counts').innerText()).match(/\d+/g), counters);
    assert.equal(await p4.locator('[aria-current="step"]').getAttribute('data-line'), line);
    assert.match(await p4.getByTestId('variables').innerText(), /n = 7 · a = 14 · r = 7/);
    await seek(p4, helperIndex - 1);
    assert.equal(await p4.locator('[data-frame]').count(), 1);
    assert.match(await p4.getByTestId('explanation').innerText(), lang === 'zh' ? /Evaluate/ : /计算调用参数/);
    await p4.getByRole('button', { name: lang === 'zh' ? 'Play' : '播放', exact: true }).click();
    await page.waitForTimeout(1100);
    await p4.getByRole('button', { name: lang === 'zh' ? 'Pause' : '暂停', exact: true }).click();
    assert.match(await p4.getByTestId('explanation').innerText(), lang === 'zh' ? /Enter/ : /进入算法/);
    await page.getByRole('button', { name: lang === 'zh' ? '中文' : 'English', exact: true }).click();
    await seek(players[0], 5); await seek(players[1], 8); await seek(p4, helperIndex);
    const notes = page.locator('summary').last(); await notes.focus(); await page.keyboard.press('Enter');
    assert.equal(await page.locator('details').last().getAttribute('open'), '');
    const copy = await page.locator('body').innerText();
    assert.doesNotMatch(copy, /页码|页序|PDF page|第\s*\d+\s*页/);
    if (lang === 'en') assert.doesNotMatch(copy.replaceAll('中文',''), /[\u3400-\u9fff]/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    await page.screenshot({ path: `${out}/egyptian-${lang}-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: '0 × 7', exact: true }).click();
    for (const p of players) { await finish(p); assert.equal(await p.getByTestId('result').innerText(), '0'); assert.equal(await p.locator('[data-frame]').count(), 0); }
    await page.getByRole('button', { name: '-15 × 7', exact: true }).click();
    for (const p of players) { await finish(p); assert.equal(await p.getByTestId('result').innerText(), '-105'); }
    await page.getByLabel(lang === 'zh' ? 'n：重复次数' : 'n: repetition count', { exact: true }).fill('257');
    await page.getByRole('button', { name: lang === 'zh' ? '应用输入' : 'Apply input', exact: true }).click();
    assert.match(await page.getByRole('alert').innerText(), /256/);
    assert.deepEqual(errors, []);
    checks.push({ baseUrl, width, lang, passed: ['chapter 2.2 entry', 'refresh and back/forward', 'new input pauses and resets all players', 'new-input forward/back/replay', 'all four count baselines', '1 vs 2 helper frames', 'language preserves counts and code', 'language replay uses new explanations', 'zero/negative wrapper', 'capacity error', 'keyboard disclosure', 'no mixed English copy', 'no page numbers or whole-page overflow'], errors });
    await context.close();
  }
  fs.writeFileSync(`${out}/browser-audit.json`, JSON.stringify(checks, null, 2));
  console.log('PASS: Egyptian production preview, both languages at 1440/390.');
  await browser.close();
})().catch(async e => { console.error(e); await browser?.close(); process.exitCode = 1; });
