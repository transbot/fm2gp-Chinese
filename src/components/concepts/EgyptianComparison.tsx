import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LearningShell, TermHelp } from '../common/LearningShell';
import { TraceCode } from '../common/TraceCode';
import { CalculationDisplay } from '../CalculationDisplay';
import { usePlayback } from './usePlayback';
import { egyptianTrace, parseEgyptianInput, MultiplyStep, MultiplyVersion } from '../../lib/algorithms/egyptianTrace';
import { egyptianCode, egyptianMessages } from './egyptianPresentation';
import { repoFile } from '../../data/bookCatalog';

const versions: MultiplyVersion[] = ['multiply0', 'multiply1', 'multiply4'];
const examples = [[15, 7], [16, 7], [41, 59], [1, 7], [0, 7], [-15, 7]];
const errors: Record<string, [string, string]> = {
  empty: ['请填写 n 和 a；空白不是零。', 'Both n and a are required; blank is not zero.'],
  integer: ['n 和 a 必须是整数，不能输入小数或其他字符。', 'n and a must be integers, without fractions or other characters.'],
  nRange: ['n 必须是 −256 到 256 的整数，所有步骤均可完整回放。', 'n must be an integer from −256 to 256 so every step can be replayed.'],
  aRange: ['a 必须是绝对值不超过 1,000,000 的整数。', 'a must be an integer with absolute value at most 1,000,000.'],
};
export function EgyptianComparison() {
  const { lang } = useLanguage(), zh = lang === 'zh';
  const [nRaw, setNRaw] = useState('15'), [aRaw, setARaw] = useState('7');
  const [revision, setRevision] = useState(0), [error, setError] = useState('');
  const [run, setRun] = useState<{ n: number; a: number; revision: number } | null>({ n: 15, a: 7, revision: 0 });
  const apply = (n = nRaw, a = aRaw) => {
    const next = revision + 1; setRevision(next);
    try { setRun({ ...parseEgyptianInput(n, a), revision: next }); setError(''); }
    catch (e) { setRun(null); setError((e as Error).message); }
  };
  return <LearningShell wide title={zh ? '埃及乘法：从递归到迭代' : 'Egyptian multiplication: from recursion to iteration'} description={zh ? '第2.1—2.2节 · 用相同的 n、a 比较加法次数与算法调用栈。' : 'Sections 2.1–2.2 · Compare additions and algorithm call stacks with the same n and a.'}>
    <form className="learning-card" onSubmit={e => { e.preventDefault(); apply(); }}>
      <div className="grid sm:grid-cols-2 gap-4"><label>{zh ? 'n：重复次数' : 'n: repetition count'}<input className="learning-input w-full" inputMode="numeric" value={nRaw} onChange={e => setNRaw(e.target.value)} /></label><label>{zh ? 'a：被累加的对象' : 'a: value to add'}<input className="learning-input w-full" inputMode="numeric" value={aRaw} onChange={e => setARaw(e.target.value)} /></label></div>
      <p className="text-sm text-gray-600">{zh ? '整数 |n| ≤ 256、|a| ≤ 1,000,000。逐次相加的轨迹随 n 增长；范围内保留全部步骤，每次中间运算均检查安全整数范围。应用输入后，三个版本一起暂停并回到初始化。编辑中的内容尚未应用。' : 'Integers |n| ≤ 256 and |a| ≤ 1,000,000. Repeated-addition traces grow with n; all steps are retained within this limit, and every intermediate operation is checked for safe-integer precision. Applying resets and pauses all three players. Draft edits are not applied yet.'}</p>
      <button className="learning-primary" type="submit">{zh ? '应用输入' : 'Apply input'}</button>
      <div className="flex flex-wrap gap-2">{examples.map(([n, a]) => <button type="button" className="learning-secondary" key={`${n}:${a}`} onClick={() => { setNRaw(String(n)); setARaw(String(a)); apply(String(n), String(a)); }}>{n} × {a}</button>)}</div>
      {error && <p role="alert" className="text-red-700">{errors[error][zh ? 0 : 1]}</p>}
    </form>
    {run && <ComparisonRun key={run.revision} n={run.n} a={run.a} />}
    <TermHelp term={zh ? '开发者笔记：加法相同，改进在哪里？' : 'Developer notes: equal additions, so what improves?'} href="/book/2#section-2-2">
      <p>{zh ? 'multiply0、multiply1 来自第2.1节；multiply4 展示第2.2节消除递归后的版本。只计作用于数据值的加法，包括倍增的 a＋a；比较、减半和 n−1 不计入。multiply1 与 multiply4 的加法次数相同，后者通过循环消除递归，减少所需栈空间。' : 'multiply0 and multiply1 come from Section 2.1; multiply4 shows the recursion-eliminating improvement in Section 2.2. Count only data additions, including doubling a + a; comparisons, halving, and n−1 are excluded. multiply1 and multiply4 use the same number of additions; the latter eliminates recursion with loops and needs less stack space.'}</p>
      <p>{zh ? '算法调用栈只统计 multiply0、multiply1、multiply4 和 mult_acc4 的活动帧。odd、half 在当前语句中解释，不单独入栈；输入包装独立展示，也不计帧。16×7 的 multiply4 不进入辅助函数，峰值 1 帧；15×7 会进入 mult_acc4，峰值 2 帧。这里没有假设编译器会做尾调用优化。' : 'The algorithm call stack counts active frames of multiply0, multiply1, multiply4, and mult_acc4 only. odd and half are operations within statements, not frames; the separately displayed input wrapper is excluded too. For multiply4, 16×7 needs at most 1 frame; 15×7 calls mult_acc4 and needs 2. No compiler tail-call optimization is assumed.'}</p>
      <p>{zh ? '算法自身的辅助空间：multiply0 为 O(n)，multiply1 为 O(log n)，multiply4 为 O(1)。回放快照是演示器额外保存的记录，不是算法的辅助空间。' : 'Algorithm auxiliary space: O(n) for multiply0, O(log n) for multiply1, and O(1) for multiply4. Replay snapshots are extra records stored by the visualizer, not the algorithm’s auxiliary space.'}</p>
      <p>{zh ? '递归下降时，multiply1 先计算调用参数里的倍增；返回时恢复调用者原来的 n、a，再决定是否加上 a。一次源码语句可包含几个事件，因此播放步数不等于加法次数。' : 'On descent, multiply1 doubles the call argument; on return it restores the caller’s original n and a before deciding whether to add a. One source statement can contain several events, so playback steps are not addition counts.'}</p>
      <p>{zh ? '包装扩展：n＝0 直接返回 0；n＜0 时使用 −n 和 −a。进入书中算法后 n≥1，a 的符号不影响控制流程。n 和 a 始终保持各自角色，不为减少步骤而交换。' : 'Wrapper extensions: n = 0 returns 0; n < 0 uses −n and −a. Inside each book algorithm n ≥ 1; the sign of a does not change control flow. n and a keep their roles and are never swapped to reduce steps.'}</p>
      <a className="learning-link" href={repoFile('配套代码(fm2gpcode)/ch02.h')}>multiply0 · multiply1 · multiply4 · mult_acc4 — ch02.h</a>
    </TermHelp>
    <Link className="learning-link" to="/power?route=book">{zh ? '继续：把加法换成其他运算，得到泛型幂' : 'Continue: replace addition with another operation for generic powers'}</Link>
  </LearningShell>;
}

