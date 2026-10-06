import { ROUTES } from './routes.js';

export const SITE_NAME = 'UTN BA Motorsport';
export const SITE_URL = 'https://utnbamotorsport.com.ar';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/img/og-cover.jpg`;

// This catalog is shared by the browser, the prerender build and sitemap.
export const INDEXABLE_PATHS = Object.values(ROUTES);

const SEO_BY_PATH = {
  [ROUTES.home]: {
    title: `${SITE_NAME} — Ingeniería y Fórmula SAE eléctrica`,
    description: 'Conocé UTN BA Motorsport, el equipo de estudiantes de UTN Buenos Aires que desarrolla un monoplaza eléctrico para competir en Fórmula SAE.',
  },
  [ROUTES.news]: {
    title: `Novedades | ${SITE_NAME}`,
    description: 'Conocé los avances, actividades y apariciones de UTN BA Motorsport mientras construimos nuestro monoplaza eléctrico de Fórmula SAE.',
  },
  [ROUTES.team]: {
    title: `El equipo y nuestro proyecto | ${SITE_NAME}`,
    description: 'Conocé a los estudiantes y las áreas de UTN BA Motorsport que transforman conocimientos de ingeniería en un monoplaza eléctrico de Fórmula SAE.',
  },
  [ROUTES.car]: {
    title: `El monoplaza eléctrico | ${SITE_NAME}`,
    description: 'Descubrí el monoplaza 100% eléctrico que estudiantes de UTN Buenos Aires desarrollan para competir en Fórmula SAE Brasil 2027.',
  },
  [ROUTES.academy]: {
    title: `Academia de Motorsport | ${SITE_NAME}`,
    description: 'Rookie, Baja SAE y Fórmula SAE forman el recorrido práctico con el que estudiantes de UTN Buenos Aires aprenden ingeniería construyendo.',
  },
  [ROUTES.aboutFormulaStudent]: {
    title: `Qué es Fórmula Student | ${SITE_NAME}`,
    description: 'Conocé cómo funciona Fórmula Student, qué pruebas evalúa y por qué es una de las competencias universitarias de ingeniería más exigentes.',
  },
  [ROUTES.joinUs]: {
    title: `Sumate al equipo | ${SITE_NAME}`,
    description: 'Información sobre convocatorias y el proceso para incorporarte a UTN BA Motorsport como estudiante de la Facultad Regional Buenos Aires.',
  },
  [ROUTES.sponsors]: {
    title: `Sponsors y alianzas | ${SITE_NAME}`,
    description: 'Impulsá el proyecto de UTN BA Motorsport con aportes, materiales, servicios o conocimiento técnico. Conocé cómo acompañar al equipo.',
  },
  [ROUTES.legal]: {
    title: `Aviso legal | ${SITE_NAME}`,
    description: 'Información legal, titularidad de contenidos, alcance y medios de contacto del sitio web oficial de UTN BA Motorsport.',
  },
  [ROUTES.privacy]: {
    title: `Privacidad | ${SITE_NAME}`,
    description: 'Conocé qué información técnica utiliza el sitio de UTN BA Motorsport, cómo se guarda el idioma y cómo contactar al equipo.',
  },
};

export const NOT_FOUND_SEO = {
  title: `Página no encontrada | ${SITE_NAME}`,
  description: 'La página solicitada no existe o cambió de dirección. Volvé al inicio de UTN BA Motorsport para continuar navegando.',
  canonical: undefined,
  robots: 'noindex, nofollow',
};

export function getSeoForPath(pathname) {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const routeSeo = SEO_BY_PATH[normalizedPath];
  if (!routeSeo) return { ...NOT_FOUND_SEO, pathname: normalizedPath, locale: 'es_AR' };

  const canonical = `${SITE_URL}${normalizedPath === '/' ? '/' : normalizedPath}`;
  return {
    ...routeSeo,
    pathname: normalizedPath,
    canonical,
    robots: 'index, follow',
    ogType: 'website',
    siteName: SITE_NAME,
    ogTitle: routeSeo.title,
    ogDescription: routeSeo.description,
    ogUrl: canonical,
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: 'Monoplaza eléctrico de Fórmula SAE de UTN BA Motorsport',
    ogLocale: 'es_AR',
    twitterCard: 'summary_large_image',
    twitterTitle: routeSeo.title,
    twitterDescription: routeSeo.description,
    twitterImage: DEFAULT_OG_IMAGE,
    twitterImageAlt: 'Monoplaza eléctrico de Fórmula SAE de UTN BA Motorsport',
  };
}

export function createSitemapXml(paths = INDEXABLE_PATHS) {
  const uniquePaths = [...new Set(paths)];
  const urls = uniquePaths
    .filter((path) => SEO_BY_PATH[path])
    .map((path) => `  <url><loc>${escapeXml(getSeoForPath(path).canonical)}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}
