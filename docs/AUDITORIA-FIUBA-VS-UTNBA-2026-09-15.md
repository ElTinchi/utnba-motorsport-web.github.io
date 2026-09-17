# Auditoría comparativa: FIUBA Racing y UTN BA Motorsport

Fecha de revisión: **15 de septiembre de 2026**.

Objetivo: comparar ambos sitios punto por punto y definir qué necesita UTN BA Motorsport para cerrar una primera versión completa. Incluye también lo que FIUBA podría incorporar de nuestra web. Es un diagnóstico: no se modificó ni publicó el sitio.

## 1. Diagnóstico principal

**A UTN no le falta otra gran ampliación de páginas: le falta completar la evidencia del proyecto, resolver algunos recorridos y aprobar los datos que ya comunica.** La estructura, la identidad, la academia, los idiomas y la propuesta para empresas ya están desarrollados.

FIUBA resulta más concreta al mostrar su vehículo, su evolución y su actividad reciente. UTN explica mejor su propuesta formativa y cómo puede colaborar una empresa, pero todavía deja preguntas importantes abiertas: qué partes del auto están listas, cuáles son sus especificaciones, qué ocurrió recientemente y a quién contactar sin depender de Instagram o Gmail.

No corresponde equiparar las trayectorias deportivas: FIUBA declara una participación en 2026; UTN comunica Brasil 2027 como objetivo. Nuestra web puede estar terminada antes de que el auto compita, siempre que explique con precisión su estado actual.

### Los ocho frentes para cerrar

1. Estado real del monoplaza y ficha técnica publicable.
2. Historia con fechas y pruebas de los avances.
3. Fotos faltantes y material actual del taller.
4. Noticias reales, con responsable de actualización.
5. Contacto universal y separado de las postulaciones.
6. Presupuesto y propuesta comercial aprobados y fechados.
7. Información operativa sobre ingreso y academia.
8. Portada, coherencia de textos y verificación final de navegación.

El pedido listo para completar está en [RELEVAMIENTO-EQUIPO-CIERRE-WEB.md](RELEVAMIENTO-EQUIPO-CIERRE-WEB.md).

## 2. Qué se revisó y límites

- **FIUBA:** inicio, equipo, auto, noticias, sponsors, contacto; las cinco respuestas de preguntas frecuentes; contenido de competencia abierto desde el botón del inicio.
- **UTN:** las ocho páginas principales renderizadas en Chrome, HTML público, archivo público de novedades, robots, sitemap y disponibilidad HTTP del visor.
- **Visual:** portadas en escritorio de 1440 × 1000 y emulación móvil de 390 × 844, con medición del ancho del documento y posición del título.
- **Repositorio:** páginas React, textos en español, configuración de idiomas, navegación, galerías, sponsors, financiación, metadatos, workflow de Instagram y antecedentes internos seleccionados.
- La carpeta `wordpress-landing/` corresponde a otra landing institucional. El archivo CSS abierto en el editor **no es la fuente principal del dominio de Motorsport**, que utiliza la aplicación de `src/`.

El lector web inicial no accedió a UTN y devolvió una versión antigua de sponsors de FIUBA. Se resolvió consultando los sitios directamente y renderizando JavaScript en Chrome: ambos respondieron. **No se diagnosticó una caída ni se usó la versión antigua para comparar sponsors.**

No se enviaron formularios ni correos. No se comprobó la entrega del formulario de FIUBA, no se auditó todo el visor 3D, no se midieron Core Web Vitals ni se hizo una certificación de accesibilidad. La revisión móvil visual se limita a las portadas; no equivale a probar cada página en dispositivos físicos. Las afirmaciones deportivas y técnicas de FIUBA se describen como contenido de su sitio, no como resultados independientemente certificados.

## 3. Comparación punto por punto

Prioridades: **P0** = resolver antes de declarar cerrada la web; **P1** = mejora importante para la versión completa; **P2** = evolución opcional. Una corrección editorial puede cerrar un P0 aunque el equipo aún no tenga el dato definitivo.

