// Run against the production preview, not the development server.
const { chromium, expect } = require('playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const baseUrl = process.env.READER_BASE_URL || 'http://127.0.0.1:4177';
const out = process.env.DIVISION_AUDIT_DIR || 'docs/verification/phase3-division';
fs.mkdirSync(out, { recursive: true });
// These fixtures connect the independently unit-tested trace to the real UI.
const compiled = new Module('division-fixture');
compiled._compile(ts.transpileModule(fs.readFileSync('src/lib/algorithms/divisionTrace.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, 'division-fixture.cjs');
const { divisionMethods: methods, divisionTrace } = compiled.exports;
const cases = [[45,6,7,3],[42,6,7,0],[5,6,0,5],[6,6,1,0],[0,6,0,0],[47,7,6,5],[256,1,256,0],[770,3,256,2],[1000000,1000000,1,0]];
const traces = Object.fromEntries(methods.map(m => [m, divisionTrace(45,6,m)]));
const expectedCounts = { repeated:[0,7,0,7], doubling:[2,6,2,3], fibonacci:[4,6,0,2], quotient:[6,6,2,3] };
for (const m of methods) assert.deepEqual(Object.values(traces[m].at(-1).counts), expectedCounts[m]);
fs.writeFileSync(`${out}/key-counts.json`, JSON.stringify({ cases: cases.map(([A,B,q,r]) => ({A,B,q,r,methods:methods.map(method => {const t=divisionTrace(A,B,method),s=t.at(-1);assert.equal(s.result,r);if(method==='quotient')assert.equal(s.n,q);return {method,steps:t.length,counts:s.counts};})})), traces45by6:traces },null,2));
let browser;
const audit=[];
(async()=>{
  browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  for(const width of [1440,390]) for(const lang of ['zh','en']) {
    console.log(`Checking ${lang} / ${width}`);
    const context=await browser.newContext({viewport:{width,height:1000},locale:lang==='zh'?'zh-CN':'en-US'});
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    let current=lang;
    const text=(zh,en)=>current==='zh'?zh:en;
    const go=async path=>{assert.equal((await page.goto(baseUrl+path)).status(),200);await page.locator('h1').first().waitFor();};
    const language=async()=>assert.equal(await page.locator('html').getAttribute('lang'),current==='zh'?'zh-CN':'en');
    const layout=async()=>{assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'viewport overflow');};
    const noPages=async()=>{
      const content=await page.locator('body').innerText();
      assert.doesNotMatch(content,/第\s*\d+\s*页|(?:PDF\s*)?页码|\b(?:PDF\s+)?pages?\s+\d+/i);
      const labels=await page.locator('[aria-label],[title]').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||'')+' '+(e.getAttribute('title')||'')).join('\n'));
      assert.doesNotMatch(labels,/第\s*\d+\s*页|页码|\bpages?\s+\d+/i);
      if(current==='en') assert.doesNotMatch(content.replaceAll('中文',''),/[\u4e00-\u9fff]/,'Chinese UI text in English');
    };
    const shot=async(name,locator)=>{await language();await layout();await noPages();await (locator||page).screenshot({path:`${out}/${name}-${lang}-${width}.png`,...(locator?{}:{fullPage:true})});};
    const card=m=>page.getByTestId('division-'+m);
    const button=(m,zh,en)=>card(m).getByRole('button',{name:text(zh,en),exact:true});
    const seek=async(m,n)=>{await card(m).getByRole('slider').fill(String(n));};
    const openQuotient=async()=>{const d=page.getByTestId('quotient-disclosure');if(await d.getAttribute('open')===null)await d.locator('summary').click();};
    const apply=async(A,B)=>{await page.locator('#division-A').fill(String(A));await page.locator('#division-B').fill(String(B));await page.getByRole('button',{name:text('应用输入','Apply input'),exact:true}).click();};
    const snapshot=async m=>({step:await card(m).getByRole('slider').inputValue(),variables:await card(m).getByTestId('variables').innerText(),counts:(await card(m).getByTestId('counts').innerText()).match(/\d+/g),line:await card(m).locator('[aria-current="step"]').getAttribute('data-line')});
    const checkStep=async(m,i)=>{
      const s=traces[m][i];await seek(m,i);
      const state=await snapshot(m);
      assert.equal(state.variables,`a = ${s.a} · b = ${s.b} · c = ${s.c??'—'} · n = ${s.n??'—'} · tmp = ${s.tmp??'—'}`);
      assert.deepEqual(state.counts,Object.values(s.counts).map(String));assert.equal(state.line,s.line);
      assert.match(await page.getByTestId('current-'+m).innerText(),new RegExp(`a = ${s.a}\\b`));
    };
    await go('/division');await language();await page.reload();await page.locator('#division-A').waitFor();
    await openQuotient();
    for(const m of methods){
      const cells=await page.getByTestId('summary-'+m).locator('td').allTextContents();assert.deepEqual(cells.slice(0,5),['3',...expectedCounts[m].map(String)]);
      // Every default-input statement: variables, counters and just-executed line.
      for(let i=0;i<traces[m].length;i++)await checkStep(m,i);
      assert.equal(await card(m).getByTestId('result').innerText(),'3');
      const last=await snapshot(m);await button(m,'上一步','Step Backward').click();await button(m,'下一步','Step Forward').click();assert.deepEqual(await snapshot(m),last);
      await button(m,'播放','Play').click();await expect(card(m).getByRole('slider')).toHaveValue('0');await button(m,'暂停','Pause').click();
      await button(m,'重置','Reset').click();assert.equal((await snapshot(m)).step,'0');
    }
    assert.deepEqual(traces.quotient.filter(s=>s.checkpoint).map(s=>[s.n,s.c,s.a]),[[1,24,21],[2,12,21],[3,12,9],[6,6,9],[7,6,3]]);
    for(const [i,s] of traces.quotient.entries())if(s.checkpoint){await seek('quotient',i);assert.match(await card('quotient').getByTestId('invariant').innerText(),new RegExp(`45 = ${s.n} × ${s.c} \\+ ${s.a}`));}
    await seek('quotient',traces.quotient.findIndex(s=>s.event==='half'));assert.match(await card('quotient').getByTestId('invariant').innerText(),current==='zh'?/正在更新/:/updating/);
    // In-flight input application resets and cancels timers in all four players.
    for(const m of methods){await button(m,'重置','Reset').click();await card(m).getByRole('combobox').selectOption('3');await button(m,'播放','Play').click();}
    await page.locator('#division-A').fill('47');await page.locator('#division-B').fill('7');await expect(page.getByTestId('pending-input')).toBeVisible();
    assert.equal(await card('doubling').getByTestId('original-input').innerText(),'A = 45 · B = 6');
    await page.getByRole('button',{name:text('应用输入','Apply input'),exact:true}).click();await openQuotient();await page.waitForTimeout(1150);
    for(const m of methods){assert.equal((await snapshot(m)).step,'0');assert.equal(await card(m).getByTestId('original-input').innerText(),'A = 47 · B = 7');await seek(m,await card(m).getByRole('slider').getAttribute('max'));assert.equal(await card(m).getByTestId('result').innerText(),'5');await button(m,'上一步','Step Backward').click();await button(m,'下一步','Step Forward').click();assert.equal(await card(m).getByTestId('result').innerText(),'5');await button(m,'播放','Play').click();await button(m,'暂停','Pause').click();await button(m,'重置','Reset').click();}
    await button('fibonacci','播放','Play').click();await expect(card('fibonacci').getByRole('slider')).not.toHaveValue('0');await button('fibonacci','暂停','Pause').click();assert.equal((await snapshot('doubling')).step,'0');
    // All specified examples, including quotient 256 with a nonzero remainder.
    for(const [A,B,q,r] of cases){await page.getByRole('button',{name:`${A} ÷ ${B}`,exact:true}).click();await openQuotient();for(const m of methods){assert.equal((await snapshot(m)).step,'0');await seek(m,await card(m).getByRole('slider').getAttribute('max'));assert.equal(await card(m).getByTestId('result').innerText(),String(r));assert.match(await card(m).getByTestId('final-identity').innerText(),new RegExp(`${A} = ${q} × ${B} \\+ ${r}`));}}
    await apply(1000000,1000000);const million=divisionTrace(1000000,1000000,'fibonacci');await seek('fibonacci',million.findIndex(s=>s.c===2000000));assert.match(await card('fibonacci').getByTestId('variables').innerText(),/c = 2000000/);
    // Strict token errors remain beside the correct draft and change language.
    for(const [A,B,field,kind] of [['','6','A','empty'],['-1','6','A','range'],['1.00000000000000001','6','A','integer'],['1e-400','6','A','integer'],['1000001','6','A','range'],['257','1','A','capacity'],['45','0','B','range']]){
      await apply(A,B);assert.equal(await page.locator('#division-'+field).inputValue(),field==='A'?A:B);assert.equal(await page.locator('#division-'+field).getAttribute('aria-describedby'),'division-error-'+field);await expect(page.getByRole('alert')).toBeVisible();assert.equal(await card('doubling').count(),0);if(kind==='capacity')assert.match(await page.getByRole('alert').innerText(),/256/);
    }
    await page.getByRole('button',{name:current==='zh'?'English':'中文',exact:true}).click();current=current==='zh'?'en':'zh';assert.match(await page.getByRole('alert').innerText(),current==='zh'?/不能为零/:/cannot be zero/);await page.getByRole('button',{name:current==='zh'?'English':'中文',exact:true}).click();current=lang;
    await apply('045','06');assert.equal(await page.getByTestId('pending-input').count(),0);assert.equal(await page.locator('#division-A').inputValue(),'045');
    await apply(45,6);await openQuotient();
    for(const m of methods)await seek(m,traces[m].findIndex(s=>s.event==='deduct'));
    const before=await Promise.all(methods.map(snapshot));
    await page.getByRole('button',{name:current==='zh'?'English':'中文',exact:true}).click();current=current==='zh'?'en':'zh';
    assert.deepEqual(await Promise.all(methods.map(snapshot)),before);
    for(const m of methods)assert.match(await card(m).getByTestId('explanation').innerText(),current==='zh'?/从当前剩余量/:/Deduct the candidate/);
    await button('fibonacci','上一步','Step Backward').click();assert.match(await card('fibonacci').getByTestId('explanation').innerText(),current==='zh'?/刚检查/:/Just checked/);
    await button('fibonacci','播放','Play').click();await expect(card('fibonacci').getByTestId('explanation')).toContainText(current==='zh'?'从当前剩余量':'Deduct the candidate');await button('fibonacci','暂停','Pause').click();
    assert.deepEqual(await snapshot('fibonacci'),before[2]);await language();await noPages();
    await page.getByRole('button',{name:current==='zh'?'English':'中文',exact:true}).click();current=lang;
    // Keyboard range movement restores an identical snapshot.
    await seek('doubling',10);const at10=await snapshot('doubling');await card('doubling').getByRole('slider').focus();await page.keyboard.press('ArrowLeft');assert.equal((await snapshot('doubling')).step,'9');await page.keyboard.press('ArrowRight');assert.deepEqual(await snapshot('doubling'),at10);
    for(const m of methods)await seek(m,traces[m].length-1);
    await page.locator('.learning-note summary').click();await shot('division-complete');
    await shot('fibonacci',card('fibonacci'));
    await seek('quotient',traces.quotient.findIndex(s=>s.checkpoint&&s.n===6));await shot('quotient-checkpoint',card('quotient'));
    // Local scroll, rather than widening the viewport, for long traces and code.
    await apply(770,3);await seek('repeated',await card('repeated').getByRole('slider').getAttribute('max'));await layout();
    assert.equal(await card('repeated').getByTestId('remainder-path').evaluate(e=>e.parentElement.scrollWidth>e.parentElement.clientWidth),true);
    // Search language and the input value are asserted immediately before screenshots.
    const query=lang==='zh'?'斐波那契求余':'Fibonacci remainder';
    await go('/');const results=page.getByTestId('lesson-results');
    for(const q of [query,'largest_doubling','remainder_fibonacci','quotient_remainder','4.6']){await page.getByRole('searchbox').fill(q);assert.equal(await results.locator('a[href="/division"]').count(),1);}
    await page.getByRole('searchbox').fill(query);assert.equal(await page.getByRole('searchbox').inputValue(),query);await shot('home-search');
    await results.locator('a[href="/division"]').click();await page.locator('#division-A').waitFor();await page.reload();await page.locator('#division-A').waitFor();await page.goBack();await page.getByRole('searchbox').waitFor();assert.equal(await page.getByRole('searchbox').inputValue(),query);await page.goForward();await page.locator('#division-A').waitFor();
    await go('/book');
    for(const q of ['第4.6节','Section 4.6']){await page.getByRole('searchbox').fill(q);assert.equal(await page.locator('a[href*="#section-"]').count(),1);assert.equal(await page.locator('a[href*="#section-4-6"]').count(),1);assert.equal(await page.locator('a[href*="#exercise-"]').count(),0);}
    for(const q of ['习题4.6','Exercise 4.6']){await page.getByRole('searchbox').fill(q);assert.equal(await page.locator('a[href*="#exercise-"]').count(),1);assert.equal(await page.locator('a[href*="#exercise-4-6"]').count(),1);assert.equal(await page.locator('a[href*="#section-"]').count(),0);}
    await page.getByRole('searchbox').fill(query);assert.equal(await page.getByRole('searchbox').inputValue(),query);await shot('chapter-search');
    await page.locator('a[href*="#section-4-6"]').click();await page.locator('#section-4-6').waitFor();await page.locator('#section-4-6 a[href^="/division"]').click();await page.locator('#division-A').waitFor();await page.reload();await page.locator('#division-A').waitFor();
    const returnLink=()=>page.getByRole('link',{name:text('返回来源章节／习题','Return to source section / exercise'),exact:true});
    await returnLink().click();await page.locator('#section-4-6').waitFor();assert.equal(new URL(page.url()).hash,'#section-4-6');
    await page.locator('#exercise-4-6 a[href^="/division"]').click();await page.locator('#division-A').waitFor();await returnLink().click();assert.equal(new URL(page.url()).hash,'#exercise-4-6');
    await page.locator('#section-4-5 a[href^="/division"]').click();await page.locator('#division-A').waitFor();await returnLink().click();assert.equal(new URL(page.url()).hash,'#section-4-5');await noPages();
    assert.deepEqual(errors,[]);
    audit.push({baseUrl,browser:browser.version(),width,lang,statementSnapshotsChecked:Object.values(traces).reduce((n,t)=>n+t.length,0),examples:cases.length,screenshotQuery:query,checks:['direct/refresh/back/forward','source return 4.5/4.6/exercise4.6','localized search and unique path','explicit section/exercise separation','every 45/6 statement variables/counts/highlight','independent players','apply while playing','invalid original tokens and inline errors','capacity 770/3 and 257/1','internal candidate 2000000','language switch/review/resume','slider keyboard/seek/reset/replay','stable and intermediate quotient identity','localized developer notes','no page numbers/text and accessibility labels','viewport and local scrolling'],errors});
    fs.writeFileSync(`${out}/browser-audit.json`,JSON.stringify(audit,null,2));await context.close();
  }
  await browser.close();console.log('PASS: division production-preview audit, zh/en × 1440/390.');
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
