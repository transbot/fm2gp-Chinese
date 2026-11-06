import {useEffect, useState} from 'react';
import {useLanguage} from '../../context/LanguageContext';
import {translations} from '../../i18n/translations';
import {LearningShell} from '../common/LearningShell';
import {TraceCode} from '../common/TraceCode';
import {usePlayback} from '../concepts/usePlayback';
import {createDefaultCycleInput, cycleVisualization, generateRandomPermutation, type CycleInput} from '../../lib/algorithms/cycle';
import {mainExample, traceCycles, parseCycleDraft, decompositionLines, driverLines, helperLines, type CycleFrame, type DraftError} from '../../lib/algorithms/cycleTrace';

const storageKey='fm2gp:cycle:v1:run';
function makeRun(input:CycleInput, initialStep=0) {
  const frames=traceCycles(input);
  return {input,frames,initialStep:Math.min(frames.length-1,Math.max(0,initialStep))};
}
function restoreRun() {
  try {
    const saved=JSON.parse(sessionStorage.getItem(storageKey) ?? 'null');
    if (saved && Array.isArray(saved.array) && Array.isArray(saved.to)) {
      const input={array:saved.array,permutation:saved.to};
      if (cycleVisualization.validateInput(input).valid)
        return makeRun(input, Number.isSafeInteger(saved.step) ? saved.step : 0);
    }
  } catch { /* Storage is optional. */ }
  return makeRun(mainExample);
}

function explain(frame:CycleFrame, zh:boolean):string {
  const l=frame.locals;
  switch(frame.event) {
    case 'init': return zh?'从下标 0 开始，沿目的地表寻找循环。':'Start at index 0 and follow destinations to find cycles.';
    case 'start_cycle': return (zh?'开始新的循环，起点为 ':'Start a new cycle at ')+frame.position;
    case 'visit': return (zh?'标记已访问的位置 ':'Mark this index visited: ')+frame.position;
    case 'follow': return (zh?'沿 to 到达位置 ':'Follow to and arrive at index ')+frame.position;
    case 'complete_cycle': return zh?'回到本循环的起点，将它加入分解结果。':'Back at the start; record this cycle.';
    case 'done': return zh?'所有位置已分解。下一阶段沿 from 取值。':'Decomposition complete. Next, read along from.';
    case 'skip': return zh?'这个位置映到自身，跳过平凡循环。':'This index maps to itself. Skip the trivial cycle.';
    case 'call': return (zh?'伴读调度调用辅助函数，起点为 ':'The companion driver calls the helper at ')+frame.position;
    case 'save': return (zh?'复制到临时值，原始位置为 ':'Save a temporary copy from original index ')+l!.tmp.origin;
    case 'start': return (zh?'记住本次起点 ':'Remember the starting index ')+l!.start;
    case 'source': return l!.j===l!.start ? (zh?'来源已回到起点，退出循环。':'The source has reached start; exit the loop.') : (zh?'下一次写入：':'Next write: ')+l!.i+' ← '+l!.j;
    case 'write': return l!.i+' ← '+l!.j+(zh?'。已复制，来源格仍保留当前值。':'. Copied; the source cell still holds its value.');
    case 'advance': return (zh?'更新待填位置 i = ':'Advance the destination, i = ')+l!.i;
    case 'close': return l!.i+' ← tmp'+(zh?'。写回保存的元素，循环闭合。':'. Restore the saved element to close the cycle.');
    case 'returned': return zh?'辅助函数已返回，局部变量结束。':'The helper has returned; its locals are out of scope.';
    default: return zh?'逐列核对：每格的原始位置标签等于该格的 from。':'Check each column: the original index of its element equals from at this destination.';
  }
}

function FrameView({frame}:{frame:CycleFrame}) {
  const {lang}=useLanguage(), zh=lang==='zh';
  const f=frame, l=f.locals;
  const phase={decompose:zh?'分解循环':'Decompose cycles',move:zh?'搬移':'Move',check:zh?'核对结果':'Check result'};
  const code=f.phase==='decompose'?decompositionLines:l?helperLines:driverLines;
  const caption=l?'rotate_cycle_from':zh?'伴读调度':'Companion driver';
  const fixedPoints=f.to.filter((d,i)=>d===i).length;
  const nontrivial=f.cycles.filter(c=>c.length>1).length;
  const rows:[string,number[]][]=[
    [zh?'位置':'Index',f.to.map((_,i)=>i)], [zh?'目的地 to':'Destination to',f.to],
    [zh?'来源 from':'Source from',f.from], [zh?'当前值':'Value',f.cells.map(c=>c.value)],
    [zh?'原始位置':'Original index',f.cells.map(c=>c.origin)]
  ];
  return <section id="cycle-frame" data-event={f.event} className="learning-card min-w-0">
    <ol className="flex flex-wrap gap-3 text-sm">{(Object.keys(phase) as (keyof typeof phase)[]).map(p=><li key={p} aria-current={p===f.phase?'step':undefined} className={p===f.phase?'font-bold text-blue-800':''}>{phase[p]}</li>)}</ol>
    <h2 className="text-xl font-semibold">{phase[f.phase]}</h2>
    <p className="learning-intro" role="status">{explain(f,zh)}</p>
    <div tabIndex={0} className="overflow-x-auto"><table className="min-w-full text-sm text-center">
      <caption className="text-left mb-2">{zh?'固定位置与移动的元素':'Fixed positions and moving elements'}</caption>
      <tbody>{rows.map(([name,values],r)=><tr key={r}><th scope="row" className="text-left whitespace-nowrap p-1">{name}</th>
        {values.map((v,i)=><td key={i} className={'border px-2 py-1 font-mono '+(l?.i===i?'bg-blue-100':l?.j===i?'bg-amber-100':'')}>{v}</td>)}</tr>)}</tbody>
    </table></div>
    <p>{zh?'循环（位置）':'Cycles (indices)'} · {f.cycles.map(c=>'('+c.join(' ')+')').join(' ') || '—'}</p>
    {f.currentCycle.length>0 && <p>{zh?'当前循环（沿 to）':'Current cycle (along to)'} · {f.currentCycle.join(' → ')}</p>}
    {l && <p className="font-mono" data-locals>i={l.i} · j={l.j??'—'} · start={l.start??'—'} · tmp={l.tmp.value} ({zh?'原始位置':'origin'} {l.tmp.origin})</p>}
    <p data-counts className="font-semibold">{zh?'临时复制':'Temporary copies'} {f.copies} · {zh?'数组写入':'Array writes'} {f.writes} · {zh?'总传送':'Transfers'} {f.copies+f.writes}</p>
    {f.phase==='check' ? <div className="space-y-2">
      <p>{f.cells.every((c,i)=>c.origin===f.from[i])
        ? (zh?'所有来源标签均与 from 相符。':'Every original index matches from.')
        : (zh?'来源标签与 from 不符。':'An original index differs from from.')}</p>
      <p>{zh?'逐格来源':'Source by destination'} · {f.cells.map((c,i)=>i+'←'+c.origin).join(' · ')}</p>
      <p>{zh?'不动点':'Fixed points'} u={fixedPoints} · {zh?'非平凡循环':'Nontrivial cycles'} v={nontrivial} · n−u+v={f.to.length-fixedPoints+nontrivial}</p>
    </div>
      : <div><h3 className="font-semibold mb-2">{caption}</h3><TraceCode lines={code} active={f.event} label={caption}/></div>}
  </section>;
}

