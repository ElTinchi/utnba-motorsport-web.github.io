# SEO: operación y tareas externas

## Estado

- **Implementado y validado localmente:** HTML prerenderizado para las diez rutas públicas, Helmet para navegación cliente, catálogo central de metadatos y sitemap generado en cada build.
- **Pendiente de publicación:** los cambios de este repositorio aún no están en producción. No se inició el workflow de despliegue.
- **Pendiente de acceso o gestión externa:** Search Console, verificación DNS y solicitud de enlace editorial a UTN FRBA.

## Search Console

Responsable: persona administradora del dominio / DNS.

1. En Search Console, crear o abrir la propiedad de dominio `utnbamotorsport.com.ar`.
2. Copiar el registro TXT que Google muestre para esa propiedad y agregarlo en el proveedor DNS sin reemplazar los registros existentes.
3. Esperar la propagación indicada por el proveedor y pulsar **Verificar**. Conservar el TXT mientras se mantenga la propiedad.
4. Después de publicar este build, abrir `https://utnbamotorsport.com.ar/robots.txt` y `https://utnbamotorsport.com.ar/sitemap.xml`; confirmar respuesta 200 y contenido correcto.
5. En **Sitemaps**, enviar `https://utnbamotorsport.com.ar/sitemap.xml`.
6. En **Inspección de URLs**, comprobar `/`, `/el-equipo` y `/sponsors`: rastreo permitido, canonical declarado y seleccionado, y HTML renderizado.
7. Solicitar indexación si la inspección lo permite. Registrar fecha y resultado; revisar cobertura después. Google decide cuándo rastrear e indexar.

Evidencia pendiente: propiedad verificada, captura o exportación de estado del sitemap y resultados de inspección de las tres URLs. No se dispone aquí de acceso a la cuenta ni se generó un registro DNS.

## Borrador de solicitud de enlace institucional

Destino recomendado: `https://utnbamotorsport.com.ar/el-equipo` para una nota de proyectos estudiantiles, ingeniería o extensión; usar Home si el enlace aparece en un directorio institucional general.

Texto de enlace sugerido: **UTN BA Motorsport**.

Descripción: Equipo de estudiantes de la Facultad Regional Buenos Aires de la Universidad Tecnológica Nacional que trabaja en el desarrollo de un monoplaza eléctrico para Fórmula SAE.

**Asunto:** Proyecto estudiantil de ingeniería: UTN BA Motorsport

Hola, equipo de comunicación institucional:

Les escribimos para acercarles UTN BA Motorsport, un proyecto de estudiantes de la Facultad Regional Buenos Aires que desarrolla un monoplaza eléctrico para Fórmula SAE. El sitio presenta al equipo, sus áreas de trabajo y el proyecto: https://utnbamotorsport.com.ar/el-equipo

Si consideran que resulta útil para estudiantes y la comunidad universitaria, ¿podrían incluir una referencia a UTN BA Motorsport en una página institucional pertinente, por ejemplo en proyectos estudiantiles, ingeniería, extensión o noticias?

Texto sugerido: **UTN BA Motorsport**. Podemos facilitar información adicional y material del proyecto si lo necesitan.

Muchas gracias,
Equipo UTN BA Motorsport

Este borrador no se envió. No se identificó ni inventó una dirección de correo de webmaster.

### Verificación del enlace cuando se publique

- Abrir la página institucional y confirmar que el enlace apunta al dominio oficial y al destino acordado.
- Comprobar que el enlace funciona sin sesión y que no redirige a una URL rota.
- Confirmar que el contexto describe el proyecto correctamente y que el enlace es visible para lectores.
- Registrar URL de origen, texto del enlace y fecha de publicación.

## Medición de rendimiento

Build de referencia local previo a los cambios: Vite 5.4.21, Home/El equipo/Sponsors compartían un bundle JS de 389.73 kB (122.79 kB gzip) y CSS de 64.09 kB (12.08 kB gzip). No se ejecutó Lighthouse ni se midieron LCP, CLS o TBT en un navegador móvil; no hay una comparación de esos indicadores todavía.

Build posterior local: Vite 6.4.3, bundle de entrada 360.70 kB (115.04 kB gzip), CSS de entrada 17.74 kB (4.12 kB gzip), con chunks de página separados. El JS de entrada bajó aproximadamente 7.4% (6.3% gzip) y el CSS 72.3%; Home y las rutas internas cargan su chunk al entrar. Las cifras de recursos no equivalen a una puntuación Lighthouse ni a métricas de campo.

Para completar la línea de base comparable, correr Lighthouse en modo móvil tres veces en cada una de Home, El equipo y Sponsors, registrar la mediana de Performance, LCP, CLS y TBT, además del tamaño transferido y solicitudes. Repetir con el mismo equipo, red, versión del navegador, build y caché. INP requiere datos reales de usuarios cuando estén disponibles.
