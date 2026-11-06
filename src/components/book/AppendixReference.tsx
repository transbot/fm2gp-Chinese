import { methods, notation, readings, truthRows } from '../../data/appendixReference';
import { useLanguage } from '../../context/LanguageContext';
import { ReadingDetail, ReadingLink } from './ReadingTools';

export function AppendixReference({section}:{section:string}) {
  const {lang}=useLanguage(), zh=lang==='zh';
  if(section==='A.1') return <div className="space-y-3">
    <p>{zh?'先读出符号，再看它适用的对象。展开条目可查看含义。':'Read the symbol aloud, then check what it applies to. Open an entry for its meaning.'}</p>
    <div className="grid sm:grid-cols-2 gap-3 items-start">{notation.map(n=><ReadingDetail key={n.id} id={'notation-'+n.id} label={<>{n.symbol} · {n.reading[lang]}</>}>
      {n.use[lang]}
    </ReadingDetail>)}</div>
    <ReadingLink to="/book/9#peano-axioms">{zh?'第9.6节：在自然数公理中读量词':'Section 9.6: read quantifiers in the axioms'}</ReadingLink>
  </div>;
  if(section==='A.2') return <div className="space-y-3">{readings.map(r=><ReadingDetail key={r.id} id={r.id} label={r.formula}>{r.text[lang]}</ReadingDetail>)}
    <ReadingLink to="/book/A#notation-forall">{zh?'A.1：全称量词':'A.1: universal quantifier'}</ReadingLink></div>;
  if(section==='A.3') return <article id="implication-table" className="space-y-3">
    <h3 className="font-semibold">{zh?'先取任意命题 p、q':'First take arbitrary propositions p and q'}</h3>
    <p>{zh?'p ⇒ q 只在 p 真、q 假时为假。若 p 为假，蕴含为真，但不能由此断言 q 为真。交换前后件并同时取反，得到逆否命题 ¬q ⇒ ¬p。':'The implication is false only when p is true and q is false. A false p makes the implication true without establishing q. Reverse the order and negate both propositions to obtain the contrapositive ¬q ⇒ ¬p.'}</p>
    <div className="overflow-x-auto"><table className="w-full text-center border-collapse">
      <caption className="text-left font-semibold">{zh?'原命题与逆否命题逐行等价':'The implication and its contrapositive agree in every row'}</caption>
      <thead><tr>{['p','q','p ⇒ q','¬q ⇒ ¬p'].map(h=><th className="p-2 border" scope="col" key={h}>{h}</th>)}</tr></thead>
      <tbody>{truthRows.map((row,i)=><tr key={i}>{row.map((v,j)=><td className="p-2 border" key={j}>{zh?(v?'真':'假'):(v?'T':'F')}</td>)}</tr>)}</tbody>
    </table></div>
    <div id="integer-implication" className="learning-note space-y-2">
      <h3 className="font-semibold">{zh?'再令 n 为整数':'Now let n be an integer'}</h3>
      <p>{zh?'令 p 表示“n = 2”，q 表示“n 为偶数”。原命题是“若 n = 2，则 n 为偶数”；逆否命题是“若 n 不为偶数，则 n ≠ 2”。':'Let p mean “n = 2” and q mean “n is even”. The implication says that if n = 2, n is even; its contrapositive says that if n is not even, n ≠ 2.'}</p>
      <p>{zh?'没有整数能实现“p 真、q 假”：唯一使 p 为真的整数是 2，而 2 为偶数。上表这一行仍是任意命题的合法真值组合。':'No integer realizes “p true, q false”: only 2 makes p true, and 2 is even. That row still belongs in the truth table for arbitrary propositions.'}</p>
      <p>{zh?'n = 4 时，p 假而 q 真：p ⇒ q 为真，逆命题 q ⇒ p 为假。这是“偶数必等于 2”的反例。':'At n = 4, p is false and q is true: p ⇒ q is true, but the converse q ⇒ p is false. This refutes “every even integer equals 2”.'}</p>
    </div>
    <ReadingLink to="/book/B#parity-contradiction">{zh?'B.1：在反证中保留前提':'B.1: keep the premise in a proof by contradiction'}</ReadingLink>
  </article>;
  const method=methods[section as keyof typeof methods];
  return <ReadingDetail id={method.id} label={method.title[lang]}>
    <dl className="space-y-2">
      <dt className="font-semibold">{zh?'命题':'Claim'}</dt><dd>{method.claim[lang]}</dd>
      <dt className="font-semibold">{zh?'前提':'Premises'}</dt><dd>{method.premise[lang]}</dd>
    </dl>
    <h3 className="font-semibold">{zh?'推理步骤':'Reasoning'}</h3>
    <ol className="list-decimal pl-6 space-y-2">{method.steps.map((s,i)=><li key={i}>{s[lang]}</li>)}</ol>
    <p><strong>{zh?'结论：':'Conclusion: '}</strong>{method.conclusion[lang]}</p>
    {section==='B.2' && <nav className="flex flex-wrap gap-3">
      <ReadingLink to="/book/9#left-zero">{zh?'9.7：零是左单位元素':'9.7: zero as a left identity'}</ReadingLink>
      <ReadingLink to="/book/9#addition-associativity">{zh?'9.7：对第三个参数归纳':'9.7: induct on the third argument'}</ReadingLink>
    </nav>}
    {section==='B.1' && <ReadingLink to="/book/A#integer-implication">{zh?'A.3：原命题、逆否命题与逆命题':'A.3: implication, contrapositive and converse'}</ReadingLink>}
  </ReadingDetail>;
}
