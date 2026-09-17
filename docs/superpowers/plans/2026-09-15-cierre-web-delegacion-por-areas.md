# Plan de delegación por áreas — cierre de la web UTN BA Motorsport

**Objetivo:** completar y validar la web con información real del equipo y recorridos funcionales para empresas, estudiantes e instituciones.

**Organización:** Industrial coordina entregas y dependencias; cada área técnica responde por sus datos; Comunicación prepara el contenido; un responsable web implementa; Dirección aprueba afirmaciones institucionales y comerciales. Son funciones propuestas, no nombramientos ya acordados.

**Base:** [auditoría comparativa](../../AUDITORIA-FIUBA-VS-UTNBA-2026-09-15.md) y [relevamiento de información](../../RELEVAMIENTO-EQUIPO-CIERRE-WEB.md).

**Tecnología existente:** React/Vite, CSS e idiomas ES/EN/PT. La landing WordPress es una pieza institucional adicional y debe conservar sus estilos aislados.

**Método:** se aplicó `writing-plans` de Superpowers para descomponer el trabajo en entregables revisables, dependencias y comprobaciones. Se adaptó al pedido de delegación humana: este documento no es un guion de programación ni exige pruebas de código a las áreas de ingeniería. Las skills de frontend consultadas se detallan al final.

**Estado:** plan propuesto; ninguna tarea fue asignada a una persona ni comunicada al equipo. Los datos del sitio corresponden a la auditoría del 15/09/2026.

## 1. Lo que tenés que delegar primero

| A quién | Pedido concreto | Resultado que te tienen que entregar |
|---|---|---|
| Diseño del auto | Ficha mecánica y render vigente | Tabla con unidades, versión, estado de cada dato y vistas aprobadas |
| Electrónica | Tracción, batería, control y pruebas | Ficha eléctrica y registro de qué se probó realmente |
| Fabricación | Estado físico del auto | Matriz de ensamble, faltantes y fotos actuales |
| Química | Materiales y compuestos | Aplicaciones reales, estado de desarrollo y fotos para su galería |
| CNC | Piezas mecanizadas | Lista pieza–función–estado y fotos con descripción |
| Comunicación | Material visual, noticias y presentación | Fotos seleccionadas, tres novedades, historia, sponsors y brief visual |
| Industrial | Presupuesto, faltantes y consolidación | Un único cuadro económico y una ficha del auto sin contradicciones |
| Dirección/coordinación | Identidad, ingreso y academia | Datos institucionales y políticas aprobadas |
| Responsable web | Implementación y comprobación | Vista previa completa, recorridos probados y reporte de revisión |

**Diseño del auto no es diseño de interfaz.** A Diseño se le pide ingeniería y renders; la presentación visual de la web se prepara entre Comunicación y el responsable web. «Responsable web» es una función a designar, no una octava área inventada ni una obligación automática de Electrónica.

## 2. Tu rol como jefe de Industrial

Vos sos responsable de que las entregas lleguen, sean compatibles y tengan un aprobador. Podés repartir presupuesto, compras y seguimiento entre integrantes de Industrial.

- Elegí una persona responsable por tarea; los colaboradores pueden ser varios.
- Pedí archivos concretos y una fecha, no pedidos abiertos como «pasen información para la web».
- Revisá fecha, evidencia, unidades y permiso de publicación; la validación técnica sigue siendo del referente del área.
- Llevá a Dirección las decisiones institucionales o comerciales que excedan tu función.
- Consolidá una única versión aprobada antes de que se cargue contenido definitivo.
- Cerrá tareas por evidencia y criterio de aceptación, no por mensajes de «ya está».

## 3. Plazo y capacidad propuestos

**Propuesta: 15 días hábiles desde el lanzamiento del pedido**, no una fecha comprometida. D1 es el día en que confirmás responsables y disponibilidad. Los esfuerzos indicados abajo son horas de trabajo estimadas, no duración de calendario.

