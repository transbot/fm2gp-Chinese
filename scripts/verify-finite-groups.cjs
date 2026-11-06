const {chromium,expect} = require('playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.READER_BASE_URL || 'http://127.0.0.1:4187';
const out = process.env.GROUP_AUDIT_DIR || 'docs/verification/phase9-groups/browser';
fs.mkdirSync(out,{recursive:true});
const records=[];
const save=()=>fs.writeFileSync(out+'/navigation.json',JSON.stringify(records,null,2)+'\n');
const near=(x,y,label)=>assert.ok(Math.abs(x-y)<=2,label+': '+x+' vs '+y);
const settle=page=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const snapshot=page=>page.evaluate(()=>({
  url:location.pathname+location.search+location.hash,key:history.state?.key||'default',y:scrollY,
  open:Array.from(document.querySelectorAll('details[data-reader-disclosure][open]'),d=>d.id),
  element:document.querySelector('#generated-subgroup select')?.value,
  rep:document.querySelector('#coset-partition select')?.value,
  powers:document.querySelector('[data-testid="power-sequence"]')?.textContent,
  subgroup:document.querySelector('[data-testid="generated-members"]')?.textContent,
  products:document.querySelector('[data-testid="coset-products"]')?.textContent,
  coset:document.querySelector('[data-testid="coset-members"]')?.textContent,
}));
const expectedState={element:'3',rep:'6',powers:'3 → 2 → 6 → 4 → 5 → 1',subgroup:'{1, 2, 3, 4, 5, 6}',products:'6 → 5 → 3',coset:'{3, 5, 6}'};
const checkState=s=>{for(const [k,v] of Object.entries(expectedState))assert.equal(s[k],v,k);};
const anchorY=element=>element.evaluate(e=>Math.max(0,Math.min(
  e.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0),
  document.documentElement.scrollHeight-innerHeight)));
let browser;

async function verifyDemo(page,name,zh) {
  const results=[];
  const cases=name==='fermat'?[[2,7,1],[2,9,4]]:[[3,8,1],[2,8,0]];
  for(const [a,mod,result] of cases) {
    const inputs=page.getByRole('spinbutton');
    await inputs.nth(0).fill(String(a));await inputs.nth(1).fill(String(mod));await inputs.nth(1).blur();
    const slider=page.getByRole('slider').first();await slider.focus();await page.keyboard.press('End');
    await expect.poll(async()=>await slider.inputValue()).toBe(await slider.getAttribute('max'));
    if(name==='fermat') {
      const answer=mod===7?(zh?'定理验证成功！7 是素数，且 2^(7-1) mod 7 = 1':'Theorem verified! 7 is prime, and 2^(7-1) mod 7 = 1'):
        (zh?'9 是合数。定理不适用：2^(9-1) mod 9 = 4 ≠ 1':"9 is composite. Theorem doesn't apply: 2^(9-1) mod 9 = 4 ≠ 1");
      await expect(page.getByText(answer,{exact:true})).toBeVisible();
      results.push({a,mod,result,verdict:answer});
    } else {
      const answer=a===3?(zh?'定理验证成功！':'Theorem Verified!'):
        (zh?'定理不适用（a 和 n 不互素）':'Theorem does not apply (a and n are not coprime)');
      await expect(page.getByText(answer,{exact:true})).toBeVisible();
      const expr=page.locator('div.font-mono').filter({has:page.locator('sup')}).filter({hasText:a+'4mod8='+result});
      await expect(expr).toHaveCount(1);
      results.push({a,mod,result,phi:4,expression:await expr.textContent(),verdict:answer});
    }
  }
  return results;
}

