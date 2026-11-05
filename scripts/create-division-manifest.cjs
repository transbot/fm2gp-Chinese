const fs = require('node:fs');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const destination = 'docs/verification/phase3-division/source-manifest.json';
const paths = [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {encoding:'utf8'}).split('\0'))]
  .filter(p => p && fs.existsSync(p) && p !== destination)
  .filter(p => !p.includes('/') || /^(src|scripts|public)\//.test(p) || p.startsWith('docs/verification/phase3-division/') || ['dist/index.html','配套代码(fm2gpcode)/ch04.h','solutions/4_6.md'].includes(p))
  .sort();
function hash(path) {
  let bytes = fs.readFileSync(path);
  try {
    const text = new TextDecoder('utf-8', {fatal:true,ignoreBOM:true}).decode(bytes);
    bytes = Buffer.from(text.replace(/\r\n/g,'\n'), 'utf8');
  } catch { /* Binary files are hashed unchanged. */ }
  return crypto.createHash('sha256').update(bytes).digest('hex');
}
fs.writeFileSync(destination, JSON.stringify({
  baseCommit:'863cb9527cd0d6a5b093f61d4fa54bc88ae3e23c',
  branch:'codex/phase3-division-doubling-fibonacci',
  hashPolicy:'SHA-256; UTF-8 text normalized to LF; binary unchanged; manifest excludes itself',
  deleted:['src/lib/algorithms/division.ts'],
  sha256:Object.fromEntries(paths.map(p=>[p,hash(p)])),
},null,2)+'\n');
console.log(`Manifest: ${paths.length} existing files, one deleted legacy module.`);
