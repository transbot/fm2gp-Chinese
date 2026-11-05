import type { LocalizedText } from './algorithmCatalog';
export interface RecapQuestion { id:string; question:LocalizedText; explanation:LocalizedText[]; sections:string[]; demos:string[] }
export interface RecapTopic { id:string; title:LocalizedText; summary:LocalizedText; demos:string[]; questions:RecapQuestion[] }
// Teaching review of Chapter 14, not additional numbered sections of the book.
export const recapTopics:RecapTopic[]=[
 {
  id:'review-power',title:{zh:'从乘法到通用幂算法',en:'From multiplication to generic power'},
  summary:{zh:'从具体而高效的乘法实现出发，分清算法依赖的步骤与对象。把“相加”抽象为满足相应要求的运算，就能保留折半与累积的算法结构，转而处理矩阵等新对象。泛化的目标是扩大适用范围，同时保持效率。',en:'Start with a concrete, efficient multiplication algorithm and separate its steps from the objects it handles. Replace addition with an operation meeting the required laws, retaining halving and accumulation while working with new objects such as matrices. Generalization broadens applicability while preserving efficiency.'},
  demos:['/multiply','/concepts/algebra','/power','/concepts/matrices','/shortest-path'],
  questions:[
   {id:'power-conditions',question:{zh:'正整数指数与零指数分别需要哪些代数条件？',en:'What algebraic conditions are needed for positive integer exponents and for exponent zero?'},
    explanation:[
     {zh:'对正整数指数，封闭且满足结合律的二元运算就足够，也就是半群：合并同类对象仍得到同类对象，改变括号位置不改变结果。因此可以把重复合并改写成平方与累积，不必要求交换律，也不必先有单位元素。',en:'For positive integer exponents, a closed associative binary operation is sufficient: a semigroup. Closure keeps combined objects in the same set; associativity allows regrouping without changing the result. Repeated combination can therefore become squaring and accumulation without requiring an identity element or commutativity.'},
     {zh:'要把算法扩展到零指数，还需要该运算的单位元素e，满足e·a=a·e=a，并定义a⁰=e；这就是幺半群。类型满足一个概念，不只是函数名或运算符能编译，还要满足运算的语义规律及接口所要求的值操作。不要给正指数算法强加它不使用的单位元素条件。',en:'To include exponent zero, also require an identity e with e·a=a·e=a and define a⁰=e: a monoid. A type models a concept only when it meets the semantic laws and required value operations, not merely when its function names or operators compile. Do not impose an unused identity requirement on the positive-exponent algorithm.'},
    ],sections:['2.1','2.2','6.1','6.2','7.5','7.6'],demos:['/concepts/algebra','/power']},
   {id:'power-matrices',question:{zh:'矩阵乘法通常不满足交换律，幂算法为什么仍然适用？',en:'Matrix multiplication is usually not commutative. Why does the power algorithm still apply?'},
    explanation:[
     {zh:'同阶方阵相乘仍是同阶方阵，并且乘法满足结合律。幂算法改变的是括号分组，保留因子的顺序，因此不需要交换律。正指数使用这套半群运算即可；零指数返回同阶单位矩阵。矩阵这个类型连同所选运算，才是需要核对的对象。',en:'Multiplication of square matrices of the same size is closed and associative. The power algorithm changes grouping while preserving factor order, so it does not require commutativity. Positive exponents use this semigroup operation; exponent zero returns the identity matrix of that size. Check the matrix type together with its chosen operation.'},
     {zh:'更换对象和运算时，要重新检查这些要求。矩阵与可达性演示把标量加乘换成“或、与”；最短路径演示用“取最小值、相加”构成矩阵运算，在热带半环上复用同一个幂算法。接口和规律相同，不代表每次矩阵运算与一次整数运算的实际成本相同。',en:'Recheck the requirements when changing objects and operations. The reachability lab replaces scalar addition and multiplication with OR and AND; the shortest-path lab uses minimum and addition over the tropical semiring. Both reuse the power algorithm. A shared interface and laws do not mean one matrix operation costs the same as one integer operation.'},
    ],sections:['7.5','7.6','8.5','8.6'],demos:['/power','/concepts/matrices','/shortest-path']},
  ],
 },
 {
  id:'review-gcd',title:{zh:'从整数求余到多项式GCD',en:'From integer remainders to polynomial GCD'},
  summary:{zh:'GCD循环依赖求余的性质，而不依赖整数的存储形式。整数与有理数系数多项式采用各自的求余实现，仍可共享循环。接口应把已求出的有用结果交给调用者，避免下一步重新计算。',en:'The GCD loop depends on the properties of remainders, not on integer storage. Integers and rational-coefficient polynomials supply their own remainder operations while sharing the loop. An interface should give callers useful computed results so the next operation need not recompute them.'},
  demos:['/division','/gcm','/polynomial-gcd','/horner'],
  questions:[
   {id:'gcd-loop',question:{zh:'为什么把整数换成多项式后，仍能使用同一个GCD循环？',en:'Why can the same GCD loop still be used when integers are replaced by polynomials?'},
    explanation:[
     {zh:'带余除法满足A = BQ + R。A、B的公因式整除R；B、R的公因式也整除A。因此用(B,R)替换(A,B)保留公因式，循环只需检测零、调用remainder并交换两个值。不同类型提供不同的求余实现，而不是要求它们内部用相同的除法步骤。',en:'Division gives A = BQ + R. A common divisor of A and B divides R, and a common divisor of B and R divides A. Replacing (A,B) by (B,R) preserves common divisors. The loop only tests for zero, calls remainder, and swaps the values. Types supply different remainder implementations; their internal division steps need not be identical.'},
     {zh:'在非负整数情形，每次非零除数B得到0≤R<B；在ℚ[x]中，R为零或deg(R)<deg(B)。非零除数的大小或次数严格下降，不能无限继续，所以在b=0时返回a。零多项式没有通常意义的次数，应先判零再比较次数。多项式GCD还要在循环返回后独立首一化；本演示约定gcd(0,0)=0。',en:'For nonnegative integers, each nonzero divisor B gives 0≤R<B. In ℚ[x], R is zero or deg(R)<deg(B). The size or degree of the nonzero divisor strictly decreases and cannot decrease indefinitely, so the loop ends at b=0 and returns a. The zero polynomial has no ordinary degree; test for zero before comparing degrees. Polynomial GCD is made monic separately after the loop returns; the lab defines gcd(0,0)=0.'},
    ],sections:['4.5','4.6','8.1','8.7','8.8'],demos:['/division','/gcm','/polynomial-gcd']},
   {id:'gcd-useful-return',question:{zh:'一次计算同时返回商和余数，怎样体现书中的“有用的返回值法则”？',en:'How does returning quotient and remainder together illustrate the book’s law of useful return?'},
    explanation:[
     {zh:'只返回一个结果可能让调用者再次遍历同一过程。“同时求商与余数”演示复用倍增、减半和扣减过程，并更新商n，最后一起返回(q,r)。45÷6得到(7,3)，满足45=7×6+3和0≤3<6。记录商需要额外更新，但无需为了另一个结果独立重复整套求余过程。',en:'Returning only one result may force the caller to repeat the process. The shared quotient/remainder demonstration reuses doubling, halving, and subtraction while updating quotient n, then returns (q,r) together. For 45÷6 it returns (7,3), with 45=7×6+3 and 0≤3<6. Recording the quotient requires extra updates, but avoids independently repeating the whole remainder computation for the other result.'},
     {zh:'有用的返回值法则要求把计算中已获得、对后续应用有价值的信息保留下来。展开整数除法页的“同时求商与余数”，对照n、c、a的完整更新检查点；A=n×c+a在成对更新完成后成立。多项式页的Q、R则展示A=BQ+R；霍纳页帮助理解系数序列和代入求值。',en:'The law of useful return preserves information obtained during computation that is valuable to later applications. Expand “Quotient and remainder together” in the integer division lab and inspect the completed n,c,a checkpoints: A=n×c+a holds after each paired update is complete. The polynomial lab displays Q and R in A=BQ+R; Horner connects coefficient sequences with evaluation.'},
    ],sections:['4.6','8.1','11.2'],demos:['/division','/polynomial-gcd','/horner']},
  ],
 },
 {
  id:'review-iterators',title:{zh:'迭代器能力与内存权衡',en:'Iterator capabilities and memory trade-offs'},
  summary:{zh:'接口说明允许怎样移动位置、读取和交换元素；递归组织子区间，共享缓冲区提供另一种搬运方式。算法选择应同时考虑可用操作、调用栈和元素传送，内存增多并不保证每一种输入都做更少的工作。',en:'The interface specifies permitted movement, access, and swapping. Recursion organizes subranges; a shared buffer offers another way to move elements. Algorithm choice must consider available operations, the call stack, and element transfers together. More memory does not guarantee less work for every input.'},
  demos:['/concepts/iterators','/reverse'],
  questions:[
   {id:'iterators-forward',question:{zh:'只有前向迭代器时，递归反转怎样完成两个半区的交换？',en:'With only forward iterators, how does recursive reversal exchange the two halves?'},
    explanation:[
     {zh:'先递归反转左半区，利用返回位置找到中点；奇数长度跳过中间元素，再反转右半区。最后swap_ranges_n让两个迭代器从两半的起点同时向前，逐对交换。它不要求把迭代器向后移动，但要求可写、可交换元素；前向迭代器还允许保存并再次使用位置副本。',en:'Reverse the left half recursively and use its returned position to locate the middle. For odd lengths, skip the middle element, then reverse the right half. Finally, swap_ranges_n advances two iterators from the half starts, swapping pairs. No backward movement is required, but elements must be writable and swappable; forward iterators also allow position copies to be saved and reused.'},
     {zh:'九元素例中h=4，左半返回m=4，跳过中间位置4后m=5，右半返回l=9（end）。根调用交换前为[3,2,1,0,4,8,7,6,5]；再交换(0,5)、(1,6)、(2,7)、(3,8)，完成反转。递归层数为4，辅助调用栈按O(log n)增长；双向版本能从两端靠近，用O(1)辅助空间完成。',en:'For nine elements, h=4; the left call returns m=4, skipping position 4 makes m=5, and the right call returns l=9 (end). Before the root swaps, the sequence is [3,2,1,0,4,8,7,6,5]. Swapping (0,5), (1,6), (2,7), (3,8) completes reversal. There are 4 reversal-call levels and O(log n) auxiliary stack space. Bidirectional reversal can approach from both ends with O(1) auxiliary space.'},
    ],sections:['10.4','10.5','10.6','11.5'],demos:['/concepts/iterators','/reverse']},
   {id:'iterators-buffer',question:{zh:'默认九元素示例中，缓冲容量从1增加到2，为什么传送次数会从36增加到40？',en:'For the default nine elements, why do transfers rise from 36 to 40 when buffer capacity increases from 1 to 2?'},
    explanation:[
     {zh:'一次交换按书中swap算3次传送：一次复制构造、两次赋值；复制到缓冲区或写回原序列各算1次。容量1时，n=0和n=1先走基础情况，缓冲区不被使用；12次交换共36次传送，最大反转调用层数4。',en:'The book’s swap costs 3 transfers: one copy construction and two assignments. Each copy into the buffer or write back costs 1 transfer. With capacity 1, n=0 and n=1 take the base cases first, so the buffer is unused: 12 swaps give 36 transfers, with 4 reversal-call levels.'},
     {zh:'容量2时，四个长度2的子区间改用同一块共享缓冲区：复制8次、写回8次；其余仍需8次交换。因此3×8+8+8=40次传送，虽然最大层数降为3、缓冲峰值为2。它减少递归和交换，却增加复制。比较的是算法实际的栈、缓冲和搬运成本，不把演示器的回放快照计入算法辅助空间。',en:'With capacity 2, four length-2 subranges use the same shared buffer: 8 copies in and 8 writes back, plus 8 remaining swaps. Thus 3×8+8+8=40 transfers, although maximum depth falls to 3 and peak buffer use is 2. Recursion and swaps decrease, but copying increases. Compare the algorithm’s stack, buffer, and transfer costs; replay snapshots are simulator storage, not algorithm auxiliary space.'},
    ],sections:['11.5','11.6','11.7'],demos:['/reverse']},
  ],
 },
];