| Ventana | Trabajo | Condición de salida |
|---|---|---|
| D1 | Asignación y formato de entrega | Cada tarea tiene dueño, capacidad y fecha acordada |
| D2–D4 | Áreas técnicas y Dirección entregan datos | Fichas, fotos y políticas con validación de origen |
| D5–D7 | Industrial y Comunicación consolidan | Contenido aprobado; contradicciones resueltas |
| D5 en paralelo | Web resuelve contacto | Canal correcto y accesible |
| D8–D12 | Implementación web | Contenido integrado y vista previa completa |
| D13–D14 | Revisión funcional, visual y correcciones | Reporte sin bloqueos de publicación |
| D15 | Cierre por Industrial y Dirección | Versión aceptada y mantenimiento asignado |

La cola web tiene una estimación agregada de **30–49 horas**, más correcciones que excedan el alcance previsto. Reservar esa capacidad antes de prometer D15. Si la persona solo dispone de unas pocas horas por semana, extender el calendario; no trasladar esa presión a los proveedores de información.

Dependencia principal: datos técnicos → ficha consolidada → contenido aprobado → integración → verificación. El contacto puede resolverse antes. Brief visual y preparación de noticias pueden avanzar mientras llegan las fichas.

## 4. Reglas comunes de entrega

Cada tarea se entrega con su ID, responsable, fecha, enlace al archivo, fuente y aprobación. En datos técnicos usar **objetivo / definido / fabricado o adquirido / instalado / ensayado** según corresponda. «No publicable» y «aún no definido» son respuestas válidas; no reemplazarlas con números estimados sin identificación.

Carpeta compartida propuesta `Cierre-web/`, con subcarpetas por área y una `Aprobado/`. Puede estar en la herramienta que ya utilice el equipo. No fue creada en un servicio externo.

Nombre sugerido: `ID-entregable-AAAA-MM-DD-v1`. Para fotos, conservar originales y adjuntar una tabla `archivo | qué muestra | fecha | área | crédito | permiso`. Comunicación prepara los textos; las áreas no necesitan redactar publicidad.

Un dato que no esté resuelto al corte D7 debe tener una salida aprobada: descripción de estado actual, objetivo explícito u omisión del campo. No dejar marcadores editoriales visibles ni esperar indefinidamente a que termine el auto.

## 5. Tareas listas para delegar

P0: necesaria para el cierre acordado. P1: mejora importante que puede diferirse explícitamente sin impedir la publicación. Las dependencias indican entregas necesarias para **terminar**, no necesariamente para comenzar.

### Industrial

#### IND-01 — Asignar responsables y abrir el tablero

**Dueño propuesto:** vos. **P0 · D1 · 1–2 h.** Sin dependencias.

- [ ] Acordar un responsable de cada área y uno de implementación web.
- [ ] Importar o copiar el [tablero de tareas](2026-09-15-tablero-delegacion.csv).
- [ ] Confirmar capacidad, plazos y carpeta de recepción.

**Entregable:** tablero con persona asignada y fecha acordada por fila. **Aceptación:** todos los P0 tienen responsable; quien implementa web acepta su carga de trabajo. **Revisa:** vos; Dirección confirma roles transversales.

#### IND-02 — Validar el presupuesto que se publica

**Dueño propuesto:** referente de costos de Industrial. **P0 · D4 · 2–4 h.** Depende de IND-01.

- [ ] Contrastar USD 31.780, USD 9.450, USD 10.000 y el 62% de la web con los registros vigentes.
- [ ] Separar recibido, comprometido y pendiente, con moneda, fecha y criterio de valuación del canje.
- [ ] Especificar si el total cubre auto, ensayos, viaje, inscripción y otros gastos.

**Entregable:** planilla económica y párrafo publicable. **Aceptación:** importes y porcentaje concilian; alcance y fecha están explícitos; el responsable de fondos valida. **Revisa:** vos y Dirección para publicación.

#### IND-03 — Preparar necesidades concretas para empresas

**Dueño propuesto:** referente de compras/proveedores de Industrial. **P0 · D5 · 2–3 h.** Depende de IND-02 y FAB-01; consulta las demás áreas.

- [ ] Recibir faltantes materiales y servicios de cada referente.
- [ ] Priorizar 3–5 necesidades con cantidad, costo/moneda, urgencia y modalidad de colaboración posible.
- [ ] Confirmar qué puede divulgarse y quién coordina la conversación comercial.

