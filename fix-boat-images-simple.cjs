const fs = require('fs');
const path = require('path');

console.log('=== Reorganizando imágenes de yates ===\n');

const duplicateBase = 'PRVATE BOATS AND YACHTS';
const correctBase = 'private-boats-and-yachts';

// Función para normalizar nombres
function normalize(name) {
    return name
        .replace(/\s+/g, '-')
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u')
        .replace(/ñ/g, 'n')
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
        console.log(`✓ Creado: ${dirPath}`);
    }
}

// Función recursiva para copiar carpetas
function copyFolder(source, dest) {
    ensureDir(dest);

    const items = fs.readdirSync(source);

    items.forEach(item => {
        const srcPath = path.join(source, item);
        const destPath = path.join(dest, item);

        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            // Normalizar nombre de carpeta para el destino
            const normalizedDest = path.join(path.dirname(destPath), normalize(item));
            copyFolder(srcPath, normalizedDest);
        } else if (stat.isFile()) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`  → ${item}`);
        }
    });
}

// Verificar que existe el directorio duplicado
if (!fs.existsSync(duplicateBase)) {
    console.log(`⚠ No se encontró el directorio duplicado: ${duplicateBase}`);
    console.log('Las imágenes podrían ya estar en el directorio correcto.');
    process.exit(0);
}

// Procesar las carpetas principales
const mainFolders = fs.readdirSync(duplicateBase);

mainFolders.forEach(folder => {
    const srcFolder = path.join(duplicateBase, folder);

    if (!fs.statSync(srcFolder).isDirectory()) return;

    // Normalizar nombre (Speedboats - Luxury Boats -> speedboats-luxury-boats)
    const normalizedMain = normalize(folder);
    const destFolder = path.join(correctBase, normalizedMain);

    console.log(`\nProcesando: ${folder} -> ${normalizedMain}`);

    copyFolder(srcFolder, destFolder);
});

console.log('\n=== Proceso completado ===');
console.log('✓ Las imágenes han sido copiadas al directorio correcto.');
console.log('\nAhora verifica que todo funcione correctamente.');
console.log('Si todo está bien, puedes eliminar el directorio duplicado ejecutando:');
console.log('  node delete-duplicate.cjs');
