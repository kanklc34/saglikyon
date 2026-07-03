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
    process.stdout.write(JSON.stringify({ symptoms: rounded, departments: DEPARTMENTS }, null, 2));
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
        const departmentMatched = expectedDepartment && result.primaryDepartment
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
            symptomMatched,
            departmentMatched,
            passed: item.expectNoMatch
                ? !symptomMatched
                : expectedSymptom
                    ? Boolean(symptomMatched)
                    : true
        };
    });

    process.stdout.write(JSON.stringify(results, null, 2));
}

if (args.length === 0) {
    help();
    process.exit(0);
}

if (args[0] === '--dump-symptoms') {
    dumpSymptoms();
    process.exit(0);
}

if (args[0] === '--evaluate' && args[1]) {
    evaluate(args[1]);
    process.exit(0);
}

help();
process.exit(1);
