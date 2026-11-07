const fs=require('node:fs'),ts=require('typescript'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {traceCycles,mainExample}=require('../src/lib/algorithms/cycleTrace.ts');
const {cycleVisualization}=require('../src/lib/algorithms/cycle.ts');
const out='docs/verification/edition-closeout/issue1';fs.mkdirSync(out,{recursive:true});
function* permutations(xs){if(!xs.length)yield [];for(const x of xs)for(const rest of permutations(xs.filter(v=>v!==x)))yield [x,...rest];}
let cases=0,frames=0,cells=0;
for(let n=1;n<=6;n++)for(const to of permutations(Array.from({length:n},(_,i)=>i))){const values=to.map(i=>i%2),trace=traceCycles({array:values,permutation:to});for(const f of trace){frames++;for(const c of f.cells){cells++;assert.ok(Number.isSafeInteger(c.origin)&&c.origin>=0&&c.origin<n);assert.equal(c.value,values[c.origin]);}if(f.locals)assert.equal(f.locals.tmp.value,values[f.locals.tmp.origin]);}const last=trace.at(-1),origins=[];to.forEach((dest,source)=>origins[dest]=source);assert.deepEqual(last.cells,origins.map(origin=>({origin,value:values[origin]})));cases++;}
assert.equal(cases,873);
const sparse=[{name:'Array(2)',array:Array(2),permutation:[1,0],holes:[0,1]},{name:'[10,,30]',array:[10,,30],permutation:[1,2,0],holes:[1]}].map(c=>{for(const i of c.holes)assert.equal(i in c.array,false);const validation=cycleVisualization.validateInput(c);assert.deepEqual(validation,{valid:false,errorKey:'cycleInvalidInteger'});assert.throws(()=>traceCycles(c),RangeError);return {input:c.name,confirmedMissingSlots:c.holes,validation,traceError:'RangeError'};});
const transfers=traceCycles(mainExample).filter(f=>['save','write','close'].includes(f.event)).map(f=>({event:f.event,locals:f.locals,cells:f.cells,copies:f.copies,writes:f.writes,total:f.copies+f.writes}));assert.equal(transfers.length,8);assert.deepEqual(transfers[2].cells.map(c=>c.origin),[4,1,2,3,2,5]);assert.deepEqual([transfers[2].copies,transfers[2].writes,transfers[2].total],[1,2,3]);
fs.writeFileSync(out+'/math-check.json',JSON.stringify({cases,frames,cells,sparse,transfers},null,2)+'\n');console.log(JSON.stringify({cases,frames,cells,transfers:transfers.length,sparseCases:sparse.length}));
