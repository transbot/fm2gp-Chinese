import type { LocalizedText } from './algorithmCatalog';
import { bilingual as t } from './chapter9Proofs';

interface Notation {id:string;symbol:string;reading:LocalizedText;use:LocalizedText}
const term=(id:string,symbol:string,zh:string,en:string,meaning:string,english:string):Notation=>
  ({id,symbol,reading:t(zh,en),use:t(meaning,english)});
export const notation = [
  term('not','¬p','非 p','not p','用于命题：将 p 的真值取反。','For a proposition: reverse its truth value.'),
  term('or','p ∨ q','p 或 q','p or q','用于命题：至少一个为真即可，包括两者都真的情形。','For propositions: at least one must be true; both may be true.'),
  term('and','p ∧ q','p 与 q','p and q','用于命题：两者都为真时才为真。','For propositions: both must be true.'),
  term('implies','p ⇒ q','若 p 则 q','if p, then q','用于条件命题：仅当前件真、后件假时为假。','A conditional is false only when its premise is true and its conclusion false.'),
  term('iff','p ⇔ q','p 当且仅当 q','p if and only if q','用于等价条件：两个方向的蕴含都成立。','For equivalent conditions: both implications hold.'),
  term('member','x ∈ S','x 属于 S','x belongs to S','x 是集合 S 中的元素。','Use for an element x of the set S.'),
  term('nonmember','x ∉ S','x 不属于 S','x does not belong to S','x 不是集合 S 的元素。','Use when x is not an element of S.'),
  term('forall','∀x ∈ S','对 S 中每个 x','for every x in S','全称量词：后面的性质必须对 S 中每一个 x 成立。','The universal quantifier requires the following property for every x in S.'),
  term('exists','∃x ∈ S','存在 S 中的一个 x','there exists an x in S','存在量词：S 中至少一个 x 满足后面的性质；不要求唯一。','The existential quantifier requires at least one x in S with the property, not necessarily a unique one.'),
  term('union','S ∪ T','S 与 T 的并集','the union of S and T','合并集合：属于 S 或 T 的元素都在其中。','For sets: include elements of S or T or both.'),
  term('intersection','S ∩ T','S 与 T 的交集','the intersection of S and T','寻找共同元素：须同时属于 S 与 T。','For common elements: membership in both sets is required.'),
  term('builder','{x | P(x)}','满足 P 的所有 x 的集合','the set of all x such that P(x)','构造集合时，先明确 x 的范围，再用条件 P 选出元素。','To describe a set, specify the domain of x and select the elements satisfying P.'),
  term('naturals','ℕ','自然数集','the natural numbers','本书取 ℕ = {0, 1, 2, 3, …}，从 0 开始取后继。','In this book ℕ = {0, 1, 2, 3, …}; start at zero and take successors.'),
  term('integers','ℤ','整数集','the integers','含自然数及正整数的相反数，用于讨论奇偶性。','Includes the natural numbers and the negatives of the positive integers; use it to discuss parity.'),
  term('residues','ℤₙ','模 n 的剩余类','the residue classes modulo n','n 为正整数；取代表元 0, 1, …, n − 1。','For positive n, use representatives 0, 1, …, n − 1.'),
  term('rationals','ℚ','有理数集','the rational numbers','可写为 p/q，其中 p、q 都是整数且 q ≠ 0。','Numbers expressible as p/q with integers p and q and q ≠ 0.'),
  term('reals','ℝ','实数集','the real numbers','数轴上的数，包括有理数和无理数，例如 √2。','The numbers on the real line, including rational and irrational numbers such as √2.'),
  term('complex','ℂ','复数集','the complex numbers','形如 a + bi 的数，其中 a、b 为实数，i² = −1。','Numbers a + bi, where a and b are real and i² = −1.')
];
export const readings = [
 {id:'parity', formula:'even(x) ⇔ ¬odd(x)', text:t('在整数范围内：x 是偶数，当且仅当 x 不是奇数。','For an integer x: x is even if and only if x is not odd.')},
 {id:'even-set', formula:'S = {x | x ∈ ℤ ∧ even(x)}',text:t('S 是所有偶整数的集合。竖线右侧的两个条件一起筛选 x。','S is the set of even integers. The two conditions after the bar select x together.')},
 {id:'quantifier-scope',formula:'∀x ∈ ℕ, ∃y ∈ ℕ: y = x + 1',text:t('给书中省略的取值集合补上自然数：对每个自然数 x，都存在自然数 y，使 y = x + 1。先给定 x，才能选 y；x = 2 时取 3，x = 5 时取 6。不是同一个 y 适用于所有 x。','Make the domain explicit in the book’s example: for each natural number x there is a natural number y with y = x + 1. Choose y after x: use 3 for x = 2 and 6 for x = 5. A single y need not work for all x.')},
 {id:'sets-implication',formula:'x ∈ (S ∩ T) ⇒ x ∈ (S ∪ T)',text:t('S、T 为集合。如果 x 同时属于两个集合，它也属于它们的并集。','Let S and T be sets. If x belongs to both, then it belongs to their union.')}
];
const implies=(p:boolean,q:boolean)=>!p || q;
export const truthRows = [true,false].flatMap(p=>[true,false].map(q=>[p,q,implies(p,q),implies(!q,!p)]));

