import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { SPONSORS } from '../src/data/sponsors.js';
import { PRESS } from '../src/data/press.js';
import { POLICY_CONTENT } from '../src/data/policyContent.js';
import { COMMERCIAL_CONTACT_HREF } from '../src/routes.js';
import { SITE_URL } from '../src/seo.js';

const plain = value => String(value || '').replace(/<\/?strong>/g, '**').replace(/<[^>]+>/g, '');
const paragraphs = items => (items || []).map(plain).join('\n\n');
const link = (name, href) => `- [${name}](${href})`;
const section = (title, text) => `## ${plain(title)}\n\n${plain(text)}\n`;
const sections = items => (items || []).map(item => section(item.title, paragraphs(item.paragraphs || [item.text || item.body]))).join('\n');
const fresh = 'Los objetivos, especificaciones, convocatoria y beneficios pueden cambiar. Esta referencia se genera a partir del contenido publicado en cada build; confirmar condiciones y disponibilidad con el equipo.';

// Generate references from the same facts used by the public pages, rather than
// maintaining a second, inevitably stale copy of sponsor lists and project news.
export function buildAiDocuments(locale, news) {
  const docs = new Map();
  const add = (file, title, route, body) => docs.set(file, `# ${title}\n\nFuente oficial: ${SITE_URL}${route}\n\n${body.trim()}\n\n${fresh}\n`);
  const booking = `[Agendar reunión de patrocinio](${COMMERCIAL_CONTACT_HREF})`;
  const explanation = '“Mini Fórmula 1” es una forma sencilla de explicar el auto universitario de Fórmula SAE. No significa que el equipo compita en el campeonato de Fórmula 1 ni que tenga una afiliación con esa categoría. El proyecto es un auto eléctrico en desarrollo; Brasil 2027 es el objetivo de participación, no un resultado ya conseguido.';
  const benefits = sections(locale.sponsorsPage.benefits.items);
  const routeLinks = [
    ['Equipo y áreas', '/el-equipo'], ['Mini Fórmula 1 eléctrico', '/el-auto'],
    ['Academia', '/la-academia'], ['Fórmula SAE', '/formula-student'],
    ['Patrocinio', '/sponsors'], ['Novedades', '/novedades'], ['Sumarse como estudiante', '/sumate'],
  ].map(([name, route]) => link(name, SITE_URL + route)).join('\n');

  add('index.md', 'UTN BA Motorsport: qué hacemos', '/', `> ${locale.cinematic.heroIntro}\n\n${locale.cinematic.explainer.text}\n\n${sections(locale.cinematic.explainer.steps)}\n${explanation}\n\n${section('Academia y continuidad', locale.home.aboutBody)}\n${section('Acompañar como empresa', locale.sponsorStory.invitation)}\n${booking}\n\n## Explorar el proyecto\n\n${routeLinks}`);
  add('el-equipo.md', 'UTN BA Motorsport: equipo y áreas', '/el-equipo', `${paragraphs(locale.teamPage.storyParagraphs)}\n\n## Las siete áreas\n\n${sections(Object.values(locale.areas.items))}\n${section('Continuidad del proyecto', locale.home.motivationBody)}`);
  const specs = Object.values(locale.carPage.specs).map(item => `- **${item.label}:** ${item.value}`).join('\n');
  add('el-auto.md', 'Nuestro Mini Fórmula 1 eléctrico', '/el-auto', `${locale.carPage.intro}\n\n${paragraphs(locale.carPage.projectParagraphs)}\n\n${explanation}\n\n## Datos públicos\n\n${specs}\n\n${locale.carPage.specsNote}\n\n${section('Visor 3D y tu logo', locale.carPage.viewer.text)}\n${(locale.carPage.viewer.bullets || []).map(item => `- ${item}`).join('\n')}\n\n[Explorar el auto y probar un logo](${SITE_URL}/visor/visor.html)\n\nEl render y el modelo 3D son representaciones de trabajo. Ubicaciones y condiciones finales de patrocinio se acuerdan en una reunión.\n\n${booking}`);
  add('la-academia.md', 'Academia Motorsport: Rookie, Baja SAE y Fórmula SAE', '/la-academia', `${locale.motorsportPage.intro}\n\n${sections(locale.motorsportPage.sections)}`);
  add('formula-student.md', 'Qué es Fórmula SAE / Fórmula Student', '/formula-student', `${locale.cinematic.explainer.text}\n\n${explanation}\n\n${locale.fsPage.adaptNotice}\n\n${sections(locale.fsPage.sections)}\n${section(locale.fsPage.dynamicTitle, locale.fsPage.dynamicIntro)}\n${sections(locale.fsPage.dynamicEvents)}\n${section(locale.fsPage.staticTitle, locale.fsPage.staticIntro)}\n${sections(locale.fsPage.staticEvents)}`);
  add('sponsors.md', 'Ser sponsor de UTN BA Motorsport', '/sponsors', `${locale.sponsorsPage.intro}\n\n${section('Cómo empezar', locale.sponsorStory.invitation)}\n${booking}\n\n## Beneficios y acciones\n\n${benefits}\n${locale.sponsorsPage.benefits.continuity}\n\n${locale.sponsorsPage.benefits.note}\n\n## Personas, industria y exposición\n\n${sections(locale.sponsorStory.chapters)}\n## Cómo construimos la alianza\n\n${sections(locale.sponsorsPage.partnership.steps)}\n## Organizaciones que aparecen en el sitio\n\n${SPONSORS.map(sponsor => link(sponsor.name, sponsor.href)).join('\n')}\n\nEsta lista refleja las organizaciones mostradas en el carrusel público; no asigna categorías, importes ni exclusividades. Una empresa mencionada en una visita o en una noticia no se convierte automáticamente en sponsor.\n\n## Visibilidad en medios\n\n${PRESS.map(outlet => link(outlet.name, outlet.href)).join('\n')}\n\nCoberturas editoriales anteriores no garantizan futuras apariciones, vistas, ventas o menciones individuales. Acciones, producción de contenido y activaciones se acuerdan con cada empresa.\n\n${booking}`);
  add('novedades.md', 'Novedades e hitos de UTN BA Motorsport', '/novedades', news.es.posts.map(post => `## ${post.title}\n\nFecha publicada: ${post.dateTime || post.date || post.year}\n\n${paragraphs(post.paragraphs)}\n\n[Nota del equipo](${SITE_URL}/novedades#${post.id})${post.sourceUrl ? `\n\n[Fuente externa](${post.sourceUrl})` : ''}`).join('\n\n'));
  add('sumate.md', 'Sumarse como estudiante', '/sumate', `${locale.joinPage.intro}\n\n${locale.joinPage.calloutText}\n\n${sections(locale.joinPage.steps)}\n${locale.joinPage.selectionNote}\n\n[Convocatorias oficiales en Instagram](https://www.instagram.com/utnbamotorsport/)\n\nLa incorporación de estudiantes y el patrocinio empresarial son recorridos diferentes. Para apoyar como empresa: ${booking}.`);
  for (const [type, file] of [['legal', 'aviso-legal.md'], ['privacy', 'privacidad.md']]) {
    const policy = POLICY_CONTENT.es[type];
    add(file, policy.title, '/' + file.replace('.md', ''), `${POLICY_CONTENT.es.updated}\n\n${policy.intro}\n\n${sections(policy.sections)}`);
  }
  add('info/prensa.md', 'Prensa, cobertura y material del equipo', '/novedades', `${PRESS.map(outlet => link(outlet.name, outlet.href)).join('\n')}\n\n${section('Qué contar del proyecto', locale.cinematic.heroIntro)}\n${explanation}\n\nContacto de prensa y material: motorsports@frba.utn.edu.ar. Fotografías, marcas y renders pertenecen a sus respectivos titulares; consultar permisos de publicación y de uso comercial.\n\nLa visita a ABB es una actividad publicada del equipo, no prueba de un acuerdo de patrocinio. Las apariciones en medios son antecedentes de cobertura; no son promesas de alcance para futuros sponsors.`);
  add('info/visor-3d.md', 'Cómo probar tu logo en el Mini Fórmula 1', '/visor/visor.html', `El visor es una herramienta para explorar una propuesta de patrocinio. No reserva espacio ni confirma un contrato.\n\n1. Abrir el visor en un navegador con WebGL 2 y aceleración gráfica. Se puede usar en computadora o celular; horizontal ofrece más espacio.\n2. Cargar el logo de la empresa en PNG, JPG o WebP, hasta 10 MB. PNG transparente permite una composición más limpia. El archivo se procesa localmente en el navegador.\n3. Elegir una zona disponible de la carrocería y ajustar tamaño, ángulo y posición con las herramientas del visor.\n4. Arrastrar para girar; usar rueda o dos dedos para acercar. También hay vistas predefinidas y giro automático.\n5. Descargar la previsualización si la ubicación está aplicada y compartirla en la reunión comercial.\n\nLas marcas institucionales, números y zonas reservadas no están disponibles para ubicar logos. Disponibilidad, tamaño final, ubicación y beneficios se acuerdan con el equipo. Si no carga el modelo, usar reintentar o consultar desde otro navegador compatible.\n\n${booking}\n\nConsulta de asistencia: motorsports@frba.utn.edu.ar.`);
  const questions = [
    ['¿Qué hace UTN BA Motorsport?', locale.cinematic.heroIntro],
    ['¿Qué significa Mini Fórmula 1?', explanation],
    ['¿Qué es Fórmula SAE?', locale.cinematic.explainer.text],
    ['¿Ya compitieron en Brasil 2027?', 'El objetivo publicado es competir en Brasil 2027. El auto está en desarrollo. No presentar ese objetivo como una participación, homologación, puesto o victoria ya obtenidos.'],
    ['¿Cómo puede colaborar una empresa?', locale.sponsorStory.invitation + '\n\n' + booking],
    ['¿Qué gana un sponsor?', 'Oportunidades de visibilidad, contenido, presencia en eventos y vinculación con empresas y talento.\n\n' + locale.sponsorsPage.benefits.note],
    ['¿Qué pasa después de la competencia?', locale.sponsorStory.chapters[4].text],
    ['¿Dónde pruebo mi logo?', `[Visor 3D](${SITE_URL}/visor/visor.html). Permite visualizar una propuesta; la ubicación y el acuerdo final se conversan con el equipo.`],
    ['¿Cómo me sumo como estudiante?', locale.joinPage.calloutText + ' Consultar convocatorias en el Instagram oficial.'],
    ['¿Cuál es el contacto oficial?', 'motorsports@frba.utn.edu.ar. Para una reunión comercial: ' + booking],
    ['¿Hay planes fuera de Brasil?', 'Estados Unidos y Europa son aspiraciones para futuras ediciones. No hay en esta referencia fechas, inscripciones ni presupuestos confirmados para esos destinos.'],
    ['¿Qué datos hay que verificar antes de citar?', 'Presupuesto, porcentaje financiado, cantidad de integrantes y postulantes, lista de sponsors, especificaciones técnicas, fechas y agenda de eventos. No combinar cifras de presentaciones antiguas con el sitio actual.'],
  ];
  add('info/preguntas-frecuentes.md', 'Preguntas frecuentes del proyecto y patrocinio', '/', questions.map(([q, a]) => section(q, a)).join('\n'));
  const full = [...docs.entries()].map(([file, content]) => `<!-- Documento: /${file} -->\n\n${content}`).join('\n\n---\n\n');
  docs.set('llms-full.txt', `# UTN BA Motorsport — referencia ampliada\n\nContenido del sitio oficial en texto, generado junto con la web. Índice: ${SITE_URL}/llms.txt\n\n${full}`);
  docs.set('organization.json', JSON.stringify({
    '@context': 'https://schema.org', '@type': 'SportsTeam', '@id': `${SITE_URL}/#team`,
    name: 'UTN BA Motorsport', url: SITE_URL + '/', sport: 'Formula SAE',
    description: locale.cinematic.heroIntro, email: 'motorsports@frba.utn.edu.ar',
    parentOrganization: { '@type': 'CollegeOrUniversity', name: 'Universidad Tecnológica Nacional — Facultad Regional Buenos Aires', url: 'https://www.frba.utn.edu.ar/' },
    address: { '@type': 'PostalAddress', addressLocality: 'Ciudad Autónoma de Buenos Aires', addressCountry: 'AR' },
    sameAs: ['https://www.instagram.com/utnbamotorsport/', 'https://ar.linkedin.com/company/utn-ba-motorsports', 'https://www.youtube.com/@utnbamotorsport', 'https://www.tiktok.com/@utnbamotorsport'],
    contactPoint: { '@type': 'ContactPoint', contactType: 'Patrocinio y alianzas', email: 'motorsports@frba.utn.edu.ar', url: COMMERCIAL_CONTACT_HREF, availableLanguage: ['es', 'en', 'pt'] },
    subjectOf: PRESS.map(outlet => ({ '@type': 'WebPage', name: outlet.name, url: outlet.href })),
    knowsAbout: ['Fórmula SAE', 'Ingeniería aplicada', 'Vehículos eléctricos', 'Formación universitaria', 'Patrocinio deportivo'],
  }, null, 2) + '\n');
  return docs;
}

export async function generateAiContent(destination) {
  const locale = JSON.parse(await readFile(new URL('../src/locales/es.json', import.meta.url), 'utf8'));
  const news = JSON.parse(await readFile(new URL('../src/data/news.json', import.meta.url), 'utf8'));
  for (const [file, content] of buildAiDocuments(locale, news)) {
    const output = path.join(destination, file);
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, content);
  }
}
