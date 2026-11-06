import { describe,it,expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { bookCatalog,bookResources,chapterExercises,searchBook,sectionAnchor,exerciseAnchor,conceptLessons } from './bookCatalog';
import { translations } from '../i18n/translations';

describe('book directory and bilingual contract',()=>{
  it('indexes the chapter 6 terms and separates section and exercise identifiers',()=>{
    for(const [term,id] of [
      ['元素阶','6.3'],['order of an element','6.3'],['循环群','6.4'],['generator','6.4'],
      ['子群','6.4'],['subgroup','6.4'],['陪集','6.5'],['coset','6.5'],
      ['拉格朗日定理','6.5'],["Lagrange's theorem",'6.5'],['Lagrange’s theorem','6.5']
    ]) expect(searchBook(term).flatMap(c=>c.sections.map(s=>s.id)),term).toContain(id);
    for(const [id,sectionQuery,exerciseQuery] of [
      ['6.4','第6.4节','习题6.4'],['6.5','Section 6.5','Exercise 6.5']
    ]) {
      const section=searchBook(sectionQuery), exercise=searchBook(exerciseQuery);
      expect(section.flatMap(c=>c.sections.map(s=>s.id))).toEqual([id]);
      expect(section.flatMap(c=>c.exercises)).toEqual([]);
      expect(exercise.flatMap(c=>c.exercises.map(e=>e.id))).toEqual([id]);
      expect(exercise.flatMap(c=>c.sections)).toEqual([]);
    }
  });
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
  it('indexes the authored type and C++ reading sections in both languages',()=>{
    for (const [query,section] of [
      ['01000001','10.2'],['value type','10.2'],['复杂度','10.3'],['complexity','10.3'],
      ['模板推导','C.1'],['type deduction','C.1'],['requires','C.2'],['same_as','C.2'],
      ['op(r,a)','C.4'],['function object','C.4'],['my_ratio','C.5'],['前置条件','C.5']
    ]) expect(searchBook(query).flatMap(c=>c.sections).map(s=>s.id),query).toContain(section);
    for (const [query,section] of [['第10.2节','10.2'],['Section C.2','C.2'],['section c.5','C.5'],['section c.7','C.7']]) {
      const results=searchBook(query);
      expect(results.flatMap(c=>c.sections).map(s=>s.id),query).toEqual([section]);
      expect(results.flatMap(c=>c.exercises),query).toEqual([]);
    }
  });
});
