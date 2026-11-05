// Production-build browser acceptance. No development-server assumptions.
const {chromium,expect}=require('playwright/test');
const fs=require('node:fs'),assert=require('node:assert/strict'),Module=require('node:module'),ts=require('typescript');
const base=process.env.READER_BASE_URL||'http://127.0.0.1:4180';
const out=process.env.REVERSE_AUDIT_DIR||'docs/verification/phase4-reverse';
fs.mkdirSync(out,{recursive:true});
const fixture=new Module('reverse-fixture');fixture._compile(ts.transpileModule(fs.readFileSync('src/lib/algorithms/reverseTrace.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,'reverse-fixture.cjs');
const {reverseMethods:methods,reverseTrace}=fixture.exports;
const input=Array.from({length:9},(_,i)=>i),traces=Object.fromEntries(methods.map(m=>[m,reverseTrace(input,4,m)]));
const fixed=[[0,12,0,36,4,0],[1,12,0,36,4,0],[2,8,8,40,3,2],[3,8,8,40,3,2],[4,4,8,28,2,4],[8,4,8,28,2,4],[9,0,9,18,1,9]];
const countRecords=fixed.map(([capacity,swaps,writes,transfers,maxDepth,bufferPeak])=>{const t=reverseTrace(input,capacity,'adaptive'),counts=t.at(-1).counts;assert.deepEqual(counts,{swaps,bufferWrites:writes,sourceWrites:writes,transfers,maxDepth,bufferPeak});return {capacity,counts,steps:t.length};});
fs.writeFileSync(`${out}/key-traces.json`,JSON.stringify({fixedCounts:countRecords,defaultTraces:traces},null,2));
let browser;const audit=[];
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 for(const width of [1440,390])for(const lang of ['zh','en']){
  console.log(`Checking ${lang}/${width}`);
  const context=await browser.newContext({viewport:{width,height:1000},locale:lang==='zh'?'zh-CN':'en-US'}),page=await context.newPage();
  const record={base,width,lang,checks:[],errors:[],snapshots:[]};audit.push(record);page.on('pageerror',e=>record.errors.push(e.message));let current=lang;
  const text=(z,e)=>current==='zh'?z:e;
  const card=m=>page.getByTestId('reverse-'+m);
  const button=(m,z,e)=>card(m).getByRole('button',{name:text(z,e),exact:true});
  const seek=async(m,i)=>card(m).getByRole('slider').fill(String(i));
  const apply=async(raw,capacity)=>{await page.locator('#reverse-sequence').fill(raw);await page.locator('#reverse-capacity').fill(String(capacity));await page.getByRole('button',{name:text('应用输入','Apply input'),exact:true}).click();};
  const values=async m=>card(m).getByTestId('sequence').locator('[data-origin]').evaluateAll(es=>es.map(e=>({value:Number(e.getAttribute('data-value')),origin:Number(e.getAttribute('data-origin'))})));
  const snapshot=async m=>({step:await card(m).getByRole('slider').inputValue(),values:await values(m),counts:(await card(m).getByTestId('counts').innerText()).match(/\d+/g).map(Number),line:await card(m).locator('[aria-current="step"]').count()?await card(m).locator('[aria-current="step"]').getAttribute('data-line'):null,event:await card(m).getAttribute('data-event'),fn:await card(m).getAttribute('data-function')});
  const auditLanguage=async()=>{
   assert.equal(await page.locator('html').getAttribute('lang'),current==='zh'?'zh-CN':'en');
   const body=await page.locator('body').innerText(),labels=await page.locator('[aria-label],[title]').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||'')+' '+(e.getAttribute('title')||'')).join('\n'));
   assert.doesNotMatch(body+'\n'+labels,/第\s*\d+\s*页|页码|\b(?:PDF\s+)?pages?\s+\d+/i);
   if(current==='en')assert.doesNotMatch(body.replaceAll('中文',''),/[\u4e00-\u9fff]/);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'horizontal page overflow');
  };
  const shot=async(name,loc)=>{await auditLanguage();if(loc)await loc.screenshot({path:`${out}/${name}-${lang}-${width}.png`});else await page.screenshot({path:`${out}/${name}-${lang}-${width}.png`});};
  const toggle=async()=>{await page.getByRole('button',{name:current==='zh'?'English':'中文',exact:true}).click();current=current==='zh'?'en':'zh';await auditLanguage();};
  assert.equal((await page.goto(base+'/reverse')).status(),200);await page.locator('#reverse-sequence').waitFor();await page.reload();await page.locator('#reverse-sequence').waitFor();await auditLanguage();record.checks.push('direct route and refresh');
  for(const m of methods){
   for(let i=0;i<traces[m].length;i++){
    await seek(m,i);const actual=await snapshot(m),s=traces[m][i];
    assert.deepEqual(actual.values,s.sequence);assert.deepEqual(actual.counts,Object.values(s.counts));assert.equal(actual.line,s.event==='init'?null:s.line);assert.equal(actual.event,s.event);assert.equal(actual.fn,s.fn);
    if(m==='adaptive'){
     const buffer=await card(m).getByRole('region',{name:text('共享缓冲区位置','Shared buffer positions'),exact:true}).locator('[data-position]').evaluateAll(es=>es.slice(0,-1).map(e=>e.hasAttribute('data-origin')?{value:Number(e.getAttribute('data-value')),origin:Number(e.getAttribute('data-origin'))}:null));
     assert.deepEqual(buffer,s.buffer);assert.match(await card(m).getByTestId('buffer-state').innerText(),new RegExp('\\[0, '+s.valid+'\\)'));
    }
    if(s.helper)for(const [key,value] of Object.entries(s.helper))assert.ok((await card(m).getByTestId('helper').innerText()).includes(`${key}=${value}`));
    if(s.frames.length){const frames=await card(m).getByTestId('frames').innerText();for(const f of s.frames)assert.ok(frames.includes(`f=${f.f} · n=${f.n} · h=${f.h??'—'} · m=${f.m??'—'} · l=${f.l??'—'}`));}
   }
   const end=await snapshot(m);await button(m,'上一步','Step Backward').click();await button(m,'下一步','Step Forward').click();assert.deepEqual(await snapshot(m),end);
   await button(m,'播放','Play').click();await expect(card(m).getByRole('slider')).toHaveValue('0');await button(m,'暂停','Pause').click();await button(m,'重置','Reset').click();
  }
  record.checks.push('every default snapshot: values, origin tags, frames, counts, event and code; seek/back/forward/replay/reset');
  // Independent timers and new-input replacement during playback.
  for(const m of methods){await card(m).getByRole('combobox').selectOption('3');await button(m,'播放','Play').click();}
  await page.locator('#reverse-sequence').fill('2,1,2,1,2');await expect(page.getByTestId('pending-input')).toBeVisible();assert.match(await card('adaptive').getByTestId('applied-input').innerText(),/n = 9/);
  await page.getByRole('button',{name:text('应用输入','Apply input'),exact:true}).click();await page.waitForTimeout(1100);
  for(const m of methods){assert.equal((await snapshot(m)).step,'0');await seek(m,await card(m).getByRole('slider').getAttribute('max'));assert.deepEqual(await values(m),[2,1,2,1,2].map((value,origin)=>({value,origin})).reverse());await button(m,'重置','Reset').click();}
  await button('adaptive','播放','Play').click();await expect(card('adaptive').getByRole('slider')).not.toHaveValue('0');assert.equal((await snapshot('recursive')).step,'0');
  await page.getByRole('button',{name:'9',exact:true}).click();await page.waitForTimeout(1100);for(const m of methods)assert.equal((await snapshot(m)).step,'0');
  record.checks.push('apply during playback; independent timers; capacity shortcut resets all players');
  for(const raw of ['1.5','1x','1,,2','1e-400','9007199254740992','']){await apply(raw,4);assert.equal(await page.locator('#reverse-sequence').inputValue(),raw);await expect(page.getByRole('alert')).toBeVisible();assert.equal(await page.locator('#reverse-sequence').getAttribute('aria-describedby'),'reverse-error-sequence');}
  await page.getByRole('button',{name:text('空序列','Empty sequence'),exact:true}).click();for(const m of methods){await seek(m,await card(m).getByRole('slider').getAttribute('max'));assert.deepEqual((await snapshot(m)).values,[]);assert.deepEqual((await snapshot(m)).counts,[0,0,0,0,1,0]);}
  await page.getByRole('button',{name:text('单元素','Single element'),exact:true}).click();await seek('adaptive',await card('adaptive').getByRole('slider').getAttribute('max'));assert.deepEqual((await snapshot('adaptive')).counts,[0,0,0,0,1,0]);
  for(const capacity of [0,1,2,3,4,8,9,10]){await apply(input.join(','),capacity);for(const m of methods){const t=reverseTrace(input,capacity,m);await seek(m,t.length-1);assert.deepEqual((await snapshot(m)).counts,Object.values(t.at(-1).counts));assert.deepEqual(await values(m),input.map((value,origin)=>({value,origin})).reverse());}}
  await apply(Array.from({length:50},(_,i)=>i-25).join(','),50);for(const m of methods){await seek(m,await card(m).getByRole('slider').getAttribute('max'));assert.equal((await values(m)).length,50);}await auditLanguage();
  record.checks.push('strict invalid tokens; empty/singleton base cases; capacity table; 50-element boundary');
  await apply(input.join(','),4);for(const m of methods)await seek(m,traces[m].findIndex(s=>s.event==='swap'));
  const before=await Promise.all(methods.map(snapshot));await toggle();assert.deepEqual(await Promise.all(methods.map(snapshot)),before);
  for(const m of methods)assert.match(await card(m).getByTestId('explanation').innerText(),current==='zh'?/已完成一次交换/:/One swap completed/);
  await button('recursive','上一步','Step Backward').click();await button('recursive','播放','Play').click();await expect(card('recursive').getByTestId('explanation')).toContainText(current==='zh'?'已完成一次交换':'One swap completed');await button('recursive','暂停','Pause').click();await toggle();
  // Keyboard slider arrow and action-button activation use native browser events.
  const slider=card('recursive').getByRole('slider');await slider.focus();const pos=Number(await slider.inputValue());await page.keyboard.press('ArrowRight');assert.equal(Number(await slider.inputValue()),pos+1);
  await button('recursive','重置','Reset').focus();await page.keyboard.press('Enter');assert.equal(await slider.inputValue(),'0');
  const region=card('adaptive').getByRole('region',{name:text('共享缓冲区位置','Shared buffer positions'),exact:true});await region.focus();assert.equal(await region.evaluate(e=>e===document.activeElement),true);
  record.checks.push('language switch keeps snapshots; translated rewind/continue; keyboard slider/reset/local scrolling');
  await seek('recursive',traces.recursive.findIndex(s=>s.event==='swapCall'&&s.frames.length===1));
  await seek('adaptive',traces.adaptive.findIndex(s=>s.event==='copyReturn'));
  record.snapshots.push({rootBeforeSwap:await snapshot('recursive'),bufferEnd:await snapshot('adaptive')});
  const bufferRegion=card('adaptive').getByRole('region',{name:text('共享缓冲区位置','Shared buffer positions'),exact:true});
  await bufferRegion.focus();const oldScroll=await bufferRegion.evaluate(e=>e.scrollLeft);await page.keyboard.press('ArrowRight');await expect.poll(()=>bufferRegion.evaluate(e=>e.scrollLeft)).toBeGreaterThan(oldScroll);
  await bufferRegion.evaluate(e=>{e.scrollLeft=e.scrollWidth;});
  const endBox=await bufferRegion.locator('[data-position="4"]').boundingBox(),regionBox=await bufferRegion.boundingBox();assert.ok(endBox.x>=regionBox.x&&endBox.x+endBox.width<=regionBox.x+regionBox.width+1);
  record.checks.push('keyboard scroll moves the buffer strip; buffer_end is visible and distinct from readable elements');

  await card('recursive').scrollIntoViewIfNeeded();await shot('recursive-viewport');await shot('recursive-player',card('recursive'));
  await card('adaptive').scrollIntoViewIfNeeded();await shot('buffer-viewport');await shot('buffer-player',card('adaptive'));
  await page.locator('h1').scrollIntoViewIfNeeded();await shot('overview');
  await page.locator('summary').click();await auditLanguage();record.checks.push('notes and accessibility labels: bilingual/no page numbers; no viewport overflow');
  // Chapter and exercise source links, explicit search distinction, history.
  for(const id of ['section-11-7','exercise-11-13']){
   await page.goto(base+'/book/11#'+id);await page.locator('#'+id+' a[href^="/reverse"]').click();await page.locator('#reverse-sequence').waitFor();
   await page.getByRole('link',{name:text('返回来源章节／习题','Return to source section / exercise'),exact:true}).click();await expect(page).toHaveURL(new RegExp('/book/11#'+id+'$'));
   await page.goBack();await page.locator('#reverse-sequence').waitFor();await page.goForward();await expect(page).toHaveURL(new RegExp('/book/11#'+id+'$'));
  }
  for(const query of [text('第11.7节','Section 11.7'),text('习题11.7','Exercise 11.7')]){await page.goto(base+'/book?q='+encodeURIComponent(query));await expect(page.locator('input[type=search]')).toHaveValue(query);const links=await page.locator('main li a').getAttribute('href');assert.ok(links.endsWith(query.includes('习题')||query.startsWith('Exercise')?'#exercise-11-7':'#section-11-7'));}
  for(const path of ['/','/book']){const query=text('自适应反转','adaptive reverse');await page.goto(base+path);const search=page.locator('input[type=search]');await search.pressSequentially(query,{delay:40});await expect(search).toHaveValue(query);await auditLanguage();await search.scrollIntoViewIfNeeded();await shot(path==='/'?'home-search':'chapter-search');}
  record.checks.push('section/exercise source return, back/forward, explicit 11.7 distinction, both bilingual searches');
  assert.deepEqual(record.errors,[]);await context.close();fs.writeFileSync(`${out}/browser-audit.json`,JSON.stringify(audit,null,2));
 }
 await browser.close();console.log('PASS: reverse production preview, four language/viewport contexts.');
})().catch(async e=>{console.error(e);fs.writeFileSync(`${out}/browser-failure.json`,JSON.stringify(audit,null,2));await browser?.close();process.exitCode=1;});