function ComparisonRun({ n, a }: { n: number; a: number }) {
  const { lang } = useLanguage(), zh = lang === 'zh';
  const traces = useMemo(() => versions.map(v => egyptianTrace(n, a, v)), [n, a]);
  const normalizedN = Math.abs(n), normalizedA = n < 0 ? -a : a;
  const doubling = [];
  for (let power = 1, value = normalizedA; power <= normalizedN; power *= 2, value *= 2) doubling.push({ powerOfTwo: power, value, isSelected: Math.floor(normalizedN / power) % 2 === 1 });
  return <>
    <section className="learning-card"><h2 className="text-xl font-semibold">{zh ? '当前问题与完整运行比较' : 'Applied problem and complete-run comparison'}: {n} × ({a})</h2><p>{zh ? '下表来自各自完整执行轨迹；下方播放器的计数显示当前步骤。' : 'This table comes from each complete trace; player counters below describe the current step.'}</p>
      <div className="overflow-x-auto" role="region" tabIndex={0} aria-label={zh ? '完整运行计数比较' : 'Complete-run count comparison'}><table className="w-full text-left"><thead><tr>{(zh ? ['版本', '结果', '数据加法', '峰值活动帧'] : ['Version', 'Result', 'Data additions', 'Peak active frames']).map(t => <th key={t} className="p-2">{t}</th>)}</tr></thead><tbody>{traces.map((steps, i) => { const s = steps[steps.length - 1]; return <tr key={versions[i]} data-testid={`summary-${versions[i]}`}><th className="p-2 font-mono">{versions[i]}</th><td className="p-2">{s.result}</td><td className="p-2">{s.additions}</td><td className="p-2">{s.peak}</td></tr>; })}</tbody></table></div>
    </section>
    <div className="grid xl:grid-cols-3 gap-4 items-start">{traces.map((steps, i) => <MultiplyRun key={versions[i]} version={versions[i]} steps={steps} />)}</div>
    {normalizedN > 0 && <details className="learning-card"><summary className="cursor-pointer font-semibold">{zh ? '查看倍增表：把重复次数拆成二的幂' : 'View doubling table: split the repetition count into powers of two'}</summary><p>{zh ? '这是计算关系的汇总，不是第四种算法，也不参与上方计数。负 n 已按入口包装规则处理。' : 'This summarizes the arithmetic relationship, not a fourth algorithm; it does not contribute to the counts above. Negative n has been normalized by the wrapper.'}</p><CalculationDisplay steps={doubling} result={n * a} firstNumber={normalizedN} secondNumber={normalizedA} lang={lang} /></details>}
  </>;
}

