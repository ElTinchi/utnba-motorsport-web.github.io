// Rutas centralizadas: se usan en el nav (Header), en el Footer y en App.jsx.
//
// La estructura se redujo de 10 páginas a 8. Lo que cambió y por qué:
//   - /equipo y /sobre-nosotros contaban lo mismo -> se fusionaron en /el-equipo
//   - /contacto se disolvió: el formulario vive en /sumate y en /sponsors, y
//     los datos de contacto en el footer
//   - /motorsport se renombró a /la-academia (el nombre viejo no decía nada)
//   - /el-auto es nueva
export const ROUTES = {
  home: '/',
  news: '/novedades',
  team: '/el-equipo',
  car: '/el-auto',
  academy: '/la-academia',
  aboutFormulaStudent: '/formula-student',
  joinUs: '/sumate',
  sponsors: '/sponsors',
  legal: '/aviso-legal',
  privacy: '/privacidad',
};

// URLs viejas que ya se compartieron o que puede tener indexadas Google.
// App.jsx las redirige a su destino nuevo para no romper ningún link.
export const LEGACY_REDIRECTS = {
  '/sobre-nosotros': ROUTES.team,
  '/equipo': ROUTES.team,
  '/motorsport': ROUTES.academy,
  '/contacto': ROUTES.joinUs,
};

export const CONTACT_EMAIL = 'motorsports@frba.utn.edu.ar';
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}`;

const COMMERCIAL_SUBJECT = 'Alianza con UTN BA Motorsport';

export function buildCommercialContactHref({ company = '[empresa]' } = {}) {
  const body = `Hola, les escribo de ${company}. ¿Me pasan un WhatsApp para conversar?`;
  return `${CONTACT_HREF}?subject=${encodeURIComponent(COMMERCIAL_SUBJECT)}&body=${encodeURIComponent(body)}`;
}

export const COMMERCIAL_CONTACT_HREF = buildCommercialContactHref();
