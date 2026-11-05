export const reverseMethods = ['bidirectional', 'recursive', 'adaptive'] as const;
export type ReverseMethod = typeof reverseMethods[number];
export type ReverseError = 'empty' | 'integer' | 'length' | 'capacity';
export type ReverseErrors = Partial<Record<'sequence'|'capacity',ReverseError>>;
export function parseReverseInput(raw:string, capacityRaw:string, explicitEmpty=false): {ok:true;values:number[];capacity:number}|{ok:false;errors:ReverseErrors} {
  const errors:ReverseErrors={},tokens=raw.trim().split(/[,，]/);
  if(!raw.trim()&&!explicitEmpty)errors.sequence='empty';
  else if(!explicitEmpty && tokens.some(t=>! /^-?\d+$/.test(t.trim()) || !Number.isSafeInteger(Number(t.trim()))))errors.sequence='integer';
  else if(!explicitEmpty&&tokens.length>50)errors.sequence='length';
  if(!/^\d+$/.test(capacityRaw.trim())||!Number.isSafeInteger(Number(capacityRaw))||Number(capacityRaw)>50)errors.capacity='capacity';
  return Object.keys(errors).length?{ok:false,errors}:{ok:true,values:explicitEmpty?[]:tokens.map(t=>Number(t.trim())),capacity:Number(capacityRaw)};
}
export interface Element {value:number;origin:number}
export type Phase = 'enter'|'left'|'middle'|'right'|'swap'|'buffer'|'return';
export interface ReverseFrame {id:number;start:number;f:number;n:number;h:number|null;m:number|null;l:number|null;phase:Phase}
export type ReverseEvent = 'init'|'enter'|'check'|'baseReturn'|'split'|'leftCall'|'leftReturned'|'middle'|'rightCall'|'rightReturned'|'swapCall'|'swap'|'swapReturn'|'return'|'bufferCheck'|'bufferCall'|'copy'|'copyReturn'|'write'|'writeReturn'|'done';
export type ReverseFunction = ReverseMethod|'swap_ranges_n'|'reverse_n_with_buffer'|'copy_n'|'reverse_copy';
export interface ReverseStep {
  method:ReverseMethod;sequence:Element[];capacity:number;buffer:(Element|null)[];valid:number;
  frames:ReverseFrame[];helper:Record<string,number>|null;
  fn:ReverseFunction;line:string;event:ReverseEvent;condition:boolean|null;
  counts:{swaps:number;bufferWrites:number;sourceWrites:number;transfers:number;maxDepth:number;bufferPeak:number};
  reads:{space:'sequence'|'buffer';index:number}[];pair:number[];
  returnPosition:number|null;returnSpace:'sequence'|'buffer'|null;result:number|null;
}
/** Source order follows ch11.h. Main frames and helper iterator copies are separate.
 * All snapshots own their arrays, elements, locals and counters; no display language is stored. */
