import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LearningShell, TermHelp } from '../common/LearningShell';
import { TraceCode, TraceLine } from '../common/TraceCode';
import { usePlayback } from './usePlayback';
import { parsePolynomialInput, polynomialExpressions, polynomialTrace, PolynomialEvent, PolynomialMode } from '../../lib/algorithms/polynomial';
import { repoFile } from '../../data/bookCatalog';

const hornerCode: TraceLine[] = [
  { id: 'entry', text: 'R polynomial_value(I first, I last, R x) {' },
  { id: 'empty', text: '    if (first == last) return R(0);' },
  { id: 'seed', text: '    R sum(*first);' },
  { id: 'next', text: '    while (++first != last) {' },
  { id: 'multiply', text: '        sum *= x;' },
  { id: 'add', text: '        sum += *first;' },
  { id: 'close', text: '    }' },
  { id: 'return', text: '    return sum;' },
  { id: 'end', text: '}' },
];
const directCode: TraceLine[] = [
  { id: 'entry', text: 'direct_value(coefficients, x) {' },
  { id: 'empty', text: '    if (coefficients.empty()) return 0;' },
  { id: 'loop', text: '    for (i = 0; i < m; ++i) {' },
  { id: 'term', text: '        term = coefficients[i];' },
  { id: 'multiply', text: '        repeat (m - 1 - i) times: term *= x;' },
  { id: 'seed', text: '        if (i == 0) sum = term;' },
  { id: 'collect', text: '        else sum += term;' },
  { id: 'close', text: '    }' },
  { id: 'return', text: '    return sum;' },
  { id: 'end', text: '}' },
];
const messages: Record<PolynomialEvent, [string, string]> = {
  init: ['初始化：按输入顺序保留每个系数，包括零。', 'Initialize: preserve every coefficient in input order, including zeros.'],
  seed: ['直接初始化总和，不执行加法。', 'Initialize the sum directly, without an addition.'],
  select: ['移到下一个系数；尚未执行算术运算。', 'Move to the next coefficient; no arithmetic yet.'],
  term: ['从当前系数开始计算这一项。', 'Start this term from its coefficient.'],
  multiply: ['执行乘法；变量与乘法计数已更新。', 'Execute multiplication; the variable and multiplication count are updated.'],
  add: ['加上当前系数，完成这一轮累积。', 'Add the current coefficient to complete this accumulation.'],
  collect: ['将当前项加入总和。', 'Add the current term to the sum.'],
  done: ['返回总和。两种方法的步骤数可以不同。', 'Return the sum. The two methods can have different numbers of steps.'],
  empty: ['明确选择空序列：返回零，不执行乘法或加法。', 'An explicitly empty sequence returns zero, with no multiplication or addition.'],
  overflow: ['下一次运算将超出安全整数范围，已停止；变量和计数保留最后的精确状态。', 'The next operation would exceed the safe-integer range. Stopped at the last exact state without incrementing its count.'],
};
const errors: Record<string, [string, string]> = {
  empty: ['请填写系数与 x；留空不是零。空序列请明确输入 []。', 'Enter coefficients and x; blank is not zero. Use [] for an explicitly empty sequence.'],
  integer: ['x 必须是整数。', 'x must be an integer.'],
  format: ['系数须为十进制整数数组，例如 [2,0,4,5]；不接受小数或科学记数法。', 'Use decimal integer coefficients, such as [2,0,4,5]; fractions and scientific notation are not accepted.'],
  capacity: ['最多支持 33 个系数，以便完整回放。', 'At most 33 coefficients are supported for complete replay.'],
  range: ['系数与 x 须为绝对值不超过 1,000,000 的整数。', 'Coefficients and x must be integers with absolute value at most 1,000,000.'],
};
const examples = ['[2,3,4,5]', '[2,0,4,5]', '[0,2,3]', '[4,7,-1,27,-3]', '[]'];

