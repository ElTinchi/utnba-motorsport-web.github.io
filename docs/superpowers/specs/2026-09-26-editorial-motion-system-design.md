# Sistema editorial de movimiento y conversión

**Fecha:** 2026-09-26  
**Estado:** aprobado en conversación, pendiente de revisión del documento  
**Rama:** `feature/animated-hero-sponsors`

## Objetivo

Transformar el sitio de UTN BA Motorsport en una experiencia de marca memorable que:

1. produzca una primera impresión de nivel profesional;
2. enseñe qué es Formula SAE y por qué importa;
3. demuestre capacidad técnica, continuidad y avance real;
4. convierta el interés de empresas en conversaciones de patrocinio;
5. presente el ingreso al equipo como una oportunidad aspiracional y selectiva.

La prioridad comercial es obtener sponsors. La incorporación de estudiantes es secundaria.

## Principio editorial

Todas las páginas narrativas seguirán la misma progresión:

> Gancho → contexto → evidencia → consecuencia → siguiente acción

El movimiento debe orientar la mirada y explicar la relación entre contenidos. No se utilizará como decoración independiente.

El color rojo marcará la frase decisiva, el dato principal o el siguiente paso. No se aplicará indiscriminadamente.

## Dirección visual

La dirección elegida es **editorial cinematográfica con detalles de telemetría**:

- tipografía y frases breves como recurso principal;
- fotografías y renders revelados con máscaras;
- datos que cobran vida al entrar en pantalla;
- índices, líneas y números inspirados en competición;
- fondos, colores y componentes existentes preservados como identidad base.

No se busca imitar un tablero de control. Los recursos técnicos deben reforzar el carácter de motorsport sin competir con la lectura.

## Sistema compartido de movimiento

### 1. Entrada editorial

Los grupos de contenido aparecen en este orden:

1. kicker o categoría;
2. gancho;
3. subtítulo o contexto;
4. cuerpo;
5. acción.

La distancia de entrada será de 16 a 24 px y la duración objetivo de 450 a 650 ms. Los desplazamientos podrán alternar entre izquierda, derecha y vertical según la composición.

### 2. Revelación visual

Fotografías y renders se descubrirán mediante una máscara horizontal o vertical. La imagen conservará sus dimensiones durante toda la transición para evitar saltos de layout.

### 3. Secuencias

Tarjetas, áreas, etapas, pruebas y especificaciones entrarán de manera escalonada. El intervalo será breve —aproximadamente 60 a 100 ms— y no bloqueará la lectura del elemento siguiente.

En pantallas pequeñas, los elementos que todavía no estén cerca del viewport no esperarán el retraso acumulado de toda la lista: cada ítem activará su propia entrada.

### 4. Datos vivos

Porcentajes y cifras de escala contarán desde cero hasta su valor traducido. La duración objetivo será de 900 a 1.300 ms con desaceleración al final.

Las cifras se reiniciarán después de salir claramente del viewport y volverán a contar al reingresar.

### 5. Activación reversible estable

El observador de visibilidad será reversible. Utilizará márgenes internos y umbrales suficientes para evitar activaciones repetidas cuando un elemento apenas roce el borde.

Las entradas se reproducirán nuevamente al volver a una sección, pero no responderán continuamente a cada píxel del scroll.

## Accesibilidad y robustez

- `prefers-reduced-motion: reduce` mostrará el contenido directamente.
- Si `IntersectionObserver` no está disponible, el contenido será visible.
- El contenido existirá en el DOM desde el primer render.
- Ninguna animación modificará el orden semántico.
- El foco de teclado no quedará oculto ni se desplazará durante una transición.
- No se animarán controles interactivos mientras el usuario los esté utilizando.
- No habrá animaciones palabra por palabra en párrafos largos.
- Las páginas legales conservarán una presentación sobria.

## Narrativa por página

### Home

**Idea:** Esto es mucho más que construir un auto.

Secuencia:

1. impacto del hero;
2. propósito a largo plazo;
3. siete áreas como sistema;
4. Academia como recorrido;
5. escala global de Formula SAE;
6. oportunidad para sponsors.

Los cuatro bloques editoriales conservarán gancho, subtítulo y cuerpo secundario. Las áreas aparecerán una por una. Las tres categorías de Academia se revelarán como una progresión y no como tarjetas equivalentes. Las cifras contarán al entrar.

### Academia

**Gancho:** Entrás sin experiencia. Salís manejando un proyecto real.

Rookie, Baja SAE y Formula SAE se presentarán como una escalera:

- qué aprendés;
- qué responsabilidad asumís;
- para qué etapa te prepara.

Los tres niveles aparecerán en orden y las conexiones visuales reforzarán el avance entre ellos.

### Formula Student

**Gancho:** Una competencia donde el auto es el examen.

Secuencia:

1. desafío internacional;
2. criterios de evaluación;
3. pruebas dinámicas;
4. pruebas estáticas;
5. escala global.

Las pruebas aparecerán siguiendo el recorrido conceptual de una competencia. Las cifras cerrarán la explicación como evidencia.

### El auto

**Gancho:** Nuestro conocimiento convertido en una máquina.

