const {chromium,expect}=require('playwright/test');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.READER_BASE_URL||'http://127.0.0.1:4187';
const out=process.env.QUERY_AUDIT_DIR||'docs/verification/phase7-query/directory';
fs.mkdirSync(out,{recursive:true});const records=[];let browser;
const save=()=>fs.writeFileSync(out+'/navigation.json',JSON.stringify(records,null,2)+'\n');
const original={source:'proof-reader',tag:'two words'};
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<=2,label+': '+a+' vs '+b);
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 for(const width of [1440,390])for(const lang of ['zh','en']){
  const zh=lang==='zh',q=zh?'归纳':'induction';
  const context=await browser.newContext({viewport:{width,height:1000},locale:zh?'zh-CN':'en-US'});
  const page=await context.newPage(),log={base,lang,width,browser:browser.version(),states:[],links:[],errors:[]};records.push(log);
  page.on('pageerror',e=>log.errors.push(e.message));
  const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const snap=()=>page.evaluate(()=>({url:location.pathname+location.search+location.hash,key:history.state?.key||'default',y:scrollY,open:[...document.querySelectorAll('details[data-reader-disclosure][open]')].map(d=>d.id)}));
  const check=async(label,expected)=>{await settle();const state=await snap();assert.deepEqual(Object.fromEntries(new URL(state.url,base).searchParams),expected);log.states.push({label,...state});save();return state;};
  const inspect=async(link,path,hash,expected)=>{
   const href=await link.getAttribute('href'),url=new URL(href,base);
   assert.equal(url.pathname,path);assert.equal(url.hash,hash);assert.deepEqual(Object.fromEntries(url.searchParams),expected);
   assert.equal(url.search,new URL(page.url()).search);log.links.push({href,path,hash,expected});
  };
  await page.goto(base+'/book?source=proof-reader&tag=two+words');
  await expect(page.locator('html')).toHaveAttribute('lang',zh?'zh-CN':'en');await check('open-directory',original);
  const input=page.getByRole('searchbox');await input.scrollIntoViewIfNeeded();await input.focus();
  const top=await input.evaluate(e=>e.getBoundingClientRect().top);let partial='';
  for(const char of q){partial+=char;await input.pressSequentially(char);await expect.poll(()=>new URL(page.url()).searchParams.get('q')).toBe(partial);await check('type-'+partial,{...original,q:partial});await expect(input).toBeFocused();near(await input.evaluate(e=>e.getBoundingClientRect().top),top,'input viewport');}
  await expect(input).toHaveValue(q);await expect(page.locator('html')).toHaveAttribute('lang',zh?'zh-CN':'en');
  await page.screenshot({path:out+'/directory-'+lang+'-'+width+'.png'});
  const expected={...original,q};
  await inspect(page.locator('article h2 a').filter({hasText:/^9 ·/}),'/book/9','',expected);
  const section=page.locator('a[href$="#section-9-7"]');await inspect(section,'/book/9','#section-9-7',expected);await section.click();
  await page.locator('#section-9-7').waitFor();await check('section-9.7',expected);
  for(const id of ['addition-associativity','assoc-outer']){await page.locator('#'+id+' > summary').click();await expect(page.locator('#'+id)).toHaveAttribute('open','');}
  const link=page.locator('#addition-associativity a[href^="/power?"]');
  await link.evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-95));await settle();
  const left=await check('leave-proof',expected),source=new URL(await link.getAttribute('href'),base).searchParams.get('from');
  assert.equal(source,'/book/9'+new URL(page.url()).search+'#addition-associativity');
  await link.click();await page.waitForURL(u=>u.pathname==='/power');assert.equal(new URL(page.url()).searchParams.get('from'),source);
  log.demo=await snap();
  const back=page.getByRole('link',{name:zh?'返回来源章节／习题':'Return to source section / exercise',exact:true});
  await back.click();await page.locator('#addition-associativity').waitFor();const returned=await check('returned-proof',expected);
  await page.waitForTimeout(400);const stable=await check('stable-proof',expected);
  for(const s of [returned,stable]){near(s.y,left.y,'saved position');assert.deepEqual(s.open,left.open);assert.equal(s.url,source);}
  log.saved={left,returned,stable};
  await page.locator('#assoc-outer').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-180));await settle();
  await expect(page.locator('html')).toHaveAttribute('lang',zh?'zh-CN':'en');await page.screenshot({path:out+'/proof-'+lang+'-'+width+'.png'});
  const directory=page.getByRole('link',{name:zh?'返回章节目录':'Back to chapter directory',exact:true});
  await inspect(directory,'/book','',expected);await directory.click();await expect(input).toHaveValue(q);await check('back-directory',expected);
  await input.fill('');await expect.poll(()=>new URL(page.url()).searchParams.has('q')).toBe(false);await check('clear-only-q',original);
  // Chapter, section and exercise results must have separate exact anchors.
  await input.fill('9.2');await expect(page.locator('a[href$="#exercise-9-2"]')).toBeVisible();
  await inspect(page.locator('article h2 a').first(),'/book/9','',{...original,q:'9.2'});
  await inspect(page.locator('a[href$="#section-9-2"]'),'/book/9','#section-9-2',{...original,q:'9.2'});
  const exercise=page.locator('a[href$="#exercise-9-2"]');await inspect(exercise,'/book/9','#exercise-9-2',{...original,q:'9.2'});await exercise.click();
  await page.locator('#exercise-9-2').waitFor();await check('exercise-9.2',{...original,q:'9.2'});
  const ordinary=page.locator('#exercise-9-2 a[href^="/pi-upper-bound?"]'),ordinaryFrom=new URL(await ordinary.getAttribute('href'),base).searchParams.get('from');
  assert.equal(ordinaryFrom,'/book/9'+new URL(page.url()).search+'#exercise-9-2');
  await ordinary.click();await page.waitForURL(u=>u.pathname==='/pi-upper-bound');assert.equal(new URL(page.url()).searchParams.get('from'),ordinaryFrom);await back.click();
  await page.locator('#exercise-9-2').waitFor();await check('ordinary-demo-return',{...original,q:'9.2'});
  // A hard refresh discards the in-memory scroll map. Parent opens before anchor scroll.
  await page.goto(base+'/power?'+new URLSearchParams({from:source}));await page.evaluate(()=>sessionStorage.clear());await page.reload();await back.click();
  await expect(page.locator('#addition-associativity')).toHaveAttribute('open','');await settle();await page.waitForTimeout(400);
  const hard=await check('hard-refresh-return',expected);
  const anchor=await page.locator('#addition-associativity').evaluate(e=>Math.max(0,Math.min(e.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0),document.documentElement.scrollHeight-innerHeight)));
  near(hard.y,anchor,'hard refresh anchor');log.hard={...hard,anchor};assert.deepEqual(log.errors,[]);save();await context.close();
 }
 await browser.close();console.log('PASS: 4 complete directory reading journeys, 24 exact result/return links, saved and hard-refresh returns.');
})().catch(async e=>{console.error(e);save();await browser?.close();process.exitCode=1;});
