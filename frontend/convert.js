const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // We are converting to a clean Light SaaS.
    // Replace custom glassmorphism classes
    content = content.replace(/glass-card-subtle/g, 'bg-gray-50 border border-gray-200 rounded-lg');
    content = content.replace(/glass-card/g, 'bg-white border border-gray-200 shadow-sm rounded-xl');
    content = content.replace(/bg-glass-bg/g, 'bg-white');
    content = content.replace(/border-glass-border/g, 'border-gray-200');
    content = content.replace(/bg-dark/g, 'bg-gray-50');
    content = content.replace(/bg-dark-glass/g, 'bg-white');

    // Text colors
    content = content.replace(/text-white/g, 'text-gray-900');
    content = content.replace(/text-gray-light/g, 'text-gray-500');
    content = content.replace(/text-gray/g, 'text-gray-400');

    // Fix badges to ensure they stay white text
    content = content.replace(/bg-danger text-gray-900/g, 'bg-danger text-white');
    content = content.replace(/bg-success text-gray-900/g, 'bg-success text-white');
    content = content.replace(/bg-primary text-gray-900/g, 'bg-primary text-white');
    content = content.replace(/bg-gray-900 text-gray-900/g, 'bg-gray-900 text-white'); // footer

    fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

walk(srcDir);
console.log('Conversion applied to JSX.');
