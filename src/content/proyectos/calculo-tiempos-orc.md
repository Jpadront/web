---
titulo: Cálculo de tiempos ORC
resumen: Calculadora en el navegador del tiempo compensado ORC por tiempo sobre distancia en función del viento, con la explicación de las fórmulas.
fecha_inicio: 2026-05-01
estado: en-desarrollo
categoria: vela
etiquetas: [orc, calculadora, compensación]
portada: ../../assets/imagenes/calculo-orc-portada.jpg
portada_alt: Ilustración de un diagrama polar de velocidades y una tabla de coeficientes
destacado: true
enlaces:
  repositorio: ""
  demo: /calculadora-orc/
  descarga: ""
herramienta: calculadora-orc
---

> **Texto provisional**: edítalo desde Pages CMS o directamente en este archivo.

En ORC no gana quien llega primero, sino quien tiene el menor **tiempo compensado**. Esta herramienta calcula ese tiempo con el sistema de **tiempo sobre distancia** (*Time on Distance*, ToD), usando el coeficiente que corresponde al viento de la regata.

## La idea en una línea

Cada barco tiene en su certificado un *time allowance*: los **segundos que tarda en recorrer una milla** en unas condiciones dadas. Cuanto más rápido es el barco, menos segundos por milla. El tiempo compensado es:

```
tiempo compensado = tiempo real − (segundos por milla × millas del recorrido)
```

Lo que cambia con el viento es el coeficiente: un barco ligero gana mucho con poco viento y un barco pesado aprovecha mejor el viento fuerte. Por eso los certificados ORC dan una tabla de coeficientes para 6, 8, 10, 12, 14, 16 y 20 nudos, y la calculadora **interpola** entre ellos según el viento que elija el comité.

La calculadora está más abajo. Los datos de ejemplo son inventados: sustitúyelos por los de los certificados de tu flota.

Para una regata concreta uso una versión hecha a medida, con los ratings reales de la flota y pensada para el móvil: está en el [Diario de regatas](/proyectos/diario-de-regatas/).
