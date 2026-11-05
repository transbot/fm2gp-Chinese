const {chromium,expect}=require('playwright/test');const fs=require('fs'),assert=require('assert/strict');
const base=process.env.READER_BASE_URL||'http://127.0.0.1:4181',out=process.env.RETURN_AUDIT_DIR||'docs/verification/phase4-return-fix',reproduce=process.argv.includes('--reproduce');fs.mkdirSync(out,{recursive:true});
// Fixed source-scope expectations, independent of reverseTrace.
const cases=[{n:2,c:2,start:0,length:2,step:19,total:21,counts:[0,2,2,4,1,2]},{n:9,c:4,start:0,length:4,step:31,total:80,counts:[0,4,4,8,2,4]},{n:9,c:4,start:5,length:4,step:59,total:80,counts:[0,8,8,16,2,4]},{n:9,c:9,start:0,length:9,step:40,total:42,counts:[0,9,9,18,1,9]}];
let browser;const audit=[];
(async()=>{browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
for(const width of [1440,390])for(const lang of ['zh','en']){
 const context=await browser.newContext({viewport:{width,height:1000},locale:lang==='zh'?'zh-CN':'en-US'}),page=await context.newPage(),record={base,width,lang,reproduce,states:[],errors:[]};audit.push(record);page.on('pageerror',e=>record.errors.push(e.message));let current=lang;
 const card=page.getByTestId('reverse-adaptive'),slider=card.getByRole('slider'),text=(z,e)=>current==='zh'?z:e;
 const seek=async step=>{await slider.fill(String(step-1));};
 const snapshot=async()=>({step:Number(await slider.inputValue())+1,fn:await card.getAttribute('data-function'),line:await card.locator('[aria-current="step"]').getAttribute('data-line'),helper:await card.getByTestId('helper').count()?await card.getByTestId('helper').locator('p').nth(1).innerText():null,helperTitle:await card.getByTestId('helper').count()?await card.getByTestId('helper').locator('p').first().innerText():null,returned:await card.getByTestId('return-position').innerText(),frames:await card.getByTestId('frames').innerText(),counts:(await card.getByTestId('counts').innerText()).match(/\d+/g).map(Number)});
 const check=async(c,offset)=>{const s=await snapshot();record.states.push({case:c,offset,language:current,...s});assert.equal(s.step,c.step+offset);assert.deepEqual(s.counts,c.counts);
  assert.equal(s.fn,offset===-1?'reverse_copy':offset===0?'reverse_n_with_buffer':'adaptive');assert.equal(s.line,offset===-1?'return':offset===0?'write':'fits');
  assert.equal(s.helper,offset===1?null:offset===-1||reproduce?`f=0 · l=0 · result=${c.start+c.length}`:`buffer_end=${c.length}`);
  if(s.helperTitle)assert.ok(s.helperTitle.endsWith(s.fn));assert.ok(s.frames.includes(`f=${c.start} · n=${c.length}`));
  assert.match(s.returned,current==='zh'?/原序列/:/Sequence/);assert.ok(s.returned.includes(': '+(c.start+c.length)));return s;
 };
 await page.goto(base+'/reverse');await page.locator('#reverse-sequence').waitFor();
 for(const c of cases){
  await page.locator('#reverse-sequence').fill(Array.from({length:c.n},(_,i)=>i).join(','));await page.locator('#reverse-capacity').fill(String(c.c));await page.getByRole('button',{name:text('应用输入','Apply input'),exact:true}).click();assert.equal(Number(await slider.getAttribute('max'))+1,c.total);
  await seek(c.step-1);await check(c,-1);await card.getByRole('button',{name:text('下一步','Step Forward'),exact:true}).click();await check(c,0);await card.getByRole('button',{name:text('下一步','Step Forward'),exact:true}).click();await check(c,1);
  if(!reproduce){
   for(const offset of [0,-1]){await card.getByRole('button',{name:text('上一步','Step Backward'),exact:true}).click();await check(c,offset);}
   await seek(c.step);await check(c,0);
   await page.getByRole('button',{name:current==='zh'?'English':'中文',exact:true}).click();current=current==='zh'?'en':'zh';await check(c,0);
   await card.getByRole('button',{name:text('上一步','Step Backward'),exact:true}).click();await check(c,-1);await card.getByRole('button',{name:text('播放','Play'),exact:true}).click();await expect(slider).toHaveValue(String(c.step-1));await card.getByRole('button',{name:text('暂停','Pause'),exact:true}).click();await check(c,0);
   await page.getByRole('button',{name:current==='zh'?'English':'中文',exact:true}).click();current=lang;await check(c,0);
   await seek(c.total);await card.getByRole('button',{name:text('播放','Play'),exact:true}).click();await expect(slider).toHaveValue('0');await card.getByRole('button',{name:text('暂停','Pause'),exact:true}).click();await seek(c.step);await check(c,0);
  }
  if(c.start===5){await seek(c.step);await card.getByTestId('frames').evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-100));assert.equal(await page.locator('html').getAttribute('lang'),lang==='zh'?'zh-CN':'en');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await page.screenshot({path:`${out}/${reproduce?'before':'after'}-right-return-${lang}-${width}.png`});}
 }
 assert.deepEqual(record.errors,[]);await context.close();fs.writeFileSync(`${out}/${reproduce?'reproduction':'browser-audit'}.json`,JSON.stringify(audit,null,2));
}
await browser.close();console.log(reproduce?'REPRODUCED: wrong helper scope at fixed return steps in four contexts.':'PASS: fixed scope, counters, rewind/forward/seek/replay/language in four contexts.');
})().catch(async e=>{console.error(e);fs.writeFileSync(`${out}/failure.json`,JSON.stringify(audit,null,2));await browser?.close();process.exitCode=1;});
