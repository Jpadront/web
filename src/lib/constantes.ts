// Listas cerradas de la web. Si añades un valor aquí, añádelo también en
// .pages.yml (campo «select» correspondiente) para que aparezca en Pages CMS.

export const ESTADOS = {
  idea: 'Idea',
  'en-desarrollo': 'En desarrollo',
  terminado: 'Terminado',
  pausado: 'Pausado',
} as const;

export const CATEGORIAS = {
  software: 'Software',
  vela: 'Vela',
  '3d': 'Impresión 3D',
  otros: 'Otros',
} as const;

// Herramientas interactivas que se pueden incrustar en la página de un proyecto
// eligiéndolas en el campo «herramienta» (sin tocar código).
export const HERRAMIENTAS = {
  ninguna: 'Ninguna',
  'calculadora-orc': 'Calculadora de tiempos ORC',
} as const;

export type Estado = keyof typeof ESTADOS;
export type Categoria = keyof typeof CATEGORIAS;
export type Herramienta = keyof typeof HERRAMIENTAS;

// Helper para z.enum: Object.keys pierde el tipo literal, así que lo recuperamos
export const claves = <T extends Record<string, string>>(o: T) =>
  Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];
