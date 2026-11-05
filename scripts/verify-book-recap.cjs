const {chromium,expect}=require('playwright/test');const fs=require('fs'),assert=require('assert/strict');
const base=process.env.READER_BASE_URL||'http://127.0.0.1:4184',out=process.env.RECAP_AUDIT_DIR||'docs/verification/phase6-recap';fs.mkdirSync(out,{recursive:true});
const topics=[{id:'review-power',demos:['/multiply','/concepts/algebra','/power','/concepts/matrices','/shortest-path']},{id:'review-gcd',demos:['/division','/gcm','/polynomial-gcd','/horner']},{id:'review-iterators',demos:['/concepts/iterators','/reverse']}];
let browser;const records=[];const save=()=>fs.writeFileSync(`${out}/browser-audit.json`,JSON.stringify(records,null,2));
(async()=>{browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
for(const width of [1440,390])for(const lang of ['zh','en']){
 const context=await browser.newContext({viewport:{width,height:1000},locale:lang==='zh'?'zh-CN':'en-US'}),page=await context.newPage();let current=lang;
 const audit={base,width,lang,browser:browser.version(),topics:[],roundTrips:[],history:[],errors:[]};records.push(audit);page.on('pageerror',e=>audit.errors.push(e.message));
 const label=(z,e)=>current==='zh'?z:e;const settle=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const state=()=>page.evaluate(()=>({url:location.pathname+location.search+location.hash,key:history.state?.key||'default',scrollY,open:[...document.querySelectorAll('details[open]')].map(e=>e.getAttribute('data-testid'))}));
 const anchor=async id=>{await settle();const position=await page.locator('#'+id).evaluate(e=>{const r=e.getBoundingClientRect(),pad=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0,target=r.top+scrollY,max=document.documentElement.scrollHeight-innerHeight;return {top:r.top,expected:target-Math.max(0,Math.min(target-pad,max))};});assert.ok(Math.abs(position.top-position.expected)<=2,JSON.stringify(position));};
 const query=lang==='zh'?'全书总结':'Conclusions',search='?'+new URLSearchParams({q:query,source:'review-reader'});
 for(const topic of topics){const source='/book/14'+search+'#'+topic.id;
  await page.goto(base+source);await page.locator('#'+topic.id).waitFor();await anchor(topic.id);await page.reload();await page.locator('#'+topic.id).waitFor();await anchor(topic.id);
  await expect(page.getByRole('heading',{level:1})).toHaveText(label('14 · 全书总结','14 · Conclusions'));
  const section=page.locator('#'+topic.id),details=section.locator('details');assert.equal(await details.count(),2);
  // Real keyboard activation of native disclosure controls.
  for(let i=0;i<2;i++){const d=details.nth(i),summary=d.locator('summary');if(await d.getAttribute('open')!==null)await summary.click();await summary.focus();await page.keyboard.press(i?'Space':'Enter');await expect(d).toHaveAttribute('open','');}
  const beforeLanguage=await state();await page.getByRole('button',{name:current==='zh'?'English':'中文',exact:true}).click();current=current==='zh'?'en':'zh';assert.deepEqual((await state()).open,beforeLanguage.open);for(const d of await details.all())await expect(d).toHaveAttribute('open','');
  await page.getByRole('button',{name:lang==='zh'?'中文':'English',exact:true}).click();current=lang;assert.deepEqual((await state()).open,beforeLanguage.open);
  await section.screenshot({path:`${out}/${topic.id}-${lang}-${width}.png`});await page.evaluate(()=>scrollTo(0,0));if(topic.id==='review-power')await page.screenshot({path:`${out}/overview-${lang}-${width}.png`});
  const copy=await page.locator('body').innerText();if(lang==='en')assert.doesNotMatch(copy.replaceAll('中文',''),/[\u3400-\u9fff]/);assert.doesNotMatch(copy,/页码|页序|第\s*\d+\s*页|PDF\s*pages?\s*\d|#page=/i);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  // Validate every demo link in each theme using actual routes, including source return and history.
  for(const path of topic.demos){const link=page.getByTestId(topic.id+'-demos').locator(`a[href^="${path}?"]`);await link.scrollIntoViewIfNeeded();await page.evaluate(()=>scrollBy(0,20));await settle();const departure=await state();
   await link.click();await page.locator('h1').first().waitFor();await settle();assert.equal(new URL(page.url()).pathname,path);assert.equal(new URL(page.url()).searchParams.get('from'),source);
   const sourceState=await page.evaluate(()=>history.state.usr.readerSource);assert.deepEqual(sourceState,{key:departure.key,url:source});
   // Browser POP back to the original entry, then forward to the demonstration.
   await page.goBack();await page.locator('#'+topic.id).waitFor();await settle();let restored=await state();assert.equal(restored.url,source);assert.ok(Math.abs(restored.scrollY-departure.scrollY)<=2);assert.deepEqual(restored.open,departure.open);
   await page.goForward();await page.locator('h1').first().waitFor();await settle();
   const back=page.getByRole('link',{name:label('返回来源章节／习题','Return to source section / exercise'),exact:true});await back.scrollIntoViewIfNeeded();await settle();const demoDeparture=await state();await back.click();await page.locator('#'+topic.id).waitFor();await settle();restored=await state();assert.equal(restored.url,source);assert.ok(Math.abs(restored.scrollY-departure.scrollY)<=2,JSON.stringify({departure,restored}));assert.deepEqual(restored.open,departure.open);
   await page.goBack();await page.locator('h1').first().waitFor();await settle();assert.equal(new URL(page.url()).pathname,path);assert.ok(Math.abs((await state()).scrollY-demoDeparture.scrollY)<=2);
   await page.goForward();await page.locator('#'+topic.id).waitFor();await settle();assert.ok(Math.abs((await state()).scrollY-departure.scrollY)<=2);
   audit.roundTrips.push({theme:topic.id,path,departure,sourceState,demoDeparture,restored});save();
  }
  // A reloaded demo has no in-memory position map; its from URL still locates the correct theme.
  await page.getByTestId(topic.id+'-demos').locator('a').first().click();await page.locator('h1').first().waitFor();await page.reload();await page.getByRole('link',{name:label('返回来源章节／习题','Return to source section / exercise'),exact:true}).click();await page.locator('#'+topic.id).waitFor();await anchor(topic.id);assert.equal((await state()).url,source);
  audit.topics.push({id:topic.id,source,directRefresh:true,keyboard:true,languagePreservesOpen:true,reloadedDemoSourceFallback:true});save();
 }
 // Explicit theme navigation gives independent history keys and retains the full query.
 await page.goto(base+'/book/14'+search);await page.locator('#review-power').waitFor();await settle();
 const keys=[];
 for(const topic of topics){const link=page.getByRole('navigation',{name:label('全书回顾主题','Book review topics'),exact:true}).locator(`a[href$="#${topic.id}"]`);await link.scrollIntoViewIfNeeded();await settle();const departure=await state();await link.click();await anchor(topic.id);const arrived=await state();keys.push(arrived.key);assert.equal(new URL(page.url()).search,search);await page.evaluate(()=>scrollBy(0,90));await settle();const reading=await state();await page.goBack();await page.locator('#review-power').waitFor();await settle();assert.ok(Math.abs((await state()).scrollY-departure.scrollY)<=2);await page.goForward();await settle();assert.ok(Math.abs((await state()).scrollY-reading.scrollY)<=2);audit.history.push({theme:topic.id,departure,arrived,reading});}
 assert.equal(new Set(keys).size,3);
 await page.goto(base+'/book?q='+encodeURIComponent(query));await expect(page.getByRole('searchbox')).toHaveValue(query);await expect(page.locator('html')).toHaveAttribute('lang',lang==='zh'?'zh-CN':'en');await page.screenshot({path:`${out}/directory-${lang}-${width}.png`});await expect(page.locator('a[href^="/book/14?"]')).toHaveCount(1);
 assert.deepEqual(audit.errors,[]);save();await context.close();
}await browser.close();save();console.log('PASS: three themes, 44 demo round trips, direct/refresh/hash/query/history, keyboard disclosures and language preservation in four contexts.');})().catch(async e=>{console.error(e);save();await browser?.close();process.exitCode=1;});
