const {chromium,expect}=require('playwright/test');const fs=require('fs'),assert=require('assert/strict');
const base=process.env.READER_BASE_URL||'http://127.0.0.1:4183',out=process.env.POLYNOMIAL_RETURN_AUDIT_DIR||'docs/verification/phase5-return-fix';fs.mkdirSync(out,{recursive:true});
// Fixed book/exercise expectations; do not derive return values from the trace generator.
const cases=[
 {id:'book',steps:36,raw:'6',result:'1',counts:[2,5]},
 {id:'exercise1',steps:44,raw:'−4x² + 24x − 35',result:'x² − 6x + 35/4',counts:[3,5]},
 {id:'exercise2',steps:44,raw:'(605/1521)x² + (1210/1521)x + 605/1521',result:'x² + 2x + 1',counts:[3,5]},
 {id:'constants',steps:16,raw:'6',result:'1',counts:[1,1]},
 {id:'zero',steps:5,raw:'0',result:'0',counts:[0,0]},
];let browser;const audit=[];const save=()=>fs.writeFileSync(`${out}/browser-audit.json`,JSON.stringify(audit,null,2));
(async()=>{browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
for(const width of [1440,390])for(const lang of ['zh','en']){
 const context=await browser.newContext({viewport:{width,height:1100},locale:lang==='zh'?'zh-CN':'en-US'}),page=await context.newPage();let current=lang;
 const record={base,width,height:1100,lang,browser:browser.version(),states:[],errors:[]};audit.push(record);page.on('pageerror',e=>record.errors.push(e.message));
 const label=(z,e)=>current==='zh'?z:e,card=page.getByTestId('polynomial-gcd'),slider=card.getByRole('slider');
 const seek=async i=>slider.fill(String(i));const button=(z,e)=>card.getByRole('button',{name:label(z,e),exact:true});
 const check=async(c,monic,action)=>{
  const latest=label('最近返回值','Latest returned value'),raw=label('原始GCD返回值','Raw GCD return'),result=label('首一GCD','Monic GCD');
  await expect(slider).toHaveValue(String(c.steps-(monic?1:2)));await expect(card).toHaveAttribute('data-function',monic?'monic':'gcd');await expect(card).toHaveAttribute('data-event',monic?'monic':'gcdReturn');
  await expect(card.getByTestId(`formula-${latest}`)).toHaveText(`${latest} = ${monic?c.result:c.raw}`);await expect(card.getByTestId(`formula-${raw}`)).toHaveText(`${raw} = ${c.raw}`);
  await expect(card.locator('[aria-current="step"]')).toHaveAttribute('data-line',monic?(c.id==='zero'?'zero':'normalize'):'return');
  if(monic)await expect(card.getByTestId(`formula-${result}`)).toHaveText(`${result} = ${c.result}`);else await expect(card.getByTestId(`formula-${result}`)).toHaveCount(0);
  const counts=(await card.getByTestId('counts').innerText()).match(/\d+/g).map(Number);assert.deepEqual(counts,c.counts);
  record.states.push({case:c.id,action,language:current,index:Number(await slider.inputValue()),fn:await card.getAttribute('data-function'),line:await card.locator('[aria-current="step"]').getAttribute('data-line'),latest:await card.getByTestId(`formula-${latest}`).innerText(),raw:await card.getByTestId(`formula-${raw}`).innerText(),result:monic?await card.getByTestId(`formula-${result}`).innerText():null,counts});
 };
 await page.goto(base+'/polynomial-gcd');await slider.waitFor();await page.reload();await expect(slider).toHaveValue('0');
 for(const c of cases){await page.getByTestId('example-'+c.id).click();assert.equal(Number(await slider.getAttribute('max'))+1,c.steps);
  await seek(c.steps-3);assert.deepEqual((await card.getByTestId('counts').innerText()).match(/\d+/g).map(Number),c.counts);
  await button('下一步','Step Forward').click();await check(c,false,'forward-raw');await button('下一步','Step Forward').click();await check(c,true,'forward-monic');
  await button('上一步','Step Backward').click();await check(c,false,'back');await seek(c.steps-1);await check(c,true,'seek');
  await page.getByRole('button',{name:current==='zh'?'English':'中文',exact:true}).click();current=current==='zh'?'en':'zh';await check(c,true,'language');await button('上一步','Step Backward').click();await check(c,false,'language-back');await button('播放','Play').click();await expect(slider).toHaveValue(String(c.steps-1));await check(c,true,'language-continue');
  await page.getByRole('button',{name:lang==='zh'?'中文':'English',exact:true}).click();current=lang;await check(c,true,'language-restored');
  await button('播放','Play').click();await expect(slider).toHaveValue('0');await button('暂停','Pause').click();await seek(c.steps-2);await check(c,false,'replay-raw');await button('播放','Play').click();await expect(slider).toHaveValue(String(c.steps-1));await check(c,true,'replay-monic');
  await expect(page.locator('html')).toHaveAttribute('lang',lang==='zh'?'zh-CN':'en');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  if(c.id==='book'||c.id==='exercise1'){await card.screenshot({path:`${out}/final-${c.id}-${lang}-${width}.png`});await card.getByTestId('counts').evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-20));await page.screenshot({path:`${out}/final-${c.id}-viewport-${lang}-${width}.png`});}
 }
 assert.deepEqual(record.errors,[]);save();await context.close();
}await browser.close();save();console.log('PASS: fixed adjacent returns, raw/result/latest, code/counts, forward/back/seek/replay/language; five cases in four contexts.');})().catch(async e=>{console.error(e);save();await browser?.close();process.exitCode=1;});
