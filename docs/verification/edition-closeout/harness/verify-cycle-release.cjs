// Production preview, real BrowserRouter and one clean session per language/viewport.
const {chromium,expect}=require('playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.READER_BASE_URL||'http://127.0.0.1:4191';
const out=process.env.CYCLE_AUDIT_DIR||'docs/verification/phase11-cycles/browser';
const records=[];
fs.mkdirSync(out,{recursive:true});
function save(){fs.writeFileSync(out+'/navigation.json',JSON.stringify(records,null,2)+'\n');}
const near=(a,b)=>assert.ok(Math.abs(a-b)<=2,`${a} vs ${b}`);
const settle=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
const nav=page=>page.evaluate(()=>({url:location.pathname+location.search+location.hash,key:history.state?.key??'default',y:scrollY}));
const anchorY=target=>target.evaluate(e=>Math.max(0,Math.min(e.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0),document.documentElement.scrollHeight-innerHeight)));
async function run(browser,width,lang){
  const zh=lang==='zh',q=zh?'排列':'permutation';
  const ctx=await browser.newContext({viewport:{width,height:960},locale:zh?'zh-CN':'en-US'});
  const page=await ctx.newPage();
  const r={lang,width,browser:browser.version(),base,errors:[]};records.push(r);
  page.on('pageerror',e=>r.errors.push(e.message));
  const language=()=>expect(page.locator('html')).toHaveAttribute('lang',zh?'zh-CN':'en');
  const shot=async(id,target)=>{
    await language();await target.evaluate(e=>e.scrollIntoView({block:'start'}));await settle(page);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    const copy=await page.evaluate(()=>[document.body.innerText,...Array.from(document.querySelectorAll('[aria-label],[title]'),e=>e.getAttribute('aria-label')||e.title)].join('\n'));
    assert.doesNotMatch(copy,/第\s*\d+\s*页|\b(?:page|pp?\.)\s*\d+\b/i);
    await page.screenshot({path:out+'/'+id+'-'+lang+'-'+width+'.png'});
  };
  const frame=page.locator('#cycle-frame'),slider=page.getByRole('slider');
  async function state(){
    return frame.evaluate(e=>({event:e.dataset.event,
      rows:Array.from(e.querySelectorAll('tr'),row=>Array.from(row.querySelectorAll('td'),c=>Number(c.textContent))),
      locals:e.querySelector('[data-locals]')?.textContent,counts:e.querySelector('[data-counts]').textContent.match(/\d+/g).map(Number),
      line:e.querySelector('[data-line][aria-current]')?.dataset.line,step:Number(document.querySelector('input[type=range]').value)}));
  }
  const keySelect=async(step)=>{await slider.focus();await slider.press('Home');for(let i=0;i<step;i++)await slider.press('ArrowRight');};
  const button=(name)=>page.getByRole('button',{name,exact:true});
  const apply=button(zh?'应用输入':'Apply input');
  const play=()=>button(zh?'播放':'Play').click();
  const switchLanguage=()=>button(zh?'English':'中文').click();
  const backToSource=()=>page.getByRole('link',{name:zh?'返回来源章节／习题':'Return to source section / exercise',exact:true}).click();

  await page.goto(base+'/book?source=permutation-reader&tag=two+words');
  const search=page.getByRole('searchbox');
  await search.pressSequentially(q);await expect(search).toHaveValue(q);
  await expect.poll(()=>new URL(page.url()).searchParams.get('q')).toBe(q);
  const query=new URL(page.url()).search;
  await page.locator('a[href$="#section-11-1"]').click();
  const four=page.locator('#permutation-destinations');
  await four.locator('summary').click();await expect(four).toContainText('[c,a,d,b]');
  const composition=page.locator('#permutation-composition');
  await composition.locator('summary').focus();await page.keyboard.press('Enter');
  for(const line of ['[a,b,c] → [a,c,b] → [c,a,b]','[a,b,c] → [b,a,c] → [b,c,a]',
    'p² · [a,b,c] → [b,a,c] → [a,b,c]','q² · [a,b,c] → [a,c,b] → [a,b,c]'])
    await expect(composition).toContainText(line);
  await shot('composition',composition);
  await composition.getByRole('link').click();await expect(page).toHaveURL(/#exercise-11-3$/);
  await page.goBack();await expect(composition).toHaveAttribute('open','');
  await page.locator('#section-11-1 a[href$="#section-11-4"]').click();
  const guide=page.locator('#cycle-from-guide'),source=page.locator('#cycle-source-map');
  await guide.locator('> summary').click();await source.locator('> summary').click();
  const link=source.getByRole('link');
  const sourceUrl='/book/11'+query+'#cycle-source-map';
  assert.equal(new URL(await link.getAttribute('href'),base).searchParams.get('from'),sourceUrl);
  await link.evaluate(e=>e.scrollIntoView({block:'start'}));await settle(page);
  r.departure=await nav(page);assert.ok(Math.abs(r.departure.y-await anchorY(source))>4);
  await link.click();await frame.waitFor();
  const historySource=await page.evaluate(()=>history.state.usr.readerSource);
  assert.deepEqual(historySource,{url:sourceUrl,key:r.departure.key});r.historySource=historySource;
  await button(zh?'六元素书例':'Six-element example').click();
  const moves=[],scope=[];let previous;
  for(let i=0;i<=Number(await slider.getAttribute('max'));i++){
    const s=await state();
    if(s.event==='close') {assert.match(s.locals,/j=—/);assert.equal(s.line,'close');scope.push(s);}
    if(s.event==='returned') {assert.equal(s.locals,undefined);assert.equal(s.line,'returned');assert.equal(previous.event,'close');assert.deepEqual(s.counts,previous.counts);scope.push(s);}
    previous=s;
    if(['save','write','close'].includes(s.event))moves.push(s);
    if(i<Number(await slider.getAttribute('max')))await slider.press('ArrowRight');
  }
  assert.deepEqual(moves.map(m=>m.rows[4].join('')),['012345','412345','412325','411325','401325','401325','401525','401523']);
  assert.deepEqual(moves.map(m=>m.counts),[[1,0,1],[1,1,2],[1,2,3],[1,3,4],[1,4,5],[2,4,6],[2,5,7],[2,6,8]]);
  assert.ok(moves.every(s=>s.event===s.line));r.transfers=moves;r.scope=scope;assert.equal(scope.length,4);
  r.success=await state();assert.equal(r.success.event,'verify');
  await shot('success',frame);
  await play();await expect(slider).toHaveValue('0');
  await button(zh?'暂停':'Pause').click();
  await slider.scrollIntoViewIfNeeded();
  const box=await slider.boundingBox();
  await page.mouse.move(box.x+8,box.y+box.height/2);await page.mouse.down();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2,{steps:5});await page.mouse.up();
  r.drag=await state();assert.ok(r.drag.step>0 && r.drag.step<r.success.step);
  const middle=moves[2];await keySelect(middle.step);assert.deepEqual(await state(),middle);
  await shot('intermediate',frame);
  const input=page.getByRole('textbox').first();
  await input.fill('1,,2');await play();await apply.click();
  const paused=await state();await expect(page.getByRole('alert')).toBeVisible();
  await page.waitForTimeout(1200);assert.deepEqual(await state(),paused);
  await switchLanguage();await expect(input).toHaveValue('1,,2');
  await expect(page.getByRole('alert')).toContainText(zh?'decimal safe integers':'十进制安全整数');
  await button(zh?'中文':'English').click();await language();
  await play();await expect.poll(()=>slider.inputValue()).not.toBe(String(paused.step));
  await button(zh?'暂停':'Pause').click();r.resume={paused,continued:await state()};
  assert.deepEqual(r.resume.continued.rows[1],[1,2,4,5,0,3]);
  await input.fill('2,1,2,1,2,1');await apply.click();await expect(slider).toHaveValue('0');
  await page.waitForTimeout(1100);await expect(slider).toHaveValue('0');
  await slider.press('End');
  r.duplicates=await state();assert.deepEqual(r.duplicates.rows[3],[2,2,1,1,2,1]);
  assert.deepEqual(r.duplicates.rows[4],[4,0,1,5,2,3]);assert.deepEqual(r.duplicates.counts,[2,6,8]);
  await shot('duplicates',frame);
  await button(zh?'重置':'Reset').click();await expect(slider).toHaveValue('0');
  assert.deepEqual((await state()).rows[3],[2,1,2,1,2,1]);
  await slider.press('End');await play();await expect(slider).toHaveValue('0');
  await button(zh?'暂停':'Pause').click();r.replayAfterReset=await state();
  assert.deepEqual(r.replayAfterReset.rows[3],[2,1,2,1,2,1]);
  await backToSource();await expect(source).toHaveAttribute('open','');await settle(page);
  r.returnInitial=await nav(page);await page.waitForTimeout(400);r.returnStable=await nav(page);
  assert.equal(r.returnStable.url,sourceUrl);near(r.returnInitial.y,r.departure.y);near(r.returnStable.y,r.departure.y);
  await page.goBack();await frame.waitFor();r.demoPop=await nav(page);
  await page.goForward();await source.waitFor();await settle(page);near((await nav(page)).y,r.returnStable.y);
  await link.click();await frame.waitFor();
  await keySelect(middle.step);const beforeReload=await state();
  await page.reload();await frame.waitFor();r.restored=await state();assert.deepEqual(r.restored,beforeReload);
  await expect(button(zh?'播放':'Play')).toBeVisible();
  await page.waitForTimeout(1200);r.restoredAfterInterval=await state();
  assert.deepEqual(r.restoredAfterInterval,beforeReload);
  await backToSource();await expect(source).toHaveAttribute('open','');await expect(guide).toHaveAttribute('open','');
  await page.waitForTimeout(400);r.afterRefresh=await nav(page);r.anchor=await anchorY(source);
  assert.equal(r.afterRefresh.url,sourceUrl);near(r.afterRefresh.y,r.anchor);
  await page.getByRole('link',{name:zh?'返回章节目录':'Back to chapter directory',exact:true}).click();
  await expect(search).toHaveValue(q);await search.fill('');
  await expect.poll(()=>new URL(page.url()).searchParams.has('q')).toBe(false);
  assert.deepEqual(Object.fromEntries(new URL(page.url()).searchParams),{source:'permutation-reader',tag:'two words'});
  for(const [term,id] of [[zh?'第11.4节':'Section 11.4','section-11-4'],[zh?'习题11.4':'Exercise 11.4','exercise-11-4']]){
    await search.fill(term);await expect(search).toHaveValue(term);
    await expect(page.locator('article li a')).toHaveCount(1);
    await expect(page.locator('article li a')).toHaveAttribute('href',new RegExp('#'+id+'$'));
  }
  // First arrival at the nested anchor, without previously open disclosures.
  await page.evaluate(()=>{sessionStorage.removeItem('fm2gp-reading:cycle-from-guide');sessionStorage.removeItem('fm2gp-reading:cycle-source-map');});
  await page.goto(base+sourceUrl);await expect(source).toHaveAttribute('open','');await expect(guide).toHaveAttribute('open','');
  await settle(page);r.direct=await nav(page);near(r.direct.y,await anchorY(source));
  assert.deepEqual(r.errors,[]);save();await ctx.close();
}
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
  try {for(const width of [1440,390])for(const lang of ['zh','en'])await run(browser,width,lang);}
  finally {save();await browser.close();}
  console.log('PASS: four language/viewport contexts, eight transfers each, sixteen viewport screenshots.');
})().catch(e=>{console.error(e);process.exitCode=1;});
