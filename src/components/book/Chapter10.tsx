import {useState} from 'react';
import {useLanguage} from '../../context/LanguageContext';
import {AccumulationCounterexample} from './AccumulationCounterexample';
import {ReadingDetail, ReadingLink} from './ReadingTools';
import {SourceDemoLink} from './SourceDemoLink';

const byte = '01000001';
function InterpretByte() {
  const {lang} = useLanguage();
  const zh = lang === 'zh';
  const [interpretation, choose] = useState<'number' | 'ascii'>();
  const number = parseInt(byte, 2);
  return <article id="interpret-byte" className="space-y-4">
    <p>{zh ? '先看最高位在左的八个比特。选一种读法，再换一种，观察哪一样东西改变了。' : 'Read these eight bits with the most significant bit on the left. Choose an interpretation, then switch. What changed?'}</p>
    <div className="learning-intro"><code className="font-mono text-2xl tracking-widest">{byte}</code></div>
    <fieldset className="flex flex-wrap gap-4">
      <legend className="font-semibold">{zh ? '如何解释这些位？' : 'How should we interpret these bits?'}</legend>
      {(['number','ascii'] as const).map(key=><label key={key} className="inline-flex items-center gap-2">
        <input type="radio" name="byte-reading" checked={interpretation===key} onChange={()=>choose(key)}/>
        {key==='ascii' ? (zh?'ASCII 字符':'ASCII character') : (zh?'8 位无符号整数':'8-bit unsigned integer')}
      </label>)}
    </fieldset>
    <p role="status">
      {!interpretation && (zh?'请选择一种解释。':'Choose an interpretation.')}
      {interpretation==='number' && (zh?'按无符号二进制位权计算，64 + 1 = ':'Unsigned binary place values give 64 + 1 = ')+number}
      {interpretation==='ascii' && (zh
        ? `按 ASCII 解码，最高位补零。低七位的码值为 ${number}，对应大写字母 ${String.fromCharCode(number)}。`
        : `The high bit is zero padding. The low seven bits give ASCII code ${number}, which represents uppercase ${String.fromCharCode(number)}.`)}
    </p>
    <ReadingDetail id="datum-to-object" label={zh?'从同一串位辨认五个概念':'Five concepts in this one example'}>
      <dl className="space-y-2">
        {[
          ['数据','Datum','这串位本身。','The bit string itself.'],
          ['值','Value','带解释的数据，例如按无符号整数读出的 65。','The bits with an interpretation, such as the unsigned integer 65.'],
          ['值类型','Value type','共享一种解释的一组值。例如八位无符号整数的值为 0 到 255。','A set of values sharing an interpretation, such as the unsigned eight-bit integers from 0 to 255.'],
          ['对象','Object','假设地址 p 标识一处存储。这处存储中承载给定值类型之值的位构成对象。','Suppose address p identifies a storage location. The bits in memory holding a value of the given value type form an object.'],
          ['对象类型','Object type','规定怎样按统一方式，在给定地址的对象中存入并取回这种值。','A uniform way to store and retrieve such values in objects at given addresses.']
        ].map(([z,e,d,f],i)=><div key={e}><dt className="font-semibold">{zh?z:e} · 10.{i+1}</dt><dd>{zh?d:f}</dd></div>)}
      </dl>
    </ReadingDetail>
  </article>;
}

export function Chapter10({section}: {section:string}) {
  const zh = useLanguage().lang === 'zh';
  if (section==='10.2') return <InterpretByte/>;
  return <article className="space-y-4">
    <h3 className="font-semibold text-lg">{zh?'判断一个类型是否满足概念':'Does a type satisfy a concept?'}</h3>
    <ol className="list-decimal pl-6 space-y-3">
      <li><strong>{zh?'操作。':'Operations. '}</strong>{zh?'可以用哪些实参调用？结果是什么类型？例如两个整数相减仍得到整数。':'What arguments can we use, and what type is the result? Subtracting two integers gives an integer.'}</li>
      <li><strong>{zh?'语义。':'Semantics. '}</strong>{zh?'运算还须遵守哪些规律？代数演示的减法例中，(5 − 3) − 1 = 1，而 5 − (3 − 1) = 3。能做减法并不保证可以改变括号。':'Which laws must hold? In the algebra lab, (5 − 3) − 1 = 1 but 5 − (3 − 1) = 3. Having subtraction does not justify regrouping.'}</li>
      <li><strong>{zh?'时间与空间。':'Time and space. '}</strong>{zh?'操作的代价随输入怎样增长？书中的数组栈每次入栈都挪动已有的 k 个元素，耗时随 k 线性增长。即使弹出顺序正确，这种实现仍达不到常数时间入栈的要求。':'How does cost grow with the input? The book’s array stack moves all k existing elements on every push. Time grows linearly with k. Even with the right pop order, this implementation fails a constant-time push requirement.'}</li>
    </ol>
    <ReadingLink to="/book/C#section-C-2">{zh?'附录 C.2：对照源码中的概念要求':'Appendix C.2: read the concept requirements in the source'}</ReadingLink>
    <AccumulationCounterexample id="concept-subtraction"/>
    <ReadingDetail id="advance-cost" label={zh?'到达同一位置，要做多少次移动？':'How many moves reach the same position?'}>
      <p>{zh?'在 [10,20,30] 中从位置 0 执行 advance(3)。前向模型走 0→1→2→3，做三次后继操作；随机访问模型直接跳到 3，只做一次跳转。位置 3 是 end，没有可读取的元素。在演示中切换模型会回到起点，可用同一条指令比较。':'Start at position 0 in [10,20,30] and execute advance(3). The forward model follows 0→1→2→3 with three successor operations. Random access jumps directly to 3 in one operation. Position 3 is end and has no readable element. Switching models in the lab resets the position for the same command.'}</p>
      <SourceDemoLink path="/concepts/iterators" anchor="advance-cost"/>
    </ReadingDetail>
  </article>;
}
