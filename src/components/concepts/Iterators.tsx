import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LearningShell, TermHelp } from '../common/LearningShell';
import { useLanguage } from '../../context/LanguageContext';
import { IteratorKind, moveIterator, rangeValues } from '../../lib/algorithms/concepts';
export function Iterators() {
    const { lang } = useLanguage(), zh = lang === 'zh';
    const [kind, setKind] = useState<IteratorKind>('forward'), [first, setFirst] = useState('0'), [last, setLast] = useState('3');
    const [history, setHistory] = useState([{ position: 0, cost: 0 }]), [index, setIndex] = useState(0), [error, setError] = useState(''), [read, setRead] = useState(false);
    const values = [10, 20, 30], state = history[index];
    let valid = true, selected: number[] = [];
    try {
        if (!first.trim() || !last.trim())
            throw Error();
        selected = rangeValues(values, Number(first), Number(last));
    }
    catch {
        valid = false;
    }
    const reset = (position = 0) => { setHistory([{ position, cost: 0 }]); setIndex(0); setError(''); setRead(false); };
    const move = (delta: number) => { try {
        const next = moveIterator(kind, state.position, delta, 3);
        setHistory([...history.slice(0, index + 1), { position: next.position, cost: state.cost + next.cost }]);
        setIndex(index + 1);
        setError('');
        setRead(false);
    }
    catch (e) {
        setError(e instanceof Error ? e.message : 'boundary');
        setRead(false);
    } };
    const errors: Record<string, [
        string,
        string
    ]> = { boundary: ['不能越过容器边界。', 'Cannot move beyond the container boundaries.'], capability: ['前向迭代器不能后退；播放器回看记录不代表迭代器具有后退能力。', 'A forward iterator cannot move backward; replaying history does not give it that capability.'], end: ['容器尾后位置 end 没有元素，不能解引用。', 'The container’s past-the-end position has no element and cannot be dereferenced.'] };
    return <LearningShell title={zh ? '迭代器与区间' : 'Iterators and ranges'} description={zh ? '第10.4—10.6节、附录C.7 · 位置不等于元素，区间右端点也不一定是容器尾后位置。' : 'Sections 10.4–10.6 and Appendix C.7 · Positions are not elements; a range’s right endpoint need not be the container’s past-the-end position.'}>
    <section className="learning-card"><label>{zh ? '迭代器模型' : 'Iterator model'}<select aria-label={zh ? '迭代器模型' : 'Iterator model'} className="learning-input w-full mt-2" value={kind} onChange={e => { setKind(e.target.value as IteratorKind); reset(); }}>{[['forward', '前向：单链表', 'Forward: singly linked list'], ['bidirectional', '双向：双链表', 'Bidirectional: doubly linked list'], ['random', '随机访问：数组', 'Random access: array']].map(([id, z, e]) => <option key={id} value={id}>{zh ? z : e}</option>)}</select></label>
      <div className="grid grid-cols-2 gap-3"><label>{zh ? '区间起点' : 'Range start'}<input className="learning-input w-full" type="number" value={first} onChange={e => { setFirst(e.target.value); reset(); }}/></label><label>{zh ? '区间右端点' : 'Range right endpoint'}<input className="learning-input w-full" type="number" value={last} onChange={e => { setLast(e.target.value); reset(); }}/></label></div>
      {!valid ? <p role="alert">{zh ? '请输入整数位置，满足 0 ≤ 起点 ≤ 右端点 ≤ 3。' : 'Enter integer positions satisfying 0 ≤ start ≤ right endpoint ≤ 3.'}</p> : <p>[{first}, {last}) = {JSON.stringify(selected)} · {zh ? '起点＋个数：' : 'Start + count: '}{first} + {Number(last) - Number(first)}</p>}
      <div className="flex items-center gap-1 sm:gap-3 overflow-x-auto py-2" role="region" aria-label={zh ? '位置与元素' : 'Positions and elements'} tabIndex={0}>{[...values, null].map((v, i) => <div className="flex items-center gap-1" key={i}><div className={`w-14 min-w-[56px] rounded-lg border-2 p-1 text-center ${state.position === i ? 'border-blue-600' : 'border-gray-200'} ${valid && i >= Number(first) && i < Number(last) ? 'bg-blue-50' : 'bg-white'}`}><span className="text-[10px]">{zh ? '位置' : 'Position'} {i}</span><p className="font-mono font-semibold">{v ?? 'end'}</p>{state.position === i && <span className="text-blue-700">↑</span>}</div>{i < 3 && <span aria-hidden="true">{kind === 'bidirectional' ? '⇄' : kind === 'forward' ? '→' : '·'}</span>}</div>)}</div>
      <p>{zh ? '蓝色底纹表示区间包含的元素；箭头表示当前迭代器。位置2仍有30，位置3才是容器end。' : 'Blue shading marks elements in the selected range; the arrow marks the iterator. Position 2 still holds 30; position 3 is container end.'}</p>
      <div className="flex flex-wrap gap-2"><button className="learning-primary" onClick={() => move(1)}>{zh ? '前进一项' : 'Move forward'}</button><button className="learning-secondary" onClick={() => move(-1)}>{zh ? '尝试后退一项' : 'Try moving backward'}</button><button className="learning-secondary" onClick={() => move(3)}>advance(3)</button><button className="learning-secondary" onClick={() => { setRead(state.position < 3); setError(state.position === 3 ? 'end' : ''); }}>{zh ? '读取当前位置' : 'Read current position'}</button><button className="learning-secondary" onClick={() => reset(3)}>{zh ? '示例：从 end 开始' : 'Example: start at end'}</button></div>
      {error && <p role="alert" className="text-red-700">{errors[error][zh ? 0 : 1]}</p>}{read && <p role="status">{zh ? '读到元素：' : 'Element read: '}{values[state.position]}</p>}
      <p aria-live="polite">{zh ? '累计移动操作次数：' : 'Total movement operations: '}{state.cost} · {zh ? '当前模型：' : 'Current model: '}{kind === 'random' ? (zh ? '直接跳转' : 'direct jumps') : (zh ? '逐项移动' : 'successor/predecessor steps')}</p>
      <div className="flex flex-wrap gap-2"><button className="learning-secondary" disabled={!index} onClick={() => { setIndex(index - 1); setRead(false); setError(''); }}>{zh ? '回看上一步' : 'Review previous step'}</button><button className="learning-secondary" disabled={index === history.length - 1} onClick={() => { setIndex(index + 1); setRead(false); setError(''); }}>{zh ? '重播下一步' : 'Replay next step'}</button><button className="learning-secondary" onClick={() => reset()}>{zh ? '重置' : 'Reset'}</button></div>
    </section>
    <TermHelp term={zh ? '操作能力与操作代价' : 'Capabilities and operation costs'} href="/book/10#section-10-5"><p>{zh ? '前向迭代器支持多遍历；输入流的一次性读取是另一种单遍历模型。单链表 advance(3) 需要3次后继操作，数组随机访问只需1次跳转。二分查找的比较次数少，不代表所有迭代器的移动次数都少。' : 'Forward iterators support multiple passes; one-pass input streams are a different model. On a singly linked list, advance(3) needs three successor operations; an array supports one random-access jump. Few binary-search comparisons do not imply few iterator movements for every iterator category.'}</p><p>{zh ? '[1,2) 的右端点2不包含在本次遍历中，但它仍可以指向容器中的元素30。容器end位置3则没有可读取的元素。' : 'The right endpoint 2 of [1,2) is excluded from that traversal, but can still point to element 30 in the container. Container end at position 3 has no readable element.'}</p></TermHelp>
    <div className="flex flex-wrap gap-4"><Link className="learning-link" to="/linear-search">{zh ? '继续：线性查找' : 'Continue: linear search'}</Link><Link className="learning-link" to="/binary-search">{zh ? '继续：二分查找' : 'Continue: binary search'}</Link></div>
  </LearningShell>;
}
