# Recursos externos del sitio

Inventario de todos los links externos que hoy vive en el código, con su estado
de vigencia. Sirve para dos cosas: no perder los links cuando se borre la
sección "Fuentes", y tener a mano lo que hay que revisar antes de publicar.

**Verificado el:** 2026-09-10 (request `HEAD`/`GET` con seguimiento de redirects).

Leyenda de estado:
- ✅ **OK** — responde 200.
- ⚠️ **Revisar** — responde, pero con un código que puede ser bloqueo anti-bot
  y no una caída real. Hay que abrirlo en el navegador para confirmar.
- ❌ **No responde** — no resuelve. Candidato a sacar o reemplazar.

---

## 1. Sponsors y colaboradores

Links de la página de Sponsors y del carrusel.

| Entidad | URL | Estado |
|---|---|---|
| Aceros Munro | https://acerosmunro.com.ar/ | ✅ OK |
| Cognitive | https://cognitive.com.ar/ | ✅ OK |
| Printalot | https://printalot.com.ar/ | ✅ OK |
| Ansys | https://www.ansys.com/ | ✅ OK |
| Bender | https://www.bender.de/ | ✅ OK |
| Bosch | https://www.bosch.com/ | ✅ OK |
| MathWorks | https://www.mathworks.com/ | ⚠️ Revisar — devuelve 403, casi seguro bloqueo anti-bot. El sitio está vivo. |
| Polimetal Procesos | https://polimetalprocesos.com.ar/ | ❌ **No responde** — el dominio no resuelve. Probado con y sin `www`. |
| E. Mayer | https://www.emayer.com.ar/ | ❌ **No responde** — el dominio no resuelve. Probado con y sin `www`. |
| Grupo Paglia (Instagram) | https://www.instagram.com/grupopaglia_/ | ✅ OK |
| Leandro Di Matteo (LinkedIn) | https://www.linkedin.com/in/leandrodimatteo/?locale=es | ✅ OK |
| UTN FRBA | https://www.frba.utn.edu.ar/ | ✅ OK |

> **Acción requerida:** Polimetal y E. Mayer no resuelven. Antes de tocarlos hay
> que confirmar con el equipo si cambiaron de dominio, si se cayó el hosting o
> si dejaron de ser sponsors. Mientras tanto, el logo se puede mostrar sin link
> en vez de mandar al usuario a una página muerta.

## 2. Redes del equipo

| Red | URL | Estado |
|---|---|---|
| Instagram | https://www.instagram.com/utnbamotorsport/ | ✅ OK |
| TikTok | https://www.tiktok.com/@utnbamotorsport | ✅ OK |
| YouTube | https://www.youtube.com/@utnbamotorsport | ✅ OK |
| LinkedIn | https://www.linkedin.com/company/utn-ba-motorsports/ | ⚠️ Revisar — devuelve 429 (rate limit de LinkedIn), no es una caída. |

## 3. Fuentes de la página de Academia — **a eliminar del sitio**

Estos son los links de la sección "Fuentes" que se va a borrar
(ver [PENDIENTES.md](PENDIENTES.md), punto 3). Quedan archivados acá por si en
algún momento hay que justificar las cifras que se muestran en esa página.

| Referencia | URL | Estado |
|---|---|---|
| Formula Student — Wikipedia | https://en.wikipedia.org/wiki/Formula_Student | ✅ OK |
| Formula SAE — Wikipedia | https://en.wikipedia.org/wiki/Formula_SAE | ✅ OK |
| Baja SAE — Wikipedia | https://en.wikipedia.org/wiki/Baja_SAE | ✅ OK |
| Red Bull — Global Formula Racing | https://www.redbull.com/us-en/theredbulletin/global-formula-racing-formula-sae | ⚠️ Revisar — 403, probable bloqueo anti-bot. |
| Wichita State University — Formula SAE | https://www.wichita.edu/academics/engineering/mechanical_engineering/students/formula-sae/competition.php | ✅ OK |

## 4. Dominio propio y metadatos

| Recurso | URL | Estado |
|---|---|---|
| Sitio | https://utnbamotorsport.com.ar/ | ✅ OK |
| Logo (Open Graph / JSON-LD) | https://utnbamotorsport.com.ar/assets/img/logo.png | ✅ OK |
| Portada social (og:image) | https://utnbamotorsport.com.ar/assets/img/og-cover.jpg | ✅ OK |

## 5. Servicios de terceros cargados en la página

No son links de contenido: son scripts y hojas de estilo que el sitio carga en
tiempo de ejecución. Están acá porque afectan performance y privacidad.

| Servicio | URL | Para qué | Nota |
|---|---|---|---|
| Google Fonts (CSS) | `https://fonts.googleapis.com/css2?family=Unbounded:...` | Tipografía Unbounded | Se podría autohospedar para no depender de Google y ganar velocidad de carga. |
| Google Fonts (archivos) | `https://fonts.gstatic.com` | Archivos de la fuente | Ídem. |
| Plausible | `https://plausible.io/js/script.js` | Analítica | Hay **dos** herramientas de analítica cargadas a la vez. Conviene quedarse con una. |
| Umami | `https://cloud.umami.is/script.js` | Analítica | Ídem. |

---

## Cosas del repo que conviene ordenar

No son links, pero son recursos del proyecto que hoy están fuera de lugar:

El inventario completo de imágenes, SVG y archivos a borrar se mudó a
**[RECURSOS-GRAFICOS.md](RECURSOS-GRAFICOS.md)**. El titular: la carpeta
`assets/` de la raíz pesa 166 MB versionados que el sitio no sirve, y por eso
`.git/` pesa 342 MB.

Corrección respecto de la versión anterior de este documento:
`ilovepdf_split-range.zip` **ya figura en `.gitignore`** y no está versionado.
El que sí lo está es `assets/`.
