import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeoForPath, SITE_NAME } from '../seo.js';

function setMeta(selector, value) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute('content', value);
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(pathname);
    document.title = seo.title;
    setMeta('meta[name="description"]', seo.description);
    setMeta('meta[name="robots"]', seo.robots);
    setMeta('meta[property="og:title"]', seo.title);
    setMeta('meta[property="og:description"]', seo.description);
    setMeta('meta[property="og:url"]', seo.canonical || window.location.href);
    setMeta('meta[name="twitter:title"]', seo.title);
    setMeta('meta[name="twitter:description"]', seo.description);
    setMeta('meta[property="og:site_name"]', SITE_NAME);

    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) {
      if (seo.canonical) canonical.setAttribute('href', seo.canonical);
      else canonical.removeAttribute('href');
    }
  }, [pathname]);

  return null;
}