async function run(width,lang) {
  const zh=lang==='zh', query=zh?'元素阶':'order of an element';
  const context=await browser.newContext({viewport:{width,height:1000},locale:zh?'zh-CN':'en-US'});
  const page=await context.newPage();
  const log={base,width,lang,browser:browser.version(),direct:[],returns:[],searches:[],errors:[]};
  records.push(log);page.on('pageerror',e=>log.errors.push(e.message));
  const language=()=>expect(page.locator('html')).toHaveAttribute('lang',zh?'zh-CN':'en');
  const shot=async(id,label)=>{
    if(id)await page.locator('#'+id).evaluate(e=>e.scrollIntoView({block:'start'}));
    await settle(page);await language();await page.screenshot({path:out+'/'+label+'-'+lang+'-'+width+'.png'});
  };
  const open=async id=>{
    const card=page.locator('#'+id);
    if(!await card.evaluate(d=>d.open)){
      await card.locator('> summary').focus();await page.keyboard.press('Enter');
    }
    await expect(card).toHaveAttribute('open','');
  };
  const go=async path=>{await page.goto(base+path);await page.locator('h1').first().waitFor();await settle(page);};
  const element=page.locator('#generated-subgroup select'), rep=page.locator('#coset-partition select');
  await go('/book?source=group-reader&tag=two+words');
  const input=page.getByRole('searchbox');await input.pressSequentially(query);await expect(input).toHaveValue(query);
  await expect.poll(()=>new URL(page.url()).searchParams.get('q')).toBe(query);
  const search=new URL(page.url()).search;
  assert.deepEqual(Object.fromEntries(new URLSearchParams(search)),{source:'group-reader',tag:'two words',q:query});
  await shot(null,'search');
  await page.locator('a[href$="#section-6-3"]').click();await open('element-order');
  await page.locator('#section-6-3 a[href$="#section-6-4"]').click();
  await expect(element).toHaveValue('2');await expect(rep).toHaveValue('3');
  await expect(page.getByTestId('power-sequence')).toHaveText('2 → 4 → 1');
  await shot('generated-subgroup','element-2');
  await element.focus();await page.keyboard.press('ArrowDown');
  await expect(element).toHaveValue('3');await shot('generated-subgroup','element-3');
  await expect(page.getByTestId('coset-products')).toHaveText('3 → 6 → 5');
  await shot('coset-partition','representative-3');
  await rep.focus();await page.keyboard.press('End');await expect(rep).toHaveValue('6');
  await expect(page.locator('#coset-partition')).toContainText(zh?'本节固定使用 H＝〈2〉＝{1,2,4}':'This section fixes H = 〈2〉 = {1,2,4}');
  await shot('coset-partition','representative-6');checkState(await snapshot(page));
  await open('coset-proof');await shot('coset-proof','proof');
  await page.getByRole('button',{name:zh?'English':'中文',exact:true}).click();
  await expect(page.locator('#coset-proof')).toContainText(zh?'Right-multiply':'右乘');
  checkState(await snapshot(page));
  await page.getByRole('button',{name:zh?'中文':'English',exact:true}).click();checkState(await snapshot(page));

  for(const demo of ['fermat','euler']) {
    // Leave the address on an earlier section, even though the application is open.
    await page.locator('nav a[href$="#section-6-4"]').first().click();await settle(page);
    await open('lagrange-applications');const id='lagrange-'+demo;
    await open(id);const link=page.locator('#'+id+' a[href^="/'+demo+'?"]');
    const source='/book/6'+search+'#'+id;
    assert.equal(new URL(await link.getAttribute('href'),base).searchParams.get('from'),source);
    await link.evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-25));await settle(page);
    const left=await snapshot(page),anchor=await anchorY(page.locator('#'+id));
    assert.equal(left.url,'/book/6'+search+'#section-6-4');checkState(left);
    assert.ok(Math.abs(anchor-left.y)>40,'manual position distinct from anchor');
    await link.click();await page.waitForURL(u=>u.pathname==='/'+demo);
    assert.equal(new URL(page.url()).searchParams.get('from'),source);
    const readerSource=await page.evaluate(()=>history.state.usr.readerSource);
    assert.deepEqual(readerSource,{url:source,key:left.key});
    await page.getByRole('spinbutton').first().waitFor();await settle(page);
    // Exercise history at an attainable reading position on both demo layouts.
    await page.evaluate(()=>scrollTo(0,230));await settle(page);
    const mid=await snapshot(page);
    await page.goBack();await page.waitForURL(u=>u.hash==='#section-6-4');
    await page.locator('#'+id).waitFor();await settle(page);
    await expect.poll(async()=>Math.abs((await snapshot(page)).y-left.y)).toBeLessThanOrEqual(2);
    const sourcePop=await snapshot(page);checkState(sourcePop);near(sourcePop.y,left.y,'source POP');
    assert.equal(sourcePop.key,left.key);assert.deepEqual(sourcePop.open,left.open);
    await page.goForward();await page.waitForURL(u=>u.pathname==='/'+demo);await settle(page);
    const demoForward=await snapshot(page);near(demoForward.y,mid.y,'demo forward');
    assert.equal(demoForward.key,mid.key);
    const results=await verifyDemo(page,demo,zh);
    const back=page.getByRole('link',{name:zh?'返回来源章节／习题':'Return to source section / exercise',exact:true});
    await back.scrollIntoViewIfNeeded();await settle(page);
    const demoLeft=await snapshot(page);
    await back.click();await page.waitForURL(u=>u.hash==='#'+id);await settle(page);
    const returned=await snapshot(page);await page.waitForTimeout(400);const stable=await snapshot(page);
    for(const s of [returned,stable]){assert.equal(s.url,source);checkState(s);assert.deepEqual(s.open,left.open);near(s.y,left.y,'explicit return');}
    await page.goBack();await page.waitForURL(u=>u.pathname==='/'+demo);await settle(page);
    const demoPop=await snapshot(page);
    // The demo remounts at its initial step, which can be shorter than the final step.
    const popMax=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
    near(demoPop.y,Math.min(popMax,demoLeft.y),'demo POP within document');
    await page.goForward();await page.waitForURL(u=>u.hash==='#'+id);await settle(page);
    const forward=await snapshot(page);checkState(forward);assert.deepEqual(forward.open,left.open);near(forward.y,left.y,'forward');
    await shot('generated-subgroup','return-'+demo+'-element');await shot('coset-partition','return-'+demo+'-representative');
    await link.click();await page.waitForURL(u=>u.pathname==='/'+demo);
    // Discard disclosure hints only; saved mathematical selections must survive reload.
    await page.evaluate(()=>Object.keys(sessionStorage).filter(k=>k.startsWith('fm2gp-reading:')).forEach(k=>sessionStorage.removeItem(k)));
    await page.reload();await back.click();await page.waitForURL(u=>u.hash==='#'+id);
    await settle(page);await page.waitForTimeout(400);const hard=await snapshot(page);
    const target=await anchorY(page.locator('#'+id));assert.equal(hard.url,source);checkState(hard);
    assert.deepEqual(hard.open,['lagrange-applications',id]);near(hard.y,target,'hard return');
    log.returns.push({demo,source,readerSource,results,left,anchor,mid,sourcePop,demoForward,returned,stable,demoLeft,demoPop,popMax,forward,hard,target});save();
  }
  await page.getByRole('link',{name:zh?'返回章节目录':'Back to chapter directory'}).click();
  await expect(input).toHaveValue(query);await input.fill('');
  await expect.poll(()=>new URL(page.url()).search).toBe('?source=group-reader&tag=two+words');
  for(const [q,id] of [['第6.4节','section-6-4'],['习题6.4','exercise-6-4'],['Section 6.5','section-6-5'],['Exercise 6.5','exercise-6-5']]) {
    await input.fill(q);await expect(page.locator('main a[href*="#"]')).toHaveCount(1);
    await page.locator('a[href$="#'+id+'"]').click();await page.waitForURL(u=>u.hash==='#'+id);
    log.searches.push({q,id});await page.goBack();await expect(input).toHaveValue(q);
  }
  for(const id of ['section-6-3','element-order','section-6-4','generated-subgroup','cyclic-size','section-6-5','integer-cosets','coset-partition','coset-proof','lagrange-applications','lagrange-fermat','lagrange-euler']) {
    await go('/book/6#'+id);
    for(let i=0;i<2;i++) {
      if(i){await page.reload();await page.locator('#'+id).waitFor();await settle(page);}
      near((await snapshot(page)).y,await anchorY(page.locator('#'+id)),id);
      const copy=await page.locator('#'+id).evaluate(e=>e.textContent+' '+Array.from(e.querySelectorAll('[aria-label],[title],[alt]'),n=>['aria-label','title','alt'].map(k=>n.getAttribute(k)||'').join(' ')).join(' '));
      assert.doesNotMatch(copy,/第\s*\d+\s*页|页码|\bpages?\s+\d+|#page=/i);
      if(!zh)assert.doesNotMatch(copy,/[\u3400-\u9fff]/);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
    log.direct.push(id);
  }
  assert.deepEqual(log.errors,[]);save();await context.close();
}

(async()=>{
  browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  for(const width of [1440,390])for(const lang of ['zh','en'])await run(width,lang);
  await browser.close();console.log('PASS: 4 environments, 8 application round trips, 16 theorem cases, 48 direct/refresh pairs.');
})().catch(async e=>{save();console.error(e);await browser?.close();process.exitCode=1;});