**Entregable:** tabla de necesidades priorizadas. **Aceptación:** ninguna necesidad figura ya cubierta; cada una tiene responsable y costo respaldado o explícitamente «a cotizar». **Revisa:** vos; Dirección aprueba compromisos externos.

#### IND-04 — Consolidar la ficha y el estado del monoplaza

**Dueño propuesto:** referente de planificación de Industrial. **P0 · D6 · 3–4 h.** Depende de DIS-01, QUI-01, FAB-01, CNC-01, ELE-01 y ELE-02.

- [ ] Unificar los aportes en una sola tabla técnica y una matriz de estado por subsistema.
- [ ] Resolver con los referentes diferencias entre CAD, fabricación, compra, montaje y pruebas.
- [ ] Preparar una frase de estado actual y el próximo hito verificable.

**Entregable:** ficha maestra fechada, con origen y aprobador por dato. **Aceptación:** no hay contradicciones como «puesto en pista» sin ensayo confirmado; ningún porcentaje técnico carece de método. **Revisa:** vos y referente técnico; Industrial no certifica por su cuenta el diseño.

#### IND-05 — Cerrar la versión y repartir mantenimiento

**Dueño propuesto:** vos. **P0 · D15 · 1–2 h.** Depende de WEB-06.

- [ ] Comparar la vista previa contra los entregables aprobados y registrar lo diferido.
- [ ] Asignar responsables futuros de noticias, presupuesto, sponsors e ingreso.
- [ ] Presentar a Dirección la versión concreta para aceptación y acordar publicación con el responsable web.

**Entregable:** acta breve de cierre con versión revisada y responsables. **Aceptación:** sin P0 abiertos; cada P1 diferido tiene motivo y revisión prevista; no se confunde entrega aprobada con publicación realizada. **Revisa:** Dirección y vos.

### Diseño del auto

#### DIS-01 — Entregar la ficha mecánica publicable

**Dueño propuesto:** referente de Diseño. **P0 · D3 · 2–3 h.** Depende de IND-01.

- [ ] Informar chasis, suspensión, frenos, ruedas, dimensiones y masa publicable.
- [ ] Anotar unidades, versión, fuente y si cada valor es objetivo o está validado.
- [ ] Explicar dos decisiones de ingeniería en lenguaje sencillo.

**Entregable:** tabla mecánica y dos explicaciones breves. **Aceptación:** sin valores inventados, sin prestaciones presentadas como medidas si no lo son y sin planos restringidos. **Revisa:** referente técnico; recibe IND-04.

#### DIS-02 — Seleccionar el render vigente

**Dueño propuesto:** integrante de Diseño que administra CAD/render. **P1 · D4 · 1–2 h.** Depende de DIS-01.

- [ ] Elegir vistas lateral, frontal y tres cuartos de la versión publicable.
- [ ] Indicar fecha/versión y diferencias importantes frente al auto construido.
- [ ] Entregar archivos de imagen y descripción; confirmar si el visor representa esa versión.

**Entregable:** tres vistas o ratificación documentada de los renders actuales. **Aceptación:** Comunicación puede identificarlos como render y no presentarlos como fotografía. **Revisa:** Diseño; recibe COM-01. Si se difiere, el render existente debe seguir correctamente identificado.

### Química

#### QUI-01 — Documentar materiales y completar evidencia del área

**Dueño propuesto:** referente de Química. **P0 · D3 · 2–3 h.** Depende de IND-01.

- [ ] Enumerar materiales/compuestos, aplicación real y estado de desarrollo.
- [ ] Seleccionar 2–3 fotos de piezas, muestras o procesos propios con pie y fecha.
- [ ] Explicar qué aporta el área y un avance comprobable.

**Entregable:** ficha de materiales y carpeta visual. **Aceptación:** cada material se vincula con una aplicación concreta; ninguna resistencia, certificación o ensayo se declara sin respaldo. Si no hay fotos publicables, indicarlo para usar un bloque de texto terminado. **Revisa:** Química; reciben IND-04 y COM-01.

### Fabricación

#### FAB-01 — Mostrar qué está construido y qué falta ensamblar

