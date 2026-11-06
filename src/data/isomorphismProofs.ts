import type {ProofRow} from './groupProofs';

export const kleinProof:ProofRow[]=[
  ['klein-assume','φ : ℤ₄ → U(8)','反设存在同构 φ。它是单射，并且把模 4 加法送到模 8 乘法。','Suppose φ is an isomorphism. It is injective and takes addition modulo 4 to multiplication modulo 8.'],
  ['klein-source-sum','φ(2) = φ((1 + 1) mod 4)','在源群中，1 与自身相加得到 2。','Adding 1 to itself in the source group gives 2.'],
  ['klein-preserve','= (φ(1) × φ(1)) mod 8','保持运算允许把和的像写成两个像在目标群中的积。','Preservation of the operation expresses the image of the sum as the product of the images in the target.'],
  ['klein-square','= 1','φ(1) 属于 U(8)。从它的运算表对角线可见，每个元素与自身相乘对 8 取余都得 1。','The image φ(1) lies in U(8). Its table diagonal shows that every element multiplied by itself modulo 8 gives 1.'],
  ['klein-identity','1 = φ(0)','同构将源单位元素 0 映为目标单位元素 1：设 u=φ(0)，由 0+0=0 得 u·u=u，在目标群中消去 u 即得 u=1。','An isomorphism maps the source identity 0 to the target identity 1: for u=φ(0), preservation of 0+0=0 gives u·u=u. Cancellation in the target gives u=1.'],
  ['klein-injective','φ(2) = φ(0) ⇒ 2 = 0','单射把相等的像追溯到相同的输入。但 2 和 0 在 ℤ₄ 中不同，产生矛盾。因此这两个群不同构。','Injectivity forces equal inputs when the images coincide. But 2 and 0 are distinct in ℤ₄, a contradiction. The groups cannot be isomorphic.']
];

export const cyclicFourProof:ProofRow[]=[
  ['cyclic4-generator','G = 〈g〉,   ord(g) = 4','任取一个阶为 4 的循环群 G。按循环群定义可选生成元 g；由第 6.4 节，元素阶等于其生成子群的大小，此处就是 4。','Take any cyclic group G of order four and choose a generator g. By Section 6.4 its order equals the size of the subgroup it generates, here all four elements.'],
  ['cyclic4-bijection','φ(k) = gᵏ,   k ∈ {0,1,2,3}','若前四个幂 e,g,g²,g³ 有重复，消去就会得到小于 4 的正返回指数。这四个幂互异且穷尽 G，因此 φ 是双射。','A repeat among e,g,g²,g³ would give a positive return exponent below 4 by cancellation. These four distinct powers exhaust G, so φ is bijective.'],
  ['cyclic4-reduce','φ((k + ℓ) mod 4) = g^((k + ℓ) mod 4) = g^(k + ℓ)','第一步用 φ 的定义。第二步用 g⁴=e：指数相差 4 的倍数时，相应的幂相等。','The first equality defines φ. For the second, g⁴=e makes reducing an exponent modulo four leave its power unchanged.'],
  ['cyclic4-compose','g^(k + ℓ) = gᵏgˡ = φ(k)φ(ℓ)','同一元素的幂相乘可以合并指数。代回 φ 的定义，得到先相加再映射等于先映射再相乘。','The power law for a single element gives the product of powers in this order. Substituting the definition of φ proves preservation of the operation.'],
  ['cyclic4-categorical','G₁ → ℤ₄ → G₂','每个四阶循环群都与 ℤ₄ 同构。从任一个 G₁ 先经其同构的逆映射到 ℤ₄，再经同构到 G₂，复合仍是同构。','Every cyclic group of order four is isomorphic to ℤ₄. Compose the inverse isomorphism from G₁ to ℤ₄ with the isomorphism from ℤ₄ to G₂. The composite is an isomorphism.']
];
