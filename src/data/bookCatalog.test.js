import { describe,it,expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { bookCatalog,bookResources,chapterExercises,searchBook,sectionAnchor,exerciseAnchor,conceptLessons } from './bookCatalog';
import { translations } from '../i18n/translations';

describe('book directory and bilingual contract',()=>{
  it('covers fourteen chapters and three appendices with unique anchors and bilingual guides',()=>{
    expect(bookCatalog).toHaveLength(17);
    const ids=bookCatalog.flatMap(c=>c.sections.map(s=>sectionAnchor(s.id))).concat(chapterExercises.map(e=>exerciseAnchor(e.id)));
    expect(new Set(ids).size).toBe(ids.length);
    bookCatalog.forEach(c=>{expect(c.title.en).toBeTruthy();expect(c.guide.zh).toBeTruthy();expect(c.guide.en).toBeTruthy();expect(c.sourcePdfPage).toBeGreaterThan(0);});
    conceptLessons.forEach(l=>l.sections.forEach(id=>expect(bookCatalog.some(c=>c.sections.some(s=>s.id===id))).toBe(true)));
  });
  it('resolves physical resources, including real PDFs, and code lines',()=>{
    const resources=[...bookResources,...chapterExercises.flatMap(e=>e.resources)];
    resources.forEach(r=>{expect(existsSync(r.path),r.path).toBe(true);if(r.path.endsWith('.pdf'))expect(readFileSync(r.path).subarray(0,4).toString()).toBe('%PDF');});
    bookResources.forEach(r=>r.functions?.forEach(f=>expect(readFileSync(r.path,'utf8').split(/\r?\n/)[f.line-1]).toContain(f.name)));
  });
  it('distinguishes sections from exercises and accepts aliases',()=>{
    for(const q of ['10.8','二叉查找','二分查找','binary search'])expect(searchBook(q).some(c=>c.sections.some(s=>s.id==='10.8'))).toBe(true);
    expect(searchBook('第9.2节').flatMap(c=>c.sections).map(s=>s.id)).toEqual(['9.2']);
    expect(searchBook('第9.2节').flatMap(c=>c.exercises)).toHaveLength(0);
    expect(searchBook('习题9.2').flatMap(c=>c.exercises).map(e=>e.id)).toEqual(['9.2']);
    expect(searchBook('习题9.2').flatMap(c=>c.sections)).toHaveLength(0);
  });
  it('has matching, nonempty translation keys in both languages',()=>{
    expect(Object.keys(translations.en).sort()).toEqual(Object.keys(translations.zh).sort());
    Object.values(translations).forEach(dict=>Object.values(dict).forEach(v=>expect(v.trim()).not.toBe('')));
  });
});
