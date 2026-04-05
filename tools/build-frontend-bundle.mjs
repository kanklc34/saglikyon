import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const frontendDir = path.join(repoRoot, 'frontend');
const distDir = path.join(repoRoot, 'dist');

const sources = [
  'frontend/engine/symptom-db.js',
  'frontend/engine/nlp.js',
  'frontend/engine/analyzer.js',
  'frontend/engine/rate-limit.js',
  'frontend/script.js'
];

const staticFiles = [
  'index.html',
  'style.css',
  'manifest.json',
  '_headers'
];

function transformModuleSource(source) {
  return source
    .replace(/^\s*import\s+[^;]+;\s*$/gm, '')
    .replace(/^\s*export\s+\{[^}]+\};\s*$/gm, '')
    .replace(/\bexport\s+(const|function|class)\b/g, '$1')
    .trim();
}

const parts = sources.map((relativePath) => {
  const absolutePath = path.join(repoRoot, relativePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const transformed = transformModuleSource(source);

  return `// ---- ${relativePath} ----\n${transformed}`;
});

const bundle = `(() => {\n${parts.join('\n\n')}\n})();\n`;

fs.writeFileSync(path.join(frontendDir, 'app.bundle.js'), bundle, 'utf8');

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

for (const fileName of staticFiles) {
  fs.copyFileSync(path.join(frontendDir, fileName), path.join(distDir, fileName));
}

fs.writeFileSync(path.join(distDir, 'app.bundle.js'), bundle, 'utf8');
console.log('frontend/app.bundle.js and dist/app.bundle.js generated successfully.');
