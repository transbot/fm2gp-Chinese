// Exercise the optional store link without changing the delivered configuration.
import {build} from 'vite';
import fs from 'node:fs';
import path from 'node:path';
const source=fs.readFileSync('src/config/book.ts','utf8');
if(!source.includes("CHINESE_BOOK_STORE_URL: string = '';"))throw Error('Expected empty delivered store URL');
await build({plugins:[{name:'isolated-store-fixture',enforce:'pre',load(id){if(id.replaceAll('\\','/').endsWith('/src/config/book.ts'))return source.replace("CHINESE_BOOK_STORE_URL: string = '';","CHINESE_BOOK_STORE_URL: string = 'https://example.com/edition-store-fixture';");}}],build:{outDir:path.resolve('.local/edition-closeout/store-dist'),emptyOutDir:true}});
if(fs.readFileSync('src/config/book.ts','utf8')!==source)throw Error('Delivered configuration changed');
