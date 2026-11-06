import {useState} from 'react';
import {useLanguage} from '../../context/LanguageContext';
import {cyclicSize,finiteOrder,partition,type ProofRow} from '../../data/groupProofs';
import {group,orbit,leftCoset,fixedSubgroup,type Residue} from '../../lib/algorithms/finiteGroup';
import {ReadingDetail,ReadingLink} from './ReadingTools';
import {SourceDemoLink} from './SourceDemoLink';

const members = (values:readonly number[]) => '{'+values.join(', ')+'}';
const subgroupSets = [...new Set(group.map(a=>members(orbit(a).members)))];

function useSelection(key:string, fallback:Residue) {
  const [value,setValue] = useState<Residue>(()=>{
    try {
      const saved = sessionStorage.getItem(key);
      return group.find(a=>String(a)===saved) ?? fallback;
    } catch { return fallback; }
  });
  function choose(selection:string) {
    const next = group.find(a=>String(a)===selection);
    if (next===undefined) return;
    setValue(next);
    try { sessionStorage.setItem(key,String(next)); } catch { /* The selector still works without storage. */ }
  }
  return {value,choose};
}

function Picker({label,selection}:{label:string;selection:ReturnType<typeof useSelection>}) {
  return <label className="block font-medium">{label}
    <select className="learning-input ml-2" value={selection.value} onChange={e=>selection.choose(e.target.value)}>
      {group.map(a=><option key={a} value={a}>{a}</option>)}
    </select>
  </label>;
}

function Proof({id,title,rows}:{id:string;title:string;rows:ProofRow[]}) {
  const zh = useLanguage().lang==='zh';
  return <ReadingDetail id={id} label={title}>
    <ol className="list-decimal space-y-3 pl-6">{rows.map(([stepId,formula,z,en])=><li key={stepId}>
      <code className="mb-2 block break-words">{formula}</code>
      <ReadingDetail id={stepId} label={<>{zh?'查看本步依据':'Why this step is valid'}<span className="sr-only">: {formula}</span></>}>
        <p>{zh?z:en}</p>
      </ReadingDetail>
    </li>)}</ol>
  </ReadingDetail>;
}

function OrderProof() {
  const zh = useLanguage().lang==='zh';
  return <article className="space-y-4">
    <h3 className="text-lg font-semibold">{zh?'群有多大？一个元素多久回到单位元素？':'How large is the group? When does a power return to the identity?'}</h3>
    <p>{zh?'定义 6.6：有限群的阶 |G| 是它的元素个数。定义 6.7：元素阶 ord(a) 是满足 aᵈ = e 的最小正整数 d；若不存在，则为无限阶。e¹ = e，所以单位元素的阶是 1。只有 e 的阶是 1。':'Definition 6.6: the order |G| of a finite group counts its elements. Definition 6.7: the order ord(a) of an element is the least positive d with aᵈ = e; if none exists, the order is infinite. Since e¹ = e, the identity has order 1, and only the identity does.'}</p>
    <Proof id="element-order" title={zh?'为什么有限群中总能回到 e？（定理 6.6）':'Why must a power return to e in a finite group? (Theorem 6.6)'} rows={finiteOrder}/>
    <nav className="flex flex-wrap gap-4">
      <SourceDemoLink path="/concepts/algebra" anchor="section-6-3"/>
      <ReadingLink to="/book/B#section-B-3">{zh?'附录 B.3：鸽巢原理':'Appendix B.3: pigeonhole principle'}</ReadingLink>
      <ReadingLink to="/book/6#section-6-4">{zh?'6.4：观察实际的幂序列':'6.4: follow the powers'}</ReadingLink>
    </nav>
  </article>;
}

