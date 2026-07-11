import argparse
import json
import os
import random
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None
    types = None

ROOT = Path(__file__).resolve().parent.parent
EVALUATOR_SCRIPT = ROOT / "tools" / "nlp_evaluator.mjs"
SYMPTOM_COUNT_LIMIT = 16

PROMPT_TEMPLATE = """You are a Turkish medical language expert creating evaluation examples for a symptom analyzer.

Symptom label: {label}
Symptom id: {symptom_id}
Primary department: {department}
Common Turkish symptom keywords: {keywords}

Produce exactly {positive_count} natural Turkish patient complaint sentences that clearly describe the symptom without copying the provided keywords verbatim.
Also produce exactly {negation_count} Turkish sentences in which the patient explicitly says they do NOT have that symptom.

Return ONLY valid JSON in this exact format:
{{
  "positive_examples": ["..."] ,
  "negation_examples": ["..."]
}}
"""

JSON_EXTRACTOR = re.compile(
    r'\{\s*"positive_examples"\s*:\s*\[.*?\]\s*,\s*"negation_examples"\s*:\s*\[.*?\]\s*\}',
    re.S,
)


def exit_with_message(message: str, code: int = 1):
    print(message, file=sys.stderr)
    sys.exit(code)


def ensure_node_available():
    if shutil.which("node") is None:
        exit_with_message(
            "Error: Node.js is required to run the evaluator. Install Node.js and try again."
        )


def ensure_gemini_available():
    if genai is None or types is None:
        exit_with_message(
            "Error: google-genai is required. Install it with: pip install google-genai"
        )


def run_node(args):
    ensure_node_available()
    cmd = ["node", str(EVALUATOR_SCRIPT)] + args
    result = subprocess.run(
        cmd, capture_output=True, text=True, encoding="utf-8", errors="replace"
    )
    if result.returncode != 0:
        exit_with_message(f"Node evaluator failed:\n{result.stderr.strip()}")
    if result.stdout is None:
        exit_with_message("Node evaluator produced no output.")
    return result.stdout


def dump_symptom_metadata():
    raw = run_node(["--dump-symptoms"])
    return json.loads(raw)


def parse_json_from_text(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = JSON_EXTRACTOR.search(text)
        if not match:
            raise
        return json.loads(match.group(0))


class GeminiPromptGenerator:
    def __init__(self, api_key: str, model: str = "gemini-3.1-flash-lite"):
        ensure_gemini_available()
        self.client = genai.Client(api_key=api_key)
        self.model = model

    def generate_case_set(self, symptom, positive_count: int, negation_count: int):
        prompt = PROMPT_TEMPLATE.format(
            label=symptom["id"],
            symptom_id=symptom["id"],
            department=symptom["primaryDepartment"] or "unknown",
            keywords=", ".join(symptom["keywords"][:8]),
            positive_count=positive_count,
            negation_count=negation_count,
        )

        for attempt in range(1, 4):
            try:
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.22,
                    ),
                )
                raw = response.text.strip()
                return parse_json_from_text(raw)
            except Exception as exc:
                message = str(exc)
                print(
                    f"Warning: Gemini generation attempt {attempt} failed: {message}",
                    file=sys.stderr,
                )
                if attempt < 3:
                    time.sleep(3 * attempt)
                    continue
                exit_with_message("Fatal: Gemini generation failed after 3 attempts.")


