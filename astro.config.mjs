// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
// La URL pública se edita en src/data/sitio.json (también desde Pages CMS).
// Se necesita para el sitemap, el RSS y las etiquetas canónicas / Open Graph.
import sitio from './src/data/sitio.json' with { type: 'json' };

export default defineConfig({
  site: sitio.url,
  // Las URLs terminan en "/" (p. ej. /proyectos/fasttack/), como sirve Cloudflare Pages
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  // Prefetch: al pasar el ratón sobre un enlace, se precarga la página → navegación casi instantánea
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