**Dueño propuesto:** referente de Fabricación. **P0 · D3 · 2–4 h.** Depende de IND-01.

- [ ] Listar los conjuntos fabricados, montados y pendientes con fecha de corte.
- [ ] Entregar 2–3 fotos del trabajo del área y 4–6 vistas actuales del auto/componentes si están disponibles.
- [ ] Identificar faltantes de materiales/servicios y próximo hito de ensamble.

**Entregable:** matriz de ensamble, fotos y lista de faltantes. **Aceptación:** las fotos respaldan el estado declarado; «fabricado» no se confunde con «instalado» ni «probado». **Revisa:** Fabricación; reciben IND-03, IND-04 y COM-01.

### CNC

#### CNC-01 — Documentar piezas y aporte del mecanizado

**Dueño propuesto:** referente de CNC. **P0 · D3 · 1–2 h.** Depende de IND-01.

- [ ] Listar piezas representativas con función, material y estado real.
- [ ] Identificar cuáles fueron mecanizadas por el equipo y cuáles por un proveedor.
- [ ] Entregar 2–3 fotos y validar terminología técnica para traducción.

**Entregable:** tabla pieza–función–material–estado–autoría y fotos. **Aceptación:** nombres consistentes con Diseño; no se publican tolerancias o capacidades no verificadas. **Revisa:** CNC, consultando a Diseño; reciben IND-04 y COM-01.

### Electrónica

#### ELE-01 — Entregar arquitectura eléctrica y de tracción

**Dueño propuesto:** referente de Electrónica. **P0 · D3 · 2–4 h.** Depende de IND-01.

- [ ] Informar motor, inversor, batería, BMS, control y adquisición de datos a nivel publicable.
- [ ] Diferenciar potencia nominal/pico, tensión y energía con unidades y fuentes.
- [ ] Identificar desarrollo propio, compras y estado de integración.

**Entregable:** ficha eléctrica y explicación del sistema en 100–150 palabras orientativas. **Aceptación:** «seleccionado» no significa «instalado»; datos pendientes se marcan; no se necesitan esquemas detallados para la web. **Revisa:** Electrónica y referente técnico; recibe IND-04.

#### ELE-02 — Validar qué pruebas se realizaron

**Dueño propuesto:** responsable de integración/ensayos de Electrónica. **P0 · D4 · 1–2 h.** Depende de ELE-01 y consulta FAB-01.

- [ ] Enumerar pruebas realmente realizadas, fecha, alcance y evidencia disponible.
- [ ] Separar pruebas de componente, banco, sistema integrado y vehículo en movimiento.
- [ ] Acordar con Fabricación y Dirección una frase pública sobre el estado de pruebas.

**Entregable:** registro resumido y frase aprobada. **Aceptación:** no se atribuye homologación o aprobación de competencia a un ensayo interno. Esta tarea documenta ensayos existentes; no obliga a realizar nuevos ensayos para cerrar la web. **Revisa:** referente técnico; recibe IND-04.

### Comunicación

#### COM-01 — Preparar el paquete visual definitivo

**Dueño propuesto:** referente audiovisual de Comunicación. **P0 · D5 · 3–5 h.** Depende de QUI-01, FAB-01, CNC-01 y material disponible de Diseño/Electrónica; DIS-02 aporta si se completa.

- [ ] Seleccionar foto grupal, auto actual y material representativo de las siete áreas.
- [ ] Asociar a cada imagen descripción, fecha, crédito y permiso de publicación.
- [ ] Entregar originales organizados y selección para portada, galerías y compartido social.

**Entregable:** carpeta final e índice de imágenes. **Aceptación:** Química/Fabricación tienen material o alternativa editorial explícita; render y fotografía están diferenciados; no hay archivos sin contexto. **Revisa:** Comunicación y cada área sobre sus imágenes.

#### COM-02 — Redactar historia y tres novedades

**Dueño propuesto:** referente de contenidos de Comunicación. **P0 · D6 · 3–4 h.** Depende de DIR-01 y evidencias técnicas; cierre con IND-04.

