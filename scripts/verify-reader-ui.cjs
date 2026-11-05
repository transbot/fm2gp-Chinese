// Run with NODE_PATH pointing to a Playwright installation; no runtime dependency.
const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const baseUrl = process.env.READER_BASE_URL || 'http://127.0.0.1:5174';
const path = require('node:path');
const out=path.resolve(process.env.READER_OUTPUT_DIR || 'docs/verification/phase1');fs.mkdirSync(out,{recursive:true});
const catalog=fs.readFileSync('src/data/algorithmCatalog.ts','utf8');
const routes=['/','/book','/book/6','/horner',...new Set([...catalog.matchAll(/path: '(\/[^']+)'/g)].map(m=>m[1])),'/concepts/algebra','/concepts/matrices','/concepts/iterators'];
let activeBrowser;
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 activeBrowser=browser;
 const results=[];
 for(const width of [1440,390])for(const lang of ['zh','en']){
  const context=await browser.newContext({viewport:{width,height:1000},locale:lang==='zh'?'zh-CN':'en-US'});
  await context.addInitScript(lang=>localStorage.setItem('fm2gp-language',lang),lang);
  const page=await context.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of routes){
   errors=[];await page.goto(baseUrl+route);await page.locator('h1').first().waitFor();await page.waitForTimeout(100);
   const initial=await page.evaluate(()=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,title:document.querySelector('h1')?.textContent,buttons:[...document.querySelectorAll('button')].map(e=>e.innerText||e.getAttribute('aria-label')).filter(Boolean),text:document.body.innerText}));
   const next=page.getByRole('button',{name:lang==='zh'?/^(下一步|开始计算|初始化|开始查找)$/:/^(Step Forward|Start Calculation|Initialize|Start Search)$/}).first();
   if(await next.count()&&await next.isEnabled())await next.click();
   const postText=await page.locator('body').innerText();
   // Include collapsed developer notes, tooltips, placeholders and accessible names.
   const allCopy=await page.evaluate(()=>[...document.querySelectorAll('body *')].flatMap(e=>[...e.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent)).join('\n')+'\n'+[...document.querySelectorAll('[aria-label],[title],[placeholder],[alt]')].map(e=>['aria-label','title','placeholder','alt'].map(a=>e.getAttribute(a)||'').join(' ')).join('\n'));
   assert.doesNotMatch(allCopy,/页码|页序|第\s*\d+\s*页|\d+\s*页|\b(?:PDF\s+)?pages?\s*\d+|\d+\s+pages?\b|#page=/i,route+' '+lang);

   results.push({baseUrl,route,lang,width,pageNumberCopy:'absent (including collapsed content and accessible attributes)',overflow:initial.scrollWidth>initial.width+1,errors:[...errors],title:initial.title,buttons:initial.buttons,unexpectedChinese:lang==='en'?postText.split('\n').filter(s=>/[\u3400-\u9fff]/.test(s)&&s!=='中文'):[],text:initial.text});
   if(['/book/6','/concepts/algebra','/concepts/matrices','/concepts/iterators','/shortest-path'].includes(route)){
    if(route==='/concepts/matrices'){await page.getByLabel(lang==='zh'?'示例':'Example',{exact:true}).selectOption('chain');await page.getByRole('slider',{name:lang==='zh'?'步骤进度':'Step progress'}).first().fill('2');}
    if(route==='/concepts/iterators'){await page.getByRole('button',{name:lang==='zh'?'示例：从 end 开始':'Example: start at end'}).click();await page.getByRole('button',{name:lang==='zh'?'读取当前位置':'Read current position'}).click();}
    await page.screenshot({path:path.join(out,`${route.split('/').filter(Boolean).join('-')}-${lang}-${width}.png`),fullPage:true});
   }
  }
  await context.close();console.log(`Checked ${routes.length} routes: ${lang}, ${width}px`);
 }
 fs.writeFileSync(path.join(out,'browser-audit.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify({checks:results.length,overflow:results.filter(r=>r.overflow).map(({route,lang,width})=>({route,lang,width})),errors:results.filter(r=>r.errors.length),mixed:results.filter(r=>r.unexpectedChinese.length).map(({route,unexpectedChinese})=>({route,unexpectedChinese}))},null,2));
 assert.ok(results.every(r=>!r.overflow&&!r.errors.length&&!r.unexpectedChinese.length),'browser sweep findings');
 await browser.close();
})().catch(async e=>{console.error(e);await activeBrowser?.close();process.exitCode=1;});
