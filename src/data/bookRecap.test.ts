import { expect, it } from 'vitest';
import { recapTopics } from './bookRecap';
import { bookCatalog } from './bookCatalog';
import { lessonSearchCatalog } from './algorithmCatalog';
import { reverseTrace } from '../lib/algorithms/reverseTrace';
import { divisionTrace } from '../lib/algorithms/divisionTrace';
it('uses three ordinary topic anchors, six bilingual explanations and real catalog resources',()=>{
 expect(recapTopics.map(t=>t.id)).toEqual(['review-power','review-gcd','review-iterators']);
 expect(bookCatalog.find(c=>c.id==='14')?.title.zh).toBe('全书总结');
 expect(bookCatalog.find(c=>c.id==='14')?.sections).toEqual([]);
 for(const t of recapTopics){expect(t.questions).toHaveLength(2);for(const q of t.questions){for(const pair of [q.question,...q.explanation,t.title,t.summary]){expect(pair.zh.trim()).not.toBe('');expect(pair.en.trim()).not.toBe('');expect(pair.en).not.toMatch(/[\u3400-\u9fff]/);expect(pair.zh+pair.en).not.toMatch(/第\s*\d+\s*页|PDF page|#page=/i);}
 for(const section of q.sections)expect(bookCatalog.some(c=>c.sections.some(s=>s.id===section))).toBe(true);
 for(const path of q.demos)expect(lessonSearchCatalog.some(l=>l.path===path)).toBe(true);}
 for(const path of t.demos)expect(lessonSearchCatalog.some(l=>l.path===path)).toBe(true);}
});
it('locks the recap’s actual reverse counts and shared quotient/remainder result',()=>{
 const input=Array.from({length:9},(_,i)=>i),a=reverseTrace(input,1,'adaptive'),b=reverseTrace(input,2,'adaptive');
 expect(a[a.length-1].counts).toEqual({swaps:12,bufferWrites:0,sourceWrites:0,transfers:36,maxDepth:4,bufferPeak:0});
 expect(b[b.length-1].counts).toEqual({swaps:8,bufferWrites:8,sourceWrites:8,transfers:40,maxDepth:3,bufferPeak:2});
 const q=divisionTrace(45,6,'quotient');expect(q[q.length-1]).toMatchObject({n:7,result:3});
 const copy=JSON.stringify(recapTopics);for(const token of ['36','40','45','7','3','A = BQ + R'])expect(copy).toContain(token);
});
it('states sufficient algebraic requirements without assuming commutativity or a degree for zero',()=>{
 const text=recapTopics.flatMap(t=>t.questions.flatMap(q=>q.explanation.map(p=>p.en))).join(' ');
 expect(text).toMatch(/associative/);expect(text).toMatch(/identity/);expect(text).toMatch(/closure/i);expect(text).toMatch(/does not require commutativity/);expect(text).toMatch(/zero polynomial has no ordinary degree/);
});
it('matches the narrated root swaps and completed quotient checkpoints',()=>{
 const t=reverseTrace(Array.from({length:9},(_,i)=>i),0,'recursive');
 const root=t.find(s=>s.event==='swapCall'&&s.frames.length===1)!;
 expect(root.frames[0]).toMatchObject({f:0,n:9,h:4,m:5,l:9});expect(root.sequence.map(e=>e.value)).toEqual([3,2,1,0,4,8,7,6,5]);
 expect(t.filter(s=>s.event==='swap'&&s.frames.length===1).map(s=>s.pair)).toEqual([[0,5],[1,6],[2,7],[3,8]]);
 const q=divisionTrace(45,6,'quotient');expect(q.filter(s=>s.checkpoint).map(s=>[s.n,s.c,s.a])).toEqual([[1,24,21],[2,12,21],[3,12,9],[6,6,9],[7,6,3]]);
 expect(JSON.stringify(recapTopics)).toContain('[3,2,1,0,4,8,7,6,5]');
});
