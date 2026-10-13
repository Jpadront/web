// Funciones de ayuda para leer las colecciones y dar formato a los datos.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Proyecto = CollectionEntry<'proyectos'>;
export type Entrada = CollectionEntry<'entradas'>;

// Los borradores se ven con `npm run dev` pero no se publican.
const publicado = (e: { data: { borrador: boolean } }) => import.meta.env.DEV || !e.data.borrador;

/** Proyectos publicados: primero los destacados y después por fecha de inicio (más recientes primero). */
export async function getProyectos(): Promise<Proyecto[]> {
  const todos = await getCollection('proyectos', publicado);
  return todos.sort(
    (a, b) =>
      Number(b.data.destacado) - Number(a.data.destacado) ||
      b.data.fecha_inicio.valueOf() - a.data.fecha_inicio.valueOf(),
  );
}

/** Entradas publicadas, de la más reciente a la más antigua. */
export async function getEntradas(): Promise<Entrada[]> {
  const todas = await getCollection('entradas', publicado);
  return todas.sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf());
}

const fmtFecha = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const fmtMes = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric', timeZone: 'UTC' });

// Las fechas del frontmatter (2026-09-21) se interpretan en UTC: formateamos en UTC
// para que no salga el día anterior por la zona horaria.
export const formatoFecha = (d: Date) => fmtFecha.format(d);
export const formatoMes = (d: Date) => fmtMes.format(d);
export const fechaISO = (d: Date) => d.toISOString().slice(0, 10);

/** Convierte una etiqueta («Impresión 3D») en un trozo de URL («impresion-3d»). */
export function slugEtiqueta(etiqueta: string): string {
  return etiqueta
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Todas las etiquetas de las entradas con su número de usos, ordenadas por uso. */
export function contarEtiquetas(entradas: Entrada[]) {
  const mapa = new Map<string, { nombre: string; slug: string; total: number }>();
  for (const e of entradas) {
    for (const nombre of e.data.etiquetas) {
      const slug = slugEtiqueta(nombre);
      if (!slug) continue;
      const actual = mapa.get(slug) ?? { nombre, slug, total: 0 };
      actual.total++;
      mapa.set(slug, actual);
    }
  }
  return [...mapa.values()].sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre, 'es'));
}

/** Texto de posición de regata: «3.º de 12». */
export function textoPosicion(posicion?: number, participantes?: number) {
  if (!posicion) return undefined;
  return participantes ? `${posicion}.º de ${participantes}` : `${posicion}.º`;
}

/** Fecha corta para listados tipo cuaderno de bitácora: «01.10.2026». */
export const formatoFechaCorta = (d: Date) =>
  `${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${d.getUTCFullYear()}`;

/** Minutos de lectura aproximados (220 palabras por minuto; mínimo 1). */
export function minutosLectura(texto = ''): number {
  const palabras = texto
    .replace(/```[\s\S]*?```/g, ' ') // sin bloques de código
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // sin imágenes
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 220));
}

/** Número de orden con dos cifras: 1 → «01». */
export const dosCifras = (n: number) => String(n).padStart(2, '0');
