---
titulo: FastTack
resumen: Análisis post-regata de vela con los datos del Atlas 2 de Vakaros. Dónde ganas y dónde pierdes, tramo a tramo, frente a la flota y al top 5. Desarrollado con Claude Code.
fecha_inicio: 2026-03-01
estado: en-desarrollo
categoria: software
etiquetas: [claude-code, python, análisis de datos, j70, racesense]
portada: ../../assets/imagenes/capturas/fasttack-pc-y-movil.jpg
portada_alt: FastTack en el ordenador, con el análisis de una prueba, y en el móvil, con la versión en la nube
destacado: true
enlaces:
  repositorio: https://github.com/Jpadront/FastTack
  demo: https://fasttack.jpadrontorrent.workers.dev/
  descarga: ""
galeria:
  - imagen: ../../assets/imagenes/capturas/fasttack-prueba.jpg
    pie: Resumen de una prueba de la Winter Series (J/70) y dónde se ganó o se perdió tiempo frente al top 5, tramo a tramo
  - imagen: ../../assets/imagenes/capturas/fasttack-mapa.jpg
    pie: Replay de la salida en el mapa, con laylines, corriente estimada y los valores instantáneos de cada barco
  - imagen: ../../assets/imagenes/capturas/fasttack-salida.jpg
    pie: Viento a lo largo de la línea y comparativa de salida (margen, SOG en el disparo, primera virada, paso por la baliza 1)
  - imagen: ../../assets/imagenes/capturas/fasttack-aceleracion.jpg
    pie: Aceleración en la salida, de −60 s a +60 s del disparo, frente a los barcos vecinos
  - imagen: ../../assets/imagenes/capturas/fasttack-pc.jpg
    pie: La versión en la nube («Replay y datos»), publicada en Cloudflare
  - imagen: ../../assets/imagenes/capturas/fasttack-movil.jpg
    pie: La versión en la nube en el móvil
herramienta: ninguna
---

FastTack es mi herramienta de **análisis post-regata**. Lee los datos de **RaceSense**, los GPS Atlas 2 de Vakaros que llevan los barcos, y responde a la pregunta que todos nos hacemos al volver a puerto: *¿dónde se ganó y dónde se perdió la prueba?*

Nació para el J/70 (ESP 1214) y funciona con cualquier clase que use RaceSense; la he probado también con el Mundial de Snipe 2026.

## Qué hace

- **Recorrido y viento reconstruidos** con los GPS de toda la flota: pruebas, balizas, roladas y presión, aunque RaceSense no los publique.
- **Tramo a tramo**: velocidad, VMG, maniobras, táctica y escora, frente a los barcos vecinos y frente al top 5.
- **Salidas**: posición en la línea, margen y velocidad en el disparo, viento a lo largo de la línea y aceleración de −60 s a +60 s.
- **Replay** en el mapa con capas de presión, dirección del viento, amura favorecida, línea del líder y un barco fantasma.
- **Debrief e informe PDF** para la tripulación, con cifras que se comprueban una a una.

Todo lo que depende del viento reconstruido va marcado como **estimado**: prefiero una cifra honesta a una bonita.

## Dos versiones

- **La aplicación completa** (la de las capturas del análisis) funciona en mi ordenador y la abro desde el móvil o la comparto con el equipo cuando hace falta.
- **La versión en la nube** («Replay y datos») está publicada en Cloudflare: importa una jornada de RaceSense, la guarda en el navegador y permite hacer copias en Dropbox para pasarlas entre dispositivos. Necesita una clave de acceso, así que el enlace es más una muestra que una demo abierta.

## Cómo está hecho

Python para el cálculo, una web ligera para verlo y [Claude Code](https://claude.ai/code) como compañero de desarrollo: el código, las fórmulas y su validación están documentados en el [repositorio](https://github.com/Jpadront/FastTack).