- [ ] Preparar 5–8 hitos fechados sin convertir planes futuros en logros.
- [ ] Redactar tres novedades reales: título, fecha, 80–150 palabras, imagen y enlace de destino.
- [ ] Elegir dos avances para destacar en el inicio y nombrar responsable de actualización.

**Entregable:** documento editorial con las tres noticias y cronología. **Aceptación:** cada hecho tiene confirmación y evidencia; no se inventan eventos para llenar espacio. **Revisa:** Comunicación y referente de cada hecho; Dirección valida historia institucional.

#### COM-03 — Consolidar sponsors y contraprestaciones

**Dueño propuesto:** referente de vínculos/sponsors de Comunicación, con apoyo de Industrial. **P0 · D5 · 2–3 h.** Depende de IND-02 y consulta IND-03.

- [ ] Validar lista vigente, URLs, logos y distinción institución/sponsor/proveedor.
- [ ] Redactar beneficios disponibles y duración, sin categorías comerciales inventadas.
- [ ] Confirmar receptor del contacto comercial y modalidad de colaboración publicable.

**Entregable:** catálogo de aliados y propuesta breve para empresas. **Aceptación:** toda alianza está confirmada; la propuesta PwC no se presenta como acuerdo; las promesas comerciales tienen aprobación de Dirección. **Revisa:** Dirección para acuerdos, Comunicación para logos e Industrial para costos.

#### COM-04 — Preparar un brief visual para la web

**Dueño propuesto:** referente de diseño visual de Comunicación + responsable web. **P0 · D6 · 2–3 h.** Depende de COM-01; puede iniciar con auditoría y recursos vigentes.

- [ ] Definir público principal del inicio, mensaje y orden de lectura; preparar bocetos de portada a 390 y 1440 px.
- [ ] Documentar paleta y tipografía existentes, jerarquía de títulos, tratamiento de fotos y CTA.
- [ ] Mostrar desde la primera pantalla identidad, proyecto eléctrico, objetivo y acción para empresas, con acceso para estudiantes.
- [ ] Revisar la propuesta contra el contenido real y evitar una plantilla genérica o copiar el aspecto de FIUBA.

**Entregable:** brief de una página y dos bocetos, utilizando criterios de `frontend-design`. **Aceptación:** la identidad UTN se conserva; el mensaje no depende de ver una animación completa; la propuesta es implementable con los recursos actuales. **Revisa:** vos por objetivo; Comunicación por identidad; Web por viabilidad.

#### COM-05 — Consolidar el paquete editorial para aprobación

**Dueño propuesto:** editor de Comunicación. **P0 · D7 · 2–4 h.** Depende de IND-04, COM-02, COM-03 y DIR-02; aprobación final mediante DIR-03.

- [ ] Consolidar texto español de Home, Equipo, Auto, Academia, Sponsors, Sumate, Competencia y Novedades.
- [ ] Preparar 6–8 FAQ breves y un glosario de términos/nombres para ES/EN/PT.
- [ ] Reemplazar avisos editoriales pendientes por contenido aprobado o una descripción honesta del estado actual.

**Entregable:** un documento con textos por página, fuentes de cifras y glosario, listo para DIR-03. **Aceptación:** estado del auto, presupuesto, ingreso y academia coinciden entre páginas; los datos no confirmados no se presentan como definitivos. **Revisa:** Comunicación y referentes de contenido; Dirección aprueba después en DIR-03. Las correcciones de esa revisión se incorporan a esta misma entrega sin abrir una dependencia circular.

### Dirección y coordinación del equipo

#### DIR-01 — Validar identidad e historia institucional

**Dueño propuesto:** coordinación general/capitán. **P0 · D2 · 1–2 h.** Depende de IND-01.

- [ ] Confirmar nombre, fecha de creación, cantidad actual de integrantes, siete áreas y responsables publicables.
- [ ] Entregar fechas/evidencias de hitos institucionales y vínculo con la facultad.
- [ ] Aprobar alcance de afirmaciones como «primero» y situación del objetivo Brasil 2027.

**Entregable:** ficha institucional fechada. **Aceptación:** se resuelve la diferencia entre antecedentes de 64 integrantes/6 áreas y datos actuales, sin asumir cifras. **Revisa:** Dirección; reciben COM-02 y COM-05.

