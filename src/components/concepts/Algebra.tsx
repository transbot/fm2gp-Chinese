import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LearningShell, TermHelp } from '../common/LearningShell';
const models = [
    { zh: '整数，加法：群', en: 'Integers, addition: group', unit: '0', inverse: { zh: '每个 x 的逆元是 −x，仍在整数集合中。', en: 'Every x has inverse −x, which is still an integer.' } },
    { zh: '非负整数，加法：幺半群', en: 'Nonnegative integers, addition: monoid', unit: '0', inverse: { zh: '0 的逆元是 0；正数的相反数不在这个集合中。', en: '0 is its own inverse; the negative of a positive integer lies outside this set.' } },
    { zh: '正整数，加法：半群', en: 'Positive integers, addition: semigroup', unit: null, inverse: { zh: '0 不在集合中，因此没有加法单位元素，也不要求逆元。', en: '0 is outside the set, so there is no additive identity and no inverse requirement.' } },
    { zh: '包含空串的有限字符串全体，连接：幺半群', en: 'All finite strings including the empty string, concatenation: monoid', unit: '""', inverse: { zh: '非空字符串无法通过连接消去；空串是自身的逆元。', en: 'Concatenation cannot cancel a nonempty string; the empty string is its own inverse.' } },
    { zh: '整数，减法：不满足结合律', en: 'Integers, subtraction: not associative', unit: null, inverse: { zh: '没有双侧单位元素：x − 0 = x，但 0 − x 通常不等于 x。', en: 'There is no two-sided identity: x − 0 = x, but generally 0 − x ≠ x.' } },
];
export function Algebra() {
    const { lang } = useLanguage(), zh = lang === 'zh';
    const [model, setModel] = useState(0), [values, setValues] = useState(['3', '2', '1']), [swap, setSwap] = useState(false), [right, setRight] = useState(false), [unit, setUnit] = useState(false), [inverse, setInverse] = useState(false);
    const strings = model === 3, m = models[model];
    const valid = strings || values.every(v => v.trim() !== '' && Number.isSafeInteger(Number(v)) && Math.abs(Number(v)) <= 1000 && (model === 1 ? Number(v) >= 0 : model === 2 ? Number(v) > 0 : true));
    const [a, b, c] = values;
    const op = (x: string, y: string) => strings ? x + y : String(model === 4 ? Number(x) - Number(y) : Number(x) + Number(y));
    const left = op(op(a, b), c), other = op(a, op(b, c));
    return <LearningShell title={zh ? '运算与代数结构' : 'Operations and algebraic structures'} description={zh ? '第6.1—6.2节 · 集合与运算一起决定结构。输入只选择观察的实例，不改变集合。' : 'Sections 6.1–6.2 · A set and an operation together determine the structure. Inputs select examples, not the underlying set.'}>
    <section className="learning-card"><label>{zh ? '集合与运算' : 'Set and operation'}<select aria-label={zh ? '集合与运算' : 'Set and operation'} className="learning-input w-full mt-2" value={model} onChange={e => { const n = Number(e.target.value); setModel(n); setValues(n === 3 ? ['a', 'b', 'c'] : n === 4 ? ['5', '3', '1'] : ['3', '2', '1']); setSwap(false); setRight(false); setUnit(false); setInverse(false); }}>{models.map((m, i) => <option key={i} value={i}>{m[lang]}</option>)}</select></label>
      <div className="grid grid-cols-3 gap-3">{values.map((v, i) => <label key={i}>{['a', 'b', 'c'][i]}<input className="learning-input w-full" value={v} maxLength={strings ? 20 : 5} onChange={e => setValues(values.map((old, j) => i === j ? e.target.value : old))}/></label>)}</div>
      {!valid ? <p role="alert">{zh ? '请按当前集合输入 −1000 到 1000 内的整数。' : 'Enter integers from −1000 to 1000 that belong to the selected set.'}</p> : <>
        <div className="flex flex-wrap gap-2"><button className="learning-secondary" onClick={() => setRight(!right)}>{zh ? '改变括号' : 'Change parentheses'}</button><button className="learning-secondary" onClick={() => setSwap(!swap)}>{zh ? '交换 ab 与 c 的顺序' : 'Swap ab and c'}</button></div>
        <div className="learning-intro" aria-live="polite"><p className="font-mono break-all">{right ? 'a ∘ (b ∘ c)' : '(a ∘ b) ∘ c'} = {right ? other : left}</p><p>{zh ? '当前结合律等式：' : 'Current associativity equality: '}{left} {left === other ? '=' : '≠'} {other}</p><p className="font-mono break-all">{swap ? 'c ∘ (a ∘ b)' : '(a ∘ b) ∘ c'} = {swap ? op(c, op(a, b)) : left}</p></div>
        <div className="flex flex-wrap gap-2"><button className="learning-secondary" onClick={() => setUnit(!unit)}>{zh ? '尝试加入单位元素' : 'Try adding an identity'}</button><button className="learning-secondary" onClick={() => setInverse(!inverse)}>{zh ? '寻找 a 的逆元' : 'Find the inverse of a'}</button><button className="learning-secondary" onClick={() => { setValues(strings ? ['a', 'b', 'c'] : model === 4 ? ['5', '3', '1'] : ['3', '2', '1']); setSwap(false); setRight(false); setUnit(false); setInverse(false); }}>{zh ? '重置示例' : 'Reset example'}</button></div>
        {unit && <p>{zh ? '单位元素：' : 'Identity: '}{m.unit ?? (zh ? '不存在' : 'none')}{m.unit !== null && ` · a ∘ e = e ∘ a = ${a || '""'}`}</p>}{inverse && <><p>{m.inverse[lang]}</p>{model === 0 && <p>{a} + ({-Number(a)}) = 0</p>}</>}
      </>}
    </section>
    <section className="learning-card overflow-x-auto"><h2 className="text-lg font-semibold">{zh ? '对照整个集合上的性质' : 'Compare properties over the whole set'}</h2><table className="w-full text-left text-sm"><thead><tr>{(zh ? ['集合与运算', '结合律', '单位元素', '所有元素均有逆元'] : ['Set and operation', 'Associative', 'Identity', 'Every element has an inverse']).map(s => <th className="p-2" key={s}>{s}</th>)}</tr></thead><tbody>{models.map((m, i) => <tr key={i}>{[m[lang], i === 4 ? (zh ? '否' : 'No') : (zh ? '是' : 'Yes'), m.unit ?? '—', i === 0 ? (zh ? '是' : 'Yes') : (zh ? '否' : 'No')].map((s, j) => <td className="p-2 border-t" key={j}>{s}</td>)}</tr>)}</tbody></table></section>
    <TermHelp term={zh ? '为什么要区分结合律和交换律？' : 'Why distinguish associativity from commutativity?'} href="/book/6#section-6-2"><p>{zh ? '结合律允许改变括号，交换律允许改变顺序。字符串连接有结合律，却一般不能交换顺序。半群要求结合律，幺半群再要求单位元素，群再要求每个元素都有逆元。' : 'Associativity permits regrouping; commutativity permits reordering. String concatenation is associative but generally not commutative. A semigroup requires associativity, a monoid also requires an identity, and a group also requires an inverse for every element.'}</p><p>{zh ? '结构归类依据整个集合上的定义；几个成立的等式不能证明一般结论，一个反例却足以否定。' : 'Classification concerns the whole set. A few successful equalities do not prove a law, but a single counterexample can disprove it.'}</p></TermHelp>
    <Link className="learning-link" to="/power?route=concepts">{zh ? '继续：同一个幂算法' : 'Continue: one power algorithm'}</Link>
  </LearningShell>;
}
