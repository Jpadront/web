---
titulo: Cómo se compensa en ORC (tiempo sobre distancia)
fecha: 2026-07-10
resumen: Por qué el coeficiente cambia con el viento y cómo se interpola entre los valores del certificado.
proyecto: calculo-tiempos-orc
etiquetas: [orc, compensación, explicación]
---

> **Entrada de ejemplo**: revisa y amplía el texto.

En **tiempo sobre distancia** se resta al tiempo real de cada barco lo que su certificado dice que tarda en recorrer la distancia del recorrido:

```
Tc = Tr − ToD × D
```

- `Tc`: tiempo compensado (s)
- `Tr`: tiempo real (s)
- `ToD`: coeficiente del barco, en segundos por milla, para el viento elegido
- `D`: distancia del recorrido (millas)

Si el viento elegido está entre dos de los vientos de la tabla (por ejemplo, 11 nudos entre 10 y 12), el coeficiente se toma **en línea recta** entre los dos valores (interpolación lineal).