export function Cycle() {
  const {lang}=useLanguage(), zh=lang==='zh', t=translations[lang];
  const [run,setRun]=useState(restoreRun);
  const [array,setArray]=useState(()=>run.input.array.join(', '));
  const [to,setTo]=useState(()=>run.input.permutation.join(', '));
  const [error,setError]=useState<DraftError|null>(null);
  const player=usePlayback(run.frames.length,run.initialStep);
  useEffect(()=>{
    try {sessionStorage.setItem(storageKey,JSON.stringify({array:run.input.array,to:run.input.permutation,step:player.step}));}
    catch { /* Playback also works without session storage. */ }
  },[run,player.step]);
  const apply=(input:CycleInput)=>{
    player.reset();
    setRun(makeRun(input));setArray(input.array.join(', '));setTo(input.permutation.join(', '));setError(null);
  };
  const submit=()=>{
    const parsed=parseCycleDraft(array,to);
    if ('field' in parsed) {player.pause();setError(parsed);return;}
    apply(parsed);
  };
  const draft=array!==run.input.array.join(', ') || to!==run.input.permutation.join(', ');
  const errors={empty:t.cycleEmptyArray,integer:t.cycleInvalidInteger,capacity:t.cycleTooLarge,permutation:t.cycleInvalidPermutation};
  const preset=(label:string,input:CycleInput)=><button className="learning-secondary" onClick={()=>apply(input)}>{label}</button>;
  return <LearningShell title={t.cycleTitle} description={t.cycleDescription} wide>
    <form className="learning-card" onSubmit={e=>{e.preventDefault();submit();}}>
      <p>{zh?'位置从 0 开始。输入 1 至 20 个十进制安全整数，以逗号或空格分隔。to 必须恰好包含每个下标一次。':'Indices start at 0. Enter 1–20 decimal safe integers separated by commas or spaces. Use each index exactly once in to.'}</p>
      {(['array','to'] as const).map(field=><div key={field}>
        <label className="block">{field==='array'?t.array:(zh?'排列目的地 to':'Permutation destinations to')}
          <input className="learning-input w-full mt-1" value={field==='array'?array:to} aria-invalid={error?.field===field} aria-describedby={error?.field===field?'cycle-error':undefined}
            onChange={e=>{(field==='array'?setArray:setTo)(e.target.value);setError(null);}}/>
        </label>
        {error?.field===field && <p id="cycle-error" role="alert" className="text-red-700">{errors[error.error]}</p>}
      </div>)}
      <div className="flex flex-wrap items-center gap-3"><button className="learning-primary" type="submit">{zh?'应用输入':'Apply input'}</button>
        {draft && <span>{zh?'草稿待应用':'Unapplied changes'}</span>}
      </div>
    </form>
    <div className="flex flex-wrap gap-2">
      {preset(zh?'六元素书例':'Six-element example',mainExample)}
      {preset(zh?'四元素书例':'Four-element example',{array:[0,1,2,3],permutation:[1,3,0,2]})}
      {preset(zh?'重复值例':'Duplicate values',{...mainExample,array:[2,1,2,1,2,1]})}
      {preset(zh?'八元素例':'Eight-element example',createDefaultCycleInput())}
      <button className="learning-secondary" onClick={()=>{const permutation=generateRandomPermutation(5+Math.floor(Math.random()*6));apply({permutation,array:permutation.map((_,i)=>(i+1)*10)});}}>{t.random}</button>
    </div>
    <FrameView frame={run.frames[player.step]}/>
    {player.controls}
    <button className="learning-secondary" onClick={player.reset}>{t.reset}</button>
    <details className="learning-note"><summary>{zh?'开发者笔记':'Developer notes'}</summary><p>{t.devNoteCycle}</p></details>
  </LearningShell>;
}
