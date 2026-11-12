// @vitest-environment node
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { build } from 'vite';
import { JSDOM } from 'jsdom';
import { lessonSearchCatalog } from '../data/algorithmCatalog';
import { bookContent } from '../data/bookContent';

vi.stubGlobal('localStorage', new JSDOM('', { url: 'https://test.example' }).window.localStorage);

const origin = 'https://fm2gp-chinese.bookzhou.com';
let files: Map<string, string>;
beforeAll(async () => {
  const result = await build({ logLevel: 'silent', build: { write: false } });
  const outputs = Array.isArray(result) ? result : [result];
  files = new Map(outputs.flatMap(output => 'output' in output ? output.output : [])
    .filter(item => item.type === 'asset')
    .map(item => [item.fileName, String(item.source)]));
}, 60000);

describe('crawlable production output', () => {
  it('serves a self canonical on the homepage', () => {
    const doc = new JSDOM(files.get('index.html')).window.document;
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(origin + '/');
  });
  it('gives every public route its own HTML canonical, title, and description', () => {
    const paths = new Set(['/book', ...bookContent.chapters.map(c => `/book/${c.id}`), ...lessonSearchCatalog.map(l => l.path)]);
    for (const path of paths) {
      expect(files.has(path.slice(1) + '.html'), path).toBe(true);
      const doc = new JSDOM(files.get(path.slice(1) + '.html')).window.document;
      expect(doc.querySelectorAll('link[rel="canonical"]'), path).toHaveLength(1);
      expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(origin + path);
      expect(doc.title).not.toBe('From Mathematics to Generic Programming');
      expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')?.length).toBeGreaterThan(10);
    }
  });
  it('provides XML sitemap and robots discovery including the clean Fermat URL', () => {
    const xml = files.get('sitemap.xml');
    expect(xml).toBeDefined();
    const doc = new JSDOM(xml, { contentType: 'text/xml' }).window.document;
    const urls = [...doc.querySelectorAll('loc')].map(n => n.textContent);
    expect(urls).toContain(origin + '/fermat');
    expect(urls).toContain(origin + '/shortest-path');
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every(url => !/[?#]/.test(url ?? ''))).toBe(true);
    expect(files.get('robots.txt')).toContain('Sitemap: ' + origin + '/sitemap.xml');
  });
});
