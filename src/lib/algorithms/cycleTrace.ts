import { cycleVisualization, parseCycleIntegers, parsePermutation, type CycleInput } from './cycle';
import type { Element } from './reverseTrace';

export const mainExample: CycleInput = {array:[0,1,2,3,4,5], permutation:[1,2,4,5,0,3]};
export type DraftError = {field:'array'|'to'; error:'empty'|'integer'|'capacity'|'permutation'};
export function parseCycleDraft(arrayText:string, toText:string): CycleInput | DraftError {
  if (!arrayText.trim()) return {field:'array',error:'empty'};
  const array = parseCycleIntegers(arrayText);
  if (!array) return {field:'array',error:'integer'};
  if (array.length > 20) return {field:'array',error:'capacity'};
  const permutation = parsePermutation(toText,array.length);
  return permutation ? {array, permutation} : {field:'to',error:'permutation'};
}

// The decomposition is the existing companion walk along to. Only helperLines
// correspond to ch11.h; the book's outer rotate has a rotation-specific driver.
export const decompositionLines = [
  {id:'init',text:'visited = {}; cycles = []'},
  {id:'start_cycle',text:'i = next_unvisited(visited)'},
  {id:'visit',text:'visited.insert(i); cycle.push(i)'},
  {id:'follow',text:'i = to[i]'},
  {id:'complete_cycle',text:'cycles.push(cycle)'},
  {id:'done',text:'return cycles'},
];
export const driverLines = [
  {id:'skip',text:'if (cycle.length == 1) continue;'},
  {id:'call',text:'rotate_cycle_from(cycle[0], from);'},
  {id:'returned',text:'// rotate_cycle_from(...) → void'},
];
export const helperLines = [
  {id:'save',text:'ValueType<I> tmp = *i;'},
  {id:'start',text:'I start = i;'},
  {id:'source',text:'for (I j = from(i); j != start; j = from(j)) {'},
  {id:'write',text:'    *i = *j;'},
  {id:'advance',text:'    i = j;'},
  {id:'close',text:'}\n*i = tmp;'},
];
type Locals = {i:number;start:number|null;j:number|null;tmp:Element};
export interface CycleFrame {
  phase:'decompose'|'move'|'check';
  event:string;
  to:number[]; from:number[]; cells:Element[];
  visited:boolean[]; cycles:number[][]; currentCycle:number[]; position:number|null;
  locals:Locals|null; copies:number; writes:number;
}

export function traceCycles(input:CycleInput): CycleFrame[] {
  if (!cycleVisualization.validateInput(input).valid) throw new RangeError('Invalid cycle input');
  const {array,permutation:to}=input;
  const from:number[]=[];
  to.forEach((dest,source)=>{ from[dest]=source; });
  const frame:CycleFrame={
    phase:'decompose',event:'init',to,from,cells:array.map((value,origin)=>({value,origin})),
    visited:[],cycles:[],currentCycle:[],position:null,locals:null,copies:0,writes:0,
  };
  const frames:CycleFrame[]=[];
  function record(event:string) {
    frame.event=event;
    frames.push(structuredClone(frame));
  }
  for (const {state,operation} of cycleVisualization.generateSteps(input)) {
    frame.visited=state.visited;
    frame.currentCycle=state.currentCycle;
    frame.position=state.currentPosition;
    frame.cycles=state.cycles.map(c=>c.positions);
    record(operation);
  }

  frame.phase='move';
  for (const cycle of frame.cycles) {
    frame.currentCycle=cycle;
    frame.position=cycle[0];
    if (cycle.length===1) {record('skip');continue;}
    record('call');
    const local:Locals={i:cycle[0],start:null,j:null,tmp:{...frame.cells[cycle[0]]}};
    frame.locals=local;
    frame.copies++;
    record('save');
    local.start=local.i;
    record('start');
    local.j=from[local.i];
    for (;;) {
      record('source');
      if (local.j===local.start) break;
      frame.cells[local.i]={...frame.cells[local.j]};
      frame.writes++;
      record('write');
      local.i=local.j;
      record('advance');
      local.j=from[local.j];
    }
    // The for-loop variable j is out of scope at the closing assignment.
    local.j=null;
    frame.cells[local.i]={...local.tmp};
    frame.writes++;
    record('close');
    frame.locals=null;
    record('returned');
  }
  frame.phase='check';
  frame.currentCycle=[];
  frame.position=null;
  record('verify');
  return frames;
}
