import { usePlayback } from './usePlayback';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LearningShell, TermHelp } from '../common/LearningShell';
import { closure, FRIENDS, FRIEND_NAMES, identity, matrixProduct, Matrix, powerTrace } from '../../lib/algorithms/concepts';
import { MatrixTable } from './shared';
export function Matrices() {
    const { lang } = useLanguage(), zh = lang === 'zh';
    const [mode, setMode] = useState('ordinary');
    return <LearningShell wide title={zh ? '矩阵与可达性' : 'Matrices and reachability'} description={zh ? '第8.5—8.6节、习题8.7 · 先理解一个格子，再看整张关系表。' : 'Sections 8.5–8.6 and Exercise 8.7 · Understand one cell before exploring the whole relation.'}>
    <label className="block">{zh ? '示例' : 'Example'}<select aria-label={zh ? '示例' : 'Example'} className="learning-input w-full mt-2" value={mode} onChange={e => setMode(e.target.value)}>{[['ordinary', '普通矩阵乘法', 'Ordinary matrix multiplication'], ['chain', '三点链与孤立顶点', 'Three-node chain and an isolated vertex'], ['friends', '书中的朋友关系', 'The book’s friendship relation']].map(([id, z, e]) => <option key={id} value={id}>{zh ? z : e}</option>)}</select></label>
    {mode === 'ordinary' ? <Ordinary /> : <Reachability key={mode} friends={mode === 'friends'}/>}
    <section className="learning-card overflow-x-auto"><h2 className="font-semibold text-xl">{zh ? '换规则，复用矩阵乘法' : 'Change the rules, reuse matrix multiplication'}</h2><table className="w-full text-left"><thead><tr>{(zh ? ['模型', '连接两段', '汇总候选项', '单位矩阵'] : ['Model', 'Compose segments', 'Combine alternatives', 'Identity matrix']).map(x => <th key={x} className="p-2">{x}</th>)}</tr></thead><tbody>{(zh ? [['普通矩阵', '乘法', '加法', '对角线1，其余0'], ['布尔可达性', 'AND（且）', 'OR（或）', '对角线真，其余假'], ['最短距离', '加法', 'min（取最小）', '对角线0，其余∞']] : [['Ordinary matrices', 'Multiplication', 'Addition', '1 on diagonal, 0 elsewhere'], ['Boolean reachability', 'AND', 'OR', 'True on diagonal, false elsewhere'], ['Shortest distance', 'Addition', 'Minimum', '0 on diagonal, ∞ elsewhere']]).map(row => <tr key={row[0]}>{row.map(c => <td key={c} className="p-2 border-t">{c}</td>)}</tr>)}</tbody></table></section>
    <TermHelp term={zh ? '幂指数、乘法次数与“至多”' : 'Exponent, multiplication count, and “at most”'} href="/book/8#section-8-6"><p>{zh ? '令 M = I ∨ A：每个人与自己相连。Mᵏ 表示至多走 k 条边可达，M⁰ = I。n 个顶点只需考虑 n−1 条边，因为可达路线可以去掉重复绕圈。指数 k 与反复平方实际执行的矩阵乘法次数不同。' : 'Let M = I ∨ A: every vertex relates to itself. Mᵏ represents reachability using at most k edges, and M⁰ = I. With n vertices, n−1 edges suffice because repeated cycles can be removed from a reachable walk. Exponent k differs from the number of matrix products used by repeated squaring.'}</p><p>{zh ? '最短距离用对角线0表示原地等待，无边用∞。在无负环的前提下，n−1条边足以求最短距离。' : 'For shortest distances, diagonal zeros allow staying put and ∞ means no edge. Assuming no negative cycles, n−1 edges suffice for shortest distances.'}</p></TermHelp>
    <Link className="learning-link" to="/shortest-path?route=concepts">{zh ? '继续：在图上比较最短距离' : 'Continue: compare shortest distances on a graph'}</Link>
  </LearningShell>;
}
function Ordinary() {
    const { lang } = useLanguage(), zh = lang === 'zh';
    const [a, setA] = useState('[[1,2],[3,4]]'), [b, setB] = useState('[[5,6],[7,8]]');
    let left: Matrix = [], right: Matrix = [], result: Matrix = [], error = false;
    try {
        left = JSON.parse(a);
        right = JSON.parse(b);
        if (!Array.isArray(left) || !Array.isArray(right) || left.length > 4 || right.length > 4 || left.some(r => !Array.isArray(r) || r.length > 4) || right.some(r => !Array.isArray(r) || r.length > 4))
            throw Error();
        result = matrixProduct(left, right);
    }
    catch {
        error = true;
    }
    return <section className="learning-card"><div className="grid sm:grid-cols-2 gap-4"><label>A<input className="learning-input w-full" value={a} onChange={e => setA(e.target.value)}/></label><label>B<input className="learning-input w-full" value={b} onChange={e => setB(e.target.value)}/></label></div><button className="learning-secondary" onClick={() => { setA(b); setB(a); }}>{zh ? '交换 A 与 B，比较 AB 和 BA' : 'Swap A and B; compare AB with BA'}</button><p>{zh ? '每个矩阵最多4行4列，元素与中间结果须为安全整数。A的列数必须等于B的行数。' : 'Up to 4 rows and 4 columns; entries and intermediate values must be safe integers. A’s column count must equal B’s row count.'}</p>
    {error ? <p role="alert" className="text-red-700">{zh ? '矩阵格式、维数或精确计算范围不符合要求。' : 'Invalid matrix format, dimensions, or exact arithmetic range.'}</p> : <Product key={`${a}:${b}`} a={left} b={right} result={result}/>}
  </section>;
}
function Product({ a, b, result }: {
    a: Matrix;
    b: Matrix;
    result: Matrix;
}) {
    const { lang } = useLanguage(), zh = lang === 'zh';
    const [cell, setCell] = useState<[
        number,
        number
    ]>([0, 0]);
    const [i, j] = cell;
    return <><div className="grid md:grid-cols-3 gap-4"><MatrixTable value={a} label={zh ? 'A：选择第 i 行' : 'A: select row i'} selected={[i, -1]}/><MatrixTable value={b} label={zh ? 'B：选择第 j 列' : 'B: select column j'} selected={[-1, j]}/><MatrixTable value={result} label={zh ? 'AB：点选结果格' : 'AB: select a result cell'} onSelect={(i, j) => setCell([i, j])} selected={cell}/></div><CellTerms key={`${i}:${j}`} terms={a[i].map((v, k) => ({ left: v, right: b[k][j] }))} row={i} col={j}/></>;
}
function CellTerms({ terms, row, col, boolean = false }: {
    terms: {
        left: number;
        right: number;
    }[];
    row: number;
    col: number;
    boolean?: boolean;
}) {
    const { lang } = useLanguage(), zh = lang === 'zh';
    const playback = usePlayback(terms.length);
    const count = playback.step + 1;
    const total = terms.slice(0, count).reduce((s, t) => boolean ? Number(Boolean(s || (t.left && t.right))) : s + t.left * t.right, 0);
    return <div className="learning-intro">{playback.controls}<p>{zh ? '行' : 'Row'} i={row}, {zh ? '列' : 'column'} j={col}, k={playback.step}</p><ol className="space-y-1">{terms.map((t, k) => <li key={k} className={k === playback.step ? 'font-bold text-blue-800' : ''}>k={k}: {t.left} {boolean ? 'AND' : '×'} {t.right} = {boolean ? Number(Boolean(t.left && t.right)) : t.left * t.right}{k === playback.step ? ' ←' : ''}</li>)}</ol><p aria-live="polite">{zh ? '当前汇总：' : 'Current aggregate: '}{total} ({boolean ? 'OR' : '+'})</p></div>;
}
function Reachability({ friends }: {
    friends: boolean;
}) {
    const { lang } = useLanguage(), zh = lang === 'zh';
    const a = friends ? FRIENDS : [[0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    const names = friends ? FRIEND_NAMES[lang] : ['A', 'B', 'C', 'D'];
    const playback = usePlayback(a.length);
    const k = playback.step, result = closure(a, k), previous = k ? closure(a, k - 1) : undefined;
    const [cell, setCell] = useState<[
        number,
        number
    ]>([0, 2]);
    const [i, j] = cell;
    const m = a.map((r, i) => r.map((v, j) => Number(Boolean(v) || i === j)));
    const trace = powerTrace(m, k, (a, b) => matrixProduct(a, b, true), identity(a.length));
    return <section className="learning-card">{playback.controls}<button className="learning-secondary" onClick={() => { playback.reset(); setCell([0, 2]); }}>{zh ? '重置' : 'Reset'}</button><p className="font-semibold">M^{k} · {zh ? `至多 ${k} 条边` : `At most ${k} edges`} · {zh ? '实际矩阵乘法次数：' : 'Actual matrix products: '}{trace[trace.length - 1].multiplications}</p>
    <div className="grid lg:grid-cols-2 gap-4"><RelationGraph matrix={result} previous={previous} names={names}/><MatrixTable value={result} previous={previous} names={names} label={zh ? '可达性：1为真，0为假；*为新增' : 'Reachability: 1 is true, 0 is false; * marks additions'} onSelect={(i, j) => setCell([i, j])} selected={cell}/></div>
    <p aria-live="polite">{names[i]} → {names[j]}: {result[i][j] ? (zh ? '可达' : 'reachable') : (zh ? '尚不可达' : 'not yet reachable')}</p>
    {previous ? <><p>{zh ? '以下拆开 Mᵏ⁻¹ × M 的当前格，解释新增关系；上方乘法次数来自实际反复平方算法。' : 'Inspect the selected cell of Mᵏ⁻¹ × M to explain the new relation. The count above comes from the actual repeated-squaring algorithm.'}</p><CellTerms key={`${k}:${i}:${j}`} terms={previous[i].map((v, t) => ({ left: v, right: m[t][j] }))} row={i} col={j} boolean/></> : <p>{zh ? '零条边只允许停留在自身，所以 M⁰ 是单位矩阵。' : 'With zero edges, only staying at the same vertex is possible, so M⁰ is the identity matrix.'}</p>}
    {friends && <p className="text-sm text-gray-600">{zh ? '名称采用中文版书中的写法；配套程序把“林宇”写作“林字”。' : 'Names follow the Chinese edition. The companion program spells Lin Yu’s name differently.'}</p>}
  </section>;
}
function RelationGraph({ matrix, previous, names }: {
    matrix: Matrix;
    previous?: Matrix;
    names: string[];
}) {
    const { lang } = useLanguage();
    const points = matrix.map((_, i) => ({ x: 220 + 155 * Math.cos(i * 2 * Math.PI / matrix.length), y: 190 + 145 * Math.sin(i * 2 * Math.PI / matrix.length) }));
    return <div className="overflow-x-auto" role="region" aria-label={lang === 'zh' ? '可达关系图' : 'Reachability graph'} tabIndex={0}><svg viewBox="0 0 450 390" className="min-w-[330px] w-full" role="img" aria-label={lang === 'zh' ? '箭头表示可达；绿色虚线表示新增关系；每个顶点可自达。' : 'Arrows show reachability; green dashed arrows show new relations; each vertex reaches itself.'}><defs><marker id="reach-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/></marker></defs>{matrix.map((row, i) => row.map((v, j) => { if (!v || i === j)
        return null; const p = points[i], q = points[j], d = Math.hypot(q.x - p.x, q.y - p.y), changed = previous && !previous[i][j]; return <line key={`${i}:${j}`} x1={p.x + (q.x - p.x) * 25 / d} y1={p.y + (q.y - p.y) * 25 / d} x2={q.x - (q.x - p.x) * 30 / d} y2={q.y - (q.y - p.y) * 30 / d} stroke={changed ? '#047857' : '#93c5fd'} strokeWidth={changed ? 3 : 1.5} strokeDasharray={changed ? '5 3' : undefined} markerEnd="url(#reach-arrow)"/>; }))}{points.map((p, i) => <g key={i}><circle cx={p.x} cy={p.y} r="26" fill="#eff6ff" stroke="#2563eb"/><text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#1e3a8a">{names[i]}</text></g>)}</svg></div>;
}
