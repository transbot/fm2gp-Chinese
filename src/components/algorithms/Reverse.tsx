import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LearningShell, TermHelp } from '../common/LearningShell';
import { TraceCode } from '../common/TraceCode';
import { usePlayback } from '../concepts/usePlayback';
import { reverseCode, reverseErrors, reverseMessages, reverseNames, reversePhases } from '../concepts/reversePresentation';
import { parseReverseInput, reverseMethods, reverseTrace, Element, ReverseErrors, ReverseStep } from '../../lib/algorithms/reverseTrace';
import { repoFile } from '../../data/bookCatalog';
const defaultInput='0,1,2,3,4,5,6,7,8';
const countLabels = [['交换','Swaps'],['写入缓冲','Buffer writes'],['写回原序列','Writebacks'],['元素传送','Transfers'],['最大反转层数','Peak reversal depth'],['缓冲使用峰值','Peak buffer use']];
const countKeys=['swaps','bufferWrites','sourceWrites','transfers','maxDepth','bufferPeak'] as const;
export function Reverse() {
  const {lang}=useLanguage(),zh=lang==='zh';
  const [draft,setDraft]=useState({sequence:defaultInput,capacity:'4'});
  const [empty,setEmpty]=useState(false);
  const [errors,setErrors]=useState<ReverseErrors>({});
  const [run,setRun]=useState<{values:number[];capacity:number;raw:string;capRaw:string;empty:boolean;revision:number}|null>({values:Array.from({length:9},(_,i)=>i),capacity:4,raw:defaultInput,capRaw:'4',empty:false,revision:0});
  const [revision,setRevision]=useState(0);
  const apply=(raw=draft.sequence,cap=draft.capacity,isEmpty=empty)=>{
    const parsed=parseReverseInput(raw,cap,isEmpty),next=revision+1;setRevision(next);
    if(parsed.ok){setRun({...parsed,raw,capRaw:cap,empty:isEmpty,revision:next});setErrors({});}
    else{setRun(null);setErrors(parsed.errors);}
  };
  const pending=!run||draft.sequence!==run.raw||draft.capacity!==run.capRaw||empty!==run.empty;
  return <LearningShell wide title={zh?'反转：递归与内存自适应':'Reversal: recursion and memory adaptation'} description={zh?'第11.5—11.7节 · 同一序列，三种迭代器策略。跟踪半区、调用栈与共享缓冲区。':'Sections 11.5–11.7 · One sequence, three iterator strategies. Follow subranges, call frames, and a shared buffer.'}>
    <form className="learning-card" onSubmit={e=>{e.preventDefault();apply();}}>
      <div className="grid sm:grid-cols-[2fr_1fr] gap-4">{(['sequence','capacity'] as const).map(field=><div key={field}>
        <label htmlFor={`reverse-${field}`}>{field==='sequence'?(zh?'输入序列':'Array sequence'):(zh?'缓冲容量':'Buffer capacity')}</label>
        <input id={`reverse-${field}`} className="learning-input w-full mt-2" value={draft[field]} aria-invalid={!!errors[field]} aria-describedby={errors[field]?`reverse-error-${field}`:undefined} onChange={e=>{setDraft({...draft,[field]:e.target.value});if(field==='sequence')setEmpty(false);setErrors({...errors,[field]:undefined});}}/>
        {errors[field]&&<p role="alert" id={`reverse-error-${field}`} className="text-red-700 mt-2">{reverseErrors[errors[field]!][zh?0:1]}</p>}
      </div>)}</div>
      <p className="text-sm text-gray-600">{zh?'最多50个十进制安全整数，用中文或英文逗号分隔；容量0—50。保留全部步骤、重复值和原始顺序。空序列请使用预设。':'Up to 50 decimal safe integers, separated by English or Chinese commas; capacity 0–50. Every step, duplicate, and original position is retained. Use the preset for an empty sequence.'}</p>
      {pending&&<p role="status" data-testid="pending-input" className="text-amber-800">{!draft.sequence.trim()&&!empty?(zh?'待填写：请输入序列，或选择空序列预设。':'Enter a sequence, or choose the empty sequence preset.'):(zh?'待应用：点击应用输入会暂停并重置三个播放器。':'Pending: apply input to pause and reset all three players.')}</p>}
      <button className="learning-primary" type="submit">{zh?'应用输入':'Apply input'}</button>
      <div className="flex flex-wrap gap-2">{[[defaultInput,zh?'习题11.13：九元素':'Exercise 11.13: nine elements'],['2,1,2,1,2',zh?'重复值':'Duplicate values'],['',zh?'空序列':'Empty sequence'],['0',zh?'单元素':'Single element']].map(([raw,label])=><button className="learning-secondary" type="button" key={label} onClick={()=>{setDraft({...draft,sequence:raw});setEmpty(raw==='');apply(raw,draft.capacity,raw==='');}}>{label}</button>)}</div>
      <div className="flex flex-wrap items-center gap-2"><span>{zh?'应用容量：':'Apply capacity:'}</span>{[0,1,2,4,9].map(c=><button type="button" className="learning-secondary" aria-pressed={run?.capacity===c} key={c} onClick={()=>{setDraft({...draft,capacity:String(c)});apply(draft.sequence,String(c));}}>{c}</button>)}</div>
    </form>
    {run&&<Comparison key={run.revision} values={run.values} capacity={run.capacity}/>}
    <TermHelp term={zh?'开发者笔记：空间、复制与迭代器':'Developer notes: space, copying, and iterators'} href="/book/11#section-11-6">
      <p>{zh?'双向迭代器既能前进也能后退，所以可以从两端交换，辅助空间为O(1)。前向迭代器只能前进：reverse_recursive先反转两个半区，再交换这两个半区，使用O(log n)调用栈。两个前向入口都直接接收已知长度n，不演示外层distance计数。':'Bidirectional iterators can move both ways, allowing swaps from both ends with O(1) auxiliary space. Forward iterators only advance: reverse_recursive first reverses each half, then exchanges the halves, using an O(log n) call stack. Both forward entries take a known n; the outer distance calculation is not included.'}</p>
      <p>{zh?'自适应版本先处理n＝0和n＝1，再判断整个子区间是否放得进缓冲区；放不下才继续递归。所有调用共享一块容量为C的缓冲区，空间包括O(C)缓冲区和最多O(log n)的调用栈。回放快照是演示器存储，不属于算法辅助空间。':'The adaptive version handles n=0 and n=1 first, then tests whether the subrange fits the buffer; only larger ranges recurse. All calls share one capacity-C buffer. Space includes O(C) buffer storage and at most O(log n) stack space. Replay snapshots belong to the visualizer, not the algorithm’s auxiliary space.'}</p>
      <p>{zh?'“就地”按本书定义11.6，指额外空间为O((log n)^k)，其中k是常数，称为多项式对数空间。因此使用对数调用栈仍可称为就地；足够复制整个输入的线性缓冲区则不属于这种情况。':'Definition 11.6 calls an algorithm in-place when extra space is O((log n)^k) for a constant k, also called polylogarithmic space. A logarithmic call stack still qualifies; a linear buffer large enough to copy the whole input does not.'}</p>
      <p>{zh?'一次swap按书中实现包含一次复制构造、两次赋值，共3次元素传送。每次缓冲复制或回写各算1次。比较、游标移动和回放不计元素传送。层数计入根反转调用，辅助函数不计入。':'The book’s swap uses one copy construction and two assignments, or 3 element transfers. Each buffer copy or writeback counts as 1. Comparisons, iterator movement, and playback add no element transfers. Depth includes the root reversal call but excludes helpers.'}</p>
      <p>{zh?'九元素时，容量1需要36次传送，容量2反而需要40次；容量4为28次，容量9为18次。更多缓冲并不保证每次增加容量都减少操作：分支形状、复制代价和实际硬件都会影响效率。':'For nine elements, capacity 1 needs 36 transfers, while capacity 2 needs 40; capacity 4 needs 28, and capacity 9 needs 18. More buffer does not reduce operations at every increment: branching, copying costs, and hardware all affect performance.'}</p>
      <p>{zh?'f、m、l表示位置，n表示长度，h是半长。每个父帧保存自己的迭代器；swap_ranges_n只移动传入的副本。end是尾后位置，可返回或比较，不能读取。原始位置标签跟随值移动，因此重复数值也能区分。':'f, m, and l are positions; n is a length and h is its half. Each parent frame owns its iterators; swap_ranges_n moves only copies. end is past the last element: it may be returned or compared, but not read. Origin tags move with values so duplicates remain distinguishable.'}</p>
      <a className="learning-link block" href={repoFile('配套代码(fm2gpcode)/ch11.h')}>reverse · reverse_recursive · reverse_n_with_buffer · reverse_n_adaptive — ch11.h</a>
      <Link className="learning-link block" to="/book/11#exercise-11-13">{zh?'习题11.13：跟踪九元素的递归反转':'Exercise 11.13: trace recursive reversal of nine elements'}</Link>
    </TermHelp>
  </LearningShell>;
}
function Comparison({values,capacity}:{values:number[];capacity:number}){
  const {lang}=useLanguage(),zh=lang==='zh',ix=zh?0:1;
  const traces=useMemo(()=>reverseMethods.map(m=>reverseTrace(values,capacity,m)),[values,capacity]);
  const a=usePlayback(traces[0].length),b=usePlayback(traces[1].length),c=usePlayback(traces[2].length),players=[a,b,c];
  return <>
    <section className="learning-card min-w-0"><h2 className="text-xl font-semibold">{zh?'完整过程比较':'Complete-run comparison'}</h2><p>{zh?'总计来自完整轨迹；当前状态随各自播放器更新。前向版本的缓冲迭代器需支持双向移动。':'Totals come from complete traces; current states follow each player independently. The buffered forward version requires bidirectional buffer iterators.'}</p>
      <div className="overflow-x-auto" role="region" tabIndex={0} aria-label={zh?'反转计数比较':'Reversal count comparison'}><table className="w-full text-left text-sm"><thead><tr>{[zh?'方法／要求':'Method / requirement',...countLabels.map(l=>l[ix]),zh?'最终结果':'Final result',zh?'当前状态':'Current state'].map(l=><th className="p-2" key={l}>{l}</th>)}</tr></thead><tbody>{traces.map((trace,i)=>{const last=trace[trace.length-1],s=trace[players[i].step];return <tr data-testid={`summary-${s.method}`} key={s.method}><th className="p-2">{reverseNames[s.method][ix]}<br/>{i===0?(zh?'双向':'Bidirectional'):(zh?'前向':'Forward')}</th>{countKeys.map(k=><td className="border-t p-2" key={k}>{last.counts[k]}</td>)}<td className="border-t p-2">{zh?'反转完成':'Reversed'} · {i===0?'void':`${last.result} (end)`}</td><td className="border-t p-2" data-testid={`current-${s.method}`}>{players[i].step+1}/{trace.length} · {s.fn}<br/>{reverseMessages[s.event][ix]}</td></tr>;})}</tbody></table></div>
      <p>{zh?'元素传送总数＝3×交换次数＋写入缓冲次数＋写回原序列次数。':'Total transfers = 3 × swaps + buffer writes + writebacks.'}</p>
    </section>
    <div className="grid xl:grid-cols-3 gap-4 items-start">{traces.map((t,i)=><Player key={reverseMethods[i]} trace={t} player={players[i]}/>)}</div>
  </>;
}
function Strip({items,valid,label,marks,reads}:{items:(Element|null)[];valid:number;label:string;marks:Record<number,string[]>;reads:number[]}){
  const {lang}=useLanguage(),zh=lang==='zh';
  return <div className="overflow-x-auto rounded-lg border bg-gray-50 p-2" role="region" aria-label={label} tabIndex={0}><div className="flex w-max items-stretch gap-2">{[...items,null].map((item,i)=><div key={i} data-position={i} data-value={item?.value} data-origin={item?.origin} className={`w-24 flex-shrink-0 rounded border p-2 text-center ${i===valid?'border-dashed border-purple-500':reads.includes(i)?'border-blue-600 bg-blue-100':'border-gray-200 bg-white'}`}>
    <div className="text-xs text-gray-600">{zh?'位置':'Position'} {i}</div>
    <div className="font-semibold break-all">{i===items.length?'end':item?.value??'—'}</div>
    {item&&<div className="text-xs">{zh?'原始':'Origin'} #{item.origin}</div>}
    {i===valid&&<div className="text-xs text-purple-800">{zh?'尾后':'Past end'}</div>}
    {i>=valid&&i<items.length&&<div className="text-xs text-gray-500">{zh?'本次无效':'Not valid now'}</div>}
    {!!marks[i]?.length&&<div className="text-xs text-blue-800 font-bold break-words">{marks[i].join(' · ')}</div>}
    {reads.includes(i)&&<div className="text-xs text-blue-800">{zh?'刚读取':'Just read'}</div>}
  </div>)}</div></div>;
}
function Player({trace,player}:{trace:ReverseStep[];player:ReturnType<typeof usePlayback>}){
  const {lang}=useLanguage(),zh=lang==='zh',ix=zh?0:1,s=trace[player.step],active=s.frames[s.frames.length-1];
  const marks:Record<number,string[]>={},bufMarks:Record<number,string[]>={};
  const mark=(map:Record<number,string[]>,pos:number|null|undefined,name:string)=>{if(pos!==null&&pos!==undefined)(map[pos]??=[]).push(name);};
  if(active){mark(marks,active.f,'f');mark(marks,active.m,'m');mark(marks,active.l,'l');}
  if(s.helper){for(const [k,v] of Object.entries(s.helper)){
    if(s.fn==='copy_n'&&k==='source')mark(marks,v,'source');
    if(s.fn==='copy_n'&&k==='buffer'||k==='buffer_end')mark(bufMarks,v,k);
    if(s.fn==='reverse_copy')mark(k==='result'?marks:bufMarks,v,k);
    if(s.fn==='swap_ranges_n'&&k!=='n')mark(marks,v,k);
  }}
  return <section className="learning-card min-w-0" data-testid={`reverse-${s.method}`} data-event={s.event} data-function={s.fn}>
    <h2 className="text-xl font-semibold text-blue-900">{reverseNames[s.method][ix]}</h2>
    <p data-testid="applied-input">n = {trace[0].sequence.length} · {zh?'已应用序列':'Applied sequence'}: [{trace[0].sequence.map(e=>e.value).join(', ')}]</p>
    {player.controls}<button className="learning-secondary" onClick={player.reset}>{zh?'重置':'Reset'}</button>
    <h3 className="font-semibold">{zh?'原序列：固定位置，标签随值移动':'Sequence: fixed positions, tags move with values'}</h3>
    <p className="text-sm break-words" data-testid="sequence-values">{zh?'当前序列':'Current sequence'}: [{s.sequence.map(e=>e.value).join(', ')}]</p>
    <div data-testid="sequence"><Strip items={s.sequence} valid={s.sequence.length} label={zh?'原序列位置':'Sequence positions'} marks={marks} reads={s.reads.filter(r=>r.space==='sequence').map(r=>r.index)}/></div>
    <p className="text-xs text-gray-600">{zh?'蓝色＋“刚读取”标出本步读过的位置，格内显示执行后的值；紫色虚线标出尾后。':'Blue + “Just read” marks positions read in this step; cells show post-statement values. Purple dashes mark past end.'}</p>
    {s.method==='adaptive'&&<><h3 className="font-semibold">{zh?'唯一共享缓冲区':'Single shared buffer'}</h3><p data-testid="buffer-state">{zh?'容量':'Capacity'} = {s.capacity} · {zh?'本次有效范围':'Valid range'} [0, {s.valid}) · {zh?'使用峰值':'Peak use'} = {s.counts.bufferPeak}</p><Strip items={s.buffer} valid={s.valid} label={zh?'共享缓冲区位置':'Shared buffer positions'} marks={bufMarks} reads={s.reads.filter(r=>r.space==='buffer').map(r=>r.index)}/></>}
    <div data-testid="counts" className="grid grid-cols-2 gap-2 text-sm">{countKeys.map((k,i)=><p key={k}>{countLabels[i][ix]}: <strong>{s.counts[k]}</strong></p>)}</div>
    <p role="status" data-testid="explanation">{reverseMessages[s.event][ix]}</p>
    {s.condition!==null&&<p>{zh?'条件结果':'Condition result'}: {s.condition?(zh?'真':'true'):(zh?'假':'false')}</p>}
    {!!s.pair.length&&<p>{zh?'刚交换位置':'Positions just swapped'}: ({s.pair.join(', ')})</p>}
    <h3 className="font-semibold">{zh?'反转调用栈（根在上）':'Reversal stack (root first)'}</h3>
    <div className="max-h-72 overflow-auto space-y-2" role="region" tabIndex={0} aria-label={zh?'反转调用帧':'Reversal call frames'} data-testid="frames">{s.frames.map(f=><div key={f.id} className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-sm break-words"><p>#{f.id} · [{f.start}, {f.start+f.n}) · {reversePhases[f.phase][ix]}</p><p className="font-mono">f={f.f} · n={f.n} · h={f.h??'—'} · m={f.m??'—'} · l={f.l??'—'}</p></div>)}{!s.frames.length&&<p>{zh?'无活动调用':'No active call'}</p>}</div>
    {s.helper&&<div className="learning-intro text-sm" data-testid="helper"><p>{zh?'辅助函数局部变量（独立副本）':'Helper locals (independent copies)'}: {s.fn}</p><p className="font-mono break-words">{Object.entries(s.helper).map(([k,v])=>`${k}=${v}`).join(' · ')}</p></div>}
    {s.returnPosition!==null&&<p data-testid="return-position">{zh?'最近返回位置':'Latest returned position'} · {s.returnSpace==='buffer'?(zh?'缓冲区':'Buffer'):(zh?'原序列':'Sequence')}: {s.returnPosition} {s.returnPosition===(s.returnSpace==='buffer'?s.valid:s.sequence.length)?'(end)':''}</p>}
    {s.event==='done'&&<p data-testid="result" className="learning-intro">{zh?'最终序列':'Final sequence'}: [{s.sequence.map(e=>e.value).join(', ')}]<br/>{zh?'返回':'Return'}: {s.method==='bidirectional'?'void':`${s.result} (end)`}</p>}
    <p className="text-sm text-gray-600">{s.fn==='copy_n'?(zh?'copy_n等价逐项展开伪代码':'Equivalent element-by-element copy_n pseudocode'):(zh?'ch11.h函数体（省略模板声明）':'ch11.h function body (template declarations omitted)')} · {zh?'箭头表示刚执行的语句':'Arrow marks the statement just executed'}</p>
    <TraceCode lines={reverseCode[s.fn]} active={s.event==='init'?'':s.line} label={zh?'刚执行的代码':'Code just executed'}/>
  </section>;
}
