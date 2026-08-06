import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeSymptoms, DEPARTMENTS, SYMPTOM_DATABASE } from '../frontend/engine/analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = process.argv.slice(2);

function help() {
    console.log(`Usage:
  node tools/nlp_evaluator.mjs --dump-symptoms
  node tools/nlp_evaluator.mjs --evaluate input.json > results.json

Options:
  --dump-symptoms      Print symptom metadata as JSON.
  --evaluate <path>    Read test cases from JSON and print evaluation results.
`);
}

function getPrimaryDepartment(departments) {
    const entries = Object.entries(departments);
    if (entries.length === 0) return null;
    return entries.sort((a, b) => b[1] - a[1])[0][0];
}

// BUG DÜZELTMESİ: departmentMatched daha önce emergency/needsMoreInfo gibi
// primaryDepartment alanı YAPISAL OLARAK bulunmayan yanıt şekillerinde de
// "yanlış" sayılıyordu (null ile false aynı kefeye konuyordu), bu da
// department_accuracy'yi yapay şekilde çok düşük gösteriyordu. Şimdi her
// sonucun hangi KATEGORİYE düştüğünü açıkça etiketliyoruz; department
// doğruluğu SADECE 'resolved' kategorisinde ölçülür, diğerleri ayrı
// kovalarda raporlanır (bkz. nlp_accuracy_test.py summarize_results).
function categorizeResult(result) {
    if (result.error) return 'error';
    if (result.isEmergency) return 'emergency';
    if (result.needsMoreInfo) return 'needsMoreInfo';
    if (result.noMatch) return 'noMatch';
    if (result.primaryDepartment) return 'resolved';
    return 'unknown';
}

function dumpSymptoms() {
    const rounded = SYMPTOM_DATABASE.map(symptom => ({
        id: symptom.id,
        region: symptom.region,
        urgency: symptom.urgency,
        followUp: Boolean(symptom.followUp),
        departments: symptom.departments,
        primaryDepartment: getPrimaryDepartment(symptom.departments),
        keywords: symptom.keywords || [],
        keywords_en: symptom.keywords_en || []
    }));
    return JSON.stringify({ symptoms: rounded, departments: DEPARTMENTS }, null, 2);
}

function evaluate(inputPath) {
    const raw = fs.readFileSync(inputPath, 'utf8');
    const parsed = JSON.parse(raw);
    const cases = Array.isArray(parsed) ? parsed : parsed?.examples;

    if (!Array.isArray(cases)) {
        console.error('Input file must contain either a JSON array or an object with an examples array.');
        process.exit(1);
    }

    const results = cases.map((item, index) => {
        const text = String(item.text || '');
        const lang = item.lang || 'tr';
        const expectedSymptom = item.symptomId || null;
        const expectedDepartment = item.expectedDepartment || null;
        const result = analyzeSymptoms(text, null, lang, []);

        let matchedIds = [];
        if (Array.isArray(result.matchedSymptoms)) {
            matchedIds = result.matchedSymptoms.map(sym => {
                if (typeof sym === 'string') return sym;
                if (sym && typeof sym === 'object') return sym.id;
                return null;
            }).filter(Boolean);
        }

        const symptomMatched = expectedSymptom ? matchedIds.includes(expectedSymptom) : null;
        const resultCategory = categorizeResult(result);
        const departmentMatched = resultCategory === 'resolved' && expectedDepartment
            ? result.primaryDepartment === expectedDepartment
            : null;

        return {
            index,
            symptomId: expectedSymptom,
            expectedDepartment,
            mode: item.mode || 'positive',
            text,
            lang,
            result,
            matchedIds,
            resultCategory,
            symptomMatched,
            departmentMatched,
            passed: item.expectNoMatch
                ? !symptomMatched
                : expectedSymptom
                    ? Boolean(symptomMatched)
                    : true
        };
    });

    return JSON.stringify(results, null, 2);
}

if (args.length === 0) {
    help();
    process.exit(0);
}

// BUG DÜZELTMESİ: process.stdout.write() büyük veride, çıktı bir PİPE'a
// bağlıyken (Python subprocess.run(capture_output=True) gibi — dosyaya
// yönlendirmede sorun yok çünkü o senkron) ASENKRON tamamlanır. Hemen
// ardından process.exit() çağırmak, yazma bitmeden süreci sonlandırıp
// çıktıyı sessizce kesebiliyordu (gözlemlenen: tam 131072 bayt/128KB'ta
// kesiliyordu — pipe buffer sınırı). Düzeltme: exit'i write'ın callback'ine
// bağlayıp yazmanın gerçekten bittiğinden emin olmak.
function writeAndExit(text, code = 0) {
    process.stdout.write(text, () => process.exit(code));
}

if (args[0] === '--dump-symptoms') {
    writeAndExit(dumpSymptoms());
} else if (args[0] === '--evaluate' && args[1]) {
    writeAndExit(evaluate(args[1]));
} else {
    help();
    process.exit(1);
}
