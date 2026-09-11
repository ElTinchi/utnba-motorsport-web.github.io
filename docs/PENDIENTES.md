# Pendientes — Web UTN BA Motorsport

Última actualización: 2026-09-11.

---

## ✅ Hecho

### 1. Girar el sentido del auto del Home

[Home.jsx](../src/pages/Home.jsx) — `CAR_KEY_POINTS` ahora va de `1` a `0`, así
que el auto recorre el circuito en sentido inverso.

**No alcanzaba con dar vuelta el array.** El perfil de velocidad
(`CAR_KEY_TIMES`) está calculado sobre la curvatura real del trazado, con las
frenadas metidas *antes* de entrar a cada curva. Invirtiendo solo la posición,
las frenadas caían a la *salida* de la curva: el auto frenaba donde tenía que
acelerar.

Se regeneró el perfil completo para el sentido nuevo, con el mismo método
original (límite `v = sqrt(a_lat / k)` sobre la curvatura, pasada hacia atrás
para la frenada y hacia adelante para la aceleración). Los tres parámetros del
modelo no estaban escritos en el código, así que se ajustaron por búsqueda
hasta reproducir el `CAR_KEY_TIMES` que ya existía: **error máximo 0.0105**.
Con esos mismos parámetros se calculó el sentido invertido.

### 2. Área CNC — el equipo pasa de 6 a 7 áreas

- Entrada `cnc` en [AreasGrid.jsx](../src/components/AreasGrid.jsx) (quedó
  quinta, después de Industrial — ver punto 6).
- Textos en los tres idiomas (`areas.items.cnc`).
- Fotos: `industrial1/2/3.webp` → `src/assets/galerias/cnc/cnc1/2/3.webp`.
- `IMG_4789.JPG` → `src/assets/galerias/industrial/industrial1.webp`,
  convertida a WebP respetando la orientación EXIF (301 KB JPG → 148 KB WebP),
  así Industrial no queda sin galería.
- "Seis áreas" → "siete" en los **dos** lugares donde aparecía en cada idioma:
  el bloque del Home (`home.areas`) y el de Equipo (`teamPage`).

Texto que quedó publicado:

> **CNC** — Mecanizado de precisión
> Fabrica las piezas que no toleran error. Portamazas, mazas, bujes y
> abrazaderas de suspensión salen de acá: los componentes que sostienen la
> rueda y bajan los esfuerzos al chasis, mecanizados por control numérico a
> partir de los modelos de Diseño. Una décima fuera de tolerancia se paga en
> pista.

### 3. Íconos de área en SVG

Los siete íconos migrados de PNG a SVG desde
`assets/Recursos Gráficos/Logos por Area/SVG/` a `public/assets/img/`, que es
la carpeta que el sitio realmente publica (los SVG estaban en `assets/img/`,
que es la carpeta legacy y no se sirve).

Renombrados en el camino: `diseño.svg` → `diseno.svg` (la ñ en el nombre se
escapa a `dise%C3%B1o.svg` en la URL y rompe según el servidor) y `CNC2.svg` →
`cnc.svg`.

Borrados los siete PNG que quedaron sin referencia.

### 4. Sacada la sección "Fuentes"

JSX de [Academy.jsx](../src/pages/Academy.jsx), las claves `sourcesLabel` y
`sources` en los tres locales, y las 36 líneas de `.ms-sources` en
`academy.css`. Los links quedaron archivados en
[RECURSOS-EXTERNOS.md](RECURSOS-EXTERNOS.md).

### 5. Freshman → Rookie

Es un renombre, no un recorte: los dos párrafos que describían la etapa como si
fueran dos categorías se fundieron en una sola descripción de Rookie. **No se
perdió contenido** — la parte de soldadura y torno sigue estando, ahora como
continuación del párrafo del karting.

Verificado: la palabra "Freshman" no aparece en ningún locale.

### 6. La grilla de áreas: 7 en una línea, Industrial al medio y clickeables

Con 7 áreas la grilla de 6 columnas dejaba a Comunicación sola en una segunda
fila, pegada a la izquierda. Cambios:

- **Grid → flex con `justify-content: center`.** 7 es primo: cualquier corte por
  fila deja una fila incompleta, así que ahora la fila corta queda centrada en
  vez de alineada a la izquierda.