export function Horner() {
  const { lang } = useLanguage(), zh = lang === 'zh';
  const [raw, setRaw] = useState(examples[0]), [xRaw, setXRaw] = useState('2');
  const [run, setRun] = useState<{ coefficients: number[]; x: number; revision: number } | null>({ coefficients: [2, 3, 4, 5], x: 2, revision: 0 });
  const [revision, setRevision] = useState(0), [error, setError] = useState('');
  const apply = (a = raw, x = xRaw) => {
    const next = revision + 1; setRevision(next);
    try { setRun({ ...parsePolynomialInput(a, x), revision: next }); setError(''); }
    catch (e) { setRun(null); setError((e as Error).message); }
  };
  const expression = run && polynomialExpressions(run.coefficients);
  return <LearningShell wide title={zh ? '霍纳法则：逐项累积多项式' : 'Horner’s rule: accumulating a polynomial'} description={zh ? '第8.1节 · 同一个多项式，比较两种求值过程与实际运算次数。' : 'Section 8.1 · Compare two evaluation procedures and their actual operation counts.'}>
    <form className="learning-card" onSubmit={e => { e.preventDefault(); apply(); }}>
      <div className="grid sm:grid-cols-[2fr_1fr] gap-4"><label>{zh ? '系数（降幂顺序）' : 'Coefficients (descending powers)'}<input className="learning-input w-full" value={raw} onChange={e => setRaw(e.target.value)} /></label><label>x<input className="learning-input w-full" inputMode="numeric" value={xRaw} onChange={e => setXRaw(e.target.value)} /></label></div>
      <p className="text-sm text-gray-600">{zh ? '最多 33 个整数系数；系数与 x 的绝对值不超过 1,000,000。每个中间值必须是安全整数（绝对值 ≤ 9,007,199,254,740,991）。应用后两个播放器暂停并回到初始化；编辑中的内容尚未应用。' : 'Up to 33 integer coefficients; coefficients and x have absolute value ≤ 1,000,000. Every intermediate value must be a safe integer (absolute value ≤ 9,007,199,254,740,991). Applying resets and pauses both players; draft edits are not applied yet.'}</p>
      <button className="learning-primary" type="submit">{zh ? '应用输入' : 'Apply input'}</button>
      <div className="flex flex-wrap gap-2">{examples.map(a => <button type="button" className="learning-secondary text-sm" key={a} onClick={() => { setRaw(a); setXRaw('2'); apply(a, '2'); }}>{a === '[]' ? zh ? '空序列 []' : 'Empty sequence []' : a}</button>)}</div>
      {error && <p role="alert" className="text-red-700">{errors[error][zh ? 0 : 1]}</p>}
    </form>
    {run && expression && <>
      <section className="learning-card"><h2 className="text-xl font-semibold">{zh ? '当前问题' : 'Applied problem'} · x = {run.x}</h2><p className="break-words font-mono">P(x) = {expression.expanded}</p><div tabIndex={0} role="region" aria-label={zh ? '嵌套表达式' : 'Nested expression'} className="overflow-x-auto"><p className="font-mono whitespace-nowrap">P(x) = {expression.nested}</p></div><p>{zh ? '中间零与前导零都保留原始位置，不能跳过对应运算。' : 'Interior and leading zeros keep their original positions and operations.'}</p></section>
      <div className="grid lg:grid-cols-2 gap-5 items-start" key={run.revision}>{(['horner', 'direct'] as const).map(mode => <PolynomialRun key={mode} mode={mode} coefficients={run.coefficients} x={run.x} />)}</div>
    </>}
    <TermHelp term={zh ? '开发者笔记：为什么这样计数？' : 'Developer notes: where do the counts come from?'} href="/book/8#section-8-1">
      <p>{zh ? '霍纳法则先用首个系数初始化，然后对每个后续系数先乘 x，再相加。长度为 m 的非空序列执行 m−1 次乘法与 m−1 次加法；空序列返回 0。' : 'Horner initializes with the first coefficient, then multiplies by x and adds each subsequent coefficient. A nonempty sequence of length m performs m−1 multiplications and m−1 additions; an empty sequence returns 0.'}</p>
      <p>{zh ? '比较基线：每项从其系数开始，按指数连续乘 x，第一项直接初始化总和，其余项逐一相加。即使系数为零也不省略步骤。这是本演示选定的逐项算法，不代表所有多项式求值实现。' : 'Comparison baseline: start each term with its coefficient and multiply by x as many times as its exponent. The first term initializes the sum; add the remaining terms. Zero coefficients do not skip steps. This is the chosen direct algorithm, not a claim about every polynomial evaluator.'}</p>
      <p>{zh ? '例如 [2,3,4,5]：逐项求值为 6 次乘法、3 次加法；霍纳法则为 3 次乘法、3 次加法。计数来自执行轨迹，播放器的步骤数还包含初始化和返回。' : 'For [2,3,4,5], direct evaluation uses 6 multiplications and 3 additions; Horner uses 3 and 3. Counts come from executed arithmetic; playback also includes initialization and return.'}</p>
      <p>{zh ? '两种算法只需常数辅助空间；保存所有快照是演示器的存储开销。溢出提示里的精确整数仅用于说明失败的运算，不作为后续计算状态。' : 'Both algorithms need constant auxiliary space. Saved snapshots are storage used by the visualizer. The exact integer in an overflow message only explains the rejected operation; it never enters subsequent numeric state.'}</p>
      <a className="learning-link" href={repoFile('配套代码(fm2gpcode)/ch08.h', 27)}>polynomial_value · ch08.h</a>
    </TermHelp>
    <Link className="learning-link" to="/concepts/matrices">{zh ? '继续：更换运算，理解矩阵与可达性' : 'Continue: change operations with matrices and reachability'}</Link>
  </LearningShell>;
}

