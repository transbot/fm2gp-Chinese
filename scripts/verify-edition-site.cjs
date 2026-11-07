const {chromium,expect}=require('playwright/test');
const fs=require('node:fs'),assert=require('node:assert/strict');
const inventory=JSON.parse(fs.readFileSync('docs/verification/edition-closeout/entry-inventory.json'));
const base=process.env.READER_BASE_URL||'http://127.0.0.1:4193',out='docs/verification/edition-closeout/site';
fs.mkdirSync(out,{recursive:true});
const noPages=/页码|页序|第\s*\d+\s*页|\d+\s*页|\b(?:PDF\s+)?pages?\s*\d+|\d+\s+pages?\b|#page=/i;
const records=[];let browser;
const save=()=>fs.writeFileSync(out+'/audit.json',JSON.stringify(records,null,2)+'\n');
const button=(p,re)=>p.getByRole('button',{name:re}).first();
async function click(p,re){await button(p,re).click();}
async function pageCheck(p){const r=await p.evaluate(()=>({lang:document.documentElement.lang,text:document.body.innerText,width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,copy:[...document.querySelectorAll('body *')].flatMap(e=>[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent)).join('\n')+'\n'+[...document.querySelectorAll('[aria-label],[title],[placeholder],[alt]')].map(e=>['aria-label','title','placeholder','alt'].map(a=>e.getAttribute(a)||'').join(' ')).join('\n')}));assert.ok(r.scrollWidth<=r.width+1,`overflow ${r.scrollWidth}/${r.width}`);assert.doesNotMatch(r.copy,noPages);if(r.lang==='en'&&inventory.demos.some(d=>d.path===new URL(p.url()).pathname))assert.doesNotMatch(r.text.split('\n').filter(s=>s!=='中文').join('\n'),/[\u3400-\u9fff]/,'Unexpected Chinese demo copy');}
async function valid(p,route){
 const fields=p.locator('input:not([type=range]),textarea');
 if(['/sieve','/palindromic-primes'].includes(route)){await fields.first().fill('30');await click(p,/^(Generate|生成)$/);await expect(p.getByRole('alert')).toHaveCount(0);return 'generate primes through 30';}
 if(route==='/prime-checker'){await fields.first().fill('17');await click(p,/^(Check|检查|检验)$/);return 'check 17';}
 if(route==='/gcm'){await fields.nth(0).fill('45');await fields.nth(1).fill('6');await click(p,/^(Calculate|计算)$/);return 'GCD 45,6';}
 if(route==='/binary-search'){await p.getByRole('slider').fill('3');await click(p,/Auto-Sort|快速排序/);await p.waitForTimeout(1000);await fields.first().fill('0');await click(p,/Start Search|开始查找/);await p.waitForTimeout(1000);return 'three sorted values, key 0';}
 if(route==='/rsa'){await click(p,/Generate Key Pair|生成密钥对/);await p.waitForTimeout(400);return 'generate key pair';}
 if(route==='/gcd-comparison'){await click(p,/^(Calculate|计算)$/);await p.waitForTimeout(400);return 'run comparison';}
 if(['/extended-gcd','/miller-rabin'].includes(route)){await click(p,/^(Initialize|初始化)$/);const next=button(p,/^(Next Step|下一步|Step Forward)$/);if(await next.count())await next.click();return 'initialize and step';}
 if(route==='/shortest-path'){await click(p,/Next Power|下一次幂|下一个幂|下一幂/);return 'advance matrix power';}
 if(route==='/concepts/algebra'){await click(p,/Change parentheses|改变括号/);return 'compare grouping';}
 if(route==='/concepts/iterators'){await click(p,/^advance\(3\)$/);return 'advance to end';}
 if(route==='/prime-counting'){const canvas=p.locator('canvas');await expect(canvas).toBeVisible();assert.ok(await canvas.evaluate(c=>c.width>0&&c.height>0));await canvas.hover();return 'rendered chart; no input/player by design';}
 if(route==='/pi-upper-bound'){await p.getByRole('slider').fill('12');await expect(p.locator('body')).toContainText('12');return 'select 12 sides';}
 const slider=p.getByRole('slider',{name:/Step progress|步骤进度|^Steps$|^步$/}).first();
 if(await slider.count()){await expect(slider).toBeEnabled();const max=Number(await slider.getAttribute('max'));assert.ok(max>0);await slider.fill(String(Math.min(2,max)));assert.equal(await slider.inputValue(),String(Math.min(2,max)));await slider.fill(String(max));await slider.fill('0');return 'seek intermediate, end, then start';}
 throw Error('No valid-operation recipe '+route);
}
async function invalid(p,route){
 const noInput=['/rotate','/pi-upper-bound','/prime-counting','/rsa','/gcd-comparison','/shortest-path'];
 if(noInput.includes(route))return 'N/A: fixed data or constrained selector, no free invalid input';
 if(route==='/concepts/iterators'){await click(p,/Example: start at end|示例：从 end 开始/);await click(p,/Read current position|读取当前位置/);await expect(p.getByRole('alert')).toBeVisible();return await p.getByRole('alert').innerText();}
 const fields=p.locator('input:not([type=range]),textarea');
 if(route==='/power'){await fields.nth(1).fill('-1');await fields.nth(1).blur();}
 else if(route==='/graph-traversal'){await click(p,/^Add Node$|^添加节点$/);}
 else {await fields.first().fill(['/stein-gcd','/fibonacci','/fast-fibonacci'].includes(route)?'-1':'');await fields.first().blur();
 const apply=button(p,/^Apply input$|^应用输入$/);
 if(await apply.count())await apply.click();
 else if(['/sieve','/palindromic-primes'].includes(route))await click(p,/^Generate$|^生成$/);
 else if(route==='/prime-checker')await click(p,/^Check$|^检查$|^检验$/);
 else if(route==='/gcm')await click(p,/^Calculate$|^计算$/);
 else if(route==='/binary-search')await click(p,/Start Search|开始查找/);
 else if(['/extended-gcd','/miller-rabin'].includes(route))await click(p,/^Initialize$|^初始化$/);
 else if(!['/concepts/algebra','/concepts/matrices'].includes(route)){const reset=button(p,/^Reset$|^重置$/);if(await reset.count())await reset.click();}
 }
 await expect(p.getByRole('alert').first()).toBeVisible();return await p.getByRole('alert').first().innerText();
}
(async()=>{browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
for(const width of [1440,390])for(const lang of ['zh','en']){
 const context=await browser.newContext({viewport:{width,height:1000},locale:lang==='zh'?'zh-CN':'en-US'});const p=await context.newPage();p.setDefaultTimeout(6000);
 for(const route of inventory.routes){const row={route,width,lang,passed:false};const errors=[];const onerror=e=>errors.push(e.message);p.on('pageerror',onerror);
 try{await p.goto(base+route);await p.locator('h1').first().waitFor();await pageCheck(p);row.initialTitle=await p.locator('h1').first().innerText();await expect(button(p,lang==='zh'?/^English$/:/^中文$/)).toBeVisible();
 if(inventory.demos.some(d=>d.path===route)){
  row.operation=await valid(p,route);await pageCheck(p);
  const values=await p.locator('input,select,textarea').evaluateAll(es=>es.map(e=>e.value));
  await click(p,lang==='zh'?/^English$/:/^中文$/);await pageCheck(p);await expect(button(p,lang==='zh'?/^中文$/:/^English$/)).toBeVisible();
  assert.deepEqual(await p.locator('input,select,textarea').evaluateAll(es=>es.map(e=>e.value)),values,'Language switch preserves inputs and playback');
  await click(p,lang==='zh'?/^中文$/:/^English$/);
  // A clean mount separates invalid-input checks from any asynchronous animation.
  await p.reload();await p.locator('h1').first().waitFor();row.error=await invalid(p,route);await pageCheck(p);
  if(!row.error.startsWith('N/A')){await click(p,lang==='zh'?/^English$/:/^中文$/);row.translatedError=await p.getByRole('alert').first().innerText();assert.notEqual(row.translatedError,row.error);await click(p,lang==='zh'?/^中文$/:/^English$/);}
 }else{
  await p.reload();await p.locator('h1').first().waitFor();const chapter=inventory.chapters.find(c=>c.path===route);if(chapter){for(const e of [...chapter.sections,...chapter.exercises])assert.equal(await p.locator('[id="'+e.anchor+'"]').count(),1);row.anchors=chapter.sections.length+chapter.exercises.length;const detail=p.locator('details').first();if(await detail.count()){await detail.locator(':scope > summary').focus();await p.keyboard.press('Enter');assert.equal(await detail.getAttribute('open'),'');await click(p,lang==='zh'?/^English$/:/^中文$/);assert.equal(await detail.getAttribute('open'),'');await click(p,lang==='zh'?/^中文$/:/^English$/);}}
 }
 assert.deepEqual(errors,[]);row.passed=true;
 }catch(e){row.errorMessage=e.message;await p.screenshot({path:out+'/'+route.replaceAll('/','_')+'-'+lang+'-'+width+'-failure.png'}).catch(()=>{});}
 p.off('pageerror',onerror);records.push(row);save();
 }
 await context.close();console.log(lang,width,records.filter(r=>r.lang===lang&&r.width===width&&!r.passed).map(r=>[r.route,r.errorMessage?.slice(0,120)]));
}
await browser.close();assert.ok(records.every(r=>r.passed),`${records.filter(r=>!r.passed).length} failed of ${records.length}`);console.log(`PASS ${records.length} route-language-viewport checks`);
})().catch(async e=>{console.error(e);save();await browser?.close();process.exitCode=1;});
