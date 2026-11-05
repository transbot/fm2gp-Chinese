const {chromium,expect}=require('playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.READER_BASE_URL||'http://127.0.0.1:4177';
const out='docs/verification/phase3-scroll';
const reproduce=process.argv.includes('--reproduce');
const audit=[];
let browser;
(async()=>{
  browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  for(const width of [1440,390])for(const lang of ['zh','en']){
    const context=await browser.newContext({viewport:{width,height:1000},locale:lang==='zh'?'zh-CN':'en-US'});
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    const records=[];
    const query=lang==='zh'?'斐波那契求余':'Fibonacci remainder';
    const settle=async()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const measure=async(label)=>{
      await settle();
      const state=await page.getByRole('searchbox').evaluate((e,label)=>{const r=e.getBoundingClientRect();return {label,scrollY,top:r.top,bottom:r.bottom,focus:document.activeElement===e,activeElement:document.activeElement?.tagName,value:e.value,url:location.pathname+location.search,language:document.documentElement.lang};},label);
      records.push(state);return state;
    };
    const position=async()=>{await page.getByRole('searchbox').evaluate(e=>{window.scrollTo(0,scrollY+e.getBoundingClientRect().top-220);e.focus({preventScroll:true});});await settle();return measure('before');};
    const stable=(before,after,focus=true)=>{
      assert.ok(Math.abs(after.top-before.top)<=2,JSON.stringify({before,after}));
      assert.ok(after.top>=0&&after.bottom<=1000,'search outside viewport');
      if(focus)assert.equal(after.focus,true,'search lost focus');
    };
    const type=async(value,before)=>{let prefix='';for(const character of value){prefix+=character;await page.getByRole('searchbox').pressSequentially(character);await expect.poll(()=>new URL(page.url()).searchParams.get('q')||'').toBe(prefix);const state=await measure('type:'+prefix);if(!reproduce)stable(before,state);}};
    await page.goto(base+'/');await page.getByRole('searchbox').waitFor();await settle();
    const before=await position();await type(query,before);
    assert.equal(await page.getByRole('searchbox').inputValue(),query);assert.equal(await page.locator('html').getAttribute('lang'),lang==='zh'?'zh-CN':'en');
    await page.screenshot({path:`${out}/${reproduce?'before':'after'}-home-${lang}-${width}.png`});
    if(!reproduce){
      const input=page.getByRole('searchbox');
      for(let i=query.length-1;i>=0;i--){await input.press('Backspace');await expect.poll(()=>new URL(page.url()).searchParams.get('q')||'').toBe(query.slice(0,i));stable(before,await measure('delete:'+i));}
      await type(query,before);await input.press('ControlOrMeta+A');await input.press('Backspace');stable(before,await measure('clear'));
      await type(query,before);await page.getByRole('button',{name:lang==='zh'?'重置':'Reset',exact:true}).click();stable(before,await measure('reset'),false);
      await input.focus();await type(query,before);
      const result=page.getByTestId('lesson-results').locator('a[href="/division"]');
      // Let Playwright bring the result into view before recording the actual
      // departure position; clicking must not be mistaken for query scrolling.
      await result.scrollIntoViewIfNeeded();await settle();const departure=await measure('depart-home');
      await result.click();await page.locator('#division-A').waitFor();await settle();assert.equal(await page.evaluate(()=>scrollY),0);
      await page.evaluate(()=>window.scrollTo(0,420));await settle();
      await page.goBack();await input.waitFor();await settle();assert.equal(await input.inputValue(),query);stable(departure,await measure('back-home'),false);
      await page.goForward();await page.locator('#division-A').waitFor();await settle();assert.equal(await page.evaluate(()=>scrollY),420);
      await page.goBack();await input.waitFor();await page.reload();await input.waitFor();await settle();assert.equal(await input.inputValue(),query);assert.equal(await result.count(),1);
      await position();assert.equal(await input.inputValue(),query);assert.equal(await page.locator('html').getAttribute('lang'),lang==='zh'?'zh-CN':'en');await page.screenshot({path:`${out}/after-home-${lang}-${width}.png`});
      await page.goto(base+'/book');await input.waitFor();await settle();const bookBefore=await position();
      await type(query,bookBefore);
      assert.equal(await input.inputValue(),query);assert.equal(await page.locator('html').getAttribute('lang'),lang==='zh'?'zh-CN':'en');await page.screenshot({path:`${out}/after-book-${lang}-${width}.png`});
      await input.press('ControlOrMeta+A');await input.press('Backspace');stable(bookBefore,await measure('clear-book'));
      await type(query,bookBefore);
      const sectionLink=page.locator('a[href*="#section-4-6"]');await sectionLink.scrollIntoViewIfNeeded();await settle();const bookDeparture=await measure('depart-book');
      await sectionLink.click();await page.locator('#section-4-6').waitFor();await settle();
      const anchor=async id=>{
        assert.equal(new URL(page.url()).hash,'#'+id);
        const state=await page.locator('#'+id).evaluate(e=>{
          const rect=e.getBoundingClientRect(),padding=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0;
          const target=rect.top+scrollY,maximum=document.documentElement.scrollHeight-innerHeight;
          return {top:rect.top,expected:target-Math.max(0,Math.min(target-padding,maximum)),scrollY,maximum};
        });
        assert.ok(Math.abs(state.top-state.expected)<=2,JSON.stringify({id,...state}));assert.ok(state.top>=0&&state.top<1000);
        records.push({label:'anchor:'+id,...state});
      };
      await anchor('section-4-6');
      await page.goBack();await input.waitFor();await settle();assert.equal(await input.inputValue(),query);stable(bookDeparture,await measure('back-book'),false);
      await page.goForward();await page.locator('#section-4-6').waitFor();await settle();await anchor('section-4-6');
      const returnLink=()=>page.getByRole('link',{name:lang==='zh'?'返回来源章节／习题':'Return to source section / exercise',exact:true});
      for(const id of ['section-4-6','exercise-4-6']){
        await page.locator(`#${id} a[href^="/division"]`).click();await page.locator('#division-A').waitFor();await settle();
        await page.reload();await page.locator('#division-A').waitFor();await returnLink().click();await page.locator('#'+id).waitFor();await settle();await anchor(id);
      }
      // Same chapter, explicit native hash link is a real anchor navigation.
      await page.locator('nav a[href="#section-4-5"]').click();await settle();await anchor('section-4-5');
    }
    audit.push({base,width,lang,query,records,errors});assert.deepEqual(errors,[]);
    fs.writeFileSync(`${out}/${reproduce?'reproduction':'browser-audit'}.json`,JSON.stringify(audit,null,2));await context.close();
  }
  console.log(reproduce?'Recorded baseline per-character scrolling in four environments.':'PASS: per-character scroll checks in four environments.');await browser.close();
})().catch(async e=>{console.error(e);fs.writeFileSync(`${out}/failure.json`,JSON.stringify(audit,null,2));await browser?.close();process.exitCode=1;});
