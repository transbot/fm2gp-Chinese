// Run after staging. Hash the Git blobs, so checkout newline conversion cannot
// change the evidence. The manifest excludes itself and never embeds its own HEAD.
const fs=require('node:fs'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const base='9e6260664c842843dda593955fafe7b3677045d3';
const out='docs/verification/phase7-proofs/source-manifest.json';
const tree=process.argv[2]; // Optional committed tree for independent reproduction.
const git=(args)=>execFileSync('git',args,{maxBuffer:64*1024*1024});
const files=git(tree?['ls-tree','-r','--name-only','-z',tree]:['ls-files','-z']).toString().split('\0')
  .filter(p=>p && p!==out && (!p.includes('/') || /^(src|scripts|public|docs\/verification\/phase7-proofs)\//.test(p) || p==='dist/index.html')).sort();
const entries=files.map(p=>[p,crypto.createHash('sha256').update(git(['show',(tree||'')+':'+p])).digest('hex')]);
const data=JSON.stringify({base,branch:'codex/phase7-proofs-reference',policy:'SHA-256 of Git blob bytes, manifest excluded',files:Object.fromEntries(entries)},null,2)+'\n';
if(tree){
  if(git(['show',tree+':'+out]).toString()!==data)throw new Error('Committed manifest differs');
  console.log('Verified',files.length,'files at',tree);
}else{
  fs.writeFileSync(out,data);console.log('Manifest:',files.length,'files');
}
