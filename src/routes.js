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
export const CONTACT_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}`;