Secuencia:

1. render protagonista;
2. estado y propósito del proyecto;
3. decisiones técnicas;
4. visor de marca para sponsors;
5. ficha técnica.

Las filas de especificaciones entrarán progresivamente. El visor debe funcionar como demostración comercial, no como interrupción.

### El equipo

**Gancho:** No somos un grupo de alumnos. Funcionamos como una escudería.

Secuencia:

1. fotografía y declaración;
2. método de trabajo;
3. áreas conectadas;
4. evidencia fotográfica;
5. acceso aspiracional a la convocatoria.

Las áreas se revelarán individualmente y sus galerías acompañarán la explicación, sin competir con ella.

### Novedades

**Gancho:** El proyecto avanza. Acá están las pruebas.

La noticia más reciente funcionará como portada editorial. El archivo será una línea de tiempo de hitos, resultados y aprendizajes. Cada noticia aparecerá individualmente.

Las acciones de compartir conservarán su comportamiento actual y no serán animadas durante la interacción.

### Sponsors

**Gancho:** No financiás una promesa: acelerás un proyecto que ya está en marcha.

Secuencia:

1. avance demostrado;
2. recorrido y capacidad del equipo;
3. porcentaje de recursos confirmados;
4. recursos pendientes;
5. valor para la empresa;
6. simulación de marca sobre el auto;
7. contacto.

Habrá oportunidades de contacto:

1. después de demostrar el avance;
2. después de explicar el valor para la empresa;
3. en el cierre.

### Sumate

**Gancho:** No buscamos espectadores.

La página comunicará experiencia real, exigencia y proceso de selección. El acceso a Instagram seguirá siendo claro, pero la página no competirá con Sponsors como conversión principal del sitio.

### Legales, privacidad y 404

Quedan fuera del tratamiento cinematográfico. Podrán usar una entrada inicial discreta si el componente compartido la ofrece sin añadir complejidad.

## Conversión comercial

El CTA principal será:

> Conversemos sobre una alianza

Abrirá el cliente de correo mediante un enlace `mailto:` con:

**Asunto:** Alianza con UTN BA Motorsport

**Cuerpo:**

> Hola, les escribo de [empresa]. ¿Me pasan un WhatsApp para conversar?

No se publicará un número de WhatsApp ni se solicitará información adicional. La firma corporativa del remitente aportará los datos necesarios y el equipo trasladará después la conversación al canal apropiado.

El CTA secundario será:

> Conocé cómo puede participar tu empresa

Este CTA llevará a la explicación comercial dentro de Sponsors. El CTA global del encabezado seguirá conduciendo a esa página.

## Arquitectura propuesta

El sistema debe apoyarse en piezas reutilizables y pequeñas:

- un hook reversible de visibilidad;
- un contenedor de revelación editorial;
- una lista escalonada que no acumule retrasos fuera de pantalla;
- un componente para cifras animadas;
- variantes CSS compartidas para dirección, máscara y ritmo;
- un constructor centralizado del enlace de contacto comercial.

Las páginas compondrán esas piezas. No duplicarán observadores ni temporizadores propios salvo que una interacción tenga requisitos únicos.

## Rendimiento

- CSS `transform`, `opacity` y máscaras serán las propiedades principales.
- No se añadirá una biblioteca de animación.
- Se evitarán listeners de `scroll` por elemento.
- Los observadores se desconectarán al desmontar componentes.
- Los temporizadores y `requestAnimationFrame` se cancelarán correctamente.
- Las imágenes conservarán dimensiones explícitas y carga diferida cuando corresponda.

## Pruebas y verificación

### Automatizadas

- activación y desactivación reversible;
- fallback sin `IntersectionObserver`;
- preservación de movimiento reducido;
- formato y reinicio de cifras;
- enlace de correo con asunto y cuerpo codificados;
- aplicación del sistema a todas las páginas narrativas;
- ausencia de efectos cinematográficos obligatorios en páginas legales.

### Manuales

- anchos de 320, 768, 1024 y 1440 px;
- scroll descendente y ascendente;
- navegación con teclado;
- foco visible;
- contenido siempre recuperable;
- ausencia de parpadeo en los umbrales;
- ausencia de desplazamientos de layout;
- consola sin errores;
- recorrido completo desde Home hasta el correo comercial.

### Finales

- suite completa;
- build de producción;
- revisión visual de cada ruta en español;
- comprobación puntual de desbordes en inglés y portugués.

## Criterios de aceptación

1. Cada página narrativa presenta un gancho reconocible antes del texto explicativo.
2. El orden visual coincide con el orden semántico y comercial.
3. Las entradas se reinician al volver sin parpadeos ni movimientos excesivos.
4. Las listas extensas aparecen progresivamente también en móvil.
5. Las cifras relevantes cuentan desde cero y respetan su formato regional.
6. Sponsors conduce de evidencia a contacto sin pedir datos innecesarios.
7. El contacto abre un correo precargado y no publica WhatsApp.
8. Toda la experiencia funciona sin una dependencia nueva.
9. El sitio permanece legible con movimiento reducido o sin observador.
10. Todas las pruebas y el build de producción finalizan correctamente.
