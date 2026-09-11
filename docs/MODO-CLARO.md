# Modo claro — plan de implementación

Plan para agregar un toggle de tema claro/oscuro al sitio. **Todavía no está
implementado.** Este documento es lo que hay que hacer, con el relevamiento del
estado actual del CSS ya hecho.

Última actualización: 2026-09-11.

---

## 1. La paleta

Los dos colores que el sitio ya usa, intercambiando roles:

| | Fondo | Texto |
|---|---|---|
| **Oscuro** (actual) | `#151519` | `#fcf6e6` |
| **Claro** (nuevo) | `#fcf6e6` | `#151519` |

Contraste entre esos dos: **~16:1**. WCAG AA pide 4.5:1 para texto normal y
AAA pide 7:1, así que pasa los dos con margen de sobra, incluso en texto chico.

### El rojo de marca necesita una variante

`#dd0e0e` sobre `#fcf6e6` da **~4.9:1**: pasa AA para texto normal, pero raspando,
y **no pasa AAA**. Sirve tal cual para títulos grandes, botones y bordes. Para
texto chico en modo claro conviene un rojo un punto más oscuro — alrededor de
`#b80b0b` sube a ~6.8:1 sin cambiar la percepción de la marca.

Esto se resuelve con un token aparte (`--color-red-text`) que en modo oscuro
apunta al rojo normal y en claro al oscurecido. **No** hay que cambiar
`--color-red`, que se sigue usando para superficies y acentos.

---

## 2. El problema real: 96 `rgba()` literales

