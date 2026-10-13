---
titulo: Calculadora de tiempo compensado ORC
resumen: Esta calculadora se creó para el X37 Macaco, con los ratings reales de
  la flota en el trofeo Princesa de Asturias 2026, y es un calculadora general
  de tiempo sobre distancia en función del viento.
fecha_inicio: 2026-05-01
estado: en-desarrollo
categoria: vela
etiquetas:
  - orc
  - calculadora
  - compensación
  - macaco
portada: ../../assets/imagenes/capturas/macaco-pc-y-movil.jpg
portada_alt: La calculadora del Macaco en el ordenador y en el móvil, con la
  diferencia de rating frente a cada barco de la flota
destacado: true
enlaces:
  demo: https://macaco.jpadrontorrent.workers.dev/
galeria:
  - imagen: ../../assets/imagenes/capturas/macaco-pc.jpg
    pie: Referencias de la flota a 12 nudos, del barco más rápido al más lento
  - imagen: ../../assets/imagenes/capturas/macaco-pc-oscuro.jpg
    pie: La misma vista en modo oscuro
  - imagen: ../../assets/imagenes/capturas/macaco-movil.jpg
    pie: En el móvil, a bordo, con el Macaco como referencia 0
  - imagen: ../../assets/imagenes/capturas/macaco-movil-claro.jpg
    pie: Versión clara, con el control de viento y los grupos de la flota
herramienta: calculadora-orc
borrador: false
---
En ORC no gana quien llega primero, sino quien tiene el menor **tiempo compensado**. Este proyecto reúne las herramientas que uso para calcularlo.

## La calculadora de a bordo del Macaco

Para el **XXXVI Trofeo Princesa de Asturias** preparé una calculadora pensada para usarla en el barco, en el móvil, con los certificados reales de la flota:

- Eliges el **viento** y la app interpola el rating barlovento-sotavento (WL) de cada barco entre 4 y 24 nudos.
- Para cada rival muestra, en **segundos por milla**, cuánto nos tiene que sacar (+) o cuánto le tenemos que sacar (−). El Macaco, un X-37 (ESP 8376), es la referencia 0.
- Con los **datos de la manga** (tramo y vueltas) calcula los umbrales de tiempo y de llegada.
- Avisa cuando un barco estrena certificado durante el campeonato.

Es una estimación: el cálculo oficial (PCS) usa el viento implícito que sale de los tiempos de todos. Pero a bordo es justo lo que necesitas saber: *¿vamos bien frente a ese barco?*

## La idea, en una línea

Cada barco tiene en su certificado un *time allowance*: los **segundos que tarda en recorrer una milla** en unas condiciones dadas. Cuanto más rápido es el barco, menos segundos por milla. El tiempo compensado es:

```
tiempo compensado = tiempo real − (segundos por milla × millas del recorrido)
```

Lo que cambia con el viento es el coeficiente: un barco ligero gana mucho con poco viento y un barco pesado aprovecha mejor el viento fuerte. Por eso los certificados ORC dan una tabla de coeficientes para 6, 8, 10, 12, 14, 16 y 20 nudos, y se **interpola** entre ellos según el viento.

## Calculadora general

Más abajo está la versión general, para cualquier flota: introduces los barcos, su tiempo real y los coeficientes de su certificado, y sale la clasificación. Los datos de ejemplo son inventados; también está en su [propia página](/calculadora-orc/).