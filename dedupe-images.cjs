/**
 * dedupe-images.cjs
 *
 * Borra los duplicados de Drive con sufijos -1, -2, -3 cuando existe
 * una versión "canónica" sin sufijo y del mismo tamaño.
 * Estos vienen del download de carpetas de Google Drive.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const TARGETS = [
  path.join(ROOT, 'private-boats-and-yachts'),
  path.join(ROOT, 'transfers'),
  path.join(ROOT, 'day-trips'),
];

let removed = 0;

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const p = path.join(dir, it.name);
    if (it.isDirectory()) {
      walk(p);
      continue;
    }
    // ¿Es un duplicado tipo "uuid-1.jpg"?
    const m = it.name.match(/^(.+)-(\d+)(\.[a-z0-9]+)$/i);
    if (!m) continue;
    const canonical = path.join(dir, m[1] + m[3]);
    if (!fs.existsSync(canonical)) continue;
    const sDup = fs.statSync(p).size;
    const sCan = fs.statSync(canonical).size;
    if (sDup === sCan) {
      fs.unlinkSync(p);
      removed++;
    }
  }
}

for (const t of TARGETS) walk(t);
console.log(`✔ Borrados ${removed} duplicados`);
