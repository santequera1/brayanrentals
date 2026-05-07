const fs = require('fs');
const path = require('path');

const oldBaseDir = path.join(__dirname, 'PRVATE BOATS AND YACHTS');
const newBaseDir = path.join(__dirname, 'private-boats-and-yachts');

function sanitizeDirName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()_]/g, '');
}

function copyAndRename(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);
  items.forEach(item => {
    const oldPath = path.join(src, item);
    const newName = sanitizeDirName(item);
    const newPath = path.join(dest, newName);

    if (fs.statSync(oldPath).isDirectory()) {
      copyAndRename(oldPath, newPath);
    } else {
      fs.copyFileSync(oldPath, newPath);
    }
  });
}

try {
  console.log('Starting file copy and rename process...');
  copyAndRename(oldBaseDir, newBaseDir);
  console.log('File copy and rename process completed successfully.');
} catch (error) {
  console.error('Error during file copy and rename:', error);
}
