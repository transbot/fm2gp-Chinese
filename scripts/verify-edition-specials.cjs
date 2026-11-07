// Run the existing reader/navigation suites against one immutable preview build.
const fs=require('node:fs'),{spawn}=require('node:child_process');
const root='docs/verification/edition-closeout';
const jobs=[
 ['rings','RING_AUDIT_DIR',root+'/harness/verify-rings-release.cjs'],
 ['cycles','CYCLE_AUDIT_DIR',root+'/harness/verify-cycle-release.cjs'],
 ['isomorphism','ISO_AUDIT_DIR','scripts/verify-isomorphism.cjs'],
 ['groups','GROUP_AUDIT_DIR','scripts/verify-finite-groups.cjs'],
 ['reasons','GROUP_AUDIT_DIR','scripts/verify-finite-groups.cjs','--proof-steps'],
 ['types','TYPES_AUDIT_DIR',root+'/harness/verify-types-reference.cjs'],
 ['proofs','PROOF_AUDIT_DIR','scripts/verify-proofs-reference.cjs'],
 ['query','QUERY_AUDIT_DIR','scripts/verify-book-query.cjs'],
 ['recap','RECAP_AUDIT_DIR','scripts/verify-book-recap.cjs'],
 ['scroll','SCROLL_AUDIT_DIR','scripts/verify-search-scroll.cjs'],
 ['history','HISTORY_AUDIT_DIR','scripts/verify-chapter-history.cjs'],
 ['division','DIVISION_AUDIT_DIR','scripts/verify-division.cjs'],
 ['horner','READER_OUTPUT_DIR','scripts/verify-horner.cjs'],
 ['egyptian','READER_OUTPUT_DIR',root+'/harness/verify-egyptian.cjs'],
 ['phase2-review','READER_OUTPUT_DIR',root+'/harness/verify-phase2-review.cjs'],
 ['reverse','REVERSE_AUDIT_DIR','scripts/verify-reverse.cjs'],
 ['reverse-return','RETURN_AUDIT_DIR','scripts/verify-reverse-return.cjs'],
 ['polynomial','POLYNOMIAL_AUDIT_DIR','scripts/verify-polynomial-gcd.cjs'],
 ['polynomial-return','POLYNOMIAL_RETURN_AUDIT_DIR','scripts/verify-polynomial-return.cjs'],
 ['production','READER_OUTPUT_DIR','scripts/verify-reader-production.cjs'],
 ['flows','READER_OUTPUT_DIR','scripts/verify-reader-flows.cjs'],
];
for(const name of ['egyptian','phase2-review']){let s=fs.readFileSync(`scripts/verify-${name}.cjs`,'utf8');s=s.replace(/const out = '[^']+';/,"const out = process.env.READER_OUTPUT_DIR;");fs.writeFileSync(`${root}/harness/verify-${name}.cjs`,s);}
let types=fs.readFileSync('scripts/verify-types-reference.cjs','utf8');
types=types.replace("await expect(page.getByRole('status')).toContainText('A');", "await expect(page.getByRole('status')).toHaveText(lang==='zh'?'按 ASCII 解码，最高位补零。低七位的码值为 65，对应大写字母 A。':'The high bit is zero padding. The low seven bits give ASCII code 65, which represents uppercase A.');");
fs.writeFileSync(root+'/harness/verify-types-reference.cjs',types);
const records=[];let cursor=0;
async function worker(){while(cursor<jobs.length){const [name,key,script,...args]=jobs[cursor++];fs.mkdirSync(`${root}/${name}`,{recursive:true});const log=fs.openSync(`${root}/${name}/run.txt`,'w');const started=new Date().toISOString();const status=await new Promise(resolve=>{const child=spawn(process.execPath,[script,...args],{env:{...process.env,[key]:`${root}/${name}`},stdio:['ignore',log,log],windowsHide:true});child.on('exit',code=>resolve(code));child.on('error',e=>{console.error(e);resolve(-1);});});fs.closeSync(log);records.push({name,script,args,started,finished:new Date().toISOString(),exitCode:status});fs.writeFileSync(`${root}/specials-results.json`,JSON.stringify(records,null,2)+'\n');console.log(`${name}: ${status===0?'PASS':'FAIL '+status}`);}}
Promise.all([worker(),worker(),worker()]).then(()=>{if(records.some(r=>r.exitCode!==0))process.exitCode=1;});