def build_dataset(
    symptoms, positive_count: int, negation_count: int, seed: int | None = None
):
    if seed is not None:
        random.seed(seed)

    generated = []
    generator = GeminiPromptGenerator(api_key=ARGS.api_key)

    print(
        f"Generating {len(symptoms)} symptom groups with {positive_count} positive and {negation_count} negation examples each."
    )
    for index, symptom in enumerate(symptoms, start=1):
        print(
            f'[{index}/{len(symptoms)}] Generating examples for {symptom["id"]} ({symptom["primaryDepartment"]})...'
        )
        payload = generator.generate_case_set(symptom, positive_count, negation_count)

        positive_examples = payload.get("positive_examples") or []
        negation_examples = payload.get("negation_examples") or []

        if (
            len(positive_examples) < positive_count
            or len(negation_examples) < negation_count
        ):
            exit_with_message(
                f'Gemini output did not include expected arrays for symptom {symptom["id"]}. Output: {payload}'
            )

        for text in positive_examples[:positive_count]:
            generated.append(
                {
                    "symptomId": symptom["id"],
                    "symptomLabel": symptom["id"],
                    "expectedDepartment": symptom["primaryDepartment"],
                    "mode": "positive",
                    "expectNoMatch": False,
                    "text": text.strip(),
                    "lang": "tr",
                }
            )

        for text in negation_examples[:negation_count]:
            generated.append(
                {
                    "symptomId": symptom["id"],
                    "symptomLabel": symptom["id"],
                    "expectedDepartment": symptom["primaryDepartment"],
                    "mode": "negation",
                    "expectNoMatch": True,
                    "text": text.strip(),
                    "lang": "tr",
                }
            )

    return generated


def evaluate_dataset(dataset_path: Path):
    raw = run_node(["--evaluate", str(dataset_path)])
    return json.loads(raw)


def summarize_results(results):
    summary = {
        "total": len(results),
        "positive": 0,
        "positive_passed": 0,
        "negation": 0,
        "negation_passed": 0,
        # BUG DÜZELTMESİ: department_correct/total artık SADECE result
        # kategorisi 'resolved' (yani primaryDepartment alanı gerçekten
        # var) olan vakalarda sayılıyor. Önceden emergency/needsMoreInfo
        # gibi bu alanın yapısal olarak bulunmadığı durumlar da "yanlış"
        # sayılıp payda şişiriliyordu.
        "department_correct": 0,
        "department_total": 0,
        "category_counts": {},
        # Emergency/needsMoreInfo vakalarında department ölçülemez ama
        # doğru semptomu bulup bulmadığını (symptomMatched) hâlâ ayrı
        # ayrı takip ediyoruz — bu, "en azından doğru şeyi tetikledi mi"
        # sorusuna cevap verir.
        "emergency_symptom_correct": 0,
        "emergency_total": 0,
        "needs_more_info_symptom_correct": 0,
        "needs_more_info_total": 0,
        "symptom_mismatch_cases": [],
        "department_mismatch_cases": [],
    }

    for item in results:
        category = item.get("resultCategory", "unknown")
        summary["category_counts"][category] = (
            summary["category_counts"].get(category, 0) + 1
        )

        if item["mode"] == "positive":
            summary["positive"] += 1
            summary["positive_passed"] += int(item["passed"])

            if category == "resolved":
                summary["department_total"] += 1
                if item.get("departmentMatched"):
                    summary["department_correct"] += 1
                else:
                    summary["department_mismatch_cases"].append(item)
            elif category == "emergency":
                summary["emergency_total"] += 1
                if item.get("symptomMatched"):
                    summary["emergency_symptom_correct"] += 1
            elif category == "needsMoreInfo":
                summary["needs_more_info_total"] += 1
                if item.get("symptomMatched"):
                    summary["needs_more_info_symptom_correct"] += 1

            if not item["passed"]:
                summary["symptom_mismatch_cases"].append(item)
        else:
            summary["negation"] += 1
            summary["negation_passed"] += int(item["passed"])
            if not item["passed"]:
                summary["symptom_mismatch_cases"].append(item)

    summary["positive_accuracy"] = (
        round(summary["positive_passed"] / summary["positive"] * 100, 1)
        if summary["positive"]
        else None
    )
    summary["negation_accuracy"] = (
        round(summary["negation_passed"] / summary["negation"] * 100, 1)
        if summary["negation"]
        else None
    )
    # SADECE 'resolved' vakalar üzerinden — artık yapısal olarak
    # uygulanamayan vakalarla şişirilmiş bir payda yok.
    summary["department_accuracy"] = (
        round(summary["department_correct"] / summary["department_total"] * 100, 1)
        if summary["department_total"]
        else None
    )
    summary["emergency_symptom_accuracy"] = (
        round(
            summary["emergency_symptom_correct"] / summary["emergency_total"] * 100, 1
        )
        if summary["emergency_total"]
        else None
    )
    summary["needs_more_info_symptom_accuracy"] = (
        round(
            summary["needs_more_info_symptom_correct"]
            / summary["needs_more_info_total"]
            * 100,
            1,
        )
        if summary["needs_more_info_total"]
        else None
    )
    return summary