function PolynomialRun({ mode, coefficients, x }: { mode: PolynomialMode; coefficients: number[]; x: number }) {
  const { lang } = useLanguage(), zh = lang === 'zh';
  const steps = polynomialTrace(coefficients, x, mode), playback = usePlayback(steps.length), s = steps[playback.step];
  const prefix = polynomialExpressions(coefficients.slice(0, Math.max(0, s.index))).nested;
  const currentExpression = mode === 'direct'
    ? s.index < 0 ? '—' : `(${coefficients[s.index]}) · x^${s.power}`
    : s.event === 'init' ? '—' : s.event === 'select' ? prefix : s.event === 'multiply' ? `${prefix} · x` : s.event === 'overflow' ? s.calculation : polynomialExpressions(coefficients.slice(0, s.index + 1)).nested;
  return <section className="learning-card min-w-0" data-testid={`polynomial-${mode}`} aria-label={mode === 'horner' ? zh ? '霍纳法则' : 'Horner' : zh ? '逐项求值' : 'Direct evaluation'}>
    <h2 className="text-xl font-semibold">{mode === 'horner' ? zh ? '霍纳法则' : 'Horner' : zh ? '逐项求值' : 'Direct evaluation'}</h2>
    {playback.controls}<button className="learning-secondary" onClick={playback.reset}>{zh ? '重置' : 'Reset'}</button>
    <div className="flex flex-wrap gap-2">{coefficients.map((c, i) => <span key={i} className={`rounded-lg border px-3 py-2 font-mono ${i === s.index ? 'bg-blue-100 border-blue-600 font-bold' : 'bg-gray-50 border-gray-200'}`}>a[{i}] = {c}{i === s.index ? ' ←' : ''}</span>)}</div>
    <div data-testid="variables" className="learning-intro font-mono break-words">i = {s.index < 0 ? '—' : s.index} · x = {x} · sum = <strong data-testid="sum">{s.sum ?? '—'}</strong>{mode === 'direct' && <> · term = {s.term ?? '—'} · k = {s.power}</>}</div>
    <div tabIndex={0} role="region" aria-label={zh ? '当前表达式' : 'Current expression'} className="overflow-x-auto"><p data-testid="current-expression" className="font-mono whitespace-nowrap">{currentExpression}</p></div>
    <p data-testid="counts">{zh ? '乘法' : 'Multiplications'}: {s.multiplications} · {zh ? '加法' : 'Additions'}: {s.additions}</p>
    <p data-testid="explanation" role={s.event === 'overflow' ? 'alert' : 'status'} className={s.event === 'overflow' ? 'text-red-700' : ''}>{messages[s.event][zh ? 0 : 1]}</p>
    {s.calculation && <p className="font-mono break-all">{s.calculation}</p>}
    {s.failure && <p className="font-mono break-all text-red-700">{s.failure}</p>}
    {mode === 'horner' && <p data-testid="accumulations" className="break-words">{zh ? '各轮累积值：' : 'Completed accumulations: '}{s.completed.join(' → ') || '—'}</p>}
    <p className="text-sm text-gray-600">{mode === 'horner' ? zh ? '书中代码节选；箭头标记当前语句。' : 'Book code excerpt; the arrow marks the current statement.' : zh ? '逐项比较算法的伪代码。' : 'Pseudocode for the direct comparison algorithm.'}</p>
    <TraceCode lines={mode === 'horner' ? hornerCode : directCode} active={s.line} label={zh ? '执行代码' : 'Executed code'} />
  </section>;
}
