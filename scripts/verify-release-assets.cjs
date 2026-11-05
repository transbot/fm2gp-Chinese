// Match public production assets to the local production build without bypassing TLS.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const baseUrl = process.env.READER_BASE_URL || 'http://127.0.0.1:4176';
const out = process.env.READER_OUTPUT_DIR || 'docs/verification/release-phase1-phase2';
let browser;
(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const page = await browser.newPage();
  const response = await page.goto(baseUrl);
  assert.equal(response.status(), 200);
  await page.locator('h1').waitFor();
  const entries = fs.readdirSync('dist', { recursive: true }).filter(f => /^(assets|images)[/\\]/.test(f) && fs.statSync(path.join('dist', f)).isFile());
  const expected = entries.map(f => ({ path: '/' + f.replaceAll('\\', '/'), sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join('dist', f))).digest('hex') }));
  const actual = await page.evaluate(async expected => {
    const results = [];
    for (let i = 0; i < expected.length; i += 4) {
      results.push(...await Promise.all(expected.slice(i, i + 4).map(async entry => {
        const r = await fetch(entry.path, { cache: 'reload' });
        const bytes = await r.arrayBuffer();
        const hash = await crypto.subtle.digest('SHA-256', bytes);
        return { path: entry.path, status: r.status, bytes: bytes.byteLength, sha256: [...new Uint8Array(hash)].map(x => x.toString(16).padStart(2, '0')).join('') };
      })));
    }
    return results;
  }, expected);
  for (let i = 0; i < expected.length; i++) {
    assert.equal(actual[i].status, 200, expected[i].path);
    assert.equal(actual[i].sha256, expected[i].sha256, expected[i].path);
  }
  const liveEntry = await page.locator('script[src^="/assets/index-"]').getAttribute('src');
  assert.ok(fs.readFileSync('dist/index.html', 'utf8').includes(liveEntry));
  fs.writeFileSync(`${out}/production-assets.json`, JSON.stringify({ baseUrl, checkedAt: new Date().toISOString(), liveEntry, matchingFiles: actual.length, assets: actual }, null, 2));
  console.log(`PASS: ${actual.length} production assets match local build SHA-256; entry ${liveEntry}`);
  await browser.close();
})().catch(async e => { console.error(e); await browser?.close(); process.exitCode = 1; });