#### DIR-02 — Definir ingreso, academia, competencia y contacto

**Dueño propuesto:** coordinación general, consultando formación y referente técnico. **P0 · D3 · 2–3 h.** Depende de IND-01.

- [ ] Confirmar estado de convocatoria, requisitos, disponibilidad, proceso y canal; mantener ingreso por convocatorias salvo decisión expresa distinta.
- [ ] Definir si Rookie/Baja/Fórmula están activos, en desarrollo o planificados, y cómo se progresa.
- [ ] Entregar referencia oficial de edición/categoría reglamentaria y aprobador de sus contenidos.
- [ ] Confirmar correo, responsable de respuesta y datos de ubicación publicables.

**Entregable:** cuatro fichas breves: ingreso, academia, competencia y contacto. **Aceptación:** datos actuales con responsable; fechas futuras se distinguen de confirmaciones; no se copian reglas de combustión para el auto eléctrico. **Revisa:** Dirección con responsables específicos; reciben COM-05 y WEB-01.

#### DIR-03 — Aprobar el corte de contenido

**Dueño propuesto:** coordinación general/capitán. **P0 · D7 · 1–2 h.** Depende de IND-02, IND-03, IND-04, COM-03 y borrador de COM-05.

- [ ] Revisar únicamente afirmaciones institucionales, presupuesto, compromisos y datos sensibles de publicación.
- [ ] Resolver cada discrepancia con una redacción concreta o una exclusión justificada.
- [ ] Registrar versión y aprobación; devolver correcciones puntuales a Comunicación.

**Entregable:** paquete con aprobación registrada y lista cerrada de excepciones. **Aceptación:** ninguna frase importante queda «a revisar» sin salida editorial. **Revisa:** Dirección; vos controlás que la decisión llegue a Web.

### Responsable web — implementación posterior

Estas tareas se delegan a quien mantenga la web. Aquí se definen resultados y comprobaciones; no se implementaron durante la preparación del plan.

#### WEB-01 — Resolver contacto y navegación hacia consultas

**P0 · D5 · 2–3 h.** Depende de DIR-02.

- [ ] Ofrecer correo institucional visible y enlace `mailto:`; evitar obligar a usar Gmail.
- [ ] Llevar `/contacto` a información de contacto pertinente, no solo a ingreso.
- [ ] Revisar que el CTA comercial y el de postulaciones tengan destinos acordes a su objetivo.

**Archivos:** `src/routes.js`, `src/App.jsx`, `src/components/Footer.jsx`, `src/pages/Sponsors.jsx`; componentes adicionales solo si hacen falta.

**Entregable:** vista previa del recorrido de contacto. **Aceptación:** correo y destinatario correctos; funciona sin sesión de Gmail; la ruta directa carga y el recorrido de ingreso conserva su política. No agregar formulario sin un circuito de recepción definido. **Revisa:** Web y persona que atiende el correo.

#### WEB-02 — Implementar la portada y jerarquía aprobadas

**P0 · D9 · 4–6 h.** Depende de COM-04 y DIR-03.

- [ ] Integrar mensaje y CTA en la primera pantalla utilizando el brief y recursos reales.
- [ ] Reducir reiteraciones y mantener navegación clara hacia Auto, Academia y Sponsors.
- [ ] Verificar 390 × 844 y 1440 × 1000, foco visible y preferencia de movimiento reducido.

**Archivos:** `src/pages/Home.jsx`, `src/styles/home.css`, `src/components/Header.jsx`, locales.

**Entregable:** portada implementada y capturas comparables. **Aceptación:** se entiende proyecto/objetivo sin scroll y el CTA principal resulta visible; sin texto cortado ni desborde horizontal; animación no bloquea lectura. **Revisa:** Comunicación y vos.

#### WEB-03 — Integrar información aprobada en todas las páginas

**P0 · D11 · 10–16 h.** Depende de COM-01, COM-05 y DIR-03.