export function reverseTrace(values:number[],capacity:number,method:ReverseMethod):ReverseStep[] {
  if(values.length>50||values.some(v=>!Number.isSafeInteger(v))||!Number.isInteger(capacity)||capacity<0||capacity>50)throw Error('input');
  const s:ReverseStep={method,sequence:values.map((value,origin)=>({value,origin})),capacity,buffer:Array.from({length:method==='adaptive'?capacity:0},()=>null),valid:0,frames:[],helper:null,fn:method,line:'entry',event:'init',condition:null,counts:{swaps:0,bufferWrites:0,sourceWrites:0,transfers:0,maxDepth:0,bufferPeak:0},reads:[],pair:[],returnPosition:null,returnSpace:null,result:null};
  const steps:ReverseStep[]=[];let id=0;
  const emit=(event:ReverseEvent,line:string,condition:boolean|null=null)=>{s.event=event;s.line=line;s.condition=condition;steps.push(structuredClone(s));s.reads=[];s.pair=[];};
  const swap=(a:number,b:number)=>{s.reads=[{space:'sequence',index:a},{space:'sequence',index:b}];s.pair=[a,b];[s.sequence[a],s.sequence[b]]=[s.sequence[b],s.sequence[a]];s.counts.swaps++;s.counts.transfers+=3;};
  const enter=(f:number,n:number)=>{const frame:ReverseFrame={id:id++,start:f,f,n,h:null,m:null,l:method==='bidirectional'?values.length:null,phase:'enter'};s.frames.push(frame);s.counts.maxDepth=Math.max(s.counts.maxDepth,s.frames.length);s.fn=method;emit('enter','entry');return frame;};
  const returned=(frame:ReverseFrame,pos:number,line:string,event:ReverseEvent='return')=>{frame.phase='return';s.fn=method;s.returnPosition=pos;s.returnSpace='sequence';emit(event,line);s.frames.pop();return pos;};
  emit('init','entry');
  if(method==='bidirectional'){
    const f=enter(0,values.length);f.l=values.length;
    while(true){
      if(f.f===f.l){emit('check','loop',false);break;}
      f.l--;emit('check','loop',f.f!==f.l);if(f.f===f.l)break;
      f.phase='swap';const left=f.f++;swap(left,f.l);emit('swap','swap');
    }
    f.phase='return';emit('return','return');s.frames.pop();emit('done','return');return steps;
  }
  const run=(start:number,n:number):number=>{
    const f=enter(start,n);
    if(n===0)return returned(f,f.f,'zero','baseReturn');emit('check','zero',false);
    if(n===1){f.f++;return returned(f,f.f,'one','baseReturn');}emit('check','one',false);
    if(method==='adaptive'){
      emit('bufferCheck','fits',n<=capacity);
      if(n<=capacity){
        f.phase='buffer';s.valid=0;s.returnPosition=null;s.returnSpace=null;s.fn='reverse_n_with_buffer';emit('bufferCall','entry');
        s.fn='copy_n';s.helper={source:start,buffer:0,remaining:n};emit('enter','entry');
        for(let j=0;j<n;j++){
          s.reads=[{space:'sequence',index:start+j}];s.buffer[j]={...s.sequence[start+j]};s.valid=j+1;s.counts.bufferWrites++;s.counts.transfers++;s.counts.bufferPeak=Math.max(s.counts.bufferPeak,s.valid);
          s.helper={source:start+j+1,buffer:j+1,remaining:n-j-1};emit('copy','copy');
        }
        s.returnPosition=n;s.returnSpace='buffer';emit('copyReturn','return');
        s.fn='reverse_n_with_buffer';s.helper={buffer_end:n};emit('copyReturn','copy');
        s.fn='reverse_copy';s.helper={f:0,l:n,result:start};emit('enter','entry');
        for(let j=0;j<n;j++){
          emit('check','loop',true);
          const index=n-j-1;s.reads=[{space:'buffer',index}];s.sequence[start+j]={...s.buffer[index]!};s.counts.sourceWrites++;s.counts.transfers++;
          s.helper={f:0,l:index,result:start+j+1};emit('write','write');
        }
        emit('check','loop',false);s.returnPosition=start+n;s.returnSpace='sequence';emit('writeReturn','return');
        // Restore the caller's locals; reverse_copy's iterator copies belong only
        // to its own return snapshot, already emitted above.
        s.fn='reverse_n_with_buffer';s.helper={buffer_end:n};emit('writeReturn','write');s.helper=null;s.valid=0;
        return returned(f,start+n,'fits');
      }
    }
    f.h=Math.floor(n/2);emit('split','half');
    f.phase='left';emit('leftCall','left');f.m=run(f.f,f.h);s.fn=method;f.phase='middle';emit('leftReturned','left');
    f.m+=n%2;emit('middle','middle');
    f.phase='right';emit('rightCall','right');f.l=run(f.m,f.h);s.fn=method;f.phase='swap';emit('rightReturned','right');
    f.phase='swap';emit('swapCall','ranges');s.fn='swap_ranges_n';s.helper={first0:f.f,first1:f.m,n:f.h};emit('enter','entry');
    for(let j=0;j<f.h;j++){
      emit('check','loop',true);swap(s.helper.first0,s.helper.first1);s.helper.first0++;s.helper.first1++;emit('swap','swap');
      s.helper.n--;emit('check','decrement');
    }
    emit('check','loop',false);emit('swapReturn','return');s.helper=null;s.fn=method;emit('swapReturn','ranges');
    return returned(f,f.l,'return');
  };
  s.result=run(0,values.length);s.fn=method;emit('done','return');return steps;
}
