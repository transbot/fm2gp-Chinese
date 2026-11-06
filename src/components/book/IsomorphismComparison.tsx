import {useLanguage} from '../../context/LanguageContext';
import {compare,images,matchCount,properties,u5,u8,z4,type FourElementModel} from '../../lib/algorithms/fourElementModels';
import {ReadingDetail} from './ReadingTools';
import {useStoredChoice} from './useStoredChoice';

const digits=['0','1','2','3'] as const;
const presets=['f2','f3','b'] as const;
const symbols={f2:'f₂',f3:'f₃',b:'b'};
const modelNames={z4:'ℤ₄',u5:'U(5)',u8:'U(8)'};
const modulus={z4:4,u5:5,u8:8};

export function OperationTable({model,pair,diagonal=false}:{model:FourElementModel;pair?:[number,number];diagonal?:boolean}) {
  const zh=useLanguage().lang==='zh';
  const sign=model===z4?'+':'×';
  const caption=modelNames[model.id]+' · '+sign+' (mod '+modulus[model.id]+')';
  return <div className="min-w-0 overflow-x-auto" role="region" aria-label={caption} tabIndex={0}>
    <table className="w-full border-collapse text-center text-sm">
      <caption className="py-2 text-left font-semibold">{caption}</caption>
      <thead><tr><th scope="col" className="border p-1">{sign}</th>{model.elements.map(y=><th key={y} scope="col" className="border p-1">{y}</th>)}</tr></thead>
      <tbody>{model.elements.map(x=><tr key={x}>
        <th scope="row" className="border p-1">{x}</th>
        {model.elements.map(y=>{
          const selected=pair?.[0]===x && pair[1]===y;
          const marked=selected || (diagonal && x===y);
          return <td key={y} className={'border p-1 '+(marked?'bg-blue-50 font-bold text-blue-900':'')}>
            {model.combine(x,y)}{marked && <span title={selected?(zh?'当前输入对':'Selected pair'):(zh?'与自身运算':'Self-combination')}> ◆</span>}
          </td>;
        })}
      </tr>)}</tbody>
    </table>
  </div>;
}

export function ModelProperties() {
  const zh=useLanguage().lang==='zh';
  return <section id="four-group-properties" className="space-y-3">
    <h3 className="text-lg font-semibold">{zh?'同阶的两个群：看运算表的对角线':'Two groups of the same order: read the diagonals'}</h3>
    <div className="grid gap-4 sm:grid-cols-2">{[z4,u8].map(model=>{
      const {orders,self,generators}=properties(model);
      return <article className="learning-card min-w-0" key={model.id}>
        <OperationTable model={model} diagonal/>
        <p>{zh?'群的阶':'Group order'}: {model.elements.length} · {zh?'元素':'Elements'}: {model.elements.join(', ')}</p>
        <p>{zh?'各元素的阶':'Element orders'}: {orders.join(', ')}</p>
        <p>◆ {model===z4?'(x + x) mod 4':'(x × x) mod 8'}: {self.join(', ')}</p>
        <p>{zh?'生成元':'Generators'}: {generators.length?generators.join(', '):(zh?'无':'none')}</p>
      </article>;
    })}</div>
    <p>{zh?'书中用 x² 表示 x 与自身进行群运算。左表的 x² 是相加，右表的 x² 是相乘。U(8) 的对角线全是单位元素 1；在 ℤ₄ 中，1 与自身相加得到 2，而单位元素是 0。':'The book writes x² for combining x with itself. In the left table this means addition, and in the right table multiplication. Every diagonal entry in U(8) is the identity 1. In ℤ₄, adding 1 to itself gives 2, while the identity is 0.'}</p>
  </section>;
}

