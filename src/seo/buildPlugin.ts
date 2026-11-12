import type { Plugin } from 'vite';
import { seoPages, SITE_ORIGIN } from './pages';

const escapeXml = (value: string) => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[character]!);

// Netlify pretty URLs serve route.html at /route before the SPA fallback.
// Canonicals must be correct in the HTTP response, before JavaScript runs.
export function seoPlugin(): Plugin {
  return {
    name: 'public-route-seo',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const index = bundle['index.html'];
      if (!index || index.type !== 'asset') throw new Error('Missing application HTML');
      const template = String(index.source);
      for (const page of seoPages) {
        const html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeXml(page.title)}</title>`)
          .replace('</head>', `    <link rel="canonical" href="${SITE_ORIGIN}${page.path}" />\n    <meta name="description" content="${escapeXml(page.description)}" />\n  </head>`);
        if (page.path === '/') index.source = html;
        else this.emitFile({ type: 'asset', fileName: page.path.slice(1) + '.html', source: html });
      }
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source:
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${seoPages.map(page => `  <url><loc>${SITE_ORIGIN}${page.path}</loc></url>`).join('\n')}\n</urlset>\n` });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source:
        `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n` });
    },
  };
}
