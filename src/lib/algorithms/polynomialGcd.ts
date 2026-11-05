export interface Fraction { n:bigint; d:bigint }
export type Poly = Fraction[]; // Descending powers, normalized leading coefficient.
const abs=(n:bigint)=>n<0n?-n:n;
export function fraction(n:bigint,d=1n):Fraction {
  if(d===0n)throw Error('zeroDenominator');
  if(n===0n)return {n:0n,d:1n};
  if(d<0n){n=-n;d=-d;}
  let a=abs(n),b=d;while(b!==0n){[a,b]=[b,a%b];}
  return {n:n/a,d:d/a};
}
export const fractionText=(q:Fraction)=>q.d===1n?String(q.n):`${q.n}/${q.d}`;
export const addFraction=(a:Fraction,b:Fraction)=>fraction(a.n*b.d+b.n*a.d,a.d*b.d);
export const multiplyFraction=(a:Fraction,b:Fraction)=>fraction(a.n*b.n,a.d*b.d);
export const divideFraction=(a:Fraction,b:Fraction)=>fraction(a.n*b.d,a.d*b.n);
export const zero=():Poly=>[fraction(0n)];
export function normalize(p:Poly):Poly {
  const index=p.findIndex(c=>c.n!==0n);
  return index<0?zero():p.slice(index).map(c=>fraction(c.n,c.d));
}
export function fromIntegers(values:number[]):Poly {
  if(values.some(v=>!Number.isSafeInteger(v)))throw Error('integer');
  return normalize(values.map(v=>fraction(BigInt(v))));
}
export const isZero=(p:Poly)=>p.every(c=>c.n===0n);
export const degree=(p:Poly):number|null=>isZero(p)?null:normalize(p).length-1;
export function addPoly(a:Poly,b:Poly):Poly {
  const length=Math.max(a.length,b.length);
  return normalize(Array.from({length},(_,i)=>addFraction(a[i-length+a.length]??fraction(0n),b[i-length+b.length]??fraction(0n))));
}
export const scalePoly=(a:Poly,q:Fraction)=>normalize(a.map(c=>multiplyFraction(c,q)));
export const subtractPoly=(a:Poly,b:Poly)=>addPoly(a,scalePoly(b,fraction(-1n)));
export function multiplyPoly(a:Poly,b:Poly):Poly {
  const out=Array.from({length:a.length+b.length-1},()=>fraction(0n));
  a.forEach((x,i)=>b.forEach((y,j)=>{out[i+j]=addFraction(out[i+j],multiplyFraction(x,y));}));
  return normalize(out);
}
export function equalPoly(a:Poly,b:Poly):boolean {
  a=normalize(a);b=normalize(b);return a.length===b.length&&a.every((x,i)=>x.n===b[i].n&&x.d===b[i].d);
}
export function evaluatePoly(p:Poly,x:Fraction):Fraction {
  return p.reduce((sum,c)=>addFraction(multiplyFraction(sum,x),c),fraction(0n));
}
export function polynomialText(p:Poly):string {
  const parts:string[]=[];
  p.forEach((q,i)=>{
    if(q.n===0n)return;
    const power=p.length-1-i,c=fractionText({n:abs(q.n),d:q.d});
    const coefficient=power&&c==='1'?'':q.d===1n||!power?c:`(${c})`;
    const exponent=String(power).split('').map(d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');
    const term=coefficient+(power?`x${power===1?'':exponent}`:'');
    parts.push((parts.length?(q.n<0n?' − ':' + '):(q.n<0n?'−':''))+term);
  });
  return parts.join('')||'0';
}
export type GcdInputError='empty'|'format'|'capacity'|'range';
export function parseGcdPolynomial(raw:string):{ok:true;original:number[];poly:Poly}|{ok:false;error:GcdInputError} {
  if(!raw.trim())return {ok:false,error:'empty'};
  const match=raw.trim().match(/^\[([\s\S]*)\]$/);
  if(!match)return {ok:false,error:'format'};
  if(!match[1].trim())return {ok:false,error:'empty'};
  const tokens=match[1].split(',').map(t=>t.trim());
  if(tokens.length>9)return {ok:false,error:'capacity'};
  if(tokens.some(t=>! /^-?\d+$/.test(t)))return {ok:false,error:'format'};
  // Original text is validated before conversion; no fractional rounding or underflow.
  if(tokens.some(t=>abs(BigInt(t))>1000n))return {ok:false,error:'range'};
  const original=tokens.map(Number);return {ok:true,original,poly:fromIntegers(original)};
}
export interface DivisionFrame { A:Poly;B:Poly;Q:Poly;R:Poly;T:Poly;product:Poly;beforeR:Poly;round:number }
export interface CompletedDivision { A:Poly;B:Poly;Q:Poly;R:Poly;eliminations:number }
export type GcdEvent='init'|'gcdEnter'|'gcdCheck'|'call'|'divisionEnter'|'divisionInit'|'divisionCheck'|'term'|'eliminate'|'divisionReturn'|'assign'|'swap'|'gcdReturn'|'monic';
export type GcdFunction='gcd'|'remainder'|'monic';
export interface PolynomialGcdStep {
  fn:GcdFunction;event:GcdEvent;line:string;outer:{a:Poly;b:Poly}|null;inner:DivisionFrame|null;
  inputA:Poly;inputB:Poly;returned:Poly|null;rawGcd:Poly|null;result:Poly|null;
  counts:{gcdRounds:number;eliminations:number};identity:boolean|null;condition:boolean|null;divisions:CompletedDivision[];
}
function cancellation(R:Poly,B:Poly):Poly {
  const power=degree(R)!-degree(B)!;
  return [divideFraction(R[0],B[0]),...Array.from({length:power},()=>fraction(0n))];
}
export function polynomialDivision(A:Poly,B:Poly):{Q:Poly;R:Poly} {
  A=normalize(A);B=normalize(B);if(isZero(B))throw Error('zeroDivisor');
  let Q=zero(),R=A;
  while(!isZero(R)&&degree(R)!>=degree(B)!){const T=cancellation(R,B);Q=addPoly(Q,T);R=subtractPoly(R,multiplyPoly(T,B));}
  return {Q,R};
}
function trace(A:Poly,B:Poly,gcd:boolean):PolynomialGcdStep[] {
  A=normalize(A);B=normalize(B);if(!gcd&&isZero(B))throw Error('zeroDivisor');
  const s:PolynomialGcdStep={fn:gcd?'gcd':'remainder',event:'init',line:'entry',outer:gcd?{a:A,b:B}:null,inner:null,inputA:A,inputB:B,returned:null,rawGcd:null,result:null,counts:{gcdRounds:0,eliminations:0},identity:null,condition:null,divisions:[]};
  const steps:PolynomialGcdStep[]=[];
  const emit=(event:GcdEvent,line:string,condition:boolean|null=null,identity:boolean|null=null)=>{Object.assign(s,{event,line,condition,identity});steps.push(structuredClone(s));};
  const divide=(a:Poly,b:Poly)=>{
    s.fn='remainder';s.returned=null;
    const d:DivisionFrame={A:normalize(a),B:normalize(b),Q:zero(),R:normalize(a),T:zero(),product:zero(),beforeR:normalize(a),round:0};
    s.inner=d;emit('divisionEnter','entry');emit('divisionInit','init',null,true);
    while(true){
      const proceed=!isZero(d.R)&&degree(d.R)!>=degree(d.B)!;emit('divisionCheck','check',proceed);
      if(!proceed)break;
      d.T=cancellation(d.R,d.B);d.product=multiplyPoly(d.T,d.B);d.beforeR=normalize(d.R);emit('term','term');
      // One atomic teaching event completes both updates before asserting A=BQ+R.
      d.Q=addPoly(d.Q,d.T);d.R=subtractPoly(d.R,d.product);d.round++;s.counts.eliminations++;
      const identity=equalPoly(d.A,addPoly(multiplyPoly(d.B,d.Q),d.R));
      if(!identity)throw Error('identity');emit('eliminate','update',null,identity);
    }
    s.returned=normalize(d.R);
    s.divisions.push({A:d.A,B:d.B,Q:d.Q,R:d.R,eliminations:d.round});
    emit('divisionReturn','return',null,true);return d.R;
  };
  // Initialize a real local frame for the standalone division player only.
  if(!gcd)s.inner={A,B,Q:zero(),R:A,T:zero(),product:zero(),beforeR:A,round:0};
  emit('init','entry');
  if(!gcd){divide(A,B);return steps;}
  emit('gcdEnter','entry');
  while(true){
    const proceed=!isZero(s.outer!.b);emit('gcdCheck','check',proceed);if(!proceed)break;
    emit('call','remainder');const r=divide(s.outer!.a,s.outer!.b);
    // The callee return snapshot is complete. Restore only the caller's locals.
    s.fn='gcd';s.inner=null;s.outer!.a=normalize(r);emit('assign','remainder');
    [s.outer!.a,s.outer!.b]=[s.outer!.b,s.outer!.a];s.counts.gcdRounds++;emit('swap','swap');
  }
  s.rawGcd=normalize(s.outer!.a);s.returned=normalize(s.rawGcd);emit('gcdReturn','return');
  s.fn='monic';s.result=isZero(s.rawGcd)?zero():scalePoly(s.rawGcd,divideFraction(fraction(1n),s.rawGcd[0]));
  emit('monic',isZero(s.rawGcd)?'zero':'normalize');return steps;
}
export const divisionTrace=(A:Poly,B:Poly)=>trace(A,B,false);
export const polynomialGcdTrace=(A:Poly,B:Poly)=>trace(A,B,true);
