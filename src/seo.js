import { ROUTES } from './routes.js';

const SITE_NAME = 'UTN BA Motorsport';
const SITE_URL = 'https://utnbamotorsport.com.ar';

const SEO_BY_PATH = {
  [ROUTES.home]: {
    title: `${SITE_NAME} — Fórmula SAE eléctrico de UTN Buenos Aires`,
    description: 'Estudiantes de UTN Buenos Aires diseñan y fabrican el primer monoplaza eléctrico de la facultad para competir en Fórmula SAE Brasil 2027.',
  },
  [ROUTES.news]: {
    title: `Novedades | ${SITE_NAME}`,
    description: 'Conocé los avances, actividades y apariciones de UTN BA Motorsport mientras construimos nuestro monoplaza eléctrico de Fórmula SAE.',
  },
  [ROUTES.team]: {
    title: `El equipo | ${SITE_NAME}`,
    description: 'Conocé las siete áreas de estudiantes de UTN Buenos Aires que diseñan, fabrican, gestionan y comunican nuestro proyecto de Fórmula SAE.',
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
    description: 'Acompañá a estudiantes de UTN Buenos Aires rumbo a Fórmula SAE Brasil 2027 mediante aportes, materiales, servicios o conocimiento técnico.',
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

const NOT_FOUND_SEO = {
  title: `Página no encontrada | ${SITE_NAME}`,
  description: 'La página solicitada no existe o cambió de dirección. Volvé al inicio de UTN BA Motorsport para continuar navegando.',
  canonical: null,
  robots: 'noindex, nofollow',
};

export function getSeoForPath(pathname) {
  const routeSeo = SEO_BY_PATH[pathname];
  if (!routeSeo) return NOT_FOUND_SEO;

  return {
    ...routeSeo,
    canonical: `${SITE_URL}${pathname === '/' ? '/' : pathname}`,
    robots: 'index, follow',
  };
}

export { SITE_NAME, SITE_URL };
