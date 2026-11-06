// Production-build audit. Set READER_BASE_URL and PROOF_AUDIT_DIR to redirect.
const {chromium,expect}=require('playwright/test');
const fs=require('node:fs'), assert=require('node:assert/strict');
const base=process.env.READER_BASE_URL||'http://127.0.0.1:4187';
const out=process.env.PROOF_AUDIT_DIR||'docs/verification/phase7-proofs/reference';
fs.mkdirSync(out,{recursive:true});
const records=[];let browser;
const save=()=>fs.writeFileSync(out+'/navigation.json',JSON.stringify(records,null,2)+'\n');
const sections={'9':['9-1','9-6','9-7'],A:['A-1','A-2','A-3'],B:['B-1','B-2','B-3']};
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<=2,label+': '+a+' vs '+b);
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 for(const width of [1440,390])for(const lang of ['zh','en']){
  const zh=lang==='zh',query=zh?'归纳':'induction';
  const context=await browser.newContext({viewport:{width,height:1000},locale:zh?'zh-CN':'en-US'});
  const page=await context.newPage();
  const log={width,lang,base,browser:browser.version(),entries:[],searches:[],returns:[],errors:[]};records.push(log);
  page.on('pageerror',e=>log.errors.push(e.message));
  const settle=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))));
  const snap=()=>page.evaluate(()=>({url:location.pathname+location.search+location.hash,key:history.state?.key||'default',y:scrollY,open:[...document.querySelectorAll('details[data-reader-disclosure][open]')].map(d=>d.id)}));
  const anchorY=id=>page.locator('#'+id).evaluate(e=>Math.max(0,Math.min(e.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0),document.documentElement.scrollHeight-innerHeight)));
  const at=async id=>{await page.locator('#'+id).waitFor();await settle();near((await snap()).y,await anchorY(id),id);};
  const copy=async()=>{
   const text=await page.locator('main').evaluate(e=>e.textContent+' '+[...e.querySelectorAll('[aria-label],[title],[alt],[placeholder]')].map(n=>['aria-label','title','alt','placeholder'].map(k=>n.getAttribute(k)||'').join(' ')).join(' '));
   assert.doesNotMatch(text,/页码|第\s*\d+\s*页|\bpages?\s+\d+|#page=/i);
   if(!zh)assert.doesNotMatch(text.replaceAll('中文',''),/[\u3400-\u9fff]/);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  };
  const language=()=>expect(page.locator('html')).toHaveAttribute('lang',zh?'zh-CN':'en');
  // Inventory the actual content, including every nested reason and notation term.
  for(const [chapter,ids] of Object.entries(sections)){
   await page.goto(base+'/book/'+chapter);await page.locator('h1').waitFor();await copy();
   const contentIds=await page.locator('details[data-reader-disclosure]').evaluateAll(ds=>ds.map(d=>d.id));
   const extra=chapter==='9'?['instances-and-proofs','peano-axioms']:chapter==='A'?['implication-table','integer-implication']:[];
   for(const id of [...ids.map(s=>'section-'+s),...contentIds,...extra]){
    // Start without previously opened disclosures to test hidden targets.
    await page.evaluate(()=>sessionStorage.clear());await page.goto('about:blank');
    await page.goto(base+'/book/'+chapter+'#'+id);await at(id);await page.reload();await at(id);await copy();
    log.entries.push({id,chapter,direct:true,refresh:true});
   }
  }
  const search='?'+new URLSearchParams({q:query,source:'proof-reader',tag:'two words'});
  // Use the SAME exact source URL for direct, saved return, POP and reloaded return.
  const source='/book/9'+search+'#assoc-outer';
  for(const demo of ['/power','/concepts/algebra']){
   await page.evaluate(()=>sessionStorage.clear());await page.goto('about:blank');await page.goto(base+source);await at('assoc-outer');
   for(const id of ['addition-associativity','assoc-outer'])await expect(page.locator('#'+id)).toHaveAttribute('open','');
   // Native keyboard actions on two independent groups and a reason.
   for(const [id,key] of [['add-two-three','Enter'],['left-zero','Space'],['zero-successor','Enter']]){
     await page.locator('#'+id+' > summary').focus();await page.keyboard.press(key);await expect(page.locator('#'+id)).toHaveAttribute('open','');
   }
   const before=(await snap()).open;
   await page.getByRole('button',{name:zh?'English':'中文',exact:true}).click();
   assert.deepEqual((await snap()).open,before);
   await expect(page.locator('#assoc-outer')).toContainText(zh?'Reverse (9.2)':'反向使用 (9.2)');
   await page.getByRole('button',{name:zh?'中文':'English',exact:true}).click();
   await language();assert.deepEqual((await snap()).open,before);
   if(demo==='/power'){
    await page.locator('#assoc-outer').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-180));await settle();
    await page.screenshot({path:out+'/proof-'+lang+'-'+width+'.png'});
   }
   const link=page.locator('#addition-associativity a[href^="'+demo+'?"]');
   await link.evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-95));await settle();
   const departure=await snap(),anchor=await anchorY('assoc-outer');
   assert.ok(Math.abs(departure.y-anchor)>100,'departure must distinguish saved scroll from anchor');
   await link.click();await page.waitForURL(u=>u.pathname===demo);await page.locator('h1').waitFor();
   assert.equal(new URL(page.url()).searchParams.get('from'),source);
   assert.deepEqual(await page.evaluate(()=>history.state.usr.readerSource),{key:departure.key,url:source});
   await page.goBack();await page.locator('#assoc-outer').waitFor();await settle();
   const pop=await snap();assert.equal(pop.key,departure.key);near(pop.y,departure.y,'back');assert.deepEqual(pop.open,departure.open);
   await page.goForward();const back=page.getByRole('link',{name:zh?'返回来源章节／习题':'Return to source section / exercise',exact:true});
   await back.scrollIntoViewIfNeeded();await settle();const demoDeparture=await snap();await back.click();
   await page.locator('#assoc-outer').waitFor();await settle();const restored=await snap();
   // Sample again after queued toggles, layout and router effects have settled.
   await page.waitForTimeout(400);const stable=await snap();
   for(const x of [restored,stable]){
     assert.equal(x.url,source);assert.deepEqual(x.open,departure.open);
     near(x.y,departure.y,'explicit return');
   }
   await page.goBack();await page.waitForURL(u=>u.pathname===demo);await settle();near((await snap()).y,demoDeparture.y,'demo POP');
   await page.goForward();await page.locator('#assoc-outer').waitFor();await settle();near((await snap()).y,departure.y,'source POP');
   await link.click();await page.waitForURL(u=>u.pathname===demo);
   await page.evaluate(()=>sessionStorage.clear());await page.reload();await back.click();await at('assoc-outer');
   const hard=await snap();assert.equal(hard.url,source);assert.ok(hard.open.includes('addition-associativity')&&hard.open.includes('assoc-outer'));
   log.returns.push({demo,source,anchorY:anchor,departure,pop,demoDeparture,restored,stable,hard,hardAnchorY:await anchorY('assoc-outer')});save();
  }
  // The introductory example has its own source anchor.
  await page.goto(base+'/book/9'+search+'#instances-and-proofs');await at('instances-and-proofs');
  await page.locator('#instances-and-proofs a[href^="/concepts/algebra?"]').click();
  await page.getByRole('link',{name:zh?'返回来源章节／习题':'Return to source section / exercise',exact:true}).click();
  assert.equal((await snap()).url,'/book/9'+search+'#instances-and-proofs');
  log.crossReferences=[];
  for(const [from,to] of [
   ['/book/9#left-zero','/book/B#induction-sum'],
   ['/book/B#induction-sum','/book/9#addition-associativity'],
   ['/book/A#integer-implication','/book/B#parity-contradiction'],
   ['/book/B#parity-contradiction','/book/A#integer-implication'],
   ['/book/9#induction-subset','/book/A#notation-forall']
  ]){
    const [path,id]=from.split('#'),[targetPath,targetId]=to.split('#');
    await page.goto(base+path+search+'#'+id);await at(id);
    const cross=page.locator('#'+id+' a[href$="#'+targetId+'"]').first();
    // Some paragraphs link from a containing article just after the note.
    const link=await cross.count()?cross:page.locator('a[href$="#'+targetId+'"]').first();
    await link.scrollIntoViewIfNeeded();await settle();const left=await snap();
    await link.click();await at(targetId);const reached=await snap();assert.equal(reached.url,targetPath+search+'#'+targetId);
    await page.goBack();await page.locator('#'+id).waitFor();await settle();
    const returned=await snap();assert.equal(returned.url,left.url);near(returned.y,left.y,'reference POP');
    log.crossReferences.push({from,to,left,reached,returned});
  }
  await page.goto(base+'/book/A#implication-table');await at('implication-table');await language();
  await expect(page.locator('#integer-implication')).toContainText(zh?'没有整数能实现':'No integer realizes');
  await expect(page.locator('#integer-implication')).toContainText(zh?'p ⇒ q 为真，逆命题 q ⇒ p 为假':'p ⇒ q is true, but the converse q ⇒ p is false');
  assert.equal(await page.locator('#implication-table tbody tr').count(),4);await copy();
  await page.locator('#implication-table').screenshot({path:out+'/truth-'+lang+'-'+width+'.png'});
  await page.goto(base+'/book');const input=page.getByRole('searchbox');await input.pressSequentially(query);
  await expect(input).toHaveValue(query);await expect.poll(()=>new URL(page.url()).searchParams.get('q')).toBe(query);await language();await input.scrollIntoViewIfNeeded();
  for(const id of ['9-6','9-7','B-2'])await expect(page.locator('a[href$="#section-'+id+'"]')).toHaveCount(1);
  await page.screenshot({path:out+'/search-'+lang+'-'+width+'.png'});
  for(const [q,id] of [['第9.2节','section-9-2'],['习题9.2','exercise-9-2'],['Section A.3','section-A-3'],['section a.3','section-A-3'],['Section B.2','section-B-2'],['section b.2','section-B-2']]){
   await input.fill(q);await expect(page.locator('main a[href*="#"]')).toHaveCount(1);
   await page.locator('a[href$="#'+id+'"]').click();await at(id);await page.goBack();await expect(input).toHaveValue(q);
   log.searches.push({q,id});
  }
  assert.deepEqual(log.errors,[]);save();await context.close();
 }
 await browser.close();
 console.log('PASS:',records.reduce((n,r)=>n+r.entries.length,0),'direct/refresh pairs;',records.reduce((n,r)=>n+r.returns.length,0),'off-anchor round trips;',records.reduce((n,r)=>n+r.searches.length,0),'explicit searches.');
})().catch(async error=>{console.error(error);save();await browser?.close();process.exitCode=1;});
