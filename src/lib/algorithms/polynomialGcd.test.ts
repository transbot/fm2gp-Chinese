import { expect, it } from 'vitest';
import { fraction, fractionText, fromIntegers, parseGcdPolynomial, polynomialDivision, polynomialGcdTrace, divisionTrace, degree, polynomialText, addPoly, multiplyPoly, equalPoly, isZero } from './polynomialGcd';
const P=fromIntegers;
const coefficients=(p:ReturnType<typeof P>)=>p.map(fractionText);
it('normalizes exact fractions without floating point',()=>{
  expect(fraction(6n,-8n)).toEqual({n:-3n,d:4n});expect(fraction(0n,-99n)).toEqual({n:0n,d:1n});
  expect(fractionText(fraction(123456789012345678901n,3n))).toBe('123456789012345678901/3');
  expect(()=>fraction(1n,0n)).toThrow();
});
it.each(['','[]','[ ]','[1,,2]','[1.5,2]','[1x,2]','[1e-400,2]','[1.00000000000000001,2]','[1001]','[-1001]','[0,0,0,0,0,0,0,0,0,1]','[0,0,0,0,0,0,0,0,0,0]'])('rejects original input %s',raw=>expect(parseGcdPolynomial(raw).ok).toBe(false));
it('checks raw capacity, keeps missing powers and normalizes only leading zeros',()=>{
  expect(parseGcdPolynomial('[0,0,2,0,-3,0]')).toMatchObject({ok:true,original:[0,0,2,0,-3,0],poly:P([2,0,-3,0])});
  expect(parseGcdPolynomial('[0,0]')).toMatchObject({ok:true,poly:P([0])});
  expect(parseGcdPolynomial('[1000,-1000,0,0,0,0,0,0,0]').ok).toBe(true);
  expect(degree(P([0]))).toBeNull();expect(degree(P([4]))).toBe(0);
});
it('locks the book division, quotient terms and remainders',()=>{
  const t=divisionTrace(P([3,-4,-6,10]),P([1,-2]));
  expect(t.filter(s=>s.event==='eliminate').map(s=>coefficients(s.inner!.T))).toEqual([['3','0','0'],['2','0'],['-2']]);
  expect(t.filter(s=>s.event==='eliminate').map(s=>coefficients(s.inner!.R))).toEqual([['2','-6','10'],['-2','10'],['6']]);
  expect(coefficients(t[t.length-1].inner!.Q)).toEqual(['3','2','-2']);
  expect(polynomialText(t[t.length-1].inner!.R)).toBe('6');
});
it('preserves exact fractional quotient and remainder',()=>{
  const {Q,R}=polynomialDivision(P([1,0,1]),P([2,1]));
  expect(coefficients(Q)).toEqual(['1/2','-1/4']);expect(coefficients(R)).toEqual(['5/4']);
  expect(()=>divisionTrace(P([1]),P([0]))).toThrow('zeroDivisor');
});
it.each([
  {a:[16,-56,-88,278,105],b:[16,-64,-44,232,70],raw:['-4','24','-35'],monic:['1','-6','35/4']},
  {a:[7,6,-8,-6,1],b:[11,15,-2,-5,1],raw:['605/1521','1210/1521','605/1521'],monic:['1','2','1']},
])('locks exercise 8.3 exact raw and monic results ($a)',({a,b,raw,monic})=>{
  const trace=polynomialGcdTrace(P(a),P(b)),last=trace[trace.length-1];
  expect(coefficients(last.rawGcd!)).toEqual(raw);expect(coefficients(last.result!)).toEqual(monic);
  expect(isZero(polynomialDivision(P(a),last.result!).R)).toBe(true);expect(isZero(polynomialDivision(P(b),last.result!).R)).toBe(true);
  if(a[0]===16)expect(last.divisions.map(d=>coefficients(d.R))).toEqual([['8','-44','46','35'],['-4','24','-35'],['0']]);
  for(const d of last.divisions){expect(equalPoly(d.A,addPoly(multiplyPoly(d.B,d.Q),d.R))).toBe(true);expect(isZero(d.R)||(degree(d.R)!<degree(d.B)!)).toBe(true);}
});
it.each([[[0],[0],['0']],[[2,4],[0],['1','2']],[[0],[2,4],['1','2']],[[4],[6],['1']],[[0],[6],['1']]] as [number[],number[],string[]][])('handles zero and constants: %j, %j',(a,b,expected)=>{
  const t=polynomialGcdTrace(P(a),P(b));expect(coefficients(t[t.length-1].result!)).toEqual(expected);
  expect(t[t.length-2].event).toBe('gcdReturn');expect(t[t.length-1].event).toBe('monic');
});
it('keeps nested scopes, completed-event counters, paired invariants and immutable snapshots',()=>{
  const t=polynomialGcdTrace(P([16,-56,-88,278,105]),P([16,-64,-44,232,70]));
  for(let i=1;i<t.length;i++){
    const s=t[i],prev=t[i-1];
    expect(s.counts.gcdRounds-prev.counts.gcdRounds).toBe(s.event==='swap'?1:0);
    expect(s.counts.eliminations-prev.counts.eliminations).toBe(s.event==='eliminate'?1:0);
    if(s.fn==='remainder'){expect(s.inner).not.toBeNull();expect(s.outer).toEqual(prev.outer);}
    else expect(s.inner).toBeNull();
    if(s.event==='eliminate'){const d=s.inner!;expect(equalPoly(d.A,addPoly(multiplyPoly(d.B,d.Q),d.R))).toBe(true);expect(s.identity).toBe(true);}
    if(s.event==='assign'){expect(prev.fn).toBe('remainder');expect(s.outer!.a).toEqual(prev.inner!.R);expect(s.line).toBe('remainder');}
    if(s.event==='swap')expect(s.outer).toEqual({a:prev.outer!.b,b:prev.outer!.a});
  }
  const saved=structuredClone(t[0]);t[t.length-1].outer!.a[0].n=123n;expect(t[0]).toEqual(saved);
});
// Independent rational evaluation: no production arithmetic, normalization or division helpers.
// Equality at more points than the polynomial degree proves each exact identity.
it('checks 120 generated traces with an independent rational identity oracle',()=>{
 type Q={n:bigint;d:bigint};
 const plus=(a:Q,b:Q):Q=>({n:a.n*b.d+b.n*a.d,d:a.d*b.d});
 const times=(a:Q,b:Q):Q=>({n:a.n*b.n,d:a.d*b.d});
 const evalAt=(p:Q[],x:bigint)=>p.reduce((a,c)=>plus(times(a,{n:x,d:1n}),c),{n:0n,d:1n});
 for(let seed=0;seed<120;seed++){
  const a=Array.from({length:seed%9+1},(_,i)=>(seed*13+i*7)%21-10),b=Array.from({length:seed%5+1},(_,i)=>(seed*11+i*3)%19-9);
  const steps=polynomialGcdTrace(P(a),P(b));
  for(const s of steps.filter(s=>s.event==='eliminate'||s.event==='divisionReturn')){
   const d=s.inner!;
   for(let x=0n;x<=9n;x++){const lhs=evalAt(d.A,x),rhs=plus(times(evalAt(d.B,x),evalAt(d.Q,x)),evalAt(d.R,x));expect(lhs.n*rhs.d).toBe(rhs.n*lhs.d);}
   if(s.event==='divisionReturn')expect(isZero(d.R)||d.R.length<d.B.length).toBe(true);
  }
  const last=steps[steps.length-1];expect(last.counts.gcdRounds).toBe(last.divisions.length);expect(last.counts.eliminations).toBe(last.divisions.reduce((n,d)=>n+d.eliminations,0));
 }
});
it('accepts maximum input size and lets intermediate exact fractions grow beyond safe integers',()=>{
 const a=P([997,991,983,977,971,967,953,947,941]),b=P([929,919,911,907,887,883,881,877]);
 const steps=polynomialGcdTrace(a,b),last=steps[steps.length-1];
 expect(steps.some(s=>s.inner?.R.some(q=>q.n>BigInt(Number.MAX_SAFE_INTEGER)||q.n< -BigInt(Number.MAX_SAFE_INTEGER)||q.d>BigInt(Number.MAX_SAFE_INTEGER)))).toBe(true);
 expect(coefficients(last.result!)).toEqual(['1']);
});
it.each([
 {a:[3,-4,-6,10],b:[1,-2],raw:['6'],monic:['1'],counts:{gcdRounds:2,eliminations:5}},
 {a:[16,-56,-88,278,105],b:[16,-64,-44,232,70],raw:['-4','24','-35'],monic:['1','-6','35/4'],counts:{gcdRounds:3,eliminations:5}},
 {a:[7,6,-8,-6,1],b:[11,15,-2,-5,1],raw:['605/1521','1210/1521','605/1521'],monic:['1','2','1'],counts:{gcdRounds:3,eliminations:5}},
 {a:[4],b:[6],raw:['6'],monic:['1'],counts:{gcdRounds:1,eliminations:1}},
 {a:[0],b:[0],raw:['0'],monic:['0'],counts:{gcdRounds:0,eliminations:0}},
])('keeps fixed adjacent raw and monic function returns independent ($a)',({a,b,raw,monic,counts})=>{
 const t=polynomialGcdTrace(P(a),P(b)),before=t[t.length-3],g=t[t.length-2],m=t[t.length-1];
 expect(g).toMatchObject({fn:'gcd',event:'gcdReturn',line:'return',counts,result:null});
 expect(m).toMatchObject({fn:'monic',event:'monic',line:monic[0]==='0'?'zero':'normalize',counts});
 expect(coefficients(g.returned!)).toEqual(raw);expect(coefficients(m.returned!)).toEqual(monic);
 expect(coefficients(g.rawGcd!)).toEqual(raw);expect(coefficients(m.rawGcd!)).toEqual(raw);expect(coefficients(m.result!)).toEqual(monic);
 expect(g.counts).toEqual(before.counts);expect(m.counts).toEqual(g.counts);
 expect(m.returned).not.toBe(m.result);expect(m.returned![0]).not.toBe(m.result![0]);
 // Mutating the most recent returned value must not rewrite the stored result or the prior return.
 m.returned![0].n=123456n;expect(coefficients(m.result!)).toEqual(monic);expect(coefficients(g.returned!)).toEqual(raw);expect(coefficients(m.rawGcd!)).toEqual(raw);
});
