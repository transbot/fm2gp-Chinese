const {chromium,expect}=require('playwright/test'),fs=require('node:fs'),assert=require('node:assert/strict');
const out='docs/verification/edition-closeout/cover';fs.mkdirSync(out,{recursive:true});
const records=[];let browser;
(async()=>{browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
for(const configured of [false,true])for(const width of [1440,390])for(const lang of ['zh','en']){
 const c=await browser.newContext({locale:lang==='zh'?'zh-CN':'en-US',viewport:{width,height:1000}});const p=await c.newPage();await p.goto(`http://127.0.0.1:${configured?4194:4193}/`);await p.locator('h1').waitFor();assert.equal(await p.evaluate(()=>document.documentElement.lang),lang==='zh'?'zh-CN':'en');
 const footer=p.locator('#book-showcase');await footer.scrollIntoViewIfNeeded();await expect(footer.locator('figure').first()).toHaveAttribute('data-edition',lang);
 const cover=footer.locator('figure[data-edition=zh] img');await cover.scrollIntoViewIfNeeded();await expect(cover).toBeVisible();
 const size=await cover.evaluate(i=>({naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,width:i.getBoundingClientRect().width,height:i.getBoundingClientRect().height,left:i.getBoundingClientRect().left,right:i.getBoundingClientRect().right,cursor:getComputedStyle(i).cursor}));assert.ok(size.naturalWidth>0);assert.ok(Math.abs(size.width/size.height-size.naturalWidth/size.naturalHeight)<0.001);assert.ok(size.left>=0&&size.right<=width);
 await expect(footer.locator('img[src="/images/mobile-web-qr.png"]')).toHaveCount(1);await expect(footer.getByRole('link',{name:'https://fm2gp-chinese.bookzhou.com/'})).toHaveAttribute('href','https://fm2gp-chinese.bookzhou.com/');
 const anchor=footer.locator('figure[data-edition=zh] a');
 if(!configured){await expect(anchor).toHaveCount(0);assert.notEqual(size.cursor,'pointer');assert.doesNotMatch(await footer.innerText(),/购买|购书|buy|purchase|bookstore/i);}
 else {await expect(anchor).toHaveAttribute('href','https://example.com/edition-store-fixture');await anchor.focus();await expect(anchor).toBeFocused();assert.equal(await anchor.evaluate(a=>getComputedStyle(a).outlineStyle),'solid');await p.route('https://example.com/edition-store-fixture',r=>r.fulfill({body:'Isolated store keyboard fixture',contentType:'text/html'}));await p.keyboard.press('Enter');await p.waitForURL('https://example.com/edition-store-fixture');await p.goBack();await cover.waitFor();}
 await footer.screenshot({path:`${out}/${configured?'configured':'empty'}-${lang}-${width}.png`});
 // Saved user choice overrides the browser preference after a real reload.
 await p.getByRole('button',{name:lang==='zh'?'English':'中文',exact:true}).click();await p.reload();await p.locator('h1').waitFor();assert.equal(await p.evaluate(()=>document.documentElement.lang),lang==='zh'?'en':'zh-CN');
 records.push({configured,width,lang,size,qr:'/images/mobile-web-qr.png',keyboardLink:configured?'Enter opened isolated fixture':'no anchor',languageInitialization:'browser preference; saved choice after reload'});await c.close();
}
for(const test of [{languages:['fr-FR','zh-CN'],expected:'zh-CN'},{languages:['fr-FR'],expected:'en'}]){const c=await browser.newContext();await c.addInitScript(l=>Object.defineProperty(navigator,'languages',{get:()=>l}),test.languages);const p=await c.newPage();await p.goto('http://127.0.0.1:4193/');await p.locator('h1').waitFor();assert.equal(await p.evaluate(()=>document.documentElement.lang),test.expected);records.push(test);await c.close();}
fs.writeFileSync(out+'/audit.json',JSON.stringify(records,null,2)+'\n');console.log('PASS 8 cover/configuration checks + 2 language fallbacks');await browser.close();
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
