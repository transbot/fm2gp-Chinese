import {useLanguage} from '../../context/LanguageContext';
import {rings,inspectElement,multiply} from '../../lib/algorithms/residueRing';
import {zeroDivisorProof} from '../../data/ringProofs';
import {GroupProof} from './GroupProof';
import {ReadingDetail,ReadingLink} from './ReadingTools';
import {SourceDemoLink} from './SourceDemoLink';
import {useStoredChoice} from './useStoredChoice';

const ringIds=['z6','z5'] as const;
const z6Choices=['0','1','2','3','4','5'] as const;
const z5Choices=['0','1','2','3','4'] as const;

function ResidueExplorer() {
  const zh=useLanguage().lang==='zh';
  const model=useStoredChoice('fm2gp:book:8.4:model',ringIds,'z6');
  const z6=useStoredChoice('fm2gp:book:8.4:z6:element',z6Choices,'2');
  const z5=useStoredChoice('fm2gp:book:8.4:z5:element',z5Choices,'2');
  const ring=rings[model.value],choice=model.value==='z6'?z6:z5;
  const a=Number(choice.value),state=inspectElement(ring,a);
  const setText=(values:readonly number[])=>values.length?'{'+values.join(', ')+'}':'∅';
  const units=ring.elements.filter(x=>inspectElement(ring,x).isUnit);
  const divisors=ring.elements.filter(x=>inspectElement(ring,x).isZeroDivisor);
  const name=model.value==='z6'?'ℤ₆':'ℤ₅';
  return <article id="ring-residue-explorer" className="space-y-4 min-w-0">
    <h3 className="text-lg font-semibold">{zh?'同一对数，在两个环中怎样相乘？':'How does the same pair multiply in two rings?'}</h3>
    <p>{zh?'书中例子：ℤ₆ 中 (2×3) mod 6=0。由书中的 ℤₚ 取 p=5，得到固定实例 ℤ₅，其中 (2×3) mod 5=1。这两个模型都是交换环。':'Book example: in ℤ₆, (2×3) mod 6=0. Taking p=5 in the book’s ℤₚ gives the fixed instance ℤ₅, where (2×3) mod 5=1. Both models are commutative rings.'}</p>
    <div className="flex flex-wrap gap-4">
      <label>{zh?'模型':'Model'} <select className="learning-input" value={model.value} onChange={e=>model.choose(e.target.value)}>
        <option value="z6">ℤ₆</option><option value="z5">ℤ₅</option>
      </select></label>
      <label>{zh?'元素 a':'Element a'} <select className="learning-input" value={choice.value} onChange={e=>choice.choose(e.target.value)}>
        {ring.elements.map(x=><option key={x} value={String(x)}>{x}</option>)}
      </select></label>
    </div>
    <p data-testid="ring-model">{name} = {setText(ring.elements)} · {zh?'加法':'Addition'} (a+b) mod {ring.modulus} · {zh?'乘法':'Multiplication'} (a×b) mod {ring.modulus}</p>
    <div className="overflow-x-auto min-w-0" role="region" aria-label={zh?'乘法表':'Multiplication table'} tabIndex={0}>
      <table className="w-full text-center text-sm border-collapse">
        <caption className="py-2 text-left font-semibold">{name} · × (mod {ring.modulus}) · {zh?'◆ 当前乘法行':'◆ Selected multiplication row'}</caption>
        <thead><tr><th scope="col" className="border p-2">a × b</th>{ring.elements.map(b=><th scope="col" className="border p-2" key={b}>{b}</th>)}</tr></thead>
        <tbody>{ring.elements.map(x=><tr key={x} className={x===a?'bg-blue-50 font-bold text-blue-900':''}>
          <th scope="row" className="border p-2">{x}{x===a?' ◆':''}</th>
          {ring.elements.map(b=><td key={b} className="border p-2">{multiply(ring,x,b)}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
    <div className="learning-intro space-y-2" aria-live="polite">
      <p data-testid="ring-row">{zh?'当前乘法行':'Selected multiplication row'} · [{state.row.join(', ')}]</p>
      <p data-testid="ring-negative">{zh?'加法逆元':'Additive inverse'} · {state.additiveInverse} · ({a}+{state.additiveInverse}) mod {ring.modulus}=0</p>
      <p data-testid="ring-inverse">{zh?'乘法逆元':'Multiplicative inverse'} · {state.multiplicativeInverse===null
        ? (zh?'本集合中不存在':'none in this set')
        : state.multiplicativeInverse+' · ('+a+'×'+state.multiplicativeInverse+') mod '+ring.modulus+'=1'}</p>
      <p data-testid="ring-partners">{zh?'非零零乘积伙伴 b':'Nonzero zero-product partners b'} · {setText(state.partners)}</p>
      {state.partners.length>0 && <p data-testid="ring-products">{state.partners.map(b=>'('+a+'×'+b+') mod '+ring.modulus+'=0').join(' · ')}</p>}
      <p data-testid="ring-classification">{zh?'单位':'Unit'} · {state.isUnit?(zh?'是':'yes'):(zh?'否':'no')} · {zh?'零因子':'Zero divisor'} · {state.isZeroDivisor?(zh?'是':'yes'):(zh?'否':'no')}</p>
      {a===0 && <p data-testid="ring-zero">{zh?'0 的加法逆元是 0。因为 1≠0，0 没有乘法逆元。虽然对所有 b 都有 0b=0，定义 8.6 要求零因子自身非零，所以排除 0。':'The additive inverse of 0 is 0. Since 1≠0, it has no multiplicative inverse. Although 0b=0 for every b, Definition 8.6 requires a zero divisor itself to be nonzero, so 0 is excluded.'}</p>}
    </div>
    <p data-testid="ring-sets">{zh?'单位集合':'Units'} {setText(units)} · {zh?'零因子集合':'Zero divisors'} {setText(divisors)}</p>
  </article>;
}

function RingReading() {
  const zh=useLanguage().lang==='zh';
  return <div className="space-y-5">
    <article id="ring-two-operations" className="space-y-3">
      <h3 className="text-lg font-semibold">{zh?'两种运算及其要求':'Two operations and their requirements'}</h3>
      <p>{zh?'定义 8.3：环在一个集合上给出加法、加法逆元、乘法及 0、1。加法满足结合律、交换律，有单位元素 0，每个元素都有加法逆元；乘法满足结合律，有单位元素 1，且 1≠0。':'Definition 8.3: a ring specifies addition, additive inverses, multiplication, 0 and 1 on one set. Addition is associative and commutative, has identity 0 and an inverse for every element. Multiplication is associative with identity 1, and 1≠0.'}</p>
      <p>0a=a0=0 · a(b+c)=ab+ac · (b+c)a=ba+ca</p>
      <p>{zh?'这些分别是零元吸收性和两侧分配律。环的一般定义不要求乘法交换律；满足 ab=ba 的环称为交换环。':'These are zero absorption and the two distributive laws. A general ring need not have commutative multiplication. A ring satisfying ab=ba is called commutative.'}</p>
      <dl className="space-y-2">
        <div><dt className="font-semibold">{zh?'乘法单位元素':'Multiplicative identity'}</dt><dd>{zh?'1 满足 1a=a1=a。':'1 satisfies 1a=a1=a.'}</dd></div>
        <div><dt className="font-semibold">{zh?'可逆元素与单位 · 定义 8.4、8.5':'Invertible elements and units · Definitions 8.4, 8.5'}</dt><dd>{zh?'若同一集合中存在 a⁻¹，且 aa⁻¹=a⁻¹a=1，则 a 可逆。所有可逆元素称为单位。':'An element a is invertible when a⁻¹ belongs to the same set and aa⁻¹=a⁻¹a=1. Such invertible elements are called units.'}</dd></div>
        <div><dt className="font-semibold">{zh?'零因子 · 定义 8.6':'Zero divisor · Definition 8.6'}</dt><dd>{zh?'a≠0，且存在 b≠0 使 ab=0。两个非零条件都需要。':'a≠0 and there exists b≠0 with ab=0. Both nonzero conditions are required.'}</dd></div>
        <div><dt className="font-semibold">{zh?'整环 · 定义 8.7':'Integral domain · Definition 8.7'}</dt><dd>{zh?'没有零因子的交换环称为整环。':'A commutative ring without zero divisors is an integral domain.'}</dd></div>
      </dl>
    </article>
    <ResidueExplorer/>
    <p>{zh?'习题 8.6 的章内参考推导。设 a≠0、b≠0、ab=0，反设 a 可逆。下面的推导只用结合律、单位元素、逆元和零元吸收性。':'In-chapter reference derivation for Exercise 8.6. Assume a≠0, b≠0 and ab=0, and suppose a is invertible. The derivation uses associativity, identity, inverses and zero absorption.'}</p>
    <GroupProof id="zero-divisor-not-unit" title={zh?'零因子为何不能成为单位？':'Why can a zero divisor not be a unit?'} rows={zeroDivisorProof}/>
    <ReadingLink to="/book/8#exercise-8-6">{zh?'返回习题 8.6':'Return to Exercise 8.6'}</ReadingLink>
    <ReadingDetail id="integer-two-boundary" label={zh?'伴读补充：整数 2 的逆元在哪里？':'Companion example: where is the inverse of the integer 2?'}>
      <p>{zh?'在 ℤ 中，2 的乘法逆元需要 1/2，而 1/2 超出整数集合，所以 2 不是单位。整数等式 2b=0 只能得到 b=0，所以 2 也不是零因子。可逆性取决于所用集合。':'In ℤ, the inverse of 2 would be 1/2, which lies outside the integers, so 2 is not a unit. The integer equation 2b=0 forces b=0, so 2 is not a zero divisor either. Invertibility depends on the set in use.'}</p>
      <ReadingLink to="/book/8#section-8-8">{zh?'到 8.8 比较 ℤ、ℚ 和 ℚ[x]':'Compare ℤ, ℚ and ℚ[x] in 8.8'}</ReadingLink>
    </ReadingDetail>
  </div>;
}

export function Chapter8({section}:{section:string}) {
  const zh=useLanguage().lang==='zh';
  if(section==='8.4')return <RingReading/>;
  return <div className="space-y-4">
    <article id="field-model-comparison" className="space-y-3">
      <h3 className="text-lg font-semibold">{zh?'每个非零元素都能求逆吗？':'Is every nonzero element invertible?'}</h3>
      <p>{zh?'定义 8.10：每个非零元素都可逆的整环称为域。ℚ 是书中的典型例子；由书中的素数剩余域 ℤₚ 取 p=5，得到 ℤ₅。下面的固定对照连接系数域与多项式运算。':'Definition 8.10: an integral domain in which every nonzero element is invertible is a field. ℚ is the book’s typical example. Choosing p=5 in its prime residue field ℤₚ gives ℤ₅. This companion comparison connects coefficient fields to polynomial arithmetic.'}</p>
      <div tabIndex={0} role="region" aria-label={zh?'域与多项式对照':'Fields and polynomials'} className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="text-left font-semibold">{zh?'均采用各集合上的通常加法与乘法':'Usual addition and multiplication on each set'}</caption>
          <thead><tr>{[zh?'集合':'Set',zh?'单位':'Units',zh?'范围与结构':'Scope and structure'].map(s=><th key={s} scope="col" className="border p-2">{s}</th>)}</tr></thead>
          <tbody>
            <tr><th scope="row" className="border p-2">ℤ</th><td className="border p-2">±1</td><td className="border p-2">{zh?'整环；1/2 超出集合，2 不可逆。':'Integral domain; 1/2 is outside the set, so 2 is not invertible.'}</td></tr>
            <tr><th scope="row" className="border p-2">ℚ</th><td className="border p-2">{zh?'所有非零有理数':'All nonzero rationals'}</td><td className="border p-2">{zh?'域；非零 p/q 的逆元为 q/p。':'Field; nonzero p/q has inverse q/p.'}</td></tr>
            <tr><th scope="row" className="border p-2">ℚ[x]</th><td className="border p-2">{zh?'所有非零常数多项式':'All nonzero constant polynomials'}</td><td className="border p-2">{zh?'欧几里得整环；2 的逆元是常数 1/2，x 的倒数 1/x 超出多项式集合。':'Euclidean domain; 2 has constant inverse 1/2, while 1/x lies outside the polynomial set.'}</td></tr>
          </tbody>
        </table>
      </div>
      <p>{zh?'在 ℚ[x] 中，两个非零多项式相乘，次数相加。因此乘积为 1 时两者的次数都必须为 0。单位恰为非零常数多项式。带余除法利用 ℚ 中的系数除法，逐项消去最高次项。':'In ℚ[x], the degrees of two nonzero polynomials add under multiplication. A product of 1 therefore requires both degrees to be 0. The units are exactly the nonzero constant polynomials. Division with remainder uses coefficient division in ℚ to eliminate leading terms.'}</p>
    </article>
    <ReadingDetail id="polynomial-leading-division" label={zh?'伴读补充：x 除以 2x':'Companion example: divide x by 2x'}>
      <p>{zh?'在演示中选择“首项系数相除”。降幂输入 A=[1,0]、B=[2,0]，首项系数 1÷2 得到 1/2。':'Choose “Dividing leading coefficients” in the demonstration. Descending inputs A=[1,0], B=[2,0] give the leading coefficient ratio 1÷2=1/2.'}</p>
      <p>T=1/2 · Q=1/2 · R=0</p><p>x = (2x) × (1/2) + 0</p>
      <p>{zh?'一次消元完成带余除法。GCD 循环完成一轮，原始返回 2x；最后除以首项系数 2，首一化返回 x。首一化不增加迭代或消元计数。':'One elimination completes division. The GCD loop completes one iteration and returns raw 2x. Dividing by its leading coefficient 2 makes the result monic, returning x. This adds no iteration or elimination.'}</p>
      <SourceDemoLink path="/polynomial-gcd" anchor="polynomial-leading-division"/>
    </ReadingDetail>
    <ReadingLink to="/book/8#ring-residue-explorer">{zh?'返回 8.4 观察单位与零因子':'Return to units and zero divisors in 8.4'}</ReadingLink>
  </div>;
}
