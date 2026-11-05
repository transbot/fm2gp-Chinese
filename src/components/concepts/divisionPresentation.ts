import type { TraceLine } from '../common/TraceCode';
import type { DivisionError, DivisionEvent, DivisionMethod, DivisionStep } from '../../lib/algorithms/divisionTrace';
const lines = (rows: [string, string][]): TraceLine[] => rows.map(([id, text]) => ({ id, text }));
export const divisionNames: Record<DivisionMethod, [string, string]> = {
  repeated: ['逐次减法', 'Repeated subtraction'], doubling: ['倍增求余', 'Doubling remainder'],
  fibonacci: ['斐波那契求余', 'Fibonacci remainder'], quotient: ['同时求商与余数', 'Quotient and remainder together'],
};
export const divisionErrors: Record<DivisionError, [string, string]> = {
  empty: ['请输入整数；空白不是零。', 'Enter an integer; blank is not zero.'],
  integer: ['请使用十进制整数，不接受小数、指数形式或其他字符。', 'Use a decimal integer, without fractions, exponent notation, or other characters.'],
  aRange: ['A 必须是 0 至 1,000,000 的整数。', 'A must be an integer from 0 to 1,000,000.'],
  bRange: ['B 必须是 1 至 1,000,000 的整数；除数不能为零或负数。', 'B must be an integer from 1 to 1,000,000; the divisor cannot be zero or negative.'],
  capacity: ['完整回放最多支持商 256，即 A < 257B；请减小 A 或增大 B。输入已保留。', 'Full replay supports a quotient up to 256: A < 257B. Reduce A or increase B; your input is retained.'],
};
export const divisionMessages: Record<DivisionEvent, [string, string]> = {
  init: ['进入算法，使用已应用的 A、B 初始化运行变量。', 'Enter the algorithm with running variables initialized from the applied A and B.'],
  check: ['刚检查条件；比较本身不增加算术计数。', 'Just checked the condition; comparison itself adds no arithmetic operation.'],
  call: ['调用 largest_doubling；辅助函数接收 a、b 的副本。', 'Call largest_doubling with copies of a and b.'],
  enter: ['进入 largest_doubling；下方单独显示它的局部变量。', 'Enter largest_doubling; its local variables are shown separately below.'],
  probe: ['先计算 a−b，再比较结果与 b。即使判断为假，这次减法也已执行。', 'Compute a−b, then compare it with b. This subtraction is counted even when the condition is false.'],
  double: ['候选量 b 与自身相加：执行一次数据加法。调用者的 b 保持不变。', 'Add candidate b to itself: one data addition. The caller’s b is unchanged.'],
  helperReturn: ['辅助函数返回最大倍增量；此步没有额外算术运算。', 'The helper returns the largest doubled value; no additional arithmetic is performed.'],
  candidate: ['将辅助函数的返回值赋给 c，准备首次扣减。', 'Assign the helper’s return value to c, ready for the first deduction.'],
  seed: ['初始化源码中的变量；赋值不计为加法。', 'Initialize the source variable; assignment is not an addition.'],
  deduct: ['从当前剩余量 a 中扣除候选量；减法计数和扣减次数各加一。', 'Deduct the candidate from the remaining a; count one subtraction and one remainder deduction.'],
  half: ['把候选量 c 减半，计一次减半。', 'Halve candidate c; count one halving operation.'],
  doubleN: ['执行 n＋n；与刚完成的 c 减半组成完整更新。', 'Execute n+n, completing the paired update with the preceding halving of c.'],
  incrementN: ['执行 n＋1；与刚完成的 a 扣减组成完整更新。', 'Execute n+1, completing the paired update with the preceding deduction from a.'],
  save: ['把 c 暂存到 tmp，供随后更新 b 使用。', 'Save c in tmp for the subsequent update of b.'],
  grow: ['执行 b＋c，得到下一候选量；b 尚未更新。', 'Execute b+c to obtain the next candidate; b has not yet been updated.'],
  growPair: ['将旧 c 赋给 b，完成这一对候选量的增长。原始除数仍是 B。', 'Assign the old c to b, completing this growth pair. The original divisor is still B.'],
  recover: ['计算 c−b，恢复前一候选量并存入 tmp；这是一次数据减法。', 'Compute c−b to recover the previous candidate in tmp; this is one data subtraction.'],
  shift: ['把当前 b 赋给 c；下一步才把 tmp 赋给 b。', 'Assign the current b to c; the next statement assigns tmp to b.'],
  backPair: ['将 tmp 赋给 b，完成回退。整个过程用加减恢复候选量，无需减半。', 'Assign tmp to b to complete recovery. Candidates are recovered by addition and subtraction, without halving.'],
  done: ['返回结果。现在才验证最终余数范围 0 ≤ r < B。', 'Return the result. Now verify the final remainder bound 0 ≤ r < B.'],
};
export const divisionCode: Record<DivisionStep['fn'], TraceLine[]> = {
  repeated: lines([['entry','repeated_subtraction(a, b) {'],['loop','    while (a >= b)'],['deduct','        a = a - b;'],['return','    return a;'],['end','}']]),
  largest_doubling: lines([['entry','line_segment largest_doubling(line_segment a, line_segment b) {'],['test','    while (a - b >= b)'],['double','        b = b + b;'],['return','    return b;'],['end','}']]),
  doubling: lines([['entry','line_segment remainder(line_segment a, line_segment b) {'],['early','    if (a < b) return a;'],['candidate','    line_segment c = largest_doubling(a, b);'],['first','    a = a - c;'],['loop','    while (c != b) {'],['half','        c = half(c);'],['deductTest','        if (c <= a)'],['deduct','            a = a - c;'],['close','    }'],['return','    return a;'],['end','}']]),
  fibonacci: lines([['entry','line_segment remainder_fibonacci(line_segment a, line_segment b) {'],['early','    if (a < b) return a;'],['seed','    line_segment c = b;'],['doGrow','    do {'],['save','        line_segment tmp = c;'],['grow','        c = b + c;'],['growPair','        b = tmp;'],['growTest','    } while (a >= c);'],['doBack','    do {'],['deductTest','        if (a >= b)'],['deduct','            a = a - b;'],['recover','        line_segment tmp = c - b;'],['shift','        c = b;'],['backPair','        b = tmp;'],['backTest','    } while (b < c);'],['return','    return a;'],['end','}']]),
  quotient: lines([['type','std::pair<integer, line_segment>'],['entry','quotient_remainder(line_segment a, line_segment b) {'],['early','    if (a < b) return {integer(0), a};'],['candidate','    line_segment c = largest_doubling(a, b);'],['seed','    integer n(1);'],['first','    a = a - c;'],['loop','    while (c != b) {'],['half','        c = half(c);'],['doubleN','        n = n + n;'],['deductTest','        if (c <= a) {'],['deduct','            a = a - c;'],['incrementN','            n = n + 1;'],['ifEnd','        }'],['close','    }'],['return','    return {n, a};'],['end','}']]),
};
