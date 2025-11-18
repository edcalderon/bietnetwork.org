const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../apps/docs/build');
const targetDir = path.join(__dirname, '../apps/web/docs/documentation');

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean target directory first
if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true, force: true });
}

// Copy documentation build
if (fs.existsSync(sourceDir)) {
  copyDirectory(sourceDir, targetDir);
  console.log('✅ Documentation copied to Next.js docs directory');
  console.log('📝 Development: http://localhost:3003/');
  console.log('🌐 Production: https://bietnetwork.org/documentation/');
} else {
  console.error('❌ Documentation build directory not found');
  process.exit(1);
}
