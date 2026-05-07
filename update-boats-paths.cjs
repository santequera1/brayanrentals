const fs = require('fs');

// Leer el archivo boats.js
let boatsContent = fs.readFileSync('./boats.js', 'utf8');

// Reemplazos necesarios para corregir rutas
const replacements = [
    // Poseidón -> poseidon
    { old: 'poseidón', new: 'poseidon' },
    { old: 'poseid%C3%B3n', new: 'poseidon' },

    // María Tere -> maria-tere
    { old: 'maría%2Dtere', new: 'maria-tere' },
    { old: 'maría-tere', new: 'maria-tere' }
];

console.log('Actualizando rutas en boats.js...\n');

replacements.forEach(repl => {
    const regex = new RegExp(repl.old, 'g');
    const matches = boatsContent.match(regex);
    if (matches) {
        console.log(`✓ Reemplazando "${repl.old}" → "${repl.new}" (${matches.length} ocurrencias)`);
        boatsContent = boatsContent.replace(regex, repl.new);
    }
});

// Guardar el archivo actualizado
fs.writeFileSync('./boats.js', boatsContent, 'utf8');

console.log('\n¡Actualización completada!');
console.log('Archivo boats.js ha sido actualizado.');