- [ ] Cargar ficha técnica, estado, historia, galerías, FAQ, convocatoria y academia.
- [ ] Actualizar sponsors/presupuesto con fecha y significado; mantener criterios comunes entre páginas.
- [ ] Resolver avisos de edición visibles y actualizar la landing institucional con los mismos hechos, respetando su estructura independiente.

**Archivos:** `src/pages/Team.jsx`, `Car.jsx`, `Academy.jsx`, `FormulaStudent.jsx`, `JoinUs.jsx`, `Sponsors.jsx`; `src/components/Gallery.jsx`, `FundingProgress.jsx`, `SponsorsCarousel.jsx`; locales, galerías y `wordpress-landing/formula-e-student.html`.

**Entregable:** vista previa de las páginas completas. **Aceptación:** cifras/textos coinciden con versión aprobada; toda foto tiene alternativa descriptiva; no se atribuyen pruebas inexistentes; el render se identifica. **Revisa:** cada área valida su bloque, Comunicación revisa presentación.

#### WEB-04 — Publicar contenido de novedades en la vista previa

**P0 · D11 · 3–6 h.** Depende de COM-02 y DIR-03.

- [ ] Cargar tres novedades con fecha, imagen y destino válido en el formato de datos existente.
- [ ] Si hay acceso y capacidad para automatizar Instagram, comprobar el recorrido completo; si no, usar carga manual aprobada para esta versión.
- [ ] Mostrar dos avances en el inicio y documentar cómo actualizarlos.

**Archivos:** `public/data/instagram.json`, `src/pages/News.jsx`, `src/pages/Home.jsx`; `.github/workflows/instagram.yml` solo si se activa la integración.

**Entregable:** noticias visibles y procedimiento breve. **Aceptación:** la página deja el estado vacío; tres entradas reales se renderizan; enlaces e imágenes cargan; un fallo de feed no rompe navegación. No pedir credenciales en documentos compartidos. **Revisa:** Comunicación y Web.

#### WEB-05 — Sincronizar idiomas y metadatos

**P0 · D12 · 5–8 h.** Depende de WEB-02, WEB-03 y WEB-04.

- [ ] Sincronizar ES/EN/PT a partir del paquete aprobado y glosario, incluyendo controles de navegación.
- [ ] Revisar título, descripción, canonical e imagen compartida de las rutas importantes.
- [ ] Actualizar sitemap y `llms.txt` y comprobar coherencia con la landing WordPress.

**Archivos:** `src/locales/es.json`, `en.json`, `pt.json`, `src/components/Header.jsx`, `index.html`, `public/sitemap.xml`, `public/llms.txt`; gestión de metadatos por ruta según implementación.

**Entregable:** versión multilingüe y tabla de URLs/metadatos comprobados. **Aceptación:** sin claves sin traducir; cifras coincidentes; términos técnicos revisados; las rutas internas no declaran indiscriminadamente el inicio como canonical. **Revisa:** Comunicación y un referente competente en cada idioma; Web valida etiquetas.

#### WEB-06 — Verificación completa y entrega de versión candidata

**P0 · D14 · 6–10 h.** Depende de WEB-01 a WEB-05.

- [ ] Ejecutar `npm run build` y registrar resultado; corregir fallos atribuibles a los cambios.
- [ ] Recorrer las ocho páginas, enlaces, recarga directa, menú, anclas, idiomas, noticias y contacto.
- [ ] Revisar anchos 390/768/1440 px, un teléfono real, navegación por teclado, contraste y movimiento reducido.
- [ ] Probar visor con un logo de prueba: carga, ubicación/tamaño, retorno al sitio y alternativa si no puede usarse; nunca interpretar el visor como reserva comercial.
- [ ] Validar la landing dentro del tema WordPress en vista previa, además de la aplicación principal.
- [ ] Entregar capturas, lista de comprobaciones y defectos resueltos/pendientes.

**Entregable:** versión candidata y reporte con URL/ruta, resultado y evidencia por recorrido. **Aceptación:** cero fallos que impidan leer, navegar, contactar o entender el estado del proyecto; contenido aprobado intacto. Usar `web-design-guidelines` para revisión y `webapp-testing` si se automatiza el navegador. **Revisa:** Web; Comunicación valida visual; vos aceptás el cierre operativo.

