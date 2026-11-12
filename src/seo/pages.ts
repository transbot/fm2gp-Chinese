import { lessonSearchCatalog } from '../data/algorithmCatalog';
import { bookContent } from '../data/bookContent';

export const SITE_ORIGIN = 'https://fm2gp-chinese.bookzhou.com';
const siteTitle = '数学与泛型编程 · From Mathematics to Generic Programming';

export interface SeoPage {
  path: string;
  title: string;
  description: string;
}

// Reuse the public content catalog so new lessons enter the sitemap automatically.
export const seoPages: SeoPage[] = [
  { path: '/', title: siteTitle, description: '《数学与泛型编程：高效编程的奥秘》中译本配套网站，提供章节导读、数学概念和交互式算法演示。Interactive mathematics and generic programming lessons.' },
  { path: '/book', title: `全书目录与章节导读 | ${siteTitle}`, description: '按《数学与泛型编程》章节阅读导读，探索数学概念、算法演示与练习。Browse the book chapters and their interactive lessons.' },
  ...bookContent.chapters.map(chapter => ({
    path: `/book/${chapter.id}`,
    title: `${chapter.id} ${chapter.title.zh} · ${chapter.title.en} | ${siteTitle}`,
    description: `${chapter.guide.zh} ${chapter.guide.en}`,
  })),
  ...lessonSearchCatalog.map(lesson => ({
    path: lesson.path,
    title: `${lesson.title.zh} · ${lesson.title.en} | ${siteTitle}`,
    description: `${lesson.summary.zh} ${lesson.summary.en}`,
  })),
].filter((page, index, pages) => pages.findIndex(candidate => candidate.path === page.path) === index);

export function getSeoPage(pathname: string): SeoPage | undefined {
  const path = pathname.replace(/\/+$/, '') || '/';
  return seoPages.find(page => page.path === path);
}
