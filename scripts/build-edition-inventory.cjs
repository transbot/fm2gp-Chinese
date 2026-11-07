// Read the actual TypeScript catalogs without starting the React application.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const assert = require('node:assert/strict');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { algorithmCatalog } = require('../src/data/algorithmCatalog.ts');
const { conceptLessons } = require('../src/data/conceptLessons.ts');
const { translations } = require('../src/i18n/translations.ts');
const { bookCatalog, chapterExercises, bookResources, sectionAlgorithms } = require('../src/data/bookCatalog.ts');
const out = 'docs/verification/edition-closeout';
fs.mkdirSync(out, { recursive: true });
const readerText = fs.readFileSync('src/components/book/sectionReaders.ts', 'utf8');
const readers = Object.fromEntries([...readerText.matchAll(/'([\dABC]+\.\d+)': (\w+)/g)].map(m => [m[1], m[2]]));
const demos = [...new Set([...algorithmCatalog, ...conceptLessons].map(a => a.path))].map(route => {
  const a = algorithmCatalog.find(a => a.path === route), c = conceptLessons.find(a => a.path === route);
  return { path: route, title: c?.title || {zh: translations.zh[a.titleKey], en: translations.en[a.titleKey]}, source: a?.source || {type: 'book'}, sections: [...new Set([...(c?.sections || []), ...bookCatalog.flatMap(ch => ch.sections.filter(s => sectionAlgorithms(s.id).some(a => a.path === route)).map(s => s.id))])], summary: c?.summary || a.summary };
});
const app = fs.readFileSync('src/App.tsx', 'utf8');
const explicitRoutes=[...app.matchAll(/<Route path="([^"]+)"/g)].map(m=>m[1]).filter(p=>!['/','/book','/book/:chapterId','*'].includes(p));
const catalogRoutes=[...app.matchAll(/<Route path=\{getAlgorithmPath\('([^']+)'\)/g)].map(m=>{const a=algorithmCatalog.find(a=>a.id===m[1]);assert.ok(a,m[1]);return a.path;});
assert.deepEqual([...new Set([...explicitRoutes,...catalogRoutes])].sort(),demos.map(d=>d.path).sort(),'All application demo routes must be inventoried');
for (const d of demos) {
  const a = algorithmCatalog.find(a => a.path === d.path);
  assert.ok(app.includes(`path="${d.path}"`) || (a && app.includes(`getAlgorithmPath('${a.id}')`)), `Route missing: ${d.path}`);
}
const specialExercises = {'4.6':'/division','7.1':'/fibonacci','8.3':'/polynomial-gcd','8.6':'/book/8#zero-divisor-not-unit','8.7':'/concepts/matrices','11.13':'/reverse'};
const chapters = bookCatalog.map(ch => ({id:ch.id,title:ch.title, path:`/book/${ch.id}`, recap: ch.id === '14', sections:ch.sections.map(s=>({id:s.id,title:s.title,anchor:`section-${s.id.replaceAll('.','-')}`,reader:readers[s.id]||null,demos:demos.filter(d=>d.sections.includes(s.id)).map(d=>d.path)})), exercises:chapterExercises.filter(e=>e.id.split('.')[0]===ch.id).map(e=>({id:e.id,anchor:`exercise-${e.id.replaceAll('.','-')}`,resources:e.resources,links:[...new Set([...algorithmCatalog.filter(a=>a.source.type==='exercise'&&a.source.section===e.id).map(a=>a.path),...(specialExercises[e.id]?[specialExercises[e.id]]:[])])]})), resources:bookResources.filter(r=>r.chapter===ch.id).map(r=>({path:r.path,kind:r.kind,functions:'functions' in r?r.functions:undefined}))}));
const resourcePaths = [...new Set([...bookResources.map(r=>r.path),...chapterExercises.flatMap(e=>e.resources.map(r=>typeof r==='string'?r:r.path))])];
const resources = resourcePaths.map(p=>{assert.ok(fs.existsSync(p),`Missing resource: ${p}`);const b=fs.readFileSync(p);assert.ok(b.length);if(p.endsWith('.pdf'))assert.equal(b.subarray(0,5).toString(),'%PDF-');return {path:p,bytes:b.length,sha256:require('node:crypto').createHash('sha256').update(b).digest('hex')};});
const trackedResources=require('node:child_process').execFileSync('git',['-c','core.quotepath=false','ls-files','-z','solutions','配套代码(fm2gpcode)','课件(Course Materials)','参考文档(References)'],{encoding:'utf8'}).split('\0').filter(Boolean);
const unindexedResources=trackedResources.filter(p=>!resourcePaths.includes(p)).map(p=>({path:p,bytes:fs.statSync(p).size,sha256:require('node:crypto').createHash('sha256').update(fs.readFileSync(p)).digest('hex')}));
const inventory = {baseline:'f19725917d9fa24c8f33b2e9c288e48da3338392',counts:{chapters:chapters.filter(c=>/^\d+$/.test(c.id)).length,appendices:chapters.filter(c=>/^[ABC]$/.test(c.id)).length,sections:chapters.reduce((n,c)=>n+c.sections.length,0),exercises:chapterExercises.length,authoredSectionReaders:Object.keys(readers).length,recapThemes:3,demos:demos.length,entries:2+chapters.length+demos.length,resources:resources.length},routes:['/','/book',...chapters.map(c=>c.path),...demos.map(d=>d.path)],demos,chapters,resources};
inventory.unindexedResources=unindexedResources;
inventory.counts.trackedResourceFiles=trackedResources.length;
inventory.resourceHashEncoding='SHA-256 of working-tree bytes (text may have Windows CRLF); source-manifest.json separately hashes staged Git blobs.';
fs.writeFileSync(`${out}/entry-inventory.json`,JSON.stringify(inventory,null,2)+'\n');
const url = p => `https://fm2gp-chinese.bookzhou.com${p}`;
const link = p => `[${p}](${url(p)})`;
let md=`# 本版覆盖清单 / Edition coverage\n\n基线：\`${inventory.baseline}\`。此清单由实际路由、algorithmCatalog、conceptLessons、sectionReaders、bookContent 和存在的资源文件生成；生成命令：\`node scripts/build-edition-inventory.cjs\`。本版收尾是评审版本，尚不等于正式域名已发布。\n\n目录可访问 **14 章、3 个附录、${inventory.counts.sections} 个节锚点、${inventory.counts.exercises} 个习题锚点**；按路径去重有 **${demos.length} 个演示**。**${Object.keys(readers).length} 节有专门章内正文**，另有第14章三个回顾主题。目录完整不代表每节都有专门正文、演示或完整习题解答。\n\nThe directory contains 14 chapters, 3 appendices, ${inventory.counts.sections} section anchors and ${inventory.counts.exercises} exercise anchors. There are ${demos.length} unique demo routes, ${Object.keys(readers).length} authored section readers, and three Chapter 14 recap themes. Directory coverage is not a claim of complete interactive or exercise-solution coverage.\n\n## 标记 / Legend\n\n- **正文 / Reader**：专门编写的章内导读、固定例子或交互。\n- **逐行依据 / Step reasons**：第6.3—6.5、6.7、8.4、9.7节的证明依据可分别展开；附录B是按方法卡展开。\n- **演示 / Demo**：独立交互路由；同一路径只统计一次，跨节关联不重复计数。\n- **资源 / Resource**：仓库配套代码、参考解答、课件或参考文献，点击离开应用。资源存在不代表已对全部内容重新校勘。\n- **待补 / Not authored**：当前只有节标题及通用导读；章级资源仍可访问。习题无文件且无章内推导／演示时，明确标为待补。\n\n## 按章与节 / Chapters and sections\n`;
for(const ch of chapters){
 md+=`\n### ${ch.id} ${ch.title.zh} / ${ch.title.en}\n\n入口：${link(ch.path)}${ch.recap?'。三个主题：从乘法到通用幂、从整数求余到多项式GCD、迭代器能力与内存权衡。':''}\n\n| 节 / Section | 章内正文 / Reader | 关联演示 / Demos |\n|---|---|---|\n`;
 for(const s of ch.sections)md+=`| [${s.id} ${s.title.zh} / ${s.title.en}](${url(ch.path+'#'+s.anchor)}) | ${s.reader?'正文 / '+s.reader:'待补专门正文 / Not authored'} | ${s.demos.map(link).join(' · ')||'—'} |\n`;
 md+=`\n仓库资源 / Repository resources：${[...new Set(ch.resources.map(r=>r.path))].map(p=>`[${p}](../${encodeURI(p).replaceAll('(','\\(').replaceAll(')','\\)')})`).join(' · ')||'暂无独立章级文件 / None indexed'}\n`;
 if(ch.exercises.length){md+='\n| 习题 / Exercise | 已有入口 / Available entries |\n|---|---|\n';for(const e of ch.exercises)md+=`| [${e.id}](${url(ch.path+'#'+e.anchor)}) | ${[...e.resources.map(r=>{const p=typeof r==='string'?r:r.path;return `[${p}](../${encodeURI(p).replaceAll('(','\\(').replaceAll(')','\\)')})`;}),...e.links.map(link)].join(' · ')||'待补 / No indexed solution or demo'} |\n`;}
}
md+='\n## 去重演示 / Unique demos\n\n| 演示 / Demo | 节或习题来源 / Source |\n|---|---|\n';
for(const d of demos)md+=`| [${d.title.zh} / ${d.title.en}](${url(d.path)}) | ${d.source.type==='extra'?'扩展 / Extra':(d.source.type==='exercise'?'习题 / Exercise '+d.source.section:(d.sections.join(', ')||d.source.section))} |\n`;
md+='\n## 边界、历史与后续候选 / Limits, history and candidates\n\n习题8.3演示覆盖前两题；8.6是章内参考推导。习题7.1错误PDF已移除，保留配套代码。配套资源是参考资料，不代替纸书，也不等同于逐题审定的答案。\n\n第1—12轮是历史建设记录，保持原日期与版本身份；[首轮发布证据归档标签](https://github.com/transbot/fm2gp-Chinese/tree/archive/release-phase1-phase2-evidence/docs/verification/release-phase1-phase2)、[第十二轮固定版本](https://github.com/transbot/fm2gp-Chinese/tree/f19725917d9fa24c8f33b2e9c288e48da3338392/docs/verification/phase12-rings-fields)。本次实际验收见[集中收尾报告](verification/edition-closeout/README.md)。\n\n新的章节专题、其余节的专门正文、未覆盖习题和新演示统一作为后续候选；不计入本版完成结果。本轮不新增后端、账号、勘误页或正式购书地址。评审合并及正式域名验收后，形成最终发布报告并转入维护。\n\nFurther chapter topics, authored readers for remaining sections, missing exercise solutions and new demos are future candidates, not completed work in this edition. Review merge and production acceptance remain the publication gate.\n';
md+=`\n## 未按章索引的资源 / Resources outside the chapter index\n\n上述目录核验了 ${resources.length} 个去重资源文件。资源目录共有 ${trackedResources.length} 个受版本控制的文件；以下 ${unindexedResources.length} 个通过仓库文件夹访问，不计为章内直达资源。\n\n`+unindexedResources.map(r=>`- [${r.path}](../${encodeURI(r.path).replaceAll('(','\\(').replaceAll(')','\\)')})`).join('\n')+'\n';
fs.writeFileSync('docs/book-coverage.md',md);
console.log(JSON.stringify(inventory.counts));
