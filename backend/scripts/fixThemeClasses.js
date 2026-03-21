const fs = require('fs');
const path = require('path');

function replaceColorsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace bg colors
  content = content.replace(/bg-\[#161b22\]/g, 'dark:bg-[#161b22] bg-white');
  content = content.replace(/bg-\[#0d1117\]/g, 'dark:bg-[#0d1117] bg-gray-50');
  content = content.replace(/bg-\[#0a0c10\]/g, 'dark:bg-[#0a0c10] bg-gray-100');

  // Replace borders
  content = content.replace(/border-gray-800/g, 'dark:border-gray-800 border-gray-200');
  content = content.replace(/border-gray-700/g, 'dark:border-gray-700 border-gray-300');

  // Replace shadows based on context if possible, or just leave shadows as is 
  // (shadows look fine in light mode usually, except shadow-inner might need text-black/50)
  content = content.replace(/shadow-black\/50/g, 'dark:shadow-black/50 shadow-gray-200/50');

  // Replace explicit text colors
  content = content.replace(/text-white/g, 'dark:text-white text-gray-900');
  content = content.replace(/text-gray-400/g, 'dark:text-gray-400 text-gray-600');
  content = content.replace(/text-gray-300/g, 'dark:text-gray-300 text-gray-700');
  content = content.replace(/text-gray-500/g, 'dark:text-gray-500 text-gray-500');

  // Prevent doubling dark:dark:
  content = content.replace(/dark:dark:/g, 'dark:');
  content = content.replace(/bg-white bg-white/g, 'bg-white');
  content = content.replace(/bg-gray-50 bg-gray-50/g, 'bg-gray-50');
  content = content.replace(/text-gray-900 text-gray-900/g, 'text-gray-900');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated theme classes natively in:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceColorsInFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, '../../frontend/src/components'));
walkDir(path.join(__dirname, '../../frontend/src/pages'));

console.log('Theme fixes applied!');
