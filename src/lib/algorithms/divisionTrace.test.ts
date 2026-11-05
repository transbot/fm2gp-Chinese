import { describe, expect, it } from 'vitest';
import { divisionTrace, parseDivisionInput, divisionMethods } from './divisionTrace';

describe('strict original-text division inputs', () => {
  it.each([[45,6],[42,6],[5,6],[6,6],[0,6],[47,7],[256,1],[770,3],[1000000,1000000]])('accepts %i / %i', (A,B) => {
    expect(parseDivisionInput(String(A),String(B))).toEqual({ok:true,A,B});
  });
  it.each(['',' ','-1','1.5','1.00000000000000001','1e-400','1e3','NaN','Infinity','12oops','+2','1000001'])('rejects dividend %j', raw => {
    expect(parseDivisionInput(raw,'6').ok).toBe(false);
  });
  it.each(['','0','-2','2.1','6e0','1000001'])('rejects divisor %j', raw => {
    const result=parseDivisionInput('45',raw);
    expect(result.ok).toBe(false); if(!result.ok) expect(result.errors.B).toBeTruthy();
  });
  it('uses A < 257B capacity, including nonzero remainder at quotient 256', () => {
    expect(parseDivisionInput('770','3').ok).toBe(true);
    expect(parseDivisionInput('257','1')).toEqual({ok:false,errors:{A:'capacity'}});
  });
});
describe('source-level division traces', () => {
  it.each([[45,6,7,3],[42,6,7,0],[5,6,0,5],[6,6,1,0],[0,6,0,0],[47,7,6,5],[256,1,256,0],[770,3,256,2],[1000000,1000000,1,0]])('returns %i / %i = %i remainder %i', (A,B,q,r) => {
    for(const method of divisionMethods) {
      const steps=divisionTrace(A,B,method), last=steps.slice(-1)[0];
      expect(last.result).toBe(r);
      if(method==='quotient') expect(last.n).toBe(q);
      expect(last.a).toBeLessThan(B);
      expect(steps.every(s=>s.A===A&&s.B===B)).toBe(true);
    }
  });
  it('fixes exact arithmetic counts and remainder paths for 45 / 6', () => {
    const expected={repeated:[0,7,0,7],doubling:[2,6,2,3],fibonacci:[4,6,0,2],quotient:[6,6,2,3]};
    const paths={repeated:[45,39,33,27,21,15,9,3],doubling:[45,21,9,3],fibonacci:[45,15,3],quotient:[45,21,9,3]};
    for(const m of divisionMethods) {
      const t=divisionTrace(45,6,m),s=t.slice(-1)[0];
      expect([s.counts.add,s.counts.subtract,s.counts.half,s.counts.deductions]).toEqual(expected[m]);
      expect(s.remainders).toEqual(paths[m]);
    }
    const probes=divisionTrace(45,6,'doubling').filter(s=>s.event==='probe');
    expect(probes.map(s=>s.condition)).toEqual([true,true,false]);
    expect(probes.map(s=>s.counts.subtract)).toEqual([1,2,3]);
  });
  it('retains Fibonacci candidate growth, recovery and original B', () => {
    const t=divisionTrace(45,6,'fibonacci');
    expect(t.slice(-1)[0].pairs).toEqual([[6,6],[6,12],[12,18],[18,30],[30,48]]);
    expect(t.filter(s=>s.event==='recover').map(s=>s.tmp)).toEqual([18,12,6,6]);
    expect(t.filter(s=>s.event==='backPair').map(s=>[s.b,s.c])).toEqual([[18,30],[12,18],[6,12],[6,6]]);
    expect(t.every(s=>s.B===6)).toBe(true);
    expect(divisionTrace(1000000,1000000,'fibonacci').some(s=>s.c===2000000)).toBe(true);
  });
  it('marks only completed quotient updates as invariant checkpoints', () => {
    const t=divisionTrace(45,6,'quotient');
    expect(t.filter(s=>s.checkpoint).map(s=>[s.n,s.c,s.a])).toEqual([[1,24,21],[2,12,21],[3,12,9],[6,6,9],[7,6,3]]);
    for(const s of t) {
      if(s.invariant==='holds') expect(s.n!*s.c!+s.a).toBe(45);
      if(s.event==='half'||s.line==='deduct') expect(s.invariant).toBe('updating');
    }
  });
  it('records arithmetic only on its executed line and owns each complete snapshot', () => {
    for(const m of divisionMethods) {
      const t=divisionTrace(45,6,m);
      for(let i=1;i<t.length;i++) {
        const s=t[i],p=t[i-1];
        expect(s.counts.add-p.counts.add).toBe(['double','grow','doubleN','incrementN'].includes(s.event)?1:0);
        expect(s.counts.subtract-p.counts.subtract).toBe(['probe','deduct','recover'].includes(s.event)?1:0);
        expect(s.counts.half-p.counts.half).toBe(s.event==='half'?1:0);
        expect(s.counts.deductions-p.counts.deductions).toBe(s.event==='deduct'?1:0);
        if(s.event==='deduct') expect(s.a).toBeLessThan(p.a);
        if(s.event==='half') expect(s.c).toBe(p.c!/2);
        expect(s.counts).not.toBe(p.counts);expect(s.remainders).not.toBe(p.remainders);expect(s.pairs).not.toBe(p.pairs);
      }
      const first=JSON.stringify(t[0]); t.slice(-1)[0].counts.add=999; t.slice(-1)[0].remainders.push(-1);
      expect(JSON.stringify(t[0])).toBe(first);
    }
  });
  it('keeps all 256 repeated subtractions and independently checks a range of results', () => {
    expect(divisionTrace(770,3,'repeated').filter(s=>s.event==='deduct')).toHaveLength(256);
    for(let A=0;A<=300;A++) for(const B of [2,3,6,7,19,1000000]) for(const m of divisionMethods) {
      const s=divisionTrace(A,B,m).slice(-1)[0];expect(s.result).toBe(A%B);
      if(m==='quotient') expect(s.n).toBe(Math.floor(A/B));
    }
  });
});
