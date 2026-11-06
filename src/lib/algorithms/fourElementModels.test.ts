import {expect,it} from 'vitest';
import {z4,u5,u8,table,properties,images,compare,matchCount} from './fourElementModels';

// Independent expected tables and images in the specified element order.
const addition=[[0,1,2,3],[1,2,3,0],[2,3,0,1],[3,0,1,2]];
const product5=[[1,2,3,4],[2,4,1,3],[3,1,4,2],[4,3,2,1]];
const product8=[[1,3,5,7],[3,1,7,5],[5,7,1,3],[7,5,3,1]];
it('computes the three complete operation tables and their properties',()=>{
  expect(table(z4)).toEqual(addition);
  expect(table(u5)).toEqual(product5);
  expect(table(u8)).toEqual(product8);
  expect(properties(z4)).toEqual({orders:[1,4,2,4],self:[0,2,0,2],generators:[1,3]});
  expect(properties(u5)).toEqual({orders:[1,4,4,2],self:[1,4,4,1],generators:[2,3]});
  expect(properties(u8)).toEqual({orders:[1,2,2,2],self:[1,1,1,1],generators:[]});
});
it.each([
  ['f2',[1,2,4,3],[0,1,3,2]],
  ['f3',[1,3,4,2],[0,3,1,2]],
] as const)('checks both directions and both compositions for %s',(preset,mapping,inverse)=>{
  const f=images(preset);
  expect(f).toEqual(mapping);
  const inv=[1,2,3,4].map(t=>f.indexOf(t));
  expect(inv).toEqual(inverse);
  for(let x=0;x<4;x++){
    expect(inv[f[x]-1]).toBe(x);
    expect(f[inv[x]]).toBe(x+1);
    for(let y=0;y<4;y++){
      const path=compare(f,x,y);
      expect(path.left).toBe(mapping[addition[x][y]]);
      expect(path.right).toBe(product5[mapping[x]-1][mapping[y]-1]);
      expect(path.left).toBe(path.right);
      expect(inv[product5[x][y]-1]).toBe(addition[inv[x]][inv[y]]);
    }
  }
  expect(matchCount(f)).toBe(16);
});
it('finds exactly two isomorphisms among all 24 bijections using independent tables',()=>{
  const all:number[][]=[];
  function enumerate(prefix:number[],remaining:number[]){
    if(!remaining.length){all.push(prefix);return;}
    for(const v of remaining)enumerate([...prefix,v],remaining.filter(w=>w!==v));
  }
  enumerate([],[1,2,3,4]);expect(all).toHaveLength(24);
  const valid=all.filter(f=>addition.every((row,x)=>row.every((sum,y)=>f[sum]===product5[f[x]-1][f[y]-1])));
  expect(valid).toEqual([[1,2,4,3],[1,3,4,2]]);
  expect(all.filter(f=>matchCount(f)===16)).toEqual(valid);
});
it('distinguishes one failing pair and a valid zero operand from the global check',()=>{
  expect(images('b')).toEqual([1,2,3,4]);
  expect(compare(images('b'),1,1)).toEqual({sum:2,fx:2,fy:2,left:3,right:4});
  expect(matchCount(images('b'))).toBe(9);
  expect(compare(images('f3'),0,3)).toEqual({sum:3,fx:1,fy:2,left:2,right:2});
});
