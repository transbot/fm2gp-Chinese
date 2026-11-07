const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root='docs/verification/edition-closeout',base=process.env.READER_BASE_URL||'http://127.0.0.1:4193';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const files=walk('dist').map(f=>({path:path.relative('dist',f).replaceAll('\\','/'),bytes:fs.statSync(f).size,sha256:hash(fs.readFileSync(f))}));
fs.mkdirSync(root+'/build',{recursive:true});fs.writeFileSync(root+'/build/dist-sha256.json',JSON.stringify(files,null,2)+'\n');
let browser;const records=[],assets=new Map(),tasks=[],errors=[];
(async()=>{browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});const p=await browser.newPage();
// Routing disables the HTTP cache: inspect complete 200 bodies, not 304 metadata.
await p.route('**/*',route=>route.continue());
p.on('response',response=>{const u=new URL(response.url());if(u.origin!==new URL(base).origin)return;if(!['script','stylesheet','image','font'].includes(response.request().resourceType()))return;
tasks.push((async()=>{const rel=decodeURIComponent(u.pathname).slice(1),local=files.find(f=>f.path===rel);assert.ok(local,'Loaded asset not in dist: '+rel);const body=await response.body();assert.equal(hash(body),local.sha256,rel);assets.set(rel,{path:rel,sha256:local.sha256,type:response.request().resourceType()});})().catch(e=>errors.push(e.message)));});
for(const route of JSON.parse(fs.readFileSync(root+'/entry-inventory.json')).routes){const response=await p.goto(base+route);await p.locator('h1').first().waitFor();await p.waitForLoadState('networkidle');assert.equal(hash(await response.body()),files.find(f=>f.path==='index.html').sha256,route+' HTML');const refs=await p.locator('script[src],link[rel=stylesheet]').evaluateAll(es=>es.map(e=>e.getAttribute('src')||e.getAttribute('href')));for(const ref of refs)assert.ok(files.some(f=>'/'+f.path===ref),ref);records.push({route,html:'matches dist/index.html',refs});}
await Promise.all(tasks);assert.deepEqual(errors,[]);fs.writeFileSync(root+'/resource-parity.json',JSON.stringify({base,routes:records.length,loadedResourceCount:assets.size,buildFileCount:files.length,entries:records,loaded:[...assets.values()],errors},null,2)+'\n');console.log(`PASS ${records.length} HTML routes, ${assets.size} browser-loaded resources, ${files.length} build files hashed`);await browser.close();
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
