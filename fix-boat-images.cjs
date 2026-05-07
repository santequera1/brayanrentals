const fs = require('fs');
const path = require('path');

console.log('=== Reorganizando imágenes de yates ===\n');

// Función para normalizar nombres de carpetas del directorio duplicado
function normalizeFolderName(name) {
    return name
        .replace(/\s+/g, '-')
        .replace(/\(/g, '')
        .replace(/\)/g, '')
        .replace(/_$/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();
}

// Función para crear directorio si no existe
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✓ Creado directorio: ${dirPath}`);
    }
}

// Función para buscar y mover archivos
function findAndMoveImages(sourcePath, destPath, boatName) {
    // Normalizar la ruta de destino para buscar en el directorio duplicado
    const parts = sourcePath.split('/');

    // Convertir ruta de boats.js a la estructura del directorio duplicado
    // private-boats-and-yachts -> PRVATE BOATS AND YACHTS
    // speedboats-luxury-boats -> Speedboats - Luxury Boats
    // 29-pies-29-ft-10-personas-maximo-10-people-maximum -> 29 PIES - 29 FT ( 10 personas máximo - 10 people maximum)

    let duplicateBasePath = 'PRVATE BOATS AND YACHTS';

    // Buscar recursivamente el barco en el directorio duplicado
    if (!fs.existsSync(duplicateBasePath)) {
        console.log(`⚠ No existe el directorio duplicado: ${duplicateBasePath}`);
        return false;
    }

    // Buscar la carpeta del barco recursivamente
    let found = false;
    function searchBoat(dir) {
        if (found) return;

        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                if (found) break;

                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);

                if (stat.isDirectory()) {
                    // Normalizar el nombre y comparar
                    const normalizedItem = normalizeFolderName(item);
                    const normalizedBoat = normalizeFolderName(boatName);

                    if (normalizedItem === normalizedBoat ||
                        normalizedItem.includes(normalizedBoat) ||
                        normalizedBoat.includes(normalizedItem)) {
                        // Encontramos la carpeta del barco!
                        console.log(`✓ Encontrado: ${boatName} en ${itemPath}`);

                        // Crear el directorio de destino
                        const destDir = path.dirname(destPath);
                        ensureDir(destDir);

                        // Mover todas las imágenes
                        const images = fs.readdirSync(itemPath);
                        images.forEach(img => {
                            const srcImg = path.join(itemPath, img);
                            const destImg = path.join(destDir, img);

                            if (fs.statSync(srcImg).isFile()) {
                                try {
                                    fs.copyFileSync(srcImg, destImg);
                                    console.log(`  → Copiada: ${img}`);
                                } catch (err) {
                                    console.error(`  ✗ Error copiando ${img}:`, err.message);
                                }
                            }
                        });

                        found = true;
                        return;
                    }

                    // Buscar recursivamente
                    searchBoat(itemPath);
                }
            }
        } catch (err) {
            console.error(`Error leyendo directorio ${dir}:`, err.message);
        }
    }

    searchBoat(duplicateBasePath);
    return found;
}

// Leer y evaluar el archivo boats.js
const boatsContent = fs.readFileSync('./boats.js', 'utf8');
const boats = eval(boatsContent.replace('const boats = ', '') + '; boats');

let processedBoats = 0;
let movedBoats = 0;

boats.forEach((boat, index) => {
    console.log(`\n[${index + 1}/${boats.length}] Procesando: ${boat.name}`);

    if (boat.images && boat.images.length > 0) {
        const firstImage = boat.images[0];

        // Verificar si la imagen ya existe
        if (fs.existsSync(firstImage)) {
            console.log(`  ✓ Las imágenes ya existen en la ubicación correcta`);
            processedBoats++;
        } else {
            console.log(`  ⚠ Imágenes no encontradas, buscando en directorio duplicado...`);

            // Intentar encontrar y mover las imágenes
            if (findAndMoveImages(firstImage, firstImage, boat.name)) {
                movedBoats++;
                processedBoats++;
            } else {
                console.log(`  ✗ No se encontraron imágenes para ${boat.name}`);
            }
        }
    }
});

console.log('\n=== Resumen ===');
console.log(`Barcos procesados: ${processedBoats}/${boats.length}`);
console.log(`Barcos movidos: ${movedBoats}`);

if (movedBoats > 0) {
    console.log('\n⚠ NOTA: Las imágenes han sido copiadas. Verifica que todo esté correcto antes de eliminar el directorio duplicado.');
    console.log('Para eliminar el directorio duplicado, ejecuta:');
    console.log('  node delete-duplicate-folder.js');
}
