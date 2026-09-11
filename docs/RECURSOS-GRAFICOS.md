# Recursos gráficos — inventario y qué hacer con cada cosa

Inventario de los archivos gráficos del repo: qué usa el sitio hoy, qué entra,
y qué tiene que desaparecer. Última actualización: 2026-09-10.

---

## Primero, entender las tres carpetas

El repo tiene imágenes en tres lugares distintos y **solo uno se publica**:

| Carpeta | ¿Se publica? | Qué es |
|---|---|---|
| `public/assets/img/` | ✅ **Sí** | Lo que el sitio sirve en producción. Vite copia esta carpeta tal cual a la raíz. |
| `src/assets/galerias/` | ✅ Sí, procesado | Fotos de las galerías por área. Vite las lee por glob, les pone hash y las optimiza en el build. |
| `assets/` (raíz) | ❌ **No** | Carpeta **legacy** del sitio viejo. No la lee nadie. |

> **Importante:** los SVG nuevos se dejaron en `assets/img/`, que es la carpeta
> legacy. Ahí no funcionan. Hay que copiarlos a `public/assets/img/`.

---

## 1. Íconos de área — lo que entra

Origen: `assets/Recursos Gráficos/Logos por Area/SVG/`

Siete íconos vectoriales, uno por área. Reemplazan a los PNG actuales: pesan
~1 KB contra ~25 KB y se ven nítidos en cualquier pantalla.

| Área | Archivo origen | Color del círculo | Color del glifo | Destino |
|---|---|---|---|---|
| Diseño | `diseño.svg` | `#41a2a2` turquesa | `#151519` | `public/assets/img/diseno.svg` |
| Química | `quimica.svg` | `#0dde8f` verde | `#151519` | `public/assets/img/quimica.svg` |
| Fabricación | `fabricacion.svg` | `#f38e3a` naranja | `#151519` | `public/assets/img/fabricacion.svg` |
| Industrial | `industrial.svg` | `#4c38a8` violeta | `#fcf6e6` ⚠️ | `public/assets/img/industrial.svg` |
| Electrónica | `electronica.svg` | `#f3cf3a` amarillo | `#151519` | `public/assets/img/electronica.svg` |
| Comunicación | `comunicacion.svg` | `#ff6565` coral | `#151519` | `public/assets/img/comunicacion.svg` |
| **CNC** (nueva) | `CNC2.svg` | `#ff7bac` rosa | `#151519` | `public/assets/img/cnc.svg` |

### Dos cosas a arreglar antes de publicar

1. **`diseño.svg` tiene ñ en el nombre.** En una URL se escapa a
   `dise%C3%B1o.svg` y es una fuente clásica de roturas según cómo esté
   configurado el servidor. Renombrar a `diseno.svg` — que además es como ya
   se llama el PNG y como se llama la carpeta de la galería.
2. **`CNC2.svg` arrastra un `2`** que no significa nada. Renombrar a `cnc.svg`.

### Un detalle de diseño

Seis íconos siguen el mismo patrón: **círculo de color pastel + glifo oscuro**.
**Industrial es el único al revés**: círculo violeta oscuro con glifo crema.
En una grilla de siete eso va a cantar. A decidir si se rehace o es a propósito.

### Lo bueno para el modo claro

Como cada glifo va sobre su propio círculo de color, los siete se leen igual
sobre fondo oscuro y sobre fondo claro. **No hay que duplicarlos por tema.**

---

## 2. Recursos de marca — disponibles, sin usar todavía

Origen: `assets/Recursos Gráficos/SVG (Vectorizado)/` (y su espejo en `PNG/`)

Cada pieza viene en tres versiones de color: **blanco**, **negro** y **rojo**.

| Pieza | Archivos | Para qué sirve |
|---|---|---|
| Logo 1 color | `Logos/1C-{BLANCO,NEGRO,ROJO}.svg` | Header, footer, favicon |
| Logo 2 colores | `Logos/2C-{NEGROBLANCO,NEGROROJO,ROJOBLANCO}.svg` | Uso principal de marca |
| Auto | `AUTO-{BLANCO,NEGRO,ROJO}.svg` | Ilustración |
| Frase | `FRASE-{BLANCO,NEGRO,ROJO}.svg` | Claim de marca |
| Barras | `BARRAS-{BLANCO,NEGRO,ROJO}.svg` | Elemento gráfico de apoyo |
| UTN | `UTN-{BLANCO,NEGRO,ROJO}.svg` | Marca institucional |
| Contorno de auto | `Contorno Auto/Auto {Blanco,Negro,Rojo}.svg` | Línea del monoplaza |

**Que exista versión blanca y negra de todo es exactamente lo que el modo claro
necesita:** negras sobre fondo claro, blancas sobre fondo oscuro.

