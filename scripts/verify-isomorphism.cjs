const {chromium,expect}=require('playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.READER_BASE_URL||'http://127.0.0.1:4187';
const out=process.env.ISO_AUDIT_DIR||'docs/verification/phase10-isomorphism/browser';
fs.mkdirSync(out,{recursive:true});
const records=[];
const save=()=>fs.writeFileSync(out+'/navigation.json',JSON.stringify(records,null,2)+'\n');
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<=2,label+': '+a+' vs '+b);
const settle=page=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const snapshot=page=>page.evaluate(()=>{
  const map=document.getElementById('isomorphism-map');
  return {
    url:location.pathname+location.search+location.hash,key:history.state?.key||'default',y:scrollY,
    choices:map && Array.from(map.querySelectorAll('select'),s=>s.value),
    image:map && Array.from(map.querySelectorAll('tbody tr:first-child td')).slice(0,4).map(td=>td.textContent),
    paths:map && Array.from(map.querySelectorAll('[aria-live] p'),p=>p.textContent),
    reasons:Object.fromEntries(Array.from(document.querySelectorAll('#klein-nonisomorphism li details,#cyclic-four-categorical li details'),d=>[d.id,d.open])),
    open:Array.from(document.querySelectorAll('details[data-reader-disclosure][open]'),d=>d.id),
  };
});
const anchorY=loc=>loc.evaluate(e=>Math.max(0,Math.min(e.getBoundingClientRect().top+scrollY-
  (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0),document.documentElement.scrollHeight-innerHeight)));
