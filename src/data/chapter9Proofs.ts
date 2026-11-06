import type { LocalizedText } from './algorithmCatalog';
export const bilingual = (zh: string, en: string): LocalizedText => ({zh, en});

export const axioms = [
  bilingual('0 是自然数。','Zero is a natural number.'),
  bilingual('每个自然数 n 都有一个后继 s(n)，它也是自然数。','Every natural number n has a successor s(n), also a natural number.'),
  bilingual('若自然数的一个子集包含 0，且其中每个数的后继仍在该子集中，那么这个子集就是整个自然数集。','A subset of the natural numbers that contains zero and is closed under successors is the entire set of natural numbers.'),
  bilingual('若 s(n) = s(m)，则 n = m。','If s(n) = s(m), then n = m.'),
  bilingual('0 不是任何自然数的后继。','Zero is not the successor of any natural number.')
];
interface Step {id:string; expression:string; reason:LocalizedText}
const step = (id:string,expression:string,zh:string,en:string):Step => ({id,expression,reason:bilingual(zh,en)});
export interface Derivation {id:string; title:LocalizedText; introduction:LocalizedText; steps:Step[]; conclusion:LocalizedText}
export const derivations:Derivation[] = [
  {id:'add-two-three',title:bilingual('算一次：2 + 3','Evaluate one sum: 2 + 3'),
   introduction:bilingual('这里只算一个输入。沿第二个参数反复展开，直到它为 0，再依次读出后继的数字名称。','This is one input. Unfold the second argument until it reaches zero, then read off the successors.'),
   steps:[
    step('sum-first','2 + 3 = s(2 + 2)','3 是 2 的后继；以 a = 2、b = 2 使用 (9.2)。','3 is the successor of 2; apply (9.2) with a = 2 and b = 2.'),
    step('sum-second','= s(s(2 + 1))','在外层 s 内，2 = s(1)，再次使用 (9.2)。','Inside s, write 2 as s(1) and apply (9.2) again.'),
    step('sum-third','= s(s(s(2 + 0)))','把 1 写作 s(0)，对最内层的和使用 (9.2)。','Write 1 as s(0) and apply (9.2) to the innermost sum.'),
    step('sum-base','= s(s(s(2)))','基础规则 (9.1) 给出 2 + 0 = 2。','The base rule (9.1) gives 2 + 0 = 2.'),
    step('sum-three','= s(s(3))','按数字名称，s(2) 是 3。','By the names of the numerals, s(2) is 3.'),
    step('sum-four','= s(4)','s(3) 是 4。','The successor of 3 is 4.'),
    step('sum-five','= 5','s(4) 是 5。','The successor of 4 is 5.')
   ], conclusion:bilingual('这个计算解释了为什么 2 + 3 = 5。它没有证明所有自然数都满足某条性质。','This calculation explains why 2 + 3 = 5. It does not prove a property of every natural number.')},
  {id:'left-zero',title:bilingual('证明一：0 + a = a','Proof 1: 0 + a = a'),
   introduction:bilingual('目标是公式 (9.3)，对每个 a ∈ ℕ 证明零也是左单位元素。定义 (9.1) 说的是右边加零，不能把两个参数直接对调。','The goal is (9.3): zero is also a left identity for each a ∈ ℕ. Definition (9.1) puts zero on the right; it does not let us exchange the arguments.'),
   steps:[
    step('zero-base','0 + 0 = 0','基础步骤：在 (9.1) 中取 a = 0。','Base case: set a = 0 in (9.1).'),
    step('zero-hypothesis','0 + k = k','归纳假设：任取 k ∈ ℕ，在这一步暂设命题对 k 成立，用来推导其后继情形。','Induction hypothesis: fix any k ∈ ℕ and assume the claim for this k in order to derive the successor case.'),
    step('zero-successor','0 + s(k) = s(0 + k)','在递推定义 (9.2) 中取 a = 0、b = k。','Apply (9.2) with a = 0 and b = k.'),
    step('zero-replace','= s(k)','在后继表达式中，用归纳假设将 0 + k 替换为 k。','Use the induction hypothesis to replace 0 + k by k inside the successor.')
   ], conclusion:bilingual('满足命题的自然数包含 0，且对后继封闭。由第三条公理，对每个 a ∈ ℕ 都有 0 + a = a。','The set of natural numbers satisfying the claim contains zero and is closed under successors. By the third axiom, 0 + a = a for every a ∈ ℕ.')},
  {id:'addition-associativity',title:bilingual('证明二：自然数加法的结合律','Proof 2: associativity of natural-number addition'),
   introduction:bilingual('任取并固定 a、b ∈ ℕ，仅对第三个参数 c 归纳。目标是 (a + b) + c = a + (b + c)。','Fix arbitrary a, b ∈ ℕ. Induct only on the third argument c to prove (a + b) + c = a + (b + c).'),
   steps:[
    step('assoc-base','(a + b) + 0 = a + b','基础步骤 c = 0：把 a + b 当作一个数，应用 (9.1)。','Base case c = 0: apply (9.1) with a + b as the first argument.'),
    step('assoc-base-reverse','= a + (b + 0)','反向使用 (9.1)：在右参数处把 b 写作 b + 0。','Reverse (9.1) in the right argument: write b as b + 0.'),
    step('assoc-hypothesis','(a + b) + k = a + (b + k)','任取 k ∈ ℕ，暂设命题对 c = k 成立；a 和 b 始终不变。','For arbitrary k ∈ ℕ, assume the claim for c = k; a and b stay fixed.'),
    step('assoc-successor','(a + b) + s(k) = s((a + b) + k)','对整个左式使用 (9.2)，第一参数为 a + b，第二参数为 s(k)。','Apply (9.2) to the whole sum, with first argument a + b and second argument s(k).'),
    step('assoc-substitute','= s(a + (b + k))','在 s 内用归纳假设替换 (a + b) + k。','Use the induction hypothesis inside s to replace (a + b) + k.'),
    step('assoc-outer','= a + s(b + k)','反向使用 (9.2)：取第一参数 a 和递推变量 b + k，把 s(a + (b + k)) 整体改写为 a + s(b + k)。','Reverse (9.2) with first argument a and second argument b + k in the inner sum: rewrite the whole s(a + (b + k)) as a + s(b + k).'),
    step('assoc-inner','= a + (b + s(k))','在 a + … 的右参数内反向使用 (9.2)：把 s(b + k) 换成 b + s(k)，外面的 a + … 不变。','Reverse (9.2) inside the right argument of a + …: replace s(b + k) by b + s(k), leaving the outer addition unchanged.')
   ], conclusion:bilingual('基础和后继步骤给出了关于 c 的归纳证明。因为 a、b 原本就是任意的，所以结论适用于所有自然数三元组。','The base and successor cases prove the claim for every c by induction. Since a and b were arbitrary, it holds for every triple of natural numbers.')}
];
