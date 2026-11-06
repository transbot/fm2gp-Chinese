import { useLanguage } from '../../context/LanguageContext';
import { ReadingDetail, ReadingLink } from './ReadingTools';
import { SourceDemoLink } from './SourceDemoLink';
import { repoFile } from '../../data/bookCatalog';

export function Chapter11({section}:{section:string}) {
  const zh=useLanguage().lang==='zh';
  if (section==='11.1') return <div className="space-y-4">
    <p>{zh?'排列把每个位置送到唯一的目的地。读书例时位置从 1 开始；进入演示后，下标从 0 开始。':'A permutation sends each position to a unique destination. The book numbers positions from 1; the demonstration indexes them from 0.'}</p>
    <ReadingDetail id="permutation-destinations" label={zh?'书例：目的地表 [2,4,1,3]':'Book example: destination table [2,4,1,3]'}>
      <p>{zh?'a 去位置 2，b 去 4，c 去 1，d 去 3。逐格填写目的地，得到 [c,a,d,b]。定义 11.1 把这种一一对应称为排列。':'Send a to position 2, b to 4, c to 1 and d to 3. Filling those destinations gives [c,a,d,b]. Definition 11.1 calls this bijection a permutation.'}</p>
      <SourceDemoLink path="/cycle" anchor="permutation-destinations"/>
    </ReadingDetail>
    <ReadingDetail id="permutation-transposition" label={zh?'一次对换 (2 3)':'One transposition (2 3)'}>
      <p>{zh?'定义 11.3：对换只交换两个位置。(2 3) 使 [a,b,c,d] 变为 [a,c,b,d]；再执行一次就回到原序列。':'Definition 11.3: a transposition exchanges just two positions. Applying (2 3) to [a,b,c,d] gives [a,c,b,d]. Applying it again restores the sequence.'}</p>
    </ReadingDetail>
    <ReadingDetail id="permutation-composition" label={zh?'伴读补充：复合次序与习题 11.3':'Companion example: composition order and Exercise 11.3'}>
      <p>{zh?'按位置 1、2、3 编号。p 交换位置 1、2，q 交换位置 2、3。p∘q 从右向左读：先做 q，再做 p。':'Number the positions 1, 2, 3. Let p exchange positions 1 and 2, and q exchange 2 and 3. Read p∘q from right to left: apply q first, then p.'}</p>
      <p>p∘q · [a,b,c] → [a,c,b] → [c,a,b]</p>
      <p>q∘p · [a,b,c] → [b,a,c] → [b,c,a]</p>
      <p>p² · [a,b,c] → [b,a,c] → [a,b,c]</p>
      <p>q² · [a,b,c] → [a,c,b] → [a,b,c]</p>
      <p>{zh?'第二次对换作用在第一次留下的位置上，因此交换次序会改变结果。同一对换做两次则还原。':'The second transposition acts on the positions left by the first, so changing the order changes the result. Repeating the same transposition restores the input.'}</p>
      <ReadingLink to="/book/11#exercise-11-3">{zh?'对照习题 11.3':'Read Exercise 11.3'}</ReadingLink>
    </ReadingDetail>
    <ReadingDetail id="permutation-six-cycles" label={zh?'六元素书例：把目的地表写成循环':'Book example: two cycles on six positions'}>
      <p>{zh?'[2,3,5,6,1,4] 给出两个循环 (1 2 3 5)(4 6)。从 1 出发，依次到 2、3、5，再回到 1。余下的 4 与 6 互换。':'[2,3,5,6,1,4] gives (1 2 3 5)(4 6). From 1, visit 2, 3, 5 and return to 1. The remaining positions 4 and 6 exchange places.'}</p>
      <p>{zh?'定义 11.4：平凡循环是只包含一个元素的循环，对应下标映射的不动点。相同的数值可以位于不同的下标。':'Definition 11.4: a trivial cycle contains just one element, a fixed point of the index mapping. Equal values can occupy different indices.'}</p>
      <ReadingLink to="/book/11#cycle-source-map">{zh?'到 11.4 追踪这些位置的来源':'Follow the sources of these positions in 11.4'}</ReadingLink>
      <SourceDemoLink path="/cycle" anchor="permutation-six-cycles"/>
    </ReadingDetail>
    <ReadingLink to="/book/11#section-11-4">{zh?'第 11.4 节：使用循环':'Section 11.4: using cycles'}</ReadingLink>
  </div>;
  return <div className="space-y-4">
    <p>{zh?'沿 to 读出一个循环后，换个方向问：为了填好当前位置，应该去哪里取值？':'After tracing a cycle along to, reverse the question: where do we read the value needed at this position?'}</p>
    <ReadingDetail id="cycle-from-guide" label={zh?'用一个临时值完成循环搬移':'Move a cycle using one temporary value'}>
      <ReadingDetail id="cycle-source-map" label={zh?'来源表：为什么先做 0 ← 4？':'The source table: why start with 0 ← 4?'}>
        <p>{zh?'把 11.1 的六元素书例改用零基下标。to=[1,2,4,5,0,3] 的逆表是 from=[4,0,1,5,2,3]。位置 4 的目的地是 0，所以先保存位置 0，再把位置 4 的值复制到 0。下一处待填的是 4。':'In zero-based indices the six-element example from 11.1 has to=[1,2,4,5,0,3] and inverse from=[4,0,1,5,2,3]. Position 4 goes to 0. Save the value at 0 and copy from 4 into 0. Position 4 is next to fill.'}</p>
        <p>{zh?'伴读调度从最小的未处理位置开始，跳过平凡循环，两次调用分别从 0、3 出发。函数沿 from 取值，回到起点时写回临时值。':'The companion driver starts at the least unprocessed index and skips trivial cycles. It calls the helper at 0 and 3. The helper reads along from and writes the temporary value when the source comes back to the start.'}</p>
        <SourceDemoLink path="/cycle" anchor="cycle-source-map"/>
      </ReadingDetail>
      <ReadingDetail id="cycle-transfer-count" label={zh?'定理 11.1：数数据传送':'Theorem 11.1: count the data transfers'}>
        <p>{zh?'长度 s>1 的循环有 1 次临时复制、s−1 次从来源格写入、1 次从临时值写回，共 s+1 次传送。若 u 个位置不动，v 个循环非平凡，共写入 n−u 个位置，另做 v 次临时复制，总数 n−u+v。本例是 6−0+2=8。':'A cycle of length s>1 takes one temporary copy, s−1 writes from source cells and one write back from the temporary: s+1 transfers. With u fixed positions and v nontrivial cycles there are n−u array writes and v temporary copies, or n−u+v transfers. Here 6−0+2=8.'}</p>
        <SourceDemoLink path="/cycle" anchor="cycle-transfer-count"/>
      </ReadingDetail>
    </ReadingDetail>
    <ReadingDetail id="cycle-rotation-example" label={zh?'11.4 旋转书例：右旋两位':'Section 11.4 book example: rotate right by two'}>
      <p>{zh?'六个位置，f=0、m=4、l=6。rotate_transform 以 m1=2 为界，前两格加 4，其余格减 2，得到 from=[4,5,0,1,2,3]。目的地循环为 (0 2 4)(1 3 5)。正文从 2 示范一次搬移（2←0←4，再把临时值写到 4）。':'For six positions, f=0, m=4, l=6. With m1=2, rotate_transform adds 4 for the first two positions and subtracts 2 for the rest, giving from=[4,5,0,1,2,3]. The destination cycles are (0 2 4)(1 3 5). The text traces one call from 2 (2←0←4, then write the temporary into 4).'}</p>
      <p>{zh?'完整 rotate 算出 gcd(4,2)=2，循环条件 cycles-- 让两次调用从 1、0 出发，最后返回 m1=2。此调度专用于旋转。':'The full rotate computes gcd(4,2)=2. Its cycles-- condition starts the two calls at 1 and 0, and rotate returns m1=2. This driver is specific to rotation.'}</p>
      {[['rotate_cycle_from',142],['rotate_transform',153],['rotate',178]].map(([name,line])=><p key={name}><a className="learning-link" href={repoFile('配套代码(fm2gpcode)/ch11.h',Number(line))}>ch11.h · {name}</a></p>)}
    </ReadingDetail>
  </div>;
}
