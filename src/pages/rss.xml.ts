// Feed RSS de la bitácora: /rss.xml
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import sitio from '../data/sitio.json';
import { getEntradas } from '../lib/contenido';

export async function GET(context: APIContext) {
  const entradas = await getEntradas();
  return rss({
    title: `${sitio.nombre} · Bitácora`,
    description: sitio.descripcion,
    site: context.site!,
    items: entradas.map((e) => ({
      title: e.data.titulo,
      description: e.data.resumen,
      pubDate: e.data.fecha,
      link: `/bitacora/${e.id}/`,
      categories: e.data.etiquetas,
    })),
    customData: `<language>es-es</language>`,
  });
}