function GeneratedSubgroup() {
  const zh = useLanguage().lang==='zh';
  const selection = useSelection('fm2gp:book:6.4:element',2);
  const a = selection.value;
  const result = orbit(a);
  return <article id="generated-subgroup" className="space-y-4">
    <p>{zh?'书例：模 7 非零余数乘法群 G = {1, 2, 3, 4, 5, 6}，群的阶是 6。每次乘以所选元素并对 7 取余，从指数 1 开始，到首次出现 1 为止。':'Book example: the nonzero residues G = {1, 2, 3, 4, 5, 6} form a group of order 6 under multiplication modulo 7. Start at exponent 1 and repeatedly multiply by the selected element modulo 7 until 1 first appears.'}</p>
    <Picker label={zh?'选择元素':'Choose an element'} selection={selection}/>
    <div aria-live="polite" className="learning-intro space-y-2">
      <p>{zh?'正整数幂（模 7）':'Positive powers (mod 7)'} · <strong data-testid="power-sequence">{result.powers.join(' → ')}</strong></p>
      <ol className="flex flex-wrap gap-2">{result.powers.map((r,i)=><li className="rounded border bg-white px-2" key={i}>{a}<sup>{i+1}</sup> ≡ {r} (mod 7)</li>)}</ol>
      <p>{zh?'首次回到 1 的指数':'First positive exponent returning to 1'} · ord({a}) = {result.order}</p>
      <p>〈{a}〉 = <strong data-testid="generated-members">{members(result.members)}</strong> · |〈{a}〉| = {result.order}</p>
      <p>{result.order===group.length ? (zh?'生成整个 G，是 G 的生成元。':'Generates all of G: a generator of G.') : (zh?'生成 G 的真子群。':'Generates a proper subgroup of G.')}</p>
    </div>
    <p>{zh?'书例中的四个子群。试换一个元素，看它是否仍生成同一子群。':'The four subgroups in the book’s example. Can a different element generate the same subgroup?'}</p>
    <ul className="flex flex-wrap gap-2">{subgroupSets.map(set=><li key={set} className={'rounded border p-2 '+(set===members(result.members)?'border-blue-600 bg-blue-50':'')}>
      {set} {set===members(result.members) && <strong>{zh?'（当前生成）':'(generated here)'}</strong>}
    </li>)}</ul>
    <Proof id="cyclic-size" title={zh?'为什么生成子群的大小等于元素阶？（引理 6.2）':'Why does the generated subgroup have the element’s order? (Lemma 6.2)'} rows={cyclicSize}/>
    <p>{zh?'定义 6.8 要求子群包含单位元素，并对乘法和取逆封闭。按定义 6.9，如果一个元素生成整个群，这个群就是循环群。试选 3 和 5，比较生成次序与成员集合。':'Definition 6.8 requires a subgroup to contain the identity and be closed under multiplication and inverses. By Definition 6.9 a group generated by a single element is cyclic. Select 3 and 5 to compare the order of appearance with the set of members.'}</p>
    <nav className="flex flex-wrap gap-4">
      <ReadingLink to="/book/6#exercise-6-6">{zh?'习题 6.6：再试模 11':'Exercise 6.6: try modulus 11'}</ReadingLink>
      <ReadingLink to="/book/6#section-6-5">{zh?'6.5：用 〈2〉 划分 G':'6.5: partition G using 〈2〉'}</ReadingLink>
    </nav>
  </article>;
}

function Applications() {
  const zh = useLanguage().lang==='zh';
  return <ReadingDetail id="lagrange-applications" label={zh?'从元素阶到两个数论应用':'From element order to two number-theoretic applications'}>
    <p>{zh?'推论 6.7.1、6.7.2：取 H = 〈a〉，则 d = ord(a) = |H| 整除 |G|。写 |G| = qd，得 a 的 |G| 次幂为 (aᵈ)^q = e。群阶保证返回，未必是首次返回；例如 2³ ≡ 1、2⁶ ≡ 1（模 7），元素 2 的阶是 3。':'Corollaries 6.7.1 and 6.7.2: take H = 〈a〉. Then d = ord(a) = |H| divides |G|. Write |G| = qd; raising a to |G| gives (aᵈ)^q = e. The group order guarantees a return, but need not be the first: 2³ ≡ 1 and 2⁶ ≡ 1 (mod 7), while 2 has order 3.'}</p>
    <ReadingDetail id="lagrange-fermat" label={zh?'费马小定理：模素数的非零余数':'Fermat’s little theorem: nonzero residues modulo a prime'}>
      <p>{zh?'p 为素数时，模 p 非零余数有 p−1 个，都可逆。因此对 0 < a < p，a 的 p−1 次幂与 1 模 p 同余。到演示输入 a=2、p=7，验证 2⁶ ≡ 1（模 7）；为什么指数 6 可以大于元素阶 3？':'For prime p, the p−1 nonzero residues modulo p are all invertible. Hence for 0 < a < p the (p−1)st power of a is congruent to 1 modulo p. Enter a=2 and p=7 to verify 2⁶ ≡ 1 (mod 7). Why can the exponent 6 exceed the element order 3?'}</p>
      <SourceDemoLink path="/fermat" anchor="lagrange-fermat"/>
    </ReadingDetail>
    <ReadingDetail id="lagrange-euler" label={zh?'欧拉定理：模 n 的可逆余数':'Euler’s theorem: invertible residues modulo n'}>
      <p>{zh?'可逆余数乘法群的阶是 φ(n)。若 0 < a < n 且 gcd(a,n)=1，则 a 的 φ(n) 次幂与 1 模 n 同余。输入 a=3、n=8，观察 φ(8)=4 与 3⁴ ≡ 1（模 8）；再试 a=2，它不在这个群中。':'The group of invertible residues has order φ(n). For 0 < a < n with gcd(a,n)=1, raising a to φ(n) gives 1 modulo n. Enter a=3 and n=8 to see φ(8)=4 and 3⁴ ≡ 1 (mod 8). Then try a=2, which is outside this group.'}</p>
      <SourceDemoLink path="/euler" anchor="lagrange-euler"/>
    </ReadingDetail>
  </ReadingDetail>;
}

