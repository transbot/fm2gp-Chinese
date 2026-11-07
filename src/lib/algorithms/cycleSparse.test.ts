import {expect,it} from 'vitest';
import {cycleVisualization} from './cycle';
import {traceCycles,mainExample} from './cycleTrace';

const sparseCases=[
  {name:'all holes',make:()=>Array<number>(2),to:[1,0],holes:[0,1]},
  // Keep the native missing slot: no JSON, spread or Array.from conversion.
  // eslint-disable-next-line no-sparse-arrays
  {name:'one hole',make:()=>[10,,30] as number[],to:[1,2,0],holes:[1]},
];
for(const fixture of sparseCases){
  it('rejects '+fixture.name+' at the validation boundary',()=>{
    const array=fixture.make();
    for(const index of fixture.holes)expect(index in array).toBe(false);
    expect(cycleVisualization.validateInput({array,permutation:fixture.to})).toEqual({valid:false,errorKey:'cycleInvalidInteger'});
    for(const index of fixture.holes)expect(index in array).toBe(false);
  });
  it('rejects '+fixture.name+' at the trace boundary',()=>{
    const array=fixture.make();
    for(const index of fixture.holes)expect(index in array).toBe(false);
    expect(()=>traceCycles({array,permutation:fixture.to})).toThrow(RangeError);
  });
}
it('preserves dense safe values and their original labels in every snapshot',()=>{
  const array=[0,-1,7,7,Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER];
  const input={array,permutation:mainExample.permutation};
  expect(cycleVisualization.validateInput(input)).toEqual({valid:true});
  const frames=traceCycles(input);
  for(const frame of frames){
    expect(frame.cells).toHaveLength(array.length);
    for(const cell of [...frame.cells,...(frame.locals?[frame.locals.tmp]:[])]){
      expect(Number.isSafeInteger(cell.origin)).toBe(true);
      expect(cell.origin>=0&&cell.origin<array.length).toBe(true);
      expect(cell.value).toBe(array[cell.origin]);
    }
  }
  const middle=frames.find(f=>f.event==='write'&&f.locals?.i===4)!;
  // Copying can duplicate a source label until the saved value closes the cycle.
  expect(middle.cells.map(c=>c.origin)).toEqual([4,1,2,3,2,5]);
  expect(new Set(middle.cells.map(c=>c.origin)).size).toBe(5);
  expect(frames[frames.length-1].cells).toEqual([4,0,1,5,2,3].map(origin=>({origin,value:array[origin]})));
});
