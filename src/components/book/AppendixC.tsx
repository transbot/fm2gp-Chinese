import {useLanguage} from '../../context/LanguageContext';
import {AccumulationCounterexample} from './AccumulationCounterexample';
import {ReadingDetail, ReadingLink} from './ReadingTools';
import {SourceDemoLink} from './SourceDemoLink';

const revision = 'bdc1749f2e083393f1af013f83c000cda401d1df';
function Source({file, first, last}: {file:'ch07.h'|'ch07_6.cpp'; first:number; last:number}) {
  const path = encodeURIComponent('配套代码(fm2gpcode)')+'/'+file;
  return <a className="learning-link" href={`https://github.com/transbot/fm2gp-Chinese/blob/${revision}/${path}#L${first}-L${last}`}>{file} · L{first}–{last}</a>;
}
function Snippet({code}: {code:string}) {
  return <pre className="learning-intro max-w-full overflow-x-auto font-mono" tabIndex={0}><code>{code}</code></pre>;
}

export function AppendixC({section}: {section:string}) {
  const zh = useLanguage().lang==='zh';
  switch(section) {
    case 'C.1': return <ReadingDetail id="template-arguments" label={zh?'把一次调用读回模板声明':'Read a call back to its template declaration'}>
      <Snippet code={'template <Regular A, Integer N, SemigroupOperation Op>\nA power_accumulate_semigroup(A r, A a, N n, Op op)\n\npower_accumulate_semigroup(r, a, n, multiply)'}/>
      <p>{zh?'第 7.6 节的四参数版本把运算也作为实参传入。在配套程序的乘法调用中：':'The four-argument version in Section 7.6 takes the operation itself as an argument. In the companion program’s multiplication call:'}</p>
      <ul className="list-disc pl-5">
        <li>{zh?'从实参 r 和 a 共同推导 A，两者均为 int；函数的返回类型沿用这个 A。':'Both arguments r and a deduce A as int. The return type uses that same A.'}</li>
        <li>{zh?'从次数实参 n 推导 N，这次也是 int。':'The count argument n deduces N, also int here.'}</li>
        <li>{zh?'从实参 multiply 推导 Op，它是这个 lambda 的闭包类型；op 是函数内收到的运算对象。':'The multiply argument deduces Op as the closure type of that lambda. The parameter op holds the operation inside the function.'}</li>
      </ul>
      <Source file="ch07.h" first={179} last={192}/> · <Source file="ch07_6.cpp" first={48} last={53}/>
    </ReadingDetail>;
    case 'C.2': return <ReadingDetail id="cpp-constraints" label={zh?'同一个模板，两种写法':'Two ways to express the template requirements'}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0"><h3 className="font-semibold">{zh?'原著配套头文件':'Original companion header'}</h3>
          <Snippet code={'#define SemigroupOperation typename\n// requires (Domain<Op, A>)'}/>
          <p>{zh?'宏展开为 typename。概念名和定义域注释告诉读者需要什么，并不执行结合律检查。':'The macro expands to typename. The name and domain comment communicate requirements to the reader; they do not check associativity.'}</p>
          <Source file="ch07.h" first={28} last={34}/> · <Source file="ch07.h" first={179} last={183}/>
        </div>
        <div className="min-w-0"><h3 className="font-semibold">{zh?'中文版 C++20 配套程序':'Chinese edition’s C++20 program'}</h3>
          <Snippet code={'requires(Op op, A a, A b) {\n    { op(a, b) } -> std::same_as<A>;\n}'}/>
          <p>{zh?'编译器检查 op(a,b) 可调用，且表达式的结果类型恰为 A。程序还要求 A 满足 std::regular，N 满足 std::integral。是否允许重组仍要看运算的语义。':'The compiler checks that op(a,b) is callable and the expression has exactly type A. The program also requires std::regular for A and std::integral for N. Whether regrouping is valid depends on the operation’s semantics.'}</p>
          <Source file="ch07_6.cpp" first={15} last={32}/>
        </div>
      </div>
      <AccumulationCounterexample id="cpp-subtraction"/>
      <ReadingLink to="/book/10#section-10-3">{zh?'第 10.3 节：操作、规律与代价':'Section 10.3: operations, laws and costs'}</ReadingLink>
    </ReadingDetail>;
    case 'C.4': return <ReadingDetail id="operation-order" label={zh?'跟踪同一个 op 的两次调用':'Follow the same op at its two call sites'}>
      <p>{zh?'附录中的 converter 把汇率保存在可调用对象中。第 7.6 节也把运算对象传入函数：奇数分支用 op(r,a) 把当前项追加到累积值；继续折半时用 op(a,a) 合并两个当前项。乘法是平方，加法是加倍。':'The appendix’s converter stores an exchange rate in a callable object. Section 7.6 passes a callable into the function: the odd branch uses op(r,a) to append the current term to the accumulator; op(a,a) combines two copies for the next halving step. In multiplication this squares; in addition it doubles.'}</p>
      <Snippet code={'r = op(r, a);\n// …\na = op(a, a);'}/>
      <p>{zh?'跟踪字符串调用：取 r = "Result: "（冒号后有一个空格）、a = "b"、n = 3。第一次累积得到 "Result: b"，自合并得到 "bb"，下一次累积把 "bb" 接到右边。最终输出：':'Trace the string call with r = "Result: " (one space after the colon), a = "b", n = 3. First accumulate "Result: b", combine "b" with itself to get "bb", then append "bb" on the right. The output is:'}</p>
      <samp className="font-mono">Result: bbb</samp>
      <p>{zh?'若颠倒累积实参，前缀会被移到右边。整数乘加的这两个例子检不出这种顺序错误。':'Reversing the accumulator arguments moves the prefix to the right. The integer multiplication and addition examples cannot reveal that order error.'}</p>
      <Source file="ch07_6.cpp" first={35} last={42}/> · <Source file="ch07_6.cpp" first={68} last={73}/>
    </ReadingDetail>;
    case 'C.5': return <ReadingDetail id="accumulation-contract" label={zh?'从初值累积，还是求纯幂？':'Accumulate from an initial value, or compute a pure power?'}>
      <p>{zh?'调用者须保证 n ≥ 0。若 n = 0，四参数函数直接返回 r，不调用 op。对于正次数，结合律保证可以折半重组，结果等于从 r 连续并入 n 个 a。纯幂没有 r 这个实参，零次使用所选运算的单位元素。':'The caller must ensure n ≥ 0. When n = 0 the four-argument function returns r without calling op. For a positive count, associativity permits regrouping; the result equals combining n copies of a into r. A pure power has no argument r and uses the identity for zero repetitions.'}</p>
      <p><code>r = 2, a = 3</code></p>
      <table className="w-full text-left text-sm"><thead><tr>{(zh?['运算','n','从 r 累积','纯幂']:['Operation','n','From r','Pure power']).map(label=><th className="p-1" key={label}>{label}</th>)}</tr></thead>
        <tbody>{[['×',5,'2 × 243 = 486','243'],['+',5,'2 + 15 = 17','15'],['×',0,'2','1'],['+',0,'2','0']].map(row=><tr key={row.slice(0,2).join()}>{row.map((v,i)=><td className="border-t p-1" key={i}>{v}</td>)}</tr>)}</tbody>
      </table>
      <Source file="ch07.h" first={179} last={187}/> · <Source file="ch07_6.cpp" first={45} last={63}/>
      <p><SourceDemoLink path="/power" anchor="accumulation-contract"/></p>
      <h3 className="font-semibold">{zh?'附录 C.5 书例：检查除法前提':'Appendix C.5 example: checking a division precondition'}</h3>
      <Snippet code={'double my_ratio(double x, double y) {\n    assert(y != 0.0);\n    return x / y;\n}'}/>
      <p>{zh?'调用者保证 y 非零，对有效输入函数返回 x/y。启用断言时，条件为假会报告失败并终止程序。禁用断言后，调用者仍须满足这个前提。':'The caller supplies a nonzero y; for valid inputs the function returns x/y. With assertions enabled, a false condition reports a failure and terminates the program. Disabling assertions leaves the precondition in force.'}</p>
    </ReadingDetail>;
    default: return null;
  }
}