## 6. Seguimiento sin perseguir a todo el equipo

Estados del tablero: **Por asignar → Asignada → En curso → En revisión → Aprobada**. «Bloqueada» exige indicar qué falta, a quién se pidió y qué tarea afecta. Todos los registros se crean en «Por asignar» porque todavía no se acordaron nombres ni fechas reales.

- Una reunión inicial de 25 minutos para responsables y formato.
- Dos revisiones semanales de 15 minutos, centradas en bloqueos y entregas próximas.
- Cada responsable actualiza el tablero antes de la revisión; no es necesario que asistan todos a discutir cada pieza.
- El revisor devuelve una lista consolidada de correcciones en un día hábil como objetivo interno acordado.
- Si una entrega crítica se demora un día hábil, su dueño propone nueva fecha o alternativa editorial; vos resolvés la dependencia con Dirección si corresponde.
- Desde D7, los cambios son correcciones factuales o bloqueos. Las nuevas funcionalidades van a una siguiente versión.

## 7. Mensaje de lanzamiento que podés copiar

> Equipo, vamos a cerrar la web con una entrega concreta por área. Diseño: ficha mecánica y render vigente. Electrónica: ficha eléctrica y ensayos realizados. Fabricación: estado real del auto, fotos y faltantes. Química: materiales/aplicaciones y fotos. CNC: piezas, funciones y fotos. Comunicación: selección visual, historia, tres novedades, sponsors y textos. Industrial va a consolidar presupuesto, necesidades y estado del proyecto. A coordinación le pedimos validar datos institucionales, ingreso y academia.
>
> Cada jefe de área debe nombrar un responsable de entrega. Necesitamos datos con fecha, fuente y aprobación para publicar; no hace falta escribir textos publicitarios. Las tareas y criterios están en el plan. Propongo primera entrega técnica en D3 y contenido aprobado en D7, contando desde que confirmemos disponibilidad. Si algo todavía no está definido, indíquenlo; no lo completen con una suposición. El responsable web implementará sobre la versión aprobada.

Es un borrador; no fue enviado al equipo.

## 8. Skills encontradas y cómo encajan

Se consultaron sus instrucciones públicas el 15/09/2026. **Lectura y aplicación en este plan no equivalen a instalación persistente**: no se instalaron paquetes ni se modificó la configuración del asistente.

| Skill / fuente primaria | Uso en este trabajo | Responsable beneficiado |
|---|---|---|
| [Superpowers — writing-plans](https://github.com/obra/superpowers/blob/main/skills/writing-plans/SKILL.md) | Aplicada para separar entregables, dependencias y aceptación; adaptada a delegación humana. | Industrial |
| [Anthropic — frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | Criterios aplicados al brief COM-04 y portada WEB-02: identidad, contenido real, tipografía, jerarquía y revisión visual. | Comunicación y Web |
| [Vercel — web-design-guidelines](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) | Seleccionada para revisión de interfaz en WEB-06; al ejecutarla hay que consultar su guía vigente. | Web |
| [Anthropic — webapp-testing](https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md) | Seleccionada para comprobar recorridos y capturas con Playwright durante implementación. No se ejecutaron esas pruebas en este turno. | Web |
| [Vercel — react-best-practices](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md) | Complemento opcional si se detectan problemas medidos de rendimiento. Aplicar solo reglas pertinentes a React/Vite, no trasladar instrucciones exclusivas de Next.js. | Web |

No se necesita instalar una colección extensa para delegar. Primero se cierra contenido y capacidad; las skills ayudan al responsable web a ejecutar y revisar su parte. La preservación de la identidad existente prevalece sobre preferencias estéticas genéricas de cualquier skill.

## 9. Qué se difiere para no frenar el cierre

Modo claro, rediseño integral, tienda, nuevas redes, directorio exhaustivo, nuevas animaciones y automatización avanzada del feed. El render nuevo DIS-02 puede diferirse si la versión actual sigue identificada y no induce a error.

El cierre exige datos honestos y aprobados, contenido útil, recorridos funcionales y mantenimiento asignado. No exige terminar el auto ni producir nuevos ensayos para que la página parezca más avanzada.
