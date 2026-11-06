import {expect,it} from 'vitest';
import {group,orbit,leftCoset} from './finiteGroup';

const powers=[[1],[2,4,1],[3,2,6,4,5,1],[4,2,1],[5,4,6,2,3,1],[6,1]];
const products=[[1,2,4],[2,4,1],[3,6,5],[4,1,2],[5,3,6],[6,5,3]];
it('returns all positive powers to the first identity and the generated subgroups',()=>{
  const orbits=group.map(orbit);
  expect(orbits.map(x=>x.powers)).toEqual(powers);
  expect(orbits.map(x=>x.order)).toEqual([1,3,6,3,6,2]);
  expect(orbits.map(x=>x.members)).toEqual([[1],[1,2,4],[1,2,3,4,5,6],[1,2,4],[1,2,3,4,5,6],[1,6]]);
  expect(group.filter(a=>orbit(a).order===6)).toEqual([3,5]);
});
it('keeps multiplication order distinct from membership for all representatives',()=>{
  const cosets=group.map(leftCoset);
  expect(cosets.map(c=>c.products)).toEqual(products);
  const H=[1,2,4], other=[3,5,6];
  expect(cosets.map(c=>c.members)).toEqual([H,H,other,H,other,other]);
  expect(H.filter(x=>other.includes(x))).toEqual([]);
  expect([...H,...other].sort((a,b)=>a-b)).toEqual(group);
});
