/**
 * Cálculo de tiempos compensados ORC por TIEMPO SOBRE DISTANCIA (Time on Distance, ToD).
 *
 * Todo el cálculo se hace en el navegador; este módulo no depende del DOM y se puede
 * probar por separado.
 *
 * ── Fórmula ───────────────────────────────────────────────────────────────────────
 *
 *     Tc = Tr − C × D
 *
 *   Tc  tiempo compensado (s)
 *   Tr  tiempo real empleado, desde la salida hasta la llegada (s)
 *   C   coeficiente del barco = «time allowance»: segundos que el certificado ORC dice
 *       que el barco tarda en navegar UNA milla en las condiciones elegidas (s/milla)
 *   D   distancia del recorrido (millas náuticas)
 *
 *   Gana el menor Tc. Un barco más rápido tiene un C menor, así que se le resta menos.
 *
 * ── De dónde sale C (según el modo) ──────────────────────────────────────────────
 *
 *   1. «tabla»  — tiempo sobre distancia EN FUNCIÓN DEL VIENTO.
 *      El certificado da, para un tipo de recorrido (barlovento-sotavento, costero…),
 *      el time allowance para 6, 8, 10, 12, 14, 16 y 20 nudos de viento real.
 *      El comité fija el viento de la prueba y C se obtiene INTERPOLANDO LINEALMENTE
 *      entre los dos vientos de la tabla más próximos (ver `coeficientePorViento`).
 *      Fuera del rango de la tabla se usa el valor del extremo (no se extrapola).
 *
 *   2. «triple» — triple número de ToD (bajo / medio / alto).
 *      El certificado da tres coeficientes; se elige uno según el tramo de viento
 *      (límites en TRAMOS_TRIPLE, revísalos con las Instrucciones de Regata).
 *
 *   3. «gph»    — un único coeficiente para todas las condiciones: el GPH
 *      (General Purpose Handicap, s/milla) del certificado.
 *
 * Nota: el sistema «Performance Curve Scoring» (viento implícito) NO está implementado;
 * aquí el viento lo fija el usuario, no se deduce de los tiempos.
 */

/** Vientos (nudos) de las columnas de la tabla de un certificado ORC. */
export const VIENTOS_TABLA = [6, 8, 10, 12, 14, 16, 20] as const;

/**
 * Tramos de viento del triple número. Revisa estos límites con las Instrucciones de
 * Regata de cada evento: algunos comités los definen de forma distinta.
 *   viento <  bajoHasta            → coeficiente «bajo»
 *   bajoHasta ≤ viento ≤ medioHasta → coeficiente «medio»
 *   viento >  medioHasta           → coeficiente «alto»
 */
export const TRAMOS_TRIPLE = { bajoHasta: 9, medioHasta: 14 } as const;

export type Modo = 'tabla' | 'triple' | 'gph';
export type Tramo = 'bajo' | 'medio' | 'alto';

export interface Barco {
  nombre: string;
  /** Tiempo real como texto, p. ej. "1:52:30" (h:mm:ss) o "52:30" (mm:ss). Vacío = no terminó. */
  tiempoReal: string;
  /** Time allowance (s/milla) para cada viento de VIENTOS_TABLA, en el mismo orden */
  tabla: number[];
  triple: Record<Tramo, number>;
  gph: number;
}

export interface Resultado {
  barco: Barco;
  /** Tiempo real en segundos (null si no terminó o el tiempo no es válido) */
  real: number | null;
  /** Coeficiente usado (s/milla) */
  coeficiente: number | null;
  compensado: number | null;
  posicion: number | null;
  /** Diferencia de tiempo compensado con el primero (s) */
  diferencia: number | null;
}

/**
 * Interpolación lineal del coeficiente para un viento dado.
 * Ejemplo: 11 nudos está entre 10 (C=662) y 12 (C=622) →
 *   C = 662 + (11 − 10) / (12 − 10) × (622 − 662) = 642 s/milla
 */
export function coeficientePorViento(tabla: number[], viento: number, vientos: readonly number[] = VIENTOS_TABLA): number | null {
  const puntos = vientos
    .map((v, i) => [v, tabla[i]] as const)
    .filter(([, c]) => Number.isFinite(c) && c > 0);
  if (puntos.length === 0 || !Number.isFinite(viento)) return null;
  if (viento <= puntos[0][0]) return puntos[0][1];
  const ultimo = puntos[puntos.length - 1];
  if (viento >= ultimo[0]) return ultimo[1];
  for (let i = 0; i < puntos.length - 1; i++) {
    const [v0, c0] = puntos[i];
    const [v1, c1] = puntos[i + 1];
    if (viento >= v0 && viento <= v1) return c0 + ((viento - v0) / (v1 - v0)) * (c1 - c0);
  }
  return null;
}

