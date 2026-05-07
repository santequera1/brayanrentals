import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para normalizar rutas (igual que en rename-folders.js)
function normalizePath(oldPath) {
    return oldPath
        .split('/')
        .map(part => part
            .replace(/\s+/g, '-')
            .replace(/\(/g, '')
            .replace(/\)/g, '')
            .replace(/_$/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .toLowerCase()
        )
        .join('/');
}

console.log('=== Actualizando rutas en boats.js ===\n');

// Leer el archivo boats.js
const boatsPath = path.join(__dirname, 'boats.js');
let boatsContent = fs.readFileSync(boatsPath, 'utf8');

// Expresión regular para encontrar todas las rutas de imágenes
const imagePathRegex = /"(PRVATE BOATS AND YACHTS\/[^"]+)"/g;

let match;
let updatedCount = 0;
const replacements = new Map();

// Encontrar todas las rutas
while ((match = imagePathRegex.exec(boatsContent)) !== null) {
    const oldPath = match[1];
    const newPath = normalizePath(oldPath).replace('prvate-boats-and-yachts', 'private-boats-and-yachts');

    if (!replacements.has(oldPath)) {
        replacements.set(oldPath, newPath);
    }
}

// Realizar los reemplazos
replacements.forEach((newPath, oldPath) => {
    const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    boatsContent = boatsContent.replace(regex, newPath);
    updatedCount++;
    console.log(`✓ ${oldPath}\n  -> ${newPath}\n`);
});

// Guardar el archivo actualizado
fs.writeFileSync(boatsPath, boatsContent, 'utf8');

console.log(`=== Actualización completada ===`);
console.log(`Total de rutas actualizadas: ${updatedCount}`);
console.log(`\nAhora puedes subir los archivos al servidor.`);
