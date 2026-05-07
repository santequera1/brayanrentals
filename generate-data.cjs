/**
 * generate-data.cjs
 *
 * Genera tres archivos de datos a partir del filesystem:
 *   - boats.js       (catálogo de embarcaciones)
 *   - transfers.js   (catálogo de vehículos)
 *   - day-trips.js   (galería de paseos de día)
 *
 * Lee las carpetas reales en disco para no escribir rutas a mano.
 *
 * Idempotente: se puede correr cuantas veces se quiera.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Sort: jpg/jpeg/png primero (orden alfabético), luego mp4
function sortMedia(files) {
  const isVideo = f => /\.(mp4|mov|webm)$/i.test(f);
  return files.slice().sort((a, b) => {
    const va = isVideo(a), vb = isVideo(b);
    if (va !== vb) return va ? 1 : -1;
    return a.localeCompare(b);
  });
}

function listMedia(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => /\.(jpe?g|png|mp4|mov|webm)$/i.test(f));
}

// =============================================================================
// BOATS — catálogo
// =============================================================================
//
// Mapeo manual de slug -> nombre bonito, capacidad, tamaño, categoría.
// Mantiene el formato del boats.js anterior para no romper la página.
//
const boatsMeta = {
  // ---- 28 FT (8 ppl) ----
  'speedboats-luxury-boats/28-pies-28-ft-8-personas-maximo-8-people-maximum': {
    size: '28 FT', capacity: '8 Personas Maximo',
    category: 'Speedboats / Luxury Boats',
    boats: {
      'leroy': 'Leroy',
      'makarela-i': 'Makarela I',
      'nederucho': 'Nederucho',
      'no-es-facil': 'No es facil',
      'salvaje': 'Salvaje',
      'disfruta-el-momento-iii': 'Disfruta el Momento III',
    },
  },
  // ---- 29 FT (10 ppl) ----
  'speedboats-luxury-boats/29-pies-29-ft-10-personas-maximo-10-people-maximum': {
    size: '29 FT', capacity: '10 Personas Maximo',
    category: 'Speedboats / Luxury Boats',
    boats: {
      'habla-uchalex': 'Habla Uchalex',
      'makarela': 'Makarela',
      'mariana': 'Mariana',
      'monkey': 'Monkey',
      'poseidon': 'Poseidón',
      'recuca': 'Recuca',
    },
  },
  // ---- 32 FT (12 ppl) ----
  'speedboats-luxury-boats/32-pies-32-ft-12-personas-maximo-12-people-maximum': {
    size: '32 FT', capacity: '12 Personas Maximo',
    category: 'Speedboats / Luxury Boats',
    boats: { 'mariana-ii': 'Mariana II' },
  },
  // ---- 34 FT (12 ppl) ----
  'speedboats-luxury-boats/34-pies-34-ft-12-personas-maximo-12-people-maximum': {
    size: '34 FT', capacity: '12 Personas Maximo',
    category: 'Speedboats / Luxury Boats',
    boats: {
      'black-bunny': 'Black Bunny',
      'dulcinea': 'DULCINEA',
      'maria-tere': 'María Tere',
    },
  },
  // ---- 38 FT (14-15 ppl) ----
  'speedboats-luxury-boats/38-pies-38-ft-14-personas-maximo-15-people-maximum': {
    size: '38 FT', capacity: '14 Personas Maximo',
    category: 'Speedboats / Luxury Boats',
    boats: {
      'black-rhino': 'BLACK RHINO',
      'grazie': 'Grazzie',
      'morronga': 'Morronga',
      'steam': 'STEAM',
    },
  },
  // ---- 39 FT (16 ppl) ----
  'speedboats-luxury-boats/39-pies-39-ft-16-personas-maximo-16-people-maximum': {
    size: '39 FT', capacity: '16 Personas Maximo',
    category: 'Speedboats / Luxury Boats',
    boats: {
      'atabey': 'ATABEY',
      'black-sheep': 'BLACK SHEEP',
      'mariana-iii': 'MARIANA III',
    },
  },
  // ---- 40 FT (16 ppl) ----
  'speedboats-luxury-boats/40-pies-40-ft-16-personas-maximo-16-people-maximum': {
    size: '40 FT', capacity: '16 Personas Maximo',
    category: 'Speedboats / Luxury Boats',
    boats: {
      'alan': 'ALAN',
      'angel': 'ÁNGEL',
      'ghost': 'GHOST',
      'lux': 'LUX',
    },
  },
  // ---- 41 FT (18 ppl) ----
  'speedboats-luxury-boats/41-pies-41-ft-18-personas-maximo-18-people-maximum': {
    size: '41 FT', capacity: '18 Personas Maximo',
    category: 'Speedboats / Luxury Boats',
    boats: {
      'awa': 'AWA',
      'barzans': 'BARZANS',
    },
  },
  // ---- 42 FT (20 ppl) ----
  'speedboats-luxury-boats/42-pies-42-ft-20-personas-maximo-20-people-maximum': {
    size: '42 FT', capacity: '20 Personas Maximo',
    category: 'Speedboats / Luxury Boats',
    boats: {
      'argento': 'ARGENTO',
      'libertad': 'LIBERTAD',
    },
  },
  // ---- 43 FT (35 ppl) ----
  'speedboats-luxury-boats/43-pies-43ft-35-personas-maximo-35-people-maximum': {
    size: '43 FT', capacity: '35 Personas Maximo',
    category: 'Speedboats / Luxury Boats',
    boats: { 'bendito': 'BENDITO' },
  },
  // ---- 45 FT (18 ppl) ----
  'speedboats-luxury-boats/45-pies-45-ft-18-personas-maximo-18-people-maximum': {
    size: '45 FT', capacity: '18 Personas Maximo',
    category: 'Speedboats / Luxury Boats',
    boats: { 'suggar-mommy': 'SUGGAR MOMMY' },
  },

  // ---- YATES ----
  'yachts-luxury-yachts/azimut-48-pies-44-ft-14-personas-maximo-14-people-maximum': {
    size: '48 FT', capacity: '10 Personas Maximo', // capacidad actualizada (Drive 2026)
    category: 'Yachts / Luxury Yachts',
    boats: { 'myriam-esther': 'MYRIAM ESTHER' },
  },
  'yachts-luxury-yachts/azimut-55-pies-55-ft-18-personas-maximo-18-people-maximum': {
    size: '55 FT', capacity: '18 Personas Maximo',
    category: 'Yachts / Luxury Yachts',
    boats: {
      'almani-mar': 'ALMANI MAR',
      'free-land': 'FREE LAND',
    },
  },
  'yachts-luxury-yachts/azimut-61-pies-61-ft-20-personas-maximo-20-people-maximum': {
    size: '61 FT', capacity: '20 Personas Maximo',
    category: 'Yachts / Luxury Yachts',
    boats: {
      'azul': 'AZUL',
      'luz-i': 'LUZ I',
      'venecia': 'VENECIA',
    },
  },
  'yachts-luxury-yachts/azimut-62-pies-62-ft-24-personas-maximo-24-people-maximum': {
    size: '62 FT', capacity: '24 Personas Maximo',
    category: 'Yachts / Luxury Yachts',
    boats: { 'sky-land': 'SKY LAND' },
  },
  'yachts-luxury-yachts/azimut-70-pies-70-ft-28-personas-maximo-28-people-maximum': {
    size: '70 FT', capacity: '28 Personas Maximo',
    category: 'Yachts / Luxury Yachts',
    boats: { 'sea-land': 'SEA LAND' },
  },
  'yachts-luxury-yachts/bavaria-sport-35-pies-35-ft-8-personas-maximo-8-people-maximum': {
    size: '35 FT', capacity: '8 Personas Maximo',
    category: 'Yachts / Luxury Yachts',
    boats: { 'ambar-ii': 'AMBAR II' },
  },
  'yachts-luxury-yachts/pershing-56-pies-56-ft-14-personas-maximo-14-people-maximum': {
    size: '56 FT', capacity: '14 Personas Maximo',
    category: 'Yachts / Luxury Yachts',
    boats: { 'robert-sea': 'ROBERT SEA' },
  },
  'yachts-luxury-yachts/sea-ray-56-pies-56-ft-14-personas-maximo-14-people-maximum': {
    size: '56 FT', capacity: '14 Personas Maximo',
    category: 'Yachts / Luxury Yachts',
    boats: { 'corck-trick': 'CORCK TRICK' },
  },
  'yachts-luxury-yachts/sea-ray-58-pies-58-ft-14-personas-maximo-14-people-maximum': {
    size: '58 FT', capacity: '14 Personas Maximo',
    category: 'Yachts / Luxury Yachts',
    boats: { 'blue-land': 'BLUE LAND' },
  },
  'yachts-luxury-yachts/sea-ray-sundancer-46-pies-46-ft-14-personas-maximo-14-people-maximum': {
    size: '46 FT', capacity: '14 Personas Maximo',
    category: 'Yachts / Luxury Yachts',
    boats: { 'palladium': 'Palladium' },
  },
  'yachts-luxury-yachts/sunseeker-82-pies-82-ft-20-personas-maximo-20-people-maximum': {
    size: '82 FT', capacity: '20 Personas Maximo',
    category: 'Yachts / Luxury Yachts',
    boats: { 'marlet': 'MARLET' },
  },
};

// Construye el array de boats
const boats = [];
const boatsRoot = path.join(ROOT, 'private-boats-and-yachts');
for (const [folder, meta] of Object.entries(boatsMeta)) {
  for (const [slug, name] of Object.entries(meta.boats)) {
    const dir = path.join(boatsRoot, folder, slug);
    const files = sortMedia(listMedia(dir));
    if (files.length === 0) {
      console.warn(`⚠ Sin archivos: ${folder}/${slug}`);
      continue;
    }
    boats.push({
      name,
      size: meta.size,
      capacity: meta.capacity,
      category: meta.category,
      images: files.map(f => `private-boats-and-yachts/${folder}/${slug}/${f}`),
    });
  }
}

const boatsFile =
`// Generado automáticamente por generate-data.cjs.
// No editar a mano: editá generate-data.cjs y volvé a ejecutarlo.
const boats = ${JSON.stringify(boats, null, 4)};
`;
fs.writeFileSync(path.join(ROOT, 'boats.js'), boatsFile);
console.log(`✔ boats.js  → ${boats.length} embarcaciones`);

// =============================================================================
// TRANSFERS
// =============================================================================
const transfersMeta = {
  'duster-2025-1-2-people': {
    name: 'Renault Duster 2025',
    capacity: 'Up to 2 people',
    capacityEs: 'Hasta 2 personas',
    type: 'SUV',
    minPax: 1, maxPax: 2,
  },
  'hyundai-creta-2025-1-2-people': {
    name: 'Hyundai Creta 2025',
    capacity: 'Up to 2 people',
    capacityEs: 'Hasta 2 personas',
    type: 'SUV',
    minPax: 1, maxPax: 2,
  },
  'vito-black-2-6-people': {
    name: 'Mercedes-Benz Vito Black',
    capacity: '2 to 6 people',
    capacityEs: '2 a 6 personas',
    type: 'Premium Van',
    minPax: 2, maxPax: 6,
  },
  'traffic-3-8-people': {
    name: 'Renault Traffic',
    capacity: '3 to 8 people',
    capacityEs: '3 a 8 personas',
    type: 'Van',
    minPax: 3, maxPax: 8,
  },
  'master-citroen-8-12-people': {
    name: 'Master & Citroën',
    capacity: '8 to 12 people',
    capacityEs: '8 a 12 personas',
    type: 'Mini-bus',
    minPax: 8, maxPax: 12,
  },
  'sprinter-black-13-18-people': {
    name: 'Mercedes-Benz Sprinter (Black)',
    capacity: '13 to 18 people',
    capacityEs: '13 a 18 personas',
    type: 'Sprinter Van',
    minPax: 13, maxPax: 18,
  },
  'sprinter-white-13-18-people': {
    name: 'Mercedes-Benz Sprinter (White)',
    capacity: '13 to 18 people',
    capacityEs: '13 a 18 personas',
    type: 'Sprinter Van',
    minPax: 13, maxPax: 18,
  },
};

const transfers = [];
for (const [slug, meta] of Object.entries(transfersMeta)) {
  const dir = path.join(ROOT, 'transfers', slug);
  const files = sortMedia(listMedia(dir));
  if (files.length === 0) {
    console.warn(`⚠ Sin archivos: transfers/${slug}`);
    continue;
  }
  transfers.push({
    slug,
    name: meta.name,
    capacity: meta.capacity,
    capacityEs: meta.capacityEs,
    type: meta.type,
    minPax: meta.minPax,
    maxPax: meta.maxPax,
    images: files.map(f => `transfers/${slug}/${f}`),
  });
}

const transfersFile =
`// Generado automáticamente por generate-data.cjs.
const transfers = ${JSON.stringify(transfers, null, 4)};
`;
fs.writeFileSync(path.join(ROOT, 'transfers.js'), transfersFile);
console.log(`✔ transfers.js → ${transfers.length} vehículos`);

// =============================================================================
// DAY TRIPS / PASADIAS
// =============================================================================
const dayTripsDir = path.join(ROOT, 'day-trips');
const dayTripsFiles = sortMedia(listMedia(dayTripsDir));
const dayTripsItems = dayTripsFiles.map(f => ({
  src: `day-trips/${f}`,
  type: /\.(mp4|mov|webm)$/i.test(f) ? 'video' : 'image',
}));

const dayTripsFile =
`// Generado automáticamente por generate-data.cjs.
const dayTrips = ${JSON.stringify(dayTripsItems, null, 4)};
`;
fs.writeFileSync(path.join(ROOT, 'day-trips.js'), dayTripsFile);
console.log(`✔ day-trips.js → ${dayTripsItems.length} medios`);