def select_symptoms(metadata, limit: int, seed: int | None = None):
    symptoms = metadata["symptoms"]
    if seed is not None:
        random.shuffle(symptoms)
    # Prefer symptoms with a strong primary department and highest urgency
    symptoms = sorted(
        symptoms, key=lambda s: (-s["urgency"], -len(s["keywords"]), s["id"])
    )
    return symptoms[:limit]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="NLP accuracy dataset generator and evaluator for SağlıkYön."
    )
    parser.add_argument(
        "--api-key",
        default=os.environ.get("GEMINI_API_KEY"),
        help="Gemini API key or set GEMINI_API_KEY.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=SYMPTOM_COUNT_LIMIT,
        help="How many symptoms to generate examples for.",
    )
    parser.add_argument(
        "--examples", type=int, default=3, help="Positive example count per symptom."
    )
    parser.add_argument(
        "--negations", type=int, default=1, help="Negation example count per symptom."
    )
    parser.add_argument(
        "--output",
        default="tools/nlp_test_dataset.json",
        help="Path to save generated dataset.",
    )
    parser.add_argument(
        "--report",
        default="tools/nlp_accuracy_report.json",
        help="Path to save evaluation report.",
    )
    parser.add_argument(
        "--seed", type=int, default=42, help="Random seed for symptom selection."
    )
    parser.add_argument(
        "--just-evaluate",
        action="store_true",
        help="Skip generation and evaluate an existing dataset at --output.",
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Only generate dataset, do not evaluate."
    )
    ARGS = parser.parse_args()

    if not ARGS.just_evaluate and not ARGS.api_key:
        exit_with_message(
            "Error: Gemini API key is required. Provide --api-key or set GEMINI_API_KEY."
        )

    ensure_node_available()
    if not ARGS.just_evaluate:
        metadata = dump_symptom_metadata()
        symptom_candidates = select_symptoms(metadata, ARGS.limit, ARGS.seed)
        dataset = build_dataset(
            symptom_candidates, ARGS.examples, ARGS.negations, ARGS.seed
        )
        output_path = Path(ARGS.output)
        output_path.write_text(
            json.dumps(
                {
                    "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "generator": "gemini-3.1-flash-lite",
                    "symptomCount": len(symptom_candidates),
                    "totalExamples": len(dataset),
                    "examples": dataset,
                },
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )
        print(f"Generated dataset: {output_path} ({len(dataset)} examples)")

        if ARGS.dry_run:
            print("Dry run complete; evaluation skipped.")
            sys.exit(0)
    else:
        dataset = json.loads(Path(ARGS.output).read_text(encoding="utf-8"))["examples"]
        print(f"Loaded existing dataset: {ARGS.output} ({len(dataset)} examples)")

    print("Evaluating analyzer against dataset...")
    results = evaluate_dataset(Path(ARGS.output))
    report = summarize_results(results)
    report["generatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    report["resultsCount"] = len(results)
    report["failureSamples"] = [
        {
            "index": item["index"],
            "text": item["text"],
            "mode": item["mode"],
            "symptomId": item["symptomId"],
            "matchedIds": item["matchedIds"],
            "primaryDepartment": item["result"].get("primaryDepartment"),
            "departmentMatched": item.get("departmentMatched"),
            "symptomMatched": item.get("symptomMatched"),
        }
        for item in results
        if not item["passed"]
    ][:20]

    Path(ARGS.report).write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Accuracy report written to: {ARGS.report}")
    print(
        f"Summary: positive={report['positive_accuracy']}% negation={report['negation_accuracy']}% "
        f"department={report['department_accuracy']}% (n={report['department_total']}) "
        f"| emergency_symptom={report['emergency_symptom_accuracy']}% (n={report['emergency_total']}) "
        f"| needs_more_info_symptom={report['needs_more_info_symptom_accuracy']}% (n={report['needs_more_info_total']}) "
        f"| categories={report['category_counts']}"
    )
