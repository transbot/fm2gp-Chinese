const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.READER_BASE_URL||'http://127.0.0.1:4179';
const out=process.env.HISTORY_AUDIT_DIR||'docs/verification/phase3-history';
const reproduce=process.argv.includes('--reproduce');
fs.mkdirSync(out,{recursive:true});
const audit=[];let browser;
(async()=>{
  browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  for(const width of [1440,390])for(const lang of ['zh','en']){
    const context=await browser.newContext({viewport:{width,height:1000},locale:lang==='zh'?'zh-CN':'en-US'});
    let page=await context.newPage();const records=[],errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const result={base,width,lang,records,errors};audit.push(result);
    const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(r)))));
    const record=async(label)=>{
      await settle();const state=await page.evaluate(label=>({label,url:location.pathname+location.search+location.hash,historyState:history.state,key:history.state?.key||'default',scrollY,language:document.documentElement.lang,targets:Object.fromEntries(['section-4-5','section-4-6','exercise-4-6'].map(id=>{const e=document.getElementById(id);if(!e)return [id,null];const r=e.getBoundingClientRect();const padding=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0;const top=r.top+scrollY;return [id,{top:r.top,bottom:r.bottom,expectedTop:top-Math.max(0,Math.min(top-padding,document.documentElement.scrollHeight-innerHeight))}];}))}),label);
      records.push(state);return state;
    };
    const atAnchor=(s,id)=>{if(!reproduce){assert.ok(s.url.endsWith('#'+id));assert.ok(Math.abs(s.targets[id].top-s.targets[id].expectedTop)<=2,JSON.stringify(s));}};
    const restored=(s,departure)=>{s.expectedDeparture=departure.label;s.expectedScrollY=departure.scrollY;s.restored=Math.abs(s.scrollY-departure.scrollY)<=2;if(!reproduce){assert.equal(s.url,departure.url);assert.equal(s.key,departure.key);assert.equal(s.restored,true,JSON.stringify({departure,s}));}};
    const shot=async(name)=>{assert.equal(await page.locator('html').getAttribute('lang'),lang==='zh'?'zh-CN':'en');await page.screenshot({path:`${out}/${reproduce?'before':'after'}-${name}-${lang}-${width}.png`});};
    const clickSection=async(id)=>{const link=page.locator(`nav a[href$="#${id}"]`);await link.scrollIntoViewIfNeeded();const departure=await record('depart-for-'+id);await link.click();const arrival=await record('arrive-'+id);atAnchor(arrival,id);return {departure,arrival};};
    await page.goto(base+'/book/4');await page.locator('#section-4-5').waitFor();await record('direct-book');
    const first=await clickSection('section-4-5');const second=await clickSection('section-4-6');
    result.explicitKeys=[first.departure.key,first.arrival.key,second.arrival.key];
    result.uniqueKeys=new Set(result.explicitKeys).size===3;if(!reproduce)assert.equal(result.uniqueKeys,true);
    await shot('consecutive');const leave46=await record('leave-46-for-back');await page.goBack();restored(await record('back-to-45'),second.departure);
    const leave45=await record('leave-45-for-forward');await page.goForward();restored(await record('forward-to-46'),leave46);
    await page.evaluate(()=>window.scrollBy(0,123));const manual46=await record('manual-46-departure');
    await page.goBack();restored(await record('back-before-manual-45'),leave45);
    await page.evaluate(()=>window.scrollBy(0,87));const manual45=await record('manual-45-departure');
    await page.goForward();restored(await record('restore-manual-46'),manual46);await shot('restored-46');
    await page.goBack();restored(await record('restore-manual-45'),manual45);await shot('restored-45');
    if(!reproduce){
      const query=lang==='zh'?'斐波那契求余':'Fibonacci remainder';
      await page.goto(base+'/book/4?q='+encodeURIComponent(query));await page.locator('#section-4-5').waitFor();
      const q45=await clickSection('section-4-5'),q46=await clickSection('section-4-6');assert.notEqual(q45.arrival.key,q46.arrival.key);
      for(const s of [q45.arrival,q46.arrival])assert.equal(new URL(s.url,base).searchParams.get('q'),query);
      // A direct hash visit must start in a fresh document, not page.goto to the
      // exact URL already open (which the browser can treat as same-document).
      await page.close();page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base+'/book/4?q='+encodeURIComponent(query)+'#section-4-6');await page.locator('#section-4-6').waitFor();atAnchor(await record('direct-hash'),'section-4-6');
      await page.reload();await page.locator('#section-4-6').waitFor();atAnchor(await record('refresh-hash'),'section-4-6');
      for(const id of ['section-4-6','exercise-4-6']){
        await page.locator(`#${id} a[href^="/division"]`).click();await page.locator('#division-A').waitFor();await record('division-from-'+id);
        await page.getByRole('link',{name:lang==='zh'?'返回来源章节／习题':'Return to source section / exercise',exact:true}).click();await page.locator('#'+id).waitFor();const returned=await record('source-return-'+id);atAnchor(returned,id);assert.equal(new URL(returned.url,base).searchParams.get('q'),query);
      }
    }
    assert.deepEqual(errors,[]);await context.close();fs.writeFileSync(`${out}/${reproduce?'reproduction':'browser-audit'}.json`,JSON.stringify(audit,null,2));
  }
  console.log(reproduce?'Recorded native-anchor baseline history in four fresh contexts.':'PASS: independent chapter history keys, departure-position restoration, query/hash/source navigation in four contexts.');await browser.close();
})().catch(async e=>{console.error(e);fs.writeFileSync(`${out}/failure.json`,JSON.stringify(audit,null,2));await browser?.close();process.exitCode=1;});
