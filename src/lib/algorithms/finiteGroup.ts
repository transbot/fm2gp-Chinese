// Nonzero residues form a group under multiplication modulo the prime 7.
export const group = [1, 2, 3, 4, 5, 6] as const;
export type Residue = typeof group[number];
const multiply = (a:number,b:number) => (a*b)%7;
const sorted = (values:number[]) => [...values].sort((a,b)=>a-b);

export function orbit(element:Residue) {
  const powers:number[] = [];
  let value = 1;
  for (let k=1; k<=group.length; k++) {
    value = multiply(value, element);
    powers.push(value);
    if (value===1) return {powers, order:k, members:sorted(powers)};
  }
  throw new Error('Nonzero residue did not return to the identity modulo 7');
}

export const fixedSubgroup = orbit(2).members;
export function leftCoset(representative:Residue) {
  const products = fixedSubgroup.map(h=>multiply(representative,h));
  return {products, members:sorted(products)};
}