| Tema | FIUBA: observado | UTN: observado | Acción recomendada para UTN | Prioridad |
|---|---|---|---|---|
| 1. Primera pantalla | Identidad y acciones visibles desde el inicio. | Predomina logo/render; la explicación y CTA del contenido aparecen más abajo. | Subir una frase sobre el proyecto eléctrico y un botón para empresas a la primera pantalla. | P0 |
| 2. Mensaje principal | Presentación general del equipo. | Diferenciación clara por vehículo eléctrico y objetivo Brasil 2027. | Conservar el mensaje, aclarando qué es objetivo y qué está confirmado. | P0 |
| 3. Navegación | Auto figura en el menú principal. | Auto y Academia están dentro de «El equipo». | Evaluar «Proyecto» como nombre del desplegable o dar acceso directo a Auto. No requiere sumar páginas. | P1 |
| 4. Equipo por áreas | Explica responsabilidades técnicas y de gestión. | Siete áreas, descripciones y galerías. | Mantener la división real de UTN; sumar entregables concretos y responsables públicos si se aprueba. | P1 |
| 5. Historia | Cronología fechada del proyecto. | Relato institucional, sin una línea temporal equivalente. | Agregar 5–8 hitos propios verificables. | P1 |
| 6. Personas y tamaño | No se identificó un directorio nominal en Equipo. | No hay nómina pública ni cifra actual del equipo en esa página. | Publicar cantidad vigente, coordinación y referentes; directorio completo opcional. | P1 |
| 7. Identidad del auto | Vehículo identificado por nombre. | «Nuestro primer monoplaza eléctrico». | Confirmar nombre/código si existe; no inventarlo ni bloquear el cierre por falta de nombre. | P2 |
| 8. Ingeniería del auto | Detalle por subsistemas y componentes concretos. | Ficha de cuatro datos generales; especificaciones anunciadas para más adelante. | Publicar arquitectura y parámetros aprobados con estado de validación. | P0 |
| 9. Evidencia visual | Fotografías del auto y subsistemas. | Render y fotos del equipo/áreas. | Incorporar vistas actuales del auto físico, componentes y ensamble. Separar claramente render y fotografía. | P0 |
| 10. Fotos por área | Material visual asociado a sus áreas. | Química y Fabricación muestran aviso de fotos pendientes. | Pedir 2–3 fotos por área faltante; si no existen, retirar el aviso de edición y mostrar un bloque terminado de texto. | P0 |
| 11. Estado del proyecto | La historia comunica avances y participación. | Home y Sponsors hablan de ensamblaje final; Auto también usa «puesto en pista». | Unificar el estado con fecha y distinguir diseñado, fabricado, ensamblado y probado. | P0 |
| 12. Resultados | Publica un resultado en FAQ. | Primer proyecto, objetivo futuro. | Mostrar hitos/ensayos propios; no crear una sección de resultados vacía. | P1 |
| 13. Noticias | Cuatro entradas renderizadas, con fechas. | Página en estado «Próximamente». | Publicar al menos tres novedades o resolver explícitamente el alcance editorial. | P0 |
| 14. Actividad en Home | Adelantos de noticias. | Mucho contenido institucional, sin novedades equivalentes. | Añadir 2–3 avances después del primer bloque de presentación. | P1 |
| 15. Preguntas frecuentes | Cinco preguntas desplegables. | Las respuestas están repartidas entre varias páginas. | Reunir 6–8 respuestas breves aprobadas. | P1 |
| 16. Competencia | Explicación diferenciada de categorías y pruebas. | Página extensa que reconoce adaptación pendiente a Brasil. | Validar edición/categoría y retirar o contextualizar detalles que todavía no correspondan al reglamento aplicable. | P0 |
| 17. Academia | No se observó un recorrido formativo separado equivalente. | Rookie → Baja SAE → Fórmula SAE. | Preservar este diferencial y precisar qué etapas están activas, en desarrollo o planificadas. | P0 |
| 18. Convocatorias | Anuncio vigente en Noticias y canal de contacto. | Política por convocatorias y derivación a Instagram. | Mostrar estado explícito, fecha de actualización y requisitos generales. Mantener la política de no recibir postulaciones fuera de convocatoria. | P0 |
| 19. Sponsors actuales | Listado por niveles comerciales. | Doce entradas en carrusel, incluida UTN BA. | Aprobar lista vigente y distinguir institución, sponsor y proveedor; categorías solo si existen acuerdos reales. | P1 |
| 20. Propuesta para empresas | Predomina el reconocimiento de patrocinadores. | Explica proceso de colaboración y necesidades económicas. | Mantener esta ventaja; agregar entregables concretos y contacto comercial sencillo. | P0 |
| 21. Presupuesto | No se encontró desglose equivalente en las páginas revisadas. | 62% cubierto y montos de referencia. | Fecha, alcance del presupuesto y separación entre recibido, comprometido y pendiente. | P0 |
| 22. Visor de marca | No se observó herramienta equivalente. | Visor enlazado desde Auto y Sponsors; endpoint responde 200. | Conservar; probar carga, interacción y alternativa estática antes de darlo por cerrado. | P1 |
| 23. Contacto | Página propia con formulario, correo y dirección. | Correo institucional en footer; CTA abre Gmail; `/contacto` deriva a Sumate. | Ofrecer `mailto:` y correo copiable; dirigir consultas comerciales/general a un destino pertinente. | P0 |
| 24. Redes | Accesos a perfiles sociales. | Instagram, LinkedIn, YouTube y TikTok. | Validar titulares y URLs; no hace falta abrir más cuentas. | P1 |
| 25. Idiomas | No se observó selector equivalente. | Español, inglés y portugués. | Revisar traducciones técnicas y sincronizar datos del proyecto. | P1 |
| 26. SEO | Algunas páginas entregan contenido en HTML; noticias requieren JS. | Metadatos base, sitemap, robots y datos estructurados; contenido principal depende de JS. | Diferenciar título/description/canonical por ruta y verificar indexación. | P1 |
| 27. Móvil | Portada se adapta en la medición realizada. | Portada también se adapta, sin desborde horizontal medido. | El problema constatado es la jerarquía inicial, no un supuesto desborde. Probar interiores y menús. | P0 |
| 28. Accesibilidad | Hay controles y contenido desplegable; auditoría completa pendiente. | Existen foco visible, nombres accesibles y reglas de movimiento reducido. | Completar teclado, alternativas de imagen descriptivas y etiquetas traducidas. | P1 |
| 29. Medición | No se estableció su configuración interna. | Plausible/Umami están comentados en el HTML local. | Elegir una herramienta si se necesita medir consultas; no afirmar que ambas están funcionando. | P2 |
| 30. Mantenimiento | Publicaciones recientes dan señal de actividad. | Falta visible de noticias, porcentajes fijos y avisos editoriales. | Asignar responsable, periodicidad y fuente única de datos. | P0 |

