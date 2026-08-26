import json
import re
from difflib import SequenceMatcher
from pathlib import Path


ROOT = Path("/home/ubuntu")
RECORDS_PATH = ROOT / "booklet_presentation_records.json"
OUT_PATH = ROOT / "booklet_reconciled_records.json"


def normalise(value: str) -> str:
    value = value.lower()
    value = value.replace("lclr", "low contrast low resistivity")
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def title_similarity(left: str, right: str) -> float:
    left_normalised = normalise(left)
    right_normalised = normalise(right)
    seq = SequenceMatcher(None, left_normalised, right_normalised).ratio()
    left_tokens = set(left_normalised.split())
    right_tokens = set(right_normalised.split())
    overlap = len(left_tokens & right_tokens) / max(1, len(left_tokens | right_tokens))
    return 0.7 * seq + 0.3 * overlap


SPECIAL_SESSION_TRACK = "العلوم الرياضية والحاسوبية"
BOOKLET_ONLY_TRACKS = {
    "Revolutionizing Subsurface Understanding: AI-Driven Logging-While-Drilling Technologies": "علوم الأرض وأنظمة الأرض",
}


def is_person_name(value: str) -> bool:
    value = value.strip()
    if not value:
        return False
    lower = value.lower()
    if any(term in lower for term in ("department", "faculty", "university", "institute", "centre", "center")):
        return False
    return bool(re.match(r"^(Major General|Prof\.|Assoc\.|Ass\.|Dr\.|Eng\.|Ms\.|Mr\.)", value, re.I)) or bool(
        re.match(r"^[A-Z][A-Za-z'’.-]+(?:\s+[A-Z][A-Za-z'’.-]+){1,5}$", value)
    )


def reconcile_records(booklet_records, program_rows):
    reconciled = []
    program = [
        {
            "day": day,
            "hall": hall,
            "track": track,
            "program_name": name,
            "program_title": title,
        }
        for day, hall, track, name, title in program_rows
    ]

    for record in booklet_records:
        matches = sorted(
            ((title_similarity(record["title"], item["program_title"]), item) for item in program),
            key=lambda item: item[0],
            reverse=True,
        )
        best_score, best_match = matches[0]

        # Pages 79–83 constitute the booklet's mathematical special session.
        if record["page"] >= 79:
            track = SPECIAL_SESSION_TRACK
            basis = "كتيب المؤتمر: قسم الملخصات الخاصة (الصفحات 79–83)"
            day = "08/04/2026"
            hall = "جلسة خاصة"
            match_score = None
        elif record["title"] in BOOKLET_ONLY_TRACKS:
            track = BOOKLET_ONLY_TRACKS[record["title"]]
            basis = "كتيب المؤتمر: عرض جيولوجي مستقل غير مفصل في البرنامج النهائي"
            day = "08/04/2026"
            hall = "غير محدد في البرنامج"
            match_score = None
        elif best_score >= 0.34:
            track = best_match["track"]
            basis = "مطابقة عنوان الكتيب مع البرنامج النهائي"
            day = best_match["day"]
            hall = f"قاعة {best_match['hall']}"
            match_score = round(best_score, 3)
        else:
            raise ValueError(
                f"Could not reconcile booklet record '{record['researcher']}' with a programme track; best score={best_score:.3f}"
            )

        researcher = record["researcher"]
        researcher_source = "كتيب المؤتمر"
        if not is_person_name(researcher) and match_score is not None:
            researcher = best_match["program_name"]
            researcher_source = "البرنامج النهائي؛ إذ لم يرد اسم الباحث بوضوح في الكتيب"

        reconciled.append(
            {
                **record,
                "researcher": researcher,
                "track": track,
                "date": day,
                "venue": hall,
                "track_basis": basis,
                "programme_match_score": match_score,
                "researcher_source": researcher_source,
            }
        )

    return reconciled


if __name__ == "__main__":
    import importlib.util

    script_path = Path(__file__).with_name("build_sci2026_report.py")
    spec = importlib.util.spec_from_file_location("report_generator", script_path)
    report_generator = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(report_generator)

    source_records = json.loads(RECORDS_PATH.read_text(encoding="utf-8"))
    output = reconcile_records(source_records, report_generator.PROGRAM_ROWS)
    OUT_PATH.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Reconciled {len(output)} booklet records to {OUT_PATH}")
    for row in output:
        print(f"p.{row['page']:02d} | {row['track']} | {row['researcher']} | {row['title']}")
