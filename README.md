# Web personal

Web personal para compartir y divulgar mis proyectos: **FastTack**, el **Diario de regatas** a bordo del Macaco, la **calculadora de tiempos ORC** y las **impresiones 3D**.

- **Astro 7**, sitio 100 % estático (sin servidor ni base de datos).
- Contenido en **Markdown** dentro del repositorio, con **Content Collections** y esquemas tipados.
- Edición desde el navegador con **Pages CMS** (gratis, sin instalar nada).
- Publicación automática en **Cloudflare Pages** (gratis) cada vez que cambia el repositorio.
- Modo claro/oscuro, adaptada a móvil, imágenes optimizadas, RSS, sitemap y Open Graph.
- Ninguna dependencia de pago ni servicio externo obligatorio.

---

## Índice

1. [Arrancarla en tu ordenador](#1-arrancarla-en-tu-ordenador)
2. [Subirla a GitHub](#2-subirla-a-github)
3. [Publicarla en Cloudflare Pages](#3-publicarla-en-cloudflare-pages)
4. [Conectar Pages CMS](#4-conectar-pages-cms)
5. [Añadir un proyecto o una entrada](#5-añadir-un-proyecto-o-una-entrada)
6. [Poner un dominio propio](#6-poner-un-dominio-propio)
7. [Qué hay en cada carpeta](#7-qué-hay-en-cada-carpeta)
8. [La calculadora ORC](#8-la-calculadora-orc)
9. [Primeros pasos: qué cambiar antes de publicar](#9-primeros-pasos-qué-cambiar-antes-de-publicar)

---

## 1. Arrancarla en tu ordenador

Necesitas **Node.js 22.12 o superior** (descárgalo de [nodejs.org](https://nodejs.org), versión LTS). Comprueba la versión con `node --version`.

```bash
git clone https://github.com/Jpadront/web.git
cd web
npm install        # instala las dependencias (solo la primera vez)
npm run dev        # arranca la web en http://localhost:4321
```

Mientras `npm run dev` está en marcha, cualquier cambio en los archivos se ve al momento en el navegador. En este modo **los borradores sí se ven**; en la web publicada, no.

Otros comandos:

| Comando           | Qué hace                                                                   |
| ----------------- | -------------------------------------------------------------------------- |
| `npm run build`   | Comprueba tipos y contenidos y genera la web final en `dist/`              |
| `npm run preview` | Sirve la carpeta `dist/` para verla tal y como quedará publicada           |
| `npm test`        | Ejecuta las pruebas de las fórmulas de la calculadora ORC                  |

Si un archivo de contenido tiene un error (falta un campo obligatorio, un estado que no existe…), `npm run build` falla y dice **qué archivo y qué campo**.

## 2. Subirla a GitHub

El repositorio ya existe: **[github.com/Jpadront/web](https://github.com/Jpadront/web)** y contiene este proyecto en la rama `main`.

Si algún día quieres empezar de cero en otro repositorio:

1. En GitHub, **New repository** → ponle nombre → **sin** README ni .gitignore → *Create repository*.
2. En la carpeta del proyecto:

   ```bash
   git init -b main
   git add .
   git commit -m "Primera versión"
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```

Para subir cambios hechos en tu ordenador:

```bash
git add .
git commit -m "Describe el cambio"
git push
```

> El repositorio puede ser público o privado: Cloudflare Pages y Pages CMS funcionan con los dos.

## 3. Publicarla en Cloudflare Pages

Solo hay que hacerlo una vez. Después, cada `git push` (o cada cambio guardado en Pages CMS) publica la web sola en uno o dos minutos.

1. Crea una cuenta gratuita en [dash.cloudflare.com](https://dash.cloudflare.com/sign-up).
2. En el panel: **Workers y Pages** → **Crear** → pestaña **Pages** → **Conectar a Git**.
   (Si Cloudflare te propone crear un *Worker*, busca la opción de **Pages** / «Importar un repositorio existente» en la pestaña Pages.)
3. Autoriza a Cloudflare en GitHub y elige el repositorio **Jpadront/web**.
4. Configuración de la compilación:

   | Campo                               | Valor            |
   | ----------------------------------- | ---------------- |
   | Rama de producción                  | `main`           |
   | Framework preset                    | `Astro`          |
   | Comando de compilación (build)      | `npm run build`  |
   | Directorio de salida (output)       | `dist`           |
   | Directorio raíz (root)              | *(vacío)*        |

5. Despliega **Variables de entorno** y añade:

   | Variable       | Valor |
   | -------------- | ----- |
   | `NODE_VERSION` | `22`  |

   (El archivo `.node-version` del repositorio ya indica Node 22; la variable lo deja asegurado.)

6. **Guardar e implementar**. Al terminar, la web queda en `https://NOMBRE-DEL-PROYECTO.pages.dev`.
7. Abre `src/data/sitio.json` (o en Pages CMS, *Datos de la web y contacto*) y pon esa dirección en **`url`**. Se usa para el sitemap, el RSS y las imágenes al compartir en redes. Guarda: se vuelve a publicar sola.

Cada rama distinta de `main` y cada *pull request* generan además una **vista previa** con su propia dirección, sin tocar la web publicada.

Las cabeceras de caché y seguridad están en `public/_headers` (Cloudflare las aplica automáticamente). La página `404` personalizada también la usa Cloudflare sin configurar nada.

## 4. Conectar Pages CMS

[Pages CMS](https://pagescms.org) es un editor web que lee y escribe directamente en tu repositorio de GitHub. Su configuración ya está hecha en **`.pages.yml`** (proyectos, bitácora, sobre mí, datos de la web, imágenes y descargas).

1. Entra en **[app.pagescms.org](https://app.pagescms.org)** e inicia sesión con tu cuenta de GitHub.
2. La primera vez te pedirá **instalar la app de Pages CMS en GitHub**: elige *Only select repositories* → **Jpadront/web** → *Install*.
3. Vuelve a Pages CMS, elige el repositorio **web** y la rama **main**.
4. Verás en el menú: **Proyectos**, **Bitácora**, **Sobre mí**, **Datos de la web y contacto** y la **biblioteca de medios** (Imágenes y Descargas).

Cada vez que pulses **Guardar**, Pages CMS hace un commit en GitHub y Cloudflare publica la web de nuevo (uno o dos minutos).

> Si cambias `.pages.yml` (por ejemplo, para añadir un campo), recarga Pages CMS para que lo lea de nuevo.

## 5. Añadir un proyecto o una entrada

Nada de esto requiere tocar código.

### Desde Pages CMS (recomendado)

**Proyecto nuevo:** *Proyectos* → **Añadir** → rellena título, resumen, fecha, estado, categoría, etiquetas, portada, enlaces y el texto → **Guardar**.

- *Destacado*: lo muestra en la portada.
- *Galería* y *Archivos descargables*: para las impresiones 3D (sube los STL/3MF desde la biblioteca **Descargas**).
- *Herramienta interactiva*: incrusta la calculadora ORC al final del proyecto.
- *Borrador*: lo guarda sin publicarlo.

**Entrada nueva de la bitácora:** *Bitácora* → **Añadir** → título, fecha, resumen, texto y, si quieres, el **proyecto** al que pertenece (aparecerá al final de la página de ese proyecto).

**Crónica del Diario de regatas:** igual que una entrada, eligiendo el proyecto *Diario de regatas* y rellenando **Datos de regata** (como mínimo, el nombre). Así aparece la ficha con regata, lugar, barco, clase, posición, pruebas, viento y notas, y la regata entra en la **tabla de resultados** del proyecto.

### A mano, en archivos

- Proyectos: un archivo `.md` en `src/content/proyectos/`. El nombre del archivo es la dirección: `mi-proyecto.md` → `/proyectos/mi-proyecto/`.
- Entradas: un archivo `.md` en `src/content/entradas/`, por ejemplo `2026-10-20-mi-entrada.md` → `/bitacora/2026-10-20-mi-entrada/`.
- Copia uno de los archivos de ejemplo y cambia el contenido: la cabecera entre `---` son los campos (el esquema completo, con comentarios, está en `src/content.config.ts`).
- Imágenes: guárdalas en `src/assets/imagenes/` y enlázalas como `../../assets/imagenes/foto.jpg` (en la cabecera o dentro del texto: `![Descripción](../../assets/imagenes/foto.jpg)`). Astro las convierte a WebP y genera varios tamaños.
- Descargas: guárdalas en `public/descargas/` y enlázalas como `/descargas/pieza.stl`.
- Para usar componentes dentro del texto se pueden crear archivos `.mdx` (pero Pages CMS edita mejor los `.md`).

**Categorías y estados**: están fijados en `src/lib/constantes.ts`. Si quieres uno nuevo, añádelo ahí **y** en las opciones del campo en `.pages.yml`.

## 6. Poner un dominio propio

Compra el dominio donde prefieras (en **Cloudflare Registrar** sale a precio de coste y queda todo en el mismo sitio).

1. En Cloudflare: **Workers y Pages** → tu proyecto → **Dominios personalizados** → **Configurar un dominio personalizado**.
2. Escribe el dominio (`tudominio.com` o `www.tudominio.com`) → *Continuar*.
   - **Si el dominio ya usa los DNS de Cloudflare**: Cloudflare crea el registro solo. Listo.
   - **Si está en otro proveedor**: crea allí un registro **CNAME** de `www` apuntando a `NOMBRE-DEL-PROYECTO.pages.dev`. Para el dominio raíz (`tudominio.com`, sin www) lo más sencillo es pasar los DNS del dominio a Cloudflare (*Añadir un sitio* en el panel y cambiar los *nameservers* en tu proveedor).
3. Espera a que el estado pase a **Activo** (de minutos a unas horas). El certificado HTTPS es automático.
4. Cambia `url` en `src/data/sitio.json` (o en Pages CMS) a `https://tudominio.com`.

## 7. Qué hay en cada carpeta

```
.pages.yml                 Configuración de Pages CMS
astro.config.mjs           Configuración de Astro (integraciones MDX y sitemap)
public/                    Archivos que se publican tal cual
  _headers                 Cabeceras de caché/seguridad para Cloudflare
  descargas/               STL, 3MF… descargables
  favicon.svg, og-default.png
src/
  content.config.ts        Esquemas de las colecciones (campos y validación)
  content/
    proyectos/             Un .md por proyecto
    entradas/              Un .md por entrada de la bitácora
    paginas/sobre-mi.md    Texto de «Sobre mí»
  data/sitio.json          Nombre, presentación, URL y redes
  assets/imagenes/         Imágenes (Astro las optimiza)
  components/              Piezas reutilizables (tarjetas, galería, calculadora…)
  layouts/BaseLayout.astro Estructura común de todas las páginas
  lib/
    constantes.ts          Estados, categorías y herramientas
    contenido.ts           Lectura de colecciones y formato de fechas
    orc.ts                 Fórmulas y coeficientes de la calculadora ORC
  pages/                   Una ruta por archivo (index, proyectos, bitácora, rss…)
  styles/global.css        Estilos y colores (variables al principio)
tests/orc.test.ts          Pruebas de las fórmulas ORC
```

### Diseño

- **Colores, medidas y espaciado**: variables al principio de `src/styles/global.css` (`--fondo`, `--tinta`, `--acento`…) y su versión para el modo oscuro justo debajo.
- **Tipografías** (autoalojadas, sin Google Fonts; se configuran en `astro.config.mjs`): *Geist* para títulos y texto, *Geist Mono* para fechas, etiquetas, cifras y código.
- **Portada**: la pastilla **«Ahora»** muestra el campo *Ahora* de «Datos de la web y contacto» (Pages CMS); si está vacío, enlaza al proyecto en desarrollo con la entrada más reciente.
- **Marca**: el gallardete de la cabecera está en `src/components/Gallardete.astro`; el favicon, en `public/favicon.svg` (cambia de color solo en modo oscuro).
- **Ilustraciones**: las portadas de ejemplo son dibujos tipo carta náutica en `src/assets/imagenes/`. Se pueden sustituir por fotos con el mismo nombre o subir otras desde Pages CMS. Formato ideal: horizontal, 16:10, 1600 px de ancho o más.
- **Pie de página**: dice «Sin cookies ni analítica», y hoy es cierto: el modo claro/oscuro y la calculadora guardan sus datos en el navegador, sin cookies. Si algún día activas Cloudflare Web Analytics u otra herramienta, cambia ese texto en `src/components/Pie.astro`.

## 8. La calculadora ORC

Está en `/calculadora-orc/` y también incrustada en el proyecto *Cálculo de tiempos ORC*. Funciona entera en el navegador y guarda los datos solo en ese navegador.

**Sistema: tiempo sobre distancia (Time on Distance)**

```
Tc = Tr − C × D
```

- `Tr`: tiempo real (s) · `D`: distancia del recorrido (millas) · `Tc`: tiempo compensado (s).
- `C`: coeficiente del barco en segundos por milla, según el modo:
  - **Tabla por viento** (por defecto): los *time allowances* del certificado para 6, 8, 10, 12, 14, 16 y 20 nudos; para el viento de la prueba se **interpola linealmente** entre las dos columnas más próximas (fuera de la tabla se usa el extremo).
  - **Triple número**: coeficiente bajo / medio / alto según el viento (límites en `TRAMOS_TRIPLE`, por defecto < 9 kn y > 14 kn: revísalos con las Instrucciones de Regata).
  - **GPH**: un único coeficiente.

Todas las fórmulas, los límites y los datos de ejemplo (inventados) están comentados en **`src/lib/orc.ts`**. Las pruebas están en `tests/orc.test.ts` (`npm test`). El *Performance Curve Scoring* (viento implícito) no está implementado.

## 9. Primeros pasos: qué cambiar antes de publicar

- [ ] `src/data/sitio.json`: nombre, presentación, email, redes y `url`.
- [ ] `src/content/paginas/sobre-mi.md`: tu texto y tu foto.
- [ ] Los cuatro proyectos de `src/content/proyectos/`: quitar los textos entre corchetes `[…]` y los avisos de «Texto provisional».
- [ ] Las entradas de ejemplo de `src/content/entradas/`: editarlas o borrarlas.
- [ ] Sustituir las imágenes de ejemplo de `src/assets/imagenes/` y `public/og-default.png` (imagen al compartir en redes, 1200×630).
- [ ] Sube tus STL/3MF a `public/descargas/` (o desde la biblioteca «Descargas» de Pages CMS).
