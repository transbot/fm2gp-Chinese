import {useLanguage} from '../../context/LanguageContext';
import {ReadingDetail} from './ReadingTools';
import {SourceDemoLink} from './SourceDemoLink';

export function AccumulationCounterexample({id}: {id: string}) {
  const {lang} = useLanguage();
  const zh = lang === 'zh';
  return <ReadingDetail id={id} label={zh ? '伴读补充：减法能编译，为什么结果却不同？' : 'Reader example: subtraction compiles. Why do the results differ?'}>
    <p>{zh ? '取 r = 5、a = 3、n = 2。整数减法可以接收两个 int 并返回 int。现在检验改变括号是否保留结果。' : 'Take r = 5, a = 3 and n = 2. Integer subtraction accepts two ints and returns an int. Does regrouping preserve the result?'}</p>
    <ul className="list-disc pl-5">
      <li>{zh ? '从初值逐次减两次：' : 'Subtract twice from the initial value: '}<code>(5 − 3) − 3 = −1</code></li>
      <li>{zh ? '源码先将 n 减半，用 op(a,a) 得到 0，再执行 op(r,a)：' : 'The code halves n, combines the two copies of a to get 0, then applies op(r,a): '}<code>5 − (3 − 3) = 5</code></li>
    </ul>
    <p>{zh ? '从 (r op a) op a 改写成 r op (a op a)，顺序没变，但移动括号需要结合律。减法不满足这个条件。去代数演示选“整数，减法”，把第三个数从 1 改为 3，即可复核。' : 'Changing (r op a) op a to r op (a op a) leaves the order intact but requires associativity. Subtraction fails this requirement. In the algebra lab select integer subtraction and change the third value from 1 to 3 to check.'}</p>
    <SourceDemoLink path="/concepts/algebra" anchor={id}/>
  </ReadingDetail>;
}
