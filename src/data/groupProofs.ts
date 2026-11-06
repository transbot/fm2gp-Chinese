// Each row pairs a mathematical step with the reason it is valid.
// The general proof uses e; all numerical multiplication examples specify mod 7.
export type ProofRow = readonly [formula:string, zh:string, en:string];
export const finiteOrder: ProofRow[] = [
  ['Lₐ(x) = ax,   Lₐ⁻¹(y) = a⁻¹y', '左乘 a 后左乘 a⁻¹ 就能还原输入。由结合律和逆元，ax = ay 推出 x = y。定理 6.2 的这一对应也解释了消去律。', 'Left multiplication by a has an inverse: left multiplication by a⁻¹. Associativity and inverses give cancellation: ax = ay implies x = y (Theorem 6.2).'],
  ['|G| = N;   a¹, a², …, aᴺ⁺¹', '在 N 个群元素中取 N+1 项幂。由鸽巢原理，存在 1 ≤ i < j ≤ N+1，使 aʲ = aⁱ。', 'These N+1 powers lie in a group of N elements. By the pigeonhole principle, some aʲ = aⁱ with 1 ≤ i < j ≤ N+1.'],
  ['aʲa⁻ⁱ = aⁱa⁻ⁱ = e', '在等式两边右乘 (aⁱ) 的逆元 a⁻ⁱ，右边消去得到 e。', 'Right-multiply both sides by a⁻ⁱ, the inverse of aⁱ. The right side cancels to e.'],
  ['aʲ⁻ⁱ = e,   j − i > 0', '同一元素的幂相乘，指数相加。至少有一个正指数使幂回到 e；这些指数中最小的才是元素的阶。任取一对重复所得的差未必最小。', 'Powers of the same element combine by adding exponents. At least one positive exponent returns to e. The least such exponent is the order; an arbitrary repeat need not give the least one.']
];
export const cyclicSize: ProofRow[] = [
  ['d = ord(a),   aᵈ = e', '取首次回到单位元素的正指数 d。', 'Let d be the first positive exponent returning to the identity.'],
  ['0 ≤ i < j < d', '若 aⁱ = aʲ，右乘 a⁻ⁱ 得 aʲ⁻ⁱ = e，与 d 的最小性矛盾。故 a⁰ 至 aᵈ⁻¹ 两两不同。', 'If aⁱ = aʲ, multiplying on the right by a⁻ⁱ gives aʲ⁻ⁱ = e, contradicting minimality. Thus the powers from a⁰ through aᵈ⁻¹ are distinct.'],
  ['aᵏ⁺ᵈ = aᵏaᵈ = aᵏ', '相隔 d 的幂相等；整数指数除以 d 取余，所有幂都落入这 d 个元素。于是 |〈a〉| = d。', 'Exponents differing by d give the same power. Reducing any integer exponent modulo d lands among these d elements. Hence |〈a〉| = d.'],
  ['aⁱaʲ = aⁱ⁺ʲ,   a⁰ = e', '幂集对原群运算封闭，包含单位元素，结合律从 G 继承。', 'The powers are closed under the group operation and contain its identity. They inherit associativity from G.'],
  ['aᵏaᵈ⁻ᵏ = aᵈ = e', '对 0 ≤ k < d，aᵈ⁻ᵏ 就是 aᵏ 的逆元，也在幂集中。由子群条件得到引理 6.2。', 'For 0 ≤ k < d the inverse of aᵏ is aᵈ⁻ᵏ, another power. The subgroup conditions now give Lemma 6.2.']
];
export const partition: ProofRow[] = [
  ['H → aH: h ↦ ah', '等大（引理 6.3）。像集正是 aH，逆映射为 y ↦ a⁻¹y，故每个陪集与 H 等大。', 'Equal size (Lemma 6.3). The image is aH and the inverse sends y to a⁻¹y, so each coset has the size of H.'],
  ['a = ae ∈ aH', '覆盖（引理 6.4）。H 含单位元素，故任意 a ∈ G 都在某个陪集中。', 'Coverage (Lemma 6.4). H contains the identity, so every a in G belongs to a coset.'],
  ['ahₐ = bhᵦ   ⇒   a = b(hᵦhₐ⁻¹)', '相交（引理 6.5）。假设存在共同元素，hₐ、hᵦ 均在 H 中。在等式两边右乘 hₐ⁻¹，保持因子顺序。', 'Intersection (Lemma 6.5). Suppose the cosets share an element, with hₐ and hᵦ in H. Right-multiply by hₐ⁻¹ without reordering any factors.'],
  ['ax = b((hᵦhₐ⁻¹)x) ∈ bH', '任取 x ∈ H。H 对取逆和乘法封闭，括号内属于 H，故 aH ⊆ bH。', 'Take any x in H. Closure under inverses and products puts the parenthesized factor in H. Thus aH ⊆ bH.'],
  ['b = a(hₐhᵦ⁻¹),   bx = a((hₐhᵦ⁻¹)x) ∈ aH', '改为右乘 hᵦ⁻¹。同理对每个 x ∈ H 都成立，故 bH ⊆ aH。两次包含给出相等；互不相交是唯一的另一种情况。', 'Right-multiply instead by hᵦ⁻¹. For every x in H this gives bH ⊆ aH. The two inclusions give equality; otherwise the cosets are disjoint.'],
  ['|G| = [G:H] · |H|', '定理 6.7。有限群被不同陪集完全覆盖，它们互不相交且大小相等。数出陪集个数 [G:H] 即得 |H| 整除 |G|。反向一般不成立：不能由任意因数推断必有该阶的子群。', 'Theorem 6.7. The distinct cosets cover a finite group, are disjoint, and all have the same size. Counting them gives the index [G:H], so |H| divides |G|. The converse need not hold: a divisor alone does not guarantee a subgroup of that order.']
];
