import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeoPage, SITE_ORIGIN } from './pages';

export function RouteSeo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = getSeoPage(pathname);
    if (!page) return; // Unknown routes are redirected by the router.
    document.title = page.title;
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = SITE_ORIGIN + page.path;
    if (!canonical.isConnected) document.head.append(canonical);
    const description = document.head.querySelector<HTMLMetaElement>('meta[name="description"]') ?? document.createElement('meta');
    description.name = 'description';
    description.content = page.description;
    if (!description.isConnected) document.head.append(description);
  }, [pathname]);
  return null;
}