const selectedReasons=['klein-source-sum','klein-identity','cyclic4-reduce'];
function checkMap(s){
  assert.deepEqual(s.choices,['f3','0','3']);assert.deepEqual(s.image,['1','3','4','2']);
  assert.deepEqual(s.paths,['(0 + 3) mod 4 = 3','f₃(3) = 2','f₃(0) = 1, f₃(3) = 2','(1 × 2) mod 5 = 2']);
}
function checkMixed(s){
  checkMap(s);assert.equal(Object.keys(s.reasons).length,11);
  assert.deepEqual(Object.keys(s.reasons).filter(key=>s.reasons[key]),selectedReasons);
}
let browser;
async function run(width,lang){
  const zh=lang==='zh',q=zh?'同构':'isomorphism';
  const ctx=await browser.newContext({viewport:{width,height:1000},locale:zh?'zh-CN':'en-US'});
  const page=await ctx.newPage();
  const log={base,width,lang,browser:browser.version(),errors:[],targets:[],power:[]};records.push(log);
  page.on('pageerror',err=>log.errors.push(err.message));
  const map=page.locator('#isomorphism-map');
  const choices=map.getByRole('combobox');
  const language=()=>expect(page.locator('html')).toHaveAttribute('lang',zh?'zh-CN':'en');
  const shot=async(name,target,region=false)=>{
    await language();await target.evaluate(e=>e.scrollIntoView({block:'start'}));await settle(page);
    const path=out+'/'+name+'-'+lang+'-'+width+'.png';
    if(region)await target.screenshot({path});else await page.screenshot({path});
  };
  const open=async id=>{
    const d=page.locator('#'+id);
    if(!await d.evaluate(e=>e.open)){
      await d.locator('> summary').focus();await page.keyboard.press('Enter');
    }
    await expect(d).toHaveAttribute('open','');
  };
  const geometry=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.goto(base+'/book?source=model-reader&tag=two+words');
  const input=page.getByRole('searchbox');await input.pressSequentially(q);await expect(input).toHaveValue(q);
  await expect.poll(()=>new URL(page.url()).searchParams.get('q')).toBe(q);
  const search=new URL(page.url()).search;
  assert.deepEqual(Object.fromEntries(new URLSearchParams(search)),{source:'model-reader',tag:'two words',q});
  await language();await page.screenshot({path:out+'/search-'+lang+'-'+width+'.png'});
  const section=page.locator('a[href$="#section-6-6"]');assert.equal(await section.getAttribute('href'),'/book/6'+search+'#section-6-6');
  await section.click();await open('even-natural-monoids');
  const monoids=page.locator('#even-natural-monoids');
  await expect(monoids).toContainText(zh?'两个加法幺半群之间的同构':'two additive monoids');
  await expect(monoids).toContainText('f(0)=0');
  await page.locator('#theory-model-isomorphism a[href$="#isomorphism-map"]').click();
  await page.waitForURL(u=>u.hash==='#isomorphism-map' && u.search===search);
  await expect(choices.nth(0)).toHaveValue('f2');
  await open('isomorphism-counterexample');await expect(choices.nth(0)).toHaveValue('f2');
  await page.locator('#isomorphism-counterexample button').click();
  await expect(choices.nth(0)).toHaveValue('b');
  await expect(map).toContainText('3 ≠ 4');await expect(map).toContainText('9/16');
  log.failure=await snapshot(page);assert.deepEqual(log.failure.paths,['(1 + 1) mod 4 = 2','b(2) = 3','b(1) = 2, b(1) = 2','(2 × 2) mod 5 = 4']);
  await shot('failing-map',map);
  // Use the keyboard, including zero. Reading the counterexample afterward must preserve this choice.
  await choices.nth(0).focus();await page.keyboard.press('ArrowUp');await expect(choices.nth(0)).toHaveValue('f3');
  await expect(choices.nth(0)).toBeFocused();
  assert.ok(await choices.nth(0).evaluate(e=>e.matches(':focus-visible') && getComputedStyle(e).outlineStyle!=='none'));
  await choices.nth(1).focus();await page.keyboard.press('Home');await choices.nth(2).focus();await page.keyboard.press('End');
  await expect(map).toContainText('16/16');checkMap(await snapshot(page));
  const marked=map.locator('td').filter({has:page.locator('span[title]')});
  await expect(marked).toHaveCount(2);
  assert.deepEqual(await marked.allTextContents(),['3 ◆','2 ◆']);
  const ops=map.getByRole('region');
  for(const [i,row,col] of [[0,'0','3'],[1,'1','2']]){
    const table=ops.nth(i).getByRole('table');
    await expect(table.locator('caption')).toHaveText(i===0?'ℤ₄ · + (mod 4)':'U(5) · × (mod 5)');
    const data=await table.locator('td:has(span[title])').evaluate(td=>({
      row:td.parentElement.querySelector('th[scope=row]').textContent,
      col:td.closest('table').querySelectorAll('thead th[scope=col]')[td.cellIndex].textContent
    }));
    assert.deepEqual(data,{row,col});
    assert.equal(await ops.nth(i).evaluate(e=>getComputedStyle(e).overflowX),'auto');
  }
  log.success=await snapshot(page);await shot('valid-map',map);await geometry();
  await shot('group-properties',page.locator('#four-group-properties'),true);
  await geometry();
  await page.goto(base+'/book/6'+search+'#isomorphism-counterexample');await page.reload();
  await expect(page.locator('#isomorphism-counterexample')).toHaveAttribute('open','');checkMap(await snapshot(page));
  // Keep a stale proof-entry hash while manually opening the generic reading card.
  await page.goto(base+'/book/6'+search+'#klein-source-sum');
  await open('klein-identity');await open('cyclic-four-categorical');await open('cyclic4-reduce');await open('generic-model-range');
  const generic=page.locator('#generic-model-range');
  await expect(generic).toContainText(zh?'不同构的 ℤ₄ 与 U(8)':'ℤ₄ and U(8) just proved nonisomorphic');
  await expect(generic).toContainText(zh?'模 4 加法与 0，模 8 乘法与 1':'addition modulo four with identity 0, or multiplication modulo eight with identity 1');
  for(const dest of ['/book/10#section-10-3','/book/C#section-C-2']){
    const [p,id]=dest.split('#');await expect(generic.locator('a[href$="#'+id+'"]')).toHaveAttribute('href',p+search+'#'+id);
  }
  log.beforeLanguage=await snapshot(page);checkMixed(log.beforeLanguage);
  await page.getByRole('button',{name:zh?'English':'中文',exact:true}).click();log.afterLanguage=await snapshot(page);checkMixed(log.afterLanguage);
  await expect(page.locator('#klein-identity p')).toContainText(zh?'source identity':'源单位元素');
  await page.getByRole('button',{name:zh?'中文':'English',exact:true}).click();
  const link=generic.locator('a[href^="/power?"]'),source='/book/6'+search+'#generic-model-range';
  assert.equal(new URL(await link.getAttribute('href'),base).searchParams.get('from'),source);
  await link.evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-25));await settle(page);
  const left=await snapshot(page),entry=await anchorY(generic);
  assert.equal(left.url,'/book/6'+search+'#klein-source-sum');checkMixed(left);assert.ok(Math.abs(left.y-entry)>60);
  await link.click();await page.waitForURL(u=>u.pathname==='/power');await page.getByRole('spinbutton').first().waitFor();await settle(page);
  assert.equal(new URL(page.url()).searchParams.get('from'),source);
  const readerSource=await page.evaluate(()=>history.state.usr.readerSource);assert.deepEqual(readerSource,{url:source,key:left.key});
  await page.evaluate(()=>scrollTo(0,210));await settle(page);const mid=await snapshot(page);
  await page.goBack();await page.waitForURL(u=>u.hash==='#klein-source-sum');await map.waitFor();
  await expect.poll(async()=>Math.abs((await snapshot(page)).y-left.y)).toBeLessThanOrEqual(2);
  const pop=await snapshot(page);checkMixed(pop);assert.equal(pop.key,left.key);
  await page.goForward();await page.getByRole('spinbutton').first().waitFor();await settle(page);
  const forward=await snapshot(page);near(forward.y,mid.y,'forward');assert.equal(forward.key,mid.key);
  for(const [model,result] of [['multiply','243'],['add','15']]){
    await page.getByRole('combobox').first().selectOption(model);
    const fields=page.getByRole('spinbutton');await fields.first().fill('3');await fields.last().fill('5');
    const slider=page.getByRole('slider').first();await slider.focus();await page.keyboard.press('End');
    await expect(page.getByTestId('power-result')).toHaveText(result);log.power.push({model,base:3,n:5,result});
  }
  const back=page.getByRole('link',{name:zh?'返回来源章节／习题':'Return to source section / exercise',exact:true});
  await back.click();await page.waitForURL(u=>u.hash==='#generic-model-range');await map.waitFor();await settle(page);
  const returned=await snapshot(page);await page.waitForTimeout(400);const stable=await snapshot(page);
  for(const s of [returned,stable]){assert.equal(s.url,source);checkMixed(s);assert.deepEqual(s.open,left.open);near(s.y,left.y,'explicit return');}
  await link.click();await page.waitForURL(u=>u.pathname==='/power');
  await page.evaluate(()=>sessionStorage.removeItem('fm2gp-reading:generic-model-range'));
  await page.reload();await back.click();await page.waitForURL(u=>u.hash==='#generic-model-range');
  await expect(generic).toHaveAttribute('open','');await page.waitForTimeout(400);
  const hard=await snapshot(page),target=await anchorY(generic);assert.equal(hard.url,source);checkMixed(hard);near(hard.y,target,'hard return');
  log.navigation={source,readerSource,left,entry,mid,pop,forward,returned,stable,hard,target};save();
  await page.getByRole('link',{name:zh?'返回章节目录':'Back to chapter directory',exact:true}).click();
  await expect(input).toHaveValue(q);await input.fill('');await expect.poll(()=>new URL(page.url()).search).toBe('?source=model-reader&tag=two+words');
  for(const id of ['section-6-6','theory-model-isomorphism','even-natural-monoids','section-6-7','isomorphism-map','isomorphism-counterexample','four-group-properties','klein-nonisomorphism','klein-identity','cyclic-four-categorical','cyclic4-reduce','generic-model-range']){
    const url='/book/6'+search+'#'+id;
    for(const action of ['direct','refresh']){
      await page.evaluate(()=>Object.keys(sessionStorage).filter(k=>k.startsWith('fm2gp-reading:')).forEach(k=>sessionStorage.removeItem(k)));
      if(action==='direct'){await page.goto('about:blank');await page.goto(base+url);}else await page.reload();
      const item=page.locator('#'+id);await item.waitFor();await settle(page);const s=await snapshot(page);checkMap(s);assert.equal(s.url,url);
      near(s.y,await anchorY(item),action+' '+id);
      assert.ok(await item.evaluate(e=>{for(let d=e.closest('details');d;d=d.parentElement?.closest('details'))if(!d.open)return false;return true;}));
      await geometry();
      const copy=await item.evaluate(e=>e.textContent+' '+Array.from(e.querySelectorAll('[aria-label],[title],[href]'),n=>['aria-label','title','href'].map(k=>n.getAttribute(k)||'').join(' ')).join(' '));
      assert.doesNotMatch(copy,/第\s*\d+\s*页|页码|\bpages?\s+\d+|#page=/i);if(!zh)assert.doesNotMatch(copy,/[\u3400-\u9fff]/);
      log.targets.push({id,action,y:s.y,target:await anchorY(item),open:s.open});
    }
  }
  await goToDirectory();
  log.searches=[];
  for(const [term,id] of [['第6.6节','section-6-6'],['Section 6.7','section-6-7'],['习题6.6','exercise-6-6']]){
    await input.fill(term);
    await expect(page.locator('main a[href*="#"]')).toHaveCount(1);
    await page.locator('a[href$="#'+id+'"]').click();await page.waitForURL(u=>u.hash==='#'+id);
    log.searches.push({term,id});await page.goBack();await expect(input).toHaveValue(term);
  }
  assert.deepEqual(log.errors,[]);save();await ctx.close();

  async function goToDirectory(){
    await page.getByRole('link',{name:zh?'返回章节目录':'Back to chapter directory',exact:true}).click();
    await input.waitFor();
  }
}
(async()=>{
  browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  for(const width of [1440,390])for(const lang of ['zh','en'])await run(width,lang);
  await browser.close();console.log('PASS: four contexts, four saved and refreshed returns, eight power results, 48 direct/refresh pairs.');
})().catch(async error=>{save();console.error(error);await browser?.close();process.exitCode=1;});