function MultiplyRun({ version, steps }: { version: MultiplyVersion; steps: MultiplyStep[] }) {
  const { lang } = useLanguage(), zh = lang === 'zh';
  const playback = usePlayback(steps.length), s = steps[playback.step], top = s.frames[s.frames.length - 1];
  return <section className="learning-card min-w-0" data-testid={version} aria-label={version}>
    <h2 className="text-xl font-semibold font-mono">{version}</h2><p className="text-sm text-gray-600">{version === 'multiply4' ? zh ? '第2.2节 · 迭代与累积' : 'Section 2.2 · Iteration and accumulation' : zh ? '第2.1节 · 递归' : 'Section 2.1 · Recursion'}</p>
    {playback.controls}<button className="learning-secondary" onClick={playback.reset}>{zh ? '重置' : 'Reset'}</button>
    <div data-testid="variables" className="learning-intro font-mono break-words">n = {top?.n ?? '—'} · a = {top?.a ?? '—'}{top?.r !== null && top?.r !== undefined && <> · r = {top.r}</>}<br />{zh ? '结果' : 'Result'}: <strong data-testid="result">{s.result ?? '—'}</strong></div>
    <p data-testid="counts">{zh ? '数据加法' : 'Data additions'}: {s.additions}<br />{zh ? '活动帧' : 'Active frames'}: {s.frames.length} · {zh ? '峰值' : 'Peak'}: {s.peak}</p>
    <p role="status" data-testid="explanation">{egyptianMessages[s.event][zh ? 0 : 1]}</p>
    {s.calculation && <p className="font-mono break-all">{s.calculation}{s.condition !== null && ` → ${s.condition ? zh ? '真' : 'true' : zh ? '假' : 'false'}`}</p>}
    {s.returned !== null && <p>{zh ? '正在传递的返回值：' : 'Return value being passed: '}{s.returned}</p>}
    <h3 className="font-semibold">{zh ? '算法调用栈（栈顶在上）' : 'Algorithm call stack (top first)'}</h3>
    <div role="region" tabIndex={0} aria-label={zh ? `${version} 算法调用栈` : `${version} algorithm call stack`} className="max-h-72 overflow-y-auto space-y-2" data-testid="stack">
      {!s.frames.length && <p className="text-gray-600">{zh ? '空栈：当前没有活动的算法帧。' : 'Empty: no active algorithm frames.'}</p>}
      {[...s.frames].reverse().map((f, i) => <div key={f.id} data-frame={f.fn} className={`rounded-lg border p-2 text-sm font-mono break-words ${i === 0 ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}><strong>{i === 0 ? '→ ' : ''}{f.fn} #{f.id}</strong><p>n = {f.n}, a = {f.a}{f.r !== null && `, r = ${f.r}`}</p>{f.result !== null && <p>{f.fn === 'multiply1' ? 'result' : zh ? '当前返回表达式的值' : 'Current return-expression value'} = {f.result}</p>}{f.argument !== null && <p>{zh ? '已计算的倍增参数' : 'Evaluated doubled argument'} = {f.argument}</p>}</div>)}
    </div>
    <p className="text-sm text-gray-600">{s.fn === 'wrapper' ? zh ? '入口包装伪代码（不计算法帧）' : 'Input-wrapper pseudocode (not an algorithm frame)' : `${zh ? '刚执行的函数' : 'Function just executed'}: ${s.fn}`}</p>
    <TraceCode lines={egyptianCode[s.fn]} active={s.line} label={zh ? `${version} 执行代码` : `${version} executed code`} />
  </section>;
}
