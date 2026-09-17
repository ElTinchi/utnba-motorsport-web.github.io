# Novedades

Archivo editorial: src/data/news.json, con versiones es, en y pt. Seis notas completas en /novedades con enlaces por ancla, última nota destacada y archivo cronológico.

## Fuentes
Fechas de inicio (octubre–noviembre de 2025), Road Show (26/04/2026), chasis/presentación (28/07/2026) y Expo Carreras (16/09/2026): confirmadas por el responsable del equipo.
Campus (21/08/2026): publicaciones del equipo y UTN Buenos Aires en https://ar.linkedin.com/company/utn-ba-motorsports .
Carburando (07/05/2026, fecha de publicación): enlace al artículo incluido en sourceUrl.

## Imágenes incorporadas
- Chasis: foto del equipo completo, public/assets/img/Nosotros.jpg, según indicación del usuario.
- Campus: DSC04472.jpg (portada), DSC04468.jpg y DSC04579.jpg (galería), carpeta 1DwybIGSBSoBboMc_WPa2YONrAR5MJqrA. Asignación a la jornada del Campus del 21 de agosto de 2026 confirmada por el usuario.
- Colapinto: IMG_1615.HEIC, carpeta 1coXq9erjy_eOgTchUmX8ZoEi0OjJcBCn.
- Carburando: IMG_1425.JPG, seleccionada de la carpeta 1mCiTczmf-pAmvQUOjOnWHQSL2jopx_QZ: integrante del equipo durante una entrevista.
- Derivados WebP en public/assets/img/news. Se conserva el encuadre completo, con texto alternativo traducido.
- Pendientes: render del circuito y foto vertical del simulador adjuntos al chat, sin archivo accesible en el entorno. Expo Carreras e inicio conservan composiciones tipográficas hasta recibir fotos correspondientes.

## Mantenimiento
Cada nota tiene id estable, fecha visible, dateTime cuando el día es conocido, categoría, título y paragraphs. image/imageAlt son opcionales. gallery contiene objetos src/alt. sourceUrl permite enlazar una fuente externa.
Actualizar los tres idiomas al agregar notas. La página no depende de la API de Instagram.
Validación: build de Vite, imágenes y textos, seis notas en navegador, escritorio/móvil y temas claro/oscuro sin desbordamiento horizontal.

## Enlaces de Instagram aportados por el usuario

- road-show-colapinto: https://www.instagram.com/p/DXpf5P3iQg0/
- circuito-virtual-campus: https://www.instagram.com/reel/DccDFyuvX3o/
- chasis-presentacion: https://www.instagram.com/p/DbbG_oSkc2T/
- carburando-2026: https://www.instagram.com/reel/DYVWCrIpAit/

El enlace institucional acompaña la nota del chasis/presentación con una etiqueta específica. Los enlaces se incorporan según la identificación del usuario; no implican una verificación independiente del contenido ni de las fechas en Instagram. Carburando conserva además su fuente periodística.

## Galería de la presentación ante autoridades

Evento del 28/07/2026, asignación confirmada por el usuario. Portada: foto del equipo completo. Se suman dos imágenes seleccionadas de las carpetas aportadas:
- exposicion-240.jpg: https://drive.google.com/file/d/1XzMlfoTWlGPDf2Uyvc1rT5BXKY4tTPN3/view
- IMG_6815.HEIC: https://drive.google.com/file/d/1pegN-eSfqxNxyJJHTnknYMtKv1LC8L57/view

Versiones WebP locales con encuadre completo y textos alternativos en los tres idiomas. No se utilizaron las subcarpetas NO SUBIBLES.

## Imágenes solo de exhibición

Por indicación del usuario, hasta que esté el auto no se permite ampliar imágenes desde el sitio. Se quitaron los enlaces directos de portadas y galerías. Todas las imágenes React tienen draggable=false; se bloquea el menú contextual y arrastre sobre imágenes, con estilos para impedir selección y el menú de guardado móvil donde el navegador lo admite. Se mantienen la selección de texto, el zoom de accesibilidad y los enlaces de navegación y sponsors. Estas medidas dificultan la copia casual, pero no impiden capturas ni acceso directo a recursos públicos.