export function IsomorphismComparison() {
  const zh=useLanguage().lang==='zh';
  const preset=useStoredChoice('fm2gp:book:6.7:map',presets,'f2');
  const xChoice=useStoredChoice('fm2gp:book:6.7:x',digits,'1');
  const yChoice=useStoredChoice('fm2gp:book:6.7:y',digits,'1');
  const x=Number(xChoice.value),y=Number(yChoice.value);
  const f=images(preset.value), name=symbols[preset.value];
  const {sum,fx,fy,left,right}=compare(f,x,y);
  const matches=matchCount(f);
  return <article id="isomorphism-map" className="space-y-4">
    <h3 id="map-heading" tabIndex={-1} className="text-lg font-semibold">{zh?'同构怎样保持运算':'How does an isomorphism preserve the operation?'}</h3>
    <p>{zh?'书例：从模 4 加法群 ℤ₄ 到模 5 非零余数乘法群 U(5)。先选映射和两个操作数，再按两条路径分别计算。':'Book example: map the additive group ℤ₄ to the nonzero residues U(5) under multiplication modulo 5. Pick a map and two operands, then compare the two paths.'}</p>
    <div className="flex flex-wrap items-end gap-3">
      <label>{zh?'映射预设':'Map preset'} <select className="learning-input" value={preset.value} onChange={e=>preset.choose(e.target.value)}>
        <option value="f2">f₂(k) = 2ᵏ mod 5</option><option value="f3">f₃(k) = 3ᵏ mod 5</option>
        <option value="b">{zh?'b · 伴读反例':'b · reader counterexample'}</option>
      </select></label>
      {([['x',xChoice],['y',yChoice]] as const).map(([label,choice])=><label key={label}>{label} <select className="learning-input" value={choice.value} onChange={e=>choice.choose(e.target.value)}>
        {digits.map(digit=><option key={digit}>{digit}</option>)}
      </select></label>)}
    </div>
    <table className="w-full text-center text-sm"><caption className="pb-1 text-left font-semibold">{zh?'映射表':'Mapping table'} · {name}</caption>
      <thead><tr><th scope="col">k</th>{z4.elements.map(k=><th scope="col" key={k}>{k}</th>)}</tr></thead>
      <tbody><tr><th scope="row">{name}(k)</th>{f.map((v,k)=><td className="border p-1" key={k}>{v}</td>)}</tr>
      <tr><th scope="row">{zh?'当前角色':'Current role'}</th>{z4.elements.map(k=><td key={k} className="border p-1">{[x===k?'x':'',y===k?'y':'',sum===k?'x+y (mod 4)':''].filter(Boolean).join(' · ')||'—'}</td>)}</tr></tbody>
    </table>
    <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">
      <div className="learning-intro"><strong>{zh?'先相加，再映射':'Add first, then map'}</strong>
        <p>({x} + {y}) mod 4 = {sum}</p><p>{name}({sum}) = {left}</p></div>
      <div className="learning-intro"><strong>{zh?'先映射，再相乘':'Map first, then multiply'}</strong>
        <p>{name}({x}) = {fx}, {name}({y}) = {fy}</p><p>({fx} × {fy}) mod 5 = {right}</p></div>
    </div>
    <p>{zh?'当前输入对':'Current pair'}: {left} {left===right?'=':'≠'} {right} · {left===right?(zh?'两条路径相同。':'The paths agree.'):(zh?'两条路径不同；这对输入违反保持运算的要求。':'The paths differ; this pair violates operation preservation.')}</p>
    <p>{zh?'全部有序对':'All ordered pairs'}: {matches}/16 · {matches===16?(zh?'保持运算且为双射，是同构。':'A bijection preserving the operation: an isomorphism.'):(zh?'虽然是双射且保持单位元素，但未保持全部运算。':'A bijection preserving the identity, but not every product.')}</p>
    <p>{zh?'◆ 标出当前输入对的运算结果。源生成元 1、3 必须映到目标生成元 2、3（次序可以互换）。书中两个同构都把 0 映到 1。':'◆ marks the result for the selected pair. An isomorphism takes the source generators 1 and 3 to the target generators 2 and 3 in either order. Both book maps send 0 to 1.'}</p>
    <div className="grid gap-3 sm:grid-cols-2"><OperationTable model={z4} pair={[x,y]}/><OperationTable model={u5} pair={[fx,fy]}/></div>
    <ReadingDetail id="isomorphism-counterexample" label={zh?'伴读反例：双射且保持单位元素，够了吗？':'Reader counterexample: is a bijection preserving the identity enough?'}>
      <p>{zh?'按 k = 0,1,2,3，b 的像为 1,2,3,4。取 x=y=1，b(2)=3，而 (2×2) mod 5=4。这一次不相等就足以排除同构。':'In order k = 0,1,2,3, b has images 1,2,3,4. With x=y=1, b(2)=3 while (2×2) mod 5=4. This single disagreement rules out an isomorphism.'}</p>
      <button className="learning-secondary" onClick={()=>{
        preset.choose('b');xChoice.choose('1');yChoice.choose('1');
        document.getElementById('map-heading')?.focus();
      }}>{zh?'在映射比较中查看此例':'Use this example in the comparison'}</button>
    </ReadingDetail>
  </article>;
}