export const methods = {
 'B.1':{id:'parity-contradiction',title:t('用反证法判断奇偶性','Prove parity by contradiction'),
  claim:t('若整数 n 的平方为奇数，则 n 为奇数。','If the square of an integer n is odd, then n is odd.'),
  premise:t('始终保留前提“n² 为奇数”。暂设结论为假，即 n 为偶数。','Keep the premise that n² is odd. Suppose the conclusion is false, so n is even.'),
  steps:[t('存在 m ∈ ℤ 使 n = 2m。','There is an integer m with n = 2m.'),
  t('n² = (2m)² = 2(2m²)。因为 2m² 是整数，n² 为偶数。','Then n² = (2m)² = 2(2m²). Since 2m² is an integer, n² is even.')],
  conclusion:t('矛盾发生在 n²：前提说它奇，推导却说它偶。因此偶数假设不成立，n 必为奇数。','The contradiction concerns n²: the premise says odd, but the deduction says even. Thus n cannot be even and must be odd.')},
 'B.2':{id:'induction-sum',title:t('用归纳法求前 n 个正整数的和','Sum the first n positive integers by induction'),
  claim:t('1 + 2 + ⋯ + n = n(n + 1)/2。','1 + 2 + ⋯ + n = n(n + 1)/2.'),
  premise:t('n 是正整数（n ≥ 1）；这里的起点是 1，不是 0。','Here n is a positive integer (n ≥ 1), so start at one, not zero.'),
  steps:[t('基础步骤 n = 1：1 = 1(1 + 1)/2。','Base case n = 1: 1 = 1(1 + 1)/2.'),
  t('任取 k ≥ 1，假设前 k 项的和等于 k(k + 1)/2。','For arbitrary k ≥ 1, assume the first k terms sum to k(k + 1)/2.'),
  t('加入下一项：k(k + 1)/2 + (k + 1) = (k + 1)(k + 2)/2。这正是 n = k + 1 时的公式。','Add the next term: k(k + 1)/2 + (k + 1) = (k + 1)(k + 2)/2, the formula at n = k + 1.')],
  conclusion:t('由归纳法，公式对所有 n ≥ 1 成立。核对 n = 5：1 + 2 + 3 + 4 + 5 = 15 = 5 × 6/2。这个核对不是归纳证明的一步。','Induction proves the formula for all n ≥ 1. Check n = 5: 1 + 2 + 3 + 4 + 5 = 15 = 5 × 6/2. This check is not an induction step.')},
 'B.3':{id:'subset-sums',title:t('把子集放进按和编号的鸽巢','Place subsets into holes labelled by their sums'),
  claim:t('至少有两个不同子集具有相同的和。','At least two different subsets have the same sum.'),
  premise:t('任取 10 个互异且小于 100 的正整数，考虑其全部子集，包含空集。','Take any ten distinct positive integers less than 100. Consider all their subsets, including the empty set.'),
  steps:[t('每个数有“选”与“不选”两种可能，共 2¹⁰ = 1024 个子集。','Each number is either included or excluded, giving 2¹⁰ = 1024 subsets.'),
  t('空集的和为 0。最大的十个可选数之和为 90 + 91 + ⋯ + 99 = 945，所以任意子集和都在 0 至 945 之间。','The empty sum is 0. The ten largest allowed numbers sum to 90 + 91 + ⋯ + 99 = 945, so every subset sum lies between 0 and 945.'),
  t('两端都计入，最多有 946 种和；对给定集合不一定全部出现。','Counting both endpoints gives at most 946 sums; a given set need not attain all of them.')],
  conclusion:t('把每个子集放进以其和为编号的鸽巢。1024 > 946，至少一巢容纳两个不同子集，故其和相等。','Assign each subset to the hole labelled by its sum. Since 1024 > 946, some hole contains two different subsets; their sums are equal.')}
};
