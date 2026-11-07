export type RingId = 'z6' | 'z5';
export interface ResidueRing {
  id: RingId;
  modulus: 6 | 5;
  elements: readonly number[];
  zero: 0;
  one: 1;
}
// Both models are commutative rings. A general ring need not have commutative multiplication.
export const rings: Record<RingId, ResidueRing> = {
  z6: {id:'z6',modulus:6,elements:[0,1,2,3,4,5],zero:0,one:1},
  z5: {id:'z5',modulus:5,elements:[0,1,2,3,4],zero:0,one:1},
};
export const add = (ring:ResidueRing,a:number,b:number) => (a+b)%ring.modulus;
export const multiply = (ring:ResidueRing,a:number,b:number) => (a*b)%ring.modulus;

export function inspectElement(ring:ResidueRing,a:number) {
  if (!ring.elements.includes(a)) throw new RangeError('Element outside the fixed ring');
  const row=ring.elements.map(b=>multiply(ring,a,b));
  const additiveInverse=ring.elements.find(b=>add(ring,a,b)===ring.zero)!;
  const multiplicativeInverse=ring.elements.find(b=>multiply(ring,a,b)===ring.one && multiply(ring,b,a)===ring.one) ?? null;
  const partners=ring.elements.filter(b=>b!==ring.zero && multiply(ring,a,b)===ring.zero);
  return {row,additiveInverse,multiplicativeInverse,partners,
    isUnit:multiplicativeInverse!==null,
    isZeroDivisor:a!==ring.zero && partners.length>0};
}
