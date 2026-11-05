import type { GcdEvent, GcdFunction, GcdInputError } from '../../lib/algorithms/polynomialGcd';
import type { TraceLine } from '../common/TraceCode';
export const gcdInputErrors:Record<GcdInputError,[string,string]>={
  empty:['请提供非空系数数组；零多项式请明确输入 [0]。','Provide a nonempty coefficient array; enter [0] explicitly for the zero polynomial.'],
  format:['按降幂输入十进制整数数组，如 [2,0,-3]。不接受小数、指数或省略的项。','Enter decimal integers in descending order, such as [2,0,-3]. Decimals, exponents, and missing items are not accepted.'],
  capacity:['原始输入最多9项；前导零也计入项数。','The original input may contain at most 9 items, including leading zeros.'],
  range:['每个输入系数的绝对值须不超过1000。中间分数不受此输入上限限制。','Each input coefficient must have absolute value at most 1000. Intermediate fractions are not restricted by this input bound.'],
};
export const gcdMessages:Record<GcdEvent,[string,string]>={
 init:['输入已应用，播放器已复位；尚未执行算法。','Input applied and player reset; the algorithm has not executed yet.'],
 gcdEnter:['进入书中的泛型gcd循环，a与b是当前多项式。','Enter the book’s generic gcd loop; a and b are the current polynomials.'],
 gcdCheck:['检查b是否非零。b为零时结束循环，返回a。','Test whether b is nonzero. When b is zero, leave the loop and return a.'],
 call:['调用remainder(a,b)。外层a尚未赋值，内层使用自己的A、B、Q、R。','Call remainder(a,b). Outer a has not been assigned yet; the callee owns A, B, Q, and R.'],
 divisionEnter:['进入长除法的教学展开；A、B固定为本次调用的输入。','Enter the teaching expansion of long division; A and B stay fixed for this call.'],
 divisionInit:['初始化Q=0、R=A，带余除法恒等式成立。','Initialize Q=0 and R=A; the division identity holds.'],
 divisionCheck:['先检查R是否为零；非零时才比较次数，判断能否继续消去最高次项。','Check whether R is zero first; only nonzero R has its degree compared to decide whether another leading term can be eliminated.'],
 term:['用R的首项除以B的首项，得到商项T。Q与R尚未改变；T×B是将要减去的多项式。','Divide the leading term of R by that of B to obtain quotient term T. Q and R are unchanged; T×B is the polynomial to subtract.'],
 eliminate:['同时完成Q←Q+T、R←R−T×B，消元轮次增加1，再用精确运算验证A=BQ+R。','Complete Q←Q+T and R←R−T×B together, increment the elimination count, then verify A=BQ+R exactly.'],
 divisionReturn:['本次求余完成：R=0或deg(R)<deg(B)。remainder返回R；Q作为教学辅助保留在本次长除法记录中。','This remainder call is complete: R=0 or deg(R)<deg(B). remainder returns R; Q is retained in this division record for teaching.'],
 assign:['已回到gcd，求余返回值赋给a。内层局部变量已退出当前作用域，b尚未改变。','Back in gcd, assign the returned remainder to a. Inner locals have left the active scope; b is unchanged.'],
 swap:['执行std::swap(a,b)，完成一轮GCD迭代。新的b是刚求出的余式。','Execute std::swap(a,b), completing one GCD iteration. The new b is the remainder just computed.'],
 gcdReturn:['书中gcd循环返回原始多项式a，尚未首一化。它可以带有非1的首项系数。','The book’s gcd loop returns raw polynomial a, without making it monic. Its leading coefficient need not be 1.'],
 monic:['独立后处理：非零结果除以自己的首项系数，得到首一GCD；零结果按本演示约定保留0。此步骤不增加循环或消元计数。','Separate postprocessing: divide a nonzero result by its leading coefficient to obtain the monic GCD; keep a zero result as 0 by this demonstration’s convention. This adds no loop or elimination count.'],
};
const lines=(entries:[string,string][]):TraceLine[]=>entries.map(([id,text])=>({id,text}));
export const polynomialGcdCode:Record<GcdFunction,TraceLine[]>={
 gcd:lines([['entry','E gcd(E a, E b) {'],['check','    while (b != E(0)) {'],['remainder','        a = remainder(a, b);'],['swap','        std::swap(a, b);'],['closeLoop','    }'],['return','    return a;'],['close','}']]),
 remainder:lines([['entry','remainder(A, B) {'],['init','    Q = 0; R = A;'],['check','    while (R != 0 && deg(R) >= deg(B)) {'],['term','        T = lead(R) / lead(B) * x^(deg(R)-deg(B));'],['update','        (Q, R) = (Q + T, R - T * B);'],['closeLoop','    }'],['return','    return R;'],['close','}']]),
 monic:lines([['entry','monic(raw) {'],['zero','    if (raw == 0) return 0;'],['normalize','    return raw / lead(raw);'],['close','}']]),
};
export const polynomialExamples=[
  {id:'book',title:['书中长除法','Book long division'],A:[3,-4,-6,10],B:[1,-2]},
  {id:'fraction',title:['分数商与余式','Fractional quotient and remainder'],A:[1,0,1],B:[2,1]},
  {id:'exercise1',title:['习题8.3（1）','Exercise 8.3 (1)'],A:[16,-56,-88,278,105],B:[16,-64,-44,232,70]},
  {id:'exercise2',title:['习题8.3（2）','Exercise 8.3 (2)'],A:[7,6,-8,-6,1],B:[11,15,-2,-5,1]},
  {id:'zero',title:['两个零多项式','Two zero polynomials'],A:[0],B:[0]},
  {id:'constants',title:['常数4与6','Constants 4 and 6'],A:[4],B:[6]},
] as const;
