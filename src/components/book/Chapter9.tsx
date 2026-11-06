import { TermHelp } from '../common/LearningShell';
import { useLanguage } from '../../context/LanguageContext';
import { axioms, derivations } from '../../data/chapter9Proofs';
import { ReadingDetail, ReadingLink } from './ReadingTools';
import { SourceDemoLink } from './SourceDemoLink';

export function Chapter9({section}:{section:string}) {
  const {lang}=useLanguage(), zh=lang==='zh';
  if (section==='9.1') return <article id="instances-and-proofs" className="space-y-3">
    <h3 className="font-semibold">{zh?'实例、反例与一般证明':'Examples, counterexamples and general proofs'}</h3>
    <p>{zh?'先算两组三元组。书中用纸条说明加法的结合律；这里用固定的数字分清观察与证明的作用。':'Start with two triples. The book illustrates associativity with strips of paper; these numerical examples distinguish observation from proof.'}</p>
    <p><strong>{zh?'观察实例：':'Observation: '}</strong>(3 + 2) + 1 = 6, 3 + (2 + 1) = 6. {zh?'改变括号并未改变这个结果，但一次相等不能证明所有自然数都如此。':'Both groupings agree for this triple. One match does not establish the law for all natural numbers.'}</p>
    <p><strong>{zh?'整数减法的反例：':'Counterexample for integer subtraction: '}</strong>(5 − 3) − 1 = 1, 5 − (3 − 1) = 3. {zh?'一个不相等的结果就足以否定“对所有整数都结合”。':'One disagreement disproves the claim that subtraction is associative for all integers.'}</p>
    <nav className="flex flex-wrap gap-4"><SourceDemoLink path="/concepts/algebra" anchor="instances-and-proofs"/>
      <ReadingLink to="/book/9#addition-associativity">{zh?'第9.7节：为什么对所有自然数成立？':'Section 9.7: why does it hold for all natural numbers?'}</ReadingLink></nav>
  </article>;
  if (section==='9.6') return <article id="peano-axioms" className="space-y-3">
    <p>{zh?'公理是推理的起点。这里用 s(n) 表示书中的 n′，读作“n 的后继”。自然数包含 0。':'The axioms are our starting assumptions. Here s(n) denotes the book’s n′, the successor of n. The natural numbers include zero.'}</p>
    <p>0 → s(0) → s(s(0)) → … (0, 1, 2, …)</p>
    <ol className="list-decimal pl-6 space-y-2">{axioms.map((a,i)=><li key={i}>{a[lang]}</li>)}</ol>
    <p>{zh?'第三条是归纳公理：要证明一种性质对所有自然数成立，只须证明满足它的数包含 0，而且从任何满足它的 k 都能走到同样满足它的 s(k)。':'The third is the induction axiom. Show that the numbers with the property include zero, and that whenever k has it, s(k) has it too.'}</p>
    <TermHelp id="induction-subset" term={zh?'怎样读“对每个子集”？':'How do we read “for every subset”?'} href="/book/A#notation-forall">
      {zh?'这里允许子集等于整个自然数集。∀ 要求每个满足这两个前提的子集都满足结论。':'A subset here may equal the entire set of natural numbers. The quantifier ∀ ranges over every subset satisfying the two premises.'}
    </TermHelp>
    <ReadingLink to="/book/B#induction-sum">{zh?'B.2：看一次完整的归纳证明':'B.2: see a complete induction proof'}</ReadingLink>
  </article>;
  return <div className="space-y-4">
    <p>{zh?'下面两条规则定义加法，对任意 a、b ∈ ℕ 适用。第二条在第二个参数上递推。':'These two rules define addition for arbitrary a, b ∈ ℕ. The second recurses on the second argument.'}</p>
    <p className="learning-note"><strong>(9.1)</strong> a + 0 = a<br/><strong>(9.2)</strong> a + s(b) = s(a + b)</p>
    <nav className="flex flex-wrap gap-4">{derivations.map(d=><ReadingLink key={d.id} to={'/book/9#'+d.id}>{d.title[lang]}</ReadingLink>)}</nav>
    {derivations.map(d=><ReadingDetail key={d.id} id={d.id} label={d.title[lang]}>
      <p>{d.introduction[lang]}</p>
      <p className="text-sm">{zh?'展开每行等式查看依据。':'Open each line to see its justification.'}</p>
      {d.steps.map(s=><ReadingDetail key={s.id} id={s.id} label={s.expression}><p>{s.reason[lang]}</p></ReadingDetail>)}
      <p>{d.conclusion[lang]}</p>
      {d.id!=='add-two-three' && <ReadingLink to="/book/B#induction-sum">{zh?'B.2：对照归纳法的起点与步骤':'B.2: compare the starting point and induction step'}</ReadingLink>}
      {d.id==='addition-associativity' && <>
        <p>{zh?'从第6章的半群到第7章的幂算法：结合律允许改变分组，因子的顺序不变。换一种类型或运算，要重新核对这条规律；几个测试值不够。':'From semigroups in Chapter 6 to powering in Chapter 7: associativity permits regrouping while keeping factors in order. A different type or operation must satisfy the law in its own right; testing a few values is insufficient.'}</p>
        <nav className="flex flex-wrap gap-4">{['/concepts/algebra','/power'].map(path=><SourceDemoLink key={path} path={path} anchor={d.id} entries={d.steps.map(s=>s.id)}/>)}</nav>
      </>}
    </ReadingDetail>)}
  </div>;
}
