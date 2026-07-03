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
  'frontend/engine/keyword-index.js',
  'frontend/engine/analyzer.js',
  'frontend/engine/rate-limit.js',
  'frontend/engine/i18n.js',
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

// script.js içinde STATİK değil DİNAMİK import() kullanılan dosyalar var
// (örn. import('./engine/body-map.js') — vücut haritası, ilk yüklemede
// değil tıklandığında yükleniyor). transformModuleSource() sadece
// üst-seviye 'import ... from ...;' İFADELERİNİ siliyor/bundluyor;
// import(...) bir FONKSİYON ÇAĞRISI olduğu için bundle'a hiç dahil
// edilmiyor ve tarayıcı bunu çalışma anında GERÇEK bir dosya olarak
// (sayfanın URL'sine göre) çekmeye çalışıyor. dist/ klasöründe
// 'engine/' alt klasörü hiç yoktu — bu da vücut haritasına tıklanınca
// ayrı bir 404'e yol açıyordu. Bu dosyaları (ve onların kendi ES modül
// import'larını) gerçek dosyalar olarak dist/engine/ altına kopyalıyoruz.
const dynamicallyImportedEngineFiles = [
  'body-map.js', // script.js içinde import('./engine/body-map.js') ile çağrılıyor
  'i18n.js',      // body-map.js kendi içinde bunu gerçek bir import ile çekiyor
];
fs.mkdirSync(path.join(distDir, 'engine'), { recursive: true });
for (const fileName of dynamicallyImportedEngineFiles) {
  fs.copyFileSync(
    path.join(frontendDir, 'engine', fileName),
    path.join(distDir, 'engine', fileName)
  );
}

// index.html, yerel geliştirme için (ES modülleriyle) 'script.js'i
// çağırıyor. Ama dist'e sadece derlenmiş 'app.bundle.js' konuyor,
// 'script.js' KOPYALANMIYOR — bu yüzden GitHub Pages'te index.html
// var olmayan bir dosyayı çağırıp 404 alıyordu. dist'teki kopyada
// bu referansı bundle dosyasına çeviriyoruz.
const distIndexPath = path.join(distDir, 'index.html');
const distIndexHtml = fs.readFileSync(distIndexPath, 'utf8')
  .replace('<script type="module" src="script.js"></script>', '<script type="module" src="app.bundle.js"></script>');
fs.writeFileSync(distIndexPath, distIndexHtml, 'utf8');

fs.writeFileSync(path.join(distDir, 'app.bundle.js'), bundle, 'utf8');
console.log('frontend/app.bundle.js and dist/app.bundle.js generated successfully.');
