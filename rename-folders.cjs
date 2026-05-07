const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'PRVATE BOATS AND YACHTS');

function sanitizeDirName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()_]/g, '');
}

function renameDirectories(dir) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const oldPath = path.join(dir, item);
    if (fs.statSync(oldPath).isDirectory()) {
      const newName = sanitizeDirName(item);
      const newPath = path.join(dir, newName);
      if (oldPath !== newPath) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${oldPath} -> ${newPath}`);
        renameDirectories(newPath); // Recurse into the newly named directory
      } else {
        renameDirectories(oldPath); // Recurse into the directory without renaming
      }
    }
  });
}

try {
  console.log('Starting directory renaming process...');
  renameDirectories(baseDir);
  // Finally, rename the base directory itself
  const newBaseDirName = sanitizeDirName(path.basename(baseDir));
  const newBaseDir = path.join(__dirname, newBaseDirName);
  fs.renameSync(baseDir, newBaseDir);
  console.log(`Renamed: ${baseDir} -> ${newBaseDir}`);
  console.log('Directory renaming process completed successfully.');
} catch (error) {
  console.error('Error during directory renaming:', error);
}