const {chromium,expect}=require('playwright/test');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.READER_BASE_URL||'http://127.0.0.1:4192';
const out=process.env.RING_AUDIT_DIR||'docs/verification/phase12-rings-fields/browser';
fs.mkdirSync(out,{recursive:true});
const records=[];let browser;
const save=()=>fs.writeFileSync(out+'/navigation.json',JSON.stringify(records,null,2)+'\n');
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<=2,label+': '+a+' vs '+b);
const wait=page=>page.waitForTimeout(400);
const settle=page=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const snap=page=>page.evaluate(()=>({
 url:location.pathname+location.search+location.hash,key:history.state?.key||'default',y:scrollY,
 choices:[...document.querySelectorAll('#ring-residue-explorer select')].map(e=>e.value),
 reasons:Object.fromEntries([...document.querySelectorAll('#zero-divisor-not-unit li details')].map(e=>[e.id,e.open])),
 open:[...document.querySelectorAll('details[data-reader-disclosure][open]')].map(e=>e.id),
 row:document.querySelector('[data-testid=ring-row]')?.textContent,
 storage:Object.fromEntries(Object.entries(sessionStorage).filter(([k])=>k.startsWith('fm2gp:book:8.4:'))),
}));
const anchorY=loc=>loc.evaluate(e=>Math.max(0,Math.min(e.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0),document.documentElement.scrollHeight-innerHeight)));
async function run(width,lang){
 const zh=lang==='zh',q=zh?'零因子':'zero divisor';
 const ctx=await browser.newContext({viewport:{width,height:1000},locale:zh?'zh-CN':'en-US'});
 const page=await ctx.newPage(),log={base,width,lang,browser:browser.version(),errors:[],navigation:[],polynomial:[],direct:[]};records.push(log);
 page.on('pageerror',e=>log.errors.push(e.message));
 const root=page.locator('#ring-residue-explorer'),select=root.getByRole('combobox');
 const open=async id=>{const d=page.locator('#'+id);if(!await d.evaluate(e=>e.open)){await d.locator('> summary').focus();await page.keyboard.press('Enter');}await expect(d).toHaveAttribute('open','');};
 const language=()=>expect(page.locator('html')).toHaveAttribute('lang',zh?'zh-CN':'en');
 const shot=async(name,target,full=false)=>{await language();await target.evaluate(e=>e.scrollIntoView({block:'start'}));await wait(page);if(full)await target.screenshot({path:out+'/'+name+'-'+lang+'-'+width+'.png'});else await page.screenshot({path:out+'/'+name+'-'+lang+'-'+width+'.png'});};
 const geometry=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'viewport containment');
 await page.goto(base+'/book?source=ring-reader&tag=two+words');
 const input=page.getByRole('searchbox');await input.pressSequentially(q);await expect(input).toHaveValue(q);await expect.poll(()=>new URL(page.url()).searchParams.get('q')).toBe(q);
 const search=new URL(page.url()).search;
 assert.deepEqual(Object.fromEntries(new URLSearchParams(search)),{source:'ring-reader',tag:'two words',q});
 await shot('search',input);
 const section=page.locator('a[href$="#section-8-4"]');assert.equal(await section.getAttribute('href'),'/book/8'+search+'#section-8-4');await section.click();
 await expect(select.nth(0)).toHaveValue('z6');await expect(select.nth(1)).toHaveValue('2');
 await expect(page.getByTestId('ring-row')).toContainText('[0, 2, 4, 0, 2, 4]');await expect(page.getByTestId('ring-products')).toHaveText('(2×3) mod 6=0');
 await shot('z6-two',root);await geometry();
 await select.nth(0).selectOption('z5');await expect(select.nth(1)).toHaveValue('2');
 await expect(page.getByTestId('ring-row')).toContainText('[0, 2, 4, 1, 3]');await expect(page.getByTestId('ring-inverse')).toContainText('(2×3) mod 5=1');await shot('z5-two',root);
 await select.nth(0).selectOption('z6');await select.nth(1).selectOption('5');await select.nth(0).selectOption('z5');
 await select.nth(1).focus();await page.keyboard.press('Home');await expect(select.nth(1)).toHaveValue('0');assert.ok(await select.nth(1).evaluate(e=>e.matches(':focus-visible')));
 await expect(page.getByTestId('ring-zero')).toBeVisible();
 await open('zero-divisor-not-unit');await open('zero-unit-inverse');await open('zero-unit-contradiction');
 const last=page.locator('#zero-unit-contradiction');
 await expect(last.locator('> summary')).toHaveAccessibleName(new RegExp('^'+(zh?'查看本步依据':'Why this step is valid')+' *: b = 0 ∧ b ≠ 0$'));
 await expect(last.locator('p')).toContainText(zh?'矛盾':'contradicting');
 const mixed=await snap(page);assert.equal(Object.keys(mixed.reasons).length,6);assert.deepEqual(Object.keys(mixed.reasons).filter(k=>mixed.reasons[k]),['zero-unit-inverse','zero-unit-contradiction']);
 await shot('six-step-proof',page.locator('#zero-divisor-not-unit'),true);
 await page.getByRole('button',{name:zh?'English':'中文',exact:true}).click();
 await expect(last.locator('> summary')).toHaveAccessibleName(new RegExp('^'+(zh?'Why this step is valid':'查看本步依据')+' *: b = 0 ∧ b ≠ 0$'));
 await expect(last.locator('p')).toContainText(zh?'contradicting':'矛盾');assert.deepEqual((await snap(page)).reasons,mixed.reasons);
 await page.getByRole('button',{name:zh?'中文':'English',exact:true}).click();
 await open('integer-two-boundary');await page.locator('#integer-two-boundary a').click();
 await page.waitForURL(u=>u.hash==='#section-8-8');await shot('fields',page.locator('#field-model-comparison'));await geometry();
 await open('polynomial-leading-division');
 const link=page.locator('#polynomial-leading-division a');
 const expected='/book/8'+search+'#polynomial-leading-division';
 assert.equal(new URL(await link.getAttribute('href'),base).searchParams.get('from'),expected);
 assert.equal(new URL(page.url()).hash,'#section-8-8');
 await link.scrollIntoViewIfNeeded();await page.evaluate(()=>scrollBy(0,35));await wait(page);
 const preparedDeparture=await snap(page);
 await link.evaluate(e=>e.addEventListener('click',()=>{window.__sourceDeparture={y:scrollY,key:history.state?.key,top:e.getBoundingClientRect().top};},{once:true}));
 await link.click();const sourceClickDeparture=await page.evaluate(()=>window.__sourceDeparture);
 const depart={...preparedDeparture,y:sourceClickDeparture.y};assert.equal(sourceClickDeparture.key,depart.key);await page.waitForURL(u=>u.pathname==='/polynomial-gcd');
 assert.equal(new URL(page.url()).searchParams.get('from'),expected);
 const sourceState=await page.evaluate(()=>history.state?.usr?.readerSource);
 assert.deepEqual(sourceState,{key:depart.key,url:expected});
 await page.getByTestId('example-leading-coefficient').click();
 const panels={division:page.getByTestId('polynomial-division'),gcd:page.getByTestId('polynomial-gcd')};
 for(const p of Object.values(panels)){await expect(p.getByRole('slider')).toHaveValue('0');await expect(p.getByRole('button',{name:zh?'播放':'Play',exact:true})).toBeVisible();}
 const capture=async(mode,event)=>{
  const p=panels[mode],slider=p.getByRole('slider'),max=Number(await slider.getAttribute('max'));
  for(let i=0;i<=max;i++){await slider.fill(String(i));if(await p.getAttribute('data-event')===event)break;}
  await expect(p).toHaveAttribute('data-event',event);
  const state=await p.evaluate(e=>({event:e.dataset.event,fn:e.dataset.function,step:e.querySelector('input[type=range]').value,line:e.querySelector('[aria-current=step]')?.dataset.line,counts:e.querySelector('[data-testid=counts]').textContent.match(/\d+/g),formulas:Object.fromEntries([...e.querySelectorAll('[data-testid^=formula-]')].map(n=>[n.dataset.testid.slice(8),n.textContent])),identity:e.querySelector('[data-testid=identity]')?.textContent}));
  log.polynomial.push(state);return state;
 };
 const term=await capture('division','term');assert.equal(term.fn,'remainder');assert.equal(term.line,'term');assert.deepEqual(term.counts,['0','0']);assert.equal(term.formulas.T,'T = 1/2');assert.equal(term.formulas.Q,'Q = 0');assert.equal(term.formulas.R,'R = x');
 await shot('coefficient-term',panels.division,true);
 const elim=await capture('division','eliminate');assert.equal(elim.line,'update');assert.deepEqual(elim.counts,['0','1']);assert.equal(elim.formulas.Q,'Q = 1/2');assert.equal(elim.formulas.R,'R = 0');assert.ok(elim.identity.includes('x = (2x) × (1/2) + (0)'));await shot('elimination',panels.division,true);
 const raw=await capture('gcd','gcdReturn');const latest=zh?'最近返回值':'Latest returned value',rawLabel=zh?'原始GCD返回值':'Raw GCD return',monicLabel=zh?'首一GCD':'Monic GCD';
 assert.equal(raw.fn,'gcd');assert.equal(raw.line,'return');assert.deepEqual(raw.counts,['1','1']);assert.equal(raw.formulas[latest],latest+' = 2x');assert.equal(raw.formulas[rawLabel],rawLabel+' = 2x');await shot('raw-return',panels.gcd,true);
 await panels.gcd.getByRole('button',{name:zh?'下一步':'Step Forward',exact:true}).click();
 await expect(panels.gcd).toHaveAttribute('data-event','monic');await expect(panels.gcd.getByTestId('formula-'+latest)).toHaveText(latest+' = x');await expect(panels.gcd.getByTestId('formula-'+rawLabel)).toHaveText(rawLabel+' = 2x');await expect(panels.gcd.getByTestId('formula-'+monicLabel)).toHaveText(monicLabel+' = x');await expect(panels.gcd.locator('[aria-current=step]')).toHaveAttribute('data-line','normalize');
 await panels.gcd.getByRole('button',{name:zh?'上一步':'Step Backward',exact:true}).click();await expect(panels.gcd.getByTestId('formula-'+latest)).toHaveText(latest+' = 2x');
 await expect(panels.gcd.getByTestId('formula-'+rawLabel)).toHaveText(rawLabel+' = 2x');
 await panels.gcd.getByRole('button',{name:zh?'下一步':'Step Forward',exact:true}).click();
 await expect(panels.gcd.getByTestId('formula-'+latest)).toHaveText(latest+' = x');await expect(panels.gcd.getByTestId('formula-'+rawLabel)).toHaveText(rawLabel+' = 2x');
 log.adjacentReturns={back:'2x',forward:'x',rawGcd:'2x'};
 const monic=await capture('gcd','monic');assert.deepEqual(monic.counts,['1','1']);await shot('monic-return',panels.gcd,true);
 await page.getByRole('button',{name:zh?'English':'中文',exact:true}).click();await expect(panels.gcd.getByRole('slider')).toHaveValue(monic.step);await expect(panels.gcd.getByTestId('formula-'+(zh?'Latest returned value':'最近返回值'))).toHaveText((zh?'Latest returned value':'最近返回值')+' = x');
 await panels.gcd.getByRole('button',{name:zh?'Step Backward':'上一步',exact:true}).click();await expect(panels.gcd).toHaveAttribute('data-event','gcdReturn');
 await panels.gcd.getByRole('button',{name:zh?'Play':'播放',exact:true}).click();await expect(panels.gcd).toHaveAttribute('data-event','monic');
 await page.getByRole('button',{name:zh?'中文':'English',exact:true}).click();
 await panels.gcd.getByRole('button',{name:zh?'播放':'Play',exact:true}).click();await expect(panels.gcd.getByRole('slider')).toHaveValue('0');
 await page.getByTestId('example-leading-coefficient').click();await page.waitForTimeout(1200);
 for(const p of Object.values(panels)){await expect(p.getByRole('slider')).toHaveValue('0');await expect(p.getByRole('button',{name:zh?'播放':'Play',exact:true})).toBeVisible();}
 log.presetWhilePlaying={waitMs:1200,divisionStep:await panels.division.getByRole('slider').inputValue(),gcdStep:await panels.gcd.getByRole('slider').inputValue(),paused:true};
 await capture('division','eliminate');await panels.division.getByRole('button',{name:zh?'重置':'Reset',exact:true}).click();await expect(panels.division.getByRole('slider')).toHaveValue('0');
 await page.getByTestId('example-zero').click();await expect(page.getByTestId('zero-divisor')).toContainText(zh?'当前B为零':'the zero polynomial as the divisor');
 await page.getByTestId('example-leading-coefficient').click();await geometry();
 const back=()=>page.getByRole('link',{name:zh?'返回来源章节／习题':'Return to source section / exercise',exact:true});
 await back().click();await page.waitForURL(u=>u.hash==='#polynomial-leading-division');await expect(root).toBeVisible();await settle(page);const initial=await snap(page);await wait(page);const stable=await snap(page);
 log.navigation.push({kind:'session',preparedDeparture,sourceClickDeparture,depart,initial,stable,sourceState});save();
 near(initial.y,depart.y,'session initial');near(stable.y,depart.y,'session stable');assert.equal(stable.url,expected);assert.deepEqual(stable.choices,['z5','0']);assert.deepEqual(stable.reasons,mixed.reasons);assert.equal(stable.storage['fm2gp:book:8.4:z6:element'],'5');
 // Browser history preserves the entry's actual departure position.
 const beforeHistory=await snap(page);await page.goBack();await page.waitForURL(u=>u.pathname==='/polynomial-gcd');await page.goForward();await page.waitForURL(u=>u.pathname==='/book/8');await wait(page);
 const forward=await snap(page);near(forward.y,beforeHistory.y,'forward position');assert.deepEqual(forward.reasons,mixed.reasons);log.navigation.push({kind:'back-forward',beforeHistory,forward});
 await shot('restored-zero',root);await select.nth(0).selectOption('z6');await expect(select.nth(1)).toHaveValue('5');await select.nth(0).selectOption('z5');
 await link.click();await page.waitForURL(u=>u.pathname==='/polynomial-gcd');await page.reload();await back().click();await expect(page.locator('#polynomial-leading-division')).toHaveAttribute('open','');await wait(page);
 const hard=await snap(page),target=await anchorY(page.locator('#polynomial-leading-division'));near(hard.y,target,'hard refresh anchor');assert.deepEqual(hard.choices,['z5','0']);assert.deepEqual(hard.reasons,mixed.reasons);log.navigation.push({kind:'hard-refresh',hard,target});await shot('source-card',page.locator('#polynomial-leading-division'));
 // Exercise -> proof -> exercise -> Back: distinct Router history entries, complete query.
 await page.goto(base+'/book/8'+search+'#exercise-8-6');
 const exerciseLink=page.getByRole('link',{name:zh?'章内参考推导':'In-chapter reference derivation',exact:true});
 assert.equal(await exerciseLink.getAttribute('href'),'/book/8'+search+'#zero-divisor-not-unit');await exerciseLink.click();await open('zero-unit-identity');
 const returnExercise=page.getByRole('link',{name:zh?'返回习题 8.6':'Return to Exercise 8.6',exact:true});await returnExercise.scrollIntoViewIfNeeded();await page.evaluate(()=>scrollBy(0,-40));await wait(page);
 await returnExercise.evaluate(e=>e.addEventListener('click',()=>{window.__ringDeparture={y:scrollY,key:history.state?.key,top:e.getBoundingClientRect().top};},{once:true}));
 const proofDeparture=await snap(page);await returnExercise.click();const clickDeparture=await page.evaluate(()=>window.__ringDeparture);await page.waitForURL(u=>u.hash==='#exercise-8-6');await wait(page);const exercise=await snap(page);assert.notEqual(exercise.key,proofDeparture.key);
 await page.goBack();await page.waitForURL(u=>u.hash==='#zero-divisor-not-unit');await wait(page);const proofBack=await snap(page);
 log.navigation.push({kind:'exercise-proof',proofDeparture,clickDeparture,exercise,proofBack});save();
 near(proofBack.y,clickDeparture.y,'exercise proof Back');assert.deepEqual(proofBack.reasons,proofDeparture.reasons);assert.equal(new URL(page.url()).search,search);
 await page.goForward();await page.waitForURL(u=>u.hash==='#exercise-8-6');await wait(page);near((await snap(page)).y,exercise.y,'exercise Forward');
 for(const id of ['zero-unit-inverse','zero-unit-contradiction']){
  await page.evaluate(()=>{for(const k of Object.keys(sessionStorage))if(k.startsWith('fm2gp-reading:'))sessionStorage.removeItem(k);});
  await page.goto(base+'/book/8'+search+'#'+id);await expect(page.locator('#zero-divisor-not-unit')).toHaveAttribute('open','');await expect(page.locator('#'+id)).toHaveAttribute('open','');await wait(page);
  for(const action of ['direct','refresh']){
   if(action==='refresh'){await page.reload();await wait(page);}
   const s=await snap(page),y=await anchorY(page.locator('#'+id));near(s.y,y,'nested '+action);assert.equal(s.reasons[id],true);log.direct.push({id,action,s,target:y});
  }
 }
 await page.getByRole('link',{name:zh?'返回章节目录':'Back to chapter directory',exact:true}).click();await page.getByRole('searchbox').fill('');await expect.poll(()=>new URL(page.url()).searchParams.has('q')).toBe(false);
 assert.deepEqual(Object.fromEntries(new URL(page.url()).searchParams),{source:'ring-reader',tag:'two words'});
 // Visible content and accessible names must not introduce PDF page references.
 await page.goto(base+'/book/8'+search+'#section-8-4');await open('zero-divisor-not-unit');await open('zero-unit-contradiction');
 const text=await page.evaluate(()=>document.body.innerText+' '+[...document.querySelectorAll('[aria-label],[title]')].map(e=>e.getAttribute('aria-label')||e.title).join(' '));
 assert.doesNotMatch(text,/第\s*\d+\s*页|\b(?:page|pp?\.)\s*\d+\b/i);
 await geometry();assert.deepEqual(log.errors,[]);log.status='PASS';save();await ctx.close();
}
(async()=>{try{browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});for(const width of [1440,390])for(const lang of ['zh','en'])await run(width,lang);console.log('PASS: '+records.length+' language/viewport runs');}catch(e){records.push({status:'FAIL',message:e.stack});save();console.error(e);process.exitCode=1;}finally{await browser?.close();}})();
