import { describe, expect, it } from 'vitest';
import { traceCycles, mainExample, parseCycleDraft } from './cycleTrace';

function* permutations(values: number[]): Generator<number[]> {
  if (!values.length) yield [];
  for (const first of values) {
    for (const tail of permutations(values.filter(x => x !== first))) yield [first,...tail];
  }
}
describe('source-directed cycle transfers', () => {
  it('takes exactly eight transfers with the fixed intermediate physical states', () => {
    const frames = traceCycles(mainExample);
    const moving = frames.filter(f => ['save','write','close'].includes(f.event));
    expect(moving.map(f=>f.cells.map(c=>c.origin).join(''))).toEqual([
      '012345','412345','412325','411325','401325','401325','401525','401523']);
    expect(moving.map(f=>[f.copies,f.writes])).toEqual([[1,0],[1,1],[1,2],[1,3],[1,4],[2,4],[2,5],[2,6]]);
    expect(moving.filter(f=>f.event==='save').map(f=>f.locals?.i)).toEqual([0,3]);
    expect(frames[frames.length-1].from).toEqual([4,0,1,5,2,3]);
    expect(frames[frames.length-1].cycles).toEqual([[0,1,2,4],[3,5]]);
  });
  it('checks every destination of all 873 permutations independently',()=>{
    let checked=0;
    for(let n=1;n<=6;n++) for(const to of permutations(Array.from({length:n},(_,i)=>i))) {
      const array=to.map(i=>i%2);
      const frames=traceCycles({array,permutation:to});
      for(const frame of frames) {
        expect(frame.cells).toHaveLength(n);
        // A physical copy may repeat origins; each value must still match its label.
        expect(frame.cells.every(cell=>Number.isSafeInteger(cell.origin)&&cell.origin>=0&&cell.origin<n&&cell.value===array[cell.origin])).toBe(true);
        if(frame.locals)expect(frame.locals.tmp.value).toBe(array[frame.locals.tmp.origin]);
      }
      const end=frames[frames.length-1];
      const origins:number[]=[];
      to.forEach((d,i)=>{ origins[d]=i; });
      expect(end.cells).toEqual(origins.map(origin=>({origin,value:array[origin]})));
      // Count one orbit at its least index, independently of the trace.
      const v=to.filter((d,i)=>{if(d===i)return false; while(d>i)d=to[d];return d===i;}).length;
      expect([end.copies,end.writes]).toEqual([v,to.filter((d,i)=>d!==i).length]);
      checked++;
    }
    expect(checked).toBe(873);
  });
  it.each([
    [[1,3,0,2],[2,0,3,1],5], [[2,3,4,5,0,1],[4,5,0,1,2,3],8],
    [[0,2,1,3],[0,2,1,3],3],[[0],[0],0]
  ] as [number[],number[],number][])('matches fixed to=%j', (to,expected,total)=>{
    const end=traceCycles({array:to.map(()=>1),permutation:to}).slice(-1)[0];
    expect(end.cells.map(c=>c.origin)).toEqual(expected);
    expect(end.copies+end.writes).toBe(total);
  });
  it('moves both equal ones in the second cycle',()=>{
    const frames=traceCycles({...mainExample,array:[2,1,2,1,2,1]});
    expect(frames[frames.length-1].cells.map(c=>c.value)).toEqual([2,2,1,1,2,1]);
    expect(frames.filter(f=>f.locals?.start===3 && ['write','close'].includes(f.event)).map(f=>f.cells.map(c=>c.origin))).toEqual([[4,0,1,5,2,5],[4,0,1,5,2,3]]);
  });
  it('keeps snapshots independent and expires helper locals in source order',()=>{
    const frames=traceCycles(mainExample);
    const middle=frames.find(f=>f.event==='write' && f.locals?.i===4)!;
    expect(middle.locals).toEqual({i:4,j:2,start:0,tmp:{origin:0,value:0}});
    for(const frame of frames.filter(f=>f.event==='close')) expect(frame.locals?.j).toBeNull();
    for(const frame of frames.filter(f=>f.event==='returned')) expect(frame.locals).toBeNull();
    const end=frames[frames.length-1];
    end.cells[0].origin=99;end.to[0]=99;end.cycles[0][0]=99;
    expect([middle.cells[0].origin,middle.to[0],middle.cycles[0][0]]).toEqual([4,1,0]);
  });
  it('keeps a full length-20 cycle even with identical values',()=>{
    const to=Array.from({length:20},(_,i)=>(i+1)%20);
    const frames=traceCycles({array:to.map(()=>0),permutation:to});
    const end=frames[frames.length-1];
    expect([end.copies,end.writes]).toEqual([1,20]);
    expect(end.cells.map(c=>c.origin)).toEqual([19,...to.slice(0,19).map(v=>v-1)]);
  });
});
describe('cycle drafts',()=>{
  it.each(['','1,,2','1, ,2',',1','1,','1.5','1x','1e2','9007199254740992',Array(21).fill(0).join(',')])('rejects %s',s=>{
    expect(parseCycleDraft(s,'0')).toHaveProperty('field','array');
  });
  it.each(['0','0,0','0,-1','0,2','0,1.1','0,1x','0,,1'])('rejects destination %s',s=>{
    expect(parseCycleDraft('1,1',s)).toHaveProperty('field','to');
  });
  it('preserves negatives, boundaries and mixed separators',()=>{
    expect(parseCycleDraft('-9007199254740991，0 9007199254740991','2 0，1')).toEqual({array:[-9007199254740991,0,9007199254740991],permutation:[2,0,1]});
    const twenty=Array.from({length:20},(_,i)=>i).join(',');
    expect(parseCycleDraft(twenty,twenty)).toHaveProperty('array.length',20);
  });
});
