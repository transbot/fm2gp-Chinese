import { expect, it } from 'vitest';
import { parseReverseInput, reverseMethods, reverseTrace } from './reverseTrace';

const values = Array.from({length:9},(_,i)=>i);
it.each([
  {size:2,capacity:2,start:0,n:2,step:19,counts:{swaps:0,bufferWrites:2,sourceWrites:2,transfers:4,maxDepth:1,bufferPeak:2}},
  {size:9,capacity:4,start:0,n:4,step:31,counts:{swaps:0,bufferWrites:4,sourceWrites:4,transfers:8,maxDepth:2,bufferPeak:4}},
  {size:9,capacity:4,start:5,n:4,step:59,counts:{swaps:0,bufferWrites:8,sourceWrites:8,transfers:16,maxDepth:2,bufferPeak:4}},
  {size:9,capacity:9,start:0,n:9,step:40,counts:{swaps:0,bufferWrites:9,sourceWrites:9,transfers:18,maxDepth:1,bufferPeak:9}},
])('restores source-scoped locals at return step $step (size $size, capacity $capacity)',({size,capacity,start,n,step,counts})=>{
  const trace=reverseTrace(values.slice(0,size),capacity,'adaptive');
  // Fixed source-scope expectations, not derived from the generated helper data.
  const expected=[
    {fn:'reverse_copy',line:'return',event:'writeReturn',helper:{f:0,l:0,result:start+n}},
    {fn:'reverse_n_with_buffer',line:'write',event:'writeReturn',helper:{buffer_end:n}},
    {fn:'adaptive',line:'fits',event:'return',helper:null},
  ];
  expected.forEach((scope,i)=>{
    const index=step-2+i,s=trace[index];
    expect(s).toMatchObject({...scope,returnSpace:'sequence',returnPosition:start+n});
    expect(s.helper).toEqual(scope.helper);
    expect(s.frames[s.frames.length-1]).toMatchObject({f:start,n});
    expect(s.counts).toEqual(counts);
    expect(s.counts).toEqual(trace[index-1].counts);
  });
});
const oracle = (n:number,c:number):number[] => n<2 ? [0,0,1,0] : n<=c ? [0,n,1,n] : (()=>{const [s,w,d,p]=oracle(Math.floor(n/2),c);return [2*s+Math.floor(n/2),2*w,d+1,p];})();
it.each(['1.5','1x','1,,2','1e2','1.00000000000000001','9007199254740992',''])('rejects raw sequence %s before conversion', raw=>expect(parseReverseInput(raw,'4').ok).toBe(false));
it.each(['','-1','51','1.5','1e1'])('rejects capacity %s', c=>expect(parseReverseInput('1,2',c).ok).toBe(false));
it('distinguishes blank drafts from explicit empty presets and preserves tokens',()=>{
  expect(parseReverseInput('','4',true)).toEqual({ok:true,values:[],capacity:4});
  expect(parseReverseInput('0，-2,2,2','0')).toEqual({ok:true,values:[0,-2,2,2],capacity:0});
  expect(parseReverseInput(Array(51).fill(1).join(','),'4').ok).toBe(false);
});
it.each([0,1,2,3,4,8,9,10,50])('matches independent result and recurrence at capacity %i', c=>{
  for(const input of [[],[0],[1,2],values.slice(0,8),values,[2,1,2,1,2],[-3,0,-1,0],Array(9).fill(2),Array.from({length:50},(_,i)=>i-25)]) for(const method of reverseMethods){
    const trace=reverseTrace(input,c,method),last=trace[trace.length-1];
    expect(last.sequence).toEqual(input.map((value,origin)=>({value,origin})).reverse());
    expect(last.result).toBe(method==='bidirectional'?null:input.length);
    const [swaps,writes,depth,peak]=method==='bidirectional'?[Math.floor(input.length/2),0,1,0]:oracle(input.length,method==='recursive'?0:c);
    expect(last.counts).toEqual({swaps,bufferWrites:writes,sourceWrites:writes,transfers:3*swaps+2*writes,maxDepth:depth,bufferPeak:peak});
    for(const s of trace){
      expect(s.counts.transfers).toBe(3*s.counts.swaps+s.counts.bufferWrites+s.counts.sourceWrites);
      for(const r of s.reads)expect(r.index).toBeLessThan(r.space==='sequence'?input.length:s.valid);
      expect(s.frames.length).toBeLessThanOrEqual(s.counts.maxDepth);
    }
  }
});
it('keeps root locals, helper copies and the exercise 11.13 trace',()=>{
  const t=reverseTrace(values,4,'recursive');
  const before=t.find(s=>s.event==='swapCall'&&s.frames.length===1)!;
  expect(before.sequence.map(e=>e.value)).toEqual([3,2,1,0,4,8,7,6,5]);
  expect(before.frames[0]).toMatchObject({f:0,n:9,h:4,m:5,l:9});
  expect(t.find(s=>s.event==='leftReturned'&&s.frames.length===1)?.frames[0].m).toBe(4);
  const swaps=t.filter(s=>s.event==='swap'&&s.frames.length===1);
  expect(swaps.map(s=>s.pair)).toEqual([[0,5],[1,6],[2,7],[3,8]]);
  for(const s of swaps)expect(s.frames[0]).toMatchObject({f:0,m:5});
  const original=structuredClone(t[0]);t[t.length-1].sequence[0].value=123;expect(t[0]).toEqual(original);
});
it('handles base cases before buffer checks and labels both return spaces',()=>{
  for(const input of [[],[1]])expect(reverseTrace(input,50,'adaptive').some(s=>s.event==='bufferCheck')).toBe(false);
  const t=reverseTrace(values,9,'adaptive');
  expect(t.find(s=>s.event==='copyReturn')).toMatchObject({returnSpace:'buffer',returnPosition:9,valid:9});
  expect(t.find(s=>s.event==='writeReturn')).toMatchObject({returnSpace:'sequence',returnPosition:9});
});
it.each([[0,12,0,36,4,0],[1,12,0,36,4,0],[2,8,8,40,3,2],[3,8,8,40,3,2],[4,4,8,28,2,4],[8,4,8,28,2,4],[9,0,9,18,1,9]])('locks nine-element capacity %i counts to the acceptance table',(capacity,swaps,writes,transfers,maxDepth,bufferPeak)=>{
  const t=reverseTrace(values,capacity,'adaptive');expect(t[t.length-1].counts).toEqual({swaps,bufferWrites:writes,sourceWrites:writes,transfers,maxDepth,bufferPeak});
  for(let i=1;i<t.length;i++){
    const current=t[i],prior=t[i-1],delta=current.counts.transfers-prior.counts.transfers;
    expect(delta).toBe(current.event==='swap'?3:current.event==='copy'||current.event==='write'?1:0);
    if(current.fn==='swap_ranges_n')expect(current.frames[current.frames.length-1]).toEqual(prior.frames[prior.frames.length-1]);
  }
});