- **Las 7 en una sola línea desde 1200px.** Abajo de eso, 4 por fila (4+3
  centrado) y 2 en mobile.
- **Industrial es la cuarta**, o sea justo en el medio de las siete. Además
  disimula que su ícono es el único con el patrón invertido: centrado se lee
  como un eje y no como un error.
- **Cada tarjeta es un link** a `/el-equipo#<área>`, que es donde está la
  descripción larga y la galería. Con estados de hover y `:focus-visible`.

Dos cosas que no eran obvias y hubo que resolver:

- **`min-width: 0` en el ítem flex.** Por defecto un ítem flex no puede achicarse
  por debajo de su contenido mínimo, y "Comunicación" es una sola palabra de
  ~148px. Sin eso, la séptima tarjeta se negaba a entrar y tiraba la fila abajo
  aunque el ancho calculado alcanzara.
- **El `#ancla` no hacía scroll solo.** `ScrollToTop` en `App.jsx` salteaba el
  scroll cuando había hash, esperando que lo hiciera el navegador. En una
  navegación de React Router eso no pasa: la URL cambia antes de que monte la
  página nueva, así que cuando el navegador busca el elemento todavía no existe.
  Ahora salta a mano con `scrollIntoView()`, y `.team-area` tiene
  `scroll-margin-top` para que el header fijo no tape el título.

### 7. Simulación eliminada

Ya no existe como área. Se sacaron el `TODO` de `AreasGrid.jsx` y las imágenes
`simulacion1.png` / `simulacion2.png`.

---

## Verificación

- `npm run build` pasa: 99 módulos, sin warnings.
- Los tres locales parsean como JSON válido y tienen **las mismas 7 claves de
  área**.
- Los 7 SVG parsean como XML y se sirven con `content-type: image/svg+xml`.
- Las rutas `/`, `/el-equipo` y `/la-academia` devuelven 200 en el build
  servido, y la página de Equipo renderiza las 7 secciones con su `id`.
- `keyPoints` y `keyTimes` tienen 91 valores cada uno, monótonos en el sentido
  correcto, y el perfil se aparta hasta 0.053 de la velocidad constante (o sea
  que no quedó plano).
- **Grilla de áreas medida en Chrome headless** de 1200px a 1920px: una sola
  fila, los 7 anchos iguales y ningún texto desbordando. Abajo de 1200 pasa a
  4+3 centrado y en mobile a 2 por fila.
- **Navegación por ancla verificada:** `/el-equipo#cnc` deja el título del área
  a 94px del tope — header (70px) más el `scroll-margin-top` (24px) — así que
  no queda tapado. Sin hash, la página arranca en 0.

**Lo que no verifiqué:** el auto girando. Es una animación SVG y una captura
estática no dice mucho; conviene que le des una mirada en el navegador.

---

## Pendiente

### Modo claro

El plan completo quedó en **[MODO-CLARO.md](MODO-CLARO.md)**, con el
relevamiento del CSS ya hecho: paleta, arquitectura de tokens, el toggle, y los
96 `rgba()` literales que hay que convertir para que el tema funcione de verdad.

### Cosas chicas que quedaron señaladas

- **`motorsportPage.statsNote`** dice que las cifras salen de "datos públicos".
  Ahora que no están las fuentes, decidir si se queda, se reescribe o se va.
- **Ícono de Industrial:** es el único con el patrón invertido (círculo violeta
  oscuro con glifo crema; los otros seis son círculo pastel con glifo oscuro).
  En la grilla de siete se nota. ¿Se rehace?
- **Términos técnicos de CNC:** validar *portamaza* → *upright* / *manga de
  eixo*, *maza* → *hub* / *cubo*, *buje* → *bushing* / *bucha*.
- **Contorno de auto en el hero:** hoy el auto es un rectángulo redondeado
  dibujado a mano. En `Recursos Gráficos/Contorno Auto/` hay un contorno real
  en SVG. Mejora barata, pero no la hice porque no estaba en el pedido.
- **Foto de Industrial:** se ven caras identificables del equipo. Confirmar que
  están todos de acuerdo con publicarla.
- **`assets/` pesa 166 MB versionados** y el sitio no la sirve — ver
  [RECURSOS-GRAFICOS.md](RECURSOS-GRAFICOS.md), sección 4.3.
- **Dos analíticas a la vez** (Plausible y Umami). Conviene quedarse con una.
