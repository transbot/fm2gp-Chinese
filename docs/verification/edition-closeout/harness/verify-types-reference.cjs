// Exercise the existing production routes, using independent browser sessions.
const {chromium, expect} = require('playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.READER_BASE_URL || 'http://127.0.0.1:4187';
const out = process.env.TYPES_AUDIT_DIR || 'docs/verification/phase8-types/browser';
fs.mkdirSync(out, {recursive:true});
const records = [];
const save = () => fs.writeFileSync(out+'/navigation.json', JSON.stringify(records,null,2)+'\n');
const near = (a,b,label) => assert.ok(Math.abs(a-b)<=2, label+' '+a+' vs '+b);
const settle = page => page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
const snapshot = page => page.evaluate(()=>({
  url:location.pathname+location.search+location.hash, y:scrollY, key:history.state?.key||'default',
  open:Array.from(document.querySelectorAll('details[data-reader-disclosure][open]'), e=>e.id)
}));
const anchorY = element => element.evaluate(e=>Math.max(0,Math.min(
  e.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0),
  document.documentElement.scrollHeight-innerHeight)));
let browser;
async function check(width,lang) {
  const zh=lang==='zh', q=zh?'复杂度':'complexity';
  const context=await browser.newContext({viewport:{width,height:1000},locale:zh?'zh-CN':'en-US'});
  const page=await context.newPage();
  const log={base,width,lang,browser:browser.version(),anchors:[],errors:[],iterator:[],power:[]};
  records.push(log);
  page.on('pageerror',e=>log.errors.push(e.message));
  const language=()=>expect(page.locator('html')).toHaveAttribute('lang',zh?'zh-CN':'en');
  const shot=async name=>{await language();await page.screenshot({path:out+'/'+name+'-'+lang+'-'+width+'.png'});};
  const go=async path=>{await page.goto(base+path);await page.locator('h1').first().waitFor();await settle(page);};
  const keyboardOpen=async id=>{
    const summary=page.locator('#'+id+' > summary');
    await summary.focus();await page.keyboard.press('Enter');
    await expect(page.locator('#'+id)).toHaveAttribute('open','');
  };
  const back=page.getByRole('link',{name:zh?'返回来源章节／习题':'Return to source section / exercise',exact:true});

  await go('/concepts/iterators');
  await page.getByRole('link',{name:zh?'建议先学：相关概念':'Learn first: prerequisite concepts'}).click();
  await page.waitForURL(u=>u.pathname==='/book/10' && u.hash==='#section-10-3');
  await expect(page.locator('#section-10-3')).toContainText(zh?'时间与空间':'Time and space');
  await keyboardOpen('advance-cost');
  await page.locator('#advance-cost a[href^="/concepts/iterators"]').click();
  for(const [model,cost] of [['forward',3],['random',1]]) {
    const selector=page.getByRole('combobox').first();
    if(model==='random') await selector.selectOption(model);
    await expect(page.locator('p[aria-live]')).toContainText(zh?'：0':': 0');
    await page.getByRole('button',{name:'advance(3)',exact:true}).click();
    const arrow=page.getByText('↑',{exact:true}).locator('..');
    await expect(arrow).toContainText('3');await expect(arrow).toContainText('end');
    const costText=await page.locator('p[aria-live]').innerText();
    assert.match(costText,new RegExp('[：:]\\s*'+cost+'\\s*·'));
    await page.getByRole('button',{name:zh?'读取当前位置':'Read current position'}).click();
    await expect(page.getByRole('alert')).toContainText(zh?'不能解引用':'cannot be dereferenced');
    log.iterator.push({model,costText,position:await arrow.innerText()});
  }

  await go('/book?source=proof-reader&tag=two+words');
  const input=page.getByRole('searchbox');
  await input.pressSequentially(q);await expect(input).toHaveValue(q);
  await expect.poll(()=>new URL(page.url()).searchParams.get('q')).toBe(q);
  const search=new URL(page.url()).search;
  assert.deepEqual(Object.fromEntries(new URLSearchParams(search)),{source:'proof-reader',tag:'two words',q});
  await shot('search');
  await page.locator('a[href$="#section-10-3"]').click();
  await page.locator('#section-10-3 a[href$="#section-C-2"]').click();
  await page.waitForURL(u=>u.pathname==='/book/C' && u.hash==='#section-C-2' && u.search===search);
  await keyboardOpen('cpp-constraints');await keyboardOpen('cpp-subtraction');
  assert.equal(new URL(page.url()).hash,'#section-C-2');
  const link=page.locator('#cpp-subtraction a[href^="/concepts/algebra?"]');
  const from=new URL(await link.getAttribute('href'),base).searchParams.get('from');
  assert.equal(from,'/book/C'+search+'#cpp-subtraction');log.from=from;
  const switchLang=async()=>{await page.getByRole('button',{name:zh?'English':'中文',exact:true}).click();};
  const restoreLang=async()=>{await page.getByRole('button',{name:zh?'中文':'English',exact:true}).click();};
  await switchLang();
  await expect(page.locator('#cpp-subtraction')).toContainText(zh?'Changing (r op a)':'移动括号需要结合律');
  await expect(page.locator('#cpp-subtraction')).toHaveAttribute('open','');
  await restoreLang();
  await page.locator('#cpp-subtraction').scrollIntoViewIfNeeded();await shot('counterexample');
  await link.evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-75));await settle(page);
  const left=await snapshot(page);const entry=await anchorY(page.locator('#cpp-subtraction'));
  assert.ok(Math.abs(left.y-entry)>60,'departure distinct from anchor');
  await link.click();await page.waitForURL(u=>u.pathname==='/concepts/algebra');
  assert.equal(new URL(page.url()).searchParams.get('from'),from);
  await page.getByRole('combobox').selectOption('4');
  await expect(page.locator('.learning-intro')).toContainText('1 ≠ 3');
  const fields=page.locator('input');await expect(fields.nth(2)).toHaveValue('1');
  await fields.nth(2).fill('3');await expect(page.locator('.learning-intro')).toContainText('-1 ≠ 5');
  await back.click();await page.waitForURL(u=>u.hash==='#cpp-subtraction');await settle(page);
  const returned=await snapshot(page);await page.waitForTimeout(400);const stable=await snapshot(page);
  for(const s of [returned,stable]) {
    assert.equal(s.url,from);assert.deepEqual(s.open,left.open);near(s.y,left.y,'saved return');
  }
  await page.goBack();await page.waitForURL(u=>u.pathname==='/concepts/algebra');
  await page.goForward();await page.waitForURL(u=>u.hash==='#cpp-subtraction');await settle(page);
  const pop=await snapshot(page);near(pop.y,left.y,'forward');
  await link.click();await page.waitForURL(u=>u.pathname==='/concepts/algebra');
  await page.evaluate(()=>sessionStorage.clear());await page.reload();await back.click();await page.waitForURL(u=>u.hash==='#cpp-subtraction');
  await settle(page);await page.waitForTimeout(400);const hard=await snapshot(page);
  const target=await anchorY(page.locator('#cpp-subtraction'));
  assert.equal(hard.url,from);assert.deepEqual(hard.open,['cpp-constraints','cpp-subtraction']);near(hard.y,target,'hard refresh');
  log.navigation={entry,left,returned,stable,pop,hard,target};save();
  await page.getByRole('link',{name:zh?'返回章节目录':'Back to chapter directory'}).click();
  await expect(input).toHaveValue(q);await input.fill('');
  await expect.poll(()=>new URL(page.url()).search).toBe('?source=proof-reader&tag=two+words');

  await go('/book/10#interpret-byte');
  const radios=page.getByRole('radio');
  await radios.first().focus();await page.keyboard.press('Space');
  await expect(page.getByRole('status')).toContainText('65');
  const bits=page.getByText('01000001',{exact:true});await expect(bits).toHaveCount(1);
  await shot('integer');await page.keyboard.press('ArrowRight');
  await expect(radios.nth(1)).toBeChecked();await expect(page.getByRole('status')).toContainText('A');
  await switchLang();await expect(radios.nth(1)).toBeChecked();await restoreLang();
  await expect(bits).toHaveCount(1);await bits.scrollIntoViewIfNeeded();await shot('ascii');

  await go('/book/C#accumulation-contract');
  const contract=page.locator('#accumulation-contract');
  const values=await contract.locator('tbody tr').allTextContents();
  assert.deepEqual(values,['×52 × 243 = 486243','+52 + 15 = 1715','×021','+020']);
  await contract.locator('table').scrollIntoViewIfNeeded();await shot('powers');
  await contract.locator('a[href^="/power?"]').click();
  for(const [model,n,result] of [['multiply','5','243'],['add','5','15'],['add','0','0'],['multiply','0','1']]) {
    await page.getByRole('combobox').first().selectOption(model);
    await page.getByRole('spinbutton').last().fill(n);
    const slider=page.getByRole('slider').first();await slider.focus();await page.keyboard.press('End');
    await expect(page.getByTestId('power-result')).toHaveText(result);log.power.push({model,n,result});
  }
  const ids={'10':['section-10-2','interpret-byte','datum-to-object','section-10-3','concept-subtraction','advance-cost'],
    'C':['section-C-1','template-arguments','section-C-2','cpp-constraints','cpp-subtraction','section-C-4','operation-order','section-C-5','accumulation-contract','section-C-7']};
  for(const [chapter,targets] of Object.entries(ids)) for(const id of targets) {
    await go('/book/'+chapter+'#'+id);
    for(let i=0;i<2;i++) {
      if(i) {await page.reload();await page.locator('#'+id).waitFor();await settle(page);}
      const element=page.locator('#'+id); near((await snapshot(page)).y,await anchorY(element),id);
      const audit=await element.evaluate(e=>({
        text:e.textContent+' '+[...e.querySelectorAll('[aria-label],[title],[alt],[placeholder]')].map(n=>['aria-label','title','alt','placeholder'].map(k=>n.getAttribute(k)||'').join(' ')).join(' '),
        fits:document.documentElement.scrollWidth<=innerWidth+1
      }));
      assert.ok(audit.fits);assert.doesNotMatch(audit.text,/第\s*\d+\s*页|页码|\bpages?\s+\d+|#page=/i);
      if(!zh) assert.doesNotMatch(audit.text,/[\u3400-\u9fff]/);
    }
    log.anchors.push(id);
  }
  await go('/book/C#operation-order');assert.equal(await page.locator('#operation-order samp').textContent(),'Result: bbb');
  await go('/book/C#section-C-7');await expect(page.locator('#section-C-7 a[href^="/concepts/iterators"]')).toHaveCount(1);
  assert.deepEqual(log.errors,[]);save();await context.close();
}
(async()=>{
  browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  for(const width of [1440,390]) for(const lang of ['zh','en']) await check(width,lang);
  await browser.close();console.log('PASS: 4 reading journeys, 8 iterator moves, 16 power cases, 64 direct/refresh pairs.');
})().catch(async e=>{save();console.error(e);await browser?.close();process.exitCode=1;});
