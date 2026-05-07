# BrayanRentals — Sitio web

Sitio en HTML/CSS/JS puro, bilingüe (EN / ES).

## Estructura

```
index.html / index-es.html                 → Home (EN/ES)
private-boats-and-yachts.html              → Catálogo de yates y lanchas (EN)
yates-privados-y-yates.html                → Catálogo de yates y lanchas (ES)
transfers.html / traslados.html            → Catálogo de traslados (EN/ES)
day-trips.html / pasadias.html             → Galería de pasadías (EN/ES)

luxury.css                                 → CSS premium compartido
catalog-render.js                          → Helpers de renderizado de tarjetas

boats.js, transfers.js, day-trips.js       → Datos generados (no editar a mano)

private-boats-and-yachts/<categoria>/<size>/<barco>/  → Fotos
transfers/<vehiculo>/                                  → Fotos
day-trips/                                             → Fotos y videos

actualizaciones/                           → Bandeja de entrada (Drive). Contenido nuevo
                                              que el dueño deja para procesar.
```

## Flujo cuando llegan **actualizaciones nuevas** desde Drive

1. Pegar las carpetas nuevas dentro de `actualizaciones/` siguiendo la estructura:
   - `actualizaciones/PRIVATE BOATS AND YACHTS/<Categoria>/<Tamaño>/<Nombre del barco>/...jpg`
   - `actualizaciones/TRANSFERS/<Vehículo>/...jpg`
   - `actualizaciones/PASADIAS/...jpg`
2. Ejecutar:
   ```bash
   node normalize-actualizaciones.cjs   # copia y normaliza nombres a kebab-case
   node dedupe-images.cjs               # borra duplicados (-1, -2 de Drive)
   ```
3. Si el barco / vehículo es nuevo (no existe en disco), agregarlo a la
   metadata en `generate-data.cjs` (sección `boatsMeta` o `transfersMeta`).
4. Ejecutar:
   ```bash
   node generate-data.cjs               # regenera boats.js / transfers.js / day-trips.js
   ```
5. Verificar abriendo `index.html` con un servidor local:
   ```bash
   python -m http.server 8000
   ```
6. Commit y deploy.

## Instagram feed

El home muestra un grid de Instagram con fotos del catálogo (placeholder).
Para conectarlo al feed real de [@brayanelguedo](https://www.instagram.com/brayanelguedo/):

1. Crear cuenta gratuita en https://behold.so
2. Conectar la cuenta de Instagram
3. Copiar el snippet que les dan, pegarlo en `index.html` (y `index-es.html`)
   reemplazando el `<div id="instagram-feed">` y el script que lo llena.

Mientras tanto el grid muestra fotos del catálogo con link al perfil de IG.

## Contacto

WhatsApp: `+57 314 626 3274` — todos los formularios envían a este número.
