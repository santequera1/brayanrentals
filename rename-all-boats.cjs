const fs = require('fs');
const path = require('path');

// Directorio base
const baseDir = './PRVATE BOATS AND YACHTS';

// Mapeo de nombres problemáticos a nombres sin tildes
const renames = [
    {
        old: 'Speedboats - Luxury Boats/29 PIES - 29 FT ( 10 personas máximo - 10 people maximum)/poseidón',
        new: 'Speedboats - Luxury Boats/29 PIES - 29 FT ( 10 personas máximo - 10 people maximum)/poseidon'
    }
];

console.log('Iniciando renombrado de directorios...\n');

renames.forEach(rename => {
    const oldPath = path.join(baseDir, rename.old);
    const newPath = path.join(baseDir, rename.new);

    try {
        if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
            console.log(`✓ Renombrado: ${path.basename(rename.old)} → ${path.basename(rename.new)}`);
        } else {
            console.log(`✗ No encontrado: ${oldPath}`);
        }
    } catch (error) {
        console.error(`✗ Error renombrando ${rename.old}:`, error.message);
    }
});

console.log('\n¡Proceso completado!');
