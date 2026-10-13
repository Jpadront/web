// Esquemas tipados de las colecciones de contenido.
// Cada archivo .md de src/content/<colección>/ se valida contra su esquema al compilar:
// si falta un campo obligatorio o tiene un valor no válido, `npm run build` falla
// indicando el archivo y el campo.
import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { CATEGORIAS, ESTADOS, HERRAMIENTAS, claves } from './lib/constantes';

/**
 * Pages CMS guarda los campos vacíos como "" o null en lugar de omitirlos.
 * `vacio` los convierte en `undefined` para que los campos opcionales no fallen.
 */
const vacio = (v: unknown) => (v === '' || v === null ? undefined : v);
const opcional = <T extends z.ZodType>(s: T) => z.preprocess(vacio, s.optional());

/** URL opcional: admite vacío, "https://…" y rutas internas ("/descargas/pieza.stl"). */
const enlace = opcional(z.string().trim());

/** Lista opcional: null/"" → [] */
const lista = <T extends z.ZodType>(s: T) =>
  z.preprocess((v) => (v === '' || v == null ? [] : v), z.array(s));

/**
 * Referencia a un proyecto. Pages CMS puede guardar la ruta completa
 * ("src/content/proyectos/fasttack.md") o solo el nombre: nos quedamos con el
 * nombre del archivo sin extensión, que es el id que Astro da a cada entrada.
 */
const refProyecto = z.preprocess((v) => {
  if (typeof v !== 'string' || v.trim() === '') return undefined;
  return v.trim().split('/').pop()!.replace(/\.(md|mdx)$/i, '').toLowerCase();
}, reference('proyectos').optional());

const proyectos = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/proyectos' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      resumen: z.string().max(240, 'El resumen debe ser corto (máx. 240 caracteres)'),
      fecha_inicio: z.coerce.date(),
      estado: z.enum(claves(ESTADOS)),
      categoria: z.enum(claves(CATEGORIAS)),
      etiquetas: lista(z.string()),
      portada: opcional(image()),
      portada_alt: opcional(z.string()),
      destacado: z.preprocess(vacio, z.boolean().default(false)),
      enlaces: z
        .preprocess(
          (v) => v ?? {},
          z.object({ repositorio: enlace, demo: enlace, descarga: enlace }),
        )
        .default({}),
      // Galería (pensada para las impresiones 3D, pero sirve para cualquier proyecto)
      galeria: lista(z.object({ imagen: image(), pie: opcional(z.string()) })),
      // Archivos descargables (STL, 3MF, STEP…) guardados en public/descargas
      descargas: lista(z.object({ archivo: z.string(), nombre: opcional(z.string()) })),
      herramienta: z.preprocess(vacio, z.enum(claves(HERRAMIENTAS)).default('ninguna')),
      borrador: z.preprocess(vacio, z.boolean().default(false)),
    }),
});

const entradas = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/entradas' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      fecha: z.coerce.date(),
      resumen: z.string(),
      proyecto: refProyecto,
      etiquetas: lista(z.string()),
      portada: opcional(image()),
      portada_alt: opcional(z.string()),
      // Datos de regata: solo se rellenan en las crónicas del Diario de regatas.
      // Si no hay nombre de regata, la entrada se trata como una entrada normal.
      regata: z
        .preprocess(
          (v) => v ?? {},
          z.object({
            nombre: opcional(z.string()),
            lugar: opcional(z.string()),
            barco: opcional(z.string()),
            clase: opcional(z.string()),
            posicion: opcional(z.coerce.number().int().positive()),
            participantes: opcional(z.coerce.number().int().positive()),
            pruebas: opcional(z.coerce.number().int().nonnegative()),
            viento: opcional(z.string()),
            notas: opcional(z.string()),
          }),
        )
        .default({}),
      borrador: z.preprocess(vacio, z.boolean().default(false)),
    }),
});

const paginas = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/paginas' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      descripcion: z.string(),
      foto: opcional(image()),
      foto_alt: opcional(z.string()),
    }),
});

export const collections = { proyectos, entradas, paginas };
