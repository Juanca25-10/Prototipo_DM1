# Bibliolab Activa · Prototipo del punto físico (NO funcional)

Web aparte de la del docente. Todo es simulado; el estado vive en memoria (al recargar se reinicia).

## Cómo correrlo
Pon `punto-fisico.html`, `punto-fisico.css` y `punto-fisico.js` en la misma carpeta que `assets/` y ábrelos con Live Server (`punto-fisico.html`).

## Imágenes (placeholders: si no existe el archivo se ve un recuadro con nombre y ruta)
| Ruta | Uso |
|---|---|
| `assets/img/logo-bibliolab-activa.png` | Logo |
| `assets/img/logo-craib.png`, `logo-ie-boyaca.png` | Logos del encabezado |
| `assets/img/decoracion-fondo.png` | Ilustración inferior (opcional) |
| `assets/img/modulo-bibliolab.png` | Foto del módulo (Entrega local) |
| `assets/img/instruccion-ejemplo.png` | Imagen de ejemplo en las instrucciones |
| `assets/img/avatar-grupo-1.png` a `-3.png` | Avatares de grupo (si faltan, se muestra el número) |

## Pantallas
P12 Código · P13 Errores (formato, no existe, inactiva, archivo inválido, bloqueo) · P14a Título · P14 Ficha · P15 Registro de grupos · P17 Registro manual · P18 Temporizador · P19 Actividad finalizada/cierre · P20 Tipo de entrega · P20b Entregar al docente · P21 Entrega local · P22 Galería.
Rutas: `#/p12`, `#/p13`, … (igual al ID en minúscula).

## Modo demo (botón "Modo demo", Shift+D lo oculta)
Falla del lector, sin cámara, simular tarjeta nueva/repetida/no reconocida, terminar tiempo, saltar de pantalla, descargar un archivo de actividad `.json` de ejemplo y cargarlo en P12.
Códigos: `K7Q2M9XP` y `R4T8W2NB` (Programada), `X9L3P5CD` (Inactiva).

## Por definir / supuestos
- Intentos permitidos y tiempo de bloqueo del código `[por definir]`.
- Tiempo de conservación de las fotos `[por definir]`.
- Máximo de 6 grupos en el prototipo (supuesto).
- Sonidos generados con WebAudio; siempre hay texto junto a la señal sonora.
- Formato del archivo de actividad (`.json` con titulo, momentos, recursos) es un supuesto.
- No cubierto: módulo físico (tarjetas NFC de un color, puerto USB) y pantalla de contexto de uso.
