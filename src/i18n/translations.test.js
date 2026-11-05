import { it,expect } from 'vitest';
import { readFileSync,readdirSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { translations } from './translations';

it('resolves every static translation reference in page components in both languages',()=>{
  const issues=[];
  const walk=dir=>readdirSync(dir,{withFileTypes:true}).forEach(entry=>{
    const path=join(dir,entry.name);if(entry.isDirectory())return walk(path);
    if(!path.endsWith('.tsx')||path.includes('.test.'))return;
    const text=readFileSync(path,'utf8');if(!text.includes('translations'))return;
    const file=ts.createSourceFile(path,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    const visit=node=>{
      if(ts.isPropertyAccessExpression(node)&&node.expression.getText(file)==='t'){
        for(const lang of ['en','zh'])if(!translations[lang][node.name.text])issues.push(`${path}: ${lang}.${node.name.text}`);
      }
      ts.forEachChild(node,visit);
    };visit(file);
  });walk('src/components');walk('src/pages');
  expect(issues).toEqual([]);
});
