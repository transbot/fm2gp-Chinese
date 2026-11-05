import rawSource from '../../../配套代码(fm2gpcode)/ch04.h?raw';
import { expect, it } from 'vitest';
import { divisionCode } from './divisionPresentation';
const source=rawSource.replace(/\/\/[^\n]*/g,'');
const normalized=(s:string)=>s.replace(/\s+/g,'');
it.each([['largest_doubling','largest_doubling'],['doubling','remainder'],['fibonacci','remainder_fibonacci'],['quotient','quotient_remainder']] as const)('preserves the actual %s source statements', (key,name)=>{
  const start=source.search(new RegExp('\\b'+name+'\\(line_segment')),brace=source.indexOf('{',start);let depth=1,end=brace+1;
  while(depth) { if(source[end]==='{') depth++; if(source[end]==='}') depth--; end++; }
  const shown=divisionCode[key].map(l=>l.text).join('\n');
  expect(normalized(shown.slice(shown.indexOf(name+'(')))).toBe(normalized(source.slice(start,end)));
});
