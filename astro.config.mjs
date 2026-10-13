// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
// La URL pública se edita en src/data/sitio.json (también desde Pages CMS).
// Se necesita para el sitemap, el RSS y las etiquetas canónicas / Open Graph.
import sitio from './src/data/sitio.json' with { type: 'json' };

// Fuentes autoalojadas desde paquetes npm (@fontsource-variable/*): se sirven desde la
// propia web, sin Google Fonts ni otros servicios. Astro genera además fuentes de
// respaldo con las mismas métricas, para que el texto no «salte» mientras cargan.
//   Newsreader     → títulos y entradillas (serif editorial)
//   Inter          → texto e interfaz
//   JetBrains Mono → fechas, etiquetas y cifras
export default defineConfig({
  site: sitio.url || 'https://example.com',
  // Las URLs terminan en "/" (p. ej. /proyectos/fasttack/), como sirve Cloudflare Pages
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  // Prefetch: al pasar el ratón sobre un enlace, se precarga la página → navegación casi instantánea
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Newsreader',
      cssVariable: '--fuente-titulos',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          { src: ['@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2'], weight: '200 800', style: 'normal' },
          { src: ['@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2'], weight: '200 800', style: 'italic' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--fuente-texto',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          { src: ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'], weight: '100 900', style: 'normal' },
          { src: ['@fontsource-variable/inter/files/inter-latin-wght-italic.woff2'], weight: '100 900', style: 'italic' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'JetBrains Mono',
      cssVariable: '--fuente-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [{ src: ['@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2'], weight: '100 800', style: 'normal' }],
      },
    },
  ],
  markdown: {
    // Resaltado de código con tema claro y oscuro (se cambia con el modo de la web, ver global.css)
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' }, defaultColor: false },
  },
});