/** Tramo del triple número que corresponde a un viento. */
export function tramoTriple(viento: number): Tramo {
  if (viento < TRAMOS_TRIPLE.bajoHasta) return 'bajo';
  if (viento <= TRAMOS_TRIPLE.medioHasta) return 'medio';
  return 'alto';
}

/** Coeficiente (s/milla) de un barco según el modo y el viento. */
export function coeficiente(barco: Barco, modo: Modo, viento: number): number | null {
  const valido = (n: number) => (Number.isFinite(n) && n > 0 ? n : null);
  switch (modo) {
    case 'tabla':
      return coeficientePorViento(barco.tabla, viento);
    case 'triple':
      return valido(barco.triple[tramoTriple(viento)]);
    case 'gph':
      return valido(barco.gph);
  }
}

/** Tc = Tr − C × D  (todo en segundos y millas) */
export const tiempoCompensado = (real: number, coef: number, distancia: number) => real - coef * distancia;

/**
 * Convierte "h:mm:ss", "mm:ss" o "ss" en segundos. Admite décimas ("1:02:03.5").
 * Devuelve null si el texto está vacío o no es válido.
 */
export function leerTiempo(texto: string): number | null {
  const t = texto.trim().replace(',', '.');
  if (!t) return null;
  const partes = t.split(':');
  if (partes.length > 3 || partes.some((p) => p === '' || !/^\d+(\.\d+)?$/.test(p))) return null;
  const n = partes.map(Number);
  // A partir del final: segundos, minutos, horas
  return n.reverse().reduce((total, valor, i) => total + valor * 60 ** i, 0);
}

/** Segundos → "h:mm:ss" (con signo si se pide, para las diferencias). */
export function formatoTiempo(segundos: number, conSigno = false): string {
  const signo = segundos < 0 ? '−' : conSigno ? '+' : '';
  let s = Math.round(Math.abs(segundos));
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  const dos = (x: number) => String(x).padStart(2, '0');
  return `${signo}${h}:${dos(m)}:${dos(s)}`;
}

/** Calcula y ordena la clasificación. Los barcos sin tiempo válido van al final. */
export function clasificar(barcos: Barco[], modo: Modo, viento: number, distancia: number): Resultado[] {
  const res: Resultado[] = barcos.map((barco) => {
    const real = leerTiempo(barco.tiempoReal);
    const coef = coeficiente(barco, modo, viento);
    const compensado = real != null && coef != null && distancia > 0 ? tiempoCompensado(real, coef, distancia) : null;
    return { barco, real, coeficiente: coef, compensado, posicion: null, diferencia: null };
  });
  const conTiempo = res.filter((r) => r.compensado != null).sort((a, b) => a.compensado! - b.compensado!);
  const primero = conTiempo[0]?.compensado ?? 0;
  conTiempo.forEach((r, i) => {
    // Empates: misma posición si el tiempo compensado redondeado al segundo coincide
    const anterior = conTiempo[i - 1];
    r.posicion = anterior && Math.round(anterior.compensado!) === Math.round(r.compensado!) ? anterior.posicion : i + 1;
    r.diferencia = r.compensado! - primero;
  });
  return [...conTiempo, ...res.filter((r) => r.compensado == null)];
}

/**
 * Datos de ejemplo INVENTADOS (no son certificados reales).
 * Sustitúyelos por los de los certificados de tu flota.
 */
export const EJEMPLO: { modo: Modo; viento: number; distancia: number; barcos: Barco[] } = {
  modo: 'tabla',
  viento: 11,
  distancia: 9.6,
  barcos: [
    { nombre: 'Macaco', tiempoReal: '1:52:30', tabla: [880, 735, 662, 622, 598, 582, 563], triple: { bajo: 742, medio: 640, alto: 588 }, gph: 650 },
    { nombre: 'Siroco', tiempoReal: '1:49:10', tabla: [840, 700, 630, 592, 570, 556, 540], triple: { bajo: 708, medio: 610, alto: 562 }, gph: 620 },
    { nombre: 'Albatros', tiempoReal: '1:58:20', tabla: [930, 780, 700, 655, 630, 612, 592], triple: { bajo: 788, medio: 676, alto: 618 }, gph: 690 },
    { nombre: 'Tramontana', tiempoReal: '1:51:40', tabla: [860, 718, 648, 608, 585, 570, 552], triple: { bajo: 725, medio: 626, alto: 576 }, gph: 635 },
  ],
};
