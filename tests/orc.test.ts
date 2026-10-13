// Pruebas de las fórmulas de la calculadora ORC: `npm test`
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clasificar, coeficientePorViento, EJEMPLO, formatoTiempo, leerTiempo, tiempoCompensado, tramoTriple } from '../src/lib/orc.ts';

const tabla = [880, 735, 662, 622, 598, 582, 563];

test('interpola linealmente entre vientos de la tabla', () => {
  assert.equal(coeficientePorViento(tabla, 11), 642); // entre 10 (662) y 12 (622)
  assert.equal(coeficientePorViento(tabla, 18), 572.5); // entre 16 (582) y 20 (563)
  assert.equal(coeficientePorViento(tabla, 12), 622); // valor exacto
});

test('fuera de la tabla usa el valor del extremo', () => {
  assert.equal(coeficientePorViento(tabla, 3), 880);
  assert.equal(coeficientePorViento(tabla, 28), 563);
});

test('ignora huecos en la tabla', () => {
  assert.equal(coeficientePorViento([880, 735, Number.NaN, 622, 598, 582, 563], 10), (735 + 622) / 2);
});

test('tramos del triple número', () => {
  assert.equal(tramoTriple(8.9), 'bajo');
  assert.equal(tramoTriple(9), 'medio');
  assert.equal(tramoTriple(14), 'medio');
  assert.equal(tramoTriple(14.1), 'alto');
});

test('lee y formatea tiempos', () => {
  assert.equal(leerTiempo('1:52:30'), 6750);
  assert.equal(leerTiempo('52:30'), 3150);
  assert.equal(leerTiempo(' 1:00:00,5 '), 3600.5);
  assert.equal(leerTiempo(''), null);
  assert.equal(leerTiempo('1:xx'), null);
  assert.equal(formatoTiempo(6750), '1:52:30');
  assert.equal(formatoTiempo(-65, true), '−0:01:05');
});

test('Tc = Tr − C × D', () => {
  assert.equal(tiempoCompensado(6750, 642, 9.6), 6750 - 642 * 9.6);
});

test('clasifica por tiempo compensado y deja al final a quien no terminó', () => {
  const barcos = [...EJEMPLO.barcos, { ...EJEMPLO.barcos[0], nombre: 'Retirado', tiempoReal: '' }];
  const r = clasificar(barcos, 'tabla', 11, 9.6);
  assert.deepEqual(r.map((x) => x.posicion), [1, 2, 3, 4, null]);
  assert.equal(r.at(-1)!.barco.nombre, 'Retirado');
  assert.equal(r[0].diferencia, 0);
  for (let i = 1; i < 4; i++) assert.ok(r[i].compensado! >= r[i - 1].compensado!);
});