function Cosets() {
  const zh = useLanguage().lang==='zh';
  const selection=useSelection('fm2gp:book:6.5:representative',3);
  const a=selection.value;
  const result=leftCoset(a);
  return <article id="coset-partition" className="space-y-4">
    <p>{zh?'定义 6.10：左陪集 aH = {ah : h ∈ H}。代表元在左，H 的每个元素在右。':'Definition 6.10: the left coset aH = {ah : h ∈ H}. The representative is on the left of every element of H.'}</p>
    <ReadingDetail id="integer-cosets" label={zh?'书例：ℤ 与加法子群 4ℤ':'Book example: ℤ and its additive subgroup 4ℤ'}>
      <ul>{[0,1,2,3].map(r=><li key={r}>{r} + 4ℤ = {'{…,'} {r-8}, {r-4}, {r}, {r+4}, {r+8}, …{'}'}</li>)}</ul>
      <p>{zh?'这四行分别是除以 4 的四类余数。5 + 4ℤ = 1 + 4ℤ，因为把 5 + 4k 写成 1 + 4(k+1) 只改变了整数参数。每行向两端无限延伸。':'These four rows correspond to the four remainders modulo 4. Since 5 + 4k = 1 + 4(k+1), the cosets 5 + 4ℤ and 1 + 4ℤ coincide. Each row extends indefinitely in both directions.'}</p>
    </ReadingDetail>
    <h3 className="font-semibold">{zh?'伴读补充：模 7 陪集划分':'Reader example: partition into cosets modulo 7'}</h3>
    <p>{zh?'本节固定使用 H＝〈2〉＝{1,2,4}。选择代表元只改变左陪集，上一节仍可独立选择生成元素。':'This section fixes H = 〈2〉 = {1,2,4}. The representative changes the left coset; the generator in the preceding section is selected independently.'}</p>
    <Picker label={zh?'选择陪集代表元':'Choose a coset representative'} selection={selection}/>
    <div className="learning-intro space-y-2" aria-live="polite">
      <p>{zh?'依 h = 1, 2, 4 的顺序计算（模 7）':'Compute in the order h = 1, 2, 4 (mod 7)'} · <strong data-testid="coset-products">{result.products.join(' → ')}</strong></p>
      <ul className="flex flex-wrap gap-2">{fixedSubgroup.map((h,i)=><li className="rounded border bg-white px-2" key={h}>{a} × {h} ≡ {result.products[i]} (mod 7)</li>)}</ul>
      <p>{zh?'按成员归组':'Grouped by membership'} · {a}H = <strong data-testid="coset-members">{members(result.members)}</strong></p>
    </div>
    <ul className="space-y-2">{([1,3] as const).map(rep=>{
      const set=leftCoset(rep).members;
      const active=set.includes(a);
      return <li className={'rounded border p-2 '+(active?'border-blue-600 bg-blue-50':'')} key={rep}>
        {members(set)} · {zh?'代表元':'Representatives'} {set.join(', ')} {active && <strong>{zh?'（当前陪集）':'(selected coset)'}</strong>}
      </li>;
    })}</ul>
    <p>{zh?'两个不同陪集各有 3 个元素，互不相交，合起来恰是 G。因此 6 = 2 × 3。':'There are two distinct cosets of three elements each. They are disjoint and together exhaust G, so 6 = 2 × 3.'}</p>
    <Proof id="coset-proof" title={zh?'从左陪集证明拉格朗日定理（定理 6.7）':'Prove Lagrange’s theorem using left cosets (Theorem 6.7)'} rows={partition}/>
    <Applications/>
  </article>;
}

export function Chapter6({section}:{section:string}) {
  switch(section) {
    case '6.3': return <OrderProof/>;
    case '6.4': return <GeneratedSubgroup/>;
    case '6.5': return <Cosets/>;
    default: return null;
  }
}
