---
titulo: Diario de Optimist
resumen: Un cuaderno de a bordo para un regatista de Optimist. Horas en el agua, entrenamientos y regatas, viento y aparejo, con análisis por meses. Funciona sin conexión.
fecha_inicio: 2026-09-01
estado: en-desarrollo
categoria: software
etiquetas: [optimist, app, sin conexión, dropbox, cloudflare]
portada: ../../assets/imagenes/capturas/diario-vela-pc-y-movil.jpg
portada_alt: El diario de vela en el ordenador, con las horas navegadas del año, y en el móvil, con el análisis por intensidad de viento
destacado: true
enlaces:
  repositorio: ""
  demo: ""
  descarga: ""
galeria:
  - imagen: ../../assets/imagenes/capturas/diario-movil.jpg
    pie: Inicio — horas navegadas, días y sesiones del periodo elegido (datos de ejemplo)
  - imagen: ../../assets/imagenes/capturas/diario-movil-viento.jpg
    pie: Análisis — con qué viento navega y cuánto tiempo acumula en cada rango (datos de ejemplo)
  - imagen: ../../assets/imagenes/capturas/diario-movil-meses.jpg
    pie: Análisis — horas por mes, con colores que comparan cada mes con el resto (datos de ejemplo)
  - imagen: ../../assets/imagenes/capturas/diario-pc.jpg
    pie: En el ordenador, el resumen del año y las horas por mes (datos de ejemplo)
  - imagen: ../../assets/imagenes/capturas/diario-pc-analisis.jpg
    pie: El análisis en pantalla grande (datos de ejemplo)
herramienta: ninguna
---

Una aplicación sencilla para llevar el **cuaderno de vela de un regatista de Optimist**: cada entrenamiento y cada regata, con lo que importa para ver cómo va la temporada.

## Qué guarda cada sesión

- **Fecha y duración**, y si fue entrenamiento o regata.
- **Lugar** y **viento**, por rangos (menos de 6, de 6 a 10, de 10 a 15, más de 15 nudos) o en nudos exactos.
- **Aparejo**: mástil, percha, botavara y vela. Con el tiempo, eso permite ver con qué combinación se navega en cada condición.
- **Observaciones**, para lo que haya que recordar.

## El análisis

- **Horas navegadas**, días y sesiones por mes, año o todo el historial.
- **Medias** por semana, por sesión y por día navegado, y la constancia mensual.
- **Con qué viento navega**: horas y porcentaje en cada rango.
- **Horas por mes** con un código de color. Un detalle que me importaba: los colores comparan las horas entre sí, pero no valoran la calidad del entrenamiento ni marcan un objetivo. Es un diario, no una tabla de exigencias.

## Cómo está hecho

Es una aplicación web que se instala en el móvil y **funciona sin conexión**: los datos se guardan en el propio dispositivo y, si se quiere, se sincronizan con Dropbox. Está publicada en Cloudflare, pero no la enlazo: es un diario personal. Recuerda de vez en cuando hacer una copia de seguridad.

> Las capturas usan **datos de ejemplo**: el diario real vive en el móvil de quien lo usa.