**Uso concreto ya identificado:** el auto del hero del Home hoy es un
rectángulo redondeado dibujado a mano en el JSX. Reemplazarlo por el contorno
de `Contorno Auto/` es una mejora visual barata
(ver [PENDIENTES.md](PENDIENTES.md), punto 1).

**Nota:** el logo que usa el sitio hoy es `public/assets/img/logo.png`, un PNG
de 75 KB. Pasarlo a SVG conviene, pero es un cambio aparte.

---

## 3. Fotos — lo que se mueve

| Archivo | Hoy | Pasa a ser |
|---|---|---|
| `src/assets/galerias/industrial/industrial1.webp` | Galería de Industrial | Galería de **CNC** |
| `src/assets/galerias/industrial/industrial2.webp` | Galería de Industrial | Galería de **CNC** |
| `src/assets/galerias/industrial/industrial3.webp` | Galería de Industrial | Galería de **CNC** |
| `assets/img/IMG_4789.JPG` | Sin usar | **`src/assets/galerias/industrial/industrial1.webp`** |

Sobre `IMG_4789.JPG`: es la foto grupal del equipo en PwC. Antes de subirla hay
que **convertirla a WebP** (hoy es un JPG de 308 KB) para mantener el formato
del resto de las galerías, y **renombrarla** — `IMG_4789` no dice nada.

> Como se ven caras identificables del equipo, conviene confirmar que todos
> están de acuerdo con que la foto se publique.

---

## 4. Lo que tiene que desaparecer

### 4.1 PNG de íconos, una vez que anden los SVG

En `public/assets/img/`: `diseno.png`, `quimica.png`, `fabricacion.png`,
`industrial.png`, `electronica.png`, `comunicacion.png`, `CNC2.png`.
Son ~170 KB de archivos que quedan sin referencia. **Borrar recién después de
verificar que los SVG cargan bien.**

### 4.2 Archivos ya sin uso en `public/assets/img/`

Verificado con búsqueda: no los referencia nada del código.

| Archivo | Nota |
|---|---|
| `CNC2.png` | Se reemplaza por `cnc.svg` |
| `Nosotros.jpg` | Sin referencias |
| `simulacion1.png`, `simulacion2.png` | Ver abajo |
| `LEEME-fotos-equipo.txt` | Instructivo interno; no debería publicarse |

**Sobre Simulación:** hay un `TODO` en
[AreasGrid.jsx:9-11](../src/components/AreasGrid.jsx#L9-L11) que dice que
Simulación usa el ícono de Química como placeholder — pero Simulación **no está
en el array de áreas**, y tampoco tiene SVG en los recursos nuevos. Es un área
que quedó a medio camino. **Hay que decidir: o es un área y se agrega con
ícono propio, o no lo es y se limpian el TODO y las dos imágenes.**

### 4.3 El problema grande: `assets/` en la raíz pesa 166 MB y está versionada

La carpeta legacy tiene **42 archivos versionados en git** que el sitio no
sirve, incluyendo:

| Archivo | Peso |
|---|---|
| `assets/img/reel2.mp4` | 74 MB |
| `assets/img/reel1.mp4` | 71 MB |
| `assets/img/Render_fsae.png` | 12 MB |
| `assets/img/Nosotros.png` | 4 MB |
| `assets/img/industrial2.jpg` | 1,7 MB |

Por eso `.git/` pesa **342 MB**. Cada `git clone` del equipo se baja todo eso
para nada. Es el motivo por el que el repo se siente lento.

**Recomendación:** sacar `assets/` del control de versiones y agregarla al
`.gitignore`, después de confirmar que no queda nada ahí que no esté también en
`public/`. Los reels y los originales pesados van a Drive, no al repo.

> Ojo: sacarlos de `.gitignore` a futuro no achica el historial — los blobs
> siguen en `.git`. Achicarlo de verdad requiere reescribir la historia, que es
> una operación aparte y hay que coordinarla con todo el equipo. **No la hago
> sin que me lo pidas explícitamente.**

### 4.4 Cosas menores ya resueltas

- `ilovepdf_split-range.zip` (77 MB) y `.vite/` están sin versionar y el zip ya
  figura en `.gitignore`. `.vite/` conviene agregarlo también.

---

## 5. Resumen de acciones sobre archivos

1. Copiar los 7 SVG de área a `public/assets/img/`, renombrando `diseño.svg` →
   `diseno.svg` y `CNC2.svg` → `cnc.svg`.
2. Apuntar `AREAS` en `AreasGrid.jsx` a los `.svg`.
3. Mover `industrial1/2/3.webp` a `src/assets/galerias/cnc/`.
4. Convertir `IMG_4789.JPG` a WebP y dejarla como
   `src/assets/galerias/industrial/industrial1.webp`.
5. Borrar los 7 PNG de ícono y los archivos sin uso del punto 4.2.
6. Decidir qué pasa con Simulación.
7. Decidir qué pasa con `assets/` (166 MB versionados).