Fuentes de la comparación: [inicio FIUBA](https://www.fiubaracing.com.ar/), [equipo](https://www.fiubaracing.com.ar/equipo), [auto](https://www.fiubaracing.com.ar/auto), [noticias](https://www.fiubaracing.com.ar/noticias), [sponsors](https://www.fiubaracing.com.ar/sponsors), [contacto](https://www.fiubaracing.com.ar/contacto); [inicio UTN](https://utnbamotorsport.com.ar/), [equipo](https://utnbamotorsport.com.ar/el-equipo), [auto](https://utnbamotorsport.com.ar/el-auto), [academia](https://utnbamotorsport.com.ar/la-academia), [competencia](https://utnbamotorsport.com.ar/formula-student), [sumate](https://utnbamotorsport.com.ar/sumate), [sponsors](https://utnbamotorsport.com.ar/sponsors), [novedades](https://utnbamotorsport.com.ar/novedades).

## 4. Hallazgos que más afectan a nuestra web

### 4.1. La portada demora la explicación y la acción

Medición con Chrome después de cargar la página, sin desplazamiento:

| Viewport | UTN: inicio vertical del H1 explicativo | FIUBA: inicio vertical del H1 |
|---|---:|---:|
| 1440 × 1000 | 1166 px | 174 px |
| 390 × 844 | 994 px | 96 px |

UTN sí tiene título y botones: **están después de la primera pantalla**. En móvil se ve el botón Sumate del encabezado, pero no una acción equivalente para sponsors dentro de la portada.

Recomendación: integrar al hero una explicación breve, estado/objetivo y dos acciones: «Apoyá al equipo» y «Conocé el auto». La animación del circuito puede permanecer. Recortar la reiteración entre Motivación, Sobre nosotros y Academia para llegar antes a evidencia concreta. Esto es criterio editorial, no un resultado de una prueba de conversión.

### 4.2. La ficha técnica todavía no permite conocer el vehículo

La [página Auto de UTN](https://utnbamotorsport.com.ar/el-auto) informa categoría, propulsión, competencia y generación. Son datos de contexto; no explican la solución de ingeniería.

Pedir: arquitectura de tracción, motor/inversor, batería, estructura, suspensión, frenos, neumáticos y masa. Publicar únicamente campos aprobados y rotular cada cifra como **objetivo de diseño**, **especificación definida** o **valor medido**. Una ficha parcial pero concreta alcanza; no hace falta esperar la congelación total del diseño.

La frase «puesto en pista» puede sugerir una etapa cumplida, mientras otras páginas describen un auto aún por terminar. Debe confirmarse si ya hubo prueba dinámica. Si no ocurrió, ajustar la redacción a un objetivo futuro.

### 4.3. Novedades está implementada, pero no tiene contenido

Verificación pública: [`/data/instagram.json`](https://utnbamotorsport.com.ar/data/instagram.json) respondió 200 con `updatedAt: null` y `posts: []`. Chrome mostró el estado vacío de [Novedades](https://utnbamotorsport.com.ar/novedades).

El código de [News.jsx](../src/pages/News.jsx) ya contempla un feed. El [workflow](../.github/workflows/instagram.yml) existe y depende de configuración privada; **no se inspeccionaron secretos ni ejecuciones de GitHub**, por lo que no se afirma cuál es la causa exacta.

Dos caminos válidos: poner en marcha y verificar la actualización completa hasta producción, o cargar novedades aprobadas manualmente usando el formato existente. La automatización no debe impedir publicar contenido inicial. No pedir tokens por chat ni anotarlos en este documento.

### 4.4. Contacto e ingreso son recorridos distintos

[routes.js](../src/routes.js) define el correo como URL de composición de Gmail y redirige `/contacto` a `/sumate`. «Coordinar una reunión» también utiliza ese enlace.

Una empresa que usa Outlook no debería necesitar Gmail para escribir. Solución mínima: `mailto:motorsports@frba.utn.edu.ar`, correo visible/copiable y contacto comercial claro. Un formulario puede ayudar, pero solo si hay receptor, manejo de errores y recepción comprobada. No es obligatorio para cerrar.

El comentario de `routes.js` afirma que hay formularios en Sumate/Sponsors, pero los componentes actuales no los contienen. Actualizar también esa documentación para evitar diagnósticos futuros incorrectos.

### 4.5. El presupuesto necesita una fecha y una definición

La [página de sponsors](https://utnbamotorsport.com.ar/sponsors) muestra USD 31.780 confirmados, USD 9.450 en materiales/servicios y USD 10.000 en aportes económicos. Sumados, implican **USD 51.230 de referencia**, de los cuales 31.780 son aproximadamente **62,03%**. El redondeo a 62% es coherente.

Lo pendiente no es corregir esa cuenta: es confirmar qué incluye el total, cuándo se actualizó y qué significa «confirmado». ¿Recibido, comprometido o valuado en canje? ¿Incluye viaje, inscripción, ensayos y logística, o solo el auto? ¿Los otros dos importes son necesidades pendientes? El lector debe poder entenderlo sin inferirlo de la barra.

Pedir aprobación de esos datos y de las afirmaciones sobre contrato y modalidad de aporte. La auditoría no verifica contratos ni compromisos financieros internos.

### 4.6. La academia necesita estado operativo

La propuesta Rookie → Baja → Fórmula es un diferencial fuerte. Sin embargo, el texto puede interpretarse como tres programas plenamente activos. Confirmar para cada etapa: actividad actual, proyecto tangible, responsable, requisitos, duración aproximada y criterio de paso.

No trasladar automáticamente referencias generales de Baja o Fórmula Student al programa local. En la página de competencia se publica una advertencia de adaptación pendiente junto a puntajes específicos. El responsable técnico debe entregar la edición/categoría de referencia y aprobarlos; **no se concluye aquí que esos puntajes sean incorrectos**.

### 4.7. SEO y accesibilidad: existe una base, faltan detalles

- Las páginas Home, Auto y Sponsors renderizadas conservaron el mismo título general; el código utiliza un canonical base del inicio. Crear metadatos por ruta y verificar el HTML que reciben los rastreadores.
- Robots y sitemap públicos responden. No hay fundamento para afirmar que el sitio carece de SEO ni que está penalizado.
- UTN entrega inicialmente un contenedor React; una extracción sin JavaScript no ve el contenido. Evaluar prerenderizado como mejora posterior si la indexación o las vistas compartidas lo requieren.
- Las galerías usan textos alternativos genéricos como área + número. Pedir pies que describan pieza, tarea y contexto.
- Hay etiquetas de navegación escritas directamente en español en `Header.jsx`; deben acompañar el cambio de idioma.
- Comprobar foco, cierre con Escape, funcionamiento del menú y controles del visor. La existencia de ARIA no prueba por sí sola accesibilidad completa.
- No se midieron velocidad real, peso transferido total ni estabilidad visual. Evitar prometer una mejora de rendimiento sin medir antes.

## 5. Qué le falta a FIUBA frente a la nuestra

Estas son oportunidades **no observadas en las páginas revisadas**, no afirmaciones sobre toda la organización:

1. **Recorrido de formación explícito:** UTN presenta tres niveles y explica continuidad entre generaciones.
2. **Idiomas:** nuestro selector contempla español, inglés y portugués.
3. **Necesidad de financiación cuantificada:** UTN comunica avance económico y monto pendiente, aunque necesita fecha y alcance.
4. **Proceso comercial explicado:** nuestra página describe cómo convertir un aporte en materiales, servicios o una necesidad específica.
5. **Visualización de marca:** UTN enlaza una herramienta para explorar el logo sobre el auto.
6. **Ingreso con página dedicada:** UTN explica que hay convocatorias y selección; debe completar su estado actual.

No conviene copiar de FIUBA la categoría de combustión, su organigrama o sus categorías de sponsor: responden a otro proyecto. Sí conviene adoptar el principio de **mostrar pruebas concretas junto a la explicación**.

También hay aspectos que revisar en FIUBA: el vínculo de TikTok del bloque de contacto difiere del footer; la historia y la FAQ expresan hitos de competencia con referencias temporales que convendría armonizar. En una carga móvil aparecieron imágenes de sponsors fallidas, pero no se reprodujo sistemáticamente: es una observación puntual, no evidencia de una falla permanente. Los contadores animados aparecieron en cero antes de desplazarse; **no se interpretaron como cifras reales ni como un bug confirmado**.

## 6. Material que ya existe y hay que validar, no volver a inventar

| Antecedente local | Qué puede aportar | Qué falta confirmar |
|---|---|---|
| [Propuesta PwC](../UTNBA_Motorsport_Propuesta_PWC.md) | Presentación, formación, hoja de ruta y argumentos comerciales. | Menciona 64 estudiantes y 6 áreas; la web ya muestra 7. Actualizar cifras y no convertir a PwC en sponsor confirmado por existir una propuesta. |
| [Presentación 1–30](../Presentacion_Final_UTNBAMOTORSPORT__%28Frente%20a%20directivos%29-1-30.md) | Antecedentes de chasis, suspensión, planificación y referencia a motor Emrax. | Modelo final, vigencia, disponibilidad y qué puede publicarse. |
| [Presentación 31–60](../Presentacion_Final_UTNBAMOTORSPORT__%28Frente%20a%20directivos%29-31-60.md) | Procesos, fabricación y desarrollo de piezas. | Estado actual y fotografías que prueben lo ya realizado. |
| [Presentación 61–94](../Presentacion_Final_UTNBAMOTORSPORT__%28Frente%20a%20directivos%29-61-94.md) | Electrónica, controlador, materiales y tareas previstas. | Distinguir trabajo planificado de validación completada. |
| [Recursos gráficos](RECURSOS-GRAFICOS.md) | Inventario previo de material visual. | Selección final y permiso de publicación. |
| [Pendientes](PENDIENTES.md) | Historial de implementación. | Está fechado antes de esta auditoría y algunos puntos ya no describen el código actual. |

La propuesta interna utiliza una afirmación de primacía nacional más amplia que la web. No publicarla automáticamente: pedir respaldo específico o conservar el alcance institucional de «primer monoplaza de la facultad».

## 7. Plan de cierre, sin ampliar indefinidamente el alcance

### Etapa A — cerrar decisiones y datos

Una persona coordina la respuesta al [relevamiento](RELEVAMIENTO-EQUIPO-CIERRE-WEB.md). Cada responsable confirma su parte. Datos sin cerrar se publican como objetivos claramente identificados o se omiten con una descripción completa del estado actual.

### Etapa B — resolver desde la web

- Reubicar explicación y CTA dentro de la primera pantalla.
- Corregir contacto y el destino de `/contacto`.
- Integrar ficha técnica, hitos, fotos y estado del auto.
- Cargar al menos tres novedades aprobadas; verificar que lleguen al dominio público.
- Mostrar convocatoria vigente/cerrada con fecha y sin contradecir la política del equipo.
- Armonizar presupuesto, estado del auto y academia en ES/EN/PT, metadatos, `llms.txt` y landing institucional cuando corresponda.
- Resolver los avisos de trabajo pendiente: contenido aprobado o alternativa editorial terminada.

### Etapa C — revisión final

- [ ] Las ocho páginas tienen contenido deliberadamente terminado.
- [ ] La primera pantalla explica qué hace UTN y ofrece una acción útil.
- [ ] Un sponsor puede escribir sin cuenta de Gmail.
- [ ] La ficha distingue diseño, objetivo y medición.
- [ ] Hay fecha del estado del proyecto y del presupuesto.
- [ ] No hay fotos pendientes anunciadas al público ni afirmaciones de ensayos no confirmadas.
- [ ] Novedades tiene contenido real y responsable.
- [ ] Ingreso comunica estado y canal correctos.
- [ ] Academia y competencia fueron aprobadas por los responsables.
- [ ] Menú, enlaces internos, anclas y recarga de rutas funcionan.
- [ ] Se revisaron todas las páginas a 390 px y escritorio, además de un teléfono real.
- [ ] Se probaron idioma, teclado, visor y alternativa si el visor no carga.
- [ ] Se verificaron imagen de compartido y metadatos de rutas importantes.
- [ ] Se definió quién actualiza cambios de sponsor, presupuesto, convocatoria y noticias.

**Puede esperar:** directorio completo de personas, blog avanzado, nuevas redes, animaciones adicionales, modo claro, tienda, donaciones automáticas o rediseño completo. Ninguna de esas ampliaciones resuelve los vacíos principales.

## 8. Dónde implementar cuando se apruebe el trabajo

| Trabajo | Archivos principales |
|---|---|
| Portada y jerarquía | `src/pages/Home.jsx`, `src/styles/home.css` |
| Textos y datos visibles | `src/locales/es.json`, `en.json`, `pt.json` |
| Equipo, hitos, imágenes | `src/pages/Team.jsx`, `src/components/Gallery.jsx`, `src/assets/galerias/` |
| Auto y especificaciones | `src/pages/Car.jsx` y locales |
| Sponsors y presupuesto | `src/pages/Sponsors.jsx`, `src/components/FundingProgress.jsx`, `src/components/SponsorsCarousel.jsx` |
| Contacto y navegación | `src/routes.js`, `src/App.jsx`, `src/components/Header.jsx`, `src/components/Footer.jsx` |
| Noticias | `src/pages/News.jsx`, `public/data/instagram.json`, `.github/workflows/instagram.yml` |
| SEO y coherencia | `index.html`, `public/sitemap.xml`, `public/llms.txt`, metadatos por ruta a incorporar |
| Landing institucional | `wordpress-landing/formula-e-student.html`; CSS solo si cambia la presentación |

Esta auditoría documenta el estado observado y las decisiones necesarias; no sustituye la aprobación técnica/comercial del equipo ni considera implementadas las recomendaciones.
