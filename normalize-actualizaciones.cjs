/**
 * normalize-actualizaciones.cjs
 *
 * Copia los archivos de la carpeta `actualizaciones/` (que vienen de Drive
 * con espacios, paréntesis y acentos) hacia las carpetas finales del sitio,
 * usando el mismo patrón que las carpetas que ya existen.
 *
 * - Boats nuevos van a `private-boats-and-yachts/<categoria-slug>/<size-slug>/<boat-slug>/`
 * - Transfers a `transfers/<vehicle-slug>/`
 * - Day Trips (Pasadias) a `day-trips/`
 *
 * No borra ni mueve, solo copia. Si el destino ya existe se omite.
 * Idempotente: se puede correr varias veces sin duplicar.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'actualizaciones');

function slugify(s) {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[()_]+/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sanitizeFile(name) {
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, path.extname(name));
  const clean = base
    .replace(/[()]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return clean + ext;
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

let copied = 0, skipped = 0;
function copyFile(src, dst) {
  ensureDir(path.dirname(dst));
  if (fs.existsSync(dst)) { skipped++; return; }
  fs.copyFileSync(src, dst);
  copied++;
}

function copyDir(srcDir, dstDir) {
  ensureDir(dstDir);
  const items = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const it of items) {
    if (it.isDirectory()) continue; // we handle one level here
    const srcPath = path.join(srcDir, it.name);
    const dstName = sanitizeFile(it.name);
    copyFile(srcPath, path.join(dstDir, dstName));
  }
}

// =============================================================================
// PRIVATE BOATS AND YACHTS
// =============================================================================
const boatsSrc = path.join(SRC, 'PRIVATE BOATS AND YACHTS');
const boatsDst = path.join(ROOT, 'private-boats-and-yachts');

// Map "Speedboats - Luxury Boats" -> "speedboats-luxury-boats" (matches existing)
const categoryMap = {
  'Speedboats - Luxury Boats': 'speedboats-luxury-boats',
  'Yachts - Luxury Yachts': 'yachts-luxury-yachts',
};

// Si el dueño cambia el folder size (capacidad) en Drive y ya existía con
// el slug antiguo, mapeamos al folder existente para no duplicar.
const sizeFolderOverrides = {
  // Azimut 48: el Drive nuevo dice "10 Personas" pero el folder legacy
  // del sitio ya está en disco como "14-personas". Mantenemos el legacy.
  'AZIMUT - 48 PIES -44 FT -10 Personas Maximo -10 People Maximum_':
    'azimut-48-pies-44-ft-14-personas-maximo-14-people-maximum',
};

// Algunos barcos vienen con typos / mayúsculas distintas en Drive y ya
// existen con el slug correcto. Mapeamos para no duplicar carpetas.
const boatNameOverrides = {
  GRAZZIE: 'grazie', // mismo barco, slug existente "grazie"
};

if (fs.existsSync(boatsSrc)) {
  for (const cat of fs.readdirSync(boatsSrc)) {
    const catSrc = path.join(boatsSrc, cat);
    if (!fs.statSync(catSrc).isDirectory()) continue;
    const catDstName = categoryMap[cat] || slugify(cat);
    for (const size of fs.readdirSync(catSrc)) {
      const sizeSrc = path.join(catSrc, size);
      if (!fs.statSync(sizeSrc).isDirectory()) continue;
      const sizeSlug = sizeFolderOverrides[size] || slugify(size);
      for (const boat of fs.readdirSync(sizeSrc)) {
        const boatSrc = path.join(sizeSrc, boat);
        if (!fs.statSync(boatSrc).isDirectory()) continue;
        const trimmed = boat.trim();
        const boatSlug = boatNameOverrides[trimmed] || slugify(trimmed);
        const dst = path.join(boatsDst, catDstName, sizeSlug, boatSlug);
        copyDir(boatSrc, dst);
      }
    }
  }
}

// =============================================================================
// TRANSFERS
// =============================================================================
const transfersSrc = path.join(SRC, 'TRANSFERS');
const transfersDst = path.join(ROOT, 'transfers');

const transferMap = {
  'DUSTER 2025 1-2 People 1-2 Personas': 'duster-2025-1-2-people',
  'Hyunday Creta 2025 1-2 People 1-2 Personas': 'hyundai-creta-2025-1-2-people',
  'MASTER & Citroen 8-12 People 8-12 Personas': 'master-citroen-8-12-people',
  'SPRINTER BLACK 13-18 People 13-18 Personas': 'sprinter-black-13-18-people',
  'SPRINTER WHITE 13-18 People 13-18 Personas': 'sprinter-white-13-18-people',
  'TRAFFIC  3 - 8 People 3-8 Personas': 'traffic-3-8-people',
  'VITO BLACK  1- 6People 2-6 Personas': 'vito-black-2-6-people',
};

if (fs.existsSync(transfersSrc)) {
  for (const item of fs.readdirSync(transfersSrc)) {
    const itemSrc = path.join(transfersSrc, item);
    if (!fs.statSync(itemSrc).isDirectory()) continue;
    const slug = transferMap[item] || slugify(item);
    copyDir(itemSrc, path.join(transfersDst, slug));
  }
}

// =============================================================================
// PASADIAS / DAY TRIPS
// =============================================================================
const pasadiasSrc = path.join(SRC, 'PASADIAS');
const pasadiasDst = path.join(ROOT, 'day-trips');

if (fs.existsSync(pasadiasSrc)) {
  copyDir(pasadiasSrc, pasadiasDst);
}

console.log(`✔ Copiados: ${copied} archivos, omitidos (ya existían): ${skipped}`);
