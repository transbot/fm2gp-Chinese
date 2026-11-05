import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LearningShell, TermHelp } from '../common/LearningShell';
import { TraceCode } from '../common/TraceCode';
import { usePlayback } from './usePlayback';
import { gcdInputErrors, gcdMessages, polynomialExamples, polynomialGcdCode } from './polynomialGcdPresentation';
import { degree, divideFraction, divisionTrace, evaluatePoly, fraction, fractionText, fromIntegers, GcdInputError, isZero, parseGcdPolynomial, Poly, polynomialDivision, polynomialGcdTrace, PolynomialGcdStep, polynomialText } from '../../lib/algorithms/polynomialGcd';
import { repoFile } from '../../data/bookCatalog';
const initial=polynomialExamples[0];
export function PolynomialGcd(){
  const {lang}=useLanguage(),zh=lang==='zh',ix=zh?0:1;
  const [draft,setDraft]=useState({A:JSON.stringify(initial.A),B:JSON.stringify(initial.B)});
  const [errors,setErrors]=useState<Partial<Record<'A'|'B',GcdInputError>>>({});
  const [run,setRun]=useState<{A:Poly;B:Poly;rawA:string;rawB:string;originalA:number[];originalB:number[];revision:number}|null>({A:fromIntegers([...initial.A]),B:fromIntegers([...initial.B]),rawA:JSON.stringify(initial.A),rawB:JSON.stringify(initial.B),originalA:[...initial.A],originalB:[...initial.B],revision:0});
  const [revision,setRevision]=useState(0);
  const apply=(rawA=draft.A,rawB=draft.B)=>{
    const a=parseGcdPolynomial(rawA),b=parseGcdPolynomial(rawB),next=revision+1;setRevision(next);
    if(a.ok&&b.ok){setRun({A:a.poly,B:b.poly,rawA,rawB,originalA:a.original,originalB:b.original,revision:next});setErrors({});}
    else{setRun(null);setErrors({A:a.ok?undefined:a.error,B:b.ok?undefined:b.error});}
  };
  const pending=!run||draft.A!==run.rawA||draft.B!==run.rawB;
  return <LearningShell wide title={zh?'多项式带余除法与最大公约数':'Polynomial division with remainder and GCD'} description={zh?'第8.1、8.7节 · 从消去最高次项，到同一个泛型GCD循环。系数在有理数域ℚ中精确计算。':'Sections 8.1 and 8.7 · From eliminating leading terms to the same generic GCD loop. Coefficients are computed exactly in the rational field ℚ.'}>
    <nav className="learning-card flex flex-wrap gap-4" aria-label={zh?'多项式学习入口':'Polynomial learning links'}><Link className="learning-link" to="/horner">{zh?'先学：霍纳法则与系数序列':'Learn first: Horner and coefficient sequences'}</Link><Link className="learning-link" to="/division">{zh?'先学：整数求余':'Learn first: integer remainders'}</Link><Link className="learning-link" to="/concepts/algebra">{zh?'复习：运算与代数结构':'Review: operations and algebraic structures'}</Link><Link className="learning-link" to="/book/8#section-8-8">{zh?'第8.8节：为什么选择有理数系数':'Section 8.8: why rational coefficients'}</Link></nav>
    <form className="learning-card" onSubmit={e=>{e.preventDefault();apply();}}>
      <div className="grid sm:grid-cols-2 gap-4">{(['A','B'] as const).map(field=><div key={field}><label htmlFor={`polynomial-${field}`}>{field}：{zh?'降幂系数数组':'coefficients in descending order'}</label><input id={`polynomial-${field}`} className="learning-input w-full mt-2" value={draft[field]} aria-invalid={!!errors[field]} aria-describedby={errors[field]?`polynomial-error-${field}`:undefined} onChange={e=>{setDraft({...draft,[field]:e.target.value});setErrors({...errors,[field]:undefined});}}/>{errors[field]&&<p role="alert" id={`polynomial-error-${field}`} className="text-red-700 mt-2">{gcdInputErrors[errors[field]!][ix]}</p>}</div>)}</div>
      <p className="text-sm text-gray-600">{zh?'每个数组1—9项，每项为绝对值≤1000的十进制整数。前导零也计入输入项数；中间零、末尾零保留幂次。[0]表示零多项式，空白和[]不是有效输入。':'Each array contains 1–9 decimal integers, each with absolute value ≤1000. Leading zeros count toward the input limit; interior and trailing zeros preserve powers. [0] represents the zero polynomial; blank and [] are not valid inputs.'}</p>
      {pending&&<p role="status" data-testid="pending-input" className="text-amber-800">{zh?'待应用：编辑尚未生效。应用后两个播放器暂停并从新输入重新开始。':'Pending: draft edits are not applied. Applying pauses both players and restarts them with the new input.'}</p>}
      <button className="learning-primary" type="submit">{zh?'应用输入':'Apply input'}</button>
      <div className="flex flex-wrap gap-2">{polynomialExamples.map(e=><button className="learning-secondary" type="button" data-testid={`example-${e.id}`} key={e.id} onClick={()=>{const A=JSON.stringify(e.A),B=JSON.stringify(e.B);setDraft({A,B});apply(A,B);}}>{e.title[ix]}</button>)}</div>
    </form>
    {run&&<section className="learning-card min-w-0"><h2 className="text-xl font-semibold">{zh?'已应用输入与标准形':'Applied input and canonical form'}</h2>{(['A','B'] as const).map(field=><div key={field} data-testid={`canonical-${field}`}><p>{field} · {zh?'原始系数':'Original coefficients'}: [{(field==='A'?run.originalA:run.originalB).join(', ')}]</p><Formula label={zh?'标准形':'Canonical form'} poly={run[field]}/><p className="text-sm">{zh?'标准系数':'Canonical coefficients'}: [{run[field].map(fractionText).join(', ')}]</p></div>)}<p className="text-sm text-gray-600">{zh?'只移除前导零；所有中间计算使用约分后的BigInt分数。分母始终为正，零统一为0/1。':'Only leading zeros are removed. All intermediate arithmetic uses reduced BigInt fractions, with positive denominators and zero represented as 0/1.'}</p></section>}
    {run&&<Players key={run.revision} A={run.A} B={run.B}/>}
    <TermHelp term={zh?'开发者笔记：从ℚ到ℚ[x]，为什么能求GCD？':'Developer notes: from ℚ to ℚ[x], why does GCD work?'} href="/book/8#section-8-7">
      <p>{zh?'ℚ是有理数域：每个非零系数都能作除数，因此首项相除仍得到有理数。ℚ[x]是有理数系数多项式的集合；它是欧几里得整环，并不是域，例如x的倒数1/x不是多项式。这里的“域”与“欧几里得整环”不是同一个概念。':'ℚ is a field: every nonzero coefficient can be divided by, and the result stays rational. ℚ[x] is the set of rational-coefficient polynomials. It is a Euclidean domain, not a field: for example, 1/x is not a polynomial. “Field” and “Euclidean domain” mean different things here.'}</p>
      <p>{zh?'次数是最高非零项的幂次，非零常数的次数为0。零多项式没有通常意义的次数，本页单独标为未定义，先判断R=0，再比较次数。每次消元降低非零余式的次数；每次求余结束满足R=0或deg(R)<deg(B)，所以GCD循环会终止。':'Degree is the highest power with a nonzero coefficient; a nonzero constant has degree 0. The zero polynomial has no ordinary degree: this page labels it undefined and checks R=0 before comparing degrees. Each elimination lowers a nonzero remainder’s degree. Each completed remainder call has R=0 or deg(R)<deg(B), so the GCD loop terminates.'}</p>
      <p>{zh?'在A=BQ+R中，A与B的公因式也整除R；B与R的公因式也整除A。因此用(B,R)替换(A,B)保留了公因式。外层源码只需要remainder与swap；长除法内层维护商Q，是为了展示这个恒等式。成对更新Q和R完成后才记一次消元。':'In A=BQ+R, a common divisor of A and B divides R; a common divisor of B and R divides A. Replacing (A,B) by (B,R) therefore preserves common divisors. The outer source needs only remainder and swap; inner long division also keeps Q to display the identity. One elimination is counted only after both Q and R are updated.'}</p>
      <p>{zh?'GCD在非零常数倍意义下并不唯一。首一化把非零结果除以首项系数，选出唯一的首一代表；它只发生在书中循环返回之后，不改变各轮余式。在ℚ[x]里4和6都是可逆的非零常数，因此首一GCD为1，而不是整数GCD的2。':'A polynomial GCD is only determined up to a nonzero constant factor. Making the result monic divides by its leading coefficient to choose a unique representative. This happens after the book’s loop returns and does not rescale intermediate remainders. In ℚ[x], 4 and 6 are invertible nonzero constants, so their monic GCD is 1, rather than the integer GCD 2.'}</p>
      <p>{zh?'gcd(A,0)先返回A再首一化；gcd(0,B)得到B的首一形式。gcd(0,0)在本演示中约定为0。零除式只禁止带余除法，不禁止这些GCD输入。输入上限不限制中间分子和分母；回放和恒等式校验不计入迭代次数。':'gcd(A,0) returns A before making it monic; gcd(0,B) gives the monic form of B. This demonstration defines gcd(0,0)=0. A zero divisor is forbidden for division, not for these GCD inputs. Input bounds do not limit intermediate numerators or denominators. Playback and identity checks do not add iterations.'}</p>
      <p>{zh?'长除法按第8.1节定义作教学展开，首一化是独立后处理；外层gcd函数体对应第8.7节，配套代码位于ch12.h。习题8.3只接入前两题。':'Long division is a teaching expansion of Section 8.1; monic normalization is separate postprocessing. The outer gcd body corresponds to Section 8.7 and is supplied in ch12.h. Only the first two parts of Exercise 8.3 are included.'}</p>
      <a className="learning-link block" href={repoFile('配套代码(fm2gpcode)/ch12.h',64)}>{zh?'泛型gcd配套源码：ch12.h':'Companion generic gcd source: ch12.h'}</a><Link className="learning-link block" to="/book/8#exercise-8-3">{zh?'习题8.3：多项式GCD':'Exercise 8.3: polynomial GCD'}</Link>
    </TermHelp>
  </LearningShell>;
}
function Formula({label,poly}:{label:string;poly:Poly}){
  return <div role="region" tabIndex={0} aria-label={label} className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3"><p className="font-mono w-max min-w-full" data-testid={`formula-${label}`}>{label} = {polynomialText(poly)}</p></div>;
}
function Players({A,B}:{A:Poly;B:Poly}){
  const {lang}=useLanguage(),zh=lang==='zh';
  const traces=useMemo(()=>({division:isZero(B)?null:divisionTrace(A,B),gcd:polynomialGcdTrace(A,B)}),[A,B]);
  const division=usePlayback(traces.division?.length??1),gcd=usePlayback(traces.gcd.length);
  return <div className="grid xl:grid-cols-2 gap-4 items-start">{traces.division?<Player mode="division" steps={traces.division} playback={division}/>:<section className="learning-card" data-testid="zero-divisor"><h2 className="text-xl font-semibold">{zh?'一次带余除法':'One division with remainder'}</h2><p role="alert">{zh?'带余除法要求B≠0。当前B为零，不能进行除法；GCD播放器仍可使用。':'Division requires B≠0. B is zero, so division is unavailable; the GCD player remains available.'}</p></section>}<Player mode="gcd" steps={traces.gcd} playback={gcd}/></div>;
}
function Player({mode,steps,playback}:{mode:'division'|'gcd';steps:PolynomialGcdStep[];playback:ReturnType<typeof usePlayback>}){
  const {lang}=useLanguage(),zh=lang==='zh',s=steps[playback.step],d=s.inner;
  const degreeText=(p:Poly)=>degree(p)??(zh?'未定义（零多项式）':'undefined (zero polynomial)');
  const finalDivision=mode==='division'&&s.event==='divisionReturn';
  const root=finalDivision&&degree(s.inputB)===1?divideFraction(fraction(-s.inputB[1].n,s.inputB[1].d),s.inputB[0]):null;
  const divides=s.result&&!isZero(s.result)?isZero(polynomialDivision(s.inputA,s.result).R)&&isZero(polynomialDivision(s.inputB,s.result).R):null;
  return <section className="learning-card min-w-0" data-testid={`polynomial-${mode}`} data-function={s.fn} data-event={s.event}>
    <h2 className="text-xl font-semibold text-blue-900">{mode==='division'?(zh?'一次带余除法':'One division with remainder'):(zh?'书中的GCD循环':'The book’s GCD loop')}</h2>
    {playback.controls}<button className="learning-secondary" onClick={playback.reset}>{zh?'重置':'Reset'}</button>
    <p data-testid="counts">{zh?'已完成GCD迭代':'Completed GCD iterations'}: {s.counts.gcdRounds} · {zh?'累计消元轮次':'Total eliminations'}: {s.counts.eliminations}</p>
    <p className="font-semibold">{zh?'当前函数':'Current function'}: <span data-testid="function">{s.fn}</span></p>
    {s.outer&&<div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3" data-testid="outer"><h3 className="font-semibold">{s.fn==='gcd'?(zh?'gcd的局部变量':'gcd locals'):s.fn==='monic'?(zh?'已返回的gcd上下文':'Returned gcd context'):(zh?'暂停的外层gcd（尚未赋值）':'Suspended outer gcd (not assigned yet)')}</h3><Formula label="a" poly={s.outer.a}/><Formula label="b" poly={s.outer.b}/></div>}
    {d&&<div className="space-y-2" data-testid="inner"><h3 className="font-semibold">{zh?'remainder的独立局部变量':'Independent remainder locals'}</h3>{(['A','B','Q','R'] as const).map(k=><Formula key={k} label={k} poly={d[k]}/>)}<p>{zh?'本次消元轮次':'Eliminations in this call'}: {d.round}</p><p data-testid="degrees">deg(B) = {degreeText(d.B)} · deg(R) = {degreeText(d.R)}</p>{(d.round>0||s.event==='term')&&<div className="space-y-2 learning-intro"><p>{s.event==='term'?(zh?'即将执行的消元':'Elimination to execute'):(zh?'最近完成的消元':'Last completed elimination')}</p><Formula label="T" poly={d.T}/><Formula label="T × B" poly={d.product}/><div role="region" tabIndex={0} aria-label={zh?'消元算式':'Elimination expression'} className="overflow-x-auto"><p className="font-mono w-max">({polynomialText(d.beforeR)}) − ({polynomialText(d.product)}){s.event!=='term'&&` = ${polynomialText(d.R)}`}</p></div></div>}</div>}
    <p role="status" data-testid="explanation">{gcdMessages[s.event][zh?0:1]}</p>
    {s.condition!==null&&<p>{zh?'条件结果':'Condition result'}: {s.condition?(zh?'真':'true'):(zh?'假':'false')}</p>}
    {s.identity&&d&&<div data-testid="identity" className="learning-intro overflow-x-auto" role="region" tabIndex={0} aria-label={zh?'带余除法恒等式':'Division identity'}><p>{zh?'已精确验证 A = BQ + R':'Exactly verified: A = BQ + R'}</p><p className="font-mono w-max">{polynomialText(d.A)} = ({polynomialText(d.B)}) × ({polynomialText(d.Q)}) + ({polynomialText(d.R)})</p></div>}
    {s.event==='divisionReturn'&&d&&<p data-testid="degree-bound" className="learning-intro">{isZero(d.R)?'R = 0':`deg(R) = ${degree(d.R)} < deg(B) = ${degree(d.B)}`} · {zh?'求余结束条件满足':'Remainder termination condition satisfied'}</p>}
    {s.returned&&<Formula label={zh?'最近返回值':'Latest returned value'} poly={s.returned}/>}
    {s.rawGcd&&<Formula label={zh?'原始GCD返回值':'Raw GCD return'} poly={s.rawGcd}/>}
    {s.fn==='monic'&&s.rawGcd&&<div data-testid="monic-locals" className="space-y-2"><p>{zh?'首一化局部上下文':'Monic normalization locals'}: {isZero(s.rawGcd)?(zh?'零结果不除以首项系数':'Zero result is not divided by its leading coefficient'):`lead(raw) = ${fractionText(s.rawGcd[0])}`}</p><Formula label={zh?'首一GCD':'Monic GCD'} poly={s.result!}/><p data-testid="divisibility">{divides?(zh?'已精确验证：结果整除两个原始输入。':'Exactly verified: the result divides both original inputs.'):(zh?'本演示约定 gcd(0,0)=0。':'This demonstration defines gcd(0,0)=0.')}</p></div>}
    {root&&<div className="learning-intro" data-testid="horner-connection"><p>{zh?'与霍纳法则相连':'Connection to Horner'}: A({fractionText(root)}) = {fractionText(evaluatePoly(s.inputA,root))} = R</p><p>{zh?'当B含因子x−r时，代入r使BQ为零，余式就是A(r)。':'When B has factor x−r, substituting r makes BQ zero, so the remainder is A(r).'}</p><Link className="learning-link" to="/horner">{zh?'打开霍纳演示（默认书例可输入[3,-4,-6,10]，x=2）':'Open Horner (for the book example enter [3,-4,-6,10], x=2)'}</Link></div>}
    <p className="text-sm text-gray-600">{s.fn==='gcd'?(zh?'书中gcd函数体 · 配套源码ch12.h':'Book gcd function body · companion source ch12.h'):s.fn==='remainder'?(zh?'第8.1节定义的教学展开；Q辅助展示，返回R':'Teaching expansion of Section 8.1; Q aids the display, R is returned'):(zh?'循环返回后的独立首一化后处理':'Separate monic postprocessing after the loop returns')} · {zh?'高亮表示刚执行的语句':'Highlight marks the statement just executed'}</p>
    <TraceCode lines={polynomialGcdCode[s.fn]} active={s.event==='init'?'':s.line} label={zh?'刚执行的代码':'Code just executed'}/>
    {!!s.divisions.length&&<details className="rounded-lg border p-3" data-testid="division-history"><summary className="cursor-pointer font-semibold">{zh?'已完成的求余调用':'Completed remainder calls'} ({s.divisions.length})</summary><div className="overflow-x-auto mt-3" role="region" tabIndex={0} aria-label={zh?'求余历史':'Remainder history'}><table className="text-sm w-max"><thead><tr>{['A','B','Q','R',zh?'消元轮次':'Eliminations'].map(v=><th className="p-2 text-left" key={v}>{v}</th>)}</tr></thead><tbody>{s.divisions.map((v,i)=><tr key={i}>{(['A','B','Q','R'] as const).map(k=><td className="p-2 border-t" key={k}>{polynomialText(v[k])}</td>)}<td className="p-2 border-t">{v.eliminations}</td></tr>)}</tbody></table></div></details>}
  </section>;
}