La paleta ya está tokenizada en `:root`
([global.css:9-23](../src/styles/global.css#L9-L23)), y eso hace pensar que el
cambio es chico. No lo es.

Repartidos por los CSS hay **96 `rgba()` con los canales escritos a mano**, que
no responden a ningún cambio de tema:

| Familia | Cantidad | Qué es | Qué hacer |
|---|---|---|---|
| `rgba(252, 246, 230, …)` | 61 | Crema con alpha: bordes, separadores, fondos sutiles | Token `--ink-rgb`, invierte con el tema |
| `rgba(0, 0, 0, …)` | 12 | Sombras y degradés | Caso por caso (ver abajo) |
| `rgba(21, 21, 25, …)` | 9 | Negro de marca con alpha | Token `--surface-rgb`, invierte |
| `rgba(221, 14, 14, …)` | 8 | Rojo con alpha | Token `--red-rgb`, **no** invierte |
| `rgba(28, 28, 33, …)` | 2 | Gris oscuro (header) | Token, invierte |
| `rgba(225, 6, 0, …)` | 2 | Otro rojo | Unificar con el rojo de marca |
| `rgba(13, 13, 16, …)` | 1 | Fondo del visor 3D | Token, invierte |

Distribución por archivo:

| Archivo | `rgba()` |
|---|---|
| `home.css` | 27 |
| `global.css` | 21 |
| `sponsors.css` | 15 |
| `car.css` | 6 |
| `join.css` | 6 |
| `academy.css` | 5 |
| `formulaStudent.css` | 5 |
| `news.css` | 5 |
| `team.css` | 3 |
| `gallery.css` | 1 |
| `page-shell.css` | 1 |

**Si no se convierten, el toggle deja medio sitio invertido y medio no:** los
textos cambian pero los bordes, separadores y fondos sutiles quedan del tema
viejo, y se vuelven invisibles o chillones.

### Además, 12 colores hex sueltos fuera de `:root`

- `sponsors.css`: `#fff` (fondo de la banda de sponsors), `#151519`, `#101013`,
  `#17171b`, `#0d0d10` — superficies oscuras propias de esa página.
- `sponsors-carousel.css`: `#fff` (fondo de la cinta de logos), y `#000` en dos
  `mask-image`.
- `home.css`: `#000` en dos paradas de un degradé.

**Ojo con los `#000` de `mask-image` y de los degradés de máscara:** ahí el
color no se ve, se usa como canal de opacidad. **Esos no se tocan.** Cambiarlos
por un token rompe la máscara. Hay que distinguirlos uno por uno de los `#000`
que sí son color visible.

---

## 3. Arquitectura propuesta

### 3.1 Tokens por canal

La clave es guardar los **canales sueltos**, no el color armado, para poder
seguir usando alpha:

```css
:root {
  /* Canales: permiten rgba(var(--ink-rgb), 0.1) */
  --ink-rgb: 252, 246, 230;      /* color del texto */
  --surface-rgb: 21, 21, 25;     /* color del fondo */
  --red-rgb: 221, 14, 14;        /* no cambia con el tema */

  /* Colores armados, para quien no necesita alpha */
  --color-ink: rgb(var(--ink-rgb));
  --color-surface: rgb(var(--surface-rgb));
  --color-red: rgb(var(--red-rgb));
  --color-red-text: #dd0e0e;
}

[data-theme='light'] {
  --ink-rgb: 21, 21, 25;
  --surface-rgb: 252, 246, 230;
  --color-red-text: #b80b0b;     /* contraste suficiente sobre crema */
}
```

Después, la conversión mecánica en los 13 archivos de estilo:

```css
/* antes */  border: 1px solid rgba(252, 246, 230, 0.1);
/* después */ border: 1px solid rgba(var(--ink-rgb), 0.1);
```

### 3.2 Compatibilidad hacia atrás

Los nombres actuales (`--color-white`, `--color-black`, `--color-gray`, …) están
usados en todo el sitio. Conviene **dejarlos como alias** apuntando a los
nuevos, y no hacer un rename masivo en el mismo cambio:

```css
--color-white: var(--color-ink);
--color-black: var(--color-surface);
```

Así el CSS existente sigue andando y la migración se puede hacer de a poco.
Los nombres quedan mintiendo un poco en modo claro (`--color-white` va a ser
oscuro), así que el rename conviene hacerlo después, como limpieza aparte.

### 3.3 Las sombras son el caso especial

`rgba(0, 0, 0, 0.3)` en modo oscuro casi no se ve; en modo claro es una sombra
de verdad. **No se invierten**: una sombra clara sobre fondo claro no existe.
Lo que hay que hacer es **subirles el alpha en modo claro**, con un token
propio:

```css
:root { --shadow-color: 0, 0, 0; --shadow-alpha: 0.3; }
[data-theme='light'] { --shadow-alpha: 0.12; }
```

En modo claro las sombras tienen que ser **más sutiles**, no más fuertes: sobre
fondo crema una sombra al 30% se ve sucia.

---

## 4. El toggle

### 4.1 Comportamiento

1. **Primera visita:** respetar `prefers-color-scheme` del sistema.
2. **Si el usuario elige:** guardar en `localStorage` y que esa elección gane
   sobre el sistema.
3. El atributo va en `<html>`: `data-theme="light"` / `data-theme="dark"`.

### 4.2 Evitar el flash blanco

Si el tema se aplica recién cuando monta React, en la primera pintura se ve el
tema por defecto y después salta. Hay que aplicarlo **antes**, con un script
inline en el `<head>` de `index.html`, sincrónico:

```html
<script>
  (function () {
    try {
      var saved = localStorage.getItem('theme');
      var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.dataset.theme = saved || (dark ? 'dark' : 'light');
    } catch (e) {
      document.documentElement.dataset.theme = 'dark';
    }
  })();
</script>
```

El `try/catch` importa: en ventana privada o con cookies bloqueadas,
`localStorage` tira excepción y sin el catch la página queda sin tema.

### 4.3 Dónde va el botón

Junto al `LanguageSwitcher` en el header — ya existe
[Header.jsx](../src/components/Header.jsx) y es el lugar natural.

Requisitos de accesibilidad: `aria-pressed` o `role="switch"`, etiqueta
traducida en los tres locales, y foco visible. El ícono solo no alcanza.

---

## 5. Lo que hay que decidir mirando, no en el código

Estas cosas no se resuelven de antemano — hay que hacer una pasada visual por
cada página con el tema claro puesto.

| Punto | Estado |
|---|---|
| **Hero del Home** | Tiene foto de fondo con overlay oscuro y el logo en crema encima. Lo más seguro es **dejar el hero siempre oscuro** en los dos temas: es una imagen fotográfica, no una superficie de UI. Aclararlo implica rehacer el overlay y revisar el contraste del logo. |
| **Logos de sponsors** | Ya existen las variantes `onwhite/` y `transparent/`. En modo claro habría que usar `onwhite/`. Hoy `sponsors-carousel.css` fuerza `background: #fff` justamente para que los logos se lean: en modo claro esa banda blanca sobre fondo crema va a quedar como un parche. |
| **Recursos de marca** | En `assets/Recursos Gráficos/` cada pieza (logo, frase, barras, contorno de auto, UTN) viene en **blanco, negro y rojo**. Claro usa las negras, oscuro las blancas. A decidir: dos `<img>` con CSS, o SVG inline pintado con `currentColor` (más limpio, más trabajo). |
| **Logo del header** | Hoy es `logo.png` en crema. Sobre fondo claro desaparece. Necesita la variante negra sí o sí. |
| **Visor 3D** | `sponsors.css` le da fondo `#0d0d10`. Revisar cómo queda el modelo sobre fondo claro. |
| **Íconos de área** | ✅ **No requieren trabajo.** Cada glifo va sobre su propio círculo de color, así que los siete se leen igual en los dos temas. |

---

## 6. Orden sugerido

1. Definir los tokens de canal en `global.css`, con los alias hacia atrás.
2. Convertir los 96 `rgba()` archivo por archivo, **separando a mano** los
   `#000`/`rgba(0,0,0,…)` que son máscara o sombra de los que son color.
3. Script inline en `index.html` + el botón en el header.
4. Pasada visual página por página en modo claro.
5. Resolver los assets por tema (logo, sponsors, marca).
6. Verificar contraste real con una herramienta, no a ojo.
7. Limpieza aparte: renombrar `--color-white` / `--color-black` a nombres que
   no mientan.

**Estimación honesta:** el paso 2 es mecánico pero toca los 13 archivos de
estilo, y el paso 4 es el que siempre trae sorpresas. No es un cambio de una
sentada.
