#!/usr/bin/env python3
# ============================================
# SağlıkYön - Anahtar Kelime Birleştirme (Python) - Gelişmiş Sürüm
# ============================================

import json
import os
import re
import shutil
import sys
import argparse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# 🛠️ DOSYA YOLU AYARI (İlk betikle tamamen senkronize edildi)
DB_PATH = (
    r"C:\Users\KAAN\OneDrive\Desktop\Projeler\saglikyön\frontend\engine\symptom-db.js"
)
INPUT_PATH = os.path.join(SCRIPT_DIR, "keyword_expansion_output.json")


def norm_tr(s):
    s = s.strip()
    table = str.maketrans("İIĞÜŞÖÇ", "iığüşöç")
    return s.translate(table).lower()


def find_array_bounds(content, start_marker):
    try:
        start = content.index(start_marker)
    except ValueError:
        print(f"HATA: Dosya içinde '{start_marker}' ifadesi bulunamadı.")
        sys.exit(1)

    depth = 0
    i = start + len(start_marker) - 1
    end = -1
    while i < len(content):
        if content[i] == "[":
            depth += 1
        elif content[i] == "]":
            depth -= 1
            if depth == 0:
                end = i
                break
        i += 1
    return start, end


def split_objects(array_text):
    objects = []
    depth = 0
    obj_start = None
    for idx, ch in enumerate(array_text):
        if ch == "{":
            if depth == 0:
                obj_start = idx
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and obj_start is not None:
                objects.append((obj_start, idx + 1, array_text[obj_start : idx + 1]))
                obj_start = None
    return objects


def parse_string_list(block_text):
    if not block_text:
        return []
    return [
        k.replace("\\'", "'") for k in re.findall(r"'((?:[^'\\]|\\.)*)'", block_text)
    ]


def js_str(s):
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"


def update_keyword_block(obj_text, field_name, new_keywords):
    """
    Nesne metni içerisindeki ilgili keyword bloğunu diğer alanlara dokunmadan günceller.
    """
    # İlgili alanı bulmak için esnek regex 패턴i
    pattern = rf"({field_name}\s*:\s*\[)(.*?)(\]\s*,)"

    def replacer(match):
        prefix = match.group(1)
        suffix = match.group(3)

        # Yeni listeyi JS formatına uygun şekilde dizme
        formatted_kws = ",\n".join(f"      {js_str(k)}" for k in new_keywords)
        if formatted_kws:
            return f"{prefix}\n{formatted_kws},\n    {suffix.lstrip()}"
        return f"{prefix}{suffix}"

    return re.sub(pattern, replacer, obj_text, flags=re.S)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not os.path.exists(INPUT_PATH):
        print(f"Bulunamadı: {INPUT_PATH}")
        print("Önce gemini_keyword_expander.py çalıştırılmalı.")
        sys.exit(1)

    if not os.path.exists(DB_PATH):
        print(f"HATA: Semptom veri tabanı dosyası bulunamadı!\nAranan Konum: {DB_PATH}")
        sys.exit(1)

    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        expansions = json.load(f)

    with open(DB_PATH, "r", encoding="utf-8") as f:
        original = f.read()

    start_marker = "export const SYMPTOM_DATABASE = ["
    start, end = find_array_bounds(original, start_marker)

    # Veri tabanı dizisinin içindeki ham metin
    array_text = original[start + len(start_marker) - 1 : end + 1]

    # Nesneleri konum bilgileriyle birlikte ayırıyoruz
    objects_with_positions = split_objects(array_text)

    updated_objects = []
    total_added_tr, total_added_en = 0, 0
    report = []

    for obj_start, obj_end, obj_text in objects_with_positions:
        sid_m = re.search(r"id:\s*'([^']*)'", obj_text)
        if not sid_m:
            updated_objects.append(obj_text)
            continue

        sid = sid_m.group(1)
        exp = expansions.get(sid)

        if not exp:
            updated_objects.append(obj_text)
            continue

        # Mevcut kelimeleri ayıklama
        kw_m = re.search(r"keywords:\s*\[(.*?)\]\s*,", obj_text, re.S)
        kwen_m = re.search(r"keywords_en:\s*\[(.*?)\]\s*,", obj_text, re.S)

        current_tr = parse_string_list(kw_m.group(1) if kw_m else "")
        current_en = parse_string_list(kwen_m.group(1) if kwen_m else "")

        # Türkçe Normalizasyon ve Tekilleştirme
        existing_tr_norm = {norm_tr(k) for k in current_tr}
        seen_tr = set()
        new_tr = []
        for k in exp.get("tr", []):
            if not k:
                continue
            n = norm_tr(k)
            if n in existing_tr_norm or n in seen_tr:
                continue
            seen_tr.add(n)
            new_tr.append(k)

        # İngilizce Normalizasyon ve Tekilleştirme
        existing_en_norm = {k.strip().lower() for k in current_en}
        seen_en = set()
        new_en = []
        for k in exp.get("en", []):
            if not k:
                continue
            n = k.strip().lower()
            if n in existing_en_norm or n in seen_en:
                continue
            seen_en.add(n)
            new_en.append(k)

        # Eğer yeni kelime varsa nesne metnini in-place güncelliyoruz
        modified_obj_text = obj_text
        if new_tr:
            current_tr.extend(new_tr)
            modified_obj_text = update_keyword_block(
                modified_obj_text, "keywords", current_tr
            )
            total_added_tr += len(new_tr)

        if new_en:
            current_en.extend(new_en)
            modified_obj_text = update_keyword_block(
                modified_obj_text, "keywords_en", current_en
            )
            total_added_en += len(new_en)

        if new_tr or new_en:
            report.append((sid, len(new_tr), len(new_en)))

        updated_objects.append(modified_obj_text)

    # Raporlama Bölümü
    print("── Rapor ──")
    for sid, n_tr, n_en in report:
        print(f"  {sid}: +{n_tr} tr, +{n_en} en")
    print(
        f"\nToplam: +{total_added_tr} Türkçe, +{total_added_en} İngilizce ifade ({len(report)} semptom etkilendi)"
    )

    if args.dry_run:
        print("\n--dry-run modundaydı, dosya KAYDEDİLMEDİ.")
        return

    # Güvenli Yedekleme
    backup_path = DB_PATH + ".bak"
    shutil.copyfile(DB_PATH, backup_path)
    print(f"Yedek alındı: {backup_path}")

    # 🛠️ DÜZELTME: Karakter yutmayı önlemek için dizi birleştirme mantığı düzeltildi (end + 1)
    new_array_content = ",\n".join(updated_objects)
    new_content = (
        original[:start]
        + "export const SYMPTOM_DATABASE = [\n"
        + new_array_content
        + "\n]"
        + original[end + 1 :]
    )

    with open(DB_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"\nGüncellendi: {DB_PATH}")


if __name__ == "__main__":
    main()
