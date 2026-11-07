import type {ProofRow} from './groupProofs';

export const zeroDivisorProof:ProofRow[] = [
  ['zero-unit-identity','b = 1b','乘法单位元素 1 左乘 b，结果仍为 b。','Left multiplication by the multiplicative identity 1 leaves b unchanged.'],
  ['zero-unit-inverse','1b = (a⁻¹a)b','反设 a 可逆，故 a⁻¹a=1。用这个等式替换左侧的 1。','Under the assumption that a is invertible, a⁻¹a=1. Substitute this product for 1.'],
  ['zero-unit-associate','(a⁻¹a)b = a⁻¹(ab)','使用乘法结合律改变括号，因子 a⁻¹、a、b 的顺序保持。','Associativity changes the grouping while preserving the order of the factors a⁻¹, a, b.'],
  ['zero-unit-product','a⁻¹(ab) = a⁻¹0','使用前提 ab=0。','Use the premise ab=0.'],
  ['zero-unit-absorb','a⁻¹0 = 0','使用定义 8.3 的零元吸收性。','Use zero absorption from Definition 8.3.'],
  ['zero-unit-contradiction','b = 0 ∧ b ≠ 0','上述等式推出 b=0，与前提 b≠0 矛盾。因此否定 a 可逆的假设，零因子不能成为单位。','The equalities imply b=0, contradicting the premise b≠0. Reject the assumption that a is invertible: a zero divisor cannot be a unit.'],
];
