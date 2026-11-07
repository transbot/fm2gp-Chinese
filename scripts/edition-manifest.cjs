// Git blob bytes make hashes independent of checkout CRLF conversion.
const fs=require('node:fs'),{execFileSync}=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const target='docs/verification/edition-closeout/source-manifest.json';
const git=args=>execFileSync('git',args,{maxBuffer:64*1024*1024});
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
if(process.argv[2]==='--check'){
 const ref=process.argv[3]||'HEAD',manifest=JSON.parse(git(['show',ref+':'+target]));
 for(const f of manifest.files)assert.equal(digest(git(['show',ref+':'+f.path])),f.sha256,f.path);
 console.log(`PASS ${manifest.files.length} Git blob hashes at ${git(['rev-parse',ref]).toString().trim()}`);
}else{
 const sources=git(['ls-files','-z','src','scripts','public','package.json','package-lock.json','index.html','tsconfig.app.json','tsconfig.node.json','tsconfig.json','vite.config.ts','vitest.config.ts','eslint.config.js','tailwind.config.js','postcss.config.js']).toString().split('\0').filter(Boolean);
 const changes=git(['diff','--cached','--name-only','-z','f19725917d9fa24c8f33b2e9c288e48da3338392']).toString().split('\0').filter(Boolean);
 const files=[...new Set([...sources,...changes])].filter(p=>p!==target).sort().map(p=>({path:p,sha256:digest(git(['show',':'+p]))}));
 fs.writeFileSync(target,JSON.stringify({baseline:'f19725917d9fa24c8f33b2e9c288e48da3338392',branch:'codex/edition-closeout',fixCommit:'99c4b0f23b22feb2806e3a1cae464e74120ebbea',encoding:'SHA-256 of staged Git blob bytes; manifest excludes itself',commitBinding:'The enclosing review commit is the final version; verify with node scripts/edition-manifest.cjs --check <full SHA>',files},null,2)+'\n');console.log(`Generated ${files.length} file hashes`);
}
