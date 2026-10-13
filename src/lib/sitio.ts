// Datos generales de la web (src/data/sitio.json, editable desde Pages CMS).
// Se validan aquí con valores por defecto: si al guardar desde el CMS desaparece un
// campo o queda vacío, la web sigue compilando en lugar de romper el despliegue.
import { z } from 'astro/zod';
import datos from '../data/sitio.json';

const texto = (porDefecto = '') => z.preprocess((v) => (v == null ? porDefecto : v), z.string().trim());

const esquema = z.object({
  nombre: texto('Mi web'),
  titulo: texto(),
  descripcion: texto(),
  presentacion: texto(),
  // «Ahora»: en qué estás trabajando (opcional; si está vacío se usa el último proyecto en desarrollo)
  ahora: texto(),
  url: texto('https://example.com'),
  idioma: texto('es-ES'),
  contacto: z
    .preprocess(
      (v) => v ?? {},
      z.object({ email: texto(), github: texto(), instagram: texto(), linkedin: texto() }),
    )
    .default({ email: '', github: '', instagram: '', linkedin: '' }),
  otras_redes: z
    .preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.object({ nombre: texto(), url: texto() })))
    .default([]),
});

const leido = esquema.parse(datos);

export const sitio = {
  ...leido,
  titulo: leido.titulo || leido.nombre,
};
