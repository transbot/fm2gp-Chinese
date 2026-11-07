import {describe,expect,it} from 'vitest';
import {rings,add,multiply,inspectElement} from './residueRing';

// Independent literal fixtures, indexed by the representative 0,1,... .
const fixtures = {
  z6: {
    sums:[[0,1,2,3,4,5],[1,2,3,4,5,0],[2,3,4,5,0,1],[3,4,5,0,1,2],[4,5,0,1,2,3],[5,0,1,2,3,4]],
    products:[[0,0,0,0,0,0],[0,1,2,3,4,5],[0,2,4,0,2,4],[0,3,0,3,0,3],[0,4,2,0,4,2],[0,5,4,3,2,1]],
    negatives:[0,5,4,3,2,1],inverses:[null,1,null,null,null,5],
    partners:[[1,2,3,4,5],[],[3],[2,4],[3],[]],units:[1,5],zeroDivisors:[2,3,4],
  },
  z5: {
    sums:[[0,1,2,3,4],[1,2,3,4,0],[2,3,4,0,1],[3,4,0,1,2],[4,0,1,2,3]],
    products:[[0,0,0,0,0],[0,1,2,3,4],[0,2,4,1,3],[0,3,1,4,2],[0,4,3,2,1]],
    negatives:[0,4,3,2,1],inverses:[null,1,3,2,4],
    partners:[[1,2,3,4],[],[],[],[]],units:[1,2,3,4],zeroDivisors:[],
  },
};
describe.each(['z6','z5'] as const)('%s is a fixed commutative ring',id=>{
  const ring=rings[id],f=fixtures[id];
  it('matches both independent operation tables and every derived result',()=>{
    expect(ring.zero).toBe(0);expect(ring.one).toBe(1);expect(ring.zero).not.toBe(ring.one);
    expect(ring.elements.map(a=>ring.elements.map(b=>add(ring,a,b)))).toEqual(f.sums);
    expect(ring.elements.map(a=>ring.elements.map(b=>multiply(ring,a,b)))).toEqual(f.products);
    const values=ring.elements.map(a=>inspectElement(ring,a));
    expect(values.map(v=>v.row)).toEqual(f.products);
    expect(values.map(v=>v.additiveInverse)).toEqual(f.negatives);
    expect(values.map(v=>v.multiplicativeInverse)).toEqual(f.inverses);
    expect(values.map(v=>v.partners)).toEqual(f.partners);
    expect(ring.elements.filter(a=>values[a].isUnit)).toEqual(f.units);
    expect(ring.elements.filter(a=>values[a].isZeroDivisor)).toEqual(f.zeroDivisors);
    expect(values[0]).toMatchObject({isUnit:false,isZeroDivisor:false,additiveInverse:0,multiplicativeInverse:null});
  });
  it('checks closure, identities, inverses, both associative and distributive laws',()=>{
    for(const a of ring.elements) {
      expect(add(ring,a,0)).toBe(a);expect(add(ring,0,a)).toBe(a);
      expect(multiply(ring,a,1)).toBe(a);expect(multiply(ring,1,a)).toBe(a);
      expect(multiply(ring,a,0)).toBe(0);expect(multiply(ring,0,a)).toBe(0);
      const state=inspectElement(ring,a);
      expect(add(ring,a,state.additiveInverse)).toBe(0);
      if(state.multiplicativeInverse!==null) {
        expect(multiply(ring,a,state.multiplicativeInverse)).toBe(1);
        expect(multiply(ring,state.multiplicativeInverse,a)).toBe(1);
      }
      for(const b of ring.elements) {
        expect(ring.elements).toContain(add(ring,a,b));expect(ring.elements).toContain(multiply(ring,a,b));
        expect(add(ring,a,b)).toBe(add(ring,b,a));expect(multiply(ring,a,b)).toBe(multiply(ring,b,a));
        for(const c of ring.elements) {
          expect(add(ring,add(ring,a,b),c)).toBe(add(ring,a,add(ring,b,c)));
          expect(multiply(ring,multiply(ring,a,b),c)).toBe(multiply(ring,a,multiply(ring,b,c)));
          expect(multiply(ring,a,add(ring,b,c))).toBe(add(ring,multiply(ring,a,b),multiply(ring,a,c)));
          expect(multiply(ring,add(ring,a,b),c)).toBe(add(ring,multiply(ring,a,c),multiply(ring,b,c)));
        }
      }
    }
  });
});
