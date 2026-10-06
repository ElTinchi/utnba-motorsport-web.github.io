import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getSeoForPath } from '../seo.js';

const HTML_LANG = { es: 'es-AR', en: 'en', pt: 'pt-BR' };

export default function Seo() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const seo = getSeoForPath(pathname);
  const language = (i18n.resolvedLanguage || 'es').split('-')[0];

  return (
    <Helmet>
      <html lang={HTML_LANG[language] || HTML_LANG.es} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="robots" content={seo.robots} />
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}
      <meta property="og:type" content={seo.ogType || 'website'} />
      <meta property="og:site_name" content={seo.siteName} />
      <meta property="og:title" content={seo.ogTitle || seo.title} />
      <meta property="og:description" content={seo.ogDescription || seo.description} />
      {seo.ogUrl && <meta property="og:url" content={seo.ogUrl} />}
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
      {seo.ogImageAlt && <meta property="og:image:alt" content={seo.ogImageAlt} />}
      <meta property="og:locale" content={language === 'en' ? 'en_US' : language === 'pt' ? 'pt_BR' : 'es_AR'} />
      <meta name="twitter:card" content={seo.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={seo.twitterTitle || seo.title} />
      <meta name="twitter:description" content={seo.twitterDescription || seo.description} />
      {seo.twitterImage && <meta name="twitter:image" content={seo.twitterImage} />}
      {seo.twitterImageAlt && <meta name="twitter:image:alt" content={seo.twitterImageAlt} />}
    </Helmet>
  );
}
