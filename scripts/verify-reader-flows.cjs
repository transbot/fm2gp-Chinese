const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const baseUrl=process.env.READER_BASE_URL || 'http://127.0.0.1:5174';
const out=process.env.READER_OUTPUT_DIR || 'docs/verification/phase1';
let browser;
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const results=[];
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900},locale:'zh-CN'}),page=await context.newPage();
  const go=async path=>{await page.goto(baseUrl+path);await page.locator('h1').first().waitFor();};
  await go('/');assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
  await page.getByRole('button',{name:'English',exact:true}).click();await page.reload();await page.locator('h1').waitFor();assert.equal(await page.locator('html').getAttribute('lang'),'en');
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await go('/book?q=10.8');await page.getByRole('link',{name:/第10.8节/}).click();await page.locator('#section-10-8').waitFor();assert.ok(page.url().includes('#section-10-8'));
  await page.reload();await page.locator('#section-10-8').waitFor();
  await page.locator('#section-10-8').getByRole('link').first().click();await page.locator('h1').waitFor();assert.ok(page.url().includes('/binary-search?from='));
  await page.getByRole('link',{name:'返回来源章节／习题'}).click();await page.locator('#section-10-8').waitFor();
  await page.getByRole('link',{name:'返回章节目录',exact:true}).click();assert.equal(await page.getByRole('searchbox').inputValue(),'10.8');
  await go('/book/10');const deepLink=page.locator('#section-10-8').getByRole('link').first();await deepLink.scrollIntoViewIfNeeded();const savedScroll=await page.evaluate(()=>scrollY);await deepLink.click();await page.locator('h1').waitFor();await page.goBack();await page.locator('#section-10-8').waitFor();await page.waitForTimeout(250);assert.ok(Math.abs((await page.evaluate(()=>scrollY))-savedScroll)<5,'restore chapter scroll position');
  for(const id of [...Array.from({length:14},(_,i)=>String(i+1)),'A','B','C']){await go('/book/'+id);assert.ok((await page.locator('h1').innerText()).startsWith(id+' ·'));}
  await go('/multiply?route=book');
  for(const target of ['/power','/fast-fibonacci','/shortest-path']){await page.getByRole('link',{name:'本路线下一站'}).and(page.locator('a[href^="'+target+'?"]')).click();await page.waitForURL(url=>url.pathname===target);await page.locator('h1').waitFor();assert.equal(new URL(page.url()).pathname,target);}
  await page.goBack();await page.locator('h1').waitFor();assert.equal(new URL(page.url()).pathname,'/fast-fibonacci');await page.goForward();await page.locator('h1').waitFor();
  await go('/power');await page.getByLabel('运算模型',{exact:true}).selectOption('matrix');await page.getByRole('slider',{name:'步骤进度'}).fill(await page.getByRole('slider',{name:'步骤进度'}).getAttribute('max'));
  assert.equal(await page.getByTestId('power-result').innerText(),'[[8,5],[5,3]]');
  await page.getByRole('button',{name:'English',exact:true}).click();assert.equal(await page.getByTestId('power-result').innerText(),'[[8,5],[5,3]]');assert.equal(await page.getByLabel('Exponent',{exact:true}).inputValue(),'5');
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await go('/concepts/iterators');await page.getByRole('button',{name:'示例：从 end 开始'}).click();await page.getByRole('button',{name:'读取当前位置'}).click();assert.match(await page.getByRole('alert').innerText(),/不能解引用/);
  await page.getByLabel('迭代器模型',{exact:true}).selectOption('bidirectional');await page.getByRole('button',{name:'示例：从 end 开始'}).click();await page.getByRole('button',{name:'尝试后退一项'}).click();await page.getByRole('button',{name:'读取当前位置'}).click();assert.match(await page.getByRole('status').innerText(),/30/);
  const summary=page.locator('summary').first();await summary.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('details').first().getAttribute('open'),'');await page.keyboard.press('Enter');assert.equal(await summary.evaluate(e=>document.activeElement===e),true);
  await go('/');const cover=page.locator('img').filter({hasNot:page.locator('a')});assert.ok(await cover.count()>0);
  assert.equal(await page.locator('a img[alt*="数学与泛型编程"]').count(),0);
  await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
  const images=await page.locator('img').evaluateAll(imgs=>imgs.map(i=>({src:i.getAttribute('src'),complete:i.complete,width:i.naturalWidth})));assert.ok(images.every(i=>i.complete&&i.width>0));
  results.push({baseUrl,width,passed:['device language','saved language','chapter search and source return','chapter scroll restoration','anchor refresh','17 chapter routes','book route back/forward','power input and language preservation','end dereference and bidirectional movement','keyboard disclosure focus','home images and empty store link']});
  await context.close();
 }
 fs.writeFileSync(out+'/flow-audit.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
