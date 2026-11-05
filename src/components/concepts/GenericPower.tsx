import { usePlayback } from './usePlayback';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LearningShell, TermHelp } from '../common/LearningShell';
import { exact, identity, matrixProduct, powerTrace, Matrix, PowerSnapshot } from '../../lib/algorithms/concepts';
import { MatrixTable } from './shared';
const showValue = (value: unknown) => value === null ? '—' : JSON.stringify(value);
export function GenericPower() {
    const { lang } = useLanguage(), zh = lang === 'zh';
    const [model, setModel] = useState('multiply'), [base, setBase] = useState('3'), [exponent, setExponent] = useState('5');
    const matrix = model === 'matrix';
    let error = '', steps: PowerSnapshot<number | Matrix>[] = [];
    try {
        if (!base.trim() || !exponent.trim())
            throw Error('empty');
        const n = Number(exponent);
        if (n < 0)
            throw Error('negative');
        if (!Number.isInteger(n) || n > 1024)
            throw Error('exponent');
        if (matrix) {
            const a: Matrix = JSON.parse(base);
            if (!Array.isArray(a) || a.length !== 2 || a.some(r => !Array.isArray(r) || r.length !== 2))
                throw Error('dimensions');
            a.flat().forEach(exact);
            steps = powerTrace(a, n, matrixProduct, identity(2));
        }
        else {
            const a = exact(Number(base));
            steps = powerTrace(a, n, model === 'add' ? (a, b) => exact(a + b) : (a, b) => exact(a * b), model === 'add' ? 0 : 1);
        }
    }
    catch (e) {
        error = e instanceof Error ? e.message : 'input';
    }
    const errors: Record<string, [
        string,
        string
    ]> = { negative: ['指数必须为非负数；负指数需要逆运算，请参看群的说明。', 'Exponent must be non-negative; negative powers require an inverse. See groups.'], exponent: ['指数须为 0 到 1024 的整数。', 'Exponent must be an integer from 0 to 1024.'], empty: ['请输入对象与指数；空白不是 0。', 'Enter an object and an exponent; an empty input is not zero.'], dimensions: ['请输入二阶方阵，例如 [[1,1],[1,0]]。', 'Enter a 2×2 matrix, such as [[1,1],[1,0]].'], range: ['输入与每个中间结果都必须是安全整数（绝对值不超过 9007199254740991）。请缩小例子。', 'Inputs and every intermediate result must be safe integers (absolute value at most 9007199254740991). Use a smaller example.'] };
    return <LearningShell title={zh ? '同一个幂算法' : 'One power algorithm'} description={zh ? '第7.4—7.7节 · 保留折半与累积流程，更换对象和合并运算。' : 'Sections 7.4–7.7 · Keep the halving and accumulation procedure; change the objects and the combining operation.'}>
    <section className="learning-card"><label>{zh ? '运算模型' : 'Operation model'}<select aria-label={zh ? '运算模型' : 'Operation model'} className="learning-input w-full mt-2" value={model} onChange={e => { setModel(e.target.value); setBase(e.target.value === 'matrix' ? '[[1,1],[1,0]]' : '3'); setExponent('5'); }}>{[['add', '重复加法', 'Repeated addition'], ['multiply', '普通幂', 'Ordinary powers'], ['matrix', '矩阵幂', 'Matrix powers']].map(([id, zh, en]) => <option key={id} value={id}>{lang === 'zh' ? zh : en}</option>)}</select></label>
      <div className="grid sm:grid-cols-2 gap-3"><label>{zh ? '对象／底数' : 'Object / Base'}<input className="learning-input w-full" type={matrix ? 'text' : 'number'} value={base} onChange={e => setBase(e.target.value)}/></label><label>{zh ? '指数' : 'Exponent'}<input className="learning-input w-full" type="number" value={exponent} onChange={e => setExponent(e.target.value)}/></label></div>
      <p className="text-sm text-gray-600">{zh ? '非负整数指数 0—1024；输入和中间结果均须在安全整数范围内。' : 'Integer exponents 0–1024; inputs and intermediate results must remain safe integers.'}</p>
      {error && <p role="alert" className="text-red-700">{(errors[error] ?? ['输入无效，请检查格式。', 'Invalid input; check the format.'])[zh ? 0 : 1]}</p>}
      {model === 'multiply' && base === '0' && Number(exponent) === 0 && <p>{zh ? '这里按幺半群的空乘积约定，0⁰ 返回单位元素 1。' : 'Here the monoid empty-product convention makes 0⁰ return the identity 1.'}</p>}
      {matrix && <Link className="learning-link" to="/concepts/matrices">{zh ? '先看矩阵乘法' : 'See matrix multiplication first'}</Link>}
    </section>
    {!error && <PowerRun key={`${model}:${base}:${exponent}`} steps={steps} model={model}/>}
    <TermHelp term={zh ? '结合律、单位元素与不变式' : 'Associativity, identity, and the invariant'} href="/book/7#section-7-6"><p>{zh ? '正指数从实际元素建立累积值，不需要单位元素。零指数才使用模型的单位元素：加法为 0，乘法为 1，矩阵为单位矩阵。负指数还需要逆运算。' : 'For a positive exponent, accumulation starts with an actual element and needs no identity. Exponent zero uses the model’s identity: 0 for addition, 1 for multiplication, and the identity matrix for matrices. Negative exponents also require an inverse.'}</p><p>{zh ? '每个完整变换后，累积值 ∘ 当前对象的剩余次幂始终等于原问题。尚未建立累积值时省略这一因子。这里的“平方”指对象与自身合并，并不要求交换律。' : 'After every complete transformation, accumulator ∘ current object to the remaining power equals the original problem. Omit the accumulator factor before it is initialized. “Squaring” combines the object with itself and does not require commutativity.'}</p></TermHelp>
    <div className="flex flex-wrap gap-4"><Link className="learning-link" to="/concepts/algebra">{zh ? '先修：群与半群' : 'Prerequisite: groups and semigroups'}</Link><Link className="learning-link" to="/fast-fibonacci?route=book">{zh ? '继续：斐波那契数' : 'Continue: Fibonacci numbers'}</Link></div>
  </LearningShell>;
}
function PowerRun({ steps, model }: {
    steps: PowerSnapshot<number | Matrix>[];
    model: string;
}) {
    const { lang } = useLanguage(), zh = lang === 'zh';
    const playback = usePlayback(steps.length), s = steps[playback.step];
    const actions = { init: ['从实际对象开始，尚无累积值。', 'Start with the actual object; no accumulator yet.'], square: ['将当前对象与自身合并，剩余次数折半。', 'Combine the current object with itself and halve the remaining count.'], accumulate: ['累积一个当前对象，同时将剩余次数减一。', 'Accumulate one current object and reduce the remaining count by one.'], done: ['剩余次数为零，得到结果。', 'The remaining count is zero; the result is ready.'], identity: ['零次迭代返回当前运算的单位元素。', 'Zero repetitions return the identity of the selected operation.'] };
    return <section className="learning-card">{playback.controls}<button className="learning-secondary" onClick={playback.reset}>{zh ? '重置' : 'Reset'}</button><p aria-live="polite">{actions[s.action][zh ? 0 : 1]}</p>
    <div role="region" aria-label={zh ? '幂算法步骤' : 'Power algorithm steps'} tabIndex={0} className="overflow-x-auto"><table className="w-full text-left"><thead><tr>{(zh ? ['当前对象', '剩余次数', '累积值'] : ['Current object', 'Remaining count', 'Accumulator']).map(x => <th className="p-2" key={x}>{x}</th>)}</tr></thead><tbody><tr><td className="p-2 font-mono">{showValue(s.base)}</td><td className="p-2">{s.remaining}</td><td className="p-2 font-mono" data-testid="power-result">{showValue(s.result)}</td></tr></tbody></table></div>
    {Array.isArray(s.result) && <MatrixTable value={s.result} label={zh ? '累积矩阵' : 'Accumulator matrix'}/>}
    <p>{zh ? '已执行的合并次数：' : 'Combining operations performed: '}{s.multiplications}</p>
    <p className="learning-intro">{zh ? '完整变换检查点：' : 'Complete transformation checkpoint: '}{s.result === null ? '' : `${showValue(s.result)} ∘ `}{showValue(s.base)}{zh ? ` 的 ${s.remaining} 次迭代` : ` repeated ${s.remaining} times`}{zh ? ' = 原问题' : ' = original problem'} · {model === 'add' ? '+' : model === 'matrix' ? (zh ? '矩阵乘法' : 'matrix product') : '×'}</p>
    <pre className="overflow-x-auto bg-gray-50 rounded-lg p-3 text-sm"><code>{s.action === 'identity' ? 'return identity;' : s.action === 'square' ? 'a = op(a, a); n = n / 2;' : s.action === 'accumulate' ? 'r = initialized ? op(r, a) : a; n = n - 1;' : s.action === 'done' ? 'return r;' : 'a = input; n = exponent;'}</code></pre>
  </section>;
}
