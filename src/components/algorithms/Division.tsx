import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LearningShell, TermHelp } from '../common/LearningShell';
import { TraceCode } from '../common/TraceCode';
import { usePlayback } from '../concepts/usePlayback';
import { divisionCode, divisionErrors, divisionMessages, divisionNames } from '../concepts/divisionPresentation';
import { divisionMethods, divisionTrace, parseDivisionInput, DivisionErrors, DivisionMethod, DivisionStep } from '../../lib/algorithms/divisionTrace';
import { repoFile } from '../../data/bookCatalog';
const examples = [[45,6],[42,6],[5,6],[6,6],[0,6],[47,7],[256,1],[770,3],[1000000,1000000]];
export function Division() {
  const { lang } = useLanguage(), zh = lang === 'zh';
  const [draft, setDraft] = useState({ A: '45', B: '6' });
  const [errors, setErrors] = useState<DivisionErrors>({});
  const [run, setRun] = useState<{ A: number; B: number; rawA: string; rawB: string; revision: number } | null>({ A:45, B:6, rawA:"45", rawB:"6", revision:0 });
  const [revision, setRevision] = useState(0);
  const apply = (A = draft.A, B = draft.B) => {
    const parsed = parseDivisionInput(A,B), next = revision+1; setRevision(next);
    if (parsed.ok) { setRun({ A:parsed.A, B:parsed.B, rawA:A, rawB:B, revision:next }); setErrors({}); }
    else { setRun(null); setErrors(parsed.errors); }
  };
  const pending = !run || draft.A !== run.rawA || draft.B !== run.rawB;
  return <LearningShell wide title={zh ? '求余与求商：倍增和斐波那契' : 'Remainders and quotients: doubling and Fibonacci'} description={zh ? '第4.5—4.6节 · 用同一组输入比较三种求余方法，再复用倍增过程同时求商与余数。' : 'Sections 4.5–4.6 · Compare three remainder methods with the same input, then reuse doubling to compute quotient and remainder together.'}>
    <form className="learning-card" onSubmit={e=>{e.preventDefault();apply();}}>
      <div className="grid sm:grid-cols-2 gap-4">{(['A','B'] as const).map(field=><div key={field}><label className="block" htmlFor={`division-${field}`}>{field === 'A' ? zh ? 'A：原始被除数' : 'A: original dividend' : zh ? 'B：原始除数' : 'B: original divisor'}</label><input id={`division-${field}`} className="learning-input w-full mt-2" inputMode="numeric" value={draft[field]} aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `division-error-${field}` : undefined} onChange={e=>{setDraft({...draft,[field]:e.target.value});setErrors({...errors,[field]:undefined});}}/>{errors[field] && <p role="alert" id={`division-error-${field}`} className="text-red-700 mt-2">{divisionErrors[errors[field]!][zh?0:1]}</p>}</div>)}</div>
      <p className="text-sm text-gray-600">{zh ? 'A 为 0—1,000,000，B 为 1—1,000,000 的整数；商最多 256（A < 257B），范围内保留全部步骤。内部候选量可超过输入上限，每次运算仍检查安全整数范围。' : 'Integer A: 0–1,000,000; integer B: 1–1,000,000. Quotient up to 256 (A < 257B); every step is retained. Internal candidates may exceed the input limit; every operation is checked for safe-integer precision.'}</p>
      {pending && <p role="status" data-testid="pending-input" className="text-amber-800">{zh ? '待应用：编辑内容尚未应用。点击“应用输入”会暂停并重置全部播放器。' : 'Pending: draft edits are not applied. Apply input to pause and reset every player.'}</p>}
      <button type="submit" className="learning-primary">{zh ? '应用输入' : 'Apply input'}</button>
      <div className="flex flex-wrap gap-2">{examples.map(([A,B])=><button type="button" className="learning-secondary" key={`${A}:${B}`} onClick={()=>{setDraft({A:String(A),B:String(B)});apply(String(A),String(B));}}>{A} ÷ {B}</button>)}</div>
    </form>
    {run && <DivisionComparison key={run.revision} A={run.A} B={run.B}/>}
    <TermHelp term={zh ? '开发者笔记：哪些运算被计数？' : 'Developer notes: which operations count?'} href="/book/4#section-4-6">
      <p>{zh ? '逐次减法每次扣掉一个 B；倍增先找到较大的候选量，再逐次减半；斐波那契方法用相邻候选量的和向前增长，用 c−b 回退，所以无需减半。b 是源码中的运行变量，斐波那契方法会修改它；原始除数始终单独记作 B。' : 'Repeated subtraction removes one B at a time. Doubling finds a large candidate and then halves it. Fibonacci grows candidates by adding neighbors and recovers earlier candidates with c−b, so it needs no halving. Source variable b changes in the Fibonacci method; the original divisor is always separately named B.'}</p>
      <p>{zh ? '计数来自实际执行的语句。largest_doubling 的条件每执行一次就计算一次 a−b，包括最后一次失败判断；这会增加减法次数，但不会扣减余数。斐波那契回退的 c−b 也算减法。比较、赋值、函数进入和返回不计算术次数。商余共享版本还统计 n＋n 与 n＋1。图示、等式校验和回放操作不计入算法运算。' : 'Counts come from executed statements. Each largest_doubling condition computes a−b, including the final failed check: it counts as subtraction but does not deduct the remainder. Fibonacci recovery c−b also counts as subtraction. Comparisons, assignments, function entry and return add no arithmetic counts. The shared quotient/remainder version also counts n+n and n+1. Visuals, identity checks, and replay controls are excluded from algorithm counts.'}</p>
      <p>{zh ? '45÷6：逐次减法为加法0、减法7、减半0；倍增为2、6、2；斐波那契为4、6、0。余数实际扣减次数分别为7、3、2。扣减更少不等于全部算术运算更少；效率还取决于输入和每类运算的代价。' : 'For 45÷6, addition/subtraction/halving counts are 0/7/0 for repeated subtraction, 2/6/2 for doubling, and 4/6/0 for Fibonacci. Actual remainder deductions are 7, 3, and 2. Fewer deductions do not imply fewer total arithmetic operations; efficiency also depends on the input and the cost of each operation.'}</p>
      <p>{zh ? '逐次减法的时间随商线性增长；两种快速求余方法的候选量阶段随商对数增长。四种算法自身都只需常数个变量，即 O(1) 辅助空间。完整回放快照属于演示器的存储。' : 'Repeated subtraction takes time linear in the quotient; the candidate stages of both fast remainder methods grow logarithmically with it. All four algorithms need only a constant number of variables, or O(1) auxiliary space. Complete replay snapshots are storage used by the visualizer.'}</p>
      <p>{zh ? 'quotient_remainder 复用求余流程，并保存已经得到的商：这是第4.6节的“有用的返回值法则”。在成对更新完成时 A＝n×c＋a；拆开的赋值中间不应要求等式成立。0≤r<B 是终止后的余数范围，不是所有中间步骤都满足的条件。' : 'quotient_remainder reuses the remainder procedure and preserves the quotient it has computed: the Law of Useful Return in Section 4.6. A=n×c+a holds after complete paired updates; it need not hold between the separate assignments. The bound 0≤r<B is a final remainder condition, not a condition for every intermediate step.'}</p>
      <a className="learning-link" href={repoFile('配套代码(fm2gpcode)/ch04.h')}>largest_doubling · remainder · remainder_fibonacci · quotient_remainder — ch04.h</a>
      <Link className="learning-link block" to="/book/4#exercise-4-6">{zh ? '习题4.6：跟踪 45÷6 的斐波那契求余' : 'Exercise 4.6: trace the Fibonacci remainder of 45÷6'}</Link>
      <a className="learning-link block" href={repoFile('solutions/4_6.md')}>{zh ? '习题4.6参考解答' : 'Exercise 4.6 reference solution'}</a>
    </TermHelp>
  </LearningShell>;
}
function DivisionComparison({A,B}:{A:number;B:number}) {
  const {lang}=useLanguage(),zh=lang==='zh';
  const traces=useMemo(()=>divisionMethods.map(m=>divisionTrace(A,B,m)),[A,B]);
  const repeated=usePlayback(traces[0].length),doubling=usePlayback(traces[1].length),fibonacci=usePlayback(traces[2].length),quotient=usePlayback(traces[3].length);
  const players=[repeated,doubling,fibonacci,quotient];
  return <>
    <section className="learning-card"><h2 className="text-xl font-semibold">{zh?'当前问题与完整过程比较':'Applied problem and complete-run comparison'}: {A} ÷ {B}</h2><p>{zh?'总数来自完整轨迹；最后一列与各播放器的当前快照同步。四个播放器彼此独立。':'Totals come from complete traces; the last column follows each player’s current snapshot. The four players are independent.'}</p>
      <div role="region" aria-label={zh?'运算计数比较':'Operation count comparison'} tabIndex={0} className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{(zh?['方法','最终余数','加法','减法','减半','余数扣减','当前执行状态']:['Method','Final remainder','Additions','Subtractions','Halvings','Deductions','Current execution']).map(x=><th className="p-2" key={x}>{x}</th>)}</tr></thead><tbody>{traces.map((t,i)=>{const s=t[t.length-1],now=t[players[i].step];return <tr key={s.method} data-testid={`summary-${s.method}`}><th className="p-2">{divisionNames[s.method][zh?0:1]}</th>{[s.result,s.counts.add,s.counts.subtract,s.counts.half,s.counts.deductions].map((v,j)=><td className="p-2 border-t" key={j}>{v}</td>)}<td className="p-2 border-t" data-testid={`current-${s.method}`}>{players[i].step+1}/{t.length} · a = {now.a}<br/>{divisionMessages[now.event][zh?0:1]}</td></tr>;})}</tbody></table></div>
    </section>
    <div className="grid xl:grid-cols-3 gap-4 items-start">{traces.slice(0,3).map((t,i)=><DivisionPlayer key={divisionMethods[i]} steps={t} playback={players[i]}/>)}</div>
    <details className="learning-card" data-testid="quotient-disclosure"><summary className="font-semibold cursor-pointer text-lg">{divisionNames.quotient[zh?0:1]}</summary><p>{zh?'复用 largest_doubling 和求余的回退过程，再同步维护 n。源码中的 c 减半与 n 倍增分步展示；完整更新后才标出检查点。':'Reuse largest_doubling and remainder recovery while maintaining n. The source assignments that halve c and double n are displayed separately; checkpoints mark completed updates.'}</p><DivisionPlayer steps={traces[3]} playback={quotient}/></details>
  </>;
}
function DivisionPlayer({steps,playback}:{steps:DivisionStep[];playback:ReturnType<typeof usePlayback>}) {
  const {lang}=useLanguage(),zh=lang==='zh',s=steps[playback.step],method:DivisionMethod=s.method;
  const q=method==='quotient'?s.n:s.result===null?null:(s.A-s.result)/s.B;
  return <section data-testid={`division-${method}`} className="learning-card min-w-0">
    <h2 className="text-xl font-semibold text-blue-900">{divisionNames[method][zh?0:1]}</h2>
    <p data-testid="original-input" className="font-mono font-semibold">A = {s.A} · B = {s.B}</p>
    <p className="text-sm text-gray-600">{zh?'原始输入固定；下方小写字母是运行变量。':'Original inputs stay fixed; lowercase letters below are running variables.'}</p>
    {playback.controls}<button className="learning-secondary" onClick={playback.reset}>{zh?'重置':'Reset'}</button>
    <div className="learning-intro font-mono break-words" data-testid="variables">a = {s.a} · b = {s.b} · c = {s.c??'—'} · n = {s.n??'—'} · tmp = {s.tmp??'—'}</div>
    {s.helper && <div className="rounded-lg border border-blue-200 bg-blue-50 p-3" data-testid="helper"><p>{zh?'辅助函数的局部变量（调用者变量不变）':'Helper-local variables (caller variables unchanged)'}</p><p className="font-mono break-words">largest_doubling: a = {s.helper.a} · b = {s.helper.b}</p></div>}
    <div aria-hidden="true" className="h-3 flex rounded-full overflow-hidden bg-gray-200"><div className="bg-blue-500" style={{width:`${s.A?s.a/s.A*100:0}%`}}/></div>
    <p>{zh?'蓝色：当前剩余量':'Blue: amount remaining'} a = {s.a}; {zh?'已扣除':'Removed'} {s.A-s.a}</p>
    <p data-testid="counts">{zh?'加法':'Additions'}: {s.counts.add} · {zh?'减法':'Subtractions'}: {s.counts.subtract} · {zh?'减半':'Halvings'}: {s.counts.half}<br/>{zh?'余数被扣减的次数':'Remainder deductions'}: {s.counts.deductions}</p>
    <p role="status" data-testid="explanation">{divisionMessages[s.event][zh?0:1]}</p>
    {s.calculation && <p className="font-mono break-all">{s.calculation}{s.condition!==null && ` → ${s.condition?(zh?'真':'true'):(zh?'假':'false')}`}</p>}
    {method==='quotient' && s.result===null && <p data-testid="invariant" className="learning-intro">{s.invariant==='holds'?`${zh?'完整更新后的等式':'After a complete update'}: ${s.A} = ${s.n} × ${s.c} + ${s.a}`:s.invariant==='updating'?(zh?'相关变量正在更新；下一次成对更新完成后再检查 A＝n×c＋a。':'Related variables are updating; check A=n×c+a after the paired update is complete.'):(zh?'尚未建立 n、c；此阶段不显示商余等式。':'n and c are not established yet; no quotient identity is asserted at this stage.')}</p>}
    <p>{zh?'返回的余数':'Returned remainder'}: <strong data-testid="result">{s.result??'—'}</strong></p>
    {s.result!==null && <p data-testid="final-identity" className="learning-intro">{s.A} = {q} × {s.B} + {s.result}<br/>0 ≤ {s.result} &lt; {s.B} · {zh?'已验证最终结果':'Final result verified'}{method!=='quotient'&&<span className="block text-sm">{zh?'这里的商仅用于结果校验；求余算法本身没有维护 n。':'This quotient is used only to check the result; the remainder algorithm did not maintain n.'}</span>}</p>}
    <div role="region" aria-label={zh?'余数扣减轨迹':'Remainder deduction history'} tabIndex={0} className="overflow-auto max-h-28 rounded-lg bg-gray-50 p-3"><p className="font-mono w-max" data-testid="remainder-path">{s.remainders.join(' → ')}</p></div>
    {method==='fibonacci' && <div role="region" aria-label={zh?'增长阶段的候选量对':'Candidate pairs during growth'} tabIndex={0} className="overflow-auto max-h-28 rounded-lg bg-gray-50 p-3"><p className="font-mono w-max" data-testid="growth-pairs">(b,c): {s.pairs.map(p=>`(${p.join(',')})`).join(' → ')}</p></div>}
    <p className="text-sm text-gray-600">{method==='repeated'?(zh?'逐次减法基线伪代码':'Repeated-subtraction baseline pseudocode'):(zh?'书中源码（仅调整换行）':'Book source (line breaks adjusted)')} · {zh?'箭头表示刚执行的语句':'Arrow marks the statement just executed'}</p>
    <TraceCode lines={divisionCode[s.fn]} active={s.line} label={zh?'刚执行的代码':'Code just executed'}/>
  </section>;
}
